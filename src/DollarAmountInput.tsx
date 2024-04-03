import { useState } from "react";

interface DollarAmountInputProps {
    onValueChanged: (dollarAmount: number) => void;
}

export const DollarAmountInput: React.FC<DollarAmountInputProps> = ({ onValueChanged }) => {

    const [dollarAmount, setDollarAmount] = useState('0');

    const updateDollarAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const parsed: number = parseFloat(value)
        if (parsed >= 0) {
            setDollarAmount(value);
        } else {
            setDollarAmount("");
        }
        onValueChanged(parseFloat(value));
    }

    return (
        <div className="flex flex-row items-center">
            <p className="text-2xl">$</p>
            <input type="number" min="0" placeholder="Enter Dollar Amount" value={dollarAmount} className="searchBox md:w-64 w-32 ml-2" onChange={updateDollarAmount}></input>
        </div>
    )
}