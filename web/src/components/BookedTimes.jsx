import React, { useContext } from "react";
import { observer } from "mobx-react";

import { AppContext } from "../models/AppContext";
import { formattedTime } from "../models/timeslots";

export const BookedTimes = observer(({ slots }) => {
    return (
        <>
            <h2>Booked Times</h2>
            <table className="bookings table">
                <thead>
                    <tr>
                        <th>Advisor ID</th>
                        <th>Student Name</th>
                        <th>Date/Time</th>
                    </tr>
                </thead>
                <tbody>
                    {slots.map((slot) => (
                        <BookedTimeSlot slot={slot} key={`book-${slot.advisor}-${slot.time}`} />
                    ))}
                </tbody>
            </table>
        </>
    );
});

const BookedTimeSlot = observer(({ slot }) => {
    const { model } = useContext(AppContext);
    const handleCancel = () => model.cancel(slot);
    return (
        <tr>
            <td>{slot.advisor}</td>
            <td>{slot.user}</td>
            <td>
                <time dateTime={slot.time.toUTCString()}>{formattedTime(slot)}</time>
            </td>
            <td>
                <button className="book btn-small btn-dark" onClick={handleCancel}>
                    Cancel
                </button>
            </td>
        </tr>
    );
});
