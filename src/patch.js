'use strict';

import {
    isUndefined,
    isDefined,
    isInvalid,
    isStringOrNumber,
    isNullOrUndef,
    isArray,
    isNull,
    isStatefulComponent,
    toArray,
    emptyObject,
    throwError,
    assign
} from './NeactUtils';

import {
    isElementVNode,
    isComponentVNode,
    isTextVNode,
    isVoidVNode,
    isVNode,
    isSameVNode
} from './NeactElement';

import {
    mount,
    mountArrayChildren,
    normalizeComponentChildren
} from './NeactMount';

import { unmount } from './NeactUnmount';

import {
    insertBefore,
    nextSibling,
    replaceWithNewNode,
    setTextContent
} from './NeactDOMUtils';

import {
    shouldUpdateRefs,
    attachRef,
    detachRef
} from './NeactRefs';

import CallbackQueue from './CallbackQueue';

import {
    updateDOMProperty
} from './processDOMProperty';

import {
    updateDOMEvents
} from './processDOMEvents';

import processElement from './processElement';

export function patch(lastVNode, nextVNode, parentDom, callback, context, isSVG) {
    var isUndefCallbacks = isNullOrUndef(callback);
    callback = callback || new CallbackQueue();

    if (lastVNode !== nextVNode) {
        if (!isSameVNode(lastVNode, nextVNode)) {
            replaceWithNewNode(
                lastVNode,
                nextVNode,
                parentDom,
                callback,
                context,
                isSVG
            );
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


function unmountChildren(children, dom) {
    if (isVNode(children)) {
        unmount(children, dom);
    } else if (isArray(children)) {
        for (let i = 0; i < children.length; i++) {
            const child = children[i];

            if (!isInvalid(child)) {
                unmount(child, dom);
            }
        }
    } else {
        setTextContent(dom, '');
    }
}

function patchElement(lastVNode, nextVNode, parentDom, callback, context, isSVG) {
    const dom = lastVNode.dom;
    const hooks = nextVNode.hooks || {};
    const lastProps = lastVNode.props;
    const nextProps = nextVNode.props;
    const lastChildren = lastVNode.children;
    const nextChildren = nextVNode.children;
    const lastEvents = lastVNode.events;
    const nextEvents = nextVNode.events;

    nextVNode.dom = dom;

    if (hooks.beforeUpdate) {
        hooks.beforeUpdate(lastVNode, nextVNode);
    }

    let refsChanged = shouldUpdateRefs(lastVNode, nextVNode);
    if (refsChanged) {
        detachRef(lastVNode);
    }

    processElement(dom, nextVNode);

    updateDOMProperty(lastVNode.props, nextVNode.props, isSVG, nextVNode);
    updateDOMEvents(lastVNode, nextVNode);

    if (lastChildren !== nextChildren) {
        patchChildren(lastChildren, nextChildren, dom, callback, context, isSVG);
    }

    if (!isNull(nextVNode.ref)) {
        callback.enqueue(() => attachRef(nextVNode));
    }

    if (hooks.update) {
        callback.enqueue(() => hooks.update(nextVNode));
    }

}

function patchChildren(lastChildren, nextChildren, dom, callback, context, isSVG) {
    if (isInvalid(nextChildren)) {
        unmountChildren(lastChildren, dom, callback);
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
    var i, map = {},
        key;
    for (i = beginIdx; i <= endIdx; ++i) {
        key = children[i].key;
        if (!isNullOrUndef(key)) {
            if (isDefined(map[key])) {
                throwError('key must be unique.');
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
        } else if (isSameVNode(oldStartVnode, newEndVnode)) { // Vnode moved right
            insertBefore(parentElm, oldStartVnode.dom, nextSibling(oldEndVnode.dom));
            patch(oldStartVnode, newEndVnode, parentElm, callback, context, isSVG);
            oldStartVnode = oldCh[++oldStartIdx];
            newEndVnode = newCh[--newEndIdx];
        } else if (isSameVNode(oldEndVnode, newStartVnode)) { // Vnode moved left
            insertBefore(parentElm, oldEndVnode.dom, oldStartVnode.dom);
            patch(oldEndVnode, newStartVnode, parentElm, callback, context, isSVG);
            oldEndVnode = oldCh[--oldEndIdx];
            newStartVnode = newCh[++newStartIdx];
        } else {
            if (isUndefined(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);

            idxInOld = oldKeyToIdx[newStartVnode.key];

            if (isUndefined(idxInOld) || isUndefined(oldCh[idxInOld])) { // New element
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

    if (oldStartIdx > oldEndIdx) { // New element
        before = isUndefined(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].dom;
        for (; newStartIdx <= newEndIdx; newStartIdx++) {
            var dom = mount(newCh[newStartIdx], null, callback, context, isSVG);
            insertBefore(parentElm, dom, before);
        }
    } else if (newStartIdx > newEndIdx) { // Remove element
        for (; oldStartIdx <= oldEndIdx; oldStartIdx++) {

            if (isDefined(oldCh[oldStartIdx])) {
                unmount(oldCh[oldStartIdx], parentElm);
            }
        }
    }
}

function patchText(lastVNode, nextVNode) {
    const nextText = nextVNode.children;
    const dom = lastVNode.dom;

    nextVNode.dom = dom;

    if (lastVNode.children !== nextText) {
        dom.nodeValue = nextText;
    }
}

function patchVoid(lastVNode, nextVNode) {
    nextVNode.dom = lastVNode.dom;
}

function patchComponent(lastVNode, nextVNode, parentDom, callback, context, isSVG) {
    const nextType = nextVNode.type;
    const nextProps = nextVNode.props;
    const isClass = isStatefulComponent(nextType);
    const hooks = nextVNode.hooks || {};

    if (isClass) {
        const inst = lastVNode._instance;
        const lastChildren = lastVNode.children;
        const lastProps = inst.props;
        const lastState = inst.state;
        const lastContext = inst.context;
        let nextChildren, shouldUpdate = false,
            childContext = inst.getChildContext();

        nextVNode.dom = lastVNode.dom;
        nextVNode.children = lastChildren;
        nextVNode._instance = inst;
        inst._isSVG = isSVG;

        if (!isNullOrUndef(childContext)) {
            childContext = assign({}, context, childContext);
        } else {
            childContext = context;
        }

        nextChildren = inst._updateComponent(lastProps, nextProps, context);

        if (nextChildren !== emptyObject) {
            nextVNode.children = nextChildren;
            normalizeComponentChildren(nextVNode);
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

            let refsChanged = shouldUpdateRefs(lastVNode, nextVNode);
            if (refsChanged) {
                detachRef(lastVNode);
            }

            patch(lastChildren, nextChildren, parentDom, callback, childContext, isSVG);
            nextVNode.dom = nextChildren.dom;

            if (!isNull(nextVNode.ref)) {
                callback.enqueue(() => attachRef(nextVNode));
            }

            if (inst.componentDidUpdate) {
                callback.enqueue(() => inst.componentDidUpdate(lastProps, lastState, lastContext, nextVNode.dom));
            }

            if (!isNullOrUndef(hooks.update)) {
                callback.enqueue(() => hooks.update(nextVNode));
            }
        }

        if (inst._pendingCallbacks) {
            callback.enqueue(() => inst._processPendingCallbacks());
        }
    } else {
        let shouldUpdate = true;
        const lastProps = lastVNode.props;
        const lastChildren = lastVNode.children;
        let nextChildren = lastChildren;

        nextVNode.dom = lastVNode.dom;
        nextVNode.children = nextChildren;

        if (!isNullOrUndef(nextProps.onComponentShouldUpdate)) {
            shouldUpdate = nextProps.onComponentShouldUpdate(lastProps, nextProps, context);
        }

        if (shouldUpdate !== false) {
            if (!isNullOrUndef(nextProps.onComponentWillUpdate)) {
                nextProps.onComponentWillUpdate(lastProps, nextProps, vNode);
            }
            nextVNode.children = nextType(nextProps, context);

            normalizeComponentChildren(nextVNode);

            nextChildren = nextVNode.children;

            if (hooks.beforeUpdate) {
                hooks.beforeUpdate(lastVNode, nextVNode);
            }

            patch(lastChildren, nextChildren, parentDom, callback, context, isSVG);
            nextVNode.dom = nextChildren.dom;

            if (!isNullOrUndef(nextProps.onComponentDidUpdate)) {
                callback.enqueue(() => nextProps.onComponentDidUpdate(nextVNode));
            }

            if (!isNullOrUndef(hooks.update)) {
                callback.enqueue(() => hooks.update(nextVNode));
            }
        }
    }
}