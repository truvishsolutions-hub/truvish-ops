import React, { useState } from 'react';
import './Validity.css';

const Validity = ({ value = '90 Days', onChange }) => {
  // Fixed start date: 12 Aug 2026 (as in the original HTML)
  const START_DATE = new Date(2026, 7, 12);

  // Internal state for custom days input (used when 'custom' is selected)
  const [customDays, setCustomDays] = useState(90);

  // Helper: format date to "12 Aug 2026"
  const formatDate = (date) =>
    date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

  // Compute expiry date based on selected days
  const getExpiry = (days) => {
    const d = new Date(START_DATE);
    d.setDate(d.getDate() + days);
    return d;
  };

  // Parse the current value to get number of days
  const getDaysFromValue = (val) => {
    if (val === '1 Year') return 365;
    if (val === 'custom') return customDays;
    const num = parseInt(val, 10);
    return isNaN(num) ? 90 : num;
  };

  const days = getDaysFromValue(value);
  const expiryDate = getExpiry(days);

  // Handle select change
  const handleSelectChange = (e) => {
    const selected = e.target.value;
    if (selected === 'custom') {
      // Prompt user for custom number of days
      const input = window.prompt('Enter number of days:', customDays);
      if (input !== null) {
        const daysNum = parseInt(input, 10);
        if (!isNaN(daysNum) && daysNum > 0) {
          setCustomDays(daysNum);
          onChange(`${daysNum} Days`);
        } else {
          // If invalid, revert to previous custom value
          onChange(`${customDays} Days`);
        }
      }
    } else {
      onChange(selected);
    }
  };

  // Determine which value to show in the select
  const selectValue = (() => {
    const predefined = ['30 Days', '60 Days', '90 Days', '180 Days', '1 Year'];
    if (predefined.includes(value)) return value;
    return 'custom';
  })();

  return (
    <div className="v-mini-card">
      <h3>
        <span className="v-num-mini">3</span> Validity <span className="v-req">*</span>
      </h3>
      <label>Select Validity</label>
      <select value={selectValue} onChange={handleSelectChange}>
        <option value="30 Days">30 Days</option>
        <option value="60 Days">60 Days</option>
        <option value="90 Days">90 Days</option>
        <option value="180 Days">180 Days</option>
        <option value="1 Year">1 Year</option>
        <option value="custom">Custom</option>
      </select>
      <div className="v-date-row">
        <span>
          Valid From<br />
          <b>{formatDate(START_DATE)}</b>
        </span>
        <span>
          Expires On<br />
          <b>{formatDate(expiryDate)}</b>
        </span>
      </div>
    </div>
  );
};

export default Validity;