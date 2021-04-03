import { AppModel } from "./AppModel";
import * as api from "./api";

jest.mock('./api');

let appModel;

const unbookedSlot = { "advisor": 319369, "rawTime": "2019-08-25T20:00:00-04:00" };
const bookedSlot = { "advisor": 372955, "rawTime": "2019-08-27T11:00:00-04:00", user: 'Tester' };

beforeEach(() => {
    appModel = new AppModel();
    appModel.setAvailableTimeSlots([
        unbookedSlot,
    ].map(slot => {
        return { ...slot, time: new Date(slot.time) };
    }));
    appModel.setBookedTimeSlots([
        bookedSlot,
    ].map(slot => {
        return { ...slot, time: new Date(slot.time) };
    }));
});

afterEach(() => {
    appModel = null;
});

describe("AppModel", () => {
    it("has availableTimeSlots", () => {
        expect(appModel.availableTimeSlots.length).toEqual(1);
    });
    it("has bookedTimeSlots", () => {
        expect(appModel.bookedTimeSlots.length).toEqual(1);
    });
    it("can find slot by advisor and rawTime", () => {
        const unbooked = appModel.find(unbookedSlot.advisor, unbookedSlot.rawTime);
        expect(unbooked).toBeDefined();
        expect(unbooked.user).not.toBeDefined();
        const booked = appModel.find(bookedSlot.advisor, bookedSlot.rawTime);
        expect(booked).toBeDefined();
        expect(booked.user).toEqual('Tester');
    })
    it("can book timeslot", done => {
        const unbooked = appModel.find(unbookedSlot.advisor, unbookedSlot.rawTime);
        api.bookTimeSlot.mockResolvedValue([
            { advisor: bookedSlot.advisor, rawTime: bookedSlot.rawTime },
        ]);
        appModel.setName('Tester');
        api.bookTimeSlot.mockResolvedValue([
            { advisor: bookedSlot.advisor, rawTime: bookedSlot.rawTime },
            { advisor: unbookedSlot.advisor, rawTime: unbookedSlot.rawTime },
        ]);
        api.fetchAvailability.mockResolvedValue([]);
        appModel.book(unbooked).then(() => {
            expect(appModel.availableTimeSlots.length).toEqual(0);
            expect(appModel.bookedTimeSlots.length).toEqual(2);
            done();
        })
    })
    it("can cancel booked timeslot", done => {
        const booked = appModel.find(bookedSlot.advisor, bookedSlot.rawTime);
        api.bookTimeSlot.mockResolvedValue([
            { advisor: bookedSlot.advisor, rawTime: bookedSlot.rawTime },
        ]);
        appModel.setName('Tester');
        api.cancelTimeSlot.mockResolvedValue([]);
        api.fetchAvailability.mockResolvedValue([
            { advisor: unbookedSlot.advisor, rawTime: unbookedSlot.rawTime },
            { advisor: bookedSlot.advisor, rawTime: bookedSlot.rawTime },
        ]);
        appModel.cancel(booked).then(() => {
            expect(appModel.availableTimeSlots.length).toEqual(2);
            expect(appModel.bookedTimeSlots.length).toEqual(0);
            done();
        })
    })
});
