import { AdvisorID, TimeSlot } from "./types";

export function sortTimeSlots(slots: TimeSlot[]): TimeSlot[] {
    slots.sort((a, b) => a.time.getTime() - b.time.getTime());
    return slots;
}

export function availableAdvisors(slots: TimeSlot[]): AdvisorID[] {
    const advisors = new Set<AdvisorID>();
    slots.forEach(slot => advisors.add(slot.advisor));
    return Array.from(advisors.values());
}

export function filterByAdvisor(slots: TimeSlot[], advisor: AdvisorID): TimeSlot[] {
    return slots.filter(slot => slot.advisor === advisor);
}

const timeFormat = new Intl.DateTimeFormat("en-US", {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
});

// HACK: Internationalized time format with example's style variation
export function formattedTime(slot: TimeSlot) {
    return timeFormat
        .format(slot.time)
        .replace(",", "")
        .replace("AM", "am")
        .replace("PM","pm")
}