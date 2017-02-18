'use strict';

import {
    isNullOrUndef,
    isUndefined,
    emptyObject,
    assign
} from './NeactUtils';

export default function createNeactComponent(vNode, context, isSVG) {
    const type = vNode.type;
    const props = vNode.props || {};
    const ref = vNode.ref;

    if (isUndefined(context)) {
        context = {};
    }

    const inst = new type(props, context);

    inst.props = props;
    inst.context = context;
    inst.refs = emptyObject;

    var initialState = inst.state;
    if (initialState === undefined) {
        inst.state = initialState = null;
    }

    inst._unmounted = false;
    inst._isSVG = isSVG;

    const childContext = inst.getChildContext();

    if (!isNullOrUndef(childContext)) {
        inst._childContext = assign({}, context, childContext);
    } else {
        inst._childContext = context;
    }

    return inst;
}