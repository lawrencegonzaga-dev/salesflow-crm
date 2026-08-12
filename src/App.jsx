    import { BrowserRouter, Routes, Route, Navigate } from "react-router";

import AppLayout from "./layouts/AppLayout";

import Dashboard from "./pages/Dashboard";
import Contacts from "./pages/Contacts";
import Leads from "./pages/Leads";
import Deals from "./pages/Deals";
import Tasks from "./pages/Tasks";
import Calendar from "./pages/Calendar";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

function App() {
    return (
        <BrowserRouter>
        <Routes>
        <Route element={<AppLayout/>}> 
        <Route path="/" element={<Navigate to="/dashboard" replace/> } />
            
        
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/contacts" element={<Contacts/>}/>
        <Route path="/leads" element={<Leads/>}/>
        <Route path="/deals" element={<Deals/>} />
        <Route path="/tasks" element={<Tasks/>}/>
        <Route path="/reports" element={<Reports/>}/>
        <Route path="/calendar" element={<Calendar/>}/>
        <Route path="/settings" element={<Settings/>}/>


        </Route>
        </Routes>
</BrowserRouter>

    );
}

export default App;