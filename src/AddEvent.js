import React, { Component } from 'react'

class NewEvent extends Component<{ onFormSubmit(e): void }, {}> {
    constructor(props) {
        super(props);
        this.handleNewEvent = this.handleNewEvent.bind(this);
    }

    handleNewEvent(e) {
        this.props.onFormSubmit(e);
    }

    render() {
        return (
            <div>
                <p>
                    <button className="btn btn-primary" type="button" data-toggle="collapse" data-target="#fcollapse" aria-expanded="false" aria-controls="collapseExample">
                        Add New Event
                        </button>
                </p>
                <div className="collapse" id="fcollapse">
                    <div className="card card-body">
                        <p>Select Dates:</p>
                        <form className="form-inline dates-form" onSubmit={this.handleNewEvent} id="newForm">
                            <label htmlFor="date1" hidden />
                            <input type="date" className="form-control mb-2 mr-sm-2" />
                            <input type="date" className="form-control mb-2 mr-sm-2" />
                            <input type="date" className="form-control mb-2 mr-sm-2" />
                            <input type="date" className="form-control mb-2 mr-sm-2" />
                            <input type="date" className="form-control mb-2 mr-sm-2" />
                            <button className="btn btn-primary mb-2" type="submit">Add</button>
                        </form>
                        <p id="invalid-err" className="hide">Please enter dates in valid format.</p>
                        <p id="empty-err" className="hide">Please enter at least 1 valid date.</p>
                    </div>
                </div>
            </div>
        )
    }

}

export default NewEvent;