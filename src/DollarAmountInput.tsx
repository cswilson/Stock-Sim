import { useState } from "react";
import PositiveNumberInput from "./PositiveNumberInput";

interface DollarAmountInputProps {
    onValueChanged: (dollarAmount: number) => void;
}

export const DollarAmountInput: React.FC<DollarAmountInputProps> = ({ onValueChanged }) => {
    const [dollarAmount, setDollarAmount] = useState<number>(0);

    const handleValueChanged = (val: number) => {
        setDollarAmount(val);
        onValueChanged(val);
    };

    return (
        <div className="flex flex-row items-center">
            <p className="text-2xl mr-2">$</p>
            <PositiveNumberInput onUpdate={(val) => {handleValueChanged(val)}} placeHolderText="Enter Dollar Amount"></PositiveNumberInput>
        </div>
    )
}