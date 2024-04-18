import { DateRange } from "./DateRange";
import { InvestmentSummary } from "./InvestmentSummary";
import { StockData } from "./TickerData";
import { TimeSeriesData } from "./TimeSeriesData";

export class Investor {
    public readonly stockToBuy: StockData;
    public readonly investmentEvents: TimeSeriesData;

    constructor(stockToBuy: StockData) {
        this.stockToBuy = stockToBuy;
        this.investmentEvents = new TimeSeriesData();
    }

    public addInvestmentEvent(dollarsToInvest: number, investmentTimestamp: number) {
        this.investmentEvents.addValueAtTime(dollarsToInvest, investmentTimestamp)
    }

    // public simulate(dateRange: DateRange): InvestmentSummary | undefined {

    //     let sharesOwned = 0;
    //     let dividendsPaid = 0;

    //     for (let i = 0; i < this.investmentEvents.length; i++){

    //         const investmentEvent = this.investmentEvents[i];
    //         const nextInvestmentEventTime = this.investmentEvents[i + 1].timestamp || dateRange.end.getTime();

    //         sharesOwned += investmentEvent.dollarsToInvest / this.stockToBuy.getBuyPrice(investmentEvent.timestamp)

    //         const timeBetweenEvents = new DateRange(investmentEvent.timestamp, nextInvestmentEventTime);
    //         const relevantDividendEvents = this.stockToBuy.dividends.getValuesInRange(timeBetweenEvents);

    //         relevantDividendEvents.values.forEach(v => dividendsPaid += v);
    //     }
    // }

    // }

}