import { useState } from "react";

interface TickerInputProps {
  onTickerSearch: (ticker: string) => void;
}

export const TickerInput: React.FC<TickerInputProps> = ({ onTickerSearch }) => {
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
            className="searchBox"
          />
          <p className="text-neutral-500 mt-3 text-xs italic">Enter a stock ticker symbol, such as (AAPL, MSFT, or NVDA)</p>
        </div>
      </form>
    </div>
  );

};