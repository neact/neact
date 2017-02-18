'use strict';

export function shouldUpdateRefs(lastVNode, nextVNode) {
    const lastRef = lastVNode.ref;
    const nextRef = nextVNode.ref;
    const lastOwner = lastVNode._owner;
    const nextOwner = nextVNode._owner;
    return lastRef !== nextRef ||
        typeof nextRef === 'string' && nextOwner !== lastOwner;
}

export function detachRef(vNode) {
    var ref = vNode.ref;
    var owner = vNode._owner;

    if (typeof ref === 'function') {
        ref(null);
    } else if (ref && owner) {
        delete owner.refs[ref];
    }
}

export function attachRef(vNode) {
    var ref = vNode.ref;
    var owner = vNode._owner;
    var target = vNode._instance || vNode.dom;

    if (typeof ref === 'function') {
        ref(target);
    } else if (ref && owner) {
        owner.refs[ref] = target;
    }
}