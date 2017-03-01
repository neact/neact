'use strict';
import {
    createElement as h
} from "../src/NeactElement";

describe('core', function() {
    it('check vnode.type', function() {
        expect(h('div').type).toBe('div');
        expect(h('a').type).toBe('a');
    });
    it('check vnode.children', function() {
        var vnode = h('div', null, [h('span'), h('b')]);
        expect(vnode.type).toBe('div');
        expect(vnode.children[0].type).toBe('span');
        expect(vnode.children[1].type).toBe('b');
    });
    it('check vnode.children and props.children', function() {
        var vnode = h('div', {
            id: 't'
        }, 'a', 'b', 'c');
        expect(vnode.props.children, undefined).toBe(undefined);
        expect(vnode.children.length, 3).toBe(3);

        //component
        var vnode = h(h, {
            id: 't'
        }, 'a', 'b', 'c');
        expect(vnode.props.id).toBe('t');
        expect(vnode.props.children.length).toBe(3);
        expect(vnode.children, null).toBe(null);
        var vnode = h(h, {
            id: 't'
        }, null);
        expect(vnode.props.children).toBe(null);
    });
    it('can create vnode with null invaild children', function() {
        var vnode = h('div', null, [h('span'), h('b')], null, h('a'), 'nobo', false, [h('div'), h('p'), [h(h)]]);
        expect(vnode.children.length).toBe(7);
        expect(vnode.children[5].type).toBe('p');
    });
    it('can create vnode with text content', function() {
        var vnode = h('a', null, ['I am a string']);
        expect(vnode.children.children).toBe('I am a string');
        var vnode = h('a', null, 'I am a string');
        expect(vnode.children.children).toBe('I am a string');
        var vnode = h('a', {}, 'I am a string', ' ', 'df', null);
        expect(vnode.children.length, 3).toBe(3);
    });
});