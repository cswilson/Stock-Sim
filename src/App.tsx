import React, { useContext, useState } from 'react';
import './App.css';

import { TickerInput } from './TickerInput';
import { TickerData } from './TickerData';
import { TickerInfo } from './TickerInfo';
import { SearchFailMessage } from './SearchFailMessage';

export const TickerContext = React.createContext<TickerData>(new TickerData());

function App() {

  const [tickerData, setTickerData] = useState<TickerData>(new TickerData());
  const [tickerSearched, setTickerSearched] = useState<boolean>(false);
  const [foundTicker, setFoundTicker] = useState<boolean>(false);

  const onTickerSearch = async (tickerSymbol: string) => {
    const tickerData = await TickerData.retrieveTickerInfo(tickerSymbol);
    if (tickerData instanceof Error) {
      console.error("Error retrieving ticker data: "  + tickerData.message);
      setFoundTicker(false);
    } else if (tickerData instanceof TickerData) {
      setTickerData(tickerData);
      setFoundTicker(true);
    }

    setTickerSearched(true);
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
      <TickerContext.Provider value={tickerData}>
        <header className="bg-neutral-950 App-common App-body">
          <p className='text-5xl my-4 text-neutral-400'>Stock Sim</p>
          <TickerInput onTickerSearch={onTickerSearch} />
          {successFullyFoundTicker() && <TickerInfo/>}
          {searchedForTickerAndFailed() && <SearchFailMessage tickerSymbol={tickerData.ticker} />}
        </header>
        <footer className="App-common App-footer"><p>&copy; 2024 Cliff Wilson. All rights reserved.</p></footer>
      </TickerContext.Provider>
    </div>
  );
}

export default App;
