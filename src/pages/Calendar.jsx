import { useMemo, useState } from "react";
import CalendarHeader from "../components/CalendarHeader";
import CalendarGrid from "../components/CalendarGrid";
import CalendarForm from "../components/CalendarForm";
import { useCRM } from "../context/CRMContext";

function Calendar() {
    const { tasks = [], deals = [], events = [], saveRecord, deleteRecord } = useCRM();
    const [month, setMonth] = useState(() => { const now = new Date(); return new Date(now.getFullYear(), now.getMonth(), 1); });
    const [editingEvent, setEditingEvent] = useState(null); const [showForm, setShowForm] = useState(false);
    const items = useMemo(() => [
        ...tasks.map((task) => ({ id: task.id, title: task.title, date: task.dueDate, type: "Task" })),
        ...deals.map((deal) => ({ id: deal.id, title: `${deal.name} close`, date: deal.closeDate, type: "Deal" })),
        ...events
    ], [tasks, deals, events]);
    function closeForm() { setEditingEvent(null); setShowForm(false); }
    function saveEvent(event) { saveRecord("events", event); closeForm(); }
    function deleteEvent(id) { if (window.confirm("Delete this event? This cannot be undone.")) { deleteRecord("events", id); if (editingEvent?.id === id) closeForm(); } }
    return <section className="page calendar-content"><CalendarHeader month={month} onPrevious={() => setMonth((value) => new Date(value.getFullYear(), value.getMonth() - 1, 1))} onNext={() => setMonth((value) => new Date(value.getFullYear(), value.getMonth() + 1, 1))} onToday={() => { const now = new Date(); setMonth(new Date(now.getFullYear(), now.getMonth(), 1)); }} onAddEvent={() => { setEditingEvent(null); setShowForm(true); }} />{showForm && <section className="card"><div className="card_header"><h2 className="card-title">{editingEvent ? "Edit Event" : "Add Event"}</h2><button type="button" onClick={closeForm}>Close</button></div><CalendarForm key={editingEvent?.id ?? "new"} editingEvent={editingEvent} onSave={saveEvent} onCancel={closeForm} /></section>}<CalendarGrid month={month} items={items} onEditEvent={(event) => { setEditingEvent(event); setShowForm(true); }} onDeleteEvent={deleteEvent} /></section>;
}

export default Calendar;
