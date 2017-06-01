(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.Neact = global.Neact || {})));
}(this, (function (exports) { 'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var ArrayProto = Array.prototype;
var nativeForEach = ArrayProto.forEach;
var nativeMap = ArrayProto.map;
var nativeFilter = ArrayProto.filter;

var objToString = Object.prototype.toString;

var emptyObject = {};

var isArray = Array.isArray || function (s) {
    return objToString.call(s) === '[object Array]';
};

function toArray(obj) {
    return isArray(obj) ? obj : [obj];
}

function isUndefined(obj) {
    return obj === undefined;
}

function isStatefulComponent(o) {
    return !isUndefined(o.prototype) && !isUndefined(o.prototype.render);
}

function isString(obj) {
    return typeof obj === 'string';
}

function isNumber(obj) {
    return typeof obj === 'number';
}

function isTrue(obj) {
    return obj === true;
}

function isNull(obj) {
    return obj === null;
}

function isStringOrNumber(obj) {
    return isString(obj) || isNumber(obj);
}

function isNullOrUndef(obj) {
    return isUndefined(obj) || isNull(obj);
}

function isInvalid(obj) {
    return isNull(obj) || obj === false || isTrue(obj) || isUndefined(obj);
}

function isFunction(obj) {
    return typeof obj === 'function';
}

function isAttrAnEvent(attr) {
    return attr[0] === 'o' && attr[1] === 'n' && attr.length > 3;
}

function isDefined(obj) {
    return obj !== undefined;
}

function isObject(o) {
    return (typeof o === 'undefined' ? 'undefined' : _typeof(o)) === 'object';
}

function isDOM(obj) {
    return obj && obj.nodeType === 1 && typeof obj.nodeName == 'string';
}

function isVNode(VNode) {
    return VNode && isObject(VNode) && VNode.$$isVNode;
}

function isSameVNode(vnode1, vnode2) {
    var isSame = vnode1.key === vnode2.key && vnode1.type === vnode2.type;
    return isSame;
}

function isVoidVNode(vNode) {
    return vNode.type === '#comment';
}

function isEmptyVNode(vNode) {
    return vNode.type === '#comment';
}

function isTextVNode(vNode) {
    return vNode.type === '#text';
}

function isElementVNode(vNode) {
    return isString(vNode.type) && vNode.type[0] !== '#';
}

function isComponentVNode(vNode) {
    return !isString(vNode.type); // && isFunction(vNode.type)
}

function throwError(message) {
    if (!message) {
        message = 'a runtime error occured!';
    }
    throw new Error('Neact Error: ' + message);
}

function warning(msg) {
    if (console) {
        console.warn(msg);
    }
}



function inherits(cls, base, proto) {
    function F() {}
    F.prototype = base.prototype;
    cls.prototype = new F();

    if (proto) {
        for (var prop in proto) {
            cls.prototype[prop] = proto[prop];
        }
    }

    cls.constructor = cls;
}

/**
 * 数组或对象遍历
 * @param {Object|Array} obj
 * @param {Function} cb
 * @param {*} [context]
 */
function each(obj, cb, context) {
    if (!(obj && cb)) {
        return;
    }
    if (obj.forEach && obj.forEach === nativeForEach) {
        obj.forEach(cb, context);
    } else if (obj.length === +obj.length) {
        for (var i = 0, len = obj.length; i < len; i++) {
            cb.call(context, obj[i], i, obj);
        }
    } else {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                cb.call(context, obj[key], key, obj);
            }
        }
    }
}

/**
 * 数组映射
 * @param {Array} obj
 * @param {Function} cb
 * @param {*} [context]
 * @return {Array}
 */
function map(obj, cb, context) {
    if (!(obj && cb)) {
        return;
    }
    if (obj.map && obj.map === nativeMap) {
        return obj.map(cb, context);
    } else {
        var result = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            result.push(cb.call(context, obj[i], i, obj));
        }
        return result;
    }
}

/**
 * 数组过滤
 * @param {Array} obj
 * @param {Function} cb
 * @param {*} [context]
 * @return {Array}
 */
function filter(obj, cb, context) {
    if (!(obj && cb)) {
        return;
    }
    if (obj.filter && obj.filter === nativeFilter) {
        return obj.filter(cb, context);
    } else {
        var result = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            if (cb.call(context, obj[i], i, obj)) {
                result.push(obj[i]);
            }
        }
        return result;
    }
}

function bind(func, context) {
    return function () {
        func.apply(context, arguments);
    };
}

var flatten = function (input) {
    var output = [],
        idx = 0;
    for (var i = 0, length = input && input.length; i < length; i++) {
        var value = input[i];
        if (isArray(value)) {
            value = flatten(value);
            var j = 0,
                len = value.length;
            output.length += len;
            while (j < len) {
                output[idx++] = value[j++];
            }
        } else {
            output[idx++] = value;
        }
    }
    return output;
};

function assign(target) {
    if (Object.assign) {
        return Object.assign.apply(Object, arguments);
    }

    if (target === undefined || target === null) {
        throw new TypeError('Cannot convert undefined or null to object');
    }

    var output = Object(target);
    for (var index = 1; index < arguments.length; index++) {
        var source = arguments[index];
        if (source !== undefined && source !== null) {
            for (var nextKey in source) {
                if (source.hasOwnProperty(nextKey)) {
                    output[nextKey] = source[nextKey];
                }
            }
        }
    }
    return output;
}

function createEmptyVNode() {
    return createVNode('#comment', null, null, null, null, null, null, false, null, true);
}

var createVoidVNode = createEmptyVNode;

var emptyVNode = createEmptyVNode();

function createTextVNode(text) {
    return createVNode('#text', null, text, null, null, null, null, false, null, true);
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
        normalize(vNode);
    }

    return vNode;
}

function normalize(vNode) {
    var isComponent = isComponentVNode(vNode);

    if (!isInvalid(vNode.children)) {
        vNode.children = normalizeChildren(vNode.children, isComponent ? null : vNode);
    }

    if (isComponent) {
        if (!vNode.props) {
            vNode.props = {};
        }
        vNode.props.children = vNode.children;
        vNode.children = null;
    }
}

function normalizeChildren(children, parentVNode) {
    if (isArray(children)) {
        return normalizeVNodes(children, parentVNode);
    } else if (isStringOrNumber(children)) {
        children = createTextVNode(children);
    }
    if (isVNode(children)) {
        children.parentVNode = parentVNode;
    }
    return children;
}

function normalizeVNodes(nodes, parentVNode) {
    var newNodes = [];

    for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        if (isInvalid(n)) {
            continue;
        }
        if (isStringOrNumber(n)) {
            n = createTextVNode(n);
        }

        n.parentVNode = parentVNode;

        newNodes.push(n);
    }

    return newNodes.length > 0 ? newNodes : null;
}

var CurrentOwner = {
    current: null
};

function createElement(type, config) {
    if (isInvalid(type) || isObject(type) || isNumber(type)) {
        throw new Error('Neact Error: createElement() type parameter cannot be undefined, null, false or true, It must be a string, class or function.');
    }

    for (var _len = arguments.length, _children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        _children[_key - 2] = arguments[_key];
    }

    var prop = void 0,
        children = flatten(_children),
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
        var defaultProps = type.defaultProps;
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

function cloneElement(element, config) {
    if (!isVNode(element)) {
        return element;
    }
    if (isTextVNode(element)) {
        return createTextVNode(element.children);
    }
    if (isEmptyVNode(element)) {
        return createEmptyVNode();
    }

    for (var _len2 = arguments.length, _children = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        _children[_key2 - 2] = arguments[_key2];
    }

    var prop = void 0,
        i = void 0,
        child = void 0,
        children = flatten(_children),
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

    var newChildren = [],
        oldChildren = isComponentVNode(element) ? element.props.children : element.children;

    children = children ? [].concat(oldChildren, children) : oldChildren;

    if (children) {
        if (isArray(children)) {
            for (i = 0; i < children.length; i++) {
                child = children[i];
                if (!child) {
                    continue;
                }
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

function CallbackQueue() {
    this.listeners = [];
}
CallbackQueue.prototype.enqueue = function (callback) {
    this.listeners.push(callback);
};

CallbackQueue.prototype.notifyAll = function () {
    var cbs = this.listeners;
    this.listeners = [];
    for (var i = 0; i < cbs.length; i++) {
        cbs[i]();
    }
};

function shouldUpdateRefs(lastVNode, nextVNode) {
    var lastRef = lastVNode.ref;
    var nextRef = nextVNode.ref;
    var lastOwner = lastVNode._owner;
    var nextOwner = nextVNode._owner;
    return lastRef !== nextRef || typeof nextRef === 'string' && nextOwner !== lastOwner;
}

function detachRef(vNode) {
    var ref = vNode.ref;
    var owner = vNode._owner;

    if (typeof ref === 'function') {
        ref(null);
    } else if (ref && owner) {
        delete owner.refs[ref];
    }
}

function attachRef(vNode) {
    var ref = vNode.ref;
    var owner = vNode._owner;
    var target = vNode._instance || vNode.dom;

    if (typeof ref === 'function') {
        ref(target);
    } else if (ref && owner) {
        owner.refs[ref] = target;
    }
}

function ename(s) {
    return s.replace('on', '');
}

function invokeHandler(handler, vnode, event) {
    var el = vnode.dom;
    if (typeof handler === "function") {
        // call function handler
        handler.call(el, event, vnode);
    } else if (isObject(handler)) {
        // call handler with arguments
        if (typeof handler[0] === "function") {
            // special case for single argument for performance
            if (handler.length === 2) {
                handler[0].call(el, handler[1], event, vnode);
            } else {
                var args = handler.slice(1);
                args.push(event);
                args.push(vnode);
                handler[0].apply(el, args);
            }
        } else {
            // call multiple handlers
            for (var i = 0; i < handler.length; i++) {
                invokeHandler(handler[i], vnode, event);
            }
        }
    }
}

function handleEvent(event, vnode) {
    var name = 'on' + event.type,
        on = vnode.events;

    // call event handler(s) if exists
    if (on && on[name]) {
        invokeHandler(on[name], vnode, event);
    }
}

function createListener() {
    function handler(e) {
        e = e || event;
        handleEvent(e, handler.vnode);
    }
    return handler;
}

function createDOMEvents(vNode) {
    updateDOMEvents(emptyVNode, vNode);
}

function updateDOMEvents(oldVnode, vnode) {
    var oldOn = oldVnode.events,
        oldListener = oldVnode._listener,
        oldElm = oldVnode.dom,
        on = vnode && vnode.events,
        elm = vnode && vnode.dom,
        name;

    // optimization for reused immutable handlers
    if (oldOn === on) {
        return;
    }

    // remove existing listeners which no longer used
    if (oldOn && oldListener) {
        // if element changed or deleted we remove all existing listeners unconditionally
        if (!on) {
            for (name in oldOn) {
                // remove listener if element was changed or existing listeners removed
                removeEventListener(oldElm, ename(name), oldListener);
            }
        } else {
            for (name in oldOn) {
                // remove listener if existing listener removed
                if (!on[name]) {
                    removeEventListener(oldElm, ename(name), oldListener);
                }
            }
        }
    }

    // add new listeners which has not already attached
    if (on) {
        // reuse existing listener or create new
        var listener = vnode._listener = oldVnode._listener || createListener();
        // update vnode for listener
        listener.vnode = vnode;

        // if element changed or added we add all needed listeners unconditionally
        if (!oldOn) {
            for (name in on) {
                // add listener if element was changed or new listeners added
                addEventListener(elm, ename(name), listener);
            }
        } else {
            for (name in on) {
                // add listener if new listener added
                if (!oldOn[name]) {
                    addEventListener(elm, ename(name), listener);
                }
            }
        }
    }
}

function destroyDOMEvents(vNode) {
    updateDOMEvents(vNode, emptyVNode);
}

function unmountVoidOrText(vNode, parentDom) {
    if (parentDom) {
        removeChild(parentDom, vNode.dom);
    }
}

function unmountChildren(children, callback) {
    if (isArray(children)) {
        for (var i = 0; i < children.length; i++) {
            var child = children[i];

            if (!isInvalid(child) && isVNode(child)) {
                unmount(child, null, callback);
            }
        }
    } else if (isVNode(children)) {
        unmount(children, null, callback);
    }
}

function unmountElement(vNode, parentDom, callback) {
    var dom = vNode.dom;
    var events = vNode.events;
    var hooks = vNode.hooks || {};
    var children = vNode.children;

    if (!isNull(vNode.ref)) {
        detachRef(vNode);
    }

    destroyDOMEvents(vNode);

    if (parentDom) {
        removeChild(parentDom, dom);
    }

    if (!isNullOrUndef(children)) {
        unmountChildren(children, callback);
    }

    if (hooks.destroy) {
        hooks.destroy(vNode);
    }
}

function unmountComponent(vNode, parentDom, callback) {
    var inst = vNode._instance;
    var isClass = isStatefulComponent(vNode.type);
    var children = vNode.children;
    var props = vNode.props;
    var hooks = vNode.hooks || {};
    var dom = vNode.dom;

    if (parentDom) {
        removeChild(parentDom, vNode.dom);
    }

    if (isClass) {
        if (!inst._unmounted) {
            inst._ignoreSetState = true;
            //TODO: beforeUnmount
            if (inst.componentWillUnmount) {
                inst.componentWillUnmount();
            }

            if (!isNull(vNode.ref)) {
                detachRef(vNode);
            }

            unmount(children, null, callback);

            inst._unmounted = true;
            inst._ignoreSetState = false;

            if (inst.componentDidUnmount) {
                inst.componentDidUnmount();
            }
        }
    } else {
        if (!isNullOrUndef(props.onComponentWillUnmount)) {
            props.onComponentWillUnmount(vNode);
        }

        if (!isNull(vNode.ref)) {
            detachRef(vNode);
        }

        unmount(children, null, callback);

        if (!isNullOrUndef(props.onComponentDidUnmount)) {
            props.onComponentDidUnmount(vNode);
        }
    }

    if (hooks.destroy) {
        hooks.destroy(vNode);
    }
}

function unmount(vNode, parentDom, callback) {
    var isUndefCallbacks = isNullOrUndef(callback);
    callback = callback || new CallbackQueue();

    if (isElementVNode(vNode)) {
        unmountElement(vNode, parentDom, callback);
    } else if (isVoidVNode(vNode) || isTextVNode(vNode)) {
        unmountVoidOrText(vNode, parentDom);
    } else if (isComponentVNode(vNode)) {
        unmountComponent(vNode, parentDom, callback);
    }

    if (isUndefCallbacks) {
        callback.notifyAll();
    }
}

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



function replaceWithNewNode(lastNode, nextNode, parentDom, callback, context, isSVG) {
    unmount(lastNode, null);
    var dom = mount(nextNode, null, callback, context, isSVG);

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
    if (typeof node.addEventListener == "function") {
        node.addEventListener(name, fn, false);
    } else if (typeof node.attachEvent != "undefined") {
        var attachEventName = "on" + name;
        node.attachEvent(attachEventName, fn);
    }
}

function removeEventListener(node, name, fn) {
    if (typeof node.removeEventListener == "function") {
        node.removeEventListener(name, fn, false);
    } else if (typeof node.detachEvent != "undefined") {
        var attachEventName = "on" + name;
        node.detachEvent(attachEventName, fn);
    }
}

function createComponentInstance(vNode, context, isSVG) {
    var type = vNode.type;
    var props = vNode.props || {};
    var ref = vNode.ref;

    if (isUndefined(context)) {
        context = {};
    }

    var inst = new type(props, context);

    inst.props = props;
    inst.context = context;
    inst.refs = emptyObject;

    var initialState = inst.state;
    if (initialState === undefined) {
        inst.state = initialState = null;
    }

    inst._unmounted = false;
    inst._isSVG = isSVG;

    var childContext = inst.getChildContext();

    if (!isNullOrUndef(childContext)) {
        inst._childContext = assign({}, context, childContext);
    } else {
        inst._childContext = context;
    }

    return inst;
}

var processDOMPropertyHooks = {};

var canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);



var ieVersion = canUseDOM && document && function () {
    var version = 3,
        div = document.createElement('div'),
        iElems = div.getElementsByTagName('i');

    // Keep constructing conditional HTML blocks until we hit one that resolves to an empty fragment
    while (div.innerHTML = '<!--[if gt IE ' + ++version + ']><i></i><![endif]-->', iElems[0]) {}
    return version > 4 ? version : undefined;
}();

function constructDefaults(string, object, value) {
    var r = string.split(',');
    for (var i = 0; i < r.length; i++) {
        object[r[i]] = value;
    }
}

var xlinkNS = 'http://www.w3.org/1999/xlink';
var xmlNS = 'http://www.w3.org/XML/1998/namespace';

var strictProps = {};
var booleanProps = {};
var namespaces = {};
var isUnitlessNumber = {};
var skipProps = {};
var dehyphenProps = {
    acceptCharset: 'accept-charset',
    httpEquiv: 'http-equiv'
};
var probablyKebabProps = /^(accentH|arabicF|capH|font[FSVW]|glyph[NO]|horiz[AO]|panose1|renderingI|strikethrough[PT]|underline[PT]|v[AHIM]|vert[AO]|xH|alignmentB|baselineS|clip[PR]|color[IPR]|dominantB|enableB|fill[OR]|flood[COF]|imageR|letterS|lightingC|marker[EMS]|pointerE|shapeR|stop[CO]|stroke[DLMOW]|text[ADR]|unicodeB|wordS|writingM).*/;

function kebabize(str, smallLetter, largeLetter) {
    return smallLetter + '-' + largeLetter.toLowerCase();
}

constructDefaults('xlink:href,xlink:arcrole,xlink:actuate,xlink:role,xlink:titlef,xlink:type', namespaces, xlinkNS);
constructDefaults('xml:base,xml:lang,xml:space', namespaces, xmlNS);
constructDefaults('volume,defaultValue,value', strictProps, true);
constructDefaults('children,ref,key', skipProps, true);

constructDefaults('muted,scoped,loop,open,checked,multiple,defaultChecked,selected,default,capture,disabled,readOnly,required,autoplay,controls,seamless,reversed,allowfullscreen,novalidate', booleanProps, true);

constructDefaults('animationIterationCount,borderImageOutset,borderImageSlice,borderImageWidth,boxFlex,boxFlexGroup,boxOrdinalGroup,columnCount,flex,flexGrow,flexPositive,flexShrink,flexNegative,flexOrder,gridRow,gridColumn,fontWeight,lineClamp,lineHeight,opacity,order,orphans,tabSize,widows,zIndex,zoom,fillOpacity,floodOpacity,stopOpacity,strokeDasharray,strokeDashoffset,strokeMiterlimit,strokeOpacity,strokeWidth,', isUnitlessNumber, true);

var hasShorthandPropertyBug = false;
var styleFloatAccessor = 'cssFloat';

if (canUseDOM) {
    var tempStyle = document.createElement('div').style;
    try {
        // IE8 throws "Invalid argument." if resetting shorthand style properties.
        tempStyle.font = '';
    } catch (e) {
        hasShorthandPropertyBug = true;
    }
    // IE8 only supports accessing cssFloat (standard) as styleFloat
    if (document.documentElement.style.cssFloat === undefined) {
        styleFloatAccessor = 'styleFloat';
    }
}
/**
 * Most style properties can be unset by doing .style[prop] = '' but IE8
 * doesn't like doing that with shorthand properties so for the properties that
 * IE8 breaks on, which are listed here, we instead unset each of the
 * individual properties. See http://bugs.jquery.com/ticket/12385.
 * The 4-value 'clock' properties like margin, padding, border-width seem to
 * behave without any problems. Curiously, list-style works too without any
 * special prodding.
 */
var shorthandPropertyExpansions = {
    background: {
        backgroundAttachment: true,
        backgroundColor: true,
        backgroundImage: true,
        backgroundPositionX: true,
        backgroundPositionY: true,
        backgroundRepeat: true
    },
    backgroundPosition: {
        backgroundPositionX: true,
        backgroundPositionY: true
    },
    border: {
        borderWidth: true,
        borderStyle: true,
        borderColor: true
    },
    borderBottom: {
        borderBottomWidth: true,
        borderBottomStyle: true,
        borderBottomColor: true
    },
    borderLeft: {
        borderLeftWidth: true,
        borderLeftStyle: true,
        borderLeftColor: true
    },
    borderRight: {
        borderRightWidth: true,
        borderRightStyle: true,
        borderRightColor: true
    },
    borderTop: {
        borderTopWidth: true,
        borderTopStyle: true,
        borderTopColor: true
    },
    font: {
        fontStyle: true,
        fontVariant: true,
        fontWeight: true,
        fontSize: true,
        lineHeight: true,
        fontFamily: true
    },
    outline: {
        outlineWidth: true,
        outlineStyle: true,
        outlineColor: true
    }
};

var raf = typeof window !== 'undefined' && window.requestAnimationFrame || setTimeout;
var nextFrame = function (fn) {
    raf(function () {
        raf(fn);
    });
};

function setNextFrame(obj, prop, val) {
    nextFrame(function () {
        obj[prop] = val;
    });
}

var processDOMStyle = function (lastValue, nextValue, prop, isSVG, dom, vNode) {
    if (lastValue === nextValue) {
        return;
    }
    if (isString(nextValue)) {
        dom.style.cssText = nextValue;
        return;
    }
    if (isString(lastValue)) {
        dom.style.cssText = '';
        lastValue = {};
    }

    var cur,
        name,
        elm = dom,
        domStyle = dom.style,
        oldStyle = lastValue,
        style = nextValue;

    if (!oldStyle && !style) {
        return;
    }
    oldStyle = oldStyle || emptyObject;
    style = style || emptyObject;
    var oldHasDel = 'delayed' in oldStyle;

    for (name in oldStyle) {
        if (!style[name]) {
            var expansion = hasShorthandPropertyBug && shorthandPropertyExpansions[name];
            if (expansion) {
                // Shorthand property that IE8 won't like unsetting, so unset each
                // component to placate it
                for (var individualStyleName in expansion) {
                    domStyle[individualStyleName] = '';
                }
            } else {
                domStyle[name] = '';
            }
        }
    }
    for (name in style) {
        cur = dangerousStyleValue(name, style[name]);
        if (name === 'float' || name === 'cssFloat') {
            name = styleFloatAccessor;
        }
        if (name === 'delayed') {
            for (name in style.delayed) {
                cur = style.delayed[name];
                if (!oldHasDel || cur !== oldStyle.delayed[name]) {
                    setNextFrame(domStyle, name, cur);
                }
            }
        } else if (cur !== oldStyle[name]) {
            domStyle[name] = cur;
        }
    }
};

function dangerousStyleValue(name, value) {
    var isEmpty = value == null || typeof value === 'boolean' || value === '';
    if (isEmpty) {
        return '';
    }

    var isNonNumeric = isNaN(value);
    if (isNonNumeric || value === 0 || isUnitlessNumber[name]) {
        return '' + value; // cast to string
    }

    if (typeof value === 'string') {
        value = value.trim();
    }
    return value + 'px';
}

var processDOMAttr = function (lastValue, nextValue, prop, isSVG, dom, vNode) {
    if (lastValue === nextValue) {
        return;
    }
    if (skipProps[prop]) {
        return;
    }
    if (booleanProps[prop]) {
        dom[prop] = nextValue ? true : false;
    } else if (strictProps[prop]) {
        var value = isNullOrUndef(nextValue) ? '' : nextValue;

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
            var lastHtml = lastValue && lastValue.__html;
            var nextHtml = nextValue && nextValue.__html;

            if (lastHtml !== nextHtml) {
                if (!isNullOrUndef(nextHtml)) {
                    dom.innerHTML = nextHtml;
                }
            }
        } else {
            var dehyphenProp = void 0;
            if (dehyphenProps[prop]) {
                dehyphenProp = dehyphenProps[prop];
            } else if (isSVG && prop.match(probablyKebabProps)) {
                dehyphenProp = prop.replace(/([a-z])([A-Z]|1)/g, kebabize);
                dehyphenProps[prop] = dehyphenProp;
            } else {
                dehyphenProp = prop;
            }
            var ns = namespaces[prop];

            if (ns) {
                dom.setAttributeNS(ns, dehyphenProp, nextValue);
            } else {
                dom.setAttribute(dehyphenProp, nextValue);
            }
        }
    }
};

var propertyHooks = assign({
    style: processDOMStyle,
    __default__: processDOMAttr
}, processDOMPropertyHooks);

function createDOMProperty(props, isSVG, vNode) {
    updateDOMProperty(null, props, isSVG, vNode);
}

function updateDOMProperty(lastProps, nextProps, isSVG, vNode) {
    if (lastProps === nextProps) {
        return;
    }

    var dom = vNode.dom;

    lastProps = lastProps || emptyObject;
    nextProps = nextProps || emptyObject;

    if (nextProps !== emptyObject) {
        for (var prop in nextProps) {
            // do not add a hasOwnProperty check here, it affects performance
            var nextValue = isNullOrUndef(nextProps[prop]) ? null : nextProps[prop];
            var lastValue = isNullOrUndef(lastProps[prop]) ? null : lastProps[prop];
            var hook = propertyHooks[prop] ? prop : '__default__';
            propertyHooks[hook](lastValue, nextValue, prop, isSVG, dom, vNode);
        }
    }
    if (lastProps !== emptyObject) {
        for (var _prop in lastProps) {
            if (isNullOrUndef(nextProps[_prop])) {
                var _lastValue = isNullOrUndef(lastProps[_prop]) ? null : lastProps[_prop];
                var _hook = propertyHooks[_prop] ? _prop : '__default__';
                propertyHooks[_hook](_lastValue, null, _prop, isSVG, dom, vNode);
            }
        }
    }
}

var _typeof$1 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

//import processElement from './processElement';

function mount(vNode, parentDom, callback, context, isSVG) {
    var isUndefCallbacks = isNullOrUndef(callback);
    var r = void 0;
    callback = callback || new CallbackQueue();

    if (isElementVNode(vNode)) {
        r = mountElement(vNode, parentDom, callback, context, isSVG);
    } else if (isTextVNode(vNode)) {
        r = mountText(vNode, parentDom);
    } else if (isComponentVNode(vNode)) {
        r = mountComponent(vNode, parentDom, callback, context, isSVG);
    } else if (isVoidVNode(vNode)) {
        r = mountVoid(vNode, parentDom);
    } else {
        throwError('mount() expects a valid VNode, instead it received an object with the type "' + (typeof vNode === 'undefined' ? 'undefined' : _typeof$1(vNode)) + '".');
    }

    if (isUndefCallbacks) {
        callback.notifyAll();
    }
    return r;
}

function mountText(vNode, parentDom) {
    var dom = document.createTextNode(vNode.children);

    vNode.dom = dom;
    if (parentDom) {
        appendChild(parentDom, dom);
    }
    return dom;
}

function mountVoid(vNode, parentDom) {
    var dom = document.createComment('emptyNode');

    vNode.dom = dom;
    if (parentDom) {
        appendChild(parentDom, dom);
    }
    return dom;
}

function mountElement(vNode, parentDom, callback, context, isSVG) {
    var tag = vNode.type;

    if (!isSVG) {
        isSVG = vNode.isSVG;
    }

    var dom = documentCreateElement(tag, isSVG);
    var children = vNode.children;
    var props = vNode.props;
    var events = vNode.events;
    var hooks = vNode.hooks || {};

    //if (!isNull(parentDom)) {
    //    appendChild(parentDom, dom);
    //}

    vNode.dom = dom;

    if (!isNullOrUndef(hooks.beforeCreate)) {
        hooks.beforeCreate(vNode);
    }

    if (!isNull(children)) {
        if (isArray(children)) {
            mountArrayChildren(children, dom, callback, context, isSVG);
        } else if (isVNode(children)) {
            mount(children, dom, callback, context, isSVG);
        }
    }

    //processElement(dom, vNode);

    createDOMProperty(props, isSVG, vNode);
    createDOMEvents(vNode);

    if (!isNull(vNode.ref)) {
        callback.enqueue(function () {
            return attachRef(vNode);
        });
    }

    if (!isNull(parentDom)) {
        appendChild(parentDom, dom);
    }

    if (!isNullOrUndef(hooks.create)) {
        callback.enqueue(function () {
            return hooks.create(vNode);
        });
    }
    return dom;
}

function mountArrayChildren(children, dom, callback, context, isSVG) {
    for (var i = 0; i < children.length; i++) {
        var child = children[i];

        if (!isInvalid(child)) {
            mount(child, dom, callback, context, isSVG);
        }
    }
}

function mountComponent(vNode, parentDom, callback, context, isSVG) {
    var type = vNode.type;
    var props = vNode.props;
    var hooks = vNode.hooks || {};
    var isClass = isStatefulComponent(type);
    var dom = void 0,
        children = void 0;

    if (isClass) {
        var inst = createComponentInstance(vNode, context, isSVG);
        vNode._instance = inst;

        inst._pendingSetState = true;

        if (inst.componentWillMount) {
            inst.componentWillMount();
            if (inst._pendingStateQueue) {
                inst.state = inst._processPendingState(inst.props, inst.context);
            }
        }

        inst._ignoreSetState = true;
        CurrentOwner.current = inst;
        vNode.children = inst.render(inst.props, inst.state, inst.context);
        CurrentOwner.current = null;
        inst._ignoreSetState = false;
        normalizeComponentChildren(vNode);
        inst._vNode = vNode;
        //inst._renderedVNode = vNode.children;
        inst._pendingSetState = false;

        vNode.dom = dom = mount(vNode.children, parentDom, callback, inst._childContext, isSVG);

        inst._callbacks = new CallbackQueue();

        if (!isNull(vNode.ref)) {
            callback.enqueue(function () {
                return attachRef(vNode);
            });
        }

        if (inst.componentDidMount) {
            callback.enqueue(function () {
                return inst.componentDidMount();
            });
        }

        if (!isNullOrUndef(hooks.create)) {
            callback.enqueue(function () {
                return hooks.create(vNode);
            });
        }

        if (inst._pendingCallbacks) {
            callback.enqueue(function () {
                return inst._processPendingCallbacks();
            });
        }
    } else {
        //Function Component
        if (!isNullOrUndef(props.onComponentWillMount)) {
            props.onComponentWillMount(vNode);
        }

        vNode.children = type(props, context);
        normalizeComponentChildren(vNode);
        vNode.dom = dom = mount(vNode.children, parentDom, callback, context, isSVG);

        if (!isNull(vNode.ref)) {
            callback.enqueue(function () {
                return attachRef(vNode);
            });
        }

        if (!isNullOrUndef(props.onComponentDidMount)) {
            callback.enqueue(function () {
                return props.onComponentDidMount(vNode);
            });
        }

        if (!isNullOrUndef(hooks.create)) {
            callback.enqueue(function () {
                return hooks.create(vNode);
            });
        }
    }

    return dom;
}

function normalizeComponentChildren(vNode) {
    var children = vNode.children;

    if (isArray(children)) {
        throwError('a valid Neact VNode (or null) must be returned from a component render. You may have returned an array or an invalid object.');
    } else if (isInvalid(children)) {
        vNode.children = createVoidVNode();
    } else if (isStringOrNumber(children)) {
        vNode.children = createTextVNode(children);
    }

    vNode.children.parentVNode = vNode;

    return vNode;
}

//import processElement from './processElement';

function patch(lastVNode, nextVNode, parentDom, callback, context, isSVG) {
    var isUndefCallbacks = isNullOrUndef(callback);
    callback = callback || new CallbackQueue();

    if (lastVNode !== nextVNode) {
        if (!isSameVNode(lastVNode, nextVNode)) {
            replaceWithNewNode(lastVNode, nextVNode, parentDom, callback, context, isSVG);
        } else if (isElementVNode(lastVNode)) {
            patchElement(lastVNode, nextVNode, parentDom, callback, context, isSVG);
        } else if (isComponentVNode(lastVNode)) {
            patchComponent(lastVNode, nextVNode, parentDom, callback, context, isSVG);
        } else if (isTextVNode(lastVNode)) {
            patchText(lastVNode, nextVNode);
        } else if (isVoidVNode(lastVNode)) {
            patchVoid(lastVNode, nextVNode);
        }
    }

    if (isUndefCallbacks) {
        callback.notifyAll();
    }

    return nextVNode;
}

function unmountChildren$1(children, dom) {
    if (isVNode(children)) {
        unmount(children, dom);
    } else if (isArray(children)) {
        for (var i = 0; i < children.length; i++) {
            var child = children[i];

            if (!isInvalid(child)) {
                unmount(child, dom);
            }
        }
    } else {
        setTextContent(dom, '');
    }
}

function patchElement(lastVNode, nextVNode, parentDom, callback, context, isSVG) {
    var dom = lastVNode.dom;
    var hooks = nextVNode.hooks || {};
    var lastProps = lastVNode.props;
    var nextProps = nextVNode.props;
    var lastChildren = lastVNode.children;
    var nextChildren = nextVNode.children;
    var lastEvents = lastVNode.events;
    var nextEvents = nextVNode.events;
    var lastHtml = lastProps && lastProps.dangerouslySetInnerHTML && lastProps.dangerouslySetInnerHTML.__html;
    var nextHtml = nextProps && nextProps.dangerouslySetInnerHTML && nextProps.dangerouslySetInnerHTML.__html;

    nextVNode.dom = dom;

    if (hooks.beforeUpdate) {
        hooks.beforeUpdate(lastVNode, nextVNode);
    }

    var refsChanged = shouldUpdateRefs(lastVNode, nextVNode);
    if (refsChanged) {
        detachRef(lastVNode);
    }

    if (!isNullOrUndef(lastHtml) && isNullOrUndef(nextHtml)) {
        dom.innerHTML = '';
    }

    if (lastChildren !== nextChildren) {
        patchChildren(lastChildren, nextChildren, dom, callback, context, isSVG);
    }

    //processElement(dom, nextVNode);

    updateDOMProperty(lastVNode.props, nextVNode.props, isSVG, nextVNode);
    updateDOMEvents(lastVNode, nextVNode);

    if (!isNull(nextVNode.ref)) {
        callback.enqueue(function () {
            return attachRef(nextVNode);
        });
    }

    if (hooks.update) {
        callback.enqueue(function () {
            return hooks.update(nextVNode);
        });
    }
}

function patchChildren(lastChildren, nextChildren, dom, callback, context, isSVG) {
    if (isInvalid(nextChildren)) {
        unmountChildren$1(lastChildren, dom, callback);
    } else if (isInvalid(lastChildren)) {
        if (isArray(nextChildren)) {
            mountArrayChildren(nextChildren, dom, callback, context, isSVG);
        } else {
            mount(nextChildren, dom, callback, context, isSVG);
        }
    } else if (!isArray(lastChildren) && !isArray(nextChildren)) {
        patch(lastChildren, nextChildren, dom, callback, context, isSVG);
    } else {
        updateChildren(toArray(lastChildren), toArray(nextChildren), dom, callback, context, isSVG);
    }
}

function createKeyToOldIdx(children, beginIdx, endIdx) {
    var i,
        map$$1 = {},
        key;
    for (i = beginIdx; i <= endIdx; ++i) {
        key = children[i].key;
        if (!isNullOrUndef(key)) {
            if (isDefined(map$$1[key])) {
                throwError('key must be unique.');
            }
            map$$1[key] = i;
        }
    }
    return map$$1;
}

function updateChildren(oldCh, newCh, parentElm, callback, context, isSVG) {
    var oldStartIdx = 0,
        newStartIdx = 0;
    var oldEndIdx = oldCh.length - 1;
    var oldStartVnode = oldCh[0];
    var oldEndVnode = oldCh[oldEndIdx];
    var newEndIdx = newCh.length - 1;
    var newStartVnode = newCh[0];
    var newEndVnode = newCh[newEndIdx];
    var oldKeyToIdx, idxInOld, elmToMove, before;

    var newChilds = Array(newCh.length);

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        if (isUndefined(oldStartVnode)) {
            oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
        } else if (isUndefined(oldEndVnode)) {
            oldEndVnode = oldCh[--oldEndIdx];
        } else if (isSameVNode(oldStartVnode, newStartVnode)) {
            patch(oldStartVnode, newStartVnode, parentElm, callback, context, isSVG);
            oldStartVnode = oldCh[++oldStartIdx];
            newStartVnode = newCh[++newStartIdx];
        } else if (isSameVNode(oldEndVnode, newEndVnode)) {
            patch(oldEndVnode, newEndVnode, parentElm, callback, context, isSVG);
            oldEndVnode = oldCh[--oldEndIdx];
            newEndVnode = newCh[--newEndIdx];
        } else if (isSameVNode(oldStartVnode, newEndVnode)) {
            // Vnode moved right
            insertBefore(parentElm, oldStartVnode.dom, nextSibling(oldEndVnode.dom));
            patch(oldStartVnode, newEndVnode, parentElm, callback, context, isSVG);
            oldStartVnode = oldCh[++oldStartIdx];
            newEndVnode = newCh[--newEndIdx];
        } else if (isSameVNode(oldEndVnode, newStartVnode)) {
            // Vnode moved left
            insertBefore(parentElm, oldEndVnode.dom, oldStartVnode.dom);
            patch(oldEndVnode, newStartVnode, parentElm, callback, context, isSVG);
            oldEndVnode = oldCh[--oldEndIdx];
            newStartVnode = newCh[++newStartIdx];
        } else {
            if (isUndefined(oldKeyToIdx)) {
                oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
            }

            idxInOld = oldKeyToIdx[newStartVnode.key];

            if (isUndefined(idxInOld) || isUndefined(oldCh[idxInOld])) {
                // New element
                var dom = mount(newCh[newStartIdx], null, callback, context, isSVG);
                insertBefore(parentElm, dom, oldStartVnode.dom);
                newStartVnode = newCh[++newStartIdx];
            } else {
                elmToMove = oldCh[idxInOld];
                insertBefore(parentElm, elmToMove.dom, oldStartVnode.dom);
                patch(elmToMove, newStartVnode, parentElm, callback, context, isSVG);
                oldCh[idxInOld] = undefined;
                newStartVnode = newCh[++newStartIdx];
            }
        }
    }

    if (oldStartIdx > oldEndIdx) {
        // New element
        before = isUndefined(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].dom;
        for (; newStartIdx <= newEndIdx; newStartIdx++) {
            var dom = mount(newCh[newStartIdx], null, callback, context, isSVG);
            insertBefore(parentElm, dom, before);
        }
    } else if (newStartIdx > newEndIdx) {
        // Remove element
        for (; oldStartIdx <= oldEndIdx; oldStartIdx++) {

            if (isDefined(oldCh[oldStartIdx])) {
                unmount(oldCh[oldStartIdx], parentElm);
            }
        }
    }
}

function patchText(lastVNode, nextVNode) {
    var nextText = nextVNode.children;
    var dom = lastVNode.dom;

    nextVNode.dom = dom;

    if (lastVNode.children !== nextText) {
        dom.nodeValue = nextText;
    }
}

function patchVoid(lastVNode, nextVNode) {
    nextVNode.dom = lastVNode.dom;
}

function patchComponent(lastVNode, nextVNode, parentDom, callback, context, isSVG) {
    var nextType = nextVNode.type;
    var nextProps = nextVNode.props;
    var isClass = isStatefulComponent(nextType);
    var hooks = nextVNode.hooks || {};

    if (isClass) {
        var inst = lastVNode._instance;
        var lastChildren = lastVNode.children;
        var lastProps = inst.props;
        var lastState = inst.state;
        var lastContext = inst.context;
        var nextChildren = void 0,
            childContext = void 0,
            shouldUpdate = false;

        nextVNode.dom = lastVNode.dom;
        nextVNode.children = lastChildren;
        nextVNode._instance = inst;
        inst._isSVG = isSVG;

        nextChildren = inst._updateComponent(lastProps, nextProps, context);

        childContext = inst.getChildContext();

        if (!isNullOrUndef(childContext)) {
            childContext = assign({}, context, childContext);
        } else {
            childContext = context;
        }

        if (nextChildren !== emptyObject) {
            nextVNode.children = nextChildren;
            normalizeComponentChildren(nextVNode);
            nextChildren = nextVNode.children;
            shouldUpdate = true;
        }

        inst._childContext = childContext;
        inst._vNode = nextVNode;
        //inst._renderedVNode = nextChildren;

        if (shouldUpdate) {

            if (hooks.beforeUpdate) {
                hooks.beforeUpdate(lastVNode, nextVNode);
            }

            var refsChanged = shouldUpdateRefs(lastVNode, nextVNode);
            if (refsChanged) {
                detachRef(lastVNode);
            }

            patch(lastChildren, nextChildren, parentDom, callback, childContext, isSVG);
            nextVNode.dom = nextChildren.dom;

            if (!isNull(nextVNode.ref)) {
                callback.enqueue(function () {
                    return attachRef(nextVNode);
                });
            }

            if (inst.componentDidUpdate) {
                callback.enqueue(function () {
                    return inst.componentDidUpdate(lastProps, lastState, lastContext, nextVNode.dom);
                });
            }

            if (!isNullOrUndef(hooks.update)) {
                callback.enqueue(function () {
                    return hooks.update(nextVNode);
                });
            }
        }

        if (inst._pendingCallbacks) {
            callback.enqueue(function () {
                return inst._processPendingCallbacks();
            });
        }
    } else {
        var _shouldUpdate = true;
        var _lastProps = lastVNode.props;
        var _lastChildren = lastVNode.children;
        var _nextChildren = _lastChildren;

        nextVNode.dom = lastVNode.dom;
        nextVNode.children = _nextChildren;

        if (!isNullOrUndef(nextProps.onComponentShouldUpdate)) {
            _shouldUpdate = nextProps.onComponentShouldUpdate(_lastProps, nextProps, context);
        }

        if (_shouldUpdate !== false) {
            var _refsChanged = shouldUpdateRefs(lastVNode, nextVNode);
            if (_refsChanged) {
                detachRef(lastVNode);
            }

            if (!isNullOrUndef(nextProps.onComponentWillUpdate)) {
                nextProps.onComponentWillUpdate(_lastProps, nextProps, nextVNode);
            }
            nextVNode.children = nextType(nextProps, context);

            normalizeComponentChildren(nextVNode);

            _nextChildren = nextVNode.children;

            if (hooks.beforeUpdate) {
                hooks.beforeUpdate(lastVNode, nextVNode);
            }

            patch(_lastChildren, _nextChildren, parentDom, callback, context, isSVG);
            nextVNode.dom = _nextChildren.dom;

            if (!isNull(nextVNode.ref)) {
                callback.enqueue(function () {
                    return attachRef(nextVNode);
                });
            }

            if (!isNullOrUndef(nextProps.onComponentDidUpdate)) {
                callback.enqueue(function () {
                    return nextProps.onComponentDidUpdate(nextVNode);
                });
            }

            if (!isNullOrUndef(hooks.update)) {
                callback.enqueue(function () {
                    return hooks.update(nextVNode);
                });
            }
        }
    }
}

function _patch(lastVNode, nextVNode) {
    if (!isInvalid(lastVNode)) {
        if (isDOM(lastVNode)) {
            render(nextVNode, lastVNode);
        } else if (isVNode(lastVNode) && isVNode(nextVNode)) {
            if (lastVNode.dom) {
                patch(lastVNode, nextVNode);
                if (lastVNode.parentVNode) {
                    assign(lastVNode, nextVNode);
                }
            } else {
                throwError('patch error vNode');
            }
        }

        return nextVNode;
    }
}

function render(vNode, parentDom) {
    if (document.body === parentDom) {
        warning('you cannot render() to the "document.body". Use an empty element as a container instead.');
    }

    var lastVnode = parentDom.__NeactRootNode;

    if (!lastVnode) {
        if (!isInvalid(vNode) && isVNode(vNode)) {
            mount(vNode, parentDom, null, {});
            parentDom.__NeactRootNode = vNode;
            return vNode._instance || vNode.dom;
        } else {
            throwError('isInvalid VNode');
        }
    } else {
        if (isInvalid(vNode)) {
            unmount(lastVnode, parentDom);
            parentDom.__NeactRootNode = null;
            delete parentDom.__NeactRootNode;
        } else if (isVNode(vNode)) {
            patch(lastVnode, vNode);
            parentDom.__NeactRootNode = vNode;
            return vNode._instance || vNode.dom;
        } else {
            throwError('isInvalid VNode');
        }
    }
}

function unmountComponentAtNode(dom) {
    if (dom.__NeactRootNode) {
        unmount(dom.__NeactRootNode, dom);
        delete dom.__NeactRootNode;
    }
}

function findDOMNode(vNode) {
    if (!isInvalid(isVNode)) {
        if (isVNode(vNode)) {
            return vNode.dom;
        } else if (vNode._vNode) {
            return vNode._vNode.dom;
        }
    }
    return null;
}

var hasOwnProperty = Object.prototype.hasOwnProperty;
var nativeKeys = Object.keys;

function keys(obj) {
    if (nativeKeys) {
        return nativeKeys(obj);
    }

    var keys = [];

    for (var key in obj) {
        keys.push(key);
    }

    return keys;
}

/**
 * inlined Object.is polyfill to avoid requiring consumers ship their own
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
 */
function is(x, y) {
    // SameValue algorithm
    if (x === y) {
        // Steps 1-5, 7-10
        // Steps 6.b-6.e: +0 != -0
        // Added the nonzero y check to make Flow happy, but it is redundant
        return x !== 0 || y !== 0 || 1 / x === 1 / y;
    } else {
        // Step 6.a: NaN == NaN
        return x !== x && y !== y;
    }
}

/**
 * Performs equality by iterating through keys on an object and returning false
 * when any key has values which are not strictly equal between the arguments.
 * Returns true when the values of all keys are strictly equal.
 */
function shallowEqual(objA, objB) {
    if (is(objA, objB)) {
        return true;
    }

    if (!isObject(objA) || objA === null || !isObject(objB) || objB === null) {
        return false;
    }

    var keysA = keys(objA);
    var keysB = keys(objB);

    if (keysA.length !== keysB.length) {
        return false;
    }

    // Test for A's keys different from B.
    for (var i = 0; i < keysA.length; i++) {
        if (!hasOwnProperty.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
            return false;
        }
    }

    return true;
}

function updateParentComponentVNodes(vNode, dom) {
    var parentVNode = vNode.parentVNode;

    if (parentVNode && !isString(parentVNode.type)) {
        parentVNode.dom = dom;
        updateParentComponentVNodes(parentVNode, dom);
    }
}

function enqueueSetState(component, newState, callback) {
    var sync = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    if (!isNullOrUndef(newState)) {
        var queue = component._pendingStateQueue || (component._pendingStateQueue = []);
        queue.push(newState);
    }

    if (callback) {
        var _queue = component._pendingCallbacks || (component._pendingCallbacks = []);
        _queue.push(callback);
    }

    if (!component._pendingSetState || sync) {
        applyState(component, false, callback);
    }
}

function applyState(inst, callback) {
    var vNode = inst._vNode;
    var parentDom = vNode.dom.parentNode;
    var hooks = vNode.hooks || {};
    var state = inst.state;
    var lastChildren = vNode.children;
    var props = inst.props;
    var context = inst.context;
    var childContext = inst.getChildContext();
    var nextChildren = void 0,
        shouldUpdate = false;

    nextChildren = inst._updateComponent(props, props, context);

    if (nextChildren !== emptyObject) {
        vNode.children = nextChildren;
        normalizeComponentChildren(vNode);
        nextChildren = vNode.children;
        shouldUpdate = true;
    }

    if (shouldUpdate) {

        if (hooks.beforeUpdate) {
            hooks.beforeUpdate(vNode, vNode);
        }

        if (!isNullOrUndef(childContext)) {
            childContext = assign({}, context, inst._childContext, childContext);
        } else {
            childContext = assign({}, context, inst._childContext);
        }

        var callbacks = inst._callbacks;

        patch(lastChildren, nextChildren, parentDom, callbacks, childContext, inst._isSVG);

        var dom = vNode.dom = nextChildren.dom;

        updateParentComponentVNodes(vNode, dom);

        callbacks.notifyAll();

        if (inst.componentDidUpdate) {
            inst.componentDidUpdate(props, state);
        }

        if (!isNullOrUndef(hooks.update)) {
            hooks.update(vNode);
        }
    }

    if (inst._pendingCallbacks) {
        inst._processPendingCallbacks();
    }

    if (isFunction(callback)) {
        callback();
    }
}

function Component(props, context) {
    this.state = {};
    this.refs = {};
    this.props = props || {};
    this.context = context || {};
}

assign(Component.prototype, {
    _vNode: null,
    _unmounted: true,
    _callbacks: null,
    _isSVG: false,
    _childContext: null,
    _pendingStateQueue: null,
    _pendingCallbacks: null,
    _pendingReplaceState: false,
    _pendingForceUpdate: false,
    _pendingSetState: false,
    _disabledSetState: false,
    _ignoreSetState: false,
    //_renderedVNode: null,

    render: function () {},
    forceUpdate: function (callback) {
        if (this._unmounted) {
            return;
        }
        this._pendingForceUpdate = true;

        enqueueSetState(this, null, callback);
    },
    setState: function (newState, callback) {
        if (this._unmounted) {
            return;
        }
        if (!this._disabledSetState) {
            if (!this._ignoreSetState) {
                enqueueSetState(this, newState, callback);
            } else {
                warning('ignore update state via setState(...) in shouldComponentUpdate() or render().');
            }
        } else {
            throwError('cannot update state via setState(...) in componentWillUpdate().');
        }
    },
    replaceState: function (newState, callback) {
        if (this._unmounted) {
            return;
        }
        this._pendingReplaceState = true;
        this.setState(newState, callback);
    },
    setStateSync: function (newState, callback) {
        if (this._unmounted) {
            return;
        }
        if (!this._disabledSetState) {
            if (!this._ignoreSetState) {
                enqueueSetState(this, newState, callback, true);
            } else {
                warning('ignore update state via setState(...) in shouldComponentUpdate() or render().');
            }
        } else {
            throwError('cannot update state via setState(...) in componentWillUpdate().');
        }
    },
    getChildContext: function () {},
    _updateComponent: function (prevProps, nextProps, context) {
        var inst = this;
        if (this._unmounted === true) {
            throwError();
        }

        var willReceive = false;
        var children = emptyObject;
        var shouldUpdate = true;

        if (prevProps !== nextProps) {
            willReceive = true;
        }

        if (willReceive && inst.componentWillReceiveProps) {
            inst._pendingSetState = true;
            inst.componentWillReceiveProps(nextProps, context);
            inst._pendingSetState = false;
        }

        var prevState = inst.state;
        var nextState = inst._processPendingState(nextProps, context);

        inst._ignoreSetState = true;

        if (!inst._pendingForceUpdate) {
            if (inst.shouldComponentUpdate) {
                shouldUpdate = inst.shouldComponentUpdate(nextProps, nextState, context);
            } else {
                if (inst._isPureComponent) {
                    shouldUpdate = !shallowEqual(prevProps, nextProps) || !shallowEqual(inst.state, nextState);
                }
            }
        }

        if (shouldUpdate !== false) {
            inst._pendingForceUpdate = false;

            if (inst.componentWillUpdate) {
                inst._disabledSetState = true;
                inst.componentWillUpdate(nextProps, nextState, context);
                inst._disabledSetState = false;
            }
            inst.props = nextProps;
            inst.state = nextState;
            inst.context = context;
            CurrentOwner.current = inst;
            children = inst.render(inst.props, inst.state, inst.context);
            CurrentOwner.current = null;
        }

        inst._ignoreSetState = false;

        return children;
    },
    _processPendingState: function (props, context) {
        var inst = this;
        var queue = this._pendingStateQueue;
        var replace = this._pendingReplaceState;
        this._pendingReplaceState = false;
        this._pendingStateQueue = null;

        if (!queue) {
            return inst.state;
        }

        if (replace && queue.length === 1) {
            return queue[0];
        }

        var nextState = assign({}, replace ? queue[0] : inst.state);
        for (var i = replace ? 1 : 0; i < queue.length; i++) {
            var partial = queue[i];
            assign(nextState, typeof partial === 'function' ? partial.call(inst, nextState, props, context) : partial);
        }

        return nextState;
    },
    _processPendingCallbacks: function () {
        var callbacks = this._pendingCallbacks;
        this._pendingCallbacks = null;
        if (callbacks) {
            for (var j = 0; j < callbacks.length; j++) {
                var cb = callbacks[j];
                if (typeof cb === 'function') {
                    cb.call(this);
                }
            }
        }
    }
});

function createClass(spec) {
    function Constructor(props, context) {
        this.state = {};
        this.refs = {};
        this.props = props || {};
        this.context = context || {};

        if (this.construct) {
            this.construct(props, context);
            return;
        }

        var initialState = this.getInitialState ? this.getInitialState(this.props, this.context) : null;

        if (!(isObject(initialState) && !isArray(initialState))) {
            new TypeError('getInitialState(): must return an object or null');
        }

        this.state = initialState;
    }

    inherits(Constructor, Component, spec);

    Constructor.prototype.constructor = Constructor;

    if (spec.getDefaultProps) {
        Constructor.defaultProps = spec.getDefaultProps();
    }

    if (!spec.render) {
        throw new TypeError('createClass(...): Class specification must implement a `render` method.');
    }

    return Constructor;
}

function PureComponent(props, context) {
    this.state = {};
    this.refs = {};
    this.props = props || {};
    this.context = context || {};
}

function ComponentDummy() {}
ComponentDummy.prototype = Component.prototype;
PureComponent.prototype = new ComponentDummy();
PureComponent.prototype.constructor = PureComponent;

PureComponent.prototype._isPureComponent = true;

var utils = {
    map: map,
    each: each,
    inherits: inherits,
    bind: bind,
    assign: assign,
    toArray: toArray,
    flatten: flatten,
    filter: filter
};

var Children = {
    map: function (obj, cb, ctx) {
        if (isNullOrUndef(obj)) return;
        return map(toArray(obj), cb, ctx);
    },
    forEach: function (obj, cb, ctx) {
        if (isNullOrUndef(obj)) return;
        each(toArray(obj), cb, ctx);
    },
    count: function (children) {
        return toArray(children).length;
    },
    only: function (children) {
        children = Children.toArray(children);
        if (children.length !== 1) {
            throw new Error('Children.only() expects only one child.');
        }
        return children[0];
    },

    toArray: toArray
};

exports.render = render;
exports.patch = _patch;
exports.findDOMNode = findDOMNode;
exports.unmountComponentAtNode = unmountComponentAtNode;
exports.Children = Children;
exports.createElement = createElement;
exports.createVNode = createVNode;
exports.createTextVNode = createTextVNode;
exports.cloneElement = cloneElement;
exports.isValidElement = isVNode;
exports.processDOMPropertyHooks = processDOMPropertyHooks;
exports.createClass = createClass;
exports.Component = Component;
exports.PureComponent = PureComponent;
exports.utils = utils;

})));
//# sourceMappingURL=neact.js.map
