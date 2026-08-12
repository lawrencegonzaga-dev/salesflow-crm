import Sidebar from "../components/Sidebar";
import Header from "../components/Header"

function AppLayout ({children}) {
    return (
        <div className="app-layout">
            <Sidebar />
            <Header />

        <main className="app-main">
            <div className="app-main_content">
                {children}
            </div>
        </main>
        </div>

    );
}

export default AppLayout;