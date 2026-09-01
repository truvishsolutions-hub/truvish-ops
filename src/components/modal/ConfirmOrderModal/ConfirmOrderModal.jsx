import React, { useEffect, useCallback } from 'react';
import './ConfirmOrderModal.css';

const fmt = (value) =>
  '₹' + Number(value).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const intFmt = (value) => Number(value).toLocaleString('en-IN');

const ConfirmOrderModal = ({
  isOpen = false,
  onClose,
  onConfirm,
  clientName = 'ABC Pvt Ltd',
  clientId = 'CLT10234',
  theme = '🎁 Birthday',
  totalQty = 0,
  rewardValue = 0,
  fee = 0,
  totalValue = 0,
}) => {
  const handleConfirm = useCallback(() => onConfirm(), [onConfirm]);
  const handleCancel = useCallback(() => onClose(), [onClose]);

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape' && isOpen) onClose(); };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="com-modal-overlay" onClick={handleCancel} role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <div className="com-modal" onClick={(e) => e.stopPropagation()}>
        <h3 id="confirm-title">Generate &amp; Download Codes?</h3>
        <p className="com-modal-sub">Please verify all order details. Once downloaded, codes cannot be edited.</p>

        <div className="com-modal-info">
          <div><b>Client:</b> {clientName} ({clientId})</div>
          <div><b>Theme:</b> {theme}</div>
        </div>

        <div className="com-summary-box">
          <div className="com-summary-row"><span>Total Codes</span><b>{intFmt(totalQty)}</b></div>
          <div className="com-summary-row"><span>Reward Value</span><b>{fmt(rewardValue)}</b></div>
          <div className="com-summary-row"><span>Service Fee</span><b>{fmt(fee)}</b></div>
          <div className="com-summary-row com-summary-total"><span>Total Order Value</span><b>{fmt(totalValue)}</b></div>
        </div>

        <div className="com-modal-actions">
          <button className="com-btn-cancel" onClick={handleCancel} type="button">Cancel</button>
          <button className="com-btn-primary" onClick={handleConfirm} type="button">Generate &amp; Download</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmOrderModal;