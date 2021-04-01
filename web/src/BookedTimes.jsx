import React from 'react';
import { formattedTime } from "./timeslots";

export function BookedTimes({ booked }) {
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
                    {booked && booked.map(slot => (
                        <BookedTimeSlot slot={slot} key={`book-${slot.advisor}-${slot.time.getTime()}`} />
                    ))}
                </tbody>
            </table>
        </>
    )
}

function BookedTimeSlot({ slot, user }) {
    return (
        <tr >
            <td>{slot.advisor}</td>
            <td>{slot.user}</td>
            <td>
                <time dateTime={slot.time.toUTCString()}>{formattedTime(slot)}</time>
            </td>
        </tr>
    )
}