import { useState } from "react";
import { DatePicker } from "./DatePicker"

// interface LumpSumProps {
//   prices: number[]
//   times: number[]
// }

// export const LumpSum: React.FC<LumpSumProps> = ({prices, times}) => {
export const LumpSum: React.FC = () => {
    const [lumpSumAmount, setLumpSumAmount] = useState('0');

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
                    <DatePicker></DatePicker>
                </div>
            </div>
        </div>
    )
}