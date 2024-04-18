export class DateRange {
    public readonly start: Date;
    public readonly end: Date;

    constructor(start: Date | number, end: Date | number) {
        this.start = start instanceof Date ? start : new Date(start);
        this.end = end instanceof Date ? end : new Date(end);
    }
}