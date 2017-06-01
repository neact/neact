'use strict';
import {
    isArray,
    isInvalid,
    isStringOrNumber,
    isComponentVNode,
    isVNode
} from './shared';

export function createEmptyVNode() {
    return createVNode('#comment', null, null, null, null, null, null, false, null, true);
}

export const createVoidVNode = createEmptyVNode;

export const emptyVNode = createEmptyVNode();

export function createTextVNode(text) {
    return createVNode('#text', null, text, null, null, null, null, false, null, true);
}

export function createVNode(
    type,
    props,
    children,
    events,
    hooks,
    ref,
    key,
    isSVG,
    owner,
    noNormalise = false
) {
    var vNode = {
        $$isVNode: true,
        type: type,
        key: key === undefined ? null : key,
        ref: ref === undefined ? null : ref,
        props: props === undefined ? null : props,
        isSVG: isSVG === undefined ? null : isSVG,
        children: children === undefined ? null : children,
        parentVNode: null,
        events: events || null,
        hooks: hooks || null,
        dom: null,
        _owner: owner || null
    };

    if (!noNormalise) {
        normalize(vNode);
    }

    return vNode;
}

function normalize(vNode) {
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

function normalizeChildren(children, parentVNode) {
    if (isArray(children)) {
        return normalizeVNodes(children, parentVNode);
    } else if (isStringOrNumber(children)) {
        children = createTextVNode(children);
    }
    if (isVNode(children)) {
        children.parentVNode = parentVNode;
    }
    return children;
}

function normalizeVNodes(nodes, parentVNode) {
    let newNodes = [];

    for (let i = 0; i < nodes.length; i++) {
        let n = nodes[i];
        if (isInvalid(n)) { continue; }
        if (isStringOrNumber(n)) {
            n = createTextVNode(n);
        }

        n.parentVNode = parentVNode;

        newNodes.push(n);
    }

    return newNodes.length > 0 ? newNodes : null;
}