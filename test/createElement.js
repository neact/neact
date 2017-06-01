'use strict';
import {
    createElement as h
} from "../src/createElement";

describe('NeactElement', function() {
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
        expect(vnode.props.children, undefined).to.equal(undefined);
        expect(vnode.children.length, 3).to.equal(3);

        //component
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
        expect(vnode.children.length, 3).to.equal(3);
    });
});