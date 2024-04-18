import { useContext, useState } from "react";
import PositiveNumberInput from "./PositiveNumberInput";
import { DateUnit, DateUnitSelect } from "./DateUnit";
import { TickerContext } from "./App";
import { addMonths, isBefore } from "date-fns";
import { StringListDisplay, StringListDisplayProps } from "./StringListDisplay";
import { formatDate } from "./DatePicker";
import { InvestmentSummary } from "./InvestmentSummary";

class IntervalResult {
    public readonly startDate: Date;
    public readonly endDate: Date;
    public readonly investmentSummary: InvestmentSummary;

    constructor(startDate: Date, endDate: Date, investmentSummary: InvestmentSummary) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.investmentSummary = investmentSummary;
    }

    public toString(): string {
        return `${this.investmentSummary.percentGain.toFixed(2)}%. ${formatDate(this.startDate)} - ${formatDate(this.endDate)}`
    }
}

export const BestAndWorstIntervals: React.FC = () => {

    const tickerData = useContext(TickerContext);
    const [intervalLength, setIntervalLength] = useState<number>(1);
    const [intervalUnit, setIntervalUnit] = useState<DateUnit>(DateUnit.Months);
    const [stringListDisplayProps, setStringListDisplayProps] = useState<StringListDisplayProps>({ strings: [] });

    const calculateBestAndWorstIntervals = () => {
        const dateRange = tickerData.prices.getDateRange();
        if (dateRange === undefined) {
            //TODO print error message here?
            return
        }

        const monthsInInterval = intervalUnit === DateUnit.Months ? intervalLength : intervalLength * 12;

        const allIntervalResults: IntervalResult[] = [];
        let currentStart = dateRange.start;

        while (isBefore(currentStart, addMonths(dateRange.end, -monthsInInterval))) {
            let end = addMonths(currentStart, monthsInInterval)
            const summary = tickerData.simulateLumpSumOverTime(100, currentStart.getTime(), end.getTime());
            if (summary) {
                allIntervalResults.push(new IntervalResult(currentStart, end, summary))
            }
            currentStart = addMonths(currentStart, 1);
        }

        allIntervalResults.sort((a, b) => a.investmentSummary.percentGain - b.investmentSummary.percentGain);

        const totalIntervalResults = allIntervalResults.length;
        const percentilesToDisplay: [string, number][] = [["Worst Return", 0], ["25th Percentile", 25], ["50th Percentile", 50], ["75th Percentile", 75], ["90th Percentile", 90], ["Best Return", 100]];

        const percentileOutput: [string, string][] = percentilesToDisplay.map((percentile) => {
            const index = Math.round((percentile[1] / 100) * (totalIntervalResults - 1));
            const resultAtIndex = allIntervalResults[index];
            return [`${percentile[0]}: ${resultAtIndex.toString()}`, resultAtIndex.investmentSummary.toDisplay().outputColor];
        });

        setStringListDisplayProps(
            {
                strings: percentileOutput.map(([formattedText, _]) => formattedText),
                perStringStyling: percentileOutput.map(([_, outputColor]) => outputColor),
            }
        );

    }

    return (
        <div>
            <div className="flex flex-row justify-center items-center mt-4 gap-4">
                <p className="text-2xl">Interval Length: </p>
                <PositiveNumberInput placeHolderText="Period Length" defaultValue={intervalLength} onUpdate={setIntervalLength}></PositiveNumberInput>
                <DateUnitSelect onUpdate={setIntervalUnit} />
            </div>
            <button className="btn mt-4" onClick={calculateBestAndWorstIntervals}>Calculate</button>
            <div className={`text-2xl`}>
                <StringListDisplay {...stringListDisplayProps}></StringListDisplay>
            </div>
        </div>
    )

}