'use strict';
import {
    addEventListener,
    removeEventListener
} from './domUtils';

import {
    emptyVNode
} from './vnode';

import {
    isObject
} from './shared';

function ename(s) {
    return s.replace('on', '');
}

function invokeHandler(handler, vnode, event) {
    var el = vnode.dom;
    if (typeof handler === "function") {
        // call function handler
        handler.call(el, event, vnode);
    } else if (isObject(handler)) {
        // call handler with arguments
        if (typeof handler[0] === "function") {
            // special case for single argument for performance
            if (handler.length === 2) {
                handler[0].call(el, handler[1], event, vnode);
            } else {
                var args = handler.slice(1);
                args.push(event);
                args.push(vnode);
                handler[0].apply(el, args);
            }
        } else {
            // call multiple handlers
            for (var i = 0; i < handler.length; i++) {
                invokeHandler(handler[i], vnode, event);
            }
        }
    }
}

function handleEvent(event, vnode) {
    var name = 'on' + event.type,
        on = vnode.events;

    // call event handler(s) if exists
    if (on && on[name]) {
        invokeHandler(on[name], vnode, event);
    }
}

function createListener() {
    function handler(e) {
        e = e || event;
        handleEvent(e, handler.vnode);
    }
    return handler;
}

export function createDOMEvents(vNode) {
    updateDOMEvents(emptyVNode, vNode);
}

export function updateDOMEvents(oldVnode, vnode) {
    var oldOn = oldVnode.events,
        oldListener = oldVnode._listener,
        oldElm = oldVnode.dom,
        on = vnode && vnode.events,
        elm = vnode && vnode.dom,
        name;

    // optimization for reused immutable handlers
    if (oldOn === on) {
        return;
    }

    // remove existing listeners which no longer used
    if (oldOn && oldListener) {
        // if element changed or deleted we remove all existing listeners unconditionally
        if (!on) {
            for (name in oldOn) {
                // remove listener if element was changed or existing listeners removed
                removeEventListener(oldElm, ename(name), oldListener);
            }
        } else {
            for (name in oldOn) {
                // remove listener if existing listener removed
                if (!on[name]) {
                    removeEventListener(oldElm, ename(name), oldListener);
                }
            }
        }
    }

    // add new listeners which has not already attached
    if (on) {
        // reuse existing listener or create new
        var listener = vnode._listener = oldVnode._listener || createListener();
        // update vnode for listener
        listener.vnode = vnode;

        // if element changed or added we add all needed listeners unconditionally
        if (!oldOn) {
            for (name in on) {
                // add listener if element was changed or new listeners added
                addEventListener(elm, ename(name), listener);
            }
        } else {
            for (name in on) {
                // add listener if new listener added
                if (!oldOn[name]) {
                    addEventListener(elm, ename(name), listener);
                }
            }
        }
    }
}

export function destroyDOMEvents(vNode) {
    updateDOMEvents(vNode, emptyVNode);
}