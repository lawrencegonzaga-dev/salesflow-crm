import { useState } from "react";

const priorities = ["Low", "Medium", "High"];
const statuses = ["Todo", "In Progress", "Completed"];

function TaskForm({ editingTask, users = [], onSave, onCancel }) {
    const [formData, setFormData] = useState({
        title: editingTask?.title ?? "",
        description: editingTask?.description ?? "",
        assignedTo: editingTask?.assignedTo ?? "",
        dueDate: editingTask?.dueDate ?? "",
        priority: editingTask?.priority ?? "Medium",
        status: editingTask?.status ?? "Todo",
    });

    function handleChange({ target: { name, value } }) {
        setFormData((current) => ({ ...current, [name]: value }));
    }

    function handleSubmit(event) {
        event.preventDefault();
        onSave({ ...editingTask, ...formData });
    }

    return (
        <form className="record-form" onSubmit={handleSubmit}>
            <label className="form-group" htmlFor="task-title">
                <span className="form-label form-label--required">Task title</span>
                <input
                    id="task-title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />
            </label>

            <label className="form-group" htmlFor="task-description">
                <span className="form-label">Description</span>
                <input
                    id="task-description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                />
            </label>

            <label className="form-group" htmlFor="task-assigned-to">
                <span className="form-label form-label--required">Assigned to</span>
                <select
                    id="task-assigned-to"
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleChange}
                    required
                >
                    <option value="" disabled>Select a user</option>
                    {users.map((user) => (
                        <option key={user.id} value={user.name}>
                            {user.name} — {user.role}
                        </option>
                    ))}
                </select>
            </label>

            <label className="form-group" htmlFor="task-due-date">
                <span className="form-label form-label--required">Due date</span>
                <input
                    id="task-due-date"
                    name="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={handleChange}
                    required
                />
            </label>

            <label className="form-group" htmlFor="task-priority">
                <span className="form-label">Priority</span>
                <select
                    id="task-priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                >
                    {priorities.map((priority) => (
                        <option key={priority} value={priority}>{priority}</option>
                    ))}
                </select>
            </label>

            <label className="form-group" htmlFor="task-status">
                <span className="form-label">Status</span>
                <select
                    id="task-status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                >
                    {statuses.map((status) => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
            </label>

            <div className="form-actions form-actions--right">
                <button className="button button--primary" type="submit">
                    {editingTask ? "Update Task" : "Create Task"}
                </button>
                <button className="button button--ghost" type="button" onClick={onCancel}>
                    Cancel
                </button>
            </div>
        </form>
    );
}

export default TaskForm;
