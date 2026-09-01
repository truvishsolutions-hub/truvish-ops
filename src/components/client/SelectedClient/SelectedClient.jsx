import "./SelectedClient.css";
import { useState } from "react";

import {
    HiOutlineEye,
    HiOutlineEyeSlash,
    HiOutlinePlus,
    HiOutlineChevronRight,
} from "react-icons/hi2";

import AddFundsModal from "../../modal/AddFundsModal/AddFundsModal.jsx";


const SelectedClient = ({
    client,
    onViewDetails,
    onAddFunds,
}) => {

    /* =========================================================
       SAFE CLIENT
    ========================================================= */

    const safeClient =
        client || {};


    /* =========================================================
       BALANCE VISIBILITY
    ========================================================= */

    const [showBalance, setShowBalance] =
        useState(true);


    /* =========================================================
       ADD FUNDS MODAL
    ========================================================= */

    const [isAddFundsOpen, setIsAddFundsOpen] =
        useState(false);


    /* =========================================================
       CLIENT DATA
    ========================================================= */

    const companyName =
        safeClient.companyName ||
        safeClient.company_name ||
        safeClient.clientName ||
        safeClient.client_name ||
        "No Client Selected";


    const clientId =
        safeClient.clientId ||
        safeClient.client_id ||
        safeClient.id ||
        "-";


    const gst =
        safeClient.gst ||
        safeClient.gstNumber ||
        safeClient.gst_number ||
        "—";


    const pan =
        safeClient.pan ||
        safeClient.panNumber ||
        safeClient.pan_number ||
        "—";


    const contact =
        safeClient.contact ||
        safeClient.mobileNumber ||
        safeClient.mobile_number ||
        safeClient.mobile ||
        "—";


    const active =
        safeClient.active ??
        safeClient.isActive ??
        safeClient.activeStatus ??
        true;


    const balance = Number(
        safeClient.truBalance ??
        safeClient.tru_balance ??
        safeClient.walletBalance ??
        safeClient.balance ??
        0
    );


    /* =========================================================
       FORMAT BALANCE
    ========================================================= */

    const formatBalance = (value) =>
        `₹${Number(value).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }
        )}`;


    /* =========================================================
       OPEN ADD FUNDS
    ========================================================= */

    const handleOpenAddFunds = () => {

        if (!safeClient.id &&
            !safeClient.clientId &&
            !safeClient.client_id) {

            alert(
                "Please select a client first."
            );

            return;
        }

        setIsAddFundsOpen(true);
    };


    /* =========================================================
       CLOSE ADD FUNDS
    ========================================================= */

    const handleCloseAddFunds = () => {

        setIsAddFundsOpen(false);

    };


    /* =========================================================
       CONFIRM ADD FUNDS
    ========================================================= */

    const handleConfirmAddFunds = (
        amount,
        reference
    ) => {

        onAddFunds?.(
            safeClient,
            amount,
            reference
        );

        setIsAddFundsOpen(false);

    };


    return (
        <>
            {/* =====================================================
                SELECTED CLIENT CARD
            ===================================================== */}

            <section className="selected-client">

                {/* =================================================
                    LEFT
                ================================================= */}

                <div className="selected-client-left">

                    <span className="selected-client-label">
                        Selected Client
                    </span>


                    {/* =================================================
                        COMPANY NAME
                    ================================================= */}

                    <div className="selected-client-name-row">

                        <div className="selected-client-name">

                            <span className="selected-client-company">
                                {companyName}
                            </span>

                            <span className="selected-client-id">
                                ({clientId})
                            </span>

                        </div>


                        {/* STATUS */}

                        <span
                            className={`selected-client-status ${
                                active
                                    ? ""
                                    : "inactive"
                            }`}
                        >
                            {active
                                ? "Active"
                                : "Inactive"}
                        </span>

                    </div>


                    {/* =================================================
                        CLIENT META
                    ================================================= */}

                    <div className="selected-client-meta">

                        <span>
                            <b>GST:</b>{" "}
                            {gst}
                        </span>

                        <span>
                            <b>PAN:</b>{" "}
                            {pan}
                        </span>

                        <span>
                            <b>Contact:</b>{" "}
                            {contact}
                        </span>

                    </div>


                    {/* =================================================
                        VIEW DETAILS
                    ================================================= */}

                    <button
                        type="button"
                        className="selected-client-details-btn"
                        onClick={() =>
                            onViewDetails?.(
                                safeClient
                            )
                        }
                    >

                        View Client Details

                        <HiOutlineChevronRight />

                    </button>

                </div>


                {/* =====================================================
                    BALANCE
                ===================================================== */}

                <div className="selected-client-balance">

                    <span className="selected-client-balance-label">
                        TruBalance (Client Wallet)
                    </span>


                    <div className="selected-client-balance-amount">

                        <span>
                            {showBalance
                                ? formatBalance(
                                    balance
                                )
                                : "••••••"}
                        </span>


                        <button
                            type="button"
                            className="selected-client-eye"
                            onClick={() =>
                                setShowBalance(
                                    (prev) =>
                                        !prev
                                )
                            }
                            aria-label={
                                showBalance
                                    ? "Hide balance"
                                    : "Show balance"
                            }
                        >

                            {showBalance ? (
                                <HiOutlineEye />
                            ) : (
                                <HiOutlineEyeSlash />
                            )}

                        </button>

                    </div>


                    <span className="selected-client-balance-sub">
                        Available Balance
                    </span>

                </div>


                {/* =====================================================
                    ADD FUNDS
                ===================================================== */}

                <button
                    type="button"
                    className="selected-client-add-funds"
                    onClick={
                        handleOpenAddFunds
                    }
                >

                    <HiOutlinePlus />

                    Add Funds

                </button>

            </section>


            {/* =====================================================
                ADD FUNDS MODAL
            ===================================================== */}

            <AddFundsModal
                isOpen={
                    isAddFundsOpen
                }

                onClose={
                    handleCloseAddFunds
                }

                onConfirm={
                    handleConfirmAddFunds
                }

                clientName={
                    companyName
                }

                clientId={
                    clientId
                }

                currentBalance={
                    balance
                }

            />

        </>
    );
};


export default SelectedClient;