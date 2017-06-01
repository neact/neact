'use strict';

import {
    render,
    findDOMNode,
    unmountComponentAtNode,
    _patch as patch
} from './render';

import processDOMPropertyHooks from './processDOMPropertyHooks';

import {
    createVNode,
    createTextVNode
} from './vnode';

import {
    createElement,
    cloneElement
} from './createElement';

import {
    createClass
} from './createClass';

import Component from './component';
import PureComponent from './pureComponent';

import {
    isVNode as isValidElement,
    isNullOrUndef,
    map,
    each,
    inherits,
    bind,
    assign,
    toArray,
    flatten,
    filter
} from './shared';

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
    Component,
    PureComponent,
    utils
};