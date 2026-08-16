import { useState } from "react";

function CalendarForm({ editingEvent, onSave, onCancel }) {
    const [formData, setFormData] = useState({ title: editingEvent?.title ?? "", date: editingEvent?.date ?? "" });
    function submit(event) { event.preventDefault(); onSave({ ...editingEvent, ...formData, type: "Event" }); }
    return <form className="record-form" onSubmit={submit}><label className="form-group" htmlFor="event-title"><span className="form-label">Event title</span><input id="event-title" name="title" value={formData.title} onChange={(event) => setFormData({ ...formData, title: event.target.value })} required /></label><label className="form-group" htmlFor="event-date"><span className="form-label">Date</span><input id="event-date" name="date" type="date" value={formData.date} onChange={(event) => setFormData({ ...formData, date: event.target.value })} required /></label><div className="form-actions"><button className="button button--primary" type="submit">{editingEvent ? "Update Event" : "Create Event"}</button>{editingEvent && <button className="button" type="button" onClick={onCancel}>Cancel</button>}</div></form>;
}

export default CalendarForm;
