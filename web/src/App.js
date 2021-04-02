import React, { Component } from 'react';
import { observer } from "mobx-react";

import { appModel } from "./models/AppModel";

import { AvailableTimes } from "./components/AvailableTimes";
import { BookedTimes } from "./components/BookedTimes";
import { NameForm } from "./components/NameForm";

class App extends Component {
    constructor(props) {
        super(props);
        this.nameRef = React.createRef();
    }

    componentDidMount() {
        appModel.load();
    }

    render() {
        const { today } = appModel;
        return (
            <div className="App container">
                <h1>Book Time with an Advisor</h1>

                {today && <span id="today">Today is {today}.</span>}

                <NameForm />
                <AvailableTimes />
                <BookedTimes />
            </div>
        );
    }
}

export default observer(App);
