import { useContext, useState } from "react"
import { DollarAmountInput } from "./DollarAmountInput";
import { DatePicker} from "./DatePicker";
import { addMonths } from "date-fns";
import PositiveNumberInput from "./PositiveNumberInput";
import { StringListDisplay } from "./StringListDisplay";
import { DateUnit, DateUnitSelect } from "./DateUnit";
import { TickerContext } from "./App";
import { Utils } from "./Utils";
import { TimeSeriesData } from "./TimeSeriesData";
import { DateRange } from "./DateRange";
import { StockData } from "./TickerData";

//TODO make the simulation end date configurable
export const DCA: React.FC = () => {

    const tickerData = useContext<StockData>(TickerContext);
    const [dcaAmount, setDcaAmount] = useState<number>(0);
    const [initialDate, setInitialDate] = useState<Date>(new Date());
    const [increment, setIncrement] = useState<number>(1);
    const [incrementUnit, setIncrementUnit] = useState<DateUnit>(DateUnit.Months);
    const [outputColor, setOutputColor] = useState<string>("");
    const [summaryText, setSummaryText] = useState<string[]>([]);

    const calculateDCA = () => {
        if (tickerData.prices.isTimeOutsideRange(initialDate.getTime())){
            setOutputColor("fail");
            setSummaryText(["Invalid Date Provided"]);
            return;
        }

        if (increment == 0) {
            return;
        }

        const incrementMonths = (incrementUnit == DateUnit.Years) ? increment * 12 : increment;

        let investmentDate = initialDate;
        const investmentEvents = new TimeSeriesData();
        while (!tickerData.prices.isTimeOutsideRange(investmentDate.getTime())){
            investmentEvents.addValueAtTime(dcaAmount, investmentDate.getTime());
            investmentDate = addMonths(investmentDate, incrementMonths);
        }

        console.log(investmentEvents);

        const dateRange = new DateRange(initialDate.getTime(), new Date().getTime());
        const summary = Utils.simulateInvestment(tickerData, investmentEvents, dateRange).toDisplay();

        let incrementUnitDisplay = incrementUnit.toString().toLocaleLowerCase();
        if (increment == 1) {
            incrementUnitDisplay = incrementUnitDisplay.slice(0, -1);
        } else {
            incrementUnitDisplay = increment.toString() + " " + incrementUnitDisplay; 
        }

        setSummaryText([
            `If you invested $${dcaAmount} every ${incrementUnitDisplay} starting in ${Utils.formatDate(initialDate)} you would have now have: $${summary.finalValue}.`,
        ].concat(summary.buildOutputStringArray()))
        setOutputColor(summary.outputColor);

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
            <div className={`text-2xl ${outputColor}`}>
                <StringListDisplay strings={summaryText}></StringListDisplay>
            </div>
        </div>
    )
}