'use strict';

/** @jsx Neact.createElement */

var HTMLInput = Neact.createClass({
    getDefaultProps: function () {
        return {
            type: 'text'
        };
    },
    render: function () {
        var props = this.props;
        if (props.onChange) {
            var onChange = props.onChange;
            delete props.onChange;
            props.onpropertychange = props.oninput = function (e) {
                var target = e.target || e.srcElement;
                if (e.type === 'propertychange' && e.propertyName === 'value') {
                    onChange(target.value);
                } else if (e.type === 'input') {
                    onChange(target.value);
                }
            };
        }
        return Neact.createElement('input', props);
    }
});

var App = Neact.createClass({
    construct: function () {
        this.state.username = this.props.username || '';
        this.state.gender = this.props.gender || 0;
    },
    render: function () {
        var _this = this;

        return Neact.createElement(
            'div',
            null,
            Neact.createElement(
                'h1',
                null,
                '\u7528\u6237\u4FE1\u606F'
            ),
            Neact.createElement(
                'div',
                null,
                Neact.createElement(
                    'label',
                    null,
                    '\u7528\u6237\u540D: ',
                    Neact.createElement(HTMLInput, { onChange: function (v) {
                            _this.setState({ username: v });
                        }, value: this.state.username, type: 'text' }),
                    '(',
                    this.state.username,
                    ')'
                )
            ),
            Neact.createElement(
                'div',
                null,
                Neact.createElement(
                    'label',
                    null,
                    '\u6027\u522B:',
                    Neact.createElement(
                        'select',
                        { value: this.state.gender, onChange: function (v, vnode) {
                                _this.setState({ gender: vnode.dom.value });
                            } },
                        Neact.createElement(
                            'option',
                            { value: 0 },
                            '\u7537'
                        ),
                        Neact.createElement(
                            'option',
                            { value: 1 },
                            '\u5973'
                        )
                    ),
                    '(',
                    this.state.gender == 0 ? '男' : '女',
                    ')'
                )
            )
        );
    }
});

Neact.render(Neact.createElement(App, { username: 'neact' }), demo);