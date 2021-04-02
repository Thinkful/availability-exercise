import React, { useRef, useState } from 'react';
import { observer } from "mobx-react";
import debounce from 'lodash.debounce';

import { appModel } from "../models/AppModel";
import { isValidName } from '../models/sanity';

export const NameForm = observer(() => {
    const nameRef = useRef(null);
    const [invalidName, setInvalidName] = useState(false);

    const handleNameChange = debounce(() => {
        const name = nameRef.current && nameRef.current.value.trim();
        if (name && isValidName(name)) {
            appModel.setName(name);
            setInvalidName(false); // clear invalid name marker since name is good.
        } else {
            setInvalidName(!!name); // set invalid name marker unless name empty
        }
    }, 750);

    return (
        <form id="name-form" className="col-md-6">
        <div className="form-group">
            <label htmlFor="name-field">Your Name</label>
                <input ref={nameRef} className={`form-control ${invalidName ? 'bad-input' : ''}`}
                    type="text" id="name-field"
                    onChange={handleNameChange}  />
            <div className="input-note">Your name is required to book time with an advisor.</div>
        </div>
    </form>
    )
});