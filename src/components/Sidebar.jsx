import { NavLink } from "react-router-dom";
import navigation  from "../data/navigation";

function Sidebar () {
    return (

        <aside className="app-sidebar">
            <h2>SalesFlow</h2>

        <nav>
            {navigation.map((item) => (
                <NavLink key={item.path} to={item.path}>{item.label}</NavLink>
         
        ))}
        </nav>
        </aside>
    );
}

export default Sidebar;