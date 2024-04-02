import { ChangeEventHandler, useState } from "react";

export class MonthYearDate {
    public month: number;
    public year: number;

    constructor(month: number = 1, year: number = new Date().getFullYear()) {
        this.month = month;
        this.year = year;
    }

    public toTimestampMillis():number {
        const date = new Date(this.year, this.month, 1);
        console.log("Date is", date.getFullYear(), date.getMonth())
        return date.getTime();
    }

    public toHumanReadableString():string {
        const date = new Date(this.toTimestampMillis());
        const options: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' };
        return date.toLocaleString(undefined, options);
    }
}

interface DatePickerProps {
    onDateChange: (date: MonthYearDate) => void;
}

export const DatePicker: React.FC<DatePickerProps> = ({ onDateChange }) => {
    const [date, setDate] = useState<MonthYearDate>(new MonthYearDate());

    const handleDateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { id, value } = event.target;
        const updatedDate = new MonthYearDate(date.month, date.year);
        if (id === "month") { updatedDate.month = parseInt(value);} 
        else if (id === "year") {updatedDate.year = parseInt(value);}
        setDate(updatedDate);
        onDateChange(updatedDate);
    }

    //TODO get years based on date range
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
            <select id="month" value={date.month} className="btn" onChange={handleDateChange}>
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
            <select id="year" className="btn" value={date.year} onChange={handleDateChange}>
                {years.map(year => (
                    <option key={year.value} value={year.value}>{year.label}</option>
                ))}
            </select>
        </div>
    );
}