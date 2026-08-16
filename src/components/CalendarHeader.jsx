function CalendarHeader({ month, onPrevious, onNext, onToday, onAddEvent }) {
    return <header className="calendar-toolbar"><div><h1 className="page-title">Calendar</h1><p className="body-text">View tasks, deal close dates, and scheduled events.</p></div><div className="calendar-toolbar__actions"><button type="button" onClick={onPrevious} aria-label="Previous month">←</button><button type="button" onClick={onToday}>Today</button><button type="button" onClick={onNext} aria-label="Next month">→</button><strong className="calendar-month">{month.toLocaleDateString(undefined, { month: "long", year: "numeric" })}</strong><button className="button button--primary" type="button" onClick={onAddEvent}>+ Add Event</button></div></header>
}

export default CalendarHeader;
