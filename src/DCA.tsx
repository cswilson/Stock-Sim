import { useState } from "react"
import { DollarAmountInput } from "./DollarAmountInput";
import { DatePicker, MonthYearDate } from "./DatePicker";
import { useTickerContext } from "./App";

export const DCA: React.FC = () => {

    const { ticker, prices, dividends } = useTickerContext();
    const [dcaAmount, setDcaAmount] = useState(0);
    const [initialDate, setInitialDate] = useState(new MonthYearDate());
    const [frequency, setFrequency] = useState('1');

    const [outputColor, setOutputColor] = useState<string>("");

    const handleFrequencyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFrequency(event.target.value);
    };

    //TODO include dividends in calculation
    const calculateDCA = () => {
        const timestamp = initialDate.toTimestampMillis();

        if (prices.isTimeOutsideRange(timestamp)) {
            setOutputColor("fail");

        } else {

        }

    }

    return (
        <div className="mt-4">
            <div className="flex flex-row justify-center items-center gap-4">
                <p className="text-2xl ">Investment Amount: </p>
                <DollarAmountInput onValueChanged={setDcaAmount}></DollarAmountInput>
            </div>
            <div className="flex flex-row justify-center items-center mt-4 gap-4">
                <p className="text-2xl ">Initial Investment Date: </p>
                <DatePicker onDateChange={setInitialDate}></DatePicker>
            </div>
            <div className="mt-4 flex flex-row justify-center items-center gap-4">
                <p className="text-2xl">Reinvest Every: </p>
                <input type="number" className="searchBox md:w-64 w-32 ml-2" placeholder="Enter frequency" value={frequency} onChange={handleFrequencyChange}/>
                <select className="searchBox">
                    <option value="months">Month(s)</option>
                    <option value="years">Year(s)</option>
                </select>
            </div>
            <button className="btn mt-4" onClick={calculateDCA}>Calculate</button>
        </div>
    )
}