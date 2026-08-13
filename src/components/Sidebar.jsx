import { NavLink } from "react-router-dom";
import navigation from "../data/navigation";

function Sidebar() {
    return (
        <aside className="app-sidebar">
            <h2>SalesFlow</h2>

            <nav className="sidebar-nav"> 
                {navigation.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                          className="sidebar-nav_item"
                    >
                        {item.label}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}

export default Sidebar;