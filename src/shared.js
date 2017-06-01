'use strict';

var ArrayProto = Array.prototype;
var nativeForEach = ArrayProto.forEach;
var nativeMap = ArrayProto.map;
var nativeFilter = ArrayProto.filter;

var objToString = Object.prototype.toString;

export var emptyObject = {};

export var isArray = Array.isArray || function(s) {
    return objToString.call(s) === '[object Array]';
};

export function toArray(obj) {
    return isArray(obj) ? obj : [obj];
}

export function isUndefined(obj) {
    return obj === undefined;
}

export function isStatefulComponent(o) {
    return !isUndefined(o.prototype) && !isUndefined(o.prototype.render);
}

export function isString(obj) {
    return typeof obj === 'string';
}


export function isNumber(obj) {
    return typeof obj === 'number';
}

export function isTrue(obj) {
    return obj === true;
}

export function isNull(obj) {
    return obj === null;
}

export function isStringOrNumber(obj) {
    return isString(obj) || isNumber(obj);
}

export function isNullOrUndef(obj) {
    return isUndefined(obj) || isNull(obj);
}

export function isInvalid(obj) {
    return isNull(obj) || obj === false || isTrue(obj) || isUndefined(obj);
}

export function isFunction(obj) {
    return typeof obj === 'function';
}

export function isAttrAnEvent(attr) {
    return attr[0] === 'o' && attr[1] === 'n' && attr.length > 3;
}

export function isDefined(obj) {
    return obj !== undefined;
}

export function isObject(o) {
    return typeof o === 'object';
}

export function isDOM(obj) {
    return obj && obj.nodeType === 1 &&
        typeof(obj.nodeName) == 'string';
}

export function isVNode(VNode) {
    return VNode && isObject(VNode) && VNode.$$isVNode;
}

export function isSameVNode(vnode1, vnode2) {
    var isSame = vnode1.key === vnode2.key && vnode1.type === vnode2.type;
    return isSame;
}

export function isVoidVNode(vNode) {
    return vNode.type === '#comment';
}

export function isEmptyVNode(vNode) {
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

export function throwError(message) {
    if (!message) {
        message = 'a runtime error occured!';
    }
    throw new Error(`Neact Error: ${ message }`);
}

export function warning(msg) {
    if (console) {
        console.warn(msg);
    }
}

export const EMPTY_OBJ = {};

export function inherits(cls, base, proto) {
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
export function each(obj, cb, context) {
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
export function map(obj, cb, context) {
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
export function filter(obj, cb, context) {
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

export function bind(func, context) {
    return function() {
        func.apply(context, arguments);
    }
}

export var flatten = function(input) {
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

export function assign(target) {
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
};