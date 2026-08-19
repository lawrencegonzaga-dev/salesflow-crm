function CalendarEvent({ item, onEdit, onDelete, onOpen }) {
    const isEvent = item.type === "Event";

    return (
        <div className={`calendar-event calendar-event--${item.type.toLowerCase()}`}>
            <button
                type="button"
                className="calendar-event__title"
                onClick={() => (isEvent ? onEdit(item) : onOpen(item))}
                title={isEvent ? `Edit ${item.title}` : `Open ${item.title}`}
            >
                {item.title}
            </button>
            {isEvent && (
                <button
                    type="button"
                    className="calendar-event__delete"
                    aria-label={`Delete ${item.title}`}
                    onClick={() => onDelete(item.id)}
                >
                    ×
                </button>
            )}
        </div>
    );
}

export default CalendarEvent;
