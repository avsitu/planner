import React, { Component } from 'react'

const hours = ["9AM", "10AM", "11AM", "12PM","1PM","2PM","3PM","4PM","5PM","6PM","7PM","8PM","9PM"];

class Checkbox extends Component<{name:string,id:string,data:any[]},{}> {
    constructor(props) {
        super(props);
        // this.selected = sampleInput.hasOwnProperty(props.id);
        this.handleBoxClick = this.handleBoxClick.bind(this);
        // this.handleDataSwitch = this.handleDataSwitch.bind(this);
        // this.state = {
        //     selected: this.props.data.includes(this.props.id)
        // }
    }

    handleBoxClick(e) { //handles checkbox update
        // this.props.onBoxClick(e.target);
        var target = e.target;
        if(e.target.classList.contains ("true")) {
            target.classList.remove("true");
            target.classList.add("false");
        }   
        else {
            target.classList.remove("false");
            target.classList.add("true");
        } 
    } 

    // componentWillReceiveProps(nextProps) {
    //     console.log('new props ', nextProps.id, nextProps.data.includes(nextProps.id));
    //     this.setState({selected: nextProps.data.includes(nextProps.id)});
    // }            
    render() {
        const selected = this.props.data.includes(this.props.id);
        // console.log("rendered: ", this.props.id, this.state.selected);
        return (
            <div className="box-container">
                <span className={selected ? "checkmark true" : "checkmark false"} 
                id={this.props.id} onClick={this.props.name !== "Everyone" ? this.handleBoxClick : function(){return false;}} aria-hidden="true"></span>
            </div>                    
        );
    }

}

function Tdata(props) { //KEY IS THE KeY!!!!!
    return (
        <td id={"box-"+props.id}> 
            <Checkbox key={props.name+"-"+props.id} id={props.id} data={props.data} name={props.name}/>
        </td>
    );            
}

function Trow(props) {
    var h = props.hour;
    // var days = ["mon"];
    var checkboxes = props.dates.map((date) => <Tdata key={date+"-"+h} id={date+"-"+h} data={props.data} name={props.name} onBoxClick={props.onBoxClick}/>); 
    return (
        <tr>
            <th scope="row">{h}</th>
            {checkboxes}
        </tr>
    );
}

function Tbody(props) {
    var body = [];
    for(var i = 0; i < hours.length; i++) { //each row is hour
        body.push(<Trow key={"hour-"+hours[i]} hour={hours[i]} data={props.data} name={props.name} onBoxClick={props.onBoxClick} dates={props.dates} />);
    }
    return <tbody>{body}</tbody>;
}

function Thead(props) {
    var header = ["Hour"].concat(props.dates).map((date) => <th scope="col" key={date}>{date}</th>);
    return (
        <thead>
            <tr>
                {header}
            </tr>
        </thead>
    );
}

class EventTable extends Component<{name:string,dates:any[],data:any[]}> {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <table className="table">
                <Thead dates={this.props.dates} />
                <Tbody name={this.props.name} data={this.props.data} dates={this.props.dates} />
            </table>
        )
    }
}

export default EventTable;
