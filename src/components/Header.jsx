import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FaAddressBook,
    FaBars,
    FaBell,
    FaBriefcase,
    FaBullseye,
    FaCalendarDays,
    FaListCheck,
    FaMagnifyingGlass,
    FaXmark,
} from "react-icons/fa6";
import { useCRM } from "../context/CRMContext";
import UserAvatar from "./UserAvatar";

function localDate() {
    const now = new Date();

    return [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, "0"),
        String(now.getDate()).padStart(2, "0"),
    ].join("-");
}

function Header({ isNavigationOpen, onMenuToggle }) {
    const navigate = useNavigate();
    const {
        contacts = [],
        leads = [],
        deals = [],
        tasks = [],
        events = [],
        settings,
    } = useCRM();
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const searchRef = useRef(null);
    const notificationsRef = useRef(null);
    const today = localDate();

    const notificationPreferences = settings.preferences.notifications;
    const notificationsEnabled =
        typeof notificationPreferences === "object"
            ? notificationPreferences.enabled !== false &&
              notificationPreferences.tasks !== false
            : Boolean(notificationPreferences);

    const taskNotifications = useMemo(
        () =>
            tasks
                .filter(
                    (task) =>
                        task.status !== "Completed" &&
                        task.dueDate &&
                        task.dueDate <= today
                )
                .toSorted((first, second) =>
                    first.dueDate.localeCompare(second.dueDate)
                ),
        [tasks, today]
    );

    const searchResults = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        if (!query) return [];

        const records = [
            ...contacts.map((contact) => ({
                id: contact.id,
                type: "Contact",
                label: contact.name,
                detail: contact.company || contact.email || "Contact",
                path: "/contacts",
                icon: FaAddressBook,
                values: [
                    contact.name,
                    contact.company,
                    contact.email,
                    contact.phone,
                ],
            })),
            ...leads.map((lead) => ({
                id: lead.id,
                type: "Lead",
                label: lead.name,
                detail: lead.company || lead.stage,
                path: "/leads",
                icon: FaBullseye,
                values: [lead.name, lead.company, lead.email, lead.stage],
            })),
            ...deals.map((deal) => ({
                id: deal.id,
                type: "Deal",
                label: deal.name,
                detail: deal.company || deal.stage,
                path: "/deals",
                icon: FaBriefcase,
                values: [deal.name, deal.company, deal.email, deal.stage],
            })),
            ...tasks.map((task) => ({
                id: task.id,
                type: "Task",
                label: task.title,
                detail: task.status,
                path: "/tasks",
                icon: FaListCheck,
                values: [
                    task.title,
                    task.description,
                    task.assignedTo,
                    task.status,
                ],
            })),
            ...events.map((event) => ({
                id: event.id,
                type: "Event",
                label: event.title,
                detail: event.date,
                path: "/calendar",
                icon: FaCalendarDays,
                values: [event.title, event.date],
            })),
        ];

        return records
            .filter((record) =>
                record.values.some((value) =>
                    String(value || "").toLowerCase().includes(query)
                )
            )
            .slice(0, 8);
    }, [contacts, leads, deals, tasks, events, searchQuery]);

    useEffect(() => {
        function handlePointerDown(event) {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target)
            ) {
                setIsSearchOpen(false);
            }

            if (
                notificationsRef.current &&
                !notificationsRef.current.contains(event.target)
            ) {
                setIsNotificationsOpen(false);
            }
        }

        function handleKeyDown(event) {
            if (event.key === "Escape") {
                setIsSearchOpen(false);
                setIsNotificationsOpen(false);
            }
        }

        document.addEventListener("pointerdown", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    function closeSearch() {
        setSearchQuery("");
        setIsSearchOpen(false);
    }

    function openSearchResult(result) {
        closeSearch();
        navigate(result.path);
    }

    function handleSearchKeyDown(event) {
        if (event.key === "Enter" && searchResults.length > 0) {
            event.preventDefault();
            openSearchResult(searchResults[0]);
        }
    }

    const visibleNotifications = notificationsEnabled
        ? taskNotifications
        : [];
    const profileName = settings.profile.name || "Profile";
    const showSearchPanel = isSearchOpen && searchQuery.trim().length > 0;

    return (
        <header className="app-header">
            <div className="app-header-left">
                <button
                    className="menu-button"
                    type="button"
                    aria-label="Toggle navigation"
                    aria-expanded={isNavigationOpen}
                    onClick={onMenuToggle}
                >
                    <FaBars aria-hidden="true" />
                </button>

                <div className="header-search" ref={searchRef}>
                    <FaMagnifyingGlass
                        className="header-search__icon"
                        aria-hidden="true"
                    />
                    <input
                        type="search"
                        placeholder="Search contacts, leads, deals, tasks..."
                        aria-label="Search SalesFlow"
                        aria-expanded={showSearchPanel}
                        value={searchQuery}
                        onFocus={() => setIsSearchOpen(true)}
                        onChange={(event) => {
                            setSearchQuery(event.target.value);
                            setIsSearchOpen(true);
                        }}
                        onKeyDown={handleSearchKeyDown}
                        className="header-search-input"
                    />
                    {searchQuery && (
                        <button
                            className="header-search__clear"
                            type="button"
                            onClick={closeSearch}
                            aria-label="Clear search"
                        >
                            <FaXmark aria-hidden="true" />
                        </button>
                    )}

                    {showSearchPanel && (
                        <section
                            className="search-panel"
                            aria-label="Search results"
                        >
                            <div className="search-panel__header">
                                <strong>Search results</strong>
                                <span>{searchResults.length} shown</span>
                            </div>

                            {searchResults.length > 0 ? (
                                <ul className="search-results">
                                    {searchResults.map((result) => {
                                        const ResultIcon = result.icon;

                                        return (
                                            <li key={result.type + "-" + result.id}>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openSearchResult(result)
                                                    }
                                                >
                                                    <span className="search-result__icon">
                                                        <ResultIcon aria-hidden="true" />
                                                    </span>
                                                    <span className="search-result__content">
                                                        <strong>{result.label}</strong>
                                                        <small>
                                                            {result.type} · {result.detail}
                                                        </small>
                                                    </span>
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            ) : (
                                <p className="search-panel__empty">
                                    No matching CRM records.
                                </p>
                            )}
                        </section>
                    )}
                </div>
            </div>

            <div className="app-header-right">
                <div className="notification-menu" ref={notificationsRef}>
                    <button
                        className="button button--ghost button--icon notification-button"
                        type="button"
                        aria-label={
                            "Notifications (" + visibleNotifications.length + ")"
                        }
                        aria-expanded={isNotificationsOpen}
                        aria-haspopup="true"
                        onClick={() =>
                            setIsNotificationsOpen((current) => !current)
                        }
                    >
                        <FaBell aria-hidden="true" />
                        {visibleNotifications.length > 0 && (
                            <span className="notification-badge">
                                {visibleNotifications.length}
                            </span>
                        )}
                    </button>

                    {isNotificationsOpen && (
                        <section
                            className="notification-panel"
                            aria-label="Notifications"
                        >
                            <div className="notification-panel__header">
                                <div>
                                    <strong>Notifications</strong>
                                    <span>
                                        {visibleNotifications.length} requiring attention
                                    </span>
                                </div>
                            </div>

                            {!notificationsEnabled ? (
                                <p className="notification-panel__empty">
                                    Task notifications are turned off in Settings.
                                </p>
                            ) : visibleNotifications.length === 0 ? (
                                <p className="notification-panel__empty">
                                    You’re all caught up.
                                </p>
                            ) : (
                                <ul className="notification-list">
                                    {visibleNotifications.map((task) => (
                                        <li key={task.id}>
                                            <Link
                                                to="/tasks"
                                                onClick={() =>
                                                    setIsNotificationsOpen(false)
                                                }
                                            >
                                                <strong>{task.title}</strong>
                                                <span>
                                                    {task.dueDate < today
                                                        ? "Overdue since " + task.dueDate
                                                        : "Due today"}
                                                </span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            <Link
                                className="notification-panel__footer"
                                to="/tasks"
                                onClick={() => setIsNotificationsOpen(false)}
                            >
                                View all tasks
                            </Link>
                        </section>
                    )}
                </div>

                <Link
                    className="header-profile"
                    to="/settings"
                    aria-label={"Open profile settings for " + profileName}
                >
                    <UserAvatar name={profileName} size="md" />
                    <span>{profileName}</span>
                </Link>
            </div>
        </header>
    );
}

export default Header;
