import { useState } from "react";
import { DatePicker, MonthYearDate } from "./DatePicker"
import { useTickerContext } from "./App";
import numeral from 'numeral';

export const LumpSum: React.FC = () => {
    const [lumpSumAmount, setLumpSumAmount] = useState('0');
    const { ticker, prices, dividends } = useTickerContext();
    const [date, setDate] = useState<MonthYearDate>(new MonthYearDate());
    const [resultSummary, setResultSummary] = useState<string>("");
    const [netProfitText, setNetProfitText] = useState<string>("");
    const [percentGainText, setPercentGainText] = useState<string>("");
    const [outputColor, setOutputColor] = useState<string>("");

    const updateMoneyValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const parsed: number = parseInt(value)
        console.log("Parsed is " + parsed);
        if (parsed >= 0) {
            console.log("GTE 0");
            setLumpSumAmount(value);
        } else {
            console.log("LT 0");
            setLumpSumAmount("");
        }
    }

    //TODO factor dividends into calculation
    const calculateLumpSum = () => {
        const lumpSumVal = parseInt(lumpSumAmount);
        const time = date.toTimestampMillis();
        if (!prices.isTimeWithinRange(time)) {
            const index = prices.getClosestTimeIndex(time);
            const costPerShare = prices.values[index];
            const sharesBought = lumpSumVal / costPerShare;
            const finalPrice = prices.values[prices.values.length - 1];
            const finalPortfolioValue = sharesBought * finalPrice;

            const netGain = finalPortfolioValue - lumpSumVal;
            const percentageGain = ((finalPortfolioValue / lumpSumVal) * 100) - 100;

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
        } else {
            setOutputColor("fail");
            setResultSummary("No price data at provided date");
        }
    }

    const onDateChange = (date: MonthYearDate) => {
        setDate(date);
    }

    return (
        <div className="mt-4">
            <div className="flex flex-row justify-center items-center gap-4">
                <p className="text-2xl ">Investment Amount: </p>
                <div className="flex flex-row items-center">
                    <p className="text-2xl">$</p>
                    <input type="number" min="0" placeholder="Enter Dollar Amount" value={lumpSumAmount} className="searchBox w-32 ml-2" onChange={updateMoneyValue}></input>
                </div>
            </div>
            <div className="flex flex-row justify-center items-center mt-4 gap-4">
                <p className="text-2xl ">Investment Date: </p>
                <div className="flex flex-row items-center ">
                    <DatePicker onDateChange={onDateChange}></DatePicker>
                </div>
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