import { useContext, useState } from "react";
import { DatePicker, MonthYearDate } from "./DatePicker"
import { useTickerContext } from "./App";

export const LumpSum: React.FC = () => {
    const [lumpSumAmount, setLumpSumAmount] = useState('0');
    const {ticker, prices, dividends} = useTickerContext();
    const [date, setDate] = useState<MonthYearDate>(new MonthYearDate());
    const [resultText, setResultText] = useState<string>("");

    const updateMoneyValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const parsed: number = parseInt(value)
        console.log("Parsed is " + parsed);
        if (parsed >= 0 ) {
            console.log("GTE 0");
            setLumpSumAmount(value);
        } else {
            console.log("LT 0");
            setLumpSumAmount("");
        }
    }

    //TODO validate the date exists in the dataset
    //TODO factor dividends into calculation
    const calculateLumpSum = () => {
        const time = date.toTimestampMillis();
        if (!prices.isTimeWithinRange(time)) {
            //TODO print results
            const index = prices.getClosestTimeIndex(time);
            const costPerShare = prices.values[index];
            const sharesBought = parseInt(lumpSumAmount) / costPerShare;
            const finalPrice = prices.values[prices.values.length - 1];
            const finalPortfolioValue = sharesBought * finalPrice;

            setResultText(`If you invested $${lumpSumAmount} into ${ticker} in ${date.toHumanReadableString()} you would now have $${finalPortfolioValue.toFixed(2)}.`);
        } else {
            //TODO print error message
            setResultText("Date value outside of data range.");
        }
    }

    const onDateChange = (date: MonthYearDate) => {
        setDate(date);
    }

    return (
        <div>
            <div className="flex flex-row justify-center items-center mt-4 gap-4">
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
            <p>{resultText}</p>
        </div>
    )
}