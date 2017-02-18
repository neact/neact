'use strict';

exports.__esModule = true;
exports['default'] = NeactComponent;

var _NeactUtils = require('./NeactUtils');

var _NeactCurrentOwner = require('./NeactCurrentOwner');

var _NeactCurrentOwner2 = _interopRequireDefault(_NeactCurrentOwner);

var _patch = require('./patch');

var _NeactMount = require('./NeactMount');

var _shallowEqual = require('./shallowEqual');

var _shallowEqual2 = _interopRequireDefault(_shallowEqual);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function updateParentComponentVNodes(vNode, dom) {
    var parentVNode = vNode.parentVNode;

    if (parentVNode && !(0, _NeactUtils.isString)(parentVNode.type)) {
        parentVNode.dom = dom;
        updateParentComponentVNodes(parentVNode, dom);
    }
}

function enqueueSetState(component, newState, callback) {
    var sync = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    if (!(0, _NeactUtils.isNullOrUndef)(newState)) {
        var queue = component._pendingStateQueue || (component._pendingStateQueue = []);
        queue.push(newState);
    }

    if (callback) {
        var _queue = component._pendingCallbacks || (component._pendingCallbacks = []);
        _queue.push(callback);
    }

    if (!component._pendingSetState || sync) {
        applyState(component, false, callback);
    }
}

function applyState(inst, callback) {
    var vNode = inst._vNode;
    var parentDom = vNode.dom.parentNode;
    var hooks = vNode.hooks || {};
    var state = inst.state;
    var lastChildren = vNode.children;
    var props = inst.props;
    var context = inst.context;
    var childContext = inst.getChildContext();
    var nextChildren = void 0,
        shouldUpdate = false;

    nextChildren = inst._updateComponent(props, props, context);

    if (nextChildren !== _NeactUtils.emptyObject) {
        vNode.children = nextChildren;
        (0, _NeactMount.normalizeComponentChildren)(vNode);
        nextChildren = vNode.children;
        shouldUpdate = true;
    }

    if (shouldUpdate) {

        if (hooks.beforeUpdate) {
            hooks.beforeUpdate(vNode, vNode);
        }

        if (!(0, _NeactUtils.isNullOrUndef)(childContext)) {
            childContext = (0, _NeactUtils.assign)({}, context, inst._childContext, childContext);
        } else {
            childContext = (0, _NeactUtils.assign)({}, context, inst._childContext);
        }

        var callbacks = inst._callbacks;

        (0, _patch.patch)(lastChildren, nextChildren, parentDom, callbacks, childContext, inst._isSVG);

        var dom = vNode.dom = nextChildren.dom;

        updateParentComponentVNodes(vNode, dom);

        callbacks.notifyAll();

        if (inst.componentDidUpdate) {
            inst.componentDidUpdate(props, state);
        }

        if (!(0, _NeactUtils.isNullOrUndef)(hooks.update)) {
            hooks.update(vNode);
        }
    }

    if (inst._pendingCallbacks) {
        inst._processPendingCallbacks();
    }

    if ((0, _NeactUtils.isFunction)(callback)) {
        callback();
    }
}

function NeactComponent(props, context) {
    this.state = {};
    this.refs = {};
    this.props = props || {};
    this.context = context || {};
};

(0, _NeactUtils.assign)(NeactComponent.prototype, {
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
    _renderedVNode: null,

    render: function () {},
    forceUpdate: function (callback) {
        if (this._unmounted) {
            return;
        }
        this._pendingForceUpdate = true;

        enqueueSetState(this, null, callback);
    },
    setState: function (newState, callback) {
        if (this._unmounted) {
            return;
        }
        if (!this._disabledSetState) {
            if (!this._ignoreSetState) {
                enqueueSetState(this, newState, callback);
            } else {
                (0, _NeactUtils.warning)('ignore update state via setState(...) in shouldComponentUpdate() or render().');
            }
        } else {
            (0, _NeactUtils.throwError)('cannot update state via setState(...) in componentWillUpdate().');
        }
    },
    replaceState: function (newState, callback) {
        if (this._unmounted) {
            return;
        }
        this._pendingReplaceState = true;
        this.setState(newState, callback);
    },
    setStateSync: function () {
        if (this._unmounted) {
            return;
        }
        if (!this._disabledSetState) {
            if (!this._ignoreSetState) {
                enqueueSetState(this, newState, callback, true);
            } else {
                (0, _NeactUtils.warning)('ignore update state via setState(...) in shouldComponentUpdate() or render().');
            }
        } else {
            (0, _NeactUtils.throwError)('cannot update state via setState(...) in componentWillUpdate().');
        }
    },
    getChildContext: function () {},
    _updateComponent: function (prevProps, nextProps, context) {
        var inst = this;
        if (this._unmounted === true) {
            (0, _NeactUtils.throwError)();
        }

        var willReceive = false;
        var children = _NeactUtils.emptyObject;
        var shouldUpdate = true;

        if (prevProps !== nextProps) {
            willReceive = true;
        }

        if (willReceive && inst.componentWillReceiveProps) {
            inst._pendingSetState = true;
            inst.componentWillReceiveProps(nextProps, context);
            inst._pendingSetState = false;
        }

        var prevState = inst.state;
        var nextState = inst._processPendingState(nextProps, context);

        inst._ignoreSetState = true;

        if (!inst._pendingForceUpdate) {
            if (inst.shouldComponentUpdate) {
                shouldUpdate = inst.shouldComponentUpdate(nextProps, nextState, context);
            } else {
                if (inst._isPureNeactComponent) {
                    shouldUpdate = !(0, _shallowEqual2['default'])(prevProps, nextProps) || !(0, _shallowEqual2['default'])(inst.state, nextState);
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
            _NeactCurrentOwner2['default'].current = inst;
            children = inst.render();
            _NeactCurrentOwner2['default'].current = null;
        }

        inst._ignoreSetState = false;

        return children;
    },
    _processPendingState: function (props, context) {
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

        var nextState = (0, _NeactUtils.assign)({}, replace ? queue[0] : inst.state);
        for (var i = replace ? 1 : 0; i < queue.length; i++) {
            var partial = queue[i];
            (0, _NeactUtils.assign)(nextState, typeof partial === 'function' ? partial.call(inst, nextState, props, context) : partial);
        }

        return nextState;
    },
    _processPendingCallbacks: function () {
        var callbacks = this._pendingCallbacks;
        this._pendingCallbacks = null;
        if (callbacks) {
            for (var j = 0; j < callbacks.length; j++) {
                var cb = callbacks[j];
                if (typeof cb === 'function') {
                    cb.call(this);
                }
            }
        }
    }
});