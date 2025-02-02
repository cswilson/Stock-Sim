import { useState } from "react"

export enum DateUnit {
    Months = "Months",
    Years = "Years"
}

interface DateUnitProps {
    onUpdate: (dateUnit: DateUnit) => void,
}

export const DateUnitSelect: React.FC<DateUnitProps> = ({ onUpdate }) => {
    const [dateUnit, setDateUnit] = useState<DateUnit>(DateUnit.Months);

    const updateDateUnit = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedDateUnit = e.target.value as DateUnit;
        setDateUnit(selectedDateUnit);
        onUpdate(selectedDateUnit);
    }

    return (
        <select className="searchBox" value={dateUnit} onChange={updateDateUnit}>
            <option value={DateUnit.Months}>Month(s)</option>
            <option value={DateUnit.Years}>Year(s)</option>
        </select>
    )
}