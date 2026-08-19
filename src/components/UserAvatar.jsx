function getInitials(name) {
    return String(name || "?")
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase();
}

function UserAvatar({ user, name, size = "sm" }) {
    const displayName = user?.name || name || "Unassigned";
    const initials = user?.avatar || getInitials(displayName);

    return (
        <span
            className={`user-avatar user-avatar--${size}`}
            title={displayName}
            aria-hidden="true"
        >
            {initials}
        </span>
    );
}

export default UserAvatar;
