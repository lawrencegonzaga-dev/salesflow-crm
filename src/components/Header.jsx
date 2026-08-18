/* ========================================================= */
/* FILE: src/components/Header.jsx */
/* ========================================================= */

import { useState } from "react";

function Header({ isNavigationOpen, onMenuToggle }) {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <header className="app-header">
            <div className="app-header-left">
                <button
                    className="menu-button"
                    type="button"
                    aria-label="Toggle navigation"
                    aria-expanded={isNavigationOpen}
                    onClick={onMenuToggle}
                >
                    ☰
                </button>

                <div className="header-search">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="header-search-input"
                    />
                </div>
            </div>

            <div className="app-header-right">
                <button className="button button--ghost button--icon" aria-label="Notifications">
                    🔔
                    <span className="badge badge--danger badge--sm">3</span>
                </button>
                <button className="button button--ghost button--icon" aria-label="Profile">
                    👤
                </button>
            </div>
        </header>
    );
}

export default Header;