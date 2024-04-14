import { InvestmentSummary } from "./InvestmentSummary";

enum SnappingOption {
    NONE,
    FORWARD,
    BACKWARD
}

export class TimeSeriesData {
    public readonly values: number[];
    public readonly times: number[];

    constructor(values: number[], times: number[], convertToMillis: boolean) {
        this.values = values;
        if (convertToMillis) {
            this.times = times.map((t) => t * 1000);
        } else {
            this.times = times;
        }
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

    public isTimeOutsideRange(targetTimestamp: number): boolean {
        const tooLow = targetTimestamp < this.times[0];
        const tooHigh = targetTimestamp > this.times[this.times.length - 1];
        return tooLow || tooHigh;
    }

}

export class TickerData {
    symbol: string
    prices: TimeSeriesData
    dividends: TimeSeriesData

    constructor(ticker?: string, prices?: TimeSeriesData, dividends?: TimeSeriesData) {
        this.symbol = ticker || "";
        this.prices = prices || new TimeSeriesData([], [], false);
        this.dividends = dividends || new TimeSeriesData([], [], false);
    }

    simulateInvestmentOverPeriod(investmentAmount: number, startTimestamp: number, endTimestamp: number): InvestmentSummary {
        const startIndex = this.prices.getMatchingTimeIndex(startTimestamp);
        const initialSharePrice = this.prices.values[startIndex];
        const sharesOwned = investmentAmount / initialSharePrice;

        const endIndex = this.prices.getMatchingTimeIndex(endTimestamp);
        const endingPrice = this.prices.values[endIndex];

        const startDividendIndex = this.dividends.getMatchingTimeIndex(startTimestamp, SnappingOption.FORWARD);
        const endDividendIndex = this.dividends.getMatchingTimeIndex(startTimestamp, SnappingOption.BACKWARD);

        let totalDividendsPaid = 0;
        for (let i = startDividendIndex; i < endDividendIndex; i++) {
            //TODO this is assuming the dividend values from yahoo represent payment per share, need to confirm this is correct
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
        //TODO VERY IMPORTANT, FIX THIS HACK REQUIRED CAUSE YAHOO RETURNS NULLS
        // const now = Date.now();
        const now = 1611944000;

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
        const priceData = new TimeSeriesData(prices, timesInSeconds, true);

        var dividendEvents = Object.values(finalJson.chart.result[0].events.dividends);
        const dividendPrices = dividendEvents.map((e: any) => e.amount);
        const dividendDates = dividendEvents.map((e: any) => e.date);
        const dividendData = new TimeSeriesData(dividendPrices, dividendDates, true);

        return new TickerData(tickerSymbol, priceData, dividendData);
    }
}