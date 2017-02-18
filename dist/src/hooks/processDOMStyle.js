'use strict';

exports.__esModule = true;

exports['default'] = function (lastValue, nextValue, prop, isSVG, dom, vNode) {
    if (lastValue === nextValue) return;
    if ((0, _NeactUtils.isString)(nextValue)) {
        dom.style.cssText = nextValue;
        return;
    }

    var cur,
        name,
        elm = dom,
        domStyle = dom.style,
        oldStyle = lastValue,
        style = nextValue;

    if (!oldStyle && !style) return;
    oldStyle = oldStyle || _NeactUtils.emptyObject;
    style = style || _NeactUtils.emptyObject;
    var oldHasDel = 'delayed' in oldStyle;

    for (name in oldStyle) {
        if (!style[name]) {
            var expansion = _constants.hasShorthandPropertyBug && _constants.shorthandPropertyExpansions[name];
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
            name = _constants.styleFloatAccessor;
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

var _NeactUtils = require('../NeactUtils');

var _constants = require('./constants');

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

function dangerousStyleValue(name, value) {
    var isEmpty = value == null || typeof value === 'boolean' || value === '';
    if (isEmpty) {
        return '';
    }

    var isNonNumeric = isNaN(value);
    if (isNonNumeric || value === 0 || _constants.isUnitlessNumber[name]) {
        return '' + value; // cast to string
    }

    if (typeof value === 'string') {
        value = value.trim();
    }
    return value + 'px';
}