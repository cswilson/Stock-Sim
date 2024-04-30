import { InvestmentSummary } from "./InvestmentSummary";
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

    //TODO IMPORTANT don't even store price info in terms of timestamps, just store them as Month/Year values, this makes things much simpler
    static async retrieveTickerInfo(tickerSymbol: string): Promise<StockData | Error> {

        try {
            //TODO set this constant somewhere in npm config? not sure where to set it 
            const TICKER_REQUEST_BASE: string = "http://localhost:4000/stock/";

            const baseRequestForTicker = TICKER_REQUEST_BASE + tickerSymbol;

            const response = await fetch(baseRequestForTicker);
            if (!response.ok) {
                return new Error("Failed to fetch data for initial ticker request: " + baseRequestForTicker);
            }

            const json = await response.json();
            const firstTradeDate = json.chart.result[0].meta.firstTradeDate;
            //TODO VERY IMPORTANT: on rare occasions yahoo will return a price array with nulls at the end (seemed to happen on April 1st, but I can't replicate it)
            //need to add something to work around that
            const now = Date.now();
            // const now = 1611944000;

            //TODO hardcode 1 month interval in the backend express server
            const fullQuery = baseRequestForTicker + `?period1=${firstTradeDate}&period2=${now}&interval=1mo`;

            const fullResponse = await fetch(fullQuery);
            if (!fullResponse.ok) {
                return new Error("Failed to fetch data for full ticker request: " + fullQuery);
            }

            const finalJson = await fullResponse.json();

            //TODO yahoo can return null as the last value... need to fix that
            var prices: number[] = finalJson.chart.result[0].indicators.quote[0].open;
            //The final element in the list will be the value of the current month. We only want data 
            //from months that have already passed so the final value is popped.
            prices.pop();
            prices = prices.map(p => parseFloat(p.toFixed(2)));

            const timesInSeconds: number[] = finalJson.chart.result[0].timestamp;
            //The final time is popped for the same reason we pop the final price
            timesInSeconds.pop()
            const priceData = new TimeSeriesData(prices, timesInSeconds.map(t => t * 1000));

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