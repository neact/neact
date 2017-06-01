'use strict';


import Component from './component';

export default function PureComponent(props, context) {
    this.state = {};
    this.refs = {};
    this.props = props || {};
    this.context = context || {};
}

function ComponentDummy() {}
ComponentDummy.prototype = Component.prototype;
PureComponent.prototype = new ComponentDummy();
PureComponent.prototype.constructor = PureComponent;

PureComponent.prototype._isPureComponent = true;