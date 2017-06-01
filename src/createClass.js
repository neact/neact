'use strict';
import {
    isArray,
    isObject,
    inherits
} from './shared';

import Component from './component';

export function createClass(spec) {
    function Constructor(props, context) {
        this.state = {};
        this.refs = {};
        this.props = props || {};
        this.context = context || {};

        if (this.construct) {
            this.construct(props, context);
            return;
        }

        var initialState = this.getInitialState ? this.getInitialState(this.props, this.context) : null;

        if (!(isObject(initialState) && !isArray(initialState))) {
            new TypeError('getInitialState(): must return an object or null');
        }

        this.state = initialState;
    }

    inherits(Constructor, Component, spec);

    Constructor.prototype.constructor = Constructor;

    if (spec.getDefaultProps) {
        Constructor.defaultProps = spec.getDefaultProps();
    }

    if (!spec.render) {
        throw new TypeError('createClass(...): Class specification must implement a `render` method.');
    }

    return Constructor;
}