import { AdvisorID, TimeSlot, Today, RawDate, RawTime, RawTimeSlot, UserID } from "./types";
import { API_BASE } from "./configs";
import { AppError, RequestError } from "./errors";

/**
 * Used to checks for common fetch error response.
 * 
 * @param res
 * @returns 
 */
function checkError(res: Response): Response {
    if (res.ok) {
        return res;
    } else {
        throw new RequestError(`${res.url} failed`, res.status, res.statusText);
    }
}

/**
 * Retrieves today's date.
 * 
 * @returns structure containing date
 */
export async function fetchToday(): Promise<Today> {
    return fetch(`${API_BASE}/today`).then(res => checkError(res).json());
}

type DatedTimeSlots = Record<RawDate, Record<RawTime, AdvisorID>>;

/**
 * Converts DatedTimeSlots to list of TimeSlots for easier manipultion.
 * 
 * @param data 
 * @returns list of timeslots.
 */
function parseDatedTimeSlots(data: DatedTimeSlots): TimeSlot[] {
    const timeslots: TimeSlot[] = [];
    for (const group of Object.values(data)) {
        for (const [rawTime, advisor] of Object.entries(group)) {
            timeslots.push({ advisor, rawTime, time: new Date(rawTime)});
        }
    }
    return timeslots;
}

function makeTimeSlot(raw: RawTimeSlot): TimeSlot {
    return { ...raw, time: new Date(raw.rawTime) };
}

type RawAvailability  = DatedTimeSlots;
type AvailabilityData = TimeSlot[];

/**
 * Retrieves timeslots available for booking.
 * 
 * @returns list of timeslots available for booking
 */
export async function fetchAvailability(): Promise<AvailabilityData> {
    const data = await fetch(`${API_BASE}/availability`).then(res => checkError(res).json()) as RawAvailability;
    return parseDatedTimeSlots(data);
}

type RawBooked  = RawTimeSlot[];
type BookedData = TimeSlot[];

/**
 * Retrieves given user's booked timeslots.
 * 
 * @param user 
 * @returns 
 */
export async function fetchBooked(user: UserID): Promise<BookedData> {
    const url = addParamsToUrl(`${API_BASE}/booked`, { user });
    const data = await fetch(url).then(res => checkError(res).json()) as RawBooked;
    return data.map(slot => makeTimeSlot(slot));
}

/**
 * Books a timeslot for given user.
 * 
 * @param slot 
 * @param user 
 * @returns updated list of user's booked timeslots
 */
export async function bookTimeSlot(slot: TimeSlot, user: UserID): Promise<BookedData> {
    if (slot.user) {
        throw new AppError('timeslot already booked');
    }
    const url = addParamsToUrl(`${API_BASE}/book`, {
        user,
        advisor: String(slot.advisor),
        time: slot.rawTime,
    });
    const data = await fetch(url, { method: 'POST' }).then(res => checkError(res).json()) as RawBooked;
    return data.map(slot => makeTimeSlot(slot));
}

/**
 * Cancels a timeslot previously booked by given user.
 * 
 * @param slot 
 * @param user 
 * @returns updated list of user's booked timeslots
 */
export async function cancelTimeSlot(slot: TimeSlot, user: UserID): Promise<BookedData> {
    if (!slot.user) {
        throw new AppError('cannot cancel unbooked timeslot');
    }
    if (slot.user !== user) {
        throw new AppError('cannot cancel timeslot others booked');
    }
    const url = addParamsToUrl(`${API_BASE}/cancel`, {
        user: user,
        advisor: String(slot.advisor),
        time: slot.rawTime,
    });
    const data = await fetch(url, { method: 'POST' }).then(res => checkError(res).json()) as RawBooked;
    return data.map(slot => makeTimeSlot(slot));
}

/**
 * Builds URL with query parameters.
 * 
 * @param url
 * @param params 
 * @returns url
 */
function addParamsToUrl(url: string, params: Record<string, string>): string {
    const urlObj = new URL(url);
    const urlParams = new URLSearchParams(urlObj.search);
    Object.keys(params).forEach(key => urlParams.append(key, params[key]));
    urlObj.search = urlParams.toString();
    return urlObj.toString();
}
