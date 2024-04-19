import { addMonths, isLastDayOfMonth } from "date-fns";
import { DateRange } from "./DateRange";
import { InvestmentSummary } from "./InvestmentSummary";
import { StockData } from "./TickerData";
import { TimeSeriesData } from "./TimeSeriesData";

export namespace Utils {
    export const formatDate = (date: Date) => {
        if (isLastDayOfMonth(date)){
            date = addMonths(date, 1);
        }
        const options: Intl.DateTimeFormatOptions = { month: 'short', year: 'numeric' };
        return date.toLocaleString(undefined, options);
    }

    export function simulateInvestment(stockToBuy: StockData, investmentEvents: TimeSeriesData, dateRange: DateRange): InvestmentSummary {
        let sharesOwned = 0;
        let dividendsPaid = 0;

        const relevantEvents = investmentEvents.getDataInRange(dateRange);

        for (let i = 0; i < relevantEvents.length; i++){
            const currentEvent = relevantEvents[i]

            const nextInvestmentEventTime = relevantEvents[i + 1]?.timestamp || dateRange.end.getTime();

            sharesOwned += currentEvent.value / stockToBuy.getBuyPrice(currentEvent.timestamp)

            const timeBetweenEvents = new DateRange(currentEvent.timestamp, nextInvestmentEventTime);
            const relevantDividendEvents = stockToBuy.dividends.getDataInRange(timeBetweenEvents);

            relevantDividendEvents.forEach(event => dividendsPaid += event.value);
        }

        const amountInvested = relevantEvents.reduce((total, current) => total += current.value, 0);
        const finalShareValue = stockToBuy.getBuyPrice(dateRange.end.getTime()) * sharesOwned;
        const totalValue = finalShareValue + dividendsPaid;

        return new InvestmentSummary(amountInvested, totalValue, dividendsPaid);
    }
}
