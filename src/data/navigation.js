import {
    FaAddressBook,
    FaBullseye,
    FaCalendarDays,
    FaChartColumn,
    FaGear,
    FaHandshake,
    FaHouse,
    FaListCheck,
} from "react-icons/fa6";

const navigation = [
    {
        label: "Dashboard",
        path: "/dashboard",
        icon: FaHouse,
    },
    {
        label: "Contacts",
        path: "/contacts",
        icon: FaAddressBook,
    },
    {
        label: "Leads",
        path: "/leads",
        icon: FaBullseye,
    },
    {
        label: "Deals",
        path: "/deals",
        icon: FaHandshake,
    },
    {
        label: "Tasks",
        path: "/tasks",
        icon: FaListCheck,
    },
    {
        label: "Calendar",
        path: "/calendar",
        icon: FaCalendarDays,
    },
    {
        label: "Reports",
        path: "/reports",
        icon: FaChartColumn,
    },
    {
        label: "Settings",
        path: "/settings",
        icon: FaGear,
    }
];

export default navigation;
