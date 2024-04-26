import { DateRange } from "./DateRange";

export enum SnappingOption {
    NONE,
    FORWARD,
    BACKWARD
}

interface DataPoint {
    value: number;
    timestamp: number;
}

export class TimeSeriesData {
    private readonly dataPoints: DataPoint[];

    constructor(values: number[] = [], times: number[] = []) {
        if (values.length !== times.length) {
            throw new Error("Time and value list must have the same length");
        }

        this.dataPoints = []
        for (let i = 0; i < values.length; i++) {
            this.dataPoints.push({ value: values[i], timestamp: times[i] });
        }
    }

    public length(): number {
        return this.dataPoints.length;
    }

    public get(index: number): DataPoint {
        return this.dataPoints[index];
    }

    public valueAt(index: number): number {
        return this.dataPoints[index].value;
    }

    public timeAt(index: number): number {
        return this.dataPoints[index].timestamp;
    }

    public times(): number[] {
        return this.dataPoints.map(dp => dp.timestamp);
    }

    public values(): number[] {
        return this.dataPoints.map(dp => dp.value);
    }

    public addValueAtTime(value: number, time: number) {
        const newDataPoint: DataPoint = { value, timestamp: time };
        let insertionIndex = 0;
        while (insertionIndex < this.length() && this.timeAt(insertionIndex) < time) {
            insertionIndex++;
        }
        this.dataPoints.splice(insertionIndex, 0, newDataPoint);
    }

    public indexAtTime(targetTimestamp: number, snap: SnappingOption = SnappingOption.NONE): number {
        let left = 0;
        let right = this.length() - 1;
        let nearestIndex = 0;

        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            if (Math.abs(this.timeAt(mid) - targetTimestamp) < Math.abs(this.timeAt(nearestIndex) - targetTimestamp)) {
                nearestIndex = mid;
            }
            if (this.timeAt(mid) < targetTimestamp) left = mid + 1;
            else right = mid - 1;
        }

        const timeValue = this.timeAt(nearestIndex);
        if (snap == SnappingOption.FORWARD && timeValue < targetTimestamp) {
            return nearestIndex + 1;
        } else if (snap == SnappingOption.BACKWARD && timeValue > targetTimestamp) {
            return nearestIndex - 1;
        } else {
            return nearestIndex;
        }
    }

    public getDateRange(): DateRange | undefined {
        if (this.length() == 0) {
            return undefined;
        }
        return { start: new Date(this.timeAt(0)), end: new Date(this.timeAt(this.length() - 1)) };
    }

    public getDataInRange(dateRange: DateRange): DataPoint[] {
        const startIndex = this.indexAtTime(dateRange.start.getTime(), SnappingOption.FORWARD);
        const endIndex = this.indexAtTime(dateRange.end.getTime(), SnappingOption.BACKWARD);
        return this.dataPoints.slice(startIndex, endIndex + 1);
    }

    public isTimeOutsideRange(targetTimestamp: number): boolean {
        const dateRange = this.getDateRange();
        if (dateRange === undefined) {
            return true;
        }
        return targetTimestamp < dateRange.start.getTime() || targetTimestamp > dateRange.end.getTime();
    }

}