import "./Sidebar.css";

import {
    HiOutlinePlusCircle,
    HiOutlineClipboardDocumentList,
    HiOutlineUsers,
    HiOutlineTicket,
    HiOutlineChartBar,
    HiOutlineSwatch,
    HiOutlineCog6Tooth,
    HiOutlineArrowRightOnRectangle,
    HiOutlineXMark,
} from "react-icons/hi2";

const Sidebar = ({
    activeItem = "create-order",
    onNavigate,
    onClose,
}) => {

    /* =========================================================
       MAIN MENU
    ========================================================= */

    const menuItems = [
        {
            id: "create-order",
            label: "Create Order",
            icon: HiOutlinePlusCircle,
        },
        {
            id: "orders",
            label: "Orders",
            icon: HiOutlineClipboardDocumentList,
        },
        {
            id: "clients",
            label: "Clients",
            icon: HiOutlineUsers,
        },
        {
            id: "codes",
            label: "Codes",
            icon: HiOutlineTicket,
        },
        {
            id: "reports",
            label: "Reports",
            icon: HiOutlineChartBar,
        },
        {
            id: "themes",
            label: "Themes",
            icon: HiOutlineSwatch,
        },
        {
            id: "settings",
            label: "Settings",
            icon: HiOutlineCog6Tooth,
        },
    ];


    /* =========================================================
       NAVIGATION
    ========================================================= */

    const handleNavigate = (itemId) => {

        if (onNavigate) {
            onNavigate(itemId);
        }

        /*
         * Mobile / tablet par menu close
         */
        if (onClose) {
            onClose();
        }
    };


    /* =========================================================
       LOGOUT
    ========================================================= */

    const handleLogout = () => {

        if (onNavigate) {
            onNavigate("logout");
        }

        if (onClose) {
            onClose();
        }
    };


    return (
        <aside className="sidebar">

            {/* =================================================
               SIDEBAR HEADER
            ================================================= */}

            <div className="sidebar-header">

                <span className="sidebar-section-label">
                    OPERATIONS
                </span>

                {/* MOBILE CLOSE */}

                <button
                    type="button"
                    className="sidebar-close-btn"
                    onClick={onClose}
                    aria-label="Close sidebar"
                >
                    <HiOutlineXMark />
                </button>

            </div>


            {/* =================================================
               MAIN NAVIGATION
            ================================================= */}

            <nav
                className="sidebar-nav"
                aria-label="Main navigation"
            >

                {/* =================================================
                   MENU ITEMS
                ================================================= */}

                <div className="sidebar-menu">

                    {menuItems.map((item) => {

                        const Icon = item.icon;

                        const isActive =
                            activeItem === item.id;

                        return (
                            <button
                                key={item.id}
                                type="button"
                                className={`sidebar-menu-item ${
                                    isActive ? "active" : ""
                                }`}
                                onClick={() =>
                                    handleNavigate(item.id)
                                }
                            >

                                <span className="sidebar-menu-icon">
                                    <Icon />
                                </span>

                                <span className="sidebar-menu-label">
                                    {item.label}
                                </span>

                            </button>
                        );
                    })}

                </div>


                {/* =================================================
                   BOTTOM AREA
                ================================================= */}

                <div className="sidebar-bottom">

                    <div className="sidebar-divider" />

                    {/* =================================================
                       LOGOUT
                    ================================================= */}

                    <button
                        type="button"
                        className="sidebar-menu-item sidebar-logout"
                        onClick={handleLogout}
                    >

                        <span className="sidebar-menu-icon">
                            <HiOutlineArrowRightOnRectangle />
                        </span>

                        <span className="sidebar-menu-label">
                            Logout
                        </span>

                    </button>

                </div>

            </nav>

        </aside>
    );
};

export default Sidebar;