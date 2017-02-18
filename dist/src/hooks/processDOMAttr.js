'use strict';

exports.__esModule = true;

exports['default'] = function (lastValue, nextValue, prop, isSVG, dom, vNode) {
    if (lastValue === nextValue) return;
    if (_constants.skipProps[prop]) {
        return;
    }
    if (_constants.booleanProps[prop]) {
        dom[prop] = nextValue ? true : false;
    } else if (_constants.strictProps[prop]) {
        var value = (0, _NeactUtils.isNullOrUndef)(nextValue) ? '' : nextValue;

        if (dom[prop] !== value) {
            dom[prop] = value;
        }
    } else {
        if ((0, _NeactUtils.isNullOrUndef)(nextValue)) {
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
                if (!(0, _NeactUtils.isNullOrUndef)(nextHtml)) {
                    dom.innerHTML = nextHtml;
                }
            }
        } else {
            var dehyphenProp = void 0;
            if (_constants.dehyphenProps[prop]) {
                dehyphenProp = _constants.dehyphenProps[prop];
            } else if (isSVG && prop.match(_constants.probablyKebabProps)) {
                dehyphenProp = prop.replace(/([a-z])([A-Z]|1)/g, _constants.kebabize);
                _constants.dehyphenProps[prop] = dehyphenProp;
            } else {
                dehyphenProp = prop;
            }
            var ns = _constants.namespaces[prop];

            if (ns) {
                dom.setAttributeNS(ns, dehyphenProp, nextValue);
            } else {
                dom.setAttribute(dehyphenProp, nextValue);
            }
        }
    }
};

var _NeactUtils = require('../NeactUtils');

var _constants = require('./constants');