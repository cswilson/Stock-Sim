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

  public isTimeOutsideRange(targetTimestamp: number): boolean {
    const tooLow = targetTimestamp < this.times[0];
    const tooHigh = targetTimestamp > this.times[this.times.length - 1];
    return tooLow || tooHigh;
  }

}

export class TickerData {

  // TODO rename this to symbol
  ticker: string
  prices: TimeSeriesData
  dividends: TimeSeriesData

  // constructor();
  constructor(ticker?: string, prices?: TimeSeriesData, dividends?: TimeSeriesData) {
    this.ticker = ticker || "";
    this.prices = prices || new TimeSeriesData([], []);
    this.dividends = dividends || new TimeSeriesData([], []);
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
    const timesInMilliseconds = timesInSeconds.map((t) => t * 1000);

    const priceData = new TimeSeriesData(prices, timesInMilliseconds);
    //TODO
    const dividendData = new TimeSeriesData([], []);

    return new TickerData(tickerSymbol, priceData, dividendData);
  }
}