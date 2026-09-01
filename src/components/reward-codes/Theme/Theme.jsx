import React, { useEffect, useState } from "react";
import "./Theme.css";

const API_BASE_URL = "http://api.truvish.com";

const Theme = ({ value = null, onChange }) => {

    /* =====================================================
       STATE
    ===================================================== */

    const [themes, setThemes] = useState([]);
    const [selectedTheme, setSelectedTheme] = useState(
        value?.id || ""
    );

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    /* =====================================================
       LOAD THEMES FROM ADMIN CONFIG

       /api/admin/config hi source hai.

       Response:
       img1     + img1Name
       img2     + img2Name
       img3     + img3Name
       img4     + img4Name
       ...
    ===================================================== */

    useEffect(() => {

        const loadThemes = async () => {

            try {

                setLoading(true);
                setError("");

                const token =
                    localStorage.getItem("token");


                const response = await fetch(
                    `${API_BASE_URL}/api/admin/config`,
                    {
                        method: "GET",

                        headers: {
                            "Content-Type":
                                "application/json",

                            ...(token
                                ? {
                                    Authorization:
                                        `Bearer ${token}`,
                                }
                                : {}),
                        },
                    }
                );


                if (!response.ok) {

                    throw new Error(
                        `Failed to load admin config: ${response.status}`
                    );

                }


                const config =
                    await response.json();


                console.log(
                    "ADMIN CONFIG RESPONSE:",
                    config
                );


                /* =================================================
                   BUILD THEMES

                   img1/img1Name
                   img2/img2Name
                   img3/img3Name
                   img4/img4Name

                   img6...19 bhi future me automatically support
                   honge.
                ================================================= */

                const themeList = [];

                const imageSlots = [
                    1,
                    2,
                    3,
                    4,
                    6,
                    7,
                    8,
                    9,
                    11,
                    12,
                    13,
                    14,
                    16,
                    17,
                    18,
                    19,
                ];


                imageSlots.forEach((slot) => {

                    const image =
                        config[`img${slot}`];

                    const name =
                        config[`img${slot}Name`];


                    /*
                     * Theme tabhi add hoga jab:
                     *
                     * image available ho
                     * AND
                     * name available ho
                     */

                    if (
                        image &&
                        String(image).trim() !== "" &&
                        name &&
                        String(name).trim() !== ""
                    ) {

                        themeList.push({

                            id: String(slot),

                            name:
                                String(name).trim(),

                            image:
                                image,

                            raw: {
                                slot,
                                image,
                                name,
                            },

                        });

                    }

                });


                console.log(
                    "LOADED THEMES:",
                    themeList
                );


                setThemes(themeList);


                /*
                 * Agar parent me already theme selected hai,
                 * usko dropdown me maintain karo.
                 */

                if (value?.id) {

                    const existingTheme =
                        themeList.find(
                            (item) =>
                                String(item.id) ===
                                String(value.id)
                        );


                    if (existingTheme) {

                        setSelectedTheme(
                            existingTheme.id
                        );

                    }

                }

            } catch (err) {

                console.error(
                    "Theme loading error:",
                    err
                );


                setThemes([]);

                setError(
                    err?.message ||
                    "Unable to load themes"
                );

            } finally {

                setLoading(false);

            }

        };


        loadThemes();

    }, []);


    /* =====================================================
       UPDATE DROPDOWN WHEN PARENT VALUE CHANGES
    ===================================================== */

    useEffect(() => {

        if (!value) {

            setSelectedTheme("");

            return;

        }


        if (value.id) {

            setSelectedTheme(
                String(value.id)
            );

        }

    }, [value]);


    /* =====================================================
       THEME CHANGE
    ===================================================== */

    const handleThemeChange = (event) => {

        const selectedId =
            event.target.value;


        setSelectedTheme(
            selectedId
        );


        if (!selectedId) {

            if (onChange) {
                onChange(null);
            }

            return;

        }


        const selected =
            themes.find(
                (theme) =>
                    String(theme.id) ===
                    String(selectedId)
            );


        if (!selected) {

            console.warn(
                "Selected theme not found:",
                selectedId
            );

            return;

        }


        console.log(
            "SELECTED THEME:",
            selected
        );


        /*
         * Parent CreateOrder ko complete object milega:
         *
         * {
         *   id,
         *   name,
         *   image,
         *   raw
         * }
         */

        if (onChange) {

            onChange({

                id:
                    selected.id,

                name:
                    selected.name,

                image:
                    selected.image,

                raw:
                    selected.raw,

            });

        }

    };


    /* =====================================================
       IMAGE URL
    ===================================================== */

    const getImageUrl = (image) => {

        if (!image) {
            return "";
        }


        /*
         * Agar already complete URL hai
         */

        if (
            image.startsWith("http://") ||
            image.startsWith("https://")
        ) {

            return image;

        }


        /*
         * Backend relative path:
         *
         * /uploads/abc.jpeg
         */

        if (image.startsWith("/")) {

            return `${API_BASE_URL}${image}`;

        }


        return `${API_BASE_URL}/${image}`;

    };


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <div className="t-mini-card">

            {/* =================================================
                HEADER
            ================================================= */}

            <h3>

                <span className="t-num-mini">
                    5
                </span>

                Theme

                <span className="t-req">
                    *
                </span>

            </h3>


            {/* =================================================
                LABEL
            ================================================= */}

            <label>
                Select Theme
            </label>


            {/* =================================================
                LOADING
            ================================================= */}

            {loading && (

                <div className="t-theme-status">

                    Loading themes...

                </div>

            )}


            {/* =================================================
                ERROR
            ================================================= */}

            {!loading && error && (

                <div className="t-theme-status t-theme-error">

                    {error}

                </div>

            )}


            {/* =================================================
                NO THEMES
            ================================================= */}

            {!loading &&
                !error &&
                themes.length === 0 && (

                    <div className="t-theme-status t-theme-error">

                        No themes available.

                    </div>

                )}


            {/* =================================================
                THEME SELECT
            ================================================= */}

            {!loading &&
                !error &&
                themes.length > 0 && (

                    <select
                        value={selectedTheme}
                        onChange={
                            handleThemeChange
                        }
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


            {/* =================================================
                SELECTED THEME PREVIEW
            ================================================= */}

            {!loading &&
                selectedTheme &&
                themes.length > 0 && (

                    (() => {

                        const selected =
                            themes.find(
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
                                    src={
                                        getImageUrl(
                                            selected.image
                                        )
                                    }

                                    alt={
                                        selected.name
                                    }

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

                    })()

                )}


            {/* =================================================
                INFO
            ================================================= */}

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