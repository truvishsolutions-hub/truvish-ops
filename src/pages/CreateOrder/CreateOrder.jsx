import React, { useEffect, useState } from "react";

import Navbar from "../../components/layout/Navbar/Navbar.jsx";
import SelectedClient from "../../components/client/SelectedClient/SelectedClient.jsx";
import PageHeader from "../../components/reward-codes/PageHeader/PageHeader.jsx";
import OrderStepper from "../../components/reward-codes/OrderStepper/OrderStepper.jsx";
import CreatedRewardCodes from "../../components/reward-codes/CreatedRewardCodes/CreatedRewardCodes.jsx";
import Validity from "../../components/reward-codes/Validity/Validity.jsx";
import ServiceFee from "../../components/reward-codes/ServiceFee/ServiceFee.jsx";
import Theme from "../../components/reward-codes/Theme/Theme.jsx";
import OrderSummary from "../../components/reward-codes/OrderSummary/OrderSummary.jsx";
import ConfirmOrderModal from "../../components/modal/ConfirmOrderModal/ConfirmOrderModal.jsx";

import "./CreateOrder.css";

// ─── Helpers ────────────────────────────────────────────────

const parseValidityToMonths = (validityStr) => {
    if (!validityStr) return 3;
    const lower = validityStr.toLowerCase();
    if (lower.includes('year')) return 12;
    if (lower.includes('month')) {
        const num = parseInt(lower);
        return isNaN(num) ? 3 : num;
    }
    const days = parseInt(lower);
    if (!isNaN(days)) {
        return Math.round(days / 30);
    }
    return 3;
};

const downloadCSV = (codes) => {
    if (!codes || codes.length === 0) return;
    let csv = "Code,Denomination (₹),Validity (Months),Theme,Issued Date\n";
    codes.forEach(code => {
        const date = code.truvishCodeTimestamp
            ? new Date(code.truvishCodeTimestamp).toLocaleDateString('en-IN')
            : '';
        csv += `${code.truvishIdCodeNumber},${code.originalCodeValue},${code.validity},${code.clientTheme || ''},${date}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `vouchers_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
};

// ─── Main Component ─────────────────────────────────────────

const CreateOrder = () => {

    // ─── CLIENTS ────────────────────────────────────────────
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [searchValue, setSearchValue] = useState("");

    // ─── THEME ──────────────────────────────────────────────
    const [theme, setTheme] = useState(null);

    // ─── REWARD CODE ROWS ──────────────────────────────────
    const [rows, setRows] = useState([
        { id: 1, denom: 0, qty: 0 },
        { id: 2, denom: 0, qty: 0 },
        { id: 3, denom: 0, qty: 0 },
    ]);

    // ─── ORDER SETTINGS ─────────────────────────────────────
    const [feePercent, setFeePercent] = useState(10);
    const [validity, setValidity] = useState("90 Days");

    // ─── BALANCE ────────────────────────────────────────────
    // ✅ Hardcoded 425000 HATAYA – ab 0 se start
    const [balance, setBalance] = useState(0);

    // ─── MODALS ─────────────────────────────────────────────
    const [showConfirm, setShowConfirm] = useState(false);

    // ─── TOAST ──────────────────────────────────────────────
    const [toast, setToast] = useState({
        visible: false,
        message: "",
        type: "success",
    });

    const showToast = (message, type = "success") => {
        setToast({ visible: true, message, type });
        setTimeout(() => setToast({ visible: false, message: "", type: "success" }), 4000);
    };

    // ─── LOAD CLIENTS ───────────────────────────────────────
    useEffect(() => {
        const loadClients = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch("http:api.truvish.com/api/clients", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                });

                if (!response.ok) {
                    throw new Error(`Failed to load clients: ${response.status}`);
                }

                const data = await response.json();
                if (Array.isArray(data)) setClients(data);
                else if (Array.isArray(data.content)) setClients(data.content);
                else if (Array.isArray(data.clients)) setClients(data.clients);
                else if (Array.isArray(data.data)) setClients(data.data);
                else setClients([]);

            } catch (error) {
                console.error("Client loading error:", error);
                setClients([]);
            }
        };
        loadClients();
    }, []);

    // ─── REFRESH CLIENT ─────────────────────────────────────
    const refreshClient = async (clientId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://api.truvish.com/api/clients/${clientId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to refresh client: ${response.status}`);
            }

            const updatedClient = await response.json();
            setSelectedClient(updatedClient);

            // ✅ Balance directly from updated client
            const newBalance = Number(updatedClient?.balance ?? 0);
            setBalance(Number.isFinite(newBalance) ? newBalance : 0);

        } catch (error) {
            console.error("Refresh client error:", error);
            showToast("Failed to refresh client balance", "error");
        }
    };

    // ─── ADD FUNDS ──────────────────────────────────────────
    const handleAddFunds = async (client, amount, reference) => {
        const clientId = client?.id || client?.clientId;
        if (!clientId) {
            showToast("No client selected", "error");
            return;
        }

        const numAmount = Number(amount);
        if (!numAmount || numAmount <= 0) {
            showToast("Please enter a valid amount", "error");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const payload = {
                amount: numAmount,
                type: "CREDIT",
                description: "Tru balance Cr.",
                referenceType: "MANUAL",
                referenceId: `MANUAL-${Date.now()}`,
            };

            const response = await fetch(`http://api.truvish.com/api/wallet/${clientId}/transactions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Server error: ${response.status}`);
            }

            await refreshClient(clientId);
            showToast(`✅ Tru balance Cr. ₹${numAmount}`, "success");

        } catch (error) {
            console.error("Add funds error:", error);
            showToast(error.message || "Failed to add funds", "error");
        }
    };

    // ─── SELECT CLIENT ──────────────────────────────────────
    const handleClientSelect = (client) => {
        setSelectedClient(client);
        setSearchValue("");
        setTheme(null);
    };

    // ─── UPDATE BALANCE ON CLIENT CHANGE ────────────────────
    useEffect(() => {
        if (!selectedClient) {
            setBalance(0);
            return;
        }

        const clientBalance = Number(
            selectedClient?.balance ??
            selectedClient?.truBalance ??
            selectedClient?.walletBalance ??
            0
        );
        setBalance(Number.isFinite(clientBalance) ? clientBalance : 0);
    }, [selectedClient]);

    // ─── ROW CHANGE ─────────────────────────────────────────
    const handleRowsChange = (newRows) => {
        setRows(Array.isArray(newRows) ? newRows : []);
    };

    // ─── FEE CHANGE ─────────────────────────────────────────
    const handleFeeChange = (pct) => {
        setFeePercent(Number(pct) || 0);
    };

    // ─── VALIDITY CHANGE ────────────────────────────────────
    const handleValidityChange = (value) => {
        setValidity(value || "");
    };

    // ─── THEME CHANGE ───────────────────────────────────────
    const handleThemeChange = (selectedTheme) => {
        if (!selectedTheme) {
            setTheme(null);
            return;
        }
        setTheme({
            id: selectedTheme.id ?? null,
            name: selectedTheme.name ?? "",
            image: selectedTheme.image ?? "",
            raw: selectedTheme.raw ?? selectedTheme,
        });
    };

    // ─── TOTALS ─────────────────────────────────────────────
    const totals = rows.reduce(
        (acc, row) => {
            const denom = Number(row?.denom) || 0;
            const qty = Number(row?.qty) || 0;
            const value = denom * qty;
            return {
                qty: acc.qty + qty,
                reward: acc.reward + value,
            };
        },
        { qty: 0, reward: 0 }
    );

    const fee = totals.reward * (Number(feePercent) / 100);
    const totalValue = totals.reward + fee;

    // ─── CONFIRM DOWNLOAD (API + CSV) ──────────────────────
    const handleConfirmDownload = async () => {
        setShowConfirm(false);

        const clientId = selectedClient?.id || selectedClient?.clientId;
        if (!clientId) {
            showToast("Client ID not found", "error");
            return;
        }

        const payload = {
            clientId: clientId,
            themeName: theme?.name || "",
            themeImg: theme?.image || "",
            validityMonths: parseValidityToMonths(validity),
            items: rows
                .filter(row => Number(row.denom) > 0 && Number(row.qty) > 0)
                .map(row => ({
                    denomination: Number(row.denom),
                    quantity: Number(row.qty)
                }))
        };

        if (payload.items.length === 0) {
            showToast("Please add at least one valid denomination and quantity.", "error");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://api.truvish.com/api/truvish/generate-order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || errorData.message || "Failed to generate codes");
            }

            const generatedCodes = await response.json();

            // ✅ Refresh client balance
            await refreshClient(clientId);

            // ✅ Download CSV
            downloadCSV(generatedCodes);

            showToast(`✅ ${generatedCodes.length} codes generated & downloaded!`, "success");

        } catch (error) {
            console.error("Generate order error:", error);
            showToast(error.message || "Failed to generate codes", "error");
        }
    };

    // ─── OPEN CONFIRM MODAL ─────────────────────────────────
    const openConfirmModal = () => {
        if (!selectedClient) {
            alert("Please select a client first.");
            return;
        }
        if (!rows.length) {
            alert("Please add at least one denomination.");
            return;
        }
        if (totals.qty <= 0) {
            alert("Please enter a valid quantity.");
            return;
        }
        if (totals.reward <= 0) {
            alert("Please enter a valid denomination.");
            return;
        }
        if (!theme?.name) {
            alert("Please select a theme.");
            return;
        }
        if (!theme?.image) {
            alert("Selected theme does not have an image.");
            return;
        }
        setShowConfirm(true);
    };

    // ─── CLIENT NAME & ID ──────────────────────────────────
    const clientName =
        selectedClient?.companyName ||
        selectedClient?.company_name ||
        selectedClient?.clientName ||
        selectedClient?.client_name ||
        "Select Client";

    const clientId =
        selectedClient?.clientId ||
        selectedClient?.client_id ||
        selectedClient?.id ||
        "-";

    const themeName = theme?.name || "";

    // ─── RENDER ─────────────────────────────────────────────
    return (
        <div className="create-order">

            <Navbar
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                clients={clients}
                selectedClient={selectedClient}
                onClientSelect={handleClientSelect}
            />

            <SelectedClient
                client={selectedClient || {}}
                onViewDetails={(client) => console.log("VIEW CLIENT:", client)}
                onAddFunds={handleAddFunds}
            />

            <PageHeader />
            <OrderStepper />

            <div className="reward-order-layout">

                <section className="reward-order-left">
                    <CreatedRewardCodes
                        rows={rows}
                        onRowsChange={handleRowsChange}
                    />
                    <div className="trio">
                        <Validity
                            value={validity}
                            onChange={handleValidityChange}
                        />
                        <ServiceFee
                            value={feePercent}
                            onChange={handleFeeChange}
                            rewardValue={totals.reward}
                        />
                        <Theme
                            value={theme}
                            onChange={handleThemeChange}
                        />
                    </div>
                </section>

                <aside className="reward-order-right">
                    <OrderSummary
                        rows={rows}
                        feePercent={feePercent}
                        validity={validity}
                        theme={theme}
                        themeName={themeName}
                        balance={balance}             // ✅ Dynamic balance from client
                        onDownloadClick={openConfirmModal}
                    />
                </aside>

            </div>

            <div className="footer-note">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <span>Please review all details before downloading codes. Once downloaded, codes cannot be edited.</span>
            </div>

            <ConfirmOrderModal
                isOpen={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={handleConfirmDownload}
                clientName={clientName}
                clientId={clientId}
                theme={themeName}
                totalQty={totals.qty}
                rewardValue={totals.reward}
                fee={fee}
                totalValue={totalValue}
            />

            {toast.visible && (
                <div
                    style={{
                        position: "fixed",
                        bottom: "24px",
                        right: "24px",
                        padding: "14px 22px",
                        borderRadius: "10px",
                        backgroundColor: toast.type === "success" ? "#11b6a3" : "#e45b5b",
                        color: "#fff",
                        fontWeight: "600",
                        fontSize: "14px",
                        boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                        zIndex: 9999,
                        maxWidth: "400px",
                        animation: "fadeIn 0.3s ease",
                    }}
                >
                    {toast.message}
                </div>
            )}

        </div>
    );
};

export default CreateOrder;