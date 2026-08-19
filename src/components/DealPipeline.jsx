import { useMemo, useState } from "react";
import { FaCheck, FaXmark } from "react-icons/fa6";

const OPEN_STAGES = ["New", "Qualified", "Proposal", "Negotiation"];
const CLOSED_STAGES = ["Won", "Lost"];
const ALL_STAGES = [...OPEN_STAGES, ...CLOSED_STAGES];
const ITEMS_PER_PAGE = 5;
const MAX_TERMINAL_ITEMS = 10;

function DealPipeline({ deals, onMove, onWin, onLose }) {
  const [draggedDeal, setDraggedDeal] = useState(null);
  const [pages, setPages] = useState({});

  const dealsByStage = useMemo(
    () =>
      Object.fromEntries(
        ALL_STAGES.map((stage) => [
          stage,
          deals.filter((deal) => deal.stage === stage),
        ])
      ),
    [deals]
  );

  const pipelineDealsByStage = useMemo(
    () =>
      Object.fromEntries(
        ALL_STAGES.map((stage) => {
          const stageDeals = dealsByStage[stage];
          const pipelineDeals = CLOSED_STAGES.includes(stage)
            ? [...stageDeals].reverse().slice(0, MAX_TERMINAL_ITEMS)
            : stageDeals;

          return [stage, pipelineDeals];
        })
      ),
    [dealsByStage]
  );

  function getTotalPages(stageDeals) {
    return Math.max(1, Math.ceil(stageDeals.length / ITEMS_PER_PAGE));
  }

  function getCurrentPage(stage, stageDeals) {
    return Math.min(pages[stage] || 1, getTotalPages(stageDeals));
  }

  function getPageDeals(stageDeals, stage) {
    const currentPage = getCurrentPage(stage, stageDeals);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    return stageDeals.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }

  function changePage(stage, page, totalPages) {
    if (page < 1 || page > totalPages) return;

    setPages((currentPages) => ({
      ...currentPages,
      [stage]: page,
    }));
  }

  function handleDragStart(event, deal) {
    setDraggedDeal(deal);
    event.dataTransfer.setData("dealId", String(deal.id));
    event.dataTransfer.effectAllowed = "move";
  }

  function handleDragEnd() {
    setDraggedDeal(null);
  }

  function isValidDropStage(stage) {
    if (!draggedDeal) return false;

    const currentIndex = OPEN_STAGES.indexOf(draggedDeal.stage);
    const targetIndex = OPEN_STAGES.indexOf(stage);

    return currentIndex >= 0 && targetIndex === currentIndex + 1;
  }

  function handleDragOver(event, stage) {
    if (!isValidDropStage(stage)) return;

    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }

  function handleDrop(event, newStage) {
    event.preventDefault();

    if (!draggedDeal || !isValidDropStage(newStage)) {
      setDraggedDeal(null);
      return;
    }

    const dealId = event.dataTransfer.getData("dealId");
    const deal = deals.find((item) => String(item.id) === dealId);

    setDraggedDeal(null);

    if (!deal) return;

    onMove(deal, newStage);
    setPages((currentPages) => ({
      ...currentPages,
      [newStage]: 1,
    }));
  }

  function getColumnState(stage) {
    if (!draggedDeal) return "";

    if (draggedDeal.stage === stage) {
      return "kanban-column--current";
    }

    if (isValidDropStage(stage)) {
      return "kanban-column--drop-target";
    }

    return "kanban-column--muted";
  }

  return (
    <div className="kanban-board pipeline-board" aria-label="Deal pipeline">
      {ALL_STAGES.map((stage) => {
        const allStageDeals = dealsByStage[stage];
        const stageDeals = pipelineDealsByStage[stage];
        const totalPages = getTotalPages(stageDeals);
        const currentPage = getCurrentPage(stage, stageDeals);
        const pageDeals = getPageDeals(stageDeals, stage);
        const isClosedStage = CLOSED_STAGES.includes(stage);
        const hiddenCount = allStageDeals.length - stageDeals.length;

        return (
          <section
            key={stage}
            className={`kanban-column pipeline-column ${getColumnState(stage)}`}
            onDragOver={(event) => handleDragOver(event, stage)}
            onDrop={(event) => handleDrop(event, stage)}
          >
            <header className="kanban-column_header pipeline-header">
              <h2>{stage}</h2>
              <span className="pipeline-count">{allStageDeals.length}</span>
            </header>

            <div className="kanban-column_body pipeline-items">
              {pageDeals.map((deal) => (
                <article
                  key={deal.id}
                  className={`deal-card pipeline-card ${
                    draggedDeal?.id === deal.id
                      ? "deal-card--dragging"
                      : ""
                  }`}
                  draggable={!isClosedStage}
                  onDragStart={(event) => handleDragStart(event, deal)}
                  onDragEnd={handleDragEnd}
                >
                  <div className="deal-card__content pipeline-card__content">
                    <h3 className="pipeline-card__title">{deal.name}</h3>
                    <p className="pipeline-card__secondary">
                      {deal.company || "No company"}
                    </p>
                    <strong className="pipeline-card__value">
                      ${Number(deal.value || 0).toLocaleString()}
                    </strong>
                    <small className="pipeline-card__meta">
                      Close date: {deal.closeDate || "Not set"}
                    </small>
                  </div>

                  {stage === "Negotiation" && (
                    <div className="deal-card__actions pipeline-card__actions">
                      <button
                        type="button"
                        className="button button--sm button--success"
                        onClick={() => onWin(deal)}
                      >
                        <FaCheck aria-hidden="true" /> Won
                      </button>
                      <button
                        type="button"
                        className="button button--sm button--danger"
                        onClick={() => onLose(deal)}
                      >
                        <FaXmark aria-hidden="true" /> Lost
                      </button>
                    </div>
                  )}
                </article>
              ))}

              {allStageDeals.length === 0 && (
                <p className="kanban-empty pipeline-empty">No deals in {stage}</p>
              )}

              {hiddenCount > 0 && (
                <p className="pipeline-overflow-note">
                  {hiddenCount} more in the {stage} tab
                </p>
              )}
            </div>

            {totalPages > 1 && (
              <div className="kanban-pagination pipeline-pagination">
                <span className="kanban-pagination__info">
                  {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                  {Math.min(currentPage * ITEMS_PER_PAGE, stageDeals.length)} of{" "}
                  {stageDeals.length}
                </span>
                <div className="kanban-pagination__actions">
                  <button
                    type="button"
                    className="button button--sm button--ghost"
                    disabled={currentPage === 1}
                    onClick={() =>
                      changePage(stage, currentPage - 1, totalPages)
                    }
                    aria-label={`Previous ${stage} page`}
                  >
                    ←
                  </button>
                  <span className="kanban-pagination__page">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    type="button"
                    className="button button--sm button--ghost"
                    disabled={currentPage === totalPages}
                    onClick={() =>
                      changePage(stage, currentPage + 1, totalPages)
                    }
                    aria-label={`Next ${stage} page`}
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

export default DealPipeline;
