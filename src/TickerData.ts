import { DateRange } from "./DateRange";
import { InvestmentSummary } from "./InvestmentSummary";

enum SnappingOption {
    NONE,
    FORWARD,
    BACKWARD
}

export class TimeSeriesData {
    public readonly values: number[];
    public readonly times: number[];

    constructor(values: number[], times: number[]) {
        this.values = values;
        this.times = times;
    }

    public getClosestTimeIndex(targetTimestamp: number): number {
        let left = 0;
        let right = this.times.length - 1;
        let nearestIndex = 0;

        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            if (Math.abs(this.times[mid] - targetTimestamp) < Math.abs(this.times[nearestIndex] - targetTimestamp)) {
                nearestIndex = mid;
            }
            if (this.times[mid] < targetTimestamp) left = mid + 1;
            else right = mid - 1;
        }

        return nearestIndex;
    }

    public getMatchingTimeIndex(targetTimestamp: number, snap: SnappingOption = SnappingOption.NONE): number {
        const nearestIndex = this.getClosestTimeIndex(targetTimestamp);
        const timeValue = this.times[nearestIndex];
        if (snap == SnappingOption.FORWARD && timeValue < targetTimestamp) {
            return nearestIndex + 1;
        } else if (snap == SnappingOption.BACKWARD && timeValue > targetTimestamp) {
            return nearestIndex - 1;
        } else {
            return nearestIndex;
        }
    }

    public getDateRange(): DateRange | undefined {
        if (this.times.length == 0) {
            return undefined;
        }
        return {start: new Date(this.times[0]), end: new Date(this.times[this.times.length - 1])};
    }

    public isTimeOutsideRange(targetTimestamp: number): boolean {
        const dateRange = this.getDateRange();
        if (dateRange === undefined){
            return true;
        }
        return targetTimestamp < dateRange.start.getTime() || targetTimestamp > dateRange.end.getTime();
    }

}

export class TickerData {
    public readonly symbol: string
    public readonly prices: TimeSeriesData
    public readonly dividends: TimeSeriesData

    constructor(ticker?: string, prices?: TimeSeriesData, dividends?: TimeSeriesData) {
        this.symbol = ticker || "";
        this.prices = prices || new TimeSeriesData([], []);
        this.dividends = dividends || new TimeSeriesData([], []);
    }

    public simulateInvestmentOverTime(investmentAmount: number, startTimestamp: number, endTimestamp: number): InvestmentSummary | undefined {
        if (this.prices.isTimeOutsideRange(startTimestamp)){
            return undefined;
        }

        const startIndex = this.prices.getMatchingTimeIndex(startTimestamp);
        const initialSharePrice = this.prices.values[startIndex];
        const sharesOwned = investmentAmount / initialSharePrice;

        const endIndex = this.prices.getMatchingTimeIndex(endTimestamp);
        const endingPrice = this.prices.values[endIndex];

        const startDividendIndex = this.dividends.getMatchingTimeIndex(startTimestamp, SnappingOption.FORWARD);
        const endDividendIndex = this.dividends.getMatchingTimeIndex(endTimestamp, SnappingOption.BACKWARD);

        let totalDividendsPaid = 0;
        for (let i = startDividendIndex; i < endDividendIndex; i++) {
            totalDividendsPaid += (this.dividends.values[i] * sharesOwned); 
            i++;
        }

        const endPortfolioValue = (sharesOwned * endingPrice) + totalDividendsPaid;
        return new InvestmentSummary(investmentAmount, endPortfolioValue, totalDividendsPaid);
    }

    static async retrieveTickerInfo(tickerSymbol: string): Promise<TickerData | Error> {

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

        var dividendEvents = Object.values(finalJson.chart.result[0].events.dividends);
        const dividendPrices = dividendEvents.map((e: any) => e.amount);
        const dividendDates = dividendEvents.map((e: any) => e.date);
        const dividendData = new TimeSeriesData(dividendPrices, dividendDates.map(t => t * 1000));

        return new TickerData(tickerSymbol, priceData, dividendData);
    }
}