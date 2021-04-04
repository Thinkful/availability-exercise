import React, { useContext } from "react";
import { observer } from "mobx-react";

import { AppContext } from "../models/AppContext";
import { availableAdvisors, filterByAdvisor, formattedTime } from "../models/timeslots";

export const AvailableTimes = observer(({ slots }) => {
    const advisors = availableAdvisors(slots);
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
                    {advisors.map((advisor) => (
                        <AdvisorAvailableTimes
                            advisor={advisor}
                            slots={filterByAdvisor(slots, advisor)}
                            key={advisor}
                        />
                    ))}
                </tbody>
            </table>
        </>
    );
});

const AdvisorAvailableTimes = observer(({ advisor, slots }) => {
    return (
        <tr>
            <td>{advisor}</td>
            <td>
                <ul className="list-unstyled">
                    {slots.map((slot) => (
                        <AvailableTimeSlot slot={slot} key={`slot-${slot.advisor}-${slot.time}`} />
                    ))}
                </ul>
            </td>
        </tr>
    );
});

const AvailableTimeSlot = observer(({ slot }) => {
    const { model } = useContext(AppContext);
    const handleBook = () => model.book(slot);
    return (
        <li>
            <time dateTime={slot.time.toUTCString()} className="book-time">
                {formattedTime(slot)}
            </time>
            <button className="book btn-small btn-primary" onClick={handleBook}>
                Book
            </button>
        </li>
    );
});
