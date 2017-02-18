'use strict';

exports.__esModule = true;
exports.createTextNode = exports.createComment = exports.emptyVNode = exports.isValidElement = undefined;
exports.isVNode = isVNode;
exports.isSameVNode = isSameVNode;
exports.isVoidVNode = isVoidVNode;
exports.isTextVNode = isTextVNode;
exports.isElementVNode = isElementVNode;
exports.isComponentVNode = isComponentVNode;
exports.createVNode = createVNode;
exports.createVoidVNode = createVoidVNode;
exports.createTextVNode = createTextVNode;
exports.createElement = createElement;
exports.cloneElement = cloneElement;

var _NeactUtils = require('./NeactUtils');

var _support = require('./support');

var _NeactCurrentOwner = require('./NeactCurrentOwner');

var _NeactCurrentOwner2 = _interopRequireDefault(_NeactCurrentOwner);

var _NeactNormalizeVNode = require('./NeactNormalizeVNode');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var hasOwnProperty = Object.prototype.hasOwnProperty;

function isVNode(VNode) {
    return VNode && (0, _NeactUtils.isObject)(VNode) && VNode.$$isVNode;
}

var isValidElement = exports.isValidElement = isVNode;

function isSameVNode(vnode1, vnode2) {
    var isSame = vnode1.key === vnode2.key && vnode1.type === vnode2.type;
    if (isSame && _support.isIE && _support.ieVersion < 9 && vnode1.dom.tagName.toLowerCase() === 'input') {
        isSame = vnode1.props.type === vnode2.props.type;
    }
    return isSame;
}

function isVoidVNode(vNode) {
    return vNode.type === '#comment';
}

function isTextVNode(vNode) {
    return vNode.type === '#text';
}

function isElementVNode(vNode) {
    return (0, _NeactUtils.isString)(vNode.type) && vNode.type[0] !== '#';
}

function isComponentVNode(vNode) {
    return !(0, _NeactUtils.isString)(vNode.type); // && isFunction(vNode.type)
}

function createVNode(type, props, children, events, hooks, ref, key, isSVG, owner) {
    var noNormalise = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : false;

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
        (0, _NeactNormalizeVNode.normalize)(vNode);
    }

    return vNode;
}

function createVoidVNode() {
    return createVNode('#comment');
}

var emptyVNode = exports.emptyVNode = createVoidVNode();

var createComment = exports.createComment = createVoidVNode;

function createTextVNode(text) {
    return createVNode('#text', null, text, null, null, null, null, false, null, true);
}

var createTextNode = exports.createTextNode = createTextVNode;

function createElement(type, config) {
    if ((0, _NeactUtils.isInvalid)(type) || (0, _NeactUtils.isObject)(type)) {
        throw new Error('Neact Error: createElement() type parameter cannot be undefined, null, false or true, It must be a string, class or function.');
    }

    for (var _len = arguments.length, _children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        _children[_key - 2] = arguments[_key];
    }

    var prop = void 0,
        children = (0, _NeactUtils.flatten)(_children),
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

    if (!(0, _NeactUtils.isNullOrUndef)(config)) {
        for (prop in config) {
            //if (hasOwnProperty.call(config, prop)) {
            if (prop === 'key') {
                key = '' + config.key;
            } else if (prop === 'ref') {
                ref = '' + config.ref;
            } else if (prop === 'hooks') {
                hooks = config.hooks;
            } else if ((0, _NeactUtils.isAttrAnEvent)(prop) && (0, _NeactUtils.isString)(type)) {
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
    if (!(0, _NeactUtils.isString)(type)) {
        if (type.defaultProps) {
            var defaultProps = type.defaultProps;
            for (prop in defaultProps) {
                if (props[prop] === undefined) {
                    // && hasOwnProperty.call(defaultProps, prop)
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

    return createVNode(type, props, children, events, hooks, ref, key, isSVG, _NeactCurrentOwner2['default'].current);
}

function cloneElement(element, config) {
    if (isTextVNode(element)) {
        return createTextVNode(element.children);
    }
    if (isVoidVNode(element)) {
        return createVoidVNode();
    }

    for (var _len2 = arguments.length, _children = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        _children[_key2 - 2] = arguments[_key2];
    }

    var prop = void 0,
        children = (0, _NeactUtils.flatten)(_children),
        type = element.type,
        props = (0, _NeactUtils.assign)({}, element.props);

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

    if (!(0, _NeactUtils.isNullOrUndef)(config)) {
        for (prop in config) {
            // if (hasOwnProperty.call(config, prop)) {
            if (prop === 'key') {
                key = '' + config.key;
            } else if (prop === 'ref') {
                ref = '' + config.ref;
            } else if (prop === 'hooks') {
                hooks = config.hooks;
            } else if ((0, _NeactUtils.isAttrAnEvent)(prop) && (0, _NeactUtils.isString)(type)) {
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
    if (!(0, _NeactUtils.isString)(type)) {
        if (type.defaultProps) {
            var defaultProps = type.defaultProps;
            for (prop in defaultProps) {
                if (props[prop] === undefined) {
                    //&& hasOwnProperty.call(defaultProps, prop)
                    props[prop] = defaultProps[prop];
                }
            }
        }
    }

    if ((0, _NeactUtils.isNull)(children)) {
        children = isComponentVNode(element) ? element.props.children : element.children;
    }

    //props.children = children;

    return createVNode(type, props, children, events, hooks, ref, key, element.isSVG, _NeactCurrentOwner2['default'].current);
}