import { useContext, useState } from "react";
import { DatePicker, formatDate } from "./DatePicker"
import { TickerContext } from "./App";
import { DollarAmountInput } from "./DollarAmountInput";
import { StringListDisplay } from "./StringListDisplay";
import { StockData } from "./TickerData";

//TODO make the simulation end date configurable
export const LumpSum: React.FC = () => {
    const [lumpSumAmount, setLumpSumAmount] = useState(0);
    const tickerData = useContext<StockData>(TickerContext);
    const [lumpSumDate, setLumpSumDate] = useState<Date>(new Date());
    const [outputColor, setOutputColor] = useState<string>("");
    const [summaryText, setSummaryText] = useState<string[]>([]);

    const calculateLumpSum = () => {
        const now = new Date().getTime();
        const lumpSumTime = lumpSumDate.getTime();

        const result = tickerData.simulateLumpSumOverTime(lumpSumAmount, lumpSumTime, now);

        if (result === undefined) {
            setOutputColor("fail");
            setSummaryText(["No price data available for the provided date"]);
        } else {
            const summary = result.toDisplay();
            const dateReadable = formatDate(lumpSumDate);
            const summaryText = [
                `If you invested $${summary.amountInvested} into ${tickerData.symbol} in ${dateReadable}, you would now have $${summary.finalValue}.`
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
                <DatePicker onDateChange={setLumpSumDate}></DatePicker>
            </div>
            <button className="btn mt-4" onClick={calculateLumpSum}>Calculate</button>
            <div className={`text-2xl ${outputColor}`}>
                <StringListDisplay strings={summaryText}></StringListDisplay>
            </div>
        </div>
    )
}