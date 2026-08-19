import { useMemo, useState } from "react";

const MOVE_STAGES = ["New", "Contacted", "Qualified", "Converted"];
const STAGES = [...MOVE_STAGES, "Lost"];
const TERMINAL_STAGES = ["Converted", "Lost"];
const ITEMS_PER_PAGE = 5;
const MAX_TERMINAL_ITEMS = 10;

function LeadPipeline({ leads, onEditLead, onMoveLead }) {
  const [draggedLead, setDraggedLead] = useState(null);
  const [stagePages, setStagePages] = useState({});

  const leadsByStage = useMemo(
    () =>
      Object.fromEntries(
        STAGES.map((stage) => [
          stage,
          leads.filter((lead) => lead.stage === stage),
        ])
      ),
    [leads]
  );

  const pipelineLeadsByStage = useMemo(
    () =>
      Object.fromEntries(
        STAGES.map((stage) => {
          const stageLeads = leadsByStage[stage];
          const pipelineLeads = TERMINAL_STAGES.includes(stage)
            ? [...stageLeads].reverse().slice(0, MAX_TERMINAL_ITEMS)
            : stageLeads;

          return [stage, pipelineLeads];
        })
      ),
    [leadsByStage]
  );

  function getTotalPages(stage) {
    return Math.max(
      1,
      Math.ceil(pipelineLeadsByStage[stage].length / ITEMS_PER_PAGE)
    );
  }

  function getCurrentPage(stage) {
    return Math.min(stagePages[stage] || 1, getTotalPages(stage));
  }

  function getVisibleLeads(stage) {
    const currentPage = getCurrentPage(stage);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    return pipelineLeadsByStage[stage].slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
  }

  function changePage(stage, page) {
    const totalPages = getTotalPages(stage);

    if (page < 1 || page > totalPages) return;

    setStagePages((currentPages) => ({
      ...currentPages,
      [stage]: page,
    }));
  }

  function handleDragStart(event, lead) {
    setDraggedLead(lead);
    event.dataTransfer.setData("leadId", String(lead.id));
    event.dataTransfer.effectAllowed = "move";
  }

  function handleDragEnd() {
    setDraggedLead(null);
  }

  function isValidDrop(stage) {
    if (!draggedLead || TERMINAL_STAGES.includes(draggedLead.stage)) {
      return false;
    }

    if (stage === "Lost") {
      return draggedLead.stage === "Qualified";
    }

    const currentIndex = MOVE_STAGES.indexOf(draggedLead.stage);
    const targetIndex = MOVE_STAGES.indexOf(stage);

    return currentIndex >= 0 && targetIndex === currentIndex + 1;
  }

  function handleDragOver(event, stage) {
    if (!isValidDrop(stage)) return;

    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }

  function handleDrop(event, newStage) {
    event.preventDefault();

    if (!draggedLead || !isValidDrop(newStage)) {
      handleDragEnd();
      return;
    }

    const leadId = event.dataTransfer.getData("leadId");
    const lead = leads.find((item) => String(item.id) === leadId);

    handleDragEnd();

    if (!lead) return;

    onMoveLead(lead, newStage);
    setStagePages((currentPages) => ({
      ...currentPages,
      [newStage]: 1,
    }));
  }

  function getStageClass(stage) {
    if (!draggedLead) return "";

    if (draggedLead.stage === stage) {
      return "lead-pipeline__stage--current";
    }

    if (isValidDrop(stage)) {
      return "lead-pipeline__stage--drop-target";
    }

    return "lead-pipeline__stage--muted";
  }

  return (
    <div className="lead-pipeline pipeline-board" aria-label="Lead pipeline">
      {STAGES.map((stage) => {
        const allStageLeads = leadsByStage[stage];
        const stageLeads = pipelineLeadsByStage[stage];
        const visibleLeads = getVisibleLeads(stage);
        const currentPage = getCurrentPage(stage);
        const totalPages = getTotalPages(stage);
        const isTerminalStage = TERMINAL_STAGES.includes(stage);
        const hiddenCount = allStageLeads.length - stageLeads.length;

        return (
          <section
            key={stage}
            className={`lead-pipeline__stage pipeline-column ${getStageClass(stage)}`}
            onDragOver={(event) => handleDragOver(event, stage)}
            onDrop={(event) => handleDrop(event, stage)}
          >
            <header className="lead-pipeline__header pipeline-header">
              <h2>{stage}</h2>
              <span className="pipeline-count">{allStageLeads.length}</span>
            </header>

            <div className="lead-pipeline__items pipeline-items">
              {visibleLeads.map((lead) => (
                <button
                  key={lead.id}
                  type="button"
                  className={`lead-pipeline__card pipeline-card ${
                    draggedLead?.id === lead.id
                      ? "lead-pipeline__card--dragging"
                      : ""
                  }`}
                  draggable={!isTerminalStage}
                  onDragStart={(event) => handleDragStart(event, lead)}
                  onDragEnd={handleDragEnd}
                  onClick={() => onEditLead(lead)}
                  title={`Edit ${lead.name}`}
                >
                  <h3 className="pipeline-card__title">{lead.name}</h3>
                  <p className="pipeline-card__secondary">
                    {lead.company || "No company"}
                  </p>
                  <strong className="pipeline-card__value">
                    {Number(lead.value || 0).toLocaleString(undefined, {
                      style: "currency",
                      currency: "USD",
                    })}
                  </strong>
                </button>
              ))}

              {allStageLeads.length === 0 && (
                <p className="lead-pipeline__empty pipeline-empty">
                  No leads in {stage}
                </p>
              )}

              {hiddenCount > 0 && (
                <p className="pipeline-overflow-note">
                  {hiddenCount} more in the {stage} tab
                </p>
              )}
            </div>

            {totalPages > 1 && (
              <div className="lead-pipeline__pagination pipeline-pagination">
                <button
                  type="button"
                  className="lead-pipeline__page-button"
                  disabled={currentPage === 1}
                  onClick={() => changePage(stage, currentPage - 1)}
                  aria-label={`Previous ${stage} page`}
                >
                  ←
                </button>
                <span className="lead-pipeline__page-info">
                  {currentPage} / {totalPages}
                </span>
                <button
                  type="button"
                  className="lead-pipeline__page-button"
                  disabled={currentPage === totalPages}
                  onClick={() => changePage(stage, currentPage + 1)}
                  aria-label={`Next ${stage} page`}
                >
                  →
                </button>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}

export default LeadPipeline;
