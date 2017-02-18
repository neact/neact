'use strict';


import NeactComponent from './NeactComponent';

export default function NeactPureComponent(props, context) {
    this.state = {};
    this.refs = {};
    this.props = props || {};
    this.context = context || {};
}

function ComponentDummy() {}
ComponentDummy.prototype = NeactComponent.prototype;
NeactPureComponent.prototype = new ComponentDummy();
NeactPureComponent.prototype.constructor = NeactPureComponent;

NeactPureComponent.prototype._isPureNeactComponent = true;