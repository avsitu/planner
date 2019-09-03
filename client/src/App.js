import React, { Component } from 'react'
import EventTable from './EventTable'
import SubmitButton from './UpdateEvent'
import NewEvent from './AddEvent'
import Controls from './TableControls'

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

class App extends Component<{},{eventId:number,data:string[],dates:string[],users:string[],name:string,path:string}> {
    constructor(props, context) {
        super(props, context);
        this.state = {
            eventId: 0,
            data: [],
            dates: [],
            users: [],
            name: "",
            path: "/"
        };
        this.handleNameSwitch = this.handleNameSwitch.bind(this);
        this.handleBoxClick = this.handleBoxClick.bind(this);
        this.handlePageSwitch = this.handlePageSwitch.bind(this);
        this.handleNewEvent = this.handleNewEvent.bind(this);
        this.handleEventUpdate = this.handleEventUpdate.bind(this);
        this.handleNewUser = this.handleNewUser.bind(this);
    }

    componentDidMount() {
        fetch("/get/users")
        .then(res => res.json())
        .then(
          (result) => {
            console.log(result);
            sampleInput[0] = result;
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          (error) => {
            console.log(error);
          }
        )        
    }

    handleNameSwitch(newName) {
        // console.log(sampleInput);
        // sampleInput[this.state.name] = this.state.data;
        // console.log(sampleInput);
        this.setState({ 
            name: newName,
            data: newName === "Everyone" ? findOverlap(sampleInput[this.state.eventId], this.state.dates) : sampleInput[this.state.eventId][newName] 
        });
        // this.setState( { }, () => { } );
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
                dates: sampleDates[id],
                users: ["Everyone"].concat(Object.keys(sampleInput[id]))
            });
        }
        this.setState( {path: href} );
    }

    handleEventUpdate(selections) {
        sampleInput[this.state.eventId][this.state.name] = selections;
        console.log("submmited to sampleInput: ", this.state.name, sampleInput[this.state.eventId][this.state.name]);
    }

    handleNewUser(newName) {
        sampleInput[this.state.eventId][newName] = [];
        this.setState((state)=> ({users: state.users.concat([newName])}));
        this.handleNameSwitch(newName);
    }

    /*-----------------------------*/

    //validates date inputs from user
    validate(value) {
        return true;
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
            console.log(input.value);
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
        // ---------- make sure to validate for dup dates 
    }

    render() {
        if(this.state.path.includes("?event=")) //event page
            return(
                <div>
                    <Controls eventId={this.state.eventId} name={this.state.name} users={this.state.users}
                        onNameSwitch={this.handleNameSwitch} onPageSwitch={this.handlePageSwitch} onNewUser={this.handleNewUser}/>
                    <EventTable dates={this.state.dates} name={this.state.name} data={this.state.data}/>
                    <SubmitButton name={this.state.name} eventId={this.state.eventId} onSubmit={this.handleEventUpdate}/>
                </div>
            );
        else //home page events list
            return(
                <div>
                    <NewEvent onFormSubmit={this.handleNewEvent}/>

                    <ul>
                        <li><a href = "?event=0" onClick={this.handlePageSwitch}>Sample event 1</a></li>
                        <li><a href = "?event=1" onClick={this.handlePageSwitch}>Sample event 2</a></li>
                    </ul>
                </div>
            )
    }
}

export default App;