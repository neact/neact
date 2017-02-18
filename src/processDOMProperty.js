'use strict';
import {
    addEventListener,
    removeEventListener
} from './NeactDOMUtils';

import {
    isUndefined,
    isNullOrUndef,
    isFunction,
    emptyObject,
    assign
} from './NeactUtils';

import processDOMPropertyHooks from './processDOMPropertyHooks';

import processDOMStyle from './hooks/processDOMStyle';
import processDOMAttr from './hooks/processDOMAttr';

const propertyHooks = assign({
    style: processDOMStyle,
    __default__: processDOMAttr
}, processDOMPropertyHooks);

export function createDOMProperty(props, isSVG, vNode) {
    updateDOMProperty(null, props, isSVG, vNode);
}

export function updateDOMProperty(lastProps, nextProps, isSVG, vNode) {
    if (lastProps === nextProps) {
        return;
    }

    const dom = vNode.dom;

    lastProps = lastProps || emptyObject;
    nextProps = nextProps || emptyObject;

    if (nextProps !== emptyObject) {
        for (let prop in nextProps) {
            // do not add a hasOwnProperty check here, it affects performance
            //if (!nextProps.hasOwnProperty(prop)) continue;
            const nextValue = isNullOrUndef(nextProps[prop]) ? null : nextProps[prop];
            const lastValue = isNullOrUndef(lastProps[prop]) ? null : lastProps[prop];
            const hook = propertyHooks[prop] ? prop : '__default__';
            propertyHooks[hook](lastValue, nextValue, prop, isSVG, dom, vNode);
        }
    }
    if (lastProps !== emptyObject) {
        for (let prop in lastProps) {
            if (isNullOrUndef(nextProps[prop])) { //lastProps.hasOwnProperty(prop) && 
                const lastValue = isNullOrUndef(lastProps[prop]) ? null : lastProps[prop];
                const hook = propertyHooks[prop] ? prop : '__default__';
                propertyHooks[hook](lastValue, null, prop, isSVG, dom, vNode);
            }
        }
    }
}