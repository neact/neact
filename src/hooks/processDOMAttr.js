'use strict';
import {
    isNullOrUndef
} from '../shared';

import {
    strictProps,
    booleanProps,
    namespaces,
    skipProps,
    probablyKebabProps,
    dehyphenProps,
    kebabize
} from './constants';

export default function(lastValue, nextValue, prop, isSVG, dom, vNode) {
    if (lastValue === nextValue) { return; }
    if (skipProps[prop]) {
        return;
    }
    if (booleanProps[prop]) {
        dom[prop] = nextValue ? true : false;
    } else if (strictProps[prop]) {
        const value = isNullOrUndef(nextValue) ? '' : nextValue;

        if (dom[prop] !== value) {
            dom[prop] = value;
        }
    } else {
        if (isNullOrUndef(nextValue) && prop !== 'dangerouslySetInnerHTML') {
            dom.removeAttribute(prop);
        } else if (prop === 'htmlFor') {
            dom.setAttribute('for', nextValue);
        } else if (prop === 'className') {
            if (isSVG) {
                dom.setAttribute('class', nextValue);
            } else {
                dom.className = nextValue;
            }
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