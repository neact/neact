'use strict';

exports.__esModule = true;
exports.createDOMProperty = createDOMProperty;
exports.updateDOMProperty = updateDOMProperty;

var _NeactDOMUtils = require('./NeactDOMUtils');

var _NeactUtils = require('./NeactUtils');

var _processDOMPropertyHooks = require('./processDOMPropertyHooks');

var _processDOMPropertyHooks2 = _interopRequireDefault(_processDOMPropertyHooks);

var _processDOMStyle = require('./hooks/processDOMStyle');

var _processDOMStyle2 = _interopRequireDefault(_processDOMStyle);

var _processDOMAttr = require('./hooks/processDOMAttr');

var _processDOMAttr2 = _interopRequireDefault(_processDOMAttr);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var propertyHooks = (0, _NeactUtils.assign)({
    style: _processDOMStyle2['default'],
    __default__: _processDOMAttr2['default']
}, _processDOMPropertyHooks2['default']);

function createDOMProperty(props, isSVG, vNode) {
    updateDOMProperty(null, props, isSVG, vNode);
}

function updateDOMProperty(lastProps, nextProps, isSVG, vNode) {
    if (lastProps === nextProps) {
        return;
    }

    var dom = vNode.dom;

    lastProps = lastProps || _NeactUtils.emptyObject;
    nextProps = nextProps || _NeactUtils.emptyObject;

    if (nextProps !== _NeactUtils.emptyObject) {
        for (var prop in nextProps) {
            // do not add a hasOwnProperty check here, it affects performance
            //if (!nextProps.hasOwnProperty(prop)) continue;
            var nextValue = (0, _NeactUtils.isNullOrUndef)(nextProps[prop]) ? null : nextProps[prop];
            var lastValue = (0, _NeactUtils.isNullOrUndef)(lastProps[prop]) ? null : lastProps[prop];
            var hook = propertyHooks[prop] ? prop : '__default__';
            propertyHooks[hook](lastValue, nextValue, prop, isSVG, dom, vNode);
        }
    }
    if (lastProps !== _NeactUtils.emptyObject) {
        for (var _prop in lastProps) {
            if ((0, _NeactUtils.isNullOrUndef)(nextProps[_prop])) {
                //lastProps.hasOwnProperty(prop) && 
                var _lastValue = (0, _NeactUtils.isNullOrUndef)(lastProps[_prop]) ? null : lastProps[_prop];
                var _hook = propertyHooks[_prop] ? _prop : '__default__';
                propertyHooks[_hook](_lastValue, null, _prop, isSVG, dom, vNode);
            }
        }
    }
}