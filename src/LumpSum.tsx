import { useContext, useState } from "react";
import { DatePicker, dateToHumanReadableString} from "./DatePicker"
import { TickerContext } from "./App";
import { DollarAmountInput } from "./DollarAmountInput";
import { buildInvestmentSummary } from "./InvestmentSummary";
import { StringListDisplay } from "./StringListDisplay";

export const LumpSum: React.FC = () => {
    const [lumpSumAmount, setLumpSumAmount] = useState(0);
    const { ticker, prices, dividends } = useContext(TickerContext);
    const [date, setDate] = useState<Date>(new Date());
    const [outputColor, setOutputColor] = useState<string>("");
    const [summaryText, setSummaryText] = useState<string[]>([]);

    //TODO figure out why calculations are slightly off?
    //TODO factor dividends into calculation
    const calculateLumpSum = () => {
        const time = date.getTime();
        if (prices.isTimeOutsideRange(time)) {
            setOutputColor("fail");
            setSummaryText(["No price data at provided date"]);
        } else {
            const index = prices.getClosestTimeIndex(time);
            const costPerShare = prices.values[index];
            const sharesBought = lumpSumAmount / costPerShare;
            const finalPrice = prices.values[prices.values.length - 1];
            const finalPortfolioValue = sharesBought * finalPrice;

            const summary = buildInvestmentSummary(lumpSumAmount, finalPortfolioValue);

            setOutputColor(summary.outputColor);
            //TODO include dividend payments in the summary
            setSummaryText([
                `If you invested $${summary.amountInvested} into ${ticker} in ${dateToHumanReadableString(date)} you would now have $${summary.finalValue}.`,
                `Net Profit: $${summary.netGain}`,
                `Percentage Gain: ${summary.percentGain}%`
            ])
        }
    }

    return (
        <div className="mt-4">
            <div className="flex flex-row justify-center items-center gap-4">
                <p className="text-2xl ">Investment Amount: </p>
                <DollarAmountInput onValueChanged={setLumpSumAmount}></DollarAmountInput>
            </div>
            <div className="flex flex-row justify-center items-center mt-4 gap-4">
                <p className="text-2xl ">Investment Date: </p>
                <DatePicker onDateChange={setDate}></DatePicker>
            </div>
            <button className="btn mt-4" onClick={calculateLumpSum}>Calculate</button>
            <div className={`mt-4 text-2xl ${outputColor}`}>
                <StringListDisplay strings={summaryText}></StringListDisplay>
            </div>
        </div>
    )
}