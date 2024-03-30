import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

import { LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, AreaChart, Area} from 'recharts';

interface LineChartProps {
  prices: number[]
  times: number[]
}

const LineChartComp: React.FC<LineChartProps> = ({ prices, times }) => {

  const generateData = (): any[] => {

    const humanReadableTimes = times.map((time: number) => {
      const date = new Date(time * 1000);
      const month = date.toLocaleString('default', { month: 'short' });
      const year = date.getFullYear();
      return `${month}-${year}`;
    })

    const data: any[] = [];
    for (var i = 0; i < prices.length; i++) {
      data.push({ name: humanReadableTimes[i], price: prices[i] })
    }
    return data;
  }

  return (

    <AreaChart width={800} height={400} data={generateData()}
    >
      <defs>
        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
          <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
        </linearGradient>
      </defs>
      <XAxis tick={{ fontSize: 16 }} dataKey="name"
      />
      <YAxis tick={{ fontSize: 16 }} 
      />
      <CartesianGrid strokeDasharray="3 3" />
      <Tooltip />
      <Area type="monotone" dataKey="price" stroke="#82ca9d" fillOpacity={1} fill="url(#colorUv)" />
    </AreaChart>

  )

}

interface TickerInputProps {
  onTickerSearch: (ticker: string) => void;
}

const TickerInput: React.FC<TickerInputProps> = ({ onTickerSearch }) => {
  //TODO set this constant somewhere in npm config? not sure where to set it 
  const HINT: string = "Enter Ticker";
  const [value, setValue] = useState<string>('');
  const [hint, setHint] = useState<string>(HINT);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value.toUpperCase());
  };

  const handleFocus = () => {
    setHint('');
  };

  const handleBlur = () => {
    if (value === '') {
      setHint(HINT);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onTickerSearch(value);
  };

  return (
    <div className="w-full max-w-xs">
      <form className="" onSubmit={handleSubmit}>
        <div className="mb-6">
          <input
            type="text"
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={hint}
            id="ticker"
            className="text-center shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          />
          <p className="text-gray-500 text-xs italic">Enter a stock ticker symbol, such as (VTI, VOO, VXUS)</p>
        </div>
      </form>
    </div>
  );

};

function App() {

  const [tickerSearched, setTickerSearched] = useState<boolean>(false);
  const [prices, setPrices] = useState<number[]>([]);
  const [times, setTimes] = useState<number[]>([]);

  const onTickerSearch = async (tickerSymbol: string) => {
    const TICKER_REQUEST_BASE: string = "http://localhost:4000/stock/";

    console.log("Ticker search occurred:" + tickerSymbol);

    try {
      const baseRequestForTicker = TICKER_REQUEST_BASE + tickerSymbol;

      const response = await fetch(baseRequestForTicker);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const json = await response.json();
      const firstTradeDate = json.chart.result[0].meta.firstTradeDate;
      const now = Date.now();

      // let query_params = format!("?period1={}&period2={}&interval={}", first_trade_date, now, "1mo");
      //TODO don't hardcode interval
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
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  return (
    <div className="App">
      <header className="App-common App-header">
        <p>Stock Sim</p>
        <TickerInput onTickerSearch={onTickerSearch} />
        {tickerSearched && <LineChartComp prices={prices} times={times} />}
      </header>
      <footer className="App-common App-footer"><p>&copy; 2024 Cliff Wilson. All rights reserved.</p></footer>
    </div>
  );
}

export default App;
