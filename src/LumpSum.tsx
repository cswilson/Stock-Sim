import { useContext, useState } from "react";
import { Utils } from "./Utils";
import { DatePicker } from "./DatePicker"
import { TickerContext } from "./App";
import { DollarAmountInput } from "./DollarAmountInput";
import { StringListDisplay } from "./StringListDisplay";
import { StockData } from "./TickerData";
import { DateRange } from "./DateRange";
import { TimeSeriesData } from "./TimeSeriesData";

export const LumpSum: React.FC = () => {
    const [lumpSumAmount, setLumpSumAmount] = useState(0);
    const tickerData = useContext<StockData>(TickerContext);
    const [lumpSumDate, setLumpSumDate] = useState<Date>(new Date());
    const [simulationEndDate, setSimulationEndDate] = useState<Date>(new Date());
    const [outputColor, setOutputColor] = useState<string>("");
    const [summaryText, setSummaryText] = useState<string[]>([]);

    const calculateLumpSum = () => {
        const lumpSumTime = lumpSumDate.getTime();
        const endTime = simulationEndDate.getTime();

        if (endTime < lumpSumTime) {
            setOutputColor("fail");
            setSummaryText(["The simulation end date must be after the investment date."]);
            return;
        }

        const dateRange = new DateRange(lumpSumTime, endTime);
        const result = Utils.simulateInvestment(tickerData, new TimeSeriesData([lumpSumAmount], [lumpSumTime]), dateRange);

        if (result === undefined) {
            setOutputColor("fail");
            setSummaryText(["Invalid Date Provided"]);
        } else {
            const summary = result.toDisplay();

            const lumpSumDateReadable = Utils.formatDate(lumpSumDate);
            const endDateReadable = Utils.formatDate(simulationEndDate);

            const summaryText = [
                `If you invested $${summary.amountInvested} into ${tickerData.symbol} in ${lumpSumDateReadable} in ${endDateReadable} you would have $${summary.finalValue}`
            ].concat(summary.buildOutputStringArray());

            setOutputColor(summary.outputColor);
            setSummaryText(summaryText);
        }
    };

    return (
        <div className="mt-4">
            <div className="flex flex-row justify-center items-center gap-4">
                <p className="text-2xl ">Investment Amount: </p>
                <DollarAmountInput onValueChanged={setLumpSumAmount}></DollarAmountInput>
            </div>
            <div className="flex flex-row justify-center items-center mt-4 gap-4">
                <p className="text-2xl ">Investment Date: </p>
                <DatePicker onDateChange={setLumpSumDate} defaultToFirstDate={true}></DatePicker>
            </div>
            <div className="flex flex-row justify-center items-center mt-4 gap-4">
                <p className="text-2xl ">Simulation End Date: </p>
                <DatePicker onDateChange={setSimulationEndDate} defaultToFirstDate={false}></DatePicker>
            </div>
            <button className="btn mt-4" onClick={calculateLumpSum}>Calculate</button>
            <div className={`text-2xl ${outputColor}`}>
                <StringListDisplay strings={summaryText}></StringListDisplay>
            </div>
        </div>
    )
}