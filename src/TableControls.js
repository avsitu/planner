import React, { Component } from 'react'

class Controls extends Component<
        {eventId:number,name:string,users:string[],onNameSwitch(name:string):void,onPageSwitch(e):void,onNewUser(newName:string):void},
        {newName:string}
    > {
    constructor(props) {
        super(props);
        this.state = {
            newName: "",
            // users: ["Everyone"].concat(Object.keys(sampleInput[this.props.eventId]))
        }
    
        this.handleNameSwitch = this.handleNameSwitch.bind(this);
        this.handleKeyInput = this.handleKeyInput.bind(this);
        this.handleNewUser = this.handleNewUser.bind(this);
        this.handlePageSwitch = this.handlePageSwitch.bind(this);
    }

    handleNameSwitch(name) {
        this.props.onNameSwitch(name);
        // document.querySelector("#user-toggle").innerHTML = name;
    }

    handlePageSwitch(e) {
        this.props.onPageSwitch(e);
    }

    handleKeyInput(event) {
        if(event.target.value.includes(" ")) //no spaces for input
            event.target.value = this.state.newName;
        else    
            this.setState({newName: event.target.value.toLowerCase()});
    }

    handleNewUser(event) {
        event.preventDefault();
        if(this.props.users.includes(this.state.newName)) 
            alert('The name already exists: ' + this.state.newName);
        else if(this.state.newName === "everyone" || this.state.newName === "") 
            alert('That name is invalid.');
        else {
            // sampleInput[this.props.eventId][this.state.newName] = [];
            // this.handleNameSwitch(this.state.newName);
            this.props.onNewUser(this.state.newName);
            this.setState({newName: ""});
        } 
    }

    render() {
        return (
            <div>
                <p><a className="btn btn-primary" href = "/" onClick={this.handlePageSwitch}>&#x21d0; Home</a></p>
                <form className="form-inline" onSubmit={this.handleNewUser}>
                    <input type="text" className="form-control mb-2 mr-sm-2" placeholder="Add me..." onChange={this.handleKeyInput} value={this.state.newName}/>
                    <button className="btn btn-primary  mb-2" type="submit">Add</button>
                </form>
                <UsersDropdown onNameSwitch={this.handleNameSwitch} users={this.props.users} name={this.props.name}/>
            </div>
        );
    }

}

class UsersDropdown extends Component<{onNameSwitch(name:string):void,users:string[],name:string},{}> {
    constructor(props) {
        super(props);
        this.handleNameSwitch = this.handleNameSwitch.bind(this);
    }  
    
    handleNameSwitch(e) {
        // e.preventDefault();
        // var name = e.target.dataset.name;
        e.preventDefault();
        var name = e.target.dataset.name;
        this.props.onNameSwitch(name);
    }            

    render() {
        var buttons = this.props.users.map((user) => 
            <button className="dropdown-item" data-name={user} onClick={this.handleNameSwitch} key={"user-"+user}>{user}</button>
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

export default Controls;