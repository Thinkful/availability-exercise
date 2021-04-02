import React, { Component } from 'react';
import { observer } from "mobx-react";

import { AppContext } from "./models/AppContext";
import { AppModel } from "./models/AppModel";

import { AvailableTimes } from "./components/AvailableTimes";
import { BookedTimes } from "./components/BookedTimes";
import { NameForm } from "./components/NameForm";

class App extends Component {
    constructor(props) {
        super(props);

        this.appContext = {
            model: new AppModel(),
        }
    }

    componentDidMount() {
        this.appContext.model.load();
    }

    render() {
        const { model } = this.appContext;
        return (
            <AppContext.Provider value={this.appContext}>
                <div className="App container">
                    <h1>Book Time with an Advisor</h1>

                    {model.today && <span id="today">Today is {model.today}.</span>}

                    <NameForm />
                    <AvailableTimes slots={model.availableTimeSlots} />
                    <BookedTimes slots={model.bookedTimeSlots} />
                </div>
            </AppContext.Provider>
        );
    }
}

export default observer(App);
