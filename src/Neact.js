'use strict';

import {
    render,
    findDOMNode,
    unmountComponentAtNode,
    _patch as patch
} from './NeactRender';

import processDOMPropertyHooks from './processDOMPropertyHooks';

import {
    createElement,
    createVNode,
    createTextVNode,
    cloneElement,
    isValidElement
} from './NeactElement';

import {
    createClass
} from './NeactClass';

import NeactComponent from './NeactComponent';
import NeactPureComponent from './NeactPureComponent';

import {
    isNullOrUndef,
    map,
    each,
    inherits,
    bind,
    assign,
    toArray,
    flatten,
    filter
} from './NeactUtils';

var utils = {
    map,
    each,
    inherits,
    bind,
    assign,
    toArray,
    flatten,
    filter
};

const Children = {
    map(obj, cb, ctx) {
        if (isNullOrUndef(obj)) return;
        return map(toArray(obj), cb, ctx);
    },
    forEach(obj, cb, ctx) {
        if (isNullOrUndef(obj)) return;
        each(toArray(obj), cb, ctx);
    },
    count(children) {
        return toArray(children).length;
    },
    only(children) {
        children = Children.toArray(children);
        if (children.length !== 1) { throw new Error('Children.only() expects only one child.'); }
        return children[0];
    },
    toArray
};

export {
    render,
    patch,
    findDOMNode,
    unmountComponentAtNode,
    Children,
    createElement,
    createVNode,
    createTextVNode,
    cloneElement,
    isValidElement,
    processDOMPropertyHooks,
    createClass,
    NeactComponent as Component,
    NeactPureComponent as PureComponent,
    utils
}