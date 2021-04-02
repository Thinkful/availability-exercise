export type UserID = string;
export type AdvisorID = number;

export interface TodayData {
    today: string;
}

export interface TimeSlot {
    advisor: AdvisorID;
    time: Date;
    user?: UserID;
}
