/** @jsx Neact.createElement */

class THead extends Neact.Component {
    constructor(props){
        super(props);

        this.props.columns = this.props.columns || [];
    }

    render(){
        var columns = this.props.columns;
        
        return <thead>
            <tr>
                <th width="40"  class="h">#</th>
                {
                   Neact.utils.map(columns, function(data){
                       return <th class={data.hcls}>{data.title}</th>
                   })
                }
            </tr>
        </thead>;
    }

}

class RowDeltal extends Neact.Component {
    constructor(props){
        super(props);
    }
    render(){
        var rowData = this.props.rowData;
        return <div>
            ID : {rowData.id}<br/>
            NAME : {rowData.name}<br/>
            AGE : {rowData.age}
        </div>;
    }
}

var TBody = Neact.createClass({
    getDefaultProps : function(){
        return {
            columns : [],
            data : []
        };
    },

    addData : function(){
        var props = this.props;
        if( props.onAddData ) {
           props.onAddData(); 
        }
    },

    deleteData : function(){
        var props = this.props;
        if( props.onRemoveData && this.selectIdx !== null ) {
           props.onRemoveData(this.selectIdx); 
        }
    },

    shouldComponentUpdate : function(){
    },

    componentWillMount : function(){

        this.selectIdx = null;

    },

    render : function(){
        var self = this;
        var columns = this.props.columns;
        var data = this.props.data;
        return <tbody tabIndex="0" onKeyDown={(e) => {
            //UP 38 DOWN 40
            if(!data.length) return;
            if(self.selectIdx === null) {
                 self.selectIdx = 0;
             } else if(e.keyCode == 38) {
                self.selectIdx = Math.max(0, --self.selectIdx);
            } else if(e.keyCode == 40) {
                self.selectIdx = Math.min(data.length - 1, ++self.selectIdx);
            }

            e.preventDefault();

            self.setState(null);
        }}>
            <tr>
                <td colspan={columns.length+1}>
                    <button onClick={ e => this.addData() }>新增</button>
                    <button disabled={ !data.length  || self.selectIdx === null } onClick={ e => this.deleteData() }>删除</button>
                </td>
            </tr>
            {
                Neact.utils.map(data, function(rowData, i){
                    var isSelected = false;
                    if( i === self.selectIdx ) {
                        isSelected = true;
                    }

                    var v = [];

                    var $row =  <tr onClick={() => {
                        self.selectIdx = i;
                        self.setState(null);
                    }} className={isSelected ? 'selected' : ''} >
                    <td class="b">
                        <input type="checkbox" checked={isSelected ? 'checked' : ''} />
                    </td>
                    {
                        Neact.utils.map(columns,function(column){
                            return <td class={column.bcls}>{rowData[column.field]}</td>
                        })
                    }
                    </tr>;

                    v.push($row);

                    if(isSelected) {
                        v.push(<tr key="_expand">
                            <td colspan={columns.length + 1}>
                                <RowDeltal rowData={rowData} />
                            </td>
                        </tr>);
                    }

                    return v;
                })
            }
        </tbody>;
    }
});

var Table = Neact.createClass({

    construct : function(props){
        this.state = {
            columns : props.columns || [],
            data : props.data || []
        };
    },

    addData : function(){
        var data = this.state.data;

        data.push({
            id : data.length,
            name : 'nobo' + data.length,
            age : 19
        });

        this.setState({
            data : data
        });
    },

    removeData : function(idx){
        var data = this.state.data;
        data.splice(idx, 1);
        this.setState({
            data : data
        }); 
    },

    render : function(){
        var columns = this.state.columns;
        var data = this.state.data;

        return <table style="width:500px;border-collapse:collapse;table-layout:fixed;" cellpadding="0" cellspacing="0" >
            <THead columns={columns}></THead>
            <TBody 
            columns={columns} 
            data={data} 
            onAddData={() => this.addData()}
            onRemoveData ={(idx) => this.removeData(idx)}
            ></TBody>
        </table>;
    }
});

var columns = [
    {
        hcls : 'h',
        bcls : 'b',
        field : 'id',
        title : 'ID'
    },
     {
        hcls : 'h',
        bcls : 'b',
        field : 'name',
        title : '名称'
    },
     {
        hcls : 'h',
        bcls : 'b',
        field : 'age',
        title : '年龄'
    }
];
var data = [
    { id : 1, name : 'nobo1', age : '18' },
    { id : 2, name : 'nobo2', age : '18' },
    { id : 3, name : 'nobo3', age : '18' },
    { id : 4, name : 'nobo4', age : '18' },
    { id : 5, name : 'nobo5', age : '18' },
    { id : 6, name : 'nobo6', age : '18' },
    { id : 7, name : 'nobo7', age : '18' },
    { id : 8, name : 'nobo8', age : '18' },
    { id : 9, name : 'nobo9', age : '18' }
];

Neact.render(<Table columns={columns} data={data} />, demo);

