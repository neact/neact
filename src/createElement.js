'use strict';

import {
    isNull,
    isArray,
    isString,
    isNumber,
    isInvalid,
    isObject,
    isAttrAnEvent,
    isNullOrUndef,
    flatten,
    assign,
    throwError,
    isVNode,
    isTextVNode,
    isComponentVNode,
    isVoidVNode,
    isEmptyVNode
} from './shared';

import {
    createVNode,
    createTextVNode,
    createEmptyVNode
} from './vnode';

import CurrentOwner from './currentOwner';

export function createElement(type, config, ..._children) {
    if (isInvalid(type) || isObject(type) || isNumber(type)) {
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
            if (prop === 'key') {
                key = '' + config.key;
            } else if (prop === 'ref') {
                ref = config.ref;
            } else if (prop === 'hooks') {
                hooks = config.hooks;
            } else if (isString(type) && isAttrAnEvent(prop)) {
                if (!events) {
                    events = {};
                }
                events[prop.toLowerCase()] = config[prop];
            } else {
                props[prop] = config[prop];
            }
        }
    }

    //class or function.
    if (!isString(type) && type.defaultProps) {
        let defaultProps = type.defaultProps;
        for (prop in defaultProps) {
            if (props[prop] === undefined) {
                props[prop] = defaultProps[prop];
            }
        }

    }

    if (!children && props.children) {
        children = props.children;
    }

    delete props.children;

    if (isString(type)) {
        if (type[0] === 's' && type[1] === 'v' && type[2] === 'g') {
            isSVG = true;
        }

        if (props.dangerouslySetInnerHTML && !isNullOrUndef(children)) {
            throwError('Can only set one of `children` or `props.dangerouslySetInnerHTML`');
        }
    }

    return createVNode(type, props, children, events, hooks, ref, key, isSVG, CurrentOwner.current);
}

export function cloneElement(element, config, ..._children) {
    if (!isVNode(element)) {
        return element;
    }
    if (isTextVNode(element)) {
        return createTextVNode(element.children);
    }
    if (isEmptyVNode(element)) {
        return createEmptyVNode();
    }
    let prop, i, child, children = flatten(_children),
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
            if (prop === 'key') {
                key = key ? key : '' + config.key;
            } else if (prop === 'ref') {
                ref = ref ? ref : config.ref;
            } else if (prop === 'hooks') {
                hooks = hooks ? assign(hooks, config.hooks) : config.hooks;
            } else if (isString(type) && isAttrAnEvent(prop)) {
                if (!events) {
                    events = {};
                }
                events[prop.toLowerCase()] = config[prop];
            } else {
                props[prop] = config[prop];
            }
        }
    }

    if (!children && config && config.children) {
        children = config.children;
    }

    delete props.children;

    let newChildren = [],
        oldChildren = isComponentVNode(element) ? element.props.children : element.children;

    children = children ? [].concat(oldChildren, children) : oldChildren;

    if (children) {
        if (isArray(children)) {
            for (i = 0; i < children.length; i++) {
                child = children[i];
                if (!child) { continue; }
                newChildren.push(isVNode(child) ? cloneElement(child) : child);
            }
            if (newChildren.length === 1) {
                newChildren = newChildren[0];
            } else if (newChildren.length === 0) {
                newChildren = null;
            }
        } else {
            newChildren = cloneElement(children);
        }
    }

    return createVNode(type, props, newChildren, events, hooks, ref, key, element.isSVG, CurrentOwner.current);
}