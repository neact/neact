'use strict';
import { createElement as h, render, Component, unmountComponentAtNode } from '../src/neact';
/** @jsx h */

describe('keys', () => {
	let scratch;

	before( () => {
		scratch = document.createElement('div');
		(document.body || document.documentElement).appendChild(scratch);
	});

	beforeEach( () => {
		unmountComponentAtNode(scratch);
	});

	after( () => {
		unmountComponentAtNode(scratch);
	});

	// See developit/preact-compat#21
	it('should remove orphaned keyed nodes', () => {
		const root = render((
			<div>
				<div>1</div>
				<li key="a">a</li>
			</div>
		), scratch);

		render((
			<div>
				<div>2</div>
				<li key="b">b</li>
			</div>
		), scratch, root);

		expect(scratch.innerHTML).to.equal('<div><div>2</div><li>b</li></div>');
	});

	it('should set VNode#key property', () => {
		expect(<div />, '1').to.have.property('key').that.is.equal(null);
		expect(<div a="a" />).to.have.property('key').that.is.equal(null);
		expect(<div key="1" />).to.have.property('key', '1');
	});

	it('should remove keyed nodes (#232)', () => {
		class App extends Component {
			componentDidMount() {
				setTimeout(() => this.setState({opened: true,loading: true}), 10);
				setTimeout(() => this.setState({opened: true,loading: false}), 20);
			}

			render({ opened, loading }) {
				return (
					<BusyIndicator id="app" busy={loading}>
						<div>This div needs to be here for this to break</div>
						{ opened && !loading && <div>{[]}</div> }
					</BusyIndicator>
				);
			}
		}

		class BusyIndicator extends Component {
			render({ children, busy }) {
				return <div class={busy ? "busy" : ""}>
					{ children && children.length ? children : <div class="busy-placeholder"></div> }
					<div class="indicator">
						<div>indicator</div>
						<div>indicator</div>
						<div>indicator</div>
					</div>
				</div>;
			}
		}

		let root;

		root = render(<App />, scratch);
		root = render(<App opened loading />, scratch);
		root = render(<App opened />, scratch);
		var dom = root._vNode.dom;
		let html = String(dom.innerHTML).replace(/ class=""/g, '');
		expect(html).to.equal('<div>This div needs to be here for this to break</div><div></div><div class="indicator"><div>indicator</div><div>indicator</div><div>indicator</div></div>');
	});
});
