import { useMemo, useState } from "react";
import TaskForm from "../components/TaskForm";
import TaskTable from "../components/TaskTable";
import { useCRM } from "../context/CRMContext";

const statuses = ["Todo", "In Progress", "Completed"];
const priorities = ["Low", "Medium", "High"];

function localDate() {
    const now = new Date();

    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
        2,
        "0"
    )}-${String(now.getDate()).padStart(2, "0")}`;
}

function getDateGroup(task, today) {
    if (task.status === "Completed") return "Completed";
    if (task.dueDate < today) return "Overdue";
    if (task.dueDate === today) return "Today";

    return "Upcoming";
}

function Tasks() {
    const { tasks, saveRecord, deleteRecord } = useCRM();

    const [editingTask, setEditingTask] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [priorityFilter, setPriorityFilter] = useState("All");
    const [dateFilter, setDateFilter] = useState("All");
    const [sortBy, setSortBy] = useState("dueDate-asc");

    const today = localDate();

    const visibleTasks = useMemo(() => {
        const search = searchTerm.trim().toLowerCase();
        const [field, direction] = sortBy.split("-");

        return tasks
            .filter(
                (task) =>
                    statusFilter === "All" ||
                    task.status === statusFilter
            )
            .filter(
                (task) =>
                    priorityFilter === "All" ||
                    task.priority === priorityFilter
            )
            .filter(
                (task) =>
                    dateFilter === "All" ||
                    getDateGroup(task, today) === dateFilter
            )
            .filter((task) =>
                [
                    task.title,
                    task.description,
                    task.assignedTo,
                    task.priority,
                    task.status,
                    task.dueDate,
                ].some((value) =>
                    String(value ?? "")
                        .toLowerCase()
                        .includes(search)
                )
            )
            .toSorted((first, second) => {
                const comparison =
                    field === "priority"
                        ? priorities.indexOf(first.priority) -
                          priorities.indexOf(second.priority)
                        : String(first[field] ?? "").localeCompare(
                              String(second[field] ?? "")
                          );

                return direction === "asc"
                    ? comparison
                    : -comparison;
            });
    }, [
        tasks,
        searchTerm,
        statusFilter,
        priorityFilter,
        dateFilter,
        sortBy,
        today,
    ]);

    function closeForm() {
        setEditingTask(null);
        setShowForm(false);
    }

    function saveTask(task) {
        saveRecord("tasks", task);
        closeForm();
    }

    function deleteTask(id) {
        if (
            window.confirm(
                "Delete this task? This cannot be undone."
            )
        ) {
            deleteRecord("tasks", id);

            if (editingTask?.id === id) {
                closeForm();
            }
        }
    }

    return (
        <section className="page task-content">
            <header className="page-header">
                <div>
                    <h1 className="page-title">Tasks</h1>
                    <p className="body-text">
                        Organize the work that moves your sales forward.
                    </p>
                </div>

                <button
                    className="button button--primary"
                    type="button"
                    onClick={() => {
                        setEditingTask(null);
                        setShowForm(true);
                    }}
                >
                    + Add Task
                </button>
            </header>

{showForm && (
    <div
        className="modal-overlay"
        onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
                closeForm();
            }
        }}
    >
        <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="task-modal-title"
        >
            <div className="modal-header">
                <div>
                    <h2
                        id="task-modal-title"
                        className="card-title"
                    >
                        {editingTask ? "Edit Task" : "Add Task"}
                    </h2>

                    <p className="body-text">
                        Assign work, set a due date, and track
                        completion.
                    </p>
                </div>

                <button
                    className="modal-close"
                    type="button"
                    onClick={closeForm}
                    aria-label="Close"
                >
                    ×
                </button>
            </div>

            <TaskForm
                key={editingTask?.id ?? "new"}
                editingTask={editingTask}
                onSave={saveTask}
                onCancel={closeForm}
            />
        </section>
    </div>
)}

            <section className="card">
                <div className="toolbar">
                    <div className="search-field">
                        <label htmlFor="task-search">
                            Search
                        </label>

                        <input
                            id="task-search"
                            placeholder="Search tasks..."
                            value={searchTerm}
                            onChange={(event) =>
                                setSearchTerm(event.target.value)
                            }
                        />
                    </div>

                    <div>
                        <label htmlFor="task-status-filter">
                            Status
                        </label>

                        <select
                            id="task-status-filter"
                            value={statusFilter}
                            onChange={(event) =>
                                setStatusFilter(event.target.value)
                            }
                        >
                            <option value="All">
                                All statuses
                            </option>

                            {statuses.map((status) => (
                                <option
                                    key={status}
                                    value={status}
                                >
                                    {status}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="task-priority-filter">
                            Priority
                        </label>

                        <select
                            id="task-priority-filter"
                            value={priorityFilter}
                            onChange={(event) =>
                                setPriorityFilter(event.target.value)
                            }
                        >
                            <option value="All">
                                All priorities
                            </option>

                            {priorities.map((priority) => (
                                <option
                                    key={priority}
                                    value={priority}
                                >
                                    {priority}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="task-date-filter">
                            Due
                        </label>

                        <select
                            id="task-date-filter"
                            value={dateFilter}
                            onChange={(event) =>
                                setDateFilter(event.target.value)
                            }
                        >
                            <option value="All">
                                All dates
                            </option>
                            <option>Overdue</option>
                            <option>Today</option>
                            <option>Upcoming</option>
                            <option>Completed</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="task-sort">
                            Sort
                        </label>

                        <select
                            id="task-sort"
                            value={sortBy}
                            onChange={(event) =>
                                setSortBy(event.target.value)
                            }
                        >
                            <option value="dueDate-asc">
                                Due date: earliest
                            </option>

                            <option value="dueDate-desc">
                                Due date: latest
                            </option>

                            <option value="priority-desc">
                                Priority: high to low
                            </option>

                            <option value="priority-asc">
                                Priority: low to high
                            </option>

                            <option value="title-asc">
                                Title: A–Z
                            </option>

                            <option value="title-desc">
                                Title: Z–A
                            </option>
                        </select>
                    </div>
                </div>
            </section>

            <section className="card">
                <div className="card_header">
                    <div>
                        <h2 className="card-title">
                            Task List
                        </h2>

                        <p className="body-text">
                            {visibleTasks.length}{" "}
                            {visibleTasks.length === 1
                                ? "task"
                                : "tasks"}
                        </p>
                    </div>
                </div>

                <TaskTable
                    tasks={visibleTasks}
                    getDateGroup={(task) =>
                        getDateGroup(task, today)
                    }
                    onEdit={(task) => {
                        setEditingTask(task);
                        setShowForm(true);
                    }}
                    onDelete={deleteTask}
                    onComplete={(task) =>
                        saveRecord("tasks", {
                            ...task,
                            status: "Completed",
                        })
                    }
                />
            </section>
        </section>
    );
}

export default Tasks;