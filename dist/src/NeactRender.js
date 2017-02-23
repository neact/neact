'use strict';

exports.__esModule = true;
exports._patch = _patch;
exports.render = render;
exports.unmountComponentAtNode = unmountComponentAtNode;
exports.findDOMNode = findDOMNode;

var _NeactUtils = require('./NeactUtils');

var _NeactMount = require('./NeactMount');

var _NeactUnmount = require('./NeactUnmount');

var _NeactElement = require('./NeactElement');

var _patch2 = require('./patch');

function _patch(lastVNode, nextVNode) {
    if (!(0, _NeactUtils.isInvalid)(lastVNode)) {
        if ((0, _NeactUtils.isDOM)(lastVNode)) {
            render(nextVNode, vNode);
        } else if ((0, _NeactElement.isVNode)(lastVNode) && (0, _NeactElement.isVNode)(nextVNode)) {
            if (lastVNode.dom) {
                (0, _patch2.patch)(lastVNode, nextVNode);
                if (lastVNode.parentVNode) {
                    (0, _NeactUtils.assign)(lastVNode, nextVNode);
                }
            } else {
                (0, _NeactUtils.throwError)('patch error vNode');
            }
        }

        return nextVNode;
    }
}

function render(vNode, parentDom) {
    if (document.body === parentDom) {
        (0, _NeactUtils.warning)('you cannot render() to the "document.body". Use an empty element as a container instead.');
    }

    var lastVnode = parentDom.__NeactRootNode;

    if (!lastVnode) {
        if (!(0, _NeactUtils.isInvalid)(vNode) && (0, _NeactElement.isVNode)(vNode)) {
            (0, _NeactMount.mount)(vNode, parentDom);
            parentDom.__NeactRootNode = vNode;
            return vNode._instance || vNode.dom;
        } else {
            (0, _NeactUtils.throwError)('isInvalid VNode');
        }
    } else {
        if ((0, _NeactUtils.isInvalid)(vNode)) {
            (0, _NeactUnmount.unmount)(lastVnode, parentDom);
            parentDom.__NeactRootNode = null;
            delete parentDom.__NeactRootNode;
        } else if ((0, _NeactElement.isVNode)(vNode)) {
            (0, _patch2.patch)(lastVnode, vNode);
            parentDom.__NeactRootNode = vNode;
            return vNode._instance || vNode.dom;
        } else {
            (0, _NeactUtils.throwError)('isInvalid VNode');
        }
    }
}

function unmountComponentAtNode(dom) {
    if (dom.__NeactRootNode) {
        (0, _NeactUnmount.unmount)(dom.__NeactRootNode, dom);
        delete dom.__NeactRootNode;
    }
}

function findDOMNode(vNode) {
    if (!(0, _NeactUtils.isInvalid)(_NeactElement.isVNode)) {
        if ((0, _NeactElement.isVNode)(vNode)) {
            return vNode.dom;
        } else if (vNode._vNode) {
            return vNode._vNode.dom;
        }
    }
    return null;
}