import React, { useEffect, useState } from "react";
import "./CreatedRewardCodes.css";

const CreatedRewardCodes = ({
    rows: parentRows,
    onRowsChange,
}) => {

    /* =====================================================
       ROWS
    ===================================================== */

    const [rows, setRows] = useState(
        parentRows?.length
            ? parentRows
            : [
                {
                    id: 1,
                    denom: 500,
                    qty: 100,
                },
                {
                    id: 2,
                    denom: 1000,
                    qty: 50,
                },
                {
                    id: 3,
                    denom: 2000,
                    qty: 25,
                },
            ]
    );


    /* =====================================================
       SYNC FROM PARENT
    ===================================================== */

    useEffect(() => {

        if (Array.isArray(parentRows)) {
            setRows(parentRows);
        }

    }, [parentRows]);


    /* =====================================================
       UPDATE ROWS
    ===================================================== */

    const updateRows = (newRows) => {

        setRows(newRows);

        if (onRowsChange) {
            onRowsChange(newRows);
        }

    };


    /* =====================================================
       INPUT CHANGE
    ===================================================== */

    const handleInputChange = (
        id,
        field,
        value
    ) => {

        let num = Number(value);

        if (!Number.isFinite(num) || num < 0) {
            num = 0;
        }

        if (field === "qty") {
            num = Math.floor(num);
        }

        const newRows = rows.map((row) =>
            row.id === id
                ? {
                    ...row,
                    [field]: num,
                }
                : row
        );

        updateRows(newRows);

    };


    /* =====================================================
       ADD ROW
    ===================================================== */

    const handleAddRow = () => {

        const maxId =
            rows.reduce(
                (max, row) =>
                    Math.max(
                        max,
                        Number(row.id) || 0
                    ),
                0
            );

        const newRow = {
            id: maxId + 1,
            denom: 100,
            qty: 10,
        };

        updateRows([
            ...rows,
            newRow,
        ]);

    };


    /* =====================================================
       DELETE ROW
    ===================================================== */

    const handleDeleteRow = (id) => {

        if (rows.length <= 1) {
            return;
        }

        const newRows =
            rows.filter(
                (row) => row.id !== id
            );

        updateRows(newRows);

    };


    /* =====================================================
       TOTALS
    ===================================================== */

    const totals = rows.reduce(
        (acc, row) => {

            const denom =
                Number(row.denom) || 0;

            const qty =
                Number(row.qty) || 0;

            const value =
                denom * qty;

            return {
                denoms:
                    acc.denoms + 1,

                qty:
                    acc.qty + qty,

                reward:
                    acc.reward + value,
            };

        },
        {
            denoms: 0,
            qty: 0,
            reward: 0,
        }
    );


    /* =====================================================
       FORMAT CURRENCY
    ===================================================== */

    const formatCurrency = (value) => {

        return (
            "₹" +
            Number(value || 0).toLocaleString(
                "en-IN",
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }
            )
        );

    };


    /* =====================================================
       FORMAT INTEGER
    ===================================================== */

    const formatInteger = (value) => {

        return Number(
            value || 0
        ).toLocaleString("en-IN");

    };


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <div className="crc-card">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="crc-card-head">

                <div className="crc-num-circle">
                    2
                </div>


                <div className="crc-titles">

                    <h2>
                        Denomination &amp; Quantity
                    </h2>

                    <p>
                        Add multiple denominations and quantities
                    </p>

                </div>


                <span className="crc-hint">
                    ( Add multiple denominations and quantities )
                </span>

            </div>


            {/* =================================================
                TABLE
            ================================================= */}

            <div className="crc-table-wrap">

                <table className="crc-denom">

                    <thead>

                        <tr>

                            <th style={{ width: "36px" }}>
                                #
                            </th>

                            <th>
                                Denomination (₹)
                            </th>

                            <th>
                                Quantity (Nos)
                            </th>

                            <th>
                                Total Value (₹)
                            </th>

                            <th
                                style={{
                                    textAlign: "center",
                                    width: "60px",
                                }}
                            >
                                Action
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {rows.map(
                            (row, index) => {

                                const total =
                                    (Number(row.denom) || 0) *
                                    (Number(row.qty) || 0);

                                return (

                                    <tr key={row.id}>

                                        <td>
                                            {index + 1}
                                        </td>


                                        <td className="crc-denom-amount">

                                            <input
                                                type="number"
                                                min="0"
                                                step="1"
                                                value={
                                                    row.denom ?? ""
                                                }
                                                onChange={(event) =>
                                                    handleInputChange(
                                                        row.id,
                                                        "denom",
                                                        event.target.value
                                                    )
                                                }
                                            />

                                        </td>


                                        <td className="crc-denom-qty">

                                            <input
                                                type="number"
                                                min="0"
                                                step="1"
                                                value={
                                                    row.qty ?? ""
                                                }
                                                onChange={(event) =>
                                                    handleInputChange(
                                                        row.id,
                                                        "qty",
                                                        event.target.value
                                                    )
                                                }
                                            />

                                        </td>


                                        <td className="crc-total-cell">

                                            {formatCurrency(
                                                total
                                            )}

                                        </td>


                                        <td
                                            style={{
                                                textAlign: "center",
                                            }}
                                        >

                                            <button
                                                type="button"
                                                className="crc-del-btn"
                                                onClick={() =>
                                                    handleDeleteRow(
                                                        row.id
                                                    )
                                                }
                                                disabled={
                                                    rows.length <= 1
                                                }
                                                title="Remove"
                                            >

                                                <svg
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                >

                                                    <polyline points="3 6 5 6 21 6" />

                                                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />

                                                    <path d="M10 11v6" />

                                                    <path d="M14 11v6" />

                                                </svg>

                                            </button>

                                        </td>

                                    </tr>

                                );

                            }
                        )}

                    </tbody>

                </table>


                {/* =================================================
                    ADD
                ================================================= */}

                <button
                    type="button"
                    className="crc-add-denom"
                    onClick={handleAddRow}
                >

                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                    >

                        <line
                            x1="12"
                            y1="5"
                            x2="12"
                            y2="19"
                        />

                        <line
                            x1="5"
                            y1="12"
                            x2="19"
                            y2="12"
                        />

                    </svg>

                    Add Another Denomination

                </button>

            </div>


            {/* =================================================
                TOTALS
            ================================================= */}

            <div className="crc-totals-row">

                <span>
                    Total Denominations:
                    <b>
                        {totals.denoms}
                    </b>
                </span>


                <span>
                    Total Quantity:
                    <b>
                        {formatInteger(
                            totals.qty
                        )}
                    </b>
                </span>


                <span className="crc-grand">

                    Total Reward Value (₹):

                    <b>
                        {formatCurrency(
                            totals.reward
                        )}
                    </b>

                </span>

            </div>

        </div>

    );

};

export default CreatedRewardCodes;