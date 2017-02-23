'use strict';

exports.__esModule = true;
exports.patch = patch;

var _NeactUtils = require('./NeactUtils');

var _NeactElement = require('./NeactElement');

var _NeactMount = require('./NeactMount');

var _NeactUnmount = require('./NeactUnmount');

var _NeactDOMUtils = require('./NeactDOMUtils');

var _NeactRefs = require('./NeactRefs');

var _CallbackQueue = require('./CallbackQueue');

var _CallbackQueue2 = _interopRequireDefault(_CallbackQueue);

var _processDOMProperty = require('./processDOMProperty');

var _processDOMEvents = require('./processDOMEvents');

var _processElement = require('./processElement');

var _processElement2 = _interopRequireDefault(_processElement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function patch(lastVNode, nextVNode, parentDom, callback, context, isSVG) {
    var isUndefCallbacks = (0, _NeactUtils.isNullOrUndef)(callback);
    callback = callback || new _CallbackQueue2['default']();

    if (lastVNode !== nextVNode) {
        if (!(0, _NeactElement.isSameVNode)(lastVNode, nextVNode)) {
            (0, _NeactDOMUtils.replaceWithNewNode)(lastVNode, nextVNode, parentDom, callback, context, isSVG);
        } else if ((0, _NeactElement.isElementVNode)(lastVNode)) {
            patchElement(lastVNode, nextVNode, parentDom, callback, context, isSVG);
        } else if ((0, _NeactElement.isComponentVNode)(lastVNode)) {
            patchComponent(lastVNode, nextVNode, parentDom, callback, context, isSVG);
        } else if ((0, _NeactElement.isTextVNode)(lastVNode)) {
            patchText(lastVNode, nextVNode);
        } else if ((0, _NeactElement.isVoidVNode)(lastVNode)) {
            patchVoid(lastVNode, nextVNode);
        }
    }

    if (isUndefCallbacks) {
        callback.notifyAll();
    }

    return nextVNode;
}

function unmountChildren(children, dom) {
    if ((0, _NeactElement.isVNode)(children)) {
        (0, _NeactUnmount.unmount)(children, dom);
    } else if ((0, _NeactUtils.isArray)(children)) {
        for (var i = 0; i < children.length; i++) {
            var child = children[i];

            if (!(0, _NeactUtils.isInvalid)(child)) {
                (0, _NeactUnmount.unmount)(child, dom);
            }
        }
    } else {
        (0, _NeactDOMUtils.setTextContent)(dom, '');
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

    nextVNode.dom = dom;

    if (hooks.beforeUpdate) {
        hooks.beforeUpdate(lastVNode, nextVNode);
    }

    var refsChanged = (0, _NeactRefs.shouldUpdateRefs)(lastVNode, nextVNode);
    if (refsChanged) {
        (0, _NeactRefs.detachRef)(lastVNode);
    }

    (0, _processElement2['default'])(dom, nextVNode);

    (0, _processDOMProperty.updateDOMProperty)(lastVNode.props, nextVNode.props, isSVG, nextVNode);
    (0, _processDOMEvents.updateDOMEvents)(lastVNode, nextVNode);

    if (lastChildren !== nextChildren) {
        patchChildren(lastChildren, nextChildren, dom, callback, context, isSVG);
    }

    if (!(0, _NeactUtils.isNull)(nextVNode.ref)) {
        callback.enqueue(function () {
            return (0, _NeactRefs.attachRef)(nextVNode);
        });
    }

    if (hooks.update) {
        callback.enqueue(function () {
            return hooks.update(nextVNode);
        });
    }
}

function patchChildren(lastChildren, nextChildren, dom, callback, context, isSVG) {
    if ((0, _NeactUtils.isInvalid)(nextChildren)) {
        unmountChildren(lastChildren, dom, callback);
    } else if ((0, _NeactUtils.isInvalid)(lastChildren)) {
        if ((0, _NeactUtils.isArray)(nextChildren)) {
            (0, _NeactMount.mountArrayChildren)(nextChildren, dom, callback, context, isSVG);
        } else {
            (0, _NeactMount.mount)(nextChildren, dom, callback, context, isSVG);
        }
    } else if (!(0, _NeactUtils.isArray)(lastChildren) && !(0, _NeactUtils.isArray)(nextChildren)) {
        patch(lastChildren, nextChildren, dom, callback, context, isSVG);
    } else {
        updateChildren((0, _NeactUtils.toArray)(lastChildren), (0, _NeactUtils.toArray)(nextChildren), dom, callback, context, isSVG);
    }
}

function createKeyToOldIdx(children, beginIdx, endIdx) {
    var i,
        map = {},
        key;
    for (i = beginIdx; i <= endIdx; ++i) {
        key = children[i].key;
        if (!(0, _NeactUtils.isNullOrUndef)(key)) {
            if ((0, _NeactUtils.isDefined)(map[key])) {
                (0, _NeactUtils.throwError)('key must be unique.');
            }
            map[key] = i;
        }
    }
    return map;
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
        if ((0, _NeactUtils.isUndefined)(oldStartVnode)) {
            oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
        } else if ((0, _NeactUtils.isUndefined)(oldEndVnode)) {
            oldEndVnode = oldCh[--oldEndIdx];
        } else if ((0, _NeactElement.isSameVNode)(oldStartVnode, newStartVnode)) {
            patch(oldStartVnode, newStartVnode, parentElm, callback, context, isSVG);
            oldStartVnode = oldCh[++oldStartIdx];
            newStartVnode = newCh[++newStartIdx];
        } else if ((0, _NeactElement.isSameVNode)(oldEndVnode, newEndVnode)) {
            patch(oldEndVnode, newEndVnode, parentElm, callback, context, isSVG);
            oldEndVnode = oldCh[--oldEndIdx];
            newEndVnode = newCh[--newEndIdx];
        } else if ((0, _NeactElement.isSameVNode)(oldStartVnode, newEndVnode)) {
            // Vnode moved right
            (0, _NeactDOMUtils.insertBefore)(parentElm, oldStartVnode.dom, (0, _NeactDOMUtils.nextSibling)(oldEndVnode.dom));
            patch(oldStartVnode, newEndVnode, parentElm, callback, context, isSVG);
            oldStartVnode = oldCh[++oldStartIdx];
            newEndVnode = newCh[--newEndIdx];
        } else if ((0, _NeactElement.isSameVNode)(oldEndVnode, newStartVnode)) {
            // Vnode moved left
            (0, _NeactDOMUtils.insertBefore)(parentElm, oldEndVnode.dom, oldStartVnode.dom);
            patch(oldEndVnode, newStartVnode, parentElm, callback, context, isSVG);
            oldEndVnode = oldCh[--oldEndIdx];
            newStartVnode = newCh[++newStartIdx];
        } else {
            if ((0, _NeactUtils.isUndefined)(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);

            idxInOld = oldKeyToIdx[newStartVnode.key];

            if ((0, _NeactUtils.isUndefined)(idxInOld) || (0, _NeactUtils.isUndefined)(oldCh[idxInOld])) {
                // New element
                var dom = (0, _NeactMount.mount)(newCh[newStartIdx], null, callback, context, isSVG);
                (0, _NeactDOMUtils.insertBefore)(parentElm, dom, oldStartVnode.dom);
                newStartVnode = newCh[++newStartIdx];
            } else {
                elmToMove = oldCh[idxInOld];
                (0, _NeactDOMUtils.insertBefore)(parentElm, elmToMove.dom, oldStartVnode.dom);
                patch(elmToMove, newStartVnode, parentElm, callback, context, isSVG);
                oldCh[idxInOld] = undefined;
                newStartVnode = newCh[++newStartIdx];
            }
        }
    }

    if (oldStartIdx > oldEndIdx) {
        // New element
        before = (0, _NeactUtils.isUndefined)(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].dom;
        for (; newStartIdx <= newEndIdx; newStartIdx++) {
            var dom = (0, _NeactMount.mount)(newCh[newStartIdx], null, callback, context, isSVG);
            (0, _NeactDOMUtils.insertBefore)(parentElm, dom, before);
        }
    } else if (newStartIdx > newEndIdx) {
        // Remove element
        for (; oldStartIdx <= oldEndIdx; oldStartIdx++) {

            if ((0, _NeactUtils.isDefined)(oldCh[oldStartIdx])) {
                (0, _NeactUnmount.unmount)(oldCh[oldStartIdx], parentElm);
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
    var isClass = (0, _NeactUtils.isStatefulComponent)(nextType);
    var hooks = nextVNode.hooks || {};

    if (isClass) {
        var inst = lastVNode._instance;
        var lastChildren = lastVNode.children;
        var lastProps = inst.props;
        var lastState = inst.state;
        var lastContext = inst.context;
        var nextChildren = void 0,
            shouldUpdate = false,
            childContext = inst.getChildContext();

        nextVNode.dom = lastVNode.dom;
        nextVNode.children = lastChildren;
        nextVNode._instance = inst;
        inst._isSVG = isSVG;

        if (!(0, _NeactUtils.isNullOrUndef)(childContext)) {
            childContext = (0, _NeactUtils.assign)({}, context, childContext);
        } else {
            childContext = context;
        }

        nextChildren = inst._updateComponent(lastProps, nextProps, context);

        if (nextChildren !== _NeactUtils.emptyObject) {
            nextVNode.children = nextChildren;
            (0, _NeactMount.normalizeComponentChildren)(nextVNode);
            nextChildren = nextVNode.children;
            shouldUpdate = true;
        }

        inst._childContext = childContext;
        inst._vNode = nextVNode;
        inst._renderedVNode = nextChildren;

        if (shouldUpdate) {

            if (hooks.beforeUpdate) {
                hooks.beforeUpdate(lastVNode, nextVNode);
            }

            var refsChanged = (0, _NeactRefs.shouldUpdateRefs)(lastVNode, nextVNode);
            if (refsChanged) {
                (0, _NeactRefs.detachRef)(lastVNode);
            }

            patch(lastChildren, nextChildren, parentDom, callback, childContext, isSVG);
            nextVNode.dom = nextChildren.dom;

            if (!(0, _NeactUtils.isNull)(nextVNode.ref)) {
                callback.enqueue(function () {
                    return (0, _NeactRefs.attachRef)(nextVNode);
                });
            }

            if (inst.componentDidUpdate) {
                callback.enqueue(function () {
                    return inst.componentDidUpdate(lastProps, lastState, lastContext, nextVNode.dom);
                });
            }

            if (!(0, _NeactUtils.isNullOrUndef)(hooks.update)) {
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

        if (!(0, _NeactUtils.isNullOrUndef)(nextProps.onComponentShouldUpdate)) {
            _shouldUpdate = nextProps.onComponentShouldUpdate(_lastProps, nextProps, context);
        }

        if (_shouldUpdate !== false) {
            if (!(0, _NeactUtils.isNullOrUndef)(nextProps.onComponentWillUpdate)) {
                nextProps.onComponentWillUpdate(_lastProps, nextProps, vNode);
            }
            nextVNode.children = nextType(nextProps, context);

            (0, _NeactMount.normalizeComponentChildren)(nextVNode);

            _nextChildren = nextVNode.children;

            if (hooks.beforeUpdate) {
                hooks.beforeUpdate(lastVNode, nextVNode);
            }

            patch(_lastChildren, _nextChildren, parentDom, callback, context, isSVG);
            nextVNode.dom = _nextChildren.dom;

            if (!(0, _NeactUtils.isNullOrUndef)(nextProps.onComponentDidUpdate)) {
                callback.enqueue(function () {
                    return nextProps.onComponentDidUpdate(nextVNode);
                });
            }

            if (!(0, _NeactUtils.isNullOrUndef)(hooks.update)) {
                callback.enqueue(function () {
                    return hooks.update(nextVNode);
                });
            }
        }
    }
}