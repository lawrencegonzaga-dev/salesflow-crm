function Header({ isNavigationOpen, onMenuToggle }) {
    return (
        <header className="app-header">
            <div className="app-header_left">
                <button
                    className="menu-button"
                    type="button"
                    aria-label="Toggle navigation"
                    aria-expanded={isNavigationOpen}
                    onClick={onMenuToggle}
                >
                    ☰
                </button>

                <strong>SalesFlow</strong>
            </div>

            <div className="app-header_right">
                <span>Notifications</span>
                <span>Profile</span>
            </div>
        </header>
    );
}

export default Header;
