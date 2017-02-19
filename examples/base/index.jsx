/** @jsx Neact.createElement */

var HTMLInput = Neact.createClass({
    getDefaultProps(){
        return {
            type : 'text'
        }
    },
    render(){
        var props = this.props;
        if( props.onChange) {
           var onChange = props.onChange;
           delete props.onChange;
           props.onpropertychange = props.oninput = (e) => {
               var target = e.target || e.srcElement;
               if( e.type === 'propertychange' && e.propertyName === 'value') {
                   onChange(target.value);
               } else if(e.type === 'input') {
                   onChange(target.value);
               }
           }
        }
        return <input {...props}/>
    }
});

var App = Neact.createClass({
    construct(){
        this.state.username = this.props.username || '';
        this.state.gender = this.props.gender || 0;
    },
    render(){
        return (
        <div>
            <h1>用户信息</h1>
            <div>
                <label>用户名: <HTMLInput onChange={(v)=>{this.setState({username : v})}} value={this.state.username} type="text" />({this.state.username})</label>
            </div>   
            <div>
                <label>性别: 
                    <select value={this.state.gender} onChange={(v, vnode)=>{this.setState({gender : vnode.dom.value})}}>
                        <option  value={0}>男</option>
                        <option  value={1}>女</option>
                    </select>({this.state.gender == 0 ? '男' : '女'})
                </label>
            </div>   
        </div>  
    )
    }
});


Neact.render(<App username='neact' />, demo);

