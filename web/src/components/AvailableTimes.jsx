import React from 'react';
import { observer } from "mobx-react";

import { appModel } from "../models/AppModel";
import { formattedTime } from "../models/timeslots";

export const AvailableTimes = observer(() => {
    return (
        <>
            <h2>Available Times</h2>
            <table className="advisors table">
                <thead>
                    <tr>
                        <th>Advisor ID</th>
                        <th>Available Times</th>
                    </tr>
                </thead>
                <tbody>
                    {appModel.availableAdvisors.map(advisor => (
                            <AdvisorAvailableTimes advisor={advisor} key={advisor} />
                    ))}
                </tbody>
            </table>
        </>
    )
});

const AdvisorAvailableTimes = observer(({ advisor }) => {
    const slots = appModel.availableAdvisorTimeSlots(advisor);
    return (
        <tr>
            <td>{advisor}</td>
            <td>
                <ul className="list-unstyled">
                    {slots.map(slot => (
                        <AvailableTimeSlot slot={slot} key={`slot-${slot.advisor}-${slot.time.getTime()}`} />
                    ))}
                </ul>
            </td>
        </tr>
    )
});

const AvailableTimeSlot = observer(({ slot }) => {
    const handleBooking = () => appModel.book(slot);
    return (
        <li>
            <time dateTime={slot.time.toUTCString()} className="book-time">{formattedTime(slot)}</time>
            <button className="book btn-small btn-primary"
                onClick={handleBooking}>Book</button>
        </li>
    )
});
