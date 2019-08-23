import React, { Component } from 'react'

const sampleInput = [
    {
        "alice": ["5-2-1PM"],
        "bob" : ["5-4-2PM", "5-4-3PM", "5-4-4PM", "5-10-2PM", "5-11-2PM"]
    },
    {
        "eve": ["5-3-1PM"],
        "carl": ["5-5-1PM"]
    }
];

const sampleDates = [
    [
        "5-2", "5-3", "5-4", "5-10", "5-11"
    ],
    [
        "5-3", "5-5", "5-6"
    ]
]

const hours = ["9AM", "10AM", "11AM", "12PM","1PM","2PM","3PM","4PM","5PM","6PM","7PM","8PM","9PM"];

function findOverlap(eventData, dates) {
    var overlap = [];
    //populates list with all possible time slots
    dates.forEach(day => {
        hours.forEach(hour => {
            overlap.push(day+"-"+hour);
        });
    });
    //filters for time slots that exist for all persons
    for(let person in eventData) {
        overlap = overlap.filter((time) => eventData[person].includes(time));
    }
    console.log(overlap);
    return overlap;
}

class SubmitButton extends Component {
    constructor(props) {
        super(props);
    
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    currentSelection() {
        var checkboxes = document.querySelectorAll(".checkmark");
        var selected = [];
        checkboxes.forEach(box => {
            // console.log(box.id,box.dataset.checked);
            if(box.classList.contains("true")) 
                selected.push(box.id);
        });
        // console.log(selected);
        return selected;
    }

    handleSubmit(e) {
        var name = this.props.name;
        sampleInput[this.props.eventId][name] = this.currentSelection();
        console.log("submmited to sampleInput: ", name, sampleInput[this.props.eventId][name]);
    }

    render() {
        return (
            <div>
                <button onClick={this.handleSubmit} className="b-submit btn btn-primary">Submit Changes for <strong>{this.props.name}</strong></button>
            </div>
        );
    }

}



class ButtonGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newName: "",
            users: ["Everyone"].concat(Object.keys(sampleInput[this.props.eventId]))
        }
    
        this.handleDataSwitch = this.handleDataSwitch.bind(this);
        this.handleKeyInput = this.handleKeyInput.bind(this);
        this.handleNewUser = this.handleNewUser.bind(this);
    }

    handleDataSwitch(name) {
        this.props.onDataSwitch(name);
        // document.querySelector("#user-toggle").innerHTML = name;

    }

    handleKeyInput(event) {
        if(event.target.value.includes(" ")) //no spaces for input
            event.target.value = this.state.newName;
        else    
            this.setState({newName: event.target.value.toLowerCase()});
    }

    handleNewUser(event) {
        event.preventDefault();
        if(Object.keys(sampleInput[this.props.eventId]).includes(this.state.newName)) 
            alert('The name already exists: ' + this.state.newName);
        else if(this.state.newName === "everyone") 
            alert('The name \'everyone\' is reserved');
        else {
            sampleInput[this.props.eventId][this.state.newName] = [];
            this.handleDataSwitch(this.state.newName);
            this.setState({newName: ""});
            this.setState({users: ["Everyone"].concat(Object.keys(sampleInput[this.props.eventId]))});
        } 

    }

    render() {
        return (
            <div>
                <form className="form-inline" onSubmit={this.handleNewUser}>
                    <input type="text" className="form-control mb-2 mr-sm-2" placeholder="Add me..."  onChange={this.handleKeyInput} value={this.state.newName}/>
                    <button className="btn btn-primary  mb-2" type="submit">Add</button>
                </form>
                <UsersDropdown onDataSwitch={this.handleDataSwitch} users={this.state.users} name={this.props.name}/>
            </div>
        );
    }

}

class UsersDropdown extends Component {
    constructor(props) {
        super(props);
        this.handleDataSwitch = this.handleDataSwitch.bind(this);
    }  
    
    handleDataSwitch(e) {
        // e.preventDefault();
        // var name = e.target.dataset.name;
        e.preventDefault();
        var name = e.target.dataset.name;
        this.props.onDataSwitch(name);
    }            

    render() {
        var buttons = this.props.users.map((user) => 
            <button className="dropdown-item" data-name={user} onClick={this.handleDataSwitch} key={"user-"+user}>{user}</button>
        );
        buttons.splice(1,0,(<div key="divider" className="dropdown-divider"></div>));
        return (
            <div className="dropdown">
                <span>Show Availability for: </span>
                <button id="user-toggle" className="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {this.props.name}
                </button>
                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    {buttons}
                </div>
            </div>
        );
    }
    
}
    
class Checkbox extends Component {
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
            <Checkbox key={props.name+"-"+props.id} id={props.id} data={props.data} name={props.name} onBoxClick={props.onBoxClick}/>
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

class App extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            eventId: 0,
            data: null,
            dates: sampleDates[0],
            name: "Everyone",
            path: "/"
        };
        this.handleDataSwitch = this.handleDataSwitch.bind(this);
        this.handleBoxClick = this.handleBoxClick.bind(this);
        this.handlePageSwitch = this.handlePageSwitch.bind(this);
        this.handleNewEvent = this.handleNewEvent.bind(this);
    }

    handleDataSwitch(newName) {
        // console.log(sampleInput);
        // sampleInput[this.state.name] = this.state.data;
        // console.log(sampleInput);
        this.setState( { name: newName }, () => { } );
        this.setState( { data: newName === "Everyone" ? findOverlap(sampleInput[this.state.eventId], this.state.dates) : sampleInput[this.state.eventId][newName] }, () => { } );
    }

    handleBoxClick(target) {
        if(target.classList.contains ("true")) {
            // delete sampleInput[e.target.id];
            target.classList.remove("true");
            target.classList.add("false");
            target.innerHTML = "false";
            // var i = this.state.data.indexOf(target.id);
            // this.setState((pstate) => { (this.state.data = pstate.data.splice(i, 1)) }, 
            //     () => { console.log(this.state.data);});
        }   
        else {
            // sampleInput[e.target.id] = 1;
            target.classList.remove("false");
            target.classList.add("true");
            target.innerHTML = "true";
            // this.setState((pstate) => { (this.state.data = pstate.data.push(target.id)) }, () => { console.log(this.state.data);});
        }       
    }

    handlePageSwitch(e) {
        e.preventDefault();
        var href = e.target.getAttribute('href');
        if(href.includes("?event=")) {
            var id = parseInt(href.substr(7));
            this.setState({
                eventId: id,
                name: "Everyone",
                data: findOverlap(sampleInput[id], sampleDates[id]),
                dates: sampleDates[id]
            });
            // this.setState( { name: "Everyone" });
            // this.setState( { data: findOverlap(sampleInput[id], sampleDates[id]) } );
            // this.setState( { dates: sampleDates[id]} );
        }
        this.setState( {path: href} );
    }

    //validates date inputs from user
    validate(value) {
        var arr = value.split('/');
        if(arr.length !== 2) return null;
        var formatted = arr.map((v)=> parseInt(v)).join('-');
        if(formatted.includes("NaN")) return null;
        else return formatted;
    }

    handleNewEvent(e) {
        e.preventDefault();
        document.querySelector("#invalid-err").classList.add("hide");
        document.querySelector("#empty-err").classList.add("hide");
        // console.log(e.target.querySelectorAll("input"));
        var inputs = e.target.querySelectorAll("input");
        var newDates = [];
        inputs.forEach((input)=> {
            // console.log(input.value);
            input.classList.remove("error");
            if(input.value !== "") {
                var d = this.validate(input.value);
                if(!d) {
                    input.classList.add("error");
                    document.querySelector("#invalid-err").classList.remove("hide");
                }
                else newDates.push(d);
            }
        });
        if(newDates.length === 0) document.querySelector("#empty-err").classList.remove("hide");
        else alert("Good job (some of) your inputs are valid. Event add coming soon...");
    }

    render() {
        if(this.state.path.includes("?event=")) //event page
            return(
                <div>
                    <p><a className="btn btn-primary" href = "/" onClick={this.handlePageSwitch}>&#x21d0; Home</a></p>
                    <ButtonGroup onDataSwitch={this.handleDataSwitch} eventId={this.state.eventId} name={this.state.name}/>
                    <table className="table">
                        <Thead dates={this.state.dates} />
                        <Tbody name={this.state.name} data={this.state.data} onBoxClick={this.handleBoxClick} dates={this.state.dates} />
                    </table>
                    {this.state.name !== "Everyone" && <SubmitButton name={this.state.name} eventId={this.state.eventId}/>}
                    {this.state.name === "Everyone" && <span className="b-submit">(Editing is not allowed for this selection)</span>}
                </div>
            );
        else //home page events list
            return(
                <div>
                    <p>
                        <button className="btn btn-primary" type="button" data-toggle="collapse" data-target="#fcollapse" aria-expanded="false" aria-controls="collapseExample">
                            Add New Event
                        </button>
                    </p>
                    <div className="collapse" id="fcollapse">
                        <div className="card card-body">
                            <p>Add up to 5 dates that are within 1 month from now(?)</p> 
                            <form className="form-inline dates-form" onSubmit={this.handleNewEvent} id="newForm">
                                <label htmlFor="date1" hidden/>                                                                  
                                <input type="text" id="date1" className="form-control mb-2 mr-sm-2" placeholder="mm/dd"/>
                                <input type="text" className="form-control mb-2 mr-sm-2" placeholder="mm/dd"/>
                                <input type="text" className="form-control mb-2 mr-sm-2" placeholder="mm/dd"/>
                                <input type="text" className="form-control mb-2 mr-sm-2" placeholder="mm/dd"/>
                                <input type="text" className="form-control mb-2 mr-sm-2" placeholder="mm/dd"/>
                                <button className="btn btn-primary mb-2" type="submit">Add</button>
                            </form>
                            <p id="invalid-err" className="hide">Please enter dates in valid format.</p>
                            <p id="empty-err" className="hide">Please enter at least 1 valid date.</p>
                        </div>
                    </div>

                    <ul>
                        <li><a href = "?event=0" onClick={this.handlePageSwitch}>Sample event 1</a></li>
                        <li><a href = "?event=1" onClick={this.handlePageSwitch}>Sample event 2</a></li>
                    </ul>
                </div>
            )
    }
}

export default App;