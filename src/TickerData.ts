import { addMonths } from "date-fns";
import { SnappingOption, TimeSeriesData } from "./TimeSeriesData";

export class StockData {
    public readonly symbol: string
    public readonly prices: TimeSeriesData
    public readonly dividends: TimeSeriesData

    constructor(ticker?: string, prices?: TimeSeriesData, dividends?: TimeSeriesData) {
        this.symbol = ticker || "";
        this.prices = prices || new TimeSeriesData([], []);
        this.dividends = dividends || new TimeSeriesData([], []);
    }

    public getBuyPrice(timestamp: number): number {
        const index = this.prices.indexAtTime(timestamp, SnappingOption.BACKWARD);
        return this.prices.valueAt(index);
    }

    static async retrieveTickerInfo(tickerSymbol: string): Promise<StockData | Error> {

        const apiUrl = process.env.REACT_APP_API_URL;
        console.log("URL: " + apiUrl);
        if (apiUrl == undefined) {
            throw new Error("REACT_APP_API_URL is not defined. Unable to retrieve ticker data.");
        }

        try {
            const query = apiUrl + `?ticker=${tickerSymbol}` + `&period1=${0}&period2=${Date.now()}`;

            const response = await fetch(query);

            if (!response.ok) {
                return new Error("Failed to fetch data for full ticker request: " + query);
            }

            const finalJson = await response.json();

            var nullPrices: (number | null)[] = finalJson.chart.result[0].indicators.quote[0].open;
            //The final element in the list will be the value of the current month. We only want data 
            //from months that have already passed so the final value is popped.
            nullPrices.pop();

            //If the start of a month begins with a weekend, Yahoo will sometimes return null values near the end of price array.
            //If the array contains null values, the array needs to be sliced to the element before the null.
            var prices: number[]
            if (nullPrices.includes(null)) {
                prices = nullPrices.slice(0, nullPrices.indexOf(null)) as number[];
            } else {
                prices = nullPrices as number[]
            }

            prices = prices.map(p => parseFloat(p.toFixed(2)));

            var timesInSeconds: number[] = finalJson.chart.result[0].timestamp;
            //The list of times is sliced to ensure that it is the same length as the prices
            timesInSeconds = timesInSeconds.slice(0, prices.length);

            //Yahoo returns prices on the last day of each month. To simplify things the date is instead snapped to the first 
            //day of the next month.
            const convertedDates = timesInSeconds.map(t => {
                const millis = t * 1000;
                const date = new Date(millis);
                const nextMonthDate = addMonths(date, 1);
                return new Date(nextMonthDate.getFullYear(), nextMonthDate.getMonth()).getTime()
            })

            const priceData = new TimeSeriesData(prices, convertedDates);

            const events = finalJson.chart.result[0].events;
            let dividendData = undefined;
            if (events){
                var dividendEvents = Object.values(events.dividends);
                const dividendPrices = dividendEvents.map((e: any) => e.amount);
                const dividendDates = dividendEvents.map((e: any) => e.date);
                dividendData = new TimeSeriesData(dividendPrices, dividendDates.map(t => t * 1000));
            }

            return new StockData(tickerSymbol, priceData, dividendData);
        } catch (e:any) { 
            return e;
        }
        
    }
}