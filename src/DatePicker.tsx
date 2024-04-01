import { useState } from "react";

// interface DatePickerProps {
//   times: number[]
// }

// export const DatePicker: React.FC<DatePickerProps> = ({times}) => {
export const DatePicker: React.FC = () => {

    //TODO add ability to restrict month/years to input data
    const [months] = useState([
        { value: '01', label: 'Jan' },
        { value: '02', label: 'Feb' },
        { value: '03', label: 'Mar' },
        { value: '04', label: 'Apr' },
        { value: '05', label: 'May' },
        { value: '06', label: 'Jun' },
        { value: '07', label: 'Jul' },
        { value: '08', label: 'Aug' },
        { value: '09', label: 'Sep' },
        { value: '10', label: 'Oct' },
        { value: '11', label: 'Nov' },
        { value: '12', label: 'Dec' },
    ]);

    //TODO maybe add support for days?
    // const [days] = useState(() => {
    //     const daysArray = [];
    //     for (let day = 1; day <= 31; day++) {
    //         daysArray.push({ value: String(day).padStart(2, '0'), label: String(day).padStart(2, '0') });
    //     }
    //     return daysArray;
    // });

    //TODO update the available months based on the selected year
    const [years] = useState(() => {

        // const firstTime = times[0]
        // const lastTime = times[times.length - 1]
        // const firstDate = new Date(firstTime);
        // console.log(firstDate);

        const currentYear = new Date().getFullYear();
        const yearsArray = [];
        for (let year = currentYear; year >= currentYear - 10; year--) {
            yearsArray.push({ value: year, label: year });
        }
        return yearsArray;
    });

    return (
        <div className="flex justify-center items-center gap-4">
            <select id="month" className="btn">
                {months.map(month => (
                    <option key={month.value} value={month.value}>{month.label}</option>
                ))}
            </select>
            <select id="year" className="btn">
                {years.map(year => (
                    <option key={year.value} value={year.value}>{year.label}</option>
                ))}
            </select>
        </div>
    );
}