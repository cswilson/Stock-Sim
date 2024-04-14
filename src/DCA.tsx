import { useContext, useState } from "react"
import { DollarAmountInput } from "./DollarAmountInput";
import { DatePicker} from "./DatePicker";
import { addMonths, addYears } from "date-fns";
import PositiveNumberInput from "./PositiveNumberInput";
import { StringListDisplay } from "./StringListDisplay";
import { DateUnit, DateUnitSelect } from "./DateUnit";
import { TickerContext } from "./App";
import { InvestmentSummary, InvestmentSummaryDisplay } from "./InvestmentSummary";

export const DCA: React.FC = () => {

    const { symbol, prices, dividends } = useContext(TickerContext);
    const [dcaAmount, setDcaAmount] = useState<number>(0);
    const [initialDate, setInitialDate] = useState<Date>(new Date());
    const [increment, setIncrement] = useState<number>(1);
    const [incrementUnit, setIncrementUnit] = useState<DateUnit>(DateUnit.Months);
    const [outputColor, setOutputColor] = useState<string>("");
    const [summaryText, setSummaryText] = useState<string[]>([]);

    //TODO include dividends in calculation
    const calculateDCA = () => {
        const timestamp = initialDate.getTime();

        if (increment == 0) {
            return;
        }

        //TODO don't do these calculations here, just use functions from TickerData
        if (prices.isTimeOutsideRange(timestamp)) {
            setOutputColor("fail");
            //TODO print warning message

        } else {

            let totalSharesOwned = 0;
            let currentTimestamp = timestamp;
            let totalAmountInvested = 0;
            while (!prices.isTimeOutsideRange(currentTimestamp)) {
                const sharePrice = prices.values[prices.getMatchingTimeIndex(currentTimestamp)];
                totalAmountInvested += dcaAmount;
                totalSharesOwned += (dcaAmount / sharePrice);

                if (incrementUnit == DateUnit.Months) {
                    currentTimestamp = addMonths(new Date(currentTimestamp), increment).getTime();
                } else {
                    currentTimestamp = addYears(new Date(currentTimestamp), increment).getTime();
                }
            }

            const finalPortfolioValue = totalSharesOwned * prices.values[prices.values.length - 1];

            const summary = new InvestmentSummary(totalAmountInvested, finalPortfolioValue, 0).toDisplay();

            let incrementUnitDisplay = incrementUnit.toString().toLocaleLowerCase();
            if (increment == 1) {
                incrementUnitDisplay = incrementUnitDisplay.slice(0, -1);
            } else {
                incrementUnitDisplay = increment.toString() + " " + incrementUnitDisplay; 
            }

            setOutputColor(summary.outputColor);
            //TODO include dividend payments in the summary
            setSummaryText([
                `If you invested $${dcaAmount} every ${incrementUnitDisplay} you would have now have: $${summary.finalValue}.`,
                `Total Amount Invested: $${summary.amountInvested}`,
                `Net Profit: $${summary.netGain}`,
                `Percentage Gain: ${summary.percentGain}%`,
            ])
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
                <PositiveNumberInput onUpdate={setIncrement} placeHolderText="Enter Frequency" defaultValue={increment}/>
                <DateUnitSelect onUpdate={setIncrementUnit}/>
            </div>
            <button className="btn mt-4" onClick={calculateDCA}>Calculate</button>
            <div className={`mt-4 text-2xl ${outputColor}`}>
                <StringListDisplay strings={summaryText}></StringListDisplay>
            </div>
        </div>
    )
}