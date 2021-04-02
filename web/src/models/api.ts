import { ITimeSlot, ITodayData, RawTimeSlot, UserID } from "./types";
import { API_BASE } from "./configs";

export async function fetchToday(): Promise<ITodayData> {
    return fetch(`${API_BASE}/today`).then(res => res.json());
}

type DatedTimeSlots = Record<string, Record<string, number>>;

function parseDatedTimeSlots(data: DatedTimeSlots): ITimeSlot[] {
    const timeslots: ITimeSlot[] = [];
    for (const group of Object.values(data)) {
        for (const [rawTime, advisor] of Object.entries(group)) {
            timeslots.push({ advisor, rawTime, time: new Date(rawTime)});
        }
    }
    return timeslots;
}

function makeTimeSlot(raw: RawTimeSlot): ITimeSlot {
    return { ...raw, time: new Date(raw.rawTime) };
}

type RawAvailability  = DatedTimeSlots;
type AvailabilityData = ITimeSlot[];

export async function fetchAvailability(): Promise<AvailabilityData> {
    const data = await fetch(`${API_BASE}/availability`).then(res => res.json()) as RawAvailability;
    return parseDatedTimeSlots(data);
}

type RawBooked  = RawTimeSlot[];
type BookedData = ITimeSlot[];

export async function fetchBooked(user: UserID): Promise<BookedData> {
    const url = addParamsToUrl(`${API_BASE}/booked`, { user });
    const data = await fetch(url).then(res => res.json()) as RawBooked;
    return data.map(slot => makeTimeSlot(slot));
}

export async function bookTimeSlot(slot: ITimeSlot, user: UserID): Promise<BookedData> {
    const url = addParamsToUrl(`${API_BASE}/book`, {
        user,
        advisor: String(slot.advisor),
        time: slot.rawTime,
    });
    const data = await fetch(url, { method: 'POST' }).then(res => res.json()) as RawBooked;
    return data.map(slot => makeTimeSlot(slot));
}

export async function cancelTimeSlot(slot: ITimeSlot, user: UserID): Promise<BookedData> {
    if (slot.user !== user) {
        throw new Error('invalid cancel request');
    }
    const url = addParamsToUrl(`${API_BASE}/cancel`, {
        user: user,
        advisor: String(slot.advisor),
        time: slot.rawTime,
    });
    const data = await fetch(url, { method: 'POST' }).then(res => res.json()) as RawBooked;
    return data.map(slot => makeTimeSlot(slot));
}

// Adds URL params to URL
function addParamsToUrl(url: string, params: Record<string, string>) {
    const urlObj = new URL(url);
    const urlParams = new URLSearchParams(urlObj.search);
    Object.keys(params).forEach(key => urlParams.append(key, params[key]));
    urlObj.search = urlParams.toString();
    return urlObj.toString();
}
