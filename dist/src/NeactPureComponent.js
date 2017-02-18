'use strict';

exports.__esModule = true;
exports['default'] = NeactPureComponent;

var _NeactComponent = require('./NeactComponent');

var _NeactComponent2 = _interopRequireDefault(_NeactComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function NeactPureComponent(props, context) {
    this.state = {};
    this.refs = {};
    this.props = props || {};
    this.context = context || {};
}

function ComponentDummy() {}
ComponentDummy.prototype = _NeactComponent2['default'].prototype;
NeactPureComponent.prototype = new ComponentDummy();
NeactPureComponent.prototype.constructor = NeactPureComponent;

NeactPureComponent.prototype._isPureNeactComponent = true;