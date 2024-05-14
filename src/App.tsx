import React, { useContext, useState } from 'react';

import { TickerInput } from './TickerInput';
import { StockData } from './TickerData';
import { TickerInfo } from './TickerInfo';
import { SearchFailMessage } from './SearchFailMessage';

export const TickerContext = React.createContext<StockData>(new StockData());

//TODO fix rendering on very small displays
function App() {

  const [tickerData, setTickerData] = useState<StockData>(new StockData());
  const [tickerSearched, setTickerSearched] = useState<boolean>(false);
  const [foundTicker, setFoundTicker] = useState<boolean>(false);

  const onTickerSearch = async (tickerSymbol: string) => {
    const tickerData = await StockData.retrieveTickerInfo(tickerSymbol);
    if (tickerData instanceof Error) {
      console.error("Error retrieving ticker data: "  + tickerData.message);
      setTickerData(new StockData(tickerSymbol));
      setFoundTicker(false);
    } else if (tickerData instanceof StockData) {
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
      <TickerContext.Provider value={tickerData}>
        <header className="bg-neutral-950 App-common App-body">
          <p className='text-5xl my-4 text-neutral-400'>Stock Sim</p>
          <TickerInput onTickerSearch={onTickerSearch} />
          {successFullyFoundTicker() && <TickerInfo/>}
          {searchedForTickerAndFailed() && <SearchFailMessage tickerSymbol={tickerData.symbol} />}
        </header>
      </TickerContext.Provider>
    </div>
  );
}

export default App;
