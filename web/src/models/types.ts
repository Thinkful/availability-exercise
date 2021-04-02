export type UserID = string;
export type AdvisorID = number;

export interface ITodayData {
    today: string;
}

export interface RawTimeSlot {
    readonly advisor: AdvisorID;
    readonly rawTime: string;

    user?: UserID; // when booked
    time?: Date;   // client-side only for convenience
}

export interface ITimeSlot extends RawTimeSlot {
    time: Date;   // ITimeSlot is used only client-side
}
