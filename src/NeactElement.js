'use strict';

import {
    isNull,
    isArray,
    isString,
    isFunction,
    isInvalid,
    isObject,
    isAttrAnEvent,
    isNullOrUndef,
    flatten,
    assign,
    throwError
} from './NeactUtils';

import {
    ieVersion,
    isIE
} from './support';

import NeactCurrentOwner from './NeactCurrentOwner';

import {
    normalize
} from './NeactNormalizeVNode';

var hasOwnProperty = Object.prototype.hasOwnProperty;

export function isVNode(VNode) {
    return VNode && isObject(VNode) && VNode.$$isVNode;
}

export var isValidElement = isVNode;

export function isSameVNode(vnode1, vnode2) {
    var isSame = vnode1.key === vnode2.key && vnode1.type === vnode2.type;
    if (isSame && isIE && ieVersion < 9 && vnode1.dom.tagName.toLowerCase() === 'input') {
        isSame = vnode1.props.type === vnode2.props.type;
    }
    return isSame;
}

export function isVoidVNode(vNode) {
    return vNode.type === '#comment';
}

export function isTextVNode(vNode) {
    return vNode.type === '#text';
}

export function isElementVNode(vNode) {
    return isString(vNode.type) && vNode.type[0] !== '#';
}

export function isComponentVNode(vNode) {
    return !isString(vNode.type); // && isFunction(vNode.type)
}

export function createVNode(
    type,
    props,
    children,
    events,
    hooks,
    ref,
    key,
    isSVG,
    owner,
    noNormalise = false
) {
    var vNode = {
        $$isVNode: true,
        type: type,
        key: key === undefined ? null : key,
        ref: ref === undefined ? null : ref,
        props: props === undefined ? null : props,
        isSVG: isSVG === undefined ? null : isSVG,
        children: children === undefined ? null : children,
        parentVNode: null,
        events: events || null,
        hooks: hooks || null,
        dom: null,
        _owner: owner || null
    };

    if (!noNormalise) {
        normalize(vNode);
    }

    return vNode;
}

export function createVoidVNode() {
    return createVNode('#comment');
}

export const emptyVNode = createVoidVNode();

export var createComment = createVoidVNode;

export function createTextVNode(text) {
    return createVNode('#text', null, text, null, null, null, null, false, null, true);
}

export var createTextNode = createTextVNode;

export function createElement(type, config, ..._children) {
    if (isInvalid(type) || isObject(type)) {
        throw new Error('Neact Error: createElement() type parameter cannot be undefined, null, false or true, It must be a string, class or function.');
    }

    let prop, children = flatten(_children),
        props = {},
        events = null,
        hooks = null,
        key = null,
        ref = null,
        isSVG = false;

    if (children.length === 1) {
        children = children[0];
    } else if (children.length === 0) {
        children = null;
    }

    if (!isNullOrUndef(config)) {
        for (prop in config) {
            //if (hasOwnProperty.call(config, prop)) {
            if (prop === 'key') {
                key = '' + config.key;
            } else if (prop === 'ref') {
                ref = '' + config.ref;
            } else if (prop === 'hooks') {
                hooks = config.hooks;
            } else if (isAttrAnEvent(prop) && isString(type)) {
                if (!events) {
                    events = {};
                }
                events[prop.toLowerCase()] = config[prop];
            } else {
                props[prop] = config[prop];
            }
            //}
        }
    }

    //ComponentClass ComponentFunction
    if (!isString(type)) {
        if (type.defaultProps) {
            let defaultProps = type.defaultProps;
            for (prop in defaultProps) {
                if (props[prop] === undefined) { // && hasOwnProperty.call(defaultProps, prop)
                    props[prop] = defaultProps[prop];
                }
            }
        }
    }

    if (!children && props.children) {
        children = props.children;
    }

    //delete props.children;

    //props.children = children;

    if (type && type[0] === 's' && type[1] === 'v' && type[2] === 'g') {
        isSVG = true;
    }

    return createVNode(type, props, children, events, hooks, ref, key, isSVG, NeactCurrentOwner.current);
}

export function cloneElement(element, config, ..._children) {
    if (isTextVNode(element)) {
        return createTextVNode(element.children);
    }
    if (isVoidVNode(element)) {
        return createVoidVNode();
    }
    let prop, children = flatten(_children),
        type = element.type,
        props = assign({}, element.props);

    if (children.length === 1) {
        children = children[0];
    } else if (children.length === 0) {
        children = null;
    }

    var key = element.key;
    var ref = element.ref;
    var hooks = element.hooks;
    var events = element.events;

    var owner = element._owner;

    if (!isNullOrUndef(config)) {
        for (prop in config) {
            // if (hasOwnProperty.call(config, prop)) {
            if (prop === 'key') {
                key = '' + config.key;
            } else if (prop === 'ref') {
                ref = '' + config.ref;
            } else if (prop === 'hooks') {
                hooks = config.hooks;
            } else if (isAttrAnEvent(prop) && isString(type)) {
                if (!events) {
                    events = {};
                }
                events[prop.toLowerCase()] = config[prop];
            } else {
                props[prop] = config[prop];
            }
            //}
        }
    }

    //ComponentClass ComponentFunction
    if (!isString(type)) {
        if (type.defaultProps) {
            let defaultProps = type.defaultProps;
            for (prop in defaultProps) {
                if (props[prop] === undefined) { //&& hasOwnProperty.call(defaultProps, prop)
                    props[prop] = defaultProps[prop];
                }
            }
        }
    }

    if (isNull(children)) {
        children = isComponentVNode(element) ? element.props.children : element.children;
    }

    //props.children = children;

    return createVNode(type, props, children, events, hooks, ref, key, element.isSVG, NeactCurrentOwner.current);
}