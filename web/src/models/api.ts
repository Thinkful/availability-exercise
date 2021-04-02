import { TimeSlot, TodayData, UserID } from "./types";
import { sortTimeSlots } from "./timeslots";

export async function fetchToday(): Promise<TodayData> {
    return fetch(`http://localhost:4433/today`).then(res => res.json());
}


type DatedTimeSlots = Record<string, Record<string, number>>;

function parseDatedTimeSlots(data: DatedTimeSlots): TimeSlot[] {
    const timeslots: TimeSlot[] = [];
    for (const group of Object.values(data)) {
        for (const [time, advisor] of Object.entries(group)) {
            timeslots.push({ advisor, time: new Date(time)});
        }
    }
    return sortTimeSlots(timeslots);
}


type RawAvailability  = DatedTimeSlots;
type AvailabilityData = TimeSlot[];

export async function fetchAvailability(): Promise<AvailabilityData> {
    const data = await fetch(`http://localhost:4433/availability`).then(res => res.json()) as RawAvailability;
    return parseDatedTimeSlots(data);
}


type RawBooked  = { advisor: number, time: string, user: string }[];
type BookedData = TimeSlot[];

export async function fetchBooked(user: UserID): Promise<BookedData> {
    const data = await fetch(`http://localhost:4433/booked/${user}`).then(res => res.json()) as RawBooked;
    const slots = data.map(slot => {
        return { advisor: slot.advisor, time: new Date(slot.time), user: slot.user } as TimeSlot;
    });
    return sortTimeSlots(slots);
}
