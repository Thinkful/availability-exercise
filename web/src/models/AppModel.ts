import { action, autorun, computed, makeObservable, observable } from "mobx";

import { AdvisorID, TimeSlot, UserID } from "./types";
import { fetchToday, fetchAvailability, fetchBooked } from "./api";
import { availableAdvisors, filterByAdvisor } from "./timeslots";

class AppModel {
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

            availableAdvisors: computed,
            
            setAvailableTimeSlots: action,
            setBookedTimeSlots: action,
            setName: action,
            setToday: action,
        });

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

    setToday(value: string) {
        this.today = value;
    }

    setName(value: string) {
        this.name = value;
    }

    setAvailableTimeSlots(value: TimeSlot[]) {
        this.availableTimeSlots = value;
    }

    setBookedTimeSlots(value: TimeSlot[]) {
        this.bookedTimeSlots = value;
    }

    get availableAdvisors(): AdvisorID[] {
        return availableAdvisors(this.availableTimeSlots);
    }

    availableAdvisorTimeSlots(advisor: AdvisorID): TimeSlot[] {
        return filterByAdvisor(this.availableTimeSlots, advisor);
    }

    async book(slot: TimeSlot) {
        // TODO
        if (!this.name) {
            this.informUser("Please enter your name to book.");
        }
    }

    async updateBooked(name: string) {
        try {
            const booked = await fetchBooked(this.name);
            this.setBookedTimeSlots(booked);
        } catch (err) {
            console.error(err);
            this.informUser("Failed to fetch booking data.");
        }
    }

    informUser(message: string) {
        // TODO: replace with non-blocking UI, like Material UI's Snackbar.
        alert(message);
    }
}

export const appModel = new AppModel();
