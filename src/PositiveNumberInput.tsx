import React, { ChangeEvent, useState } from 'react';

interface PositiveNumberInputProps {
  onUpdate: (value: number) => void;
  placeHolderText: string;
  defaultValue?: number;
}

const PositiveNumberInput: React.FC<PositiveNumberInputProps> = ({ onUpdate, placeHolderText, defaultValue = 0 }) => {
  const [value, setValue] = useState<number>(defaultValue);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const desiredNumber = parseFloat(e.target.value);

    let newValue = value;
    if (isNaN(desiredNumber)) {
      newValue = 0;
    } else if (desiredNumber >= 0) {
      newValue = desiredNumber
    }

    setValue(newValue);
    onUpdate(newValue);
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