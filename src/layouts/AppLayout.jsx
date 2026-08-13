import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

function AppLayout() {
    return (
        <div className="app-layout">

            <Sidebar />

            <Header />

            <main className="app-main">
                <div className="app-main_content">
                    <Outlet />
                </div>
            </main>

        </div>
    );
}

export default AppLayout;