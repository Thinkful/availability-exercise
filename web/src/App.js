import React, { Component } from 'react';
import debounce from 'lodash.debounce';

import { fetchToday, fetchAvailability, fetchBooked } from "./api";

import { AvailableTimes } from "./AvailableTimes";
import { BookedTimes } from "./BookedTimes";
import { isValidName } from './sanity';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.userRef = React.createRef();
    }

    componentDidMount() {
        this.loadData();
    }

    async loadData() {
        try {
            const [{ today }, availability] = await Promise.all([
                fetchToday(),
                fetchAvailability(),
            ]);
            this.setState({ today, availability });

            if (this.state.user) {
                const booked = await fetchBooked(this.state.user);
                this.setState({ booked });
            }
        } catch (err) {
            console.error("Failed to fetch data", err);
            alert(err);
        }
    }

    render() {
        const { today, availability, booked, badName } = this.state;
        return (
            <div className="App container">
                <h1>Book Time with an Advisor</h1>

                {today && <span id="today">Today is {today}.</span>}

                <form id="name-form" className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="name-field">Your Name</label>
                        <input type="text" id="name-field" className={`form-control ${badName ? 'bad-input' : ''}`} ref={this.userRef} onChange={this.handleUserChange} />
                        <div className="input-note">Your name is required to book time with an advisor.</div>
                    </div>
                </form>

                <AvailableTimes availability={availability} onBook={this.handleBooking} />
                <BookedTimes booked={booked} />
            </div>
        );
    }

    handleUserChange = debounce(() => {
        const { badName } = this.state;
        const user = this.userRef.current && this.userRef.current.value.trim();
        if (user && isValidName(user)) {
            // clear warning since name is good.
            this.setState({ user, badName: false });
            if (user) {
                fetchBooked(user)
                    .then(booked => {
                        this.setState({ booked });
                    }).catch(err => {
                        alert("Named entered is invalid.")
                    })
            }
        } else {
            // set or clear visual bad input warning depending on user is set.
            this.setState({ badName: !!user });
        }
    }, 750);

    handleBooking = async (slot) => {
        const { user } = this.state;
        if (!user) {
            alert("Please enter your name to book.");
        }
    }
}

export default App;
