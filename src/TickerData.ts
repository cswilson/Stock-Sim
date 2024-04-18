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
        const index = this.prices.getTimeIndex(timestamp, SnappingOption.BACKWARD);
        return this.prices.values[index];
    }

    public simulateLumpSumOverTime(investmentAmount: number, timeToLumpSum: number, endTimestamp: number): InvestmentSummary | undefined {
        if (this.prices.isTimeOutsideRange(timeToLumpSum)){
            return undefined;
        }

        const startIndex = this.prices.getTimeIndex(timeToLumpSum);
        const initialSharePrice = this.prices.values[startIndex];
        const sharesOwned = investmentAmount / initialSharePrice;

        const endIndex = this.prices.getTimeIndex(endTimestamp);
        const endingPrice = this.prices.values[endIndex];

        const startDividendIndex = this.dividends.getTimeIndex(timeToLumpSum, SnappingOption.FORWARD);
        const endDividendIndex = this.dividends.getTimeIndex(endTimestamp, SnappingOption.BACKWARD);

        let totalDividendsPaid = 0;
        for (let i = startDividendIndex; i < endDividendIndex; i++) {
            totalDividendsPaid += (this.dividends.values[i] * sharesOwned); 
            i++;
        }

        const endPortfolioValue = (sharesOwned * endingPrice) + totalDividendsPaid;
        return new InvestmentSummary(investmentAmount, endPortfolioValue, totalDividendsPaid);
    }

    static async retrieveTickerInfo(tickerSymbol: string): Promise<StockData | Error> {

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

        const fullQuery = baseRequestForTicker + `?period1=${firstTradeDate}&period2=${now}&interval=1mo`;

        const fullResponse = await fetch(fullQuery);
        if (!fullResponse.ok) {
            return new Error("Failed to fetch data for full ticker request: " + fullQuery);
        }

        const finalJson = await fullResponse.json();

        //TODO yahoo can return null as the last value... need to fix that
        var prices: number[] = finalJson.chart.result[0].indicators.quote[0].open;
        prices = prices.map(p => parseFloat(p.toFixed(2)));

        const timesInSeconds: number[] = finalJson.chart.result[0].timestamp;
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
    }
}