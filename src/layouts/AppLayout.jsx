import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

function AppLayout() {
    const [isNavigationOpen, setIsNavigationOpen] = useState(false);

    return (
        <div className="app-layout">

            <Sidebar
                isOpen={isNavigationOpen}
                onNavigate={() => setIsNavigationOpen(false)}
            />

            <Header
                isNavigationOpen={isNavigationOpen}
                onMenuToggle={() => setIsNavigationOpen((isOpen) => !isOpen)}
            />

            <main className="app-main">
                <div className="app-main_content">
                    <Outlet />
                </div>
            </main>

            {isNavigationOpen && (
                <button
                    className="navigation-backdrop"
                    type="button"
                    aria-label="Close navigation"
                    onClick={() => setIsNavigationOpen(false)}
                />
            )}

        </div>
    );
}

export default AppLayout;
