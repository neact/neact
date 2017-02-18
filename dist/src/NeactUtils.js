'use strict';

exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.toArray = toArray;
exports.isStatefulComponent = isStatefulComponent;
exports.isStringOrNumber = isStringOrNumber;
exports.isNullOrUndef = isNullOrUndef;
exports.isInvalid = isInvalid;
exports.isFunction = isFunction;
exports.isAttrAnEvent = isAttrAnEvent;
exports.isString = isString;
exports.isNumber = isNumber;
exports.isNull = isNull;
exports.isTrue = isTrue;
exports.isUndefined = isUndefined;
exports.isDefined = isDefined;
exports.isObject = isObject;
exports.isDOM = isDOM;
exports.throwError = throwError;
exports.warning = warning;
exports.inherits = inherits;
exports.each = each;
exports.map = map;
exports.filter = filter;
exports.bind = bind;
exports.assign = assign;
var ArrayProto = Array.prototype;
var nativeForEach = ArrayProto.forEach;
var nativeMap = ArrayProto.map;
var nativeFilter = ArrayProto.filter;

var objToString = Object.prototype.toString;

var emptyObject = exports.emptyObject = {};

var isArray = exports.isArray = Array.isArray || function (s) {
    return objToString.call(s) === '[object Array]';
};

function toArray(obj) {
    return isArray(obj) ? obj : [obj];
}

function isStatefulComponent(o) {
    return !isUndefined(o.prototype) && !isUndefined(o.prototype.render);
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

function isString(obj) {
    return typeof obj === 'string';
}

function isNumber(obj) {
    return typeof obj === 'number';
}

function isNull(obj) {
    return obj === null;
}

function isTrue(obj) {
    return obj === true;
}

function isUndefined(obj) {
    return obj === undefined;
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

function throwError(message) {
    if (!message) {
        message = 'a runtime error occured!';
    }
    throw new Error('Neact Error: ' + message);
}

function warning(message) {
    console && console.warn(message);
}

var EMPTY_OBJ = exports.EMPTY_OBJ = {};

function inherits(cls, base, proto) {
    var clsProto = cls.prototype;

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

var flatten = exports.flatten = function (input) {
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
};