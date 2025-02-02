import { addMonths, differenceInMonths } from "date-fns";

export enum DateStatus {
    EARLY,
    WITHIN_RANGE,
    LATE
}

export class DateRange {
    public readonly start: Date;
    public readonly end: Date;

    constructor(start: Date | number, end: Date | number) {
        this.start = start instanceof Date ? start : new Date(start);
        this.end = end instanceof Date ? end : new Date(end);
    }

    public isDateWithinRange(date: Date): DateStatus { 
        if (date.getTime() < this.start.getTime()) { 
            return DateStatus.EARLY;
        } else if (date.getTime() > this.end.getTime()) { 
            return DateStatus.LATE;
        }
        return DateStatus.WITHIN_RANGE;
    }

    public snapDateWithinRange(date: Date): Date {
        const status = this.isDateWithinRange(date);
        if (status == DateStatus.EARLY) { 
            return this.start;
        } else if (status == DateStatus.LATE) { 
            return this.end;
        } else {
            return date;
        }
    }

    public totalMonths(): number {
        return differenceInMonths(this.end, this.start);
    }
}