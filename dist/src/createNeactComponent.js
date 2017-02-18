'use strict';

exports.__esModule = true;
exports['default'] = createNeactComponent;

var _NeactUtils = require('./NeactUtils');

function createNeactComponent(vNode, context, isSVG) {
    var type = vNode.type;
    var props = vNode.props || {};
    var ref = vNode.ref;

    if ((0, _NeactUtils.isUndefined)(context)) {
        context = {};
    }

    var inst = new type(props, context);

    inst.props = props;
    inst.context = context;
    inst.refs = _NeactUtils.emptyObject;

    var initialState = inst.state;
    if (initialState === undefined) {
        inst.state = initialState = null;
    }

    inst._unmounted = false;
    inst._isSVG = isSVG;

    var childContext = inst.getChildContext();

    if (!(0, _NeactUtils.isNullOrUndef)(childContext)) {
        inst._childContext = (0, _NeactUtils.assign)({}, context, childContext);
    } else {
        inst._childContext = context;
    }

    return inst;
}