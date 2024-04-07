import React, { ChangeEvent, useState } from 'react';

interface PositiveNumberInputProps {
  onUpdate: (value: number) => void;
  placeHolderText: string;
  defaultValue?: number;
}

const PositiveNumberInput: React.FC<PositiveNumberInputProps> = ({ onUpdate, placeHolderText, defaultValue = 0 }) => {
  const [value, setValue] = useState<number>(defaultValue);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = parseFloat(e.target.value);
    if (!isNaN(inputValue) && inputValue >= 0) {
      setValue(inputValue);
      onUpdate(inputValue);
    }
  };

  return (
    <input
      type="number"
      value={value || ''}
      onChange={handleChange}
      placeholder={placeHolderText}
      className='searchBox md:w-64 w-32'
    />
  );
};

export default PositiveNumberInput;