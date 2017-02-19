"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @jsx Neact.createElement */

var THead = function (_Neact$Component) {
    _inherits(THead, _Neact$Component);

    function THead(props) {
        _classCallCheck(this, THead);

        var _this = _possibleConstructorReturn(this, (THead.__proto__ || Object.getPrototypeOf(THead)).call(this, props));

        _this.props.columns = _this.props.columns || [];
        return _this;
    }

    _createClass(THead, [{
        key: "render",
        value: function render() {
            var columns = this.props.columns;

            return Neact.createElement(
                "thead",
                null,
                Neact.createElement(
                    "tr",
                    null,
                    Neact.createElement(
                        "th",
                        { width: "40", "class": "h" },
                        "#"
                    ),
                    Neact.utils.map(columns, function (data) {
                        return Neact.createElement(
                            "th",
                            { "class": data.hcls },
                            data.title
                        );
                    })
                )
            );
        }
    }]);

    return THead;
}(Neact.Component);

var RowDeltal = function (_Neact$Component2) {
    _inherits(RowDeltal, _Neact$Component2);

    function RowDeltal(props) {
        _classCallCheck(this, RowDeltal);

        return _possibleConstructorReturn(this, (RowDeltal.__proto__ || Object.getPrototypeOf(RowDeltal)).call(this, props));
    }

    _createClass(RowDeltal, [{
        key: "render",
        value: function render() {
            var rowData = this.props.rowData;
            return Neact.createElement(
                "div",
                null,
                "ID : ",
                rowData.id,
                Neact.createElement("br", null),
                "NAME : ",
                rowData.name,
                Neact.createElement("br", null),
                "AGE : ",
                rowData.age
            );
        }
    }]);

    return RowDeltal;
}(Neact.Component);

var TBody = Neact.createClass({
    getDefaultProps: function () {
        return {
            columns: [],
            data: []
        };
    },

    addData: function () {
        var props = this.props;
        if (props.onAddData) {
            props.onAddData();
        }
    },

    deleteData: function () {
        var props = this.props;
        if (props.onRemoveData && this.selectIdx !== null) {
            props.onRemoveData(this.selectIdx);
        }
    },

    shouldComponentUpdate: function () {},

    componentWillMount: function () {

        this.selectIdx = null;
    },

    render: function () {
        var _this3 = this;

        var self = this;
        var columns = this.props.columns;
        var data = this.props.data;
        return Neact.createElement(
            "tbody",
            { tabIndex: "0", onKeyDown: function (e) {
                    //UP 38 DOWN 40
                    if (!data.length) return;
                    if (self.selectIdx === null) {
                        self.selectIdx = 0;
                    } else if (e.keyCode == 38) {
                        self.selectIdx = Math.max(0, --self.selectIdx);
                    } else if (e.keyCode == 40) {
                        self.selectIdx = Math.min(data.length - 1, ++self.selectIdx);
                    }

                    e.preventDefault();

                    self.setState(null);
                } },
            Neact.createElement(
                "tr",
                null,
                Neact.createElement(
                    "td",
                    { colspan: columns.length + 1 },
                    Neact.createElement(
                        "button",
                        { onClick: function (e) {
                                return _this3.addData();
                            } },
                        "\u65B0\u589E"
                    ),
                    Neact.createElement(
                        "button",
                        { disabled: !data.length || self.selectIdx === null, onClick: function (e) {
                                return _this3.deleteData();
                            } },
                        "\u5220\u9664"
                    )
                )
            ),
            Neact.utils.map(data, function (rowData, i) {
                var isSelected = false;
                if (i === self.selectIdx) {
                    isSelected = true;
                }

                var v = [];

                var $row = Neact.createElement(
                    "tr",
                    { onClick: function () {
                            self.selectIdx = i;
                            self.setState(null);
                        }, className: isSelected ? 'selected' : '' },
                    Neact.createElement(
                        "td",
                        { "class": "b" },
                        Neact.createElement("input", { type: "checkbox", checked: isSelected ? 'checked' : '' })
                    ),
                    Neact.utils.map(columns, function (column) {
                        return Neact.createElement(
                            "td",
                            { "class": column.bcls },
                            rowData[column.field]
                        );
                    })
                );

                v.push($row);

                if (isSelected) {
                    v.push(Neact.createElement(
                        "tr",
                        { key: "_expand" },
                        Neact.createElement(
                            "td",
                            { colspan: columns.length + 1 },
                            Neact.createElement(RowDeltal, { rowData: rowData })
                        )
                    ));
                }

                return v;
            })
        );
    }
});

var Table = Neact.createClass({

    construct: function (props) {
        this.state = {
            columns: props.columns || [],
            data: props.data || []
        };
    },

    addData: function () {
        var data = this.state.data;

        data.push({
            id: data.length,
            name: 'nobo' + data.length,
            age: 19
        });

        this.setState({
            data: data
        });
    },

    removeData: function (idx) {
        var data = this.state.data;
        data.splice(idx, 1);
        this.setState({
            data: data
        });
    },

    render: function () {
        var _this4 = this;

        var columns = this.state.columns;
        var data = this.state.data;

        return Neact.createElement(
            "table",
            { style: "width:500px;border-collapse:collapse;table-layout:fixed;", cellpadding: "0", cellspacing: "0" },
            Neact.createElement(THead, { columns: columns }),
            Neact.createElement(TBody, {
                columns: columns,
                data: data,
                onAddData: function () {
                    return _this4.addData();
                },
                onRemoveData: function (idx) {
                    return _this4.removeData(idx);
                }
            })
        );
    }
});

var columns = [{
    hcls: 'h',
    bcls: 'b',
    field: 'id',
    title: 'ID'
}, {
    hcls: 'h',
    bcls: 'b',
    field: 'name',
    title: '名称'
}, {
    hcls: 'h',
    bcls: 'b',
    field: 'age',
    title: '年龄'
}];
var data = [{ id: 1, name: 'nobo1', age: '18' }, { id: 2, name: 'nobo2', age: '18' }, { id: 3, name: 'nobo3', age: '18' }, { id: 4, name: 'nobo4', age: '18' }, { id: 5, name: 'nobo5', age: '18' }, { id: 6, name: 'nobo6', age: '18' }, { id: 7, name: 'nobo7', age: '18' }, { id: 8, name: 'nobo8', age: '18' }, { id: 9, name: 'nobo9', age: '18' }];

Neact.render(Neact.createElement(Table, { columns: columns, data: data }), demo);