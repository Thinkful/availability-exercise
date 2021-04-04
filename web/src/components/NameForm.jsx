import React, { useContext, useRef, useState } from "react";
import { observer } from "mobx-react";
import debounce from "lodash.debounce";

import { AppContext } from "../models/AppContext";
import { isValidName } from "../models/sanity";

export const NameForm = observer(() => {
    const { model } = useContext(AppContext);
    const nameRef = useRef(null);

    // Used to track whether name input value is invalid or not
    const [invalidName, setInvalidName] = useState(false);

    // Handle name input change.
    // NOTE: Since name is needed to fetch booking data and we don't want to do that on every keystroke,
    // a reasonable delay is applied via debounce before fetching.
    const handleNameChange = debounce(() => {
        const name = nameRef.current && nameRef.current.value.trim();
        if (name && isValidName(name)) {
            model.setName(name);
            setInvalidName(false); // clear invalid name marker since name is good.
        } else {
            setInvalidName(!!name); // set invalid name marker unless name empty
        }
    }, 750);

    // Ignore submit as there is no visual hint suggesting enter key does anything.
    // Booking will be instead auto-fetched.
    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <form id="name-form" className="col-md-6" onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="name-field">Your Name</label>
                <input
                    ref={nameRef}
                    className={`form-control ${invalidName ? "invalid-input" : ""}`}
                    type="text"
                    id="name-field"
                    onChange={handleNameChange}
                />
                <div className="input-note">Your name is required to book time with an advisor.</div>
            </div>
        </form>
    );
});
