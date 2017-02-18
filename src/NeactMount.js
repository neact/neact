'use strict';
import {
    isVNode,
    isElementVNode,
    isTextVNode,
    isComponentVNode,
    isVoidVNode,
    cloneElement,
    createVoidVNode,
    createTextVNode
} from './NeactElement';

import CallbackQueue from './CallbackQueue';

import NeactCurrentOwner from './NeactCurrentOwner';

import {
    isString,
    isNull,
    isStringOrNumber,
    isArray,
    isInvalid,
    isUndefined,
    isStatefulComponent,
    isNullOrUndef,
    emptyObject,
    throwError
} from './NeactUtils';

import {
    documentCreateElement,
    appendChild
} from './NeactDOMUtils';

import {
    attachRef
} from './NeactRefs';

import createNeactComponent from './createNeactComponent';

import processElement from './processElement';

import {
    createDOMProperty
} from './processDOMProperty';

import {
    createDOMEvents
} from './processDOMEvents';

export function mount(vNode, parentDom, callback, context, isSVG) {
    const isUndefCallbacks = isNullOrUndef(callback);
    let r;
    callback = callback || new CallbackQueue();

    if (isElementVNode(vNode)) {
        r = mountElement(vNode, parentDom, callback, context, isSVG);
    } else if (isTextVNode(vNode)) {
        r = mountText(vNode, parentDom);
    } else if (isComponentVNode(vNode)) {
        r = mountComponent(vNode, parentDom, callback, context, isSVG);
    } else if (isVoidVNode(vNode)) {
        r = mountVoid(vNode, parentDom);
    } else {
        throwError('mount() expects a valid VNode, instead it received an object with the type "' + typeof vNode + '".');
    }

    if (isUndefCallbacks) {
        callback.notifyAll();
    }
    return r;
}

export function mountText(vNode, parentDom) {
    const dom = document.createTextNode(vNode.children);

    vNode.dom = dom;
    if (parentDom) {
        appendChild(parentDom, dom);
    }
    return dom;
}

export function mountVoid(vNode, parentDom) {
    const dom = document.createComment('emptyNode');

    vNode.dom = dom;
    if (parentDom) {
        appendChild(parentDom, dom);
    }
    return dom;
}

export function mountElement(vNode, parentDom, callback, context, isSVG) {
    const tag = vNode.type;

    if (!isSVG) {
        isSVG = vNode.isSVG;
    }

    const dom = documentCreateElement(tag, isSVG);
    const children = vNode.children;
    const props = vNode.props;
    const events = vNode.events;
    const hooks = vNode.hooks || {};

    if (!isNull(parentDom)) {
        appendChild(parentDom, dom);
    }

    vNode.dom = dom;

    if (!isNullOrUndef(hooks.beforeCreate)) {
        hooks.beforeCreate(vNode);
    }

    processElement(dom, vNode);

    createDOMProperty(props, isSVG, vNode);
    createDOMEvents(vNode);

    if (!isNull(children)) {
        if (isArray(children)) {
            mountArrayChildren(children, dom, callback, context, isSVG);
        } else if (isVNode(children)) {
            mount(children, dom, callback, context, isSVG);
        }
    }

    if (!isNull(vNode.ref)) {
        callback.enqueue(() => attachRef(vNode));
    }

    //if (!isNull(parentDom)) {
    //    appendChild(parentDom, dom);
    //}

    if (!isNullOrUndef(hooks.create)) {
        callback.enqueue(() => hooks.create(vNode));
    }
    return dom;
}

export function mountArrayChildren(children, dom, callback, context, isSVG) {
    for (let i = 0; i < children.length; i++) {
        let child = children[i];

        if (!isInvalid(child)) {
            mount(child, dom, callback, context, isSVG);
        }
    }
}

export function mountComponent(vNode, parentDom, callback, context, isSVG) {
    const type = vNode.type;
    const props = vNode.props;
    const hooks = vNode.hooks || {};
    const isClass = isStatefulComponent(type);
    let dom, children;

    if (isClass) {
        const inst = createNeactComponent(vNode, context, isSVG);
        vNode._instance = inst;

        inst._pendingSetState = true;

        if (inst.componentWillMount) {
            inst.componentWillMount();
            if (inst._pendingStateQueue) {
                inst.state = inst._processPendingState(inst.props, inst.context);
            }
        }

        inst._ignoreSetState = true;
        NeactCurrentOwner.current = inst;
        vNode.children = inst.render();
        NeactCurrentOwner.current = null;
        inst._ignoreSetState = false;
        normalizeComponentChildren(vNode);
        inst._vNode = vNode;
        inst._renderedVNode = vNode.children;
        inst._pendingSetState = false;

        vNode.dom = dom = mount(vNode.children, parentDom, callback, inst._childContext, isSVG);

        inst._callbacks = new CallbackQueue();

        if (!isNull(vNode.ref)) {
            callback.enqueue(() => attachRef(vNode));
        }

        if (inst.componentDidMount) {
            callback.enqueue(() => inst.componentDidMount());
        }

        if (!isNullOrUndef(hooks.create)) {
            callback.enqueue(() => hooks.create(vNode));
        }

        if (inst._pendingCallbacks) {
            callback.enqueue(() => inst._processPendingCallbacks());
        }

    } else {
        //Function Component
        if (!isNullOrUndef(props.onComponentWillMount)) {
            props.onComponentWillMount(vNode);
        }

        vNode.children = type(props, context);
        normalizeComponentChildren(vNode);
        vNode.dom = dom = mount(vNode.children, parentDom, callback, context, isSVG);

        //You may not use the ref attribute on functional components because they don't have instances
        //attachRef(vNode);

        if (!isNullOrUndef(props.onComponentDidMount)) {
            callback.enqueue(() => props.onComponentDidMount(vNode));
        }

        if (!isNullOrUndef(hooks.create)) {
            callback.enqueue(() => hooks.create(vNode));
        }
    }

    return dom;
}

export function normalizeComponentChildren(vNode) {
    let children = vNode.children;

    if (isArray(children)) {
        throwError('a valid Neact VNode (or null) must be returned from a component render. You may have returned an array or an invalid object.');
    } else if (isInvalid(children)) {
        vNode.children = createVoidVNode();
    } else if (isStringOrNumber(children)) {
        vNode.children = createTextVNode(children);
    }

    vNode.children.parentVNode = vNode;

    return vNode;
}