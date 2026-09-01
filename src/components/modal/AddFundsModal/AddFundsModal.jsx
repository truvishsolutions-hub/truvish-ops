import React, { useState, useEffect, useCallback } from 'react';
import './AddFundsModal.css';

// Shared formatting utility (can be moved to a separate file later)
const fmt = (value) =>
  '₹' + Number(value).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const AddFundsModal = ({
  isOpen = false,
  onClose,
  onConfirm,
  clientName = 'ABC Pvt Ltd',
  clientId = 'CLT10234',
  currentBalance = 0,
}) => {
  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');
  const [error, setError] = useState('');

  // Handle amount input – allow only one decimal point
  const handleAmountChange = useCallback((e) => {
    const raw = e.target.value;
    // Allow only digits and at most one decimal point
    const sanitized = raw.replace(/[^0-9.]/g, '');
    const parts = sanitized.split('.');
    if (parts.length > 2) return; // reject multiple decimals
    setAmount(sanitized);
    setError('');
  }, []);

  // Submit handler
  const handleSubmit = useCallback(() => {
    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount greater than zero.');
      return;
    }
    // Optional: check for max precision (e.g., 2 decimals)
    if (amount.includes('.') && amount.split('.')[1].length > 2) {
      setError('Amount can have at most two decimal places.');
      return;
    }
    onConfirm(numAmount, reference);
    setAmount('');
    setReference('');
    setError('');
  }, [amount, reference, onConfirm]);

  // Cancel handler
  const handleCancel = useCallback(() => {
    setAmount('');
    setReference('');
    setError('');
    onClose();
  }, [onClose]);

  // Reset fields when modal closes
  useEffect(() => {
    if (!isOpen) {
      setAmount('');
      setReference('');
      setError('');
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape' && isOpen) onClose(); };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="am-modal-overlay" onClick={handleCancel} role="dialog" aria-modal="true" aria-labelledby="add-funds-title">
      <div className="am-modal" onClick={(e) => e.stopPropagation()}>
        <h3 id="add-funds-title">Add Funds</h3>
        <p className="am-modal-sub">Top up TruBalance for this client's wallet.</p>

        <div className="am-modal-info">
          <div><b>Client:</b> {clientName} ({clientId})</div>
          <div><b>Current TruBalance:</b> {fmt(currentBalance)}</div>
        </div>

        <label htmlFor="amount-input">Enter Amount</label>
        <input
          id="amount-input"
          type="text"
          value={amount}
          onChange={handleAmountChange}
          placeholder="₹ 0.00"
          inputMode="decimal"
          className={error ? 'am-input-error' : ''}
          aria-describedby="amount-error"
        />
        {error && <div id="amount-error" className="am-error-text">{error}</div>}

        <label htmlFor="reference-input" style={{ marginTop: '12px' }}>
          Reference / Remarks <span style={{ color: '#66777a', fontWeight: '400' }}>(optional)</span>
        </label>
        <textarea
          id="reference-input"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          placeholder="e.g. NEFT ref TRV20260812001"
          aria-label="Reference or remarks"
        />

        <div className="am-modal-actions">
          <button className="am-btn-cancel" onClick={handleCancel} type="button">Cancel</button>
          <button className="am-btn-primary" onClick={handleSubmit} type="button">Add Funds</button>
        </div>
      </div>
    </div>
  );
};

export default AddFundsModal;