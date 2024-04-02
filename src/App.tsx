import React, { useContext, useState } from 'react';
import logo from './logo.svg';
import './App.css';

import { LineChartComp } from './LineChartComp';
import { TickerInput } from './TickerInput';
import { SearchFailMessage } from './SearchFailMessage';
import { AdvancedAnalytics } from './AdvancedAnalytics';
import { TickerInfo } from './TickerInfo';

//TODO move to own file
class TimeSeriesData {
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

  public isTimeWithinRange(targetTimestamp: number):boolean {
    console.log("Target " + targetTimestamp);
    console.log("first " + this.times[0]);
    console.log("last " + this.times[this.times.length - 1]);

    const tooLow = targetTimestamp < this.times[0];
    const tooHigh = targetTimestamp > this.times[this.times.length - 1];
    return  tooLow || tooHigh;
  }

}

interface TickerContextType {
  ticker: string
  prices: TimeSeriesData
  dividends: TimeSeriesData
}

const TickerContext = React.createContext<TickerContextType | undefined>(undefined);

export const useTickerContext = (): TickerContextType => {
  var context = useContext(TickerContext);
  if (!context) {
    throw new Error("Failed to get context");
  } else {
    return context;
  }
}

function App() {

  const [ticker, setTicker] = useState<string>("");
  const [tickerSearched, setTickerSearched] = useState<boolean>(false);
  const [foundTicker, setFoundTicker] = useState<boolean>(false);
  const [prices, setPrices] = useState<number[]>([]);
  const [times, setTimes] = useState<number[]>([]);

  const onTickerSearch = async (tickerSymbol: string) => {
    //TODO set this constant somewhere in npm config? not sure where to set it 
    const TICKER_REQUEST_BASE: string = "http://localhost:4000/stock/";

    try {
      const baseRequestForTicker = TICKER_REQUEST_BASE + tickerSymbol;

      const response = await fetch(baseRequestForTicker);
      //TODO verify this is the correct way to determine if the ticker was found
      if (!response.ok) {
        setTickerSearched(true);
        setFoundTicker(false);
        setTicker(tickerSymbol)
        throw new Error('Network response was not ok');
      }

      const json = await response.json();
      const firstTradeDate = json.chart.result[0].meta.firstTradeDate;
      //TODO VERY IMPORTANT, FIX THIS HACK REQUIRED CAUSE YAHOO RETURNS NULLS
      // const now = Date.now();
      const now = 1611944000;

      // let query_params = format!("?period1={}&period2={}&interval={}", first_trade_date, now, "1mo");
      //TODO don't hardcode interval
      // const fullQuery = baseRequestForTicker + `?period1=${firstTradeDate}&period2=${now}&interval=1mo`;
      const fullQuery = baseRequestForTicker + `?period1=${firstTradeDate}&period2=${now}&interval=1mo`;

      console.log("Full query is: " + fullQuery);
      const fullResponse = await fetch(fullQuery);
      if (!fullResponse.ok) {
        throw new Error('Network response was not ok');
      }

      const finalJson = await fullResponse.json();

      //TODO yahoo can return null as the last value... need to fix that
      var prices: number[] = finalJson.chart.result[0].indicators.quote[0].open;
      prices = prices.map(p => parseFloat(p.toFixed(2)));
      setPrices(prices);

      const timesInSeconds: number[] = finalJson.chart.result[0].timestamp;
      const timesInMilliseconds = timesInSeconds.map((t) => t * 1000);
      setTimes(timesInMilliseconds);
      setTickerSearched(true);
      setFoundTicker(true);
      setTicker(tickerSymbol);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const successFullyFoundTicker = () => {
    return tickerSearched && foundTicker;
  }

  const searchedForTickerAndFailed = () => {
    return tickerSearched && !foundTicker;
  }

  return (
    <div className="App">
      {/* TODO implement dividends */}
      <TickerContext.Provider value={{ ticker, prices: new TimeSeriesData(prices, times), dividends: new TimeSeriesData([0], [0]) }}>
        <header className="bg-neutral-950 App-common App-body">
          <p className='text-5xl my-4 text-neutral-400'>Stock Sim</p>
          <TickerInput onTickerSearch={onTickerSearch} />
          {successFullyFoundTicker() && <TickerInfo tickerName={ticker} prices={prices} times={times} />}
          {searchedForTickerAndFailed() && <SearchFailMessage ticker={ticker} />}
        </header>
        <footer className="App-common App-footer"><p>&copy; 2024 Cliff Wilson. All rights reserved.</p></footer>
      </TickerContext.Provider>
    </div>
  );
}

export default App;
