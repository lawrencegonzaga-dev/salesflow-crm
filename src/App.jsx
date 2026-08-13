import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Contacts from "./pages/Contacts";
import AppLayout from "./layouts/AppLayout";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route element={<AppLayout />}>

                    <Route
                        path="/"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/contacts"
                        element={<Contacts />}
                    />

                </Route>

            </Routes>
        </BrowserRouter>
    );
}

export default App;