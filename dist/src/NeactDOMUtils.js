'use strict';

exports.__esModule = true;
exports.appendChild = appendChild;
exports.insertBefore = insertBefore;
exports.nextSibling = nextSibling;
exports.removeChild = removeChild;
exports.documentCreateElement = documentCreateElement;
exports.setTextContent = setTextContent;
exports.updateTextContent = updateTextContent;
exports.replaceWithNewNode = replaceWithNewNode;
exports.replaceChild = replaceChild;
exports.addEventListener = addEventListener;
exports.removeEventListener = removeEventListener;

var _NeactUnmount = require('./NeactUnmount');

var _NeactMount = require('./NeactMount');

var svgNS = 'http://www.w3.org/2000/svg';

function appendChild(parentDom, dom) {
    parentDom.appendChild(dom);
}

function insertBefore(parentNode, newNode, referenceNode) {
    parentNode.insertBefore(newNode, referenceNode);
}

function nextSibling(node) {
    return node.nextSibling;
}

function removeChild(parentDom, dom) {
    parentDom.removeChild(dom);
}

function documentCreateElement(tag, isSVG) {
    if (isSVG === true) {
        return document.createElementNS(svgNS, tag);
    } else {
        return document.createElement(tag);
    }
}

function setTextContent(node, text) {
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

function updateTextContent(dom, text) {
    dom.firstChild.nodeValue = text;
}

function replaceWithNewNode(lastNode, nextNode, parentDom, callback, context, isSVG) {
    (0, _NeactUnmount.unmount)(lastNode, null);
    var dom = (0, _NeactMount.mount)(nextNode, null, callback, context, isSVG);

    nextNode.dom = dom;
    replaceChild(parentDom, dom, lastNode.dom);
}

function replaceChild(parentDom, nextDom, lastDom) {
    if (!parentDom) {
        parentDom = lastDom.parentNode;
    }
    parentDom.replaceChild(nextDom, lastDom);
}

function addEventListener(node, name, fn) {
    if (typeof node.addEventListener == "function") node.addEventListener(name, fn, false);else if (typeof node.attachEvent != "undefined") {
        var attachEventName = "on" + name;
        node.attachEvent(attachEventName, fn);
    }
}

function removeEventListener(node, name, fn) {
    if (typeof node.removeEventListener == "function") node.removeEventListener(name, fn, false);else if (typeof node.detachEvent != "undefined") {
        var attachEventName = "on" + name;
        node.detachEvent(attachEventName, fn);
    }
}