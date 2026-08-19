import { useMemo, useState } from "react";
import TaskForm from "../components/TaskForm";
import TaskTable from "../components/TaskTable";
import TaskPipeline from "../components/TaskPipeline";
import { useCRM } from "../context/CRMContext";

const statuses = ["Todo", "In Progress", "Completed"];
const priorities = ["Low", "Medium", "High"];

function localDate() {
  const now = new Date();

  return `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}-${String(
    now.getDate()
  ).padStart(2, "0")}`;
}

function getDateGroup(task, today) {
  if (task.status === "Completed") {
    return "Completed";
  }

  if (task.dueDate < today) {
    return "Overdue";
  }

  if (task.dueDate === today) {
    return "Today";
  }

  return "Upcoming";
}

function Tasks() {
  const {
    tasks,
    users = [],
    saveRecord,
    deleteRecord,
  } = useCRM();

  const [editingTask, setEditingTask] =
    useState(null);

  const [showForm, setShowForm] =
    useState(false);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [priorityFilter, setPriorityFilter] =
    useState("All");

  const [dateFilter, setDateFilter] =
    useState("All");

  const [sortBy, setSortBy] =
    useState("dueDate-asc");

  const [taskTab, setTaskTab] =
    useState("pending");

  const [pendingMove, setPendingMove] =
    useState(null);

  const today = localDate();

  const pendingCount = tasks.filter(
    (task) => task.status !== "Completed"
  ).length;

  const completedCount = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  /*
   * ---------------------------------------------------------
   * TAB TASKS
   * ---------------------------------------------------------
   */

  const tabTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (taskTab === "completed") {
        return task.status === "Completed";
      }

      return task.status !== "Completed";
    });
  }, [tasks, taskTab]);

  /*
   * ---------------------------------------------------------
   * FILTERED / SORTED TASKS
   * ---------------------------------------------------------
   */

  const visibleTasks = useMemo(() => {
    const search =
      searchTerm.trim().toLowerCase();

    const [field, direction] =
      sortBy.split("-");

    return tabTasks
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
            ? priorities.indexOf(
                first.priority
              ) -
              priorities.indexOf(
                second.priority
              )
            : String(
                first[field] ?? ""
              ).localeCompare(
                String(
                  second[field] ?? ""
                )
              );

        return direction === "asc"
          ? comparison
          : -comparison;
      });
  }, [
    tabTasks,
    searchTerm,
    statusFilter,
    priorityFilter,
    dateFilter,
    sortBy,
    today,
  ]);

  /*
   * ---------------------------------------------------------
   * FORM
   * ---------------------------------------------------------
   */

  function openNewTask() {
    setEditingTask(null);
    setShowForm(true);
  }

  function openEditTask(task) {
    setEditingTask(task);
    setShowForm(true);
  }

  function closeForm() {
    setEditingTask(null);
    setShowForm(false);
  }

  function saveTask(task) {
    saveRecord("tasks", task);
    closeForm();
  }

  /*
   * ---------------------------------------------------------
   * DELETE
   * ---------------------------------------------------------
   */

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

  /*
   * ---------------------------------------------------------
   * DRAG / DROP
   * ---------------------------------------------------------
   */

  function handleMoveTask(task, newStatus) {
    const currentIndex =
      statuses.indexOf(task.status);

    const newIndex =
      statuses.indexOf(newStatus);

    if (
      currentIndex === -1 ||
      newIndex === -1
    ) {
      return;
    }

    if (newIndex !== currentIndex + 1) return;

    setPendingMove({
      task,
      newStatus,
    });
  }

  function confirmMove() {
    if (!pendingMove) return;

    const {
      task,
      newStatus,
    } = pendingMove;

    saveRecord("tasks", {
      ...task,
      status: newStatus,
    });

    setPendingMove(null);
  }

  function cancelMove() {
    setPendingMove(null);
  }

  /*
   * ---------------------------------------------------------
   * COMPLETE
   * ---------------------------------------------------------
   */

  function completeTask(task) {
    saveRecord("tasks", {
      ...task,
      status: "Completed",
    });
  }

  return (
    <section className="page task-content">

      {/* ================================================= */}
      {/* PAGE HEADER */}
      {/* ================================================= */}

      <header className="page-header">
        <div>
          <h1 className="page-title">
            Tasks
          </h1>

          <p className="body-text">
            Organize the work that moves your
            sales forward.
          </p>
        </div>

        <button
          className="button button--primary"
          type="button"
          onClick={openNewTask}
        >
          + Add Task
        </button>
      </header>

      {/* ================================================= */}
      {/* TABS */}
      {/* ================================================= */}

      <div className="tabs">

        <button
          type="button"
          className={`tab ${
            taskTab === "pending"
              ? "tab--active"
              : ""
          }`}
          onClick={() =>
            setTaskTab("pending")
          }
        >
          Pending

          <span className="tab-count">
            {pendingCount}
          </span>
        </button>

        <button
          type="button"
          className={`tab ${
            taskTab === "completed"
              ? "tab--active"
              : ""
          }`}
          onClick={() =>
            setTaskTab("completed")
          }
        >
          Completed

          <span className="tab-count">
            {completedCount}
          </span>
        </button>

      </div>

      {/* ================================================= */}
      {/* TASK FORM */}
      {/* ================================================= */}

      {showForm && (
        <div
          className="modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
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
                  {editingTask
                    ? "Edit Task"
                    : "Add Task"}
                </h2>

                <p className="body-text">
                  Assign work, set a due date,
                  and track completion.
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
              key={
                editingTask?.id ?? "new"
              }
              editingTask={editingTask}
              users={users}
              onSave={saveTask}
              onCancel={closeForm}
            />

          </section>
        </div>
      )}

      {/* ================================================= */}
      {/* MOVE CONFIRMATION */}
      {/* ================================================= */}

      {pendingMove && (
        <div
          className="modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              cancelMove();
            }
          }}
        >
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="move-task-title"
          >

            <div className="modal-header">

              <div>
                <h2
                  id="move-task-title"
                  className="card-title"
                >
                  Move Task?
                </h2>

                <p className="body-text">
                  Move{" "}
                  <strong>
                    "{pendingMove.task.title}"
                  </strong>{" "}
                  from{" "}
                  <strong>
                    {pendingMove.task.status}
                  </strong>{" "}
                  to{" "}
                  <strong>
                    {pendingMove.newStatus}
                  </strong>
                  ?
                </p>
              </div>

              <button
                className="modal-close"
                type="button"
                onClick={cancelMove}
                aria-label="Close"
              >
                ×
              </button>

            </div>

            <div className="row-actions">

              <button
                type="button"
                className="button button--ghost"
                onClick={cancelMove}
              >
                Cancel
              </button>

              <button
                type="button"
                className="button button--primary"
                onClick={confirmMove}
              >
                Move Task
              </button>

            </div>

          </section>
        </div>
      )}

      {/* ================================================= */}
      {/* FILTERS */}
      {/* ================================================= */}

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
                setSearchTerm(
                  event.target.value
                )
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
                setStatusFilter(
                  event.target.value
                )
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
                setPriorityFilter(
                  event.target.value
                )
              }
            >
              <option value="All">
                All priorities
              </option>

              {priorities.map(
                (priority) => (
                  <option
                    key={priority}
                    value={priority}
                  >
                    {priority}
                  </option>
                )
              )}
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
                setDateFilter(
                  event.target.value
                )
              }
            >
              <option value="All">
                All dates
              </option>

              <option value="Overdue">
                Overdue
              </option>

              <option value="Today">
                Today
              </option>

              <option value="Upcoming">
                Upcoming
              </option>

              <option value="Completed">
                Completed
              </option>
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
                setSortBy(
                  event.target.value
                )
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

      {/* ================================================= */}
      {/* TASK CARD PIPELINE */}
      {/* ================================================= */}

      <TaskPipeline
        tasks={visibleTasks}
        users={users}
        onEdit={openEditTask}
        onMove={handleMoveTask}
      />

      {/* ================================================= */}
      {/* TASK TABLE */}
      {/* ================================================= */}

      <section className="card">

        <div className="card_header">

          <div>
            <h2 className="card-title">
              {taskTab === "pending"
                ? "Pending Tasks"
                : "Completed Tasks"}
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
          users={users}
          getDateGroup={(task) =>
            getDateGroup(task, today)
          }
          onEdit={openEditTask}
          onDelete={deleteTask}
          onComplete={completeTask}
        />

      </section>

    </section>
  );
}

export default Tasks;
