import "./Navbar.css";

import {
    HiOutlineBars3,
    HiOutlineBell,
    HiOutlineChevronDown,
    HiOutlineMagnifyingGlass,
    HiOutlineXMark,
} from "react-icons/hi2";

import {
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import logo from "../../../assets/logo/TV-BG.png";


const Navbar = ({
    userName = "Ops User",
    userRole = "Operations Team",
    userInitials = "OU",

    /* OPTIONAL EXTERNAL SEARCH */
    searchValue,
    onSearchChange,
    onSearchSubmit,

    onMenuClick,
    onNotificationClick,
    onProfileClick,

    /* CLIENT SEARCH */
    clients = [],
    selectedClient = null,
    onClientSelect,
}) => {

    /* =========================================================
       INTERNAL SEARCH
    ========================================================= */

    const [internalSearch, setInternalSearch] =
        useState("");

    const [showClientResults, setShowClientResults] =
        useState(false);


    const searchWrapperRef =
        useRef(null);


    /* =========================================================
       SEARCH VALUE

       Agar parent se searchValue aa raha hai
       toh usko use karo.

       Agar parent se nahi aa raha,
       toh internalSearch use hoga.
    ========================================================= */

    const isControlled =
        searchValue !== undefined;

    const searchText =
        isControlled
            ? searchValue || ""
            : internalSearch;


    /* =========================================================
       SEARCH CHANGE
    ========================================================= */

    const handleSearchChange = (value) => {

        if (onSearchChange) {
            onSearchChange(value);
        }

        if (!isControlled) {
            setInternalSearch(value);
        }

        setShowClientResults(true);
    };


    /* =========================================================
       FILTER CLIENTS
    ========================================================= */

    const filteredClients = useMemo(() => {

        const value =
            String(searchText || "")
                .trim()
                .toLowerCase();


        /*
         * Search empty hai
         * toh first 10 clients dikhao.
         */

        if (!value) {
            return clients.slice(0, 10);
        }


        return clients
            .filter((client) => {

                const companyName =
                    client?.companyName ||
                    client?.company_name ||
                    "";

                const clientName =
                    client?.clientName ||
                    client?.client_name ||
                    "";

                const id =
                    client?.clientId ||
                    client?.client_id ||
                    client?.id ||
                    "";

                const mobile =
                    client?.mobileNumber ||
                    client?.mobile_number ||
                    client?.mobile ||
                    "";

                const email =
                    client?.email ||
                    "";

                const gst =
                    client?.gst ||
                    client?.gstNumber ||
                    "";


                return (

                    String(companyName)
                        .toLowerCase()
                        .includes(value)

                    ||

                    String(clientName)
                        .toLowerCase()
                        .includes(value)

                    ||

                    String(id)
                        .toLowerCase()
                        .includes(value)

                    ||

                    String(mobile)
                        .toLowerCase()
                        .includes(value)

                    ||

                    String(email)
                        .toLowerCase()
                        .includes(value)

                    ||

                    String(gst)
                        .toLowerCase()
                        .includes(value)

                );

            })
            .slice(0, 10);

    }, [clients, searchText]);


    /* =========================================================
       COMPANY NAME
    ========================================================= */

    const getCompanyName = (client) => {

        return (

            client?.companyName ||

            client?.company_name ||

            client?.clientName ||

            client?.client_name ||

            "Unknown Client"

        );

    };


    /* =========================================================
       CLIENT ID
    ========================================================= */

    const getClientId = (client) => {

        return (

            client?.clientId ||

            client?.client_id ||

            client?.id ||

            "-"

        );

    };


    /* =========================================================
       MOBILE
    ========================================================= */

    const getMobile = (client) => {

        return (

            client?.mobileNumber ||

            client?.mobile_number ||

            client?.mobile ||

            ""

        );

    };


    /* =========================================================
       SELECT CLIENT
    ========================================================= */

    const handleClientSelect = (client) => {

        if (onClientSelect) {
            onClientSelect(client);
        }


        /*
         * Client select hone ke baad
         * dropdown close.
         */

        setShowClientResults(false);


        /*
         * Search clear.
         */

        if (onSearchChange) {
            onSearchChange("");
        }

        if (!isControlled) {
            setInternalSearch("");
        }

    };


    /* =========================================================
       SEARCH SUBMIT
    ========================================================= */

    const handleSubmit = (event) => {

        event.preventDefault();


        if (onSearchSubmit) {

            onSearchSubmit(
                searchText
            );

        }

    };


    /* =========================================================
       CLEAR SEARCH
    ========================================================= */

    const clearSearch = () => {

        if (onSearchChange) {
            onSearchChange("");
        }


        if (!isControlled) {
            setInternalSearch("");
        }


        /*
         * IMPORTANT:
         * X click ke baad dropdown bhi close hoga.
         */

        setShowClientResults(false);

    };


    /* =========================================================
       OUTSIDE CLICK
    ========================================================= */

    useEffect(() => {

        const handleOutsideClick = (event) => {

            if (
                searchWrapperRef.current &&
                !searchWrapperRef.current.contains(
                    event.target
                )
            ) {

                setShowClientResults(false);

            }

        };


        document.addEventListener(
            "mousedown",
            handleOutsideClick
        );


        return () => {

            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );

        };

    }, []);


    /* =========================================================
       ESC KEY
    ========================================================= */

    useEffect(() => {

        const handleEscape = (event) => {

            if (event.key === "Escape") {

                setShowClientResults(false);

            }

        };


        document.addEventListener(
            "keydown",
            handleEscape
        );


        return () => {

            document.removeEventListener(
                "keydown",
                handleEscape
            );

        };

    }, []);


    /* =========================================================
       RENDER
    ========================================================= */

    return (

        <header className="navbar">


            {/* =================================================
                LEFT SIDE
            ================================================= */}

            <div className="navbar-left">

                <button
                    type="button"
                    className="navbar-menu-btn"
                    onClick={onMenuClick}
                    aria-label="Toggle menu"
                >

                    <HiOutlineBars3 />

                </button>


                <div className="navbar-brand">

                    <img
                        src={logo}
                        alt="TruVish Logo"
                        className="navbar-logo-image"
                    />


                    <span className="navbar-brand-name">
                        TRUVISH Ops
                    </span>

                </div>

            </div>


            {/* =================================================
                CLIENT SEARCH
            ================================================= */}

            <div
                className="navbar-search-wrapper"
                ref={searchWrapperRef}
            >

                <form
                    className="navbar-search"
                    onSubmit={handleSubmit}
                >

                    <HiOutlineMagnifyingGlass
                        className="navbar-search-icon"
                    />


                    <input
                        type="search"

                        value={searchText}

                        onChange={(event) => {

                            handleSearchChange(
                                event.target.value
                            );

                        }}

                        onFocus={() => {

                            setShowClientResults(
                                true
                            );

                        }}

                        placeholder="Search client by name, ID, mobile, GST, email..."

                        className="navbar-search-input"

                        aria-label="Search client"

                        autoComplete="off"
                    />


                    {/* =================================================
                        CLEAR BUTTON
                    ================================================= */}

                    {searchText && (

                        <button
                            type="button"
                            className="navbar-search-clear"
                            onClick={clearSearch}
                            aria-label="Clear search"
                        >

                            <HiOutlineXMark />

                        </button>

                    )}

                </form>


                {/* =================================================
                    CLIENT DROPDOWN
                ================================================= */}

                {showClientResults && (

                    <div className="navbar-client-dropdown">

                        {filteredClients.length > 0 ? (

                            filteredClients.map(
                                (client, index) => {

                                    const id =
                                        getClientId(
                                            client
                                        );


                                    const companyName =
                                        getCompanyName(
                                            client
                                        );


                                    const mobile =
                                        getMobile(
                                            client
                                        );


                                    const selected =
                                        selectedClient &&
                                        String(
                                            getClientId(
                                                selectedClient
                                            )
                                        ) ===
                                        String(id);


                                    return (

                                        <button
                                            type="button"

                                            key={
                                                `${id}-${index}`
                                            }

                                            className={`
                                                navbar-client-result
                                                ${
                                                    selected
                                                        ? "selected"
                                                        : ""
                                                }
                                            `}

                                            onMouseDown={(
                                                event
                                            ) => {

                                                event.preventDefault();

                                            }}

                                            onClick={() =>
                                                handleClientSelect(
                                                    client
                                                )
                                            }
                                        >


                                            {/* AVATAR */}

                                            <div className="navbar-client-avatar">

                                                {companyName
                                                    .charAt(0)
                                                    .toUpperCase()}

                                            </div>


                                            {/* INFO */}

                                            <div className="navbar-client-result-info">

                                                <span className="navbar-client-result-name">

                                                    {companyName}

                                                </span>


                                                <span className="navbar-client-result-meta">

                                                    ID: {id}

                                                    {mobile
                                                        ? ` • ${mobile}`
                                                        : ""}

                                                </span>

                                            </div>


                                            {/* SELECTED */}

                                            {selected && (

                                                <span className="navbar-client-selected">

                                                    Selected

                                                </span>

                                            )}

                                        </button>

                                    );

                                }
                            )

                        ) : (

                            <div className="navbar-client-empty">

                                <HiOutlineMagnifyingGlass />

                                <span>
                                    No client found
                                </span>

                            </div>

                        )}

                    </div>

                )}

            </div>


            {/* =================================================
                RIGHT SIDE
            ================================================= */}

            <div className="navbar-right">


                {/* NOTIFICATION */}

                <button
                    type="button"
                    className="navbar-icon-btn"
                    onClick={onNotificationClick}
                    aria-label="Notifications"
                >

                    <HiOutlineBell />

                    <span className="navbar-notification-dot" />

                </button>


                {/* PROFILE */}

                <button
                    type="button"
                    className="navbar-profile"
                    onClick={onProfileClick}
                    aria-label="Open profile menu"
                >

                    <div className="navbar-avatar">

                        {userInitials}

                    </div>


                    <div className="navbar-user-info">

                        <span className="navbar-user-name">

                            {userName}

                        </span>


                        <span className="navbar-user-role">

                            {userRole}

                        </span>

                    </div>


                    <HiOutlineChevronDown
                        className="navbar-chevron"
                    />

                </button>

            </div>

        </header>

    );

};


export default Navbar;