'use strict';

exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.createClass = createClass;

var _NeactUtils = require('./NeactUtils');

var _NeactComponent = require('./NeactComponent');

var _NeactComponent2 = _interopRequireDefault(_NeactComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function createClass(spec) {
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

        if (!((typeof initialState === 'undefined' ? 'undefined' : _typeof(initialState)) === 'object' && !(0, _NeactUtils.isArray)(initialState))) {
            new TypeError('getInitialState(): must return an object or null');
        }

        this.state = initialState;
    }

    (0, _NeactUtils.inherits)(Constructor, _NeactComponent2['default'], spec);

    Constructor.prototype.constructor = Constructor;

    if (spec.getDefaultProps) {
        Constructor.defaultProps = spec.getDefaultProps();
    }

    if (!spec.render) {
        throw new TypeError('createClass(...): Class specification must implement a `render` method.');
    }

    return Constructor;
}