/* ========================================================= */
/* FILE: src/pages/Deals.jsx */
/* ========================================================= */

import { useMemo, useState } from "react";
import RecordForm from "../components/RecordForm";
import { useCRM } from "../context/CRMContext";

const stages = [
    "New",
    "Qualified",
    "Proposal",
    "Negotiation",
    "Won",
    "Lost",
];

const fields = [
    { name: "name", label: "Deal name", required: true },
    { name: "company", label: "Company", required: true },
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
    const { deals, saveRecord, deleteRecord } = useCRM();

    const [editingDeal, setEditingDeal] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [stageFilter, setStageFilter] = useState("All");
    const [draggedDealId, setDraggedDealId] = useState(null);

    const visibleDeals = useMemo(() => {
        const search = searchTerm.trim().toLowerCase();

        return deals
            .filter(
                (deal) =>
                    stageFilter === "All" ||
                    deal.stage === stageFilter
            )
            .filter((deal) =>
                [
                    deal.name,
                    deal.company,
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
        saveRecord("deals", {
            ...deal,
            value: Number(deal.value) || 0,
        });

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

    /*
     * =========================================================
     * DRAG & DROP
     * =========================================================
     */

    function handleDragStart(deal) {
        setDraggedDealId(deal.id);
    }

    function handleDragEnd() {
        setDraggedDealId(null);
    }

    function handleDrop(targetStage) {
        if (!draggedDealId) {
            return;
        }

        const draggedDeal = deals.find(
            (deal) => deal.id === draggedDealId
        );

        if (!draggedDeal) {
            setDraggedDealId(null);
            return;
        }

        const currentIndex = stages.indexOf(draggedDeal.stage);
        const targetIndex = stages.indexOf(targetStage);

        /*
         * Don't allow dropping into the same stage.
         */
        if (currentIndex === targetIndex) {
            setDraggedDealId(null);
            return;
        }

        /*
         * Won and Lost are only allowed from Negotiation.
         */
        if (
            (targetStage === "Won" || targetStage === "Lost") &&
            draggedDeal.stage !== "Negotiation"
        ) {
            setDraggedDealId(null);
            return;
        }

        /*
         * Won and Lost are final stages.
         */
        if (
            draggedDeal.stage === "Won" ||
            draggedDeal.stage === "Lost"
        ) {
            setDraggedDealId(null);
            return;
        }

        /*
         * Don't allow moving backwards.
         *
         * Example:
         * Qualified → New ❌
         * Proposal → Qualified ❌
         */
        if (targetIndex < currentIndex) {
            setDraggedDealId(null);
            return;
        }

        /*
         * Don't allow skipping stages.
         *
         * Example:
         * New → Proposal ❌
         * Qualified → Negotiation ❌
         */
        if (targetIndex > currentIndex + 1) {
            setDraggedDealId(null);
            return;
        }

        /*
         * Update the existing deal.
         * The original ID is preserved.
         */
        saveRecord("deals", {
            ...draggedDeal,
            stage: targetStage,
        });

        setDraggedDealId(null);
    }

    /*
     * =========================================================
     * PAGE
     * =========================================================
     */

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

            {/* Deal Form */}
            {showForm && (
                <div
                    className="form-overlay"
                    onClick={closeForm}
                >
                    <section
                        className="form-card"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="deal-form-title"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <div className="form-card__header">
                            <div>
                                <h2
                                    id="deal-form-title"
                                    className="form-card__title"
                                >
                                    {editingDeal
                                        ? "Edit Deal"
                                        : "Add Deal"}
                                </h2>

                                <p className="form-card__subtitle">
                                    {editingDeal
                                        ? "Update deal details."
                                        : "Create a new sales opportunity."}
                                </p>
                            </div>

                            <button
                                type="button"
                                className="form-card__close"
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
                            submitLabel={
                                editingDeal
                                    ? "Update Deal"
                                    : "Create Deal"
                            }
                            onSave={saveDeal}
                            onCancel={closeForm}
                        />
                    </section>
                </div>
            )}

            {/* Toolbar */}
            <section className="toolbar">
                <div className="search-field">
                    <input
                        type="text"
                        placeholder="Search deals..."
                        value={searchTerm}
                        onChange={(event) =>
                            setSearchTerm(event.target.value)
                        }
                    />
                </div>

                <div className="filter-group">
                    <label htmlFor="deal-stage">
                        Stage
                    </label>

                    <select
                        id="deal-stage"
                        value={stageFilter}
                        onChange={(event) =>
                            setStageFilter(event.target.value)
                        }
                    >
                        <option value="All">
                            All stages
                        </option>

                        {stages.map((stage) => (
                            <option
                                key={stage}
                                value={stage}
                            >
                                {stage}
                            </option>
                        ))}
                    </select>
                </div>
            </section>

            {/* Kanban Board */}
            <div className="kanban-board">
                {stages.map((stage) => {
                    const stageDeals = visibleDeals.filter(
                        (deal) => deal.stage === stage
                    );

                    return (
                        <section
                            className={`kanban-column ${
                                draggedDealId
                                    ? "kanban-column--drop-target"
                                    : ""
                            }`}
                            key={stage}
                            onDragOver={(event) => {
                                event.preventDefault();
                            }}
                            onDrop={() =>
                                handleDrop(stage)
                            }
                        >
                            <header className="kanban-column_header">
                                <h2>{stage}</h2>

                                <span className="badge">
                                    {stageDeals.length}
                                </span>
                            </header>

                            <div className="kanban-column_body">
                                {stageDeals.map((deal) => (
                                    <article
                                        className="deal-card"
                                        key={deal.id}
                                        draggable
                                        onDragStart={() =>
                                            handleDragStart(deal)
                                        }
                                        onDragEnd={
                                            handleDragEnd
                                        }
                                    >
                                        <h3>{deal.name}</h3>

                                        <p>{deal.company}</p>

                                        <strong>
                                            $
                                            {Number(
                                                deal.value || 0
                                            ).toLocaleString()}
                                        </strong>

                                        <small>
                                            Close:{" "}
                                            {deal.closeDate ||
                                                "Not set"}
                                        </small>

                                        <div className="row-actions">
                                            <button
                                                type="button"
                                                className="button button--sm button--ghost"
                                                onClick={() =>
                                                    openEditDeal(
                                                        deal
                                                    )
                                                }
                                            >
                                                Edit
                                            </button>

                                            {/* Next Stage */}
                                            {deal.stage !==
                                                "Negotiation" &&
                                                deal.stage !==
                                                    "Won" &&
                                                deal.stage !==
                                                    "Lost" && (
                                                    <button
                                                        type="button"
                                                        className="button button--sm button--primary"
                                                        onClick={() => {
                                                            const currentIndex =
                                                                stages.indexOf(
                                                                    deal.stage
                                                                );

                                                            const nextStage =
                                                                stages[
                                                                    currentIndex +
                                                                        1
                                                                ];

                                                            if (
                                                                nextStage &&
                                                                nextStage !==
                                                                    "Won" &&
                                                                nextStage !==
                                                                    "Lost"
                                                            ) {
                                                                saveRecord(
                                                                    "deals",
                                                                    {
                                                                        ...deal,
                                                                        stage: nextStage,
                                                                    }
                                                                );
                                                            }
                                                        }}
                                                    >
                                                        Next Stage →
                                                    </button>
                                                )}

                                            {/* Negotiation → Won/Lost */}
                                            {deal.stage ===
                                                "Negotiation" && (
                                                <>
                                                    <button
                                                        type="button"
                                                        className="button button--sm button--primary"
                                                        onClick={() =>
                                                            saveRecord(
                                                                "deals",
                                                                {
                                                                    ...deal,
                                                                    stage: "Won",
                                                                }
                                                            )
                                                        }
                                                    >
                                                        ✓ Won
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="button button--sm button--danger"
                                                        onClick={() =>
                                                            saveRecord(
                                                                "deals",
                                                                {
                                                                    ...deal,
                                                                    stage: "Lost",
                                                                }
                                                            )
                                                        }
                                                    >
                                                        ✕ Lost
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </article>
                                ))}

                                {stageDeals.length === 0 && (
                                    <p className="kanban-empty">
                                        No deals
                                    </p>
                                )}
                            </div>
                        </section>
                    );
                })}
            </div>
        </section>
    );
}

export default Deals;