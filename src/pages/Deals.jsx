import { useMemo, useState } from "react";
import RecordForm from "../components/RecordForm";
import DealPipeline from "../components/DealPipeline";
import DealTable from "../components/DealTable";
import { useCRM } from "../context/CRMContext";

const stages = [
  "New",
  "Qualified",
  "Proposal",
  "Negotiation",
  "Won",
  "Lost",
];

const openStages = ["New", "Qualified", "Proposal", "Negotiation"];

const fields = [
  {
    name: "name",
    label: "Deal name",
    required: true,
  },
  {
    name: "company",
    label: "Company",
    required: true,
  },
  {
    name: "email",
    label: "Email",
    type: "email",
  },
  {
    name: "phone",
    label: "Phone",
    type: "tel",
  },
  {
    name: "value",
    label: "Value",
    type: "number",
    min: "0",
    required: true,
  },
  {
    name: "stage",
    label: "Stage",
    options: stages,
    defaultValue: "New",
  },
  {
    name: "closeDate",
    label: "Expected close date",
    type: "date",
    required: true,
  },
];

function Deals() {
  const { deals, contacts, saveRecord, deleteRecord } = useCRM();

  const [editingDeal, setEditingDeal] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState("All");
  const [dealTab, setDealTab] = useState("open");
  const [pendingMove, setPendingMove] = useState(null);

  const openCount = deals.filter(
    (deal) => deal.stage !== "Won" && deal.stage !== "Lost"
  ).length;

  const wonCount = deals.filter((deal) => deal.stage === "Won").length;

  const lostCount = deals.filter((deal) => deal.stage === "Lost").length;

  const pipelineDeals = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    return deals
      .filter(
        (deal) => stageFilter === "All" || deal.stage === stageFilter
      )
      .filter((deal) =>
        [
          deal.name,
          deal.company,
          deal.email,
          deal.phone,
          deal.stage,
          deal.closeDate,
          deal.value,
        ].some((value) =>
          String(value ?? "")
            .toLowerCase()
            .includes(search)
          )
      );
  }, [deals, searchTerm, stageFilter]);

  const visibleDeals = useMemo(
    () =>
      pipelineDeals.filter((deal) => {
        if (dealTab === "won") return deal.stage === "Won";
        if (dealTab === "lost") return deal.stage === "Lost";
        return deal.stage !== "Won" && deal.stage !== "Lost";
      }),
    [pipelineDeals, dealTab]
  );

  function openNewDeal() {
    setEditingDeal(null);
    setShowForm(true);
  }

  function openEditDeal(deal) {
    setEditingDeal(deal);
    setShowForm(true);
  }

  function closeForm() {
    setEditingDeal(null);
    setShowForm(false);
  }

  function saveDeal(deal) {
    const isNewDeal = !editingDeal;
    saveRecord("deals", {
      ...deal,
      value: Number(deal.value) || 0,
    });

    if (isNewDeal) {
      const existingContact = contacts.find(
        (contact) => contact.email?.toLowerCase() === deal.email?.toLowerCase()
      );
      if (!existingContact) {
        saveRecord("contacts", {
          name: deal.name,
          company: deal.company,
          email: deal.email || "",
          phone: deal.phone || "",
          status: "Prospect",
        });
      }
    }
    closeForm();
  }

  function deleteDeal(id) {
    if (window.confirm("Delete this deal? This cannot be undone.")) {
      deleteRecord("deals", id);
      if (editingDeal?.id === id) {
        closeForm();
      }
    }
  }

  function requestStageMove(deal, targetStage) {
    const currentIndex = openStages.indexOf(deal.stage);
    const targetIndex = openStages.indexOf(targetStage);

    if (currentIndex === -1 || targetIndex !== currentIndex + 1) return;

    setPendingMove({
      deal,
      targetStage,
    });
  }

  function confirmStageMove() {
    if (!pendingMove) return;
    saveRecord("deals", {
      ...pendingMove.deal,
      stage: pendingMove.targetStage,
    });
    setPendingMove(null);
  }

  function cancelStageMove() {
    setPendingMove(null);
  }

  function markDealAsWon(deal) {
    if (deal.stage !== "Negotiation") return;
    saveRecord("deals", { ...deal, stage: "Won" });
  }

  function markDealAsLost(deal) {
    if (deal.stage !== "Negotiation") return;
    saveRecord("deals", { ...deal, stage: "Lost" });
  }

  return (
    <section className="page">

      <header className="page-header">
        <div>
          <h1 className="page-title">Deals</h1>
          <p className="body-text">
            Track opportunities as they progress through your sales pipeline.
          </p>
        </div>
        <div className="page-actions">
          <button
            className="button button--primary"
            type="button"
            onClick={openNewDeal}
          >
            + Add Deal
          </button>
        </div>
      </header>

      <div className="tabs">
        <button
          type="button"
          className={`tab ${dealTab === "open" ? "tab--active" : ""}`}
          onClick={() => setDealTab("open")}
        >
          Open <span className="tab-count">{openCount}</span>
        </button>
        <button
          type="button"
          className={`tab ${dealTab === "won" ? "tab--active" : ""}`}
          onClick={() => setDealTab("won")}
        >
          Won <span className="tab-count">{wonCount}</span>
        </button>
        <button
          type="button"
          className={`tab ${dealTab === "lost" ? "tab--active" : ""}`}
          onClick={() => setDealTab("lost")}
        >
          Lost <span className="tab-count">{lostCount}</span>
        </button>
      </div>

      {showForm && (
        <div
          className="modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeForm();
          }}
        >
          <section
            className="modal modal--lg"
            role="dialog"
            aria-modal="true"
            aria-labelledby="deal-form-title"
          >
            <div className="modal-header">
              <div>
                <h2 id="deal-form-title" className="card-title">
                  {editingDeal ? "Edit Deal" : "Add Deal"}
                </h2>
                <p className="body-text">
                  {editingDeal ? "Update deal details." : "Create a new sales opportunity."}
                </p>
              </div>
              <button
                type="button"
                className="modal-close"
                onClick={closeForm}
                aria-label="Close form"
              >
                ×
              </button>
            </div>
            <RecordForm
              key={editingDeal?.id ?? "new"}
              fields={fields}
              record={editingDeal}
              submitLabel={editingDeal ? "Update Deal" : "Create Deal"}
              onSave={saveDeal}
              onCancel={closeForm}
            />
          </section>
        </div>
      )}

      {pendingMove && (
        <div
          className="modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) cancelStageMove();
          }}
        >
          <section
            className="modal modal--sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="stage-confirm-title"
          >
            <div className="modal-header">
              <div>
                <h2 id="stage-confirm-title" className="card-title">
                  Move Deal?
                </h2>
                <p className="body-text">
                  Move <strong>"{pendingMove.deal.name}"</strong> from{" "}
                  <strong>{pendingMove.deal.stage}</strong> to{" "}
                  <strong>{pendingMove.targetStage}</strong>?
                </p>
              </div>
              <button
                type="button"
                className="modal-close"
                onClick={cancelStageMove}
                aria-label="Cancel"
              >
                ×
              </button>
            </div>
            <div className="row-actions">
              <button
                type="button"
                className="button button--ghost"
                onClick={cancelStageMove}
              >
                Cancel
              </button>
              <button
                type="button"
                className="button button--primary"
                onClick={confirmStageMove}
              >
                Move Deal
              </button>
            </div>
          </section>
        </div>
      )}

      <section className="toolbar">
        <div className="search-field">
          <input
            type="text"
            placeholder="Search deals..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
        <div className="filter-group">
          <label htmlFor="deal-stage">Stage</label>
          <select
            id="deal-stage"
            value={stageFilter}
            onChange={(event) => setStageFilter(event.target.value)}
          >
            <option value="All">All stages</option>
            {stages.map((stage) => (
              <option key={stage} value={stage}>
                {stage}
              </option>
            ))}
          </select>
        </div>
      </section>

      <DealPipeline
        deals={pipelineDeals}
        onMove={requestStageMove}
        onWin={markDealAsWon}
        onLose={markDealAsLost}
      />

      <section className="card">
        <div className="card-header card-header--center">
          <div>
            <h2 className="card-title">
              {dealTab === "open"
                ? "Open Deals"
                : dealTab === "won"
                ? "Won Deals"
                : "Lost Deals"}
            </h2>
            <p className="card-subtitle">
              {visibleDeals.length} {visibleDeals.length === 1 ? "deal" : "deals"}
            </p>
          </div>
        </div>
        <DealTable
          deals={visibleDeals}
          onEditDeal={openEditDeal}
          onDeleteDeal={deleteDeal}
        />
      </section>

    </section>
  );
}

export default Deals;
