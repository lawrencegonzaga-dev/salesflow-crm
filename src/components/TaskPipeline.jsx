import { useState } from "react";
import UserAvatar from "./UserAvatar";

const statuses = ["Todo", "In Progress", "Completed"];
const ITEMS_PER_PAGE = 5;

function TaskPipeline({ tasks, users = [], onEdit, onMove }) {
  const [draggedTask, setDraggedTask] = useState(null);

  const [pages, setPages] = useState({
    Todo: 1,
    "In Progress": 1,
    Completed: 1,
  });

  function handleDragStart(event, task) {
    setDraggedTask(task);

    event.dataTransfer.setData(
      "taskId",
      String(task.id)
    );

    event.dataTransfer.effectAllowed = "move";
  }

  function handleDragEnd() {
    setDraggedTask(null);
  }

  function isValidDropStatus(status) {
    if (!draggedTask) return false;

    const currentIndex = statuses.indexOf(
      draggedTask.status
    );

    const targetIndex = statuses.indexOf(status);

    if (
      currentIndex === -1 ||
      targetIndex === -1
    ) {
      return false;
    }

    return targetIndex === currentIndex + 1;
  }

  function handleDragOver(event, status) {
    if (!draggedTask) return;

    if (!isValidDropStatus(status)) return;

    event.preventDefault();

    event.dataTransfer.dropEffect = "move";
  }

  function handleDrop(event, newStatus) {
    event.preventDefault();

    if (!draggedTask) return;

    if (!isValidDropStatus(newStatus)) {
      setDraggedTask(null);
      return;
    }

    const taskId = event.dataTransfer.getData(
      "taskId"
    );

    const task = tasks.find(
      (item) => String(item.id) === taskId
    );

    if (!task) {
      setDraggedTask(null);
      return;
    }

    setDraggedTask(null);

    onMove(task, newStatus);

    // Show the first page of the destination stage.
    setPages((currentPages) => ({
      ...currentPages,
      [newStatus]: 1,
    }));
  }

  function isPreviousStatus(status) {
    if (!draggedTask) return false;

    const currentIndex = statuses.indexOf(
      draggedTask.status
    );

    const statusIndex = statuses.indexOf(status);

    if (
      currentIndex === -1 ||
      statusIndex === -1
    ) {
      return false;
    }

    return statusIndex < currentIndex;
  }

  function isCurrentStatus(status) {
    if (!draggedTask) return false;

    return draggedTask.status === status;
  }

  function getTotalPages(statusTasks) {
    return Math.max(
      1,
      Math.ceil(
        statusTasks.length / ITEMS_PER_PAGE
      )
    );
  }

  function getCurrentPage(status) {
    return pages[status] || 1;
  }

  function getPageTasks(statusTasks, status) {
    const currentPage = Math.min(
      getCurrentPage(status),
      getTotalPages(statusTasks)
    );

    const startIndex =
      (currentPage - 1) * ITEMS_PER_PAGE;

    const endIndex =
      startIndex + ITEMS_PER_PAGE;

    return statusTasks.slice(
      startIndex,
      endIndex
    );
  }

  function goToPreviousPage(status) {
    setPages((currentPages) => ({
      ...currentPages,
      [status]: Math.max(
        1,
        (currentPages[status] || 1) - 1
      ),
    }));
  }

  function goToNextPage(status, totalPages) {
    setPages((currentPages) => ({
      ...currentPages,
      [status]: Math.min(
        totalPages,
        (currentPages[status] || 1) + 1
      ),
    }));
  }

  function getPageStart(statusTasks, status) {
    if (statusTasks.length === 0) {
      return 0;
    }

    const currentPage = Math.min(
      getCurrentPage(status),
      getTotalPages(statusTasks)
    );

    return (
      (currentPage - 1) * ITEMS_PER_PAGE + 1
    );
  }

  function getPageEnd(statusTasks, status) {
    const currentPage = Math.min(
      getCurrentPage(status),
      getTotalPages(statusTasks)
    );

    return Math.min(
      currentPage * ITEMS_PER_PAGE,
      statusTasks.length
    );
  }

  return (
    <div className="task-pipeline pipeline-board" aria-label="Task pipeline">
      {statuses.map((status) => {
        const statusTasks = tasks.filter(
          (task) => task.status === status
        );

        const totalPages =
          getTotalPages(statusTasks);

        const currentPage = Math.min(
          getCurrentPage(status),
          totalPages
        );

        const pageTasks =
          getPageTasks(
            statusTasks,
            status
          );

        const muted =
          isPreviousStatus(status);

        const current =
          isCurrentStatus(status);

        const validDrop =
          isValidDropStatus(status);

        return (
          <section
            key={status}
            className={`
              task-pipeline__stage pipeline-column
              ${muted ? "task-pipeline__stage--muted" : ""}
              ${current ? "task-pipeline__stage--current" : ""}
              ${
                draggedTask && validDrop
                  ? "task-pipeline__stage--drop-target"
                  : ""
              }
            `}
            onDragOver={(event) =>
              handleDragOver(event, status)
            }
            onDrop={(event) =>
              handleDrop(event, status)
            }
          >
            {/* ================================================= */}
            {/* STAGE HEADER */}
            {/* ================================================= */}

            <header className="task-pipeline__header pipeline-header">
              <h2>{status}</h2>

              <span className="pipeline-count">
                {statusTasks.length}
              </span>
            </header>

            {/* ================================================= */}
            {/* TASK CARDS */}
            {/* ================================================= */}

            <div className="task-pipeline__items pipeline-items">
              {pageTasks.map((task) => (
                <article
                  key={task.id}
                  className={`
                    task-pipeline__card pipeline-card
                    ${
                      draggedTask?.id === task.id
                        ? "task-pipeline__card--dragging"
                        : ""
                    }
                  `}
                  draggable
                  onDragStart={(event) =>
                    handleDragStart(
                      event,
                      task
                    )
                  }
                  onDragEnd={handleDragEnd}
                >
                  <button
                    type="button"
                    className="task-pipeline__edit pipeline-card__content"
                    onClick={() =>
                      onEdit(task)
                    }
                    title={`Edit ${task.title}`}
                  >
                    {/* Task title */}

                    <h3 className="pipeline-card__title">{task.title}</h3>

                    {/* Description */}

                    {task.description && (
                      <p className="task-pipeline__description pipeline-card__secondary">
                        {task.description}
                      </p>
                    )}

                    {/* Assigned person */}

                    <span className="task-pipeline__assigned pipeline-card__meta">
                      <UserAvatar
                        user={users.find(
                          (user) =>
                            user.name === task.assignedTo
                        )}
                        name={task.assignedTo}
                      />
                      <span>
                        {task.assignedTo || "Unassigned"}
                      </span>
                    </span>
                  </button>
                </article>
              ))}

              {/* Empty stage */}

              {statusTasks.length === 0 && (
                <p className="task-pipeline__empty pipeline-empty">
                  No tasks
                </p>
              )}
            </div>

            {/* ================================================= */}
            {/* PAGINATION */}
            {/* Only shown when there are MORE than 5 tasks */}
            {/* ================================================= */}

            {statusTasks.length > ITEMS_PER_PAGE && (
              <div className="task-pipeline__pagination pipeline-pagination">
                <div className="task-pipeline__pagination-info">
                  {getPageStart(
                    statusTasks,
                    status
                  )}
                  –
                  {getPageEnd(
                    statusTasks,
                    status
                  )}{" "}
                  of {statusTasks.length}
                </div>

                <div className="task-pipeline__pagination-actions">
                  <button
                    type="button"
                    className="button button--sm button--ghost"
                    disabled={
                      currentPage === 1
                    }
                    onClick={() =>
                      goToPreviousPage(
                        status
                      )
                    }
                    aria-label={`Previous ${status} page`}
                  >
                    ←
                  </button>

                  <span className="task-pipeline__page">
                    {currentPage} /{" "}
                    {totalPages}
                  </span>

                  <button
                    type="button"
                    className="button button--sm button--ghost"
                    disabled={
                      currentPage ===
                      totalPages
                    }
                    onClick={() =>
                      goToNextPage(
                        status,
                        totalPages
                      )
                    }
                    aria-label={`Next ${status} page`}
                  >
                    →
                  </button>
                </div>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}

export default TaskPipeline;
