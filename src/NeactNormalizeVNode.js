'use strict';

import {
    isString,
    isStringOrNumber,
    isInvalid,
    isArray,
    isNull
} from './NeactUtils';

import {
    createTextVNode,
    isVNode,
    isElementVNode,
    isComponentVNode
} from './NeactElement';


export function normalizeVNodes(nodes, parentVNode) {
    let newNodes = [];

    for (let i = 0; i < nodes.length; i++) {
        let n = nodes[i];
        if (isInvalid(n)) continue;
        if (isStringOrNumber(n)) {
            n = createTextVNode(n);
        }

        n.parentVNode = parentVNode;

        newNodes.push(n);
    }

    return newNodes.length > 0 ? newNodes : null;
}

function normalizeChildren(children, parentVNode) {
    if (isArray(children)) {
        return normalizeVNodes(children, parentVNode);
    } else if (isStringOrNumber(children)) {
        children = createTextVNode(children)
    }
    if (isVNode(children)) {
        children.parentVNode = parentVNode;
    }
    return children;
}

export function normalize(vNode) {
    const isComponent = isComponentVNode(vNode);

    if (!isInvalid(vNode.children)) {
        vNode.children = normalizeChildren(vNode.children, isComponent ? null : vNode);
    }

    if (isComponent) {
        if (!vNode.props) {
            vNode.props = {};
        }
        vNode.props.children = vNode.children;
        vNode.children = null;
    }
}