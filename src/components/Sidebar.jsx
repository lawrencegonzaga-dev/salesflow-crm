import { NavLink } from "react-router-dom";
import navigation from "../data/navigation";

function Sidebar({ isOpen, onNavigate }) {
    return (
        <aside className={`app-sidebar ${isOpen ? "app-sidebar--open" : ""}`}>
            <h2>SalesFlow</h2>

            <nav className="sidebar-nav"> 
                {navigation.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className="sidebar-nav_item"
                        onClick={onNavigate}
                    >
                        {item.label}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}

export default Sidebar;
