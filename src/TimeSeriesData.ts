import { DateRange } from "./DateRange";

export enum SnappingOption {
    NONE,
    FORWARD,
    BACKWARD
}

export class TimeSeriesData {
    public readonly values: number[];
    public readonly times: number[];

    constructor(values: number[] = [], times: number[] = []) {
        this.values = values;
        this.times = times;
    }

    public addValueAtTime(value: number, time: number) {
        let insertionIndex = 0;
        while (insertionIndex < this.times.length && this.times[insertionIndex] < time) {
            insertionIndex++;
        }
        this.values.splice(insertionIndex, 0, value);
        this.times.splice(insertionIndex, 0, time);
    }

    public getClosestTimeIndex(targetTimestamp: number): number {
        let left = 0;
        let right = this.times.length - 1;
        let nearestIndex = 0;

        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            if (Math.abs(this.times[mid] - targetTimestamp) < Math.abs(this.times[nearestIndex] - targetTimestamp)) {
                nearestIndex = mid;
            }
            if (this.times[mid] < targetTimestamp) left = mid + 1;
            else right = mid - 1;
        }

        return nearestIndex;
    }

    //TODO this probably doesn't need to be used in most places due to getBuyPrice() in TickerData
    public getTimeIndex(targetTimestamp: number, snap: SnappingOption = SnappingOption.NONE): number {
        const nearestIndex = this.getClosestTimeIndex(targetTimestamp);
        const timeValue = this.times[nearestIndex];
        if (snap == SnappingOption.FORWARD && timeValue < targetTimestamp) {
            return nearestIndex + 1;
        } else if (snap == SnappingOption.BACKWARD && timeValue > targetTimestamp) {
            return nearestIndex - 1;
        } else {
            return nearestIndex;
        }
    }

    public getDateRange(): DateRange | undefined {
        if (this.times.length == 0) {
            return undefined;
        }
        return {start: new Date(this.times[0]), end: new Date(this.times[this.times.length - 1])};
    }

    public getValuesInRange(dateRange: DateRange): TimeSeriesData {
        const startIndex = this.getTimeIndex(dateRange.start.getTime(), SnappingOption.FORWARD);
        const endIndex = this.getTimeIndex(dateRange.end.getTime(), SnappingOption.BACKWARD);
        const values = this.values.slice(startIndex, endIndex + 1)
        const times = this.times.slice(startIndex, endIndex + 1)
        return new TimeSeriesData(values, times);
    }

    public isTimeOutsideRange(targetTimestamp: number): boolean {
        const dateRange = this.getDateRange();
        if (dateRange === undefined){
            return true;
        }
        return targetTimestamp < dateRange.start.getTime() || targetTimestamp > dateRange.end.getTime();
    }

}