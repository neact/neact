'use strict';
import {
    warning,
    throwError,
    isDOM,
    assign,
    isVNode,
    isInvalid
} from './shared';

import {
    mount
} from './mount';

import {
    unmount
} from './unmount';

import {
    patch
} from './patch';

export function _patch(lastVNode, nextVNode) {
    if (!isInvalid(lastVNode)) {
        if (isDOM(lastVNode)) {
            render(nextVNode, lastVNode);
        } else if (isVNode(lastVNode) && isVNode(nextVNode)) {
            if (lastVNode.dom) {
                patch(lastVNode, nextVNode);
                if (lastVNode.parentVNode) {
                    assign(lastVNode, nextVNode);
                }
            } else {
                throwError('patch error vNode');
            }
        }

        return nextVNode;
    }
}

export function render(vNode, parentDom) {
    if (document.body === parentDom) {
        warning('you cannot render() to the "document.body". Use an empty element as a container instead.');
    }

    const lastVnode = parentDom.__NeactRootNode;

    if (!lastVnode) {
        if (!isInvalid(vNode) && isVNode(vNode)) {
            mount(vNode, parentDom, null, {});
            parentDom.__NeactRootNode = vNode;
            return vNode._instance || vNode.dom;
        } else {
            throwError('isInvalid VNode');
        }
    } else {
        if (isInvalid(vNode)) {
            unmount(lastVnode, parentDom);
            parentDom.__NeactRootNode = null;
            delete parentDom.__NeactRootNode;
        } else if (isVNode(vNode)) {
            patch(lastVnode, vNode);
            parentDom.__NeactRootNode = vNode;
            return vNode._instance || vNode.dom;
        } else {
            throwError('isInvalid VNode');
        }
    }
}

export function unmountComponentAtNode(dom) {
    if (dom.__NeactRootNode) {
        unmount(dom.__NeactRootNode, dom);
        delete dom.__NeactRootNode;
    }
}

export function findDOMNode(vNode) {
    if (!isInvalid(isVNode)) {
        if (isVNode(vNode)) {
            return vNode.dom;
        } else if (vNode._vNode) {
            return vNode._vNode.dom;
        }
    }
    return null;
}