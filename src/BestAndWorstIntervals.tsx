import { useContext, useState } from "react";
import PositiveNumberInput from "./PositiveNumberInput";
import { DateUnit, DateUnitSelect } from "./DateUnit";
import { TickerContext } from "./App";
import { StringListDisplay, StringListDisplayProps } from "./StringListDisplay";
import { InvestmentSummary } from "./InvestmentSummary";
import { DateRange } from "./DateRange";
import { TimeSeriesData } from "./TimeSeriesData";
import {Utils} from "./Utils";

class IntervalResult {
    public readonly dateRange: DateRange;
    public readonly investmentSummary: InvestmentSummary;

    constructor(dateRange: DateRange, investmentSummary: InvestmentSummary) {
        this.dateRange = dateRange;
        this.investmentSummary = investmentSummary;
    }

    public toString(): string {
        return `${this.investmentSummary.percentGain.toFixed(2)}%. ${Utils.formatDate(this.dateRange.start)} - ${Utils.formatDate(this.dateRange.end)}`
    }
}

export const BestAndWorstIntervals: React.FC = () => {

    const tickerData = useContext(TickerContext);
    const [intervalLength, setIntervalLength] = useState<number>(1);
    const [intervalUnit, setIntervalUnit] = useState<DateUnit>(DateUnit.Months);
    const [stringListDisplayProps, setStringListDisplayProps] = useState<StringListDisplayProps>({ strings: [] });

    const calculateBestAndWorstIntervals = () => {
        const monthsInInterval = intervalUnit === DateUnit.Months ? intervalLength : intervalLength * 12;
        const allIntervalResults: IntervalResult[] = [];

        let startTimeIndex = 0;
        while (startTimeIndex < tickerData.prices.length() - monthsInInterval){
            let endTimeIndex = startTimeIndex + monthsInInterval;

            let startTime = tickerData.prices.timeAt(startTimeIndex);
            let endTime = tickerData.prices.timeAt(endTimeIndex);
            const dateRange = new DateRange(startTime, endTime);

            const summary = Utils.simulateInvestment(
                tickerData,
                new TimeSeriesData([100], [startTime]),
                dateRange
            )
            allIntervalResults.push(new IntervalResult(dateRange, summary));

            startTimeIndex++;
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