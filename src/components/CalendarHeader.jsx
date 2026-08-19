function CalendarHeader({ month, onPrevious, onNext, onToday, onAddEvent }) {
    const monthLabel = month.toLocaleDateString(undefined, {
        month: "long",
        year: "numeric",
    });

    return (
        <header className="page-header calendar-toolbar">
            <div>
                <h1 className="page-title">Calendar</h1>
                <p className="body-text">
                    View tasks, deal close dates, and scheduled events.
                </p>
            </div>

            <div className="calendar-toolbar__actions">
                <button
                    className="button button--ghost button--icon"
                    type="button"
                    onClick={onPrevious}
                    aria-label="Previous month"
                >
                    ←
                </button>
                <button className="button button--ghost" type="button" onClick={onToday}>
                    Today
                </button>
                <button
                    className="button button--ghost button--icon"
                    type="button"
                    onClick={onNext}
                    aria-label="Next month"
                >
                    →
                </button>
                <strong className="calendar-month">{monthLabel}</strong>
                <button className="button button--primary" type="button" onClick={onAddEvent}>
                    + Add Event
                </button>
            </div>
        </header>
    );
}

export default CalendarHeader;
