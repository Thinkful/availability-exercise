const fs = require('fs');
const fetch = require("node-fetch");

// NOTE: Since details of the API is not available except for availability endpoint,
// it's fetched once at start, converted to TimeSlot format for easier manipulation,
// and stored in memory. Changes to the stored data is not forward to Thinkful server.

class TimeStore {

    constructor(slots, options = {}) {
        this.slots = slots;
        this.options = options;
    }

    // Finds a timeslot identified uniquely by advisor and rawTime pair
    find(advisor, rawTime) {
        return this.slots.find((s) => s.rawTime === rawTime && s.advisor === Number(advisor));
    }

    // Returns timeslots booked by specified user.
    booked(user) {
        return this.slots.filter((s) => s.user === user);
    }

    // Returns available timeslots
    unbooked() {
        return this.slots.filter((s) => !s.user);
    }

    /**
     * Returns available timeslots in DatedTimeSlots format used by Thinkful API.
     * 
     * @returns timeslots in Thinkful API format.
     */
    unbookedDatedTimeSlots() {
        return encodeDatedTimeSlots(this.unbooked());
    }

    book(user, advisor, rawTime) {
        const slot = this.find(advisor, rawTime);
        if (!slot) {
            this.log('error', "book: missing timeslot", { user, advisor, rawTime })
            return null;
        } else if (slot.user && slot.user !== user) {
            // HACK: Ignore racing condition for now.
            this.log('error', "book: booked by another user", { user, advisor, rawTime, slot });
            return null;
        } else {
            if (!slot.user) {
                slot.user = user;
            } else {
                this.log('warn', "book: already booked", { user, advisor, rawTime, slot });
            }
            return slot;
        }
    }

    cancel(user, advisor, rawTime) {
        const slot = this.find(advisor, rawTime);
        if (!slot) {
            this.log('error', "cancel: missing timeslot", { user, advisor, rawTime })
            return null;
        } else if (!slot.user) {
            // HACK: Ignore racing condition for now.
            this.log('error', "cancel: unbooked timeslot", { user, advisor, rawTime, slot })
            return null;
        } else if (slot.user !== user) {
            // HACK: Ignore racing condition for now.
            this.log('error', "cancel: booked by another user", { user, advisor, rawTime, slot })
            return null;
        } else {
            delete slot.user;
            return slot;
        }
    }

    log(level, message, data) {
        if (this.options.quiet) {
            return;
        }
        console[level](message, data);
    }
}


// Thinkful API

function fetchAvailableTimeSlots() {
    return fetch('https://www.thinkful.com/api/advisors/availability')
        .then(res => res.json())
        .then(data => decodeDatedTimeSlots(data));
}

function decodeDatedTimeSlots(data) {
    const timeslots = [];
    for (const group of Object.values(data)) {
        for (const [rawTime, advisorId] of Object.entries(group)) {
            timeslots.push({
                advisor: advisorId,
                rawTime,
            });
        }
    }
    return timeslots;
}

function encodeDatedTimeSlots(slots) {
    // ISO-8601 time are sortable
    const sortedSlots = slots.slice().sort((a, b) => a.rawTime < b.rawTime);

    // Group by date. Map will return dates in the order entries are added.
    const dateMap = new Map();
    for (const slot of sortedSlots) {
        const date = dateFromRawTime(slot.rawTime);
        let dateSlots = dateMap.get(date);
        if (dateSlots) {
            dateSlots.push(slot);
        } else {
            dateSlots = [slot];
            dateMap.set(date, dateSlots);
        }
    }

    // Convert to DatedTimeSlots format
    const result = {};
    for (const date of dateMap.keys()) {
        const dateSlots = dateMap.get(date);
        const dateEntry = {};
        for (const slot of dateSlots) {
            dateEntry[slot.rawTime] = slot.advisor;
        }
        result[date] = dateEntry;
    }
    return result;
}

/**
 * Extracts date portion of RawTime string.
 * 
 * @param {*} rawTime 
 * @returns {string} ISO-8601 date part (YYYY-MM-DD) 
 */
function dateFromRawTime(rawTime) {
    const t = rawTime.indexOf('T');
    return rawTime.substring(0, t);
}


// Snapshots support for when Thinkful API is unavailable.

const SNAPSHOT_PATH = 'timestore.json';

function loadSnapshot() {
    if (fs.existsSync(SNAPSHOT_PATH)) {
        return JSON.parse(fs.readFileSync(SNAPSHOT_PATH));
    } else {
        return [];
    }
}

function saveSnapshot(slots) {
    fs.writeFileSync(SNAPSHOT_PATH, JSON.stringify(slots));
}


// Convenience

async function getTimeStore() {
    let slots = [];
    try {
        slots = await fetchAvailableTimeSlots();
        saveSnapshot(slots);
    } catch (err) {
        console.error(err);
        slots = loadSnapshot();
    }
    return new TimeStore(slots);
}


module.exports = {
    fetchAvailableTimeSlots,
    getTimeStore,
    loadSnapshot,
    saveSnapshot,
    TimeStore,
}
