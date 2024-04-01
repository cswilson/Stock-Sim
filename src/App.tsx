import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

import { LineChartComp } from './LineChartComp';
import { TickerInput } from './TickerInput';
import { SearchFailMessage } from './SearchFailMessage';
import { AdvancedAnalytics } from './AdvancedAnalytics';
import { TickerInfo } from './TickerInfo';

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
      const now = Date.now();

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

      var prices: number[] = finalJson.chart.result[0].indicators.quote[0].open;
      prices = prices.map(p => parseFloat(p.toFixed(2)));
      setPrices(prices);

      setTimes(finalJson.chart.result[0].timestamp);
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
      <header className="bg-neutral-950 App-common App-body">
        <p className='text-5xl my-4 text-neutral-400'>Stock Sim</p>
        <TickerInput onTickerSearch={onTickerSearch} />
        {successFullyFoundTicker() && <TickerInfo tickerName={ticker} prices={prices} times={times} />}
        {searchedForTickerAndFailed() && <SearchFailMessage ticker={ticker}/>}
      </header>
      <footer className="App-common App-footer"><p>&copy; 2024 Cliff Wilson. All rights reserved.</p></footer>
    </div>
  );
}

export default App;
