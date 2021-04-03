const { TimeStore } = require("./timestore");

const testTimeSlots = [
    { "advisor": 372955, "rawTime": "2019-08-27T14:00:00-04:00" },
    { "advisor": 372955, "rawTime": "2019-08-27T13:00:00-04:00" },
    { "advisor": 372955, "rawTime": "2019-08-27T10:00:00-04:00" },
    { "advisor": 372955, "rawTime": "2019-08-27T11:00:00-04:00" },
    { "advisor": 319369, "rawTime": "2019-08-25T20:00:00-04:00" },
];

function cloneTimeSlots(slots) {
    // dumb deep copy
    return JSON.parse(JSON.stringify(slots));
}

let timeStore;

beforeEach(() => {
    timeStore = new TimeStore(cloneTimeSlots(testTimeSlots), { quiet: true });
});

afterEach(() => {
    timeStore = null;
});


describe("timestore", () => {
    it("returns available unbooked timeslots", () => {
        const value = timeStore.unbooked();
        expect(value).toBeDefined();
        expect(Array.isArray(value)).toBe(true);
        expect(value.length).toBe(5);
    });
    it("returns available unbooked timeslots in Thiknful format", () => {
        const value = timeStore.unbookedDatedTimeSlots();
        expect(value).toBeDefined();
        expect(typeof value).toBe('object');
    });
    it("book timeslot", () => {
        const slot = timeStore.book('Tester', 372955, "2019-08-27T10:00:00-04:00");
        expect(slot).toBeDefined();
        expect(slot.user).toEqual('Tester');
        expect(timeStore.booked('Tester').includes(slot)).toBe(true);
        expect(timeStore.unbooked().includes(slot)).toBe(false);
    });
    it("book same timeslot twice", () => {
        timeStore.book('Tester', 372955, "2019-08-27T10:00:00-04:00");
        const slot = timeStore.book('Tester', 372955, "2019-08-27T10:00:00-04:00");
        expect(slot).toBeDefined();
        expect(slot.user).toEqual('Tester');
        expect(timeStore.booked('Tester').includes(slot)).toBe(true);
        expect(timeStore.unbooked().includes(slot)).toBe(false);
    });
    it("fail to book timeslot booked by others", () => {
        timeStore.book('Another', 372955, "2019-08-27T10:00:00-04:00");
        const slot = timeStore.book('Tester', 372955, "2019-08-27T10:00:00-04:00");
        expect(slot).toBeNull();
    });
    it("cancel booked timeslot", () => {
        timeStore.book('Tester', 372955, "2019-08-27T10:00:00-04:00");
        const slot = timeStore.cancel('Tester', 372955, "2019-08-27T10:00:00-04:00");
        expect(slot).toBeDefined();
        expect(slot.user).not.toBeDefined();
        expect(timeStore.booked('Tester').includes(slot)).toBe(false);
        expect(timeStore.unbooked().includes(slot)).toBe(true);
    });
    it("fail to cancel timeslot booked by others", () => {
        timeStore.book('Another', 372955, "2019-08-27T10:00:00-04:00");
        const slot = timeStore.cancel('Tester', 372955, "2019-08-27T10:00:00-04:00");
        expect(slot).toBeNull();
    });
    it("fail to cancel unbooked timeslot", () => {
        const slot = timeStore.cancel('Tester', 372955, "2019-08-27T10:00:00-04:00");
        expect(slot).toBeNull();
    });
});
