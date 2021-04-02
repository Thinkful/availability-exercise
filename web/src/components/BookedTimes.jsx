import React from 'react';
import { observer } from "mobx-react";

import { appModel } from "../models/AppModel";
import { formattedTime } from "../models/timeslots";

export const BookedTimes = observer(() => {
    const slots = appModel.bookedTimeSlots;
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
                    {slots.map(slot => (
                        <BookedTimeSlot slot={slot} key={`book-${slot.advisor}-${slot.time.getTime()}`} />
                    ))}
                </tbody>
            </table>
        </>
    )
});

const BookedTimeSlot = observer(({ slot }) => {
    return (
        <tr >
            <td>{slot.advisor}</td>
            <td>{slot.user}</td>
            <td>
                <time dateTime={slot.time.toUTCString()}>{formattedTime(slot)}</time>
            </td>
        </tr>
    )
});