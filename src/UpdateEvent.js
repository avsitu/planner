import React, { Component } from 'react'

class SubmitButton extends Component<{name:string,eventId:number,onSubmit(selections:string[]):void},{}> {
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
        // var name = this.props.name;
        // sampleInput[this.props.eventId][name] = this.currentSelection();
        this.props.onSubmit(this.currentSelection());
    }

    render() {
        return (
            <div>
                {this.props.name==="Everyone" && <button disabled className="b-submit btn btn-primary">(You May Not Edit This Selection.) </button>}
                {this.props.name!=="Everyone" && <button onClick={this.handleSubmit} className="b-submit btn btn-primary">Submit Changes for <b>{this.props.name}</b></button>}
            </div>
        );
    }
}

export default SubmitButton;