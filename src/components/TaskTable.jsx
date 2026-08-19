/* ========================================================= */
/* FILE: src/components/TaskTable.jsx */
/* ========================================================= */

import TaskRow from "./TaskRow";

function TaskTable({
    tasks,
    users = [],
    getDateGroup,
    onEdit,
    onDelete,
    onComplete,
}) {
    return (
        <div className="table-wrap">
            <table className="table table--striped">
                <thead>
                    <tr>
                        <th>Task</th>
                        <th>Assigned to</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Due date</th>
                        <th aria-label="Actions" />
                    </tr>
                </thead>

                <tbody>
                    {tasks.length ? (
                        tasks.map((task) => (
                            <TaskRow
                                key={task.id}
                                task={task}
                                user={users.find(
                                    (user) => user.name === task.assignedTo
                                )}
                                dateGroup={getDateGroup(task)}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                onComplete={onComplete}
                            />
                        ))
                    ) : (
                        <tr>
                            <td
                                className="task-empty"
                                colSpan="6"
                            >
                                No tasks match your search or filters.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default TaskTable;
