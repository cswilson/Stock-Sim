import { useContext, useState } from "react";
import PositiveNumberInput from "./PositiveNumberInput";
import { DateUnit, DateUnitSelect } from "./DateUnit";
import { TickerContext } from "./App";

export const BestWorstIntervals: React.FC = () => {

    const { symbol, prices, dividends } = useContext(TickerContext);
    const [intervalLength, setIntervalLength] = useState<number>(1);
    const [intervalUnit, setIntervalUnit] = useState<DateUnit>(DateUnit.Months);

    const calculateBestWorstIntervals = () => {

    }

    return (
        <div>
            <div className="flex flex-row justify-center items-center mt-4 gap-4">
                <p className="text-2xl">Interval Length: </p>
                <PositiveNumberInput placeHolderText="Period Length" defaultValue={intervalLength} onUpdate={setIntervalLength}></PositiveNumberInput>
                <DateUnitSelect onUpdate={setIntervalUnit}/>
            </div>
            <button className="btn mt-4" onClick={calculateBestWorstIntervals}>Calculate</button>
        </div>
    )

}