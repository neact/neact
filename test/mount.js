'use strict';
import {
    createTextVNode,
    createVoidVNode
} from "../src/vnode";
import {
    createElement as h
} from "../src/createElement";
import {
    createClass
} from "../src/createClass";
import {
    mount,
    mountElement,
    mountComponent,
    mountText,
    mountVoid
} from "../src/mount";

describe('NeactMount', function() {
    var parentDom = document.createElement('div');

    beforeEach(function() {
        var nodes = parentDom.childNodes;
        var node;
        while (node = parentDom.firstChild) {
            parentDom.removeChild(node)
        }
    });

    it('mountText()', function() {
        var textNode = createTextVNode('hello neact');
        mount(textNode, parentDom);
        expect(parentDom.innerText).to.equal('hello neact');
    });

    it('mountVoid()', function() {
        var voidNode = createVoidVNode();
        mount(voidNode, parentDom);
        expect(parentDom.firstChild.nodeType).to.equal(8);
    });

    it('mountElement()', function() {
        var ele = h('div', null, 123, '456', null, h('span', null, 789));
        mount(ele, parentDom);
        expect(parentDom.innerHTML).to.equal('<div>123456<span>789</span></div>');
    });

    it('mountFunctionComponent()', function() {
        function FunctionComponent(props) {
            return h('div', { id: 1 }, 123, '456', null, h('span', null, 789));
        }
        mount(h(FunctionComponent, { id: 1 }), parentDom);
        expect(parentDom.innerHTML).to.equal('<div id="1">123456<span>789</span></div>');
    });

    it('mountClassComponent()', function() {
        var ClassComponent = createClass({
            render: function() {
                var id = this.props.id;
                return h('div', { id: id }, 123, '456', null, h('span', null, 789));
            }
        });
        mount(h(ClassComponent, { id: 1 }), parentDom);
        expect(parentDom.innerHTML).to.equal('<div id="1">123456<span>789</span></div>');
    });
});