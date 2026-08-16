import CalendarEvent from "./CalendarEvent";

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
function dateKey(date) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`; }

function CalendarGrid({ month, items, onEditEvent, onDeleteEvent }) {
    const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
    const start = new Date(month.getFullYear(), month.getMonth(), 1 - firstDay.getDay());
    const today = dateKey(new Date());
    const days = Array.from({ length: 42 }, (_, index) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + index));
    return <div className="calendar"><div className="calendar_header">{dayNames.map((name) => <div className="calendar_day-name" key={name}>{name}</div>)}</div><div className="calendar_grid">{days.map((date) => { const key = dateKey(date); const dayItems = items.filter((item) => item.date === key); return <div className={`calendar_day ${date.getMonth() !== month.getMonth() ? "calendar_day--outside" : ""} ${key === today ? "calendar_day--today" : ""}`} key={key}><span className="calendar_date">{date.getDate()}</span><div className="calendar_day-events">{dayItems.map((item) => <CalendarEvent key={`${item.type}-${item.id}`} item={item} onEdit={onEditEvent} onDelete={onDeleteEvent} />)}</div></div>; })}</div></div>;
}

export default CalendarGrid;
