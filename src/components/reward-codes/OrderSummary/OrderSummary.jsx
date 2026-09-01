import React, { useState, useMemo } from 'react';
import './OrderSummary.css';

const OrderSummary = ({
    rows = [],
    feePercent = 10,
    validity = '90 Days',
    theme = '',
    themeName = '',
    themeImage = '',
    balance = 0,
    onBalanceUpdate = null,
    onDownloadClick = null,
}) => {
    const [balanceHidden, setBalanceHidden] = useState(false);

    // Compute totals
    const totals = useMemo(() => {
        const tQty = rows.reduce((sum, r) => sum + (r.qty || 0), 0);
        const tReward = rows.reduce((sum, r) => sum + (r.denom || 0) * (r.qty || 0), 0);
        const fee = tReward * (feePercent / 100);
        const total = tReward + fee;
        return { tQty, tReward, fee, total, denoms: rows.length };
    }, [rows, feePercent]);

    const balanceAfter = balance - totals.total;
    const isInsufficient = totals.total > balance || totals.tQty === 0 || totals.tReward === 0;

    const fmt = (value) =>
        '₹' + Number(value).toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

    const intFmt = (value) => Number(value).toLocaleString('en-IN');

    const toggleBalance = () => setBalanceHidden((prev) => !prev);

    const handleDownload = () => {
        if (isInsufficient) return;
        if (onDownloadClick) onDownloadClick();
    };

    return (
        <div className="os-summary">
            <h3>Order Summary</h3>

            <div className="os-row">
                <span>Total Denominations</span>
                <b>{totals.denoms}</b>
            </div>
            <div className="os-row">
                <span>Total Codes</span>
                <b>{intFmt(totals.tQty)}</b>
            </div>
            <div className="os-row">
                <span>Reward Value</span>
                <b>{fmt(totals.tReward)}</b>
            </div>

            <div className="os-divider"></div>

            <div className="os-row">
                <span>Service Fee (<span id="osFeePct">{feePercent}</span>%)</span>
                <b>{fmt(totals.fee)}</b>
            </div>

            <div className="os-divider"></div>

            <div className="os-total">
                <span>Total Order Value</span>
                <span className="os-total-val">{fmt(totals.total)}</span>
            </div>

            <div className="os-balance-box">
                <div className="os-balance-row">
                    <span>Current TruBalance</span>
                    <b>{balanceHidden ? '••••••' : fmt(balance)}</b>
                    <button
                        className="os-eye-btn"
                        onClick={toggleBalance}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    >
                        {balanceHidden ? '👁️' : '🙈'}
                    </button>
                </div>
                <div className="os-balance-after">
                    <span>Balance After Order</span>
                    <span>{balanceHidden ? '••••••' : fmt(balanceAfter)}</span>
                </div>
            </div>

            <button
                className="os-btn-primary"
                onClick={handleDownload}
                disabled={isInsufficient}
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download Codes
            </button>

            {isInsufficient && (
                <div className="os-danger-row">
                    {totals.tQty === 0 || totals.tReward === 0
                        ? 'Order Incomplete'
                        : 'Insufficient TruBalance'}
                    <small>
                        {totals.tQty === 0 || totals.tReward === 0
                            ? 'Add at least one denomination with quantity and amount.'
                            : `Current Balance: ${fmt(balance)} · Required: ${fmt(totals.total)} · Shortfall: ${fmt(totals.total - balance)}`}
                    </small>
                </div>
            )}

            <div className="os-warn-row">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <span>Codes once downloaded cannot be edited.</span>
            </div>
        </div>
    );
};

export default OrderSummary;