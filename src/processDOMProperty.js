'use strict';
import {
    addEventListener,
    removeEventListener
} from './domUtils';

import {
    isUndefined,
    isNullOrUndef,
    isFunction,
    emptyObject,
    assign
} from './shared';

import {
    strictProps,
    booleanProps,
    namespaces,
    skipProps,
    probablyKebabProps,
    dehyphenProps,
    kebabize
} from './constants';

import updateDOMStyle from './processDOMStyle';

export function createDOMProperty(props, isSVG, vNode) {
    processDOMProperty(null, props, isSVG, vNode);
}

export function processDOMProperty(lastProps, nextProps, isSVG, vNode) {
    if (lastProps === nextProps) {
        return;
    }

    const dom = vNode.dom;

    lastProps = lastProps || emptyObject;
    nextProps = nextProps || emptyObject;

    if (nextProps !== emptyObject) {
        for (let prop in nextProps) {
            const nextValue = isNullOrUndef(nextProps[prop]) ? null : nextProps[prop];
            const lastValue = isNullOrUndef(lastProps[prop]) ? null : lastProps[prop];
            updateDOMProperty(lastValue, nextValue, prop, isSVG, dom, vNode);
        }
    }
    if (lastProps !== emptyObject) {
        for (let prop in lastProps) {
            if (isNullOrUndef(nextProps[prop])) {
                const lastValue = isNullOrUndef(lastProps[prop]) ? null : lastProps[prop];
                updateDOMProperty(lastValue, null, prop, isSVG, dom, vNode);
            }
        }
    }
}

export function updateDOMProperty(lastValue, nextValue, prop, isSVG, dom, vNode) {
    if (skipProps[prop]) {
        return;
    }

    if (prop === 'className') { prop = 'class'; }

    if (booleanProps[prop]) {
        dom[prop] = nextValue ? true : false;
    } else if (name === 'class' && !isSVG) {
        dom.className = nextValue || '';
    } else if (strictProps[prop]) {
        const value = isNullOrUndef(nextValue) ? '' : nextValue;

        if (dom[prop] !== value) {
            dom[prop] = value;
        }
    } else if (lastValue !== nextValue) {
        if (isNullOrUndef(nextValue)) {
            dom.removeAttribute(prop);
        } else if (prop === 'style') {
            updateDOMStyle(lastValue, nextValue, dom);
        } else if (prop === 'dangerouslySetInnerHTML') {
            const lastHtml = lastValue && lastValue.__html;
            const nextHtml = nextValue && nextValue.__html;

            if (lastHtml !== nextHtml) {
                if (!isNullOrUndef(nextHtml)) {
                    dom.innerHTML = nextHtml;
                }
            }
        } else {
            let dehyphenProp;
            if (dehyphenProps[prop]) {
                dehyphenProp = dehyphenProps[prop];
            } else if (isSVG && prop.match(probablyKebabProps)) {
                dehyphenProp = prop.replace(/([a-z])([A-Z]|1)/g, kebabize);
                dehyphenProps[prop] = dehyphenProp;
            } else {
                dehyphenProp = prop;
            }
            const ns = namespaces[prop];

            if (ns) {
                dom.setAttributeNS(ns, dehyphenProp, nextValue);
            } else {
                dom.setAttribute(dehyphenProp, nextValue);
            }
        }
    }
}