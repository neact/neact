'use strict';

exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.mount = mount;
exports.mountText = mountText;
exports.mountVoid = mountVoid;
exports.mountElement = mountElement;
exports.mountArrayChildren = mountArrayChildren;
exports.mountComponent = mountComponent;
exports.normalizeComponentChildren = normalizeComponentChildren;

var _NeactElement = require('./NeactElement');

var _CallbackQueue = require('./CallbackQueue');

var _CallbackQueue2 = _interopRequireDefault(_CallbackQueue);

var _NeactCurrentOwner = require('./NeactCurrentOwner');

var _NeactCurrentOwner2 = _interopRequireDefault(_NeactCurrentOwner);

var _NeactUtils = require('./NeactUtils');

var _NeactDOMUtils = require('./NeactDOMUtils');

var _NeactRefs = require('./NeactRefs');

var _createNeactComponent = require('./createNeactComponent');

var _createNeactComponent2 = _interopRequireDefault(_createNeactComponent);

var _processElement = require('./processElement');

var _processElement2 = _interopRequireDefault(_processElement);

var _processDOMProperty = require('./processDOMProperty');

var _processDOMEvents = require('./processDOMEvents');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function mount(vNode, parentDom, callback, context, isSVG) {
    var isUndefCallbacks = (0, _NeactUtils.isNullOrUndef)(callback);
    var r = void 0;
    callback = callback || new _CallbackQueue2['default']();

    if ((0, _NeactElement.isElementVNode)(vNode)) {
        r = mountElement(vNode, parentDom, callback, context, isSVG);
    } else if ((0, _NeactElement.isTextVNode)(vNode)) {
        r = mountText(vNode, parentDom);
    } else if ((0, _NeactElement.isComponentVNode)(vNode)) {
        r = mountComponent(vNode, parentDom, callback, context, isSVG);
    } else if ((0, _NeactElement.isVoidVNode)(vNode)) {
        r = mountVoid(vNode, parentDom);
    } else {
        (0, _NeactUtils.throwError)('mount() expects a valid VNode, instead it received an object with the type "' + (typeof vNode === 'undefined' ? 'undefined' : _typeof(vNode)) + '".');
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
        (0, _NeactDOMUtils.appendChild)(parentDom, dom);
    }
    return dom;
}

function mountVoid(vNode, parentDom) {
    var dom = document.createComment('emptyNode');

    vNode.dom = dom;
    if (parentDom) {
        (0, _NeactDOMUtils.appendChild)(parentDom, dom);
    }
    return dom;
}

function mountElement(vNode, parentDom, callback, context, isSVG) {
    var tag = vNode.type;

    if (!isSVG) {
        isSVG = vNode.isSVG;
    }

    var dom = (0, _NeactDOMUtils.documentCreateElement)(tag, isSVG);
    var children = vNode.children;
    var props = vNode.props;
    var events = vNode.events;
    var hooks = vNode.hooks || {};

    if (!(0, _NeactUtils.isNull)(parentDom)) {
        (0, _NeactDOMUtils.appendChild)(parentDom, dom);
    }

    vNode.dom = dom;

    if (!(0, _NeactUtils.isNullOrUndef)(hooks.beforeCreate)) {
        hooks.beforeCreate(vNode);
    }

    (0, _processElement2['default'])(dom, vNode);

    (0, _processDOMProperty.createDOMProperty)(props, isSVG, vNode);
    (0, _processDOMEvents.createDOMEvents)(vNode);

    if (!(0, _NeactUtils.isNull)(children)) {
        if ((0, _NeactUtils.isArray)(children)) {
            mountArrayChildren(children, dom, callback, context, isSVG);
        } else if ((0, _NeactElement.isVNode)(children)) {
            mount(children, dom, callback, context, isSVG);
        }
    }

    if (!(0, _NeactUtils.isNull)(vNode.ref)) {
        callback.enqueue(function () {
            return (0, _NeactRefs.attachRef)(vNode);
        });
    }

    //if (!isNull(parentDom)) {
    //    appendChild(parentDom, dom);
    //}

    if (!(0, _NeactUtils.isNullOrUndef)(hooks.create)) {
        callback.enqueue(function () {
            return hooks.create(vNode);
        });
    }
    return dom;
}

function mountArrayChildren(children, dom, callback, context, isSVG) {
    for (var i = 0; i < children.length; i++) {
        var child = children[i];

        if (!(0, _NeactUtils.isInvalid)(child)) {
            mount(child, dom, callback, context, isSVG);
        }
    }
}

function mountComponent(vNode, parentDom, callback, context, isSVG) {
    var type = vNode.type;
    var props = vNode.props;
    var hooks = vNode.hooks || {};
    var isClass = (0, _NeactUtils.isStatefulComponent)(type);
    var dom = void 0,
        children = void 0;

    if (isClass) {
        var inst = (0, _createNeactComponent2['default'])(vNode, context, isSVG);
        vNode._instance = inst;

        inst._pendingSetState = true;

        if (inst.componentWillMount) {
            inst.componentWillMount();
            if (inst._pendingStateQueue) {
                inst.state = inst._processPendingState(inst.props, inst.context);
            }
        }

        inst._ignoreSetState = true;
        _NeactCurrentOwner2['default'].current = inst;
        vNode.children = inst.render();
        _NeactCurrentOwner2['default'].current = null;
        inst._ignoreSetState = false;
        normalizeComponentChildren(vNode);
        inst._vNode = vNode;
        inst._renderedVNode = vNode.children;
        inst._pendingSetState = false;

        vNode.dom = dom = mount(vNode.children, parentDom, callback, inst._childContext, isSVG);

        inst._callbacks = new _CallbackQueue2['default']();

        if (!(0, _NeactUtils.isNull)(vNode.ref)) {
            callback.enqueue(function () {
                return (0, _NeactRefs.attachRef)(vNode);
            });
        }

        if (inst.componentDidMount) {
            callback.enqueue(function () {
                return inst.componentDidMount();
            });
        }

        if (!(0, _NeactUtils.isNullOrUndef)(hooks.create)) {
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
        if (!(0, _NeactUtils.isNullOrUndef)(props.onComponentWillMount)) {
            props.onComponentWillMount(vNode);
        }

        vNode.children = type(props, context);
        normalizeComponentChildren(vNode);
        vNode.dom = dom = mount(vNode.children, parentDom, callback, context, isSVG);

        if (!(0, _NeactUtils.isNullOrUndef)(props.onComponentDidMount)) {
            callback.enqueue(function () {
                return props.onComponentDidMount(vNode);
            });
        }

        if (!(0, _NeactUtils.isNullOrUndef)(hooks.create)) {
            callback.enqueue(function () {
                return hooks.create(vNode);
            });
        }
    }

    return dom;
}

function normalizeComponentChildren(vNode) {
    var children = vNode.children;

    if ((0, _NeactUtils.isArray)(children)) {
        (0, _NeactUtils.throwError)('a valid Neact VNode (or null) must be returned from a component render. You may have returned an array or an invalid object.');
    } else if ((0, _NeactUtils.isInvalid)(children)) {
        vNode.children = (0, _NeactElement.createVoidVNode)();
    } else if ((0, _NeactUtils.isStringOrNumber)(children)) {
        vNode.children = (0, _NeactElement.createTextVNode)(children);
    }

    vNode.children.parentVNode = vNode;

    return vNode;
}