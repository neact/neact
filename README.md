# Neact

Neact is a fast alternative to React, support ie8

## Usage

``` js

Neact.render(Neact.createElement('div', null, 'Hello Neact!'), document.body);

```

## Install

```sh
npm install neact
```

```sh
bower install neact
```

## Getting Started

### How to use JSX

```js
// 1.best to configure it globally in a .babelrc
// 2.Tell Babel to transform JSX into Neact.createElement() calls:
/** @jsx Neact.createElement */

function App(){
	return (
        <div id="foo">
            <span>Hello, world!</span>
            <button onClick={ e => alert("hi!") }>Click Me</button>
        </div>
    );
};

Neact.render(<App />, document.body);
```

### hooks Lifecycle

| Lifecycle method            | When it gets called                              |
|-----------------------------|--------------------------------------------------|
| `create`                    | see `componentDidMount`                          |
| `beforeUpdate`              | see `componentWillUpdate`                        |
| `update`                    | see `componentDidUpdate`                         |
| `destroy`                   | see `componentDidUnmount`                        |

```
let hooks = {
    create(vNode) {
        //TODO:
        //vNode.dom
    },
    beforeUpdate(lastVNode, nextVNode){
        //TODO:
    },
    update(nextVNode){
        //TODO:
    },
    destroy(vNode){
        //TODO:
    }
}

Neact.render(<div hooks={hooks}>Test</div>,document.body)
```

### Class Components Lifecycle

| Lifecycle method            | When it gets called                              |
|-----------------------------|--------------------------------------------------|
| `componentWillMount`        | before the component gets mounted to the DOM     |
| `componentDidMount`         | after the component gets mounted to the DOM      |
| `componentWillUnmount`      | prior to removal from the DOM                    |
| `componentWillReceiveProps` | before new props get accepted                    |
| `shouldComponentUpdate`     | before `render()`. Return `false` to skip render |
| `componentWillUpdate`       | before `render()`                                |
| `componentDidUpdate`        | after `render()`                                 |

```
var App = Neact.createClass({
    render(){
        return 'Test'
    },
    componentWillMount(){},
    componentDidMount(){},
    componentWillUnmount(){},
    componentWillReceiveProps(){},
    shouldComponentUpdate(){},
    componentWillUpdate(){},
    componentDidUpdate(){}
});

Neact.render(<App />,document.body)
```

### Functional Components Lifecycle

| Lifecycle method              | When it gets called                              |
|-------------------------------|--------------------------------------------------|
| `onComponentWillMount`        | before the component gets mounted to the DOM     |
| `onComponentDidMount`         | after the component gets mounted to the DOM      |
| `onComponentWillUnmount`      | prior to removal from the DOM                    |
| `onComponentShouldUpdate`     | before `render()`. Return `false` to skip render |
| `onComponentWillUpdate`       | before `render()`                                |
| `onComponentDidUpdate`        | after `render()`                                 |

```
let Lifecycle = {
    onComponentWillMount(vNode){},
    onComponentDidMount(vNode){},
    onComponentWillUnmount(vNode){},
    onComponentShouldUpdate(lastProps, nextProps, context){},
    onComponentWillUpdate(lastProps, nextProps, vNode){},
    onComponentDidUpdate(nextVNode){}
}

var App = function(){
    return 'Test'
};

Neact.render(<App {...Lifecycle} />,document.body)
```


## License

MIT