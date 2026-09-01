import React, { useEffect, useState } from "react";
import "./Theme.css";

// ─── API Base URL ────────────────────────────────────────────
// Production API must always use HTTPS.
const API_BASE = (
    import.meta.env.VITE_API_BASE || "https://api.truvish.com"
).replace(/\/+$/, "");

const Theme = ({ value = null, onChange }) => {

    const [themes, setThemes] = useState([]);
    const [selectedTheme, setSelectedTheme] = useState(value?.id || "");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadThemes = async () => {
            try {
                setLoading(true);
                setError("");

                const token = localStorage.getItem("token");

                const response = await fetch(`${API_BASE}/api/admin/config`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        ...(token
                            ? { Authorization: `Bearer ${token}` }
                            : {}),
                    },
                });

                if (!response.ok) {
                    throw new Error(
                        `Failed to load admin config: ${response.status}`
                    );
                }

                const config = await response.json();

                const themeList = [];

                const imageSlots = [
                    1, 2, 3, 4,
                    6, 7, 8, 9,
                    11, 12, 13, 14,
                    16, 17, 18, 19
                ];

                imageSlots.forEach((slot) => {
                    const image = config[`img${slot}`];
                    const name = config[`img${slot}Name`];

                    if (
                        image &&
                        String(image).trim() !== "" &&
                        name &&
                        String(name).trim() !== ""
                    ) {
                        themeList.push({
                            id: String(slot),
                            name: String(name).trim(),
                            image: image,
                            raw: {
                                slot,
                                image,
                                name,
                            },
                        });
                    }
                });

                setThemes(themeList);

                if (value?.id) {
                    const existingTheme = themeList.find(
                        (item) =>
                            String(item.id) === String(value.id)
                    );

                    if (existingTheme) {
                        setSelectedTheme(existingTheme.id);
                    }
                }

            } catch (err) {
                console.error("Theme loading error:", err);

                setThemes([]);
                setError(
                    err?.message || "Unable to load themes"
                );

            } finally {
                setLoading(false);
            }
        };

        loadThemes();
    }, []);

    useEffect(() => {
        if (!value) {
            setSelectedTheme("");
            return;
        }

        if (value.id) {
            setSelectedTheme(String(value.id));
        }
    }, [value]);

    const handleThemeChange = (event) => {
        const selectedId = event.target.value;

        setSelectedTheme(selectedId);

        if (!selectedId) {
            if (onChange) {
                onChange(null);
            }
            return;
        }

        const selected = themes.find(
            (theme) =>
                String(theme.id) === String(selectedId)
        );

        if (!selected) {
            console.warn(
                "Selected theme not found:",
                selectedId
            );
            return;
        }

        if (onChange) {
            onChange({
                id: selected.id,
                name: selected.name,
                image: selected.image,
                raw: selected.raw,
            });
        }
    };

    const getImageUrl = (image) => {
        if (!image) {
            return "";
        }

        const imageString = String(image).trim();

        // Already an absolute URL
        if (
            imageString.startsWith("http://") ||
            imageString.startsWith("https://")
        ) {
            return imageString;
        }

        // Relative path
        if (imageString.startsWith("/")) {
            return `${API_BASE}${imageString}`;
        }

        return `${API_BASE}/${imageString}`;
    };

    return (
        <div className="t-mini-card">

            <h3>
                <span className="t-num-mini">5</span>
                Theme
                <span className="t-req">*</span>
            </h3>

            <label>Select Theme</label>

            {loading && (
                <div className="t-theme-status">
                    Loading themes...
                </div>
            )}

            {!loading && error && (
                <div className="t-theme-status t-theme-error">
                    {error}
                </div>
            )}

            {!loading &&
                !error &&
                themes.length === 0 && (
                    <div className="t-theme-status t-theme-error">
                        No themes available.
                    </div>
                )}

            {!loading &&
                !error &&
                themes.length > 0 && (
                    <select
                        value={selectedTheme}
                        onChange={handleThemeChange}
                    >
                        <option value="">
                            Select Theme
                        </option>

                        {themes.map((theme) => (
                            <option
                                key={theme.id}
                                value={theme.id}
                            >
                                {theme.name}
                            </option>
                        ))}
                    </select>
                )}

            {!loading &&
                selectedTheme &&
                themes.length > 0 &&
                (() => {
                    const selected = themes.find(
                        (item) =>
                            String(item.id) ===
                            String(selectedTheme)
                    );

                    if (!selected) {
                        return null;
                    }

                    return (
                        <div className="t-theme-preview">

                            <img
                                src={getImageUrl(
                                    selected.image
                                )}
                                alt={selected.name}
                                onError={(e) => {
                                    console.warn(
                                        "Theme image failed:",
                                        selected.image
                                    );

                                    e.currentTarget.style.display =
                                        "none";
                                }}
                            />

                            <div className="t-theme-preview-text">
                                <strong>
                                    {selected.name}
                                </strong>

                                <span>
                                    Selected theme
                                </span>
                            </div>

                        </div>
                    );
                })()}

            <div className="t-theme-info">

                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <circle
                        cx="12"
                        cy="12"
                        r="10"
                    />

                    <line
                        x1="12"
                        y1="16"
                        x2="12"
                        y2="12"
                    />

                    <line
                        x1="12"
                        y1="8"
                        x2="12.01"
                        y2="8"
                    />
                </svg>

                <span>
                    Theme will be applied to all codes in this order.
                </span>

            </div>

        </div>
    );
};

export default Theme;
