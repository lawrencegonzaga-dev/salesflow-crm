import UserAvatar from "./UserAvatar";

function TaskRow({ task, user, dateGroup, onEdit, onComplete }) {
    return (
        <tr>
            <td>
                <strong>{task.title}</strong>

                {task.description && (
                    <small className="task-description">
                        {task.description}
                    </small>
                )}
            </td>

            <td>
                <span className="task-assignee">
                    <UserAvatar user={user} name={task.assignedTo} />
                    <span>{user?.name || task.assignedTo || "Unassigned"}</span>
                </span>
            </td>

            <td>
                <span
                    className={`badge badge--${task.priority.toLowerCase()}`}
                >
                    {task.priority}
                </span>
            </td>

            <td>
                <span className="task-status">
                    {task.status}
                </span>
            </td>

            <td>
                <span
                    className={
                        dateGroup === "Overdue"
                            ? "task-due--overdue"
                            : ""
                    }
                >
                    {task.dueDate}
                </span>

                <small className="task-date-group">
                    {dateGroup}
                </small>
            </td>

            <td className="row-actions">
                {task.status !== "Completed" && (
                    <button
                        type="button"
                        onClick={() => onComplete(task)}
                    >
                        Complete
                    </button>
                )}

                <button
                    type="button"
                    onClick={() => onEdit(task)}
                >
                    Edit
                </button>

                {/* <button
                    type="button"
                    className="button--danger"
                    onClick={() => onDelete(task.id)}
                >
                    Delete
                </button> */}
            </td>
        </tr>
    );
}

export default TaskRow;
