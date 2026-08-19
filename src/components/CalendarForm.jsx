import { useState } from "react";

function CalendarForm({ editingEvent, onSave, onCancel }) {
    const [formData, setFormData] = useState({
        title: editingEvent?.title ?? "",
        date: editingEvent?.date ?? "",
    });

    function handleChange({ target: { name, value } }) {
        setFormData((current) => ({ ...current, [name]: value }));
    }

    function handleSubmit(event) {
        event.preventDefault();
        onSave({ ...editingEvent, ...formData, type: "Event" });
    }

    return (
        <form className="record-form" onSubmit={handleSubmit}>
            <label className="form-group" htmlFor="event-title">
                <span className="form-label form-label--required">Event title</span>
                <input
                    id="event-title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />
            </label>

            <label className="form-group" htmlFor="event-date">
                <span className="form-label form-label--required">Date</span>
                <input
                    id="event-date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                />
            </label>

            <div className="form-actions form-actions--right">
                <button className="button button--primary" type="submit">
                    {editingEvent ? "Update Event" : "Create Event"}
                </button>
                <button className="button button--ghost" type="button" onClick={onCancel}>
                    Cancel
                </button>
            </div>
        </form>
    );
}

export default CalendarForm;
