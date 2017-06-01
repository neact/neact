'use strict';
import {
    createElement as h,
    cloneElement
} from '../src/createElement';

top.h = h;
top.cloneElement = cloneElement;

describe('createElement.js: ', () => {
    it('createElement() type', function() {
        expect(h('div').type).to.equal('div');
        expect(h('a').type).to.equal('a');
    });

    it('createElement() vnode.children', function() {
        var vnode = h('div', null, [h('span'), h('b')]);
        expect(vnode.type).to.equal('div');
        expect(vnode.children[0].type).to.equal('span');
        expect(vnode.children[1].type).to.equal('b');
    });

    it('createElement() with vnode.children vs props.children', function() {
        var vnode = h('div', {
            id: 't'
        }, 'a', 'b', 'c');
        expect(vnode.props.children).to.equal(undefined);
        expect(vnode.children.length).to.equal(3);

        //class or function.
        var vnode = h(h, {
            id: 't'
        }, 'a', 'b', 'c');
        expect(vnode.props.id).to.equal('t');
        expect(vnode.props.children.length).to.equal(3);
        expect(vnode.children, null).to.equal(null);
        var vnode = h(h, {
            id: 't'
        }, null);
        expect(vnode.props.children).to.equal(null);
    });

    it('createElement() with null invaild children', function() {
        var vnode = h('div', null, [h('span'), h('b')], null, h('a'), 'nobo', false, [h('div'), h('p'), [h(h)]]);
        expect(vnode.children.length).to.equal(7);
        expect(vnode.children[5].type).to.equal('p');
    });
    it('createElement() with text content', function() {
        var vnode = h('a', null, ['I am a string']);
        expect(vnode.children.children).to.equal('I am a string');
        var vnode = h('a', null, 'I am a string');
        expect(vnode.children.children).to.equal('I am a string');
        var vnode = h('a', {}, 'I am a string', ' ', 'df', null);
        expect(vnode.children.length).to.equal(3);
    });

    it('cloneElement()', function() {

        var vnode = h('div', {
            key: 't1',
            ref: 't2',
            id: 1
        }, 'nobo');

        var newNode = cloneElement(vnode, {
            key: 's1',
            ref: 's2',
            id: 2,
            s: 3,
            children: ['zhou2']
        }, 'zhou');
        expect(vnode.children.children).to.equal('nobo');
        expect(vnode.children === newNode.children[0]).to.equal(false);
        expect(newNode.children[0].children).to.equal('nobo');
        expect(newNode.children[1].children).to.equal('zhou');

        expect(vnode === newNode).to.equal(false);
        expect(vnode.children === newNode.children[0]).to.equal(false);

        expect(newNode.key).to.equal('t1');
        expect(newNode.ref).to.equal('t2');
        expect(newNode.props.id).to.equal(2);
        expect(newNode.props.s).to.equal(3);

        var newNode2 = cloneElement(vnode, {
            key: 's1',
            ref: 's2',
            id: 2,
            s: 3,
            children: ['zhou2']
        });

        expect(newNode2.children[0].children).to.equal('nobo');
        expect(newNode2.children[1].children).to.equal('zhou2');

        var vnode = h('div', null, h('span', h('h1', { id: 'h1' }, 'nobo')), h('div'));
        var newNode = cloneElement(vnode);

        expect(vnode === newNode).to.equal(false);
        expect(vnode.children.length === newNode.children.length).to.equal(true);
        expect(newNode.children[0].type).to.equal('span');
        expect(newNode.children[1].type).to.equal('div');
        expect(vnode.children === newNode.children).to.equal(false);
        expect(vnode.children[0] === newNode.children[0]).to.equal(false);
        expect(vnode.children[1] === newNode.children[1]).to.equal(false);

        expect(vnode.children[0].children === newNode.children[0].children).to.equal(false);

        var newNode2 = cloneElement(vnode, null, h('s1'));
        expect(vnode.children[1] === newNode2.children[1]).to.equal(false);
        expect(newNode2.children[2].type).to.equal('s1');
    });
});