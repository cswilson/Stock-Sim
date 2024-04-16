import { useContext, useState } from "react";
import PositiveNumberInput from "./PositiveNumberInput";
import { DateUnit, DateUnitSelect } from "./DateUnit";
import { TickerContext } from "./App";
import { addMonths, isBefore } from "date-fns";
import { StringListDisplay } from "./StringListDisplay";
import { formatDate } from "./DatePicker";

class IntervalResult {
    public readonly startDate: Date;
    public readonly endDate: Date;
    public readonly percentGain: number;

    constructor(startDate: Date, endDate: Date, percentGain: number){
        this.startDate = startDate;
        this.endDate = endDate;
        this.percentGain = percentGain;
    }

    public toString(): string {
        return `${this.percentGain.toFixed(2)}%. ${formatDate(this.startDate)} - ${formatDate(this.endDate)}`
    }

}

export const BestAndWorstIntervals: React.FC = () => {

    const tickerData = useContext(TickerContext);
    const [intervalLength, setIntervalLength] = useState<number>(1);
    const [intervalUnit, setIntervalUnit] = useState<DateUnit>(DateUnit.Months);
    const [summaryText, setSummaryText] = useState<string[]>([]);

    const calculateBestAndWorstIntervals = () => {

        const startAndEnd = tickerData.prices.getStartAndEndTimes();
        if (startAndEnd === undefined) {
            //TODO print error message here?
            return
        }

        const start = new Date(startAndEnd[0]);
        const end = new Date(startAndEnd[1]);

        let monthsInInterval;
        if (intervalUnit == DateUnit.Months) {
            monthsInInterval = intervalLength;
        } else {
            monthsInInterval = intervalLength * 12;
        }

        const allIntervalResults: IntervalResult[] = [];
        let currentStart = start;
        while (isBefore(currentStart, end)) {

            let end = addMonths(currentStart, monthsInInterval)
            const summary = tickerData.simulateInvestmentOverTime(100, currentStart.getTime(), end.getTime());
            if (summary !== undefined) {
                allIntervalResults.push(
                    new IntervalResult(currentStart, end, summary.percentGain)
                )
            }

            currentStart = addMonths(currentStart, 1);
        }

        allIntervalResults.sort((a, b) => a.percentGain - b.percentGain);

        const totalValues = allIntervalResults.length;
        const worst = allIntervalResults[0];
        const percentile25 = allIntervalResults[Math.round(totalValues * 0.25) - 1];
        const percentile50 = allIntervalResults[Math.round(totalValues * 0.50) - 1];
        const percentile75 = allIntervalResults[Math.round(totalValues * 0.75) - 1];
        const best = allIntervalResults[totalValues - 1];

        // TODO add coloring to output?
        setSummaryText([
            "Worst Return: "  + worst.toString(),
            "25th Percentile: " + percentile25.toString(),
            "50th Percentile: " + percentile50.toString(),
            "75th Percentile: " + percentile75.toString(),
            "Best Return: " + best.toString(),
        ])

    }

    return (
        <div>
            <div className="flex flex-row justify-center items-center mt-4 gap-4">
                <p className="text-2xl">Interval Length: </p>
                <PositiveNumberInput placeHolderText="Period Length" defaultValue={intervalLength} onUpdate={setIntervalLength}></PositiveNumberInput>
                <DateUnitSelect onUpdate={setIntervalUnit} />
            </div>
            <button className="btn mt-4" onClick={calculateBestAndWorstIntervals}>Calculate</button>
            <div className={`mt-4 text-2xl`}>
                <StringListDisplay strings={summaryText}></StringListDisplay>
            </div>
        </div>
    )

}