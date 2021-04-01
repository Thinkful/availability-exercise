import React from 'react';
import { availableAdvisors, filterByAdvisor, formattedTime } from "./timeslots";

export function AvailableTimes({ availability, onBook }) {
    const advisors = availability ? availableAdvisors(availability) : [];
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
                    {advisors.map(advisor => {
                        const slots = filterByAdvisor(availability, advisor);
                        return (
                            <AdvisorAvailableTimes advisor={advisor} slots={slots} onBook={onBook} key={advisor} />
                        )
                    })}
                </tbody>
            </table>
        </>
    )
}

function AdvisorAvailableTimes({ advisor, slots, onBook }) {
    return (
        <tr>
            <td>{advisor}</td>
            <td>
                <ul className="list-unstyled">
                    {slots.map(slot => (
                        <AvailableTimeSlot slot={slot} onBook={onBook} key={`slot-${slot.advisor}-${slot.time.getTime()}`} />
                    ))}
                </ul>
            </td>
        </tr>
    )
}

function AvailableTimeSlot({ slot, onBook }) {
    const handleBooking = () => onBook(slot);
    return (
        <li>
            <time dateTime={slot.time.toUTCString()} className="book-time">{formattedTime(slot)}</time>
            <button className="book btn-small btn-primary"
                onClick={handleBooking}>Book</button>
        </li>
    )
}
