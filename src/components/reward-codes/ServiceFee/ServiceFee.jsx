import React, { useState } from 'react';
import './ServiceFee.css';

const ServiceFee = ({ value = 10, onChange }) => {
  // value is the selected fee percentage (number)
  const [customFee, setCustomFee] = useState(15);

  const handleSelectChange = (e) => {
    const selected = e.target.value;
    if (selected === 'custom') {
      // Prompt for custom percentage
      const input = window.prompt('Enter custom fee percentage (0-100):', customFee);
      if (input !== null) {
        const pct = parseFloat(input);
        if (!isNaN(pct) && pct >= 0) {
          setCustomFee(pct);
          onChange(pct);
        } else {
          // revert to previous custom value
          onChange(customFee);
        }
      }
    } else {
      onChange(parseFloat(selected));
    }
  };

  // Determine select value
  const predefined = [0, 5, 10];
  const selectValue = predefined.includes(value) ? value : 'custom';

  // Display text for the current fee
  const feeDisplay = value === 0 ? 'No Service Fee' : `${value}%`;

  return (
    <div className="sf-mini-card">
      <h3>
        <span className="sf-num-mini">4</span> Service Fee <span className="sf-req">*</span>
      </h3>
      <label>Select Service Fee</label>
      <select value={selectValue} onChange={handleSelectChange}>
        <option value="0">No Service Fee</option>
        <option value="5">5%</option>
        <option value="10">10% (10% of reward value)</option>
        <option value="custom">Custom</option>
      </select>
      <div className="sf-fee-amt">
        <span>Service Fee Amount</span>
        <span>{feeDisplay}</span>
      </div>
    </div>
  );
};

export default ServiceFee;