'use strict';

exports.__esModule = true;
exports.unmount = unmount;
exports.unmountElement = unmountElement;
exports.unmountComponent = unmountComponent;

var _NeactElement = require('./NeactElement');

var _NeactUtils = require('./NeactUtils');

var _NeactRefs = require('./NeactRefs');

var _NeactDOMUtils = require('./NeactDOMUtils');

var _processDOMEvents = require('./processDOMEvents');

var _CallbackQueue = require('./CallbackQueue');

var _CallbackQueue2 = _interopRequireDefault(_CallbackQueue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function unmount(vNode, parentDom, callback) {
    var isUndefCallbacks = (0, _NeactUtils.isNullOrUndef)(callback);
    callback = callback || new _CallbackQueue2['default']();

    if ((0, _NeactElement.isElementVNode)(vNode)) {
        unmountElement(vNode, parentDom, callback);
    } else if ((0, _NeactElement.isVoidVNode)(vNode) || (0, _NeactElement.isTextVNode)(vNode)) {
        unmountVoidOrText(vNode, parentDom);
    } else if ((0, _NeactElement.isComponentVNode)(vNode)) {
        unmountComponent(vNode, parentDom, callback);
    }

    if (isUndefCallbacks) {
        callback.notifyAll();
    }
}

function unmountVoidOrText(vNode, parentDom) {
    if (parentDom) {
        (0, _NeactDOMUtils.removeChild)(parentDom, vNode.dom);
    }
}

function unmountElement(vNode, parentDom, callback) {
    var dom = vNode.dom;
    var events = vNode.events;
    var hooks = vNode.hooks || {};
    var children = vNode.children;

    if (!(0, _NeactUtils.isNull)(vNode.ref)) {
        (0, _NeactRefs.detachRef)(vNode);
    }

    (0, _processDOMEvents.destroyDOMEvents)(vNode);

    if (parentDom) {
        (0, _NeactDOMUtils.removeChild)(parentDom, dom);
    }

    if (!(0, _NeactUtils.isNullOrUndef)(children)) {
        unmountChildren(children, callback);
    }

    if (hooks.destroy) {
        hooks.destroy(vNode);
    }
}

function unmountChildren(children, callback) {
    if ((0, _NeactUtils.isArray)(children)) {
        for (var i = 0; i < children.length; i++) {
            var child = children[i];

            if (!(0, _NeactUtils.isInvalid)(child) && (0, _NeactElement.isVNode)(child)) {
                unmount(child, null, callback);
            }
        }
    } else if ((0, _NeactElement.isVNode)(children)) {
        unmount(children, null, callback);
    }
}

function unmountComponent(vNode, parentDom, callback) {
    var inst = vNode._instance;
    var isClass = (0, _NeactUtils.isStatefulComponent)(vNode.type);
    var children = vNode.children;
    var props = vNode.props;
    var hooks = vNode.hooks || {};
    var dom = vNode.dom;

    if (parentDom) {
        (0, _NeactDOMUtils.removeChild)(parentDom, vNode.dom);
    }

    if (isClass) {
        if (!inst._unmounted) {
            inst._ignoreSetState = true;
            //TODO: beforeUnmount
            if (inst.componentWillUnmount) {
                inst.componentWillUnmount();
            }

            if (!(0, _NeactUtils.isNull)(vNode.ref)) {
                (0, _NeactRefs.detachRef)(vNode);
            }

            unmount(children, null, callback);

            inst._unmounted = true;
            inst._ignoreSetState = false;
        }
    } else {
        if (!(0, _NeactUtils.isNullOrUndef)(props.onComponentWillUnmount)) {
            props.onComponentWillUnmount(vNode);
        }

        unmount(children, null, callback);
    }

    if (hooks.destroy) {
        hooks.destroy(vNode);
    }
}