'use strict';

exports.__esModule = true;
exports.utils = exports.PureComponent = exports.Component = exports.createClass = exports.processDOMPropertyHooks = exports.isValidElement = exports.cloneElement = exports.createTextVNode = exports.createVNode = exports.createElement = exports.Children = exports.unmountComponentAtNode = exports.findDOMNode = exports.patch = exports.render = undefined;

var _NeactRender = require('./NeactRender');

var _processDOMPropertyHooks = require('./processDOMPropertyHooks');

var _processDOMPropertyHooks2 = _interopRequireDefault(_processDOMPropertyHooks);

var _NeactElement = require('./NeactElement');

var _NeactClass = require('./NeactClass');

var _NeactComponent = require('./NeactComponent');

var _NeactComponent2 = _interopRequireDefault(_NeactComponent);

var _NeactPureComponent = require('./NeactPureComponent');

var _NeactPureComponent2 = _interopRequireDefault(_NeactPureComponent);

var _NeactUtils = require('./NeactUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var utils = {
    map: _NeactUtils.map,
    each: _NeactUtils.each,
    inherits: _NeactUtils.inherits,
    bind: _NeactUtils.bind,
    assign: _NeactUtils.assign,
    toArray: _NeactUtils.toArray,
    flatten: _NeactUtils.flatten,
    filter: _NeactUtils.filter
};

var Children = {
    map: function (obj, cb, ctx) {
        if ((0, _NeactUtils.isNullOrUndef)(obj)) return;
        return (0, _NeactUtils.map)((0, _NeactUtils.toArray)(obj), cb, ctx);
    },
    forEach: function (obj, cb, ctx) {
        if ((0, _NeactUtils.isNullOrUndef)(obj)) return;
        (0, _NeactUtils.each)((0, _NeactUtils.toArray)(obj), cb, ctx);
    },
    count: function (children) {
        return (0, _NeactUtils.toArray)(children).length;
    },
    only: function (children) {
        children = Children.toArray(children);
        if (children.length !== 1) {
            throw new Error('Children.only() expects only one child.');
        }
        return children[0];
    },

    toArray: _NeactUtils.toArray
};

exports.render = _NeactRender.render;
exports.patch = _NeactRender._patch;
exports.findDOMNode = _NeactRender.findDOMNode;
exports.unmountComponentAtNode = _NeactRender.unmountComponentAtNode;
exports.Children = Children;
exports.createElement = _NeactElement.createElement;
exports.createVNode = _NeactElement.createVNode;
exports.createTextVNode = _NeactElement.createTextVNode;
exports.cloneElement = _NeactElement.cloneElement;
exports.isValidElement = _NeactElement.isValidElement;
exports.processDOMPropertyHooks = _processDOMPropertyHooks2['default'];
exports.createClass = _NeactClass.createClass;
exports.Component = _NeactComponent2['default'];
exports.PureComponent = _NeactPureComponent2['default'];
exports.utils = utils;