import { useState } from "react";

export const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { month: 'short', year: 'numeric' };
    return date.toLocaleString(undefined, options);
}

interface DatePickerProps {
    onDateChange: (date: Date) => void;
}

export const DatePicker: React.FC<DatePickerProps> = ({ onDateChange }) => {
    const [date, setDate] = useState<Date>(new Date());

    const handleDateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { id, value } = event.target;
        const updatedDate = new Date(date.getFullYear(), date.getMonth(), 1);
        if (id === "month") { updatedDate.setMonth(parseInt(value));} 
        else if (id === "year") {updatedDate.setFullYear(parseInt(value));}
        setDate(updatedDate);
        onDateChange(updatedDate);
    }

    //TODO change years based on range of the data
    const [years] = useState(() => {
        const currentYear = new Date().getFullYear();
        const yearsArray = [];
        for (let year = currentYear; year >= currentYear - 10; year--) {
            yearsArray.push({ value: year, label: year });
        }
        return yearsArray;
    });

    return (
        <div className="flex justify-center items-center gap-4">
            <select id="month" value={date.getMonth()} className="btn" onChange={handleDateChange}>
                <option value={0}>Jan</option>
                <option value={1}>Feb</option>
                <option value={2}>Mar</option>
                <option value={3}>Apr</option>
                <option value={4}>May</option>
                <option value={5}>Jun</option>
                <option value={6}>Jul</option>
                <option value={7}>Aug</option>
                <option value={8}>Sep</option>
                <option value={9}>Oct</option>
                <option value={10}>Nov</option>
                <option value={11}>Dec</option>
            </select>
            <select id="year" className="btn" value={date.getFullYear()} onChange={handleDateChange}>
                {years.map(year => (
                    <option key={year.value} value={year.value}>{year.label}</option>
                ))}
            </select>
        </div>
    );
}