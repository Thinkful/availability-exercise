import { action, autorun, makeObservable, observable } from "mobx";

import { AdvisorID, RawTime, TimeSlot, UserID } from "./types";
import { fetchToday, fetchAvailability, fetchBooked, bookTimeSlot, cancelTimeSlot } from "./api";

export interface IAppModel {
    today: string;
    name: UserID;
    availableTimeSlots: TimeSlot[];
    bookedTimeSlots: TimeSlot[];

    load(): Promise<void>;

    book(slot: TimeSlot): Promise<void>;
    setName(value: string): void;
}

export class AppModel implements IAppModel {
    today: string = '';
    name: UserID = '';
    availableTimeSlots: TimeSlot[] = [];
    bookedTimeSlots: TimeSlot[] = [];

    constructor() {
        makeObservable(this, {
            today: observable,
            name: observable,
            availableTimeSlots: observable,
            bookedTimeSlots: observable,

            setName: action,
            setToday: action,
            setAvailableTimeSlots: action,
            setBookedTimeSlots: action,
        });

        // Auto update bookedTimeSlots when name changes.
        // NOTE: name is not expected to change often so
        // debouncing should be done in the component event handling.
        autorun(() => {
            if (this.name) {
                this.updateBooked(this.name);
            }
        })
    }

    async load() {
        try {
            const [{ today }, available] = await Promise.all([
                fetchToday(),
                fetchAvailability(),
            ]);
            this.setToday(today);
            this.setAvailableTimeSlots(available);
        } catch (err) {
            console.error(err);
            this.informUser("Failed to fetch availability data.");
        }
    }

    setName(value: string) {
        this.name = value;
    }

    find(advisor: AdvisorID, rawTime: RawTime): TimeSlot | undefined {
        let slot = this.bookedTimeSlots.find(s => s.advisor === advisor && s.rawTime === rawTime );
        if (slot) {
            return slot;
        }
        return this.availableTimeSlots.find(s => s.advisor === advisor && s.rawTime === rawTime );
    }

    async book(slot: TimeSlot): Promise<void> {
        if (!this.name) {
            this.informUser("Please enter your name to book.");
            return;
        }

        try {
            const booked = await bookTimeSlot(slot, this.name);
            this.setBookedTimeSlots(booked);
            await this.updateAvailableTimeSlots();
        } catch (err) {
            console.error(err);
            this.informUser("Failed to book time.");
        }
    }

    async cancel(slot: TimeSlot): Promise<void> {
        try {
            const booked = await cancelTimeSlot(slot, this.name);
            this.setBookedTimeSlots(booked);
            await this.updateAvailableTimeSlots();
        } catch (err) {
            console.error(err);
            this.informUser("Failed to book time.");
        }
    }

    setToday(value: string) {
        this.today = value;
    }

    setAvailableTimeSlots(value: TimeSlot[]) {
        this.availableTimeSlots = value;
    }

    setBookedTimeSlots(value: TimeSlot[]) {
        this.bookedTimeSlots = value;
    }

    private async updateAvailableTimeSlots() {
        try {
            const slots = await fetchAvailability();
            this.setAvailableTimeSlots(slots);
        } catch (err) {
            console.error(err);
            this.informUser("Failed to fetch booking data.");
        }
    }

    private async updateBooked(name: string) {
        try {
            const slots = await fetchBooked(this.name);
            this.setBookedTimeSlots(slots);
        } catch (err) {
            console.error(err);
            this.informUser("Failed to fetch booking data.");
        }
    }

    private informUser(message: string) {
        // TODO: replace with non-blocking UI, like Material UI's Snackbar.
        alert(message);
    }
}
