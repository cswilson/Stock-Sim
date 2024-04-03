import { useState } from "react";
import { DatePicker, MonthYearDate } from "./DatePicker"
import { useTickerContext } from "./App";
import numeral from 'numeral';
import { DollarAmountInput } from "./DollarAmountInput";

export const LumpSum: React.FC = () => {
    const [lumpSumAmount, setLumpSumAmount] = useState(0);
    const { ticker, prices, dividends } = useTickerContext();
    const [date, setDate] = useState<MonthYearDate>(new MonthYearDate());
    const [resultSummary, setResultSummary] = useState<string>("");
    const [netProfitText, setNetProfitText] = useState<string>("");
    const [percentGainText, setPercentGainText] = useState<string>("");
    const [outputColor, setOutputColor] = useState<string>("");

    //TODO factor dividends into calculation
    const calculateLumpSum = () => {
        const time = date.toTimestampMillis();
        if (prices.isTimeOutsideRange(time)) {
            setOutputColor("fail");
            setResultSummary("No price data at provided date");
        } else {
            const index = prices.getClosestTimeIndex(time);
            const costPerShare = prices.values[index];
            const sharesBought = lumpSumAmount / costPerShare;
            const finalPrice = prices.values[prices.values.length - 1];
            const finalPortfolioValue = sharesBought * finalPrice;

            const netGain = finalPortfolioValue - lumpSumAmount;
            const percentageGain = ((finalPortfolioValue / lumpSumAmount) * 100) - 100;

            if (netGain >= 0) {
                setOutputColor("success");
            } else {
                setOutputColor("fail");
            }

            const formattedLumpSumAmount = numeral(lumpSumAmount).format('0,0.00');
            const formattedFinalPortfolioValue = numeral(finalPortfolioValue.toFixed(2)).format('0,0.00');
            const formattedNetGain = numeral(netGain.toFixed(2)).format('0,0.00');
            const formattedPercentageGain = numeral(percentageGain.toFixed(2)).format('0,0.00');

            setResultSummary(`If you invested $${formattedLumpSumAmount} into ${ticker} in ${date.toHumanReadableString()} you would now have $${formattedFinalPortfolioValue}.`);
            setNetProfitText(`Net Profit: $${formattedNetGain}`)
            setPercentGainText(`Percentage Gain: ${formattedPercentageGain}%`)
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
                <p>{resultSummary}</p>
                <p>{netProfitText}</p>
                <p>{percentGainText}</p>
            </div>
        </div>
    )
}