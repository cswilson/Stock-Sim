import { useContext, useEffect, useState } from "react";
import { DateRange } from "./DateRange";
import { StockData } from "./TickerData";
import { TickerContext } from "./App";

interface DatePickerProps {
    onDateChange: (date: Date) => void;
    defaultToFirstDate: boolean
}

interface Month { 
    value: number,
    name: string
}

const allMonths: Month[] = [
    {value: 0, name: "Jan"},
    {value: 1, name: "Feb"},
    {value: 2, name: "Mar"},
    {value: 3, name: "Apr"},
    {value: 4, name: "May"},
    {value: 5, name: "Jun"},
    {value: 6, name: "Jul"},
    {value: 7, name: "Aug"},
    {value: 8, name: "Sep"},
    {value: 9, name: "Oct"},
    {value: 10, name: "Nov"},
    {value: 11, name: "Dec"},
]

export const DatePicker: React.FC<DatePickerProps> = ({ onDateChange, defaultToFirstDate }) => {

    const tickerData = useContext<StockData>(TickerContext);
    const [dateRange, setDateRange] = useState<DateRange>(new DateRange(0, 0))
    const [date, setDate] = useState<Date>(new Date())
    const [years, setYears] = useState<number[]>([])
    const [months, setMonths] = useState<Month[]>([])

    useEffect(() => {
        const newDateRange = tickerData.prices.getDateRange();

        let defaultDate = defaultToFirstDate ? newDateRange.start : newDateRange.end;
        updateDate(defaultDate, newDateRange);

        const startYear = newDateRange.start.getFullYear();
        const endYear = newDateRange.end.getFullYear();

        const years = [];
        for (let year = startYear; year <= endYear; year++) {
            years.push(year);
        }
        setYears(years);


    }, [tickerData])


    const updateAvailableMonths = (currentDate: Date, dateRange: DateRange) => {
        const startYear = dateRange.start.getFullYear();
        const endYear = dateRange.end.getFullYear();

        if (currentDate.getFullYear() == startYear) {
            setMonths(allMonths.slice(dateRange.start.getMonth(), allMonths.length))
        } else if (currentDate.getFullYear() == endYear) {
            setMonths(allMonths.slice(0, dateRange.end.getMonth() + 1))
        } else {
            setMonths(allMonths)
        }
    }

    const handleDateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { id, value } = event.target;
        const updatedDate = new Date(date.getFullYear(), date.getMonth(), 1);
        if (id === "month") { updatedDate.setMonth(parseInt(value));} 
        else if (id === "year") {updatedDate.setFullYear(parseInt(value));}
        updateDate(updatedDate, dateRange);
    }

    //TODO this is still snapping wrong 
    const updateDate = (newDate: Date, dateRange: DateRange) => {
        console.log("DR ", dateRange.start, dateRange.end);
        // setDate(newDate);
        // onDateChange(newDate);
        setDateRange(dateRange)
        updateAvailableMonths(newDate, dateRange);

        const snappedDate = dateRange.snapDateWithinRange(newDate);
        setDate(snappedDate);
        onDateChange(snappedDate);
        
    }

    return (
        <div className="flex justify-center items-center gap-4">
            <select id="month" value={date.getMonth()} className="btn" onChange={handleDateChange}>
                {months.map(month => (
                    <option key={month.value} value={month.value}>{month.name}</option>
                ))}
            </select>
            <select id="year" className="btn" value={date.getFullYear()} onChange={handleDateChange}>
                {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                ))}
            </select>
        </div>
    );
}