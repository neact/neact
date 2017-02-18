'use strict';

exports.__esModule = true;
exports.normalizeVNodes = normalizeVNodes;
exports.normalize = normalize;

var _NeactUtils = require('./NeactUtils');

var _NeactElement = require('./NeactElement');

function normalizeVNodes(nodes, parentVNode) {
    var newNodes = [];

    for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        if ((0, _NeactUtils.isInvalid)(n)) continue;
        if ((0, _NeactUtils.isStringOrNumber)(n)) {
            n = (0, _NeactElement.createTextVNode)(n);
        }

        n.parentVNode = parentVNode;

        newNodes.push(n);
    }

    return newNodes.length > 0 ? newNodes : null;
}

function normalizeChildren(children, parentVNode) {
    if ((0, _NeactUtils.isArray)(children)) {
        return normalizeVNodes(children, parentVNode);
    } else if ((0, _NeactUtils.isStringOrNumber)(children)) {
        children = (0, _NeactElement.createTextVNode)(children);
    }
    if ((0, _NeactElement.isVNode)(children)) {
        children.parentVNode = parentVNode;
    }
    return children;
}

function normalize(vNode) {
    var isComponent = (0, _NeactElement.isComponentVNode)(vNode);

    if (!(0, _NeactUtils.isInvalid)(vNode.children)) {
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