import { NavLink } from "react-router-dom";
import navigation from "../data/navigation";

function Sidebar({ isOpen, onNavigate }) {
    return (
        <aside className={`app-sidebar ${isOpen ? "app-sidebar--open" : ""}`}>
            <h2>SalesFlow</h2>

            <nav className="sidebar-nav"> 
                {navigation.map((item) => {
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className="sidebar-nav_item"
                            onClick={onNavigate}
                        >
                            <Icon className="sidebar-nav_icon" aria-hidden="true" />
                            <span>{item.label}</span>
                        </NavLink>
                    );
                })}
            </nav>
        </aside>
    );
}

export default Sidebar;
