export type UserID = string;
export type AdvisorID = number;
export type RawTime = string; // availability time in ISO-8601 format
export type RawDate = string; // date part of ISO-8601

export interface Today {
    today: string;
}

export interface RawTimeSlot {
    readonly advisor: AdvisorID;
    readonly rawTime: RawTime;

    user?: UserID; // when booked
    time?: Date;   // client-side only for convenience
}

export interface TimeSlot extends RawTimeSlot {
    time: Date;   // TimeSlot is used only client-side
}
