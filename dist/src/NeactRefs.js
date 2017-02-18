'use strict';

exports.__esModule = true;
exports.shouldUpdateRefs = shouldUpdateRefs;
exports.detachRef = detachRef;
exports.attachRef = attachRef;
function shouldUpdateRefs(lastVNode, nextVNode) {
    var lastRef = lastVNode.ref;
    var nextRef = nextVNode.ref;
    var lastOwner = lastVNode._owner;
    var nextOwner = nextVNode._owner;
    return lastRef !== nextRef || typeof nextRef === 'string' && nextOwner !== lastOwner;
}

function detachRef(vNode) {
    var ref = vNode.ref;
    var owner = vNode._owner;

    if (typeof ref === 'function') {
        ref(null);
    } else if (ref && owner) {
        delete owner.refs[ref];
    }
}

function attachRef(vNode) {
    var ref = vNode.ref;
    var owner = vNode._owner;
    var target = vNode._instance || vNode.dom;

    if (typeof ref === 'function') {
        ref(target);
    } else if (ref && owner) {
        owner.refs[ref] = target;
    }
}