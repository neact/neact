'use strict';
import {
    isVNode,
    isElementVNode,
    isTextVNode,
    isComponentVNode,
    isVoidVNode
} from './NeactElement';

import {
    isNull,
    isNullOrUndef,
    isInvalid,
    isArray,
    isObject,
    isStatefulComponent
} from './NeactUtils';

import {
    detachRef
} from './NeactRefs';

import {
    removeChild
} from './NeactDOMUtils';

import {
    destroyDOMEvents
} from './processDOMEvents';

import CallbackQueue from './CallbackQueue';

export function unmount(vNode, parentDom, callback) {
    var isUndefCallbacks = isNullOrUndef(callback);
    callback = callback || new CallbackQueue();

    if (isElementVNode(vNode)) {
        unmountElement(vNode, parentDom, callback);
    } else if (isVoidVNode(vNode) || isTextVNode(vNode)) {
        unmountVoidOrText(vNode, parentDom);
    } else if (isComponentVNode(vNode)) {
        unmountComponent(vNode, parentDom, callback);
    }

    if (isUndefCallbacks) {
        callback.notifyAll();
    }
}

function unmountVoidOrText(vNode, parentDom) {
    if (parentDom) {
        removeChild(parentDom, vNode.dom);
    }
}

export function unmountElement(vNode, parentDom, callback) {
    const dom = vNode.dom;
    const events = vNode.events;
    const hooks = vNode.hooks || {};
    const children = vNode.children;

    if (!isNull(vNode.ref)) {
        detachRef(vNode);
    }

    destroyDOMEvents(vNode);

    if (parentDom) {
        removeChild(parentDom, dom);
    }

    if (!isNullOrUndef(children)) {
        unmountChildren(children, callback);
    }

    if (hooks.destroy) {
        hooks.destroy(vNode);
    }
}

function unmountChildren(children, callback) {
    if (isArray(children)) {
        for (let i = 0; i < children.length; i++) {
            const child = children[i];

            if (!isInvalid(child) && isVNode(child)) {
                unmount(child, null, callback, );
            }
        }
    } else if (isVNode(children)) {
        unmount(children, null, callback);
    }
}

export function unmountComponent(vNode, parentDom, callback) {
    const inst = vNode._instance;
    const isClass = isStatefulComponent(vNode.type);
    const children = vNode.children;
    const props = vNode.props;
    const hooks = vNode.hooks || {};
    const dom = vNode.dom;

    if (parentDom) {
        removeChild(parentDom, vNode.dom);
    }

    if (isClass) {
        if (!inst._unmounted) {
            inst._ignoreSetState = true;
            //TODO: beforeUnmount
            if (inst.componentWillUnmount) {
                inst.componentWillUnmount();
            }

            if (!isNull(vNode.ref)) {
                detachRef(vNode);
            }

            unmount(children, null, callback);

            inst._unmounted = true;
            inst._ignoreSetState = false;
        }
    } else {
        if (!isNullOrUndef(props.onComponentWillUnmount)) {
            props.onComponentWillUnmount(vNode);
        }

        unmount(children, null, callback);
    }

    if (hooks.destroy) {
        hooks.destroy(vNode);
    }
}