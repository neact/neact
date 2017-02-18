'use strict';
import { unmount } from './NeactUnmount';
import { mount } from './NeactMount';

const svgNS = 'http://www.w3.org/2000/svg';

export function appendChild(parentDom, dom) {
    parentDom.appendChild(dom);
}

export function insertBefore(parentNode, newNode, referenceNode) {
    parentNode.insertBefore(newNode, referenceNode);
}

export function nextSibling(node) {
    return node.nextSibling;
}

export function removeChild(parentDom, dom) {
    parentDom.removeChild(dom);
}

export function documentCreateElement(tag, isSVG) {
    if (isSVG === true) {
        return document.createElementNS(svgNS, tag);
    } else {
        return document.createElement(tag);
    }
}

export function setTextContent(node, text) {
    if (node.nodeType === 3) {
        node.data = text;
    } else {
        if ('textContent' in node) {
            node.textContent = text;
        } else {
            node.innerText = text;
        }
    }
}

export function updateTextContent(dom, text) {
    dom.firstChild.nodeValue = text;
}

export function replaceWithNewNode(lastNode, nextNode, parentDom, callback, context, isSVG) {
    unmount(lastNode, null);
    const dom = mount(nextNode, null, callback, context, isSVG);

    nextNode.dom = dom;
    replaceChild(parentDom, dom, lastNode.dom);
}

export function replaceChild(parentDom, nextDom, lastDom) {
    if (!parentDom) {
        parentDom = lastDom.parentNode;
    }
    parentDom.replaceChild(nextDom, lastDom);
}

export function addEventListener(node, name, fn) {
    if (typeof node.addEventListener == "function")
        node.addEventListener(name, fn, false);
    else if (typeof node.attachEvent != "undefined") {
        var attachEventName = "on" + name;
        node.attachEvent(attachEventName, fn);
    }
}

export function removeEventListener(node, name, fn) {
    if (typeof node.removeEventListener == "function")
        node.removeEventListener(name, fn, false);
    else if (typeof node.detachEvent != "undefined") {
        var attachEventName = "on" + name;
        node.detachEvent(attachEventName, fn);
    }
}