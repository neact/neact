'use strict';

import {
    isFunction,
    isNullOrUndef,
    isString,
    assign,
    throwError,
    warning,
    emptyObject
} from './shared';

import CurrentOwner from './currentOwner';

import {
    patch
} from './patch';

import {
    normalizeComponentChildren
} from './mount';

import shallowEqual from './shallowEqual';

function updateParentComponentVNodes(vNode, dom) {
    const parentVNode = vNode.parentVNode;

    if (parentVNode && !isString(parentVNode.type)) {
        parentVNode.dom = dom;
        updateParentComponentVNodes(parentVNode, dom);
    }
}

function enqueueSetState(component, newState, callback, sync = false) {
    if (!isNullOrUndef(newState)) {
        let queue = component._pendingStateQueue || (component._pendingStateQueue = []);
        queue.push(newState);
    }

    if (callback) {
        let queue = component._pendingCallbacks || (component._pendingCallbacks = []);
        queue.push(callback);
    }

    if (!component._pendingSetState || sync) {
        applyState(component, false, callback);
    }
}

function applyState(inst, callback) {
    const vNode = inst._vNode;
    const parentDom = vNode.dom.parentNode;
    const hooks = vNode.hooks || {};
    const state = inst.state;
    const lastChildren = vNode.children;
    const props = inst.props;
    const context = inst.context;
    let childContext = inst.getChildContext();
    let nextChildren, shouldUpdate = false;

    nextChildren = inst._updateComponent(props, props, context);

    if (nextChildren !== emptyObject) {
        vNode.children = nextChildren;
        normalizeComponentChildren(vNode);
        nextChildren = vNode.children;
        shouldUpdate = true;
    }

    if (shouldUpdate) {

        if (hooks.beforeUpdate) {
            hooks.beforeUpdate(vNode, vNode);
        }

        if (!isNullOrUndef(childContext)) {
            childContext = assign({}, context, inst._childContext, childContext);
        } else {
            childContext = assign({}, context, inst._childContext);
        }

        let callbacks = inst._callbacks;

        patch(lastChildren, nextChildren, parentDom, callbacks, childContext, inst._isSVG);

        const dom = vNode.dom = nextChildren.dom;

        updateParentComponentVNodes(vNode, dom);

        callbacks.notifyAll();

        if (inst.componentDidUpdate) {
            inst.componentDidUpdate(props, state);
        }

        if (!isNullOrUndef(hooks.update)) {
            hooks.update(vNode);
        }
    }

    if (inst._pendingCallbacks) {
        inst._processPendingCallbacks();
    }

    if (isFunction(callback)) {
        callback();
    }
}

export default function Component(props, context) {
    this.state = {};
    this.refs = {};
    this.props = props || {};
    this.context = context || {};
}

assign(Component.prototype, {
    _vNode: null,
    _unmounted: true,
    _callbacks: null,
    _isSVG: false,
    _childContext: null,
    _pendingStateQueue: null,
    _pendingCallbacks: null,
    _pendingReplaceState: false,
    _pendingForceUpdate: false,
    _pendingSetState: false,
    _disabledSetState: false,
    _ignoreSetState: false,
    //_renderedVNode: null,

    render() {},

    forceUpdate(callback) {
        if (this._unmounted) {
            return;
        }
        this._pendingForceUpdate = true;

        enqueueSetState(this, null, callback);
    },

    setState(newState, callback) {
        if (this._unmounted) {
            return;
        }
        if (!this._disabledSetState) {
            if (!this._ignoreSetState) {
                enqueueSetState(this, newState, callback);
            } else {
                warning('ignore update state via setState(...) in shouldComponentUpdate() or render().');
            }
        } else {
            throwError('cannot update state via setState(...) in componentWillUpdate().');
        }
    },

    replaceState(newState, callback) {
        if (this._unmounted) {
            return;
        }
        this._pendingReplaceState = true;
        this.setState(newState, callback);
    },

    setStateSync(newState, callback) {
        if (this._unmounted) {
            return;
        }
        if (!this._disabledSetState) {
            if (!this._ignoreSetState) {
                enqueueSetState(this, newState, callback, true);
            } else {
                warning('ignore update state via setState(...) in shouldComponentUpdate() or render().');
            }
        } else {
            throwError('cannot update state via setState(...) in componentWillUpdate().');
        }
    },

    getChildContext() {},

    _updateComponent(prevProps, nextProps, context) {
        const inst = this;
        if (this._unmounted === true) {
            throwError();
        }

        let willReceive = false;
        let children = emptyObject;
        let shouldUpdate = true;

        if (prevProps !== nextProps) {
            willReceive = true;
        }

        if (willReceive && inst.componentWillReceiveProps) {
            inst._pendingSetState = true;
            inst.componentWillReceiveProps(nextProps, context);
            inst._pendingSetState = false;
        }

        let prevState = inst.state;
        let nextState = inst._processPendingState(nextProps, context);

        inst._ignoreSetState = true;

        if (!inst._pendingForceUpdate) {
            if (inst.shouldComponentUpdate) {
                shouldUpdate = inst.shouldComponentUpdate(nextProps, nextState, context);
            } else {
                if (inst._isPureComponent) {
                    shouldUpdate = !shallowEqual(prevProps, nextProps) || !shallowEqual(inst.state, nextState);
                }
            }
        }

        if (shouldUpdate !== false) {
            inst._pendingForceUpdate = false;

            if (inst.componentWillUpdate) {
                inst._disabledSetState = true;
                inst.componentWillUpdate(nextProps, nextState, context);
                inst._disabledSetState = false;
            }
            inst.props = nextProps;
            inst.state = nextState;
            inst.context = context;
            CurrentOwner.current = inst;
            children = inst.render(inst.props, inst.state, inst.context);
            CurrentOwner.current = null;
        }

        inst._ignoreSetState = false;

        return children;
    },

    _processPendingState(props, context) {
        var inst = this;
        var queue = this._pendingStateQueue;
        var replace = this._pendingReplaceState;
        this._pendingReplaceState = false;
        this._pendingStateQueue = null;

        if (!queue) {
            return inst.state;
        }

        if (replace && queue.length === 1) {
            return queue[0];
        }

        var nextState = assign({}, replace ? queue[0] : inst.state);
        for (var i = replace ? 1 : 0; i < queue.length; i++) {
            var partial = queue[i];
            assign(nextState, typeof partial === 'function' ? partial.call(inst, nextState, props, context) : partial);
        }

        return nextState;
    },
    _processPendingCallbacks() {
        const callbacks = this._pendingCallbacks;
        this._pendingCallbacks = null;
        if (callbacks) {
            for (let j = 0; j < callbacks.length; j++) {
                let cb = callbacks[j];
                if (typeof cb === 'function') {
                    cb.call(this);
                }
            }
        }
    }
});