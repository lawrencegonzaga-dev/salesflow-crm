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
    const [pendingMove, setPendingMove] = useState(null);

    /*
     * =========================================================
     * FILTER DEALS
     * =========================================================
     */

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

    /*
     * =========================================================
     * FORM
     * =========================================================
     */

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
     * DRAG AND DROP
     * =========================================================
     */

    function handleDragStart(deal) {
        setDraggedDealId(deal.id);
    }

    function handleDragEnd() {
        setDraggedDealId(null);
    }

    /*
     * Check whether a deal is allowed to move
     * to the selected stage.
     */

    function canDropDeal(targetStage) {
        if (!draggedDealId) {
            return true;
        }

        const draggedDeal = deals.find(
            (deal) => deal.id === draggedDealId
        );

        if (!draggedDeal) {
            return false;
        }

        /*
         * Won and Lost are final stages.
         */

        if (
            draggedDeal.stage === "Won" ||
            draggedDeal.stage === "Lost"
        ) {
            return false;
        }

        /*
         * Won and Lost can only be reached
         * from Negotiation.
         */

        if (
            targetStage === "Won" ||
            targetStage === "Lost"
        ) {
            return draggedDeal.stage === "Negotiation";
        }

        /*
         * Normal stages can only move
         * exactly one step forward.
         */

        const currentIndex = stages.indexOf(
            draggedDeal.stage
        );

        const targetIndex = stages.indexOf(
            targetStage
        );

        return targetIndex === currentIndex + 1;
    }

    /*
     * =========================================================
     * HANDLE DROP
     * =========================================================
     *
     * Do NOT immediately update the deal.
     *
     * Instead, create a pending move and ask
     * the user to confirm.
     */

    function handleDrop(targetStage) {
        if (
            !draggedDealId ||
            !canDropDeal(targetStage)
        ) {
            setDraggedDealId(null);
            return;
        }

        const draggedDeal = deals.find(
            (deal) => deal.id === draggedDealId
        );

        if (!draggedDeal) {
            setDraggedDealId(null);
            return;
        }

        setPendingMove({
            deal: draggedDeal,
            targetStage,
        });

        setDraggedDealId(null);
    }

    /*
     * =========================================================
     * CONFIRM STAGE MOVE
     * =========================================================
     */

    function confirmStageMove() {
        if (!pendingMove) {
            return;
        }

        saveRecord("deals", {
            ...pendingMove.deal,
            stage: pendingMove.targetStage,
        });

        setPendingMove(null);
    }

    /*
     * =========================================================
     * CANCEL STAGE MOVE
     * =========================================================
     */

    function cancelStageMove() {
        setPendingMove(null);
    }

    /*
     * =========================================================
     * NEXT STAGE BUTTON
     * =========================================================
     */

    function moveToNextStage(deal) {
        const currentIndex = stages.indexOf(
            deal.stage
        );

        /*
         * Negotiation requires a decision:
         * Won or Lost.
         */

        if (deal.stage === "Negotiation") {
            return;
        }

        /*
         * Won and Lost are final.
         */

        if (
            deal.stage === "Won" ||
            deal.stage === "Lost"
        ) {
            return;
        }

        if (currentIndex === -1) {
            return;
        }

        const nextStage =
            stages[currentIndex + 1];

        /*
         * Do not allow the normal button
         * to directly move to Won or Lost.
         */

        if (
            !nextStage ||
            nextStage === "Won" ||
            nextStage === "Lost"
        ) {
            return;
        }

        saveRecord("deals", {
            ...deal,
            stage: nextStage,
        });
    }

    /*
     * =========================================================
     * WON
     * =========================================================
     */

    function markDealAsWon(deal) {
        if (deal.stage !== "Negotiation") {
            return;
        }

        saveRecord("deals", {
            ...deal,
            stage: "Won",
        });
    }

    /*
     * =========================================================
     * LOST
     * =========================================================
     */

    function markDealAsLost(deal) {
        if (deal.stage !== "Negotiation") {
            return;
        }

        saveRecord("deals", {
            ...deal,
            stage: "Lost",
        });
    }

    /*
     * =========================================================
     * PAGE
     * =========================================================
     */

    return (
        <section className="page">
            {/* ================================================= */}
            {/* PAGE HEADER */}
            {/* ================================================= */}

            <header className="page-header">
                <div>
                    <h1 className="page-title">
                        Deals
                    </h1>

                    <p className="body-text">
                        Track opportunities as they progress
                        through your sales pipeline.
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

            {/* ================================================= */}
            {/* DEAL FORM MODAL */}
            {/* ================================================= */}

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
                            key={
                                editingDeal?.id ??
                                "new"
                            }
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

            {/* ================================================= */}
            {/* DRAG CONFIRMATION MODAL */}
            {/* ================================================= */}

            {pendingMove && (
                <div
                    className="form-overlay"
                    onClick={cancelStageMove}
                >
                    <section
                        className="form-card"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="stage-confirm-title"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <div className="form-card__header">
                            <div>
                                <h2
                                    id="stage-confirm-title"
                                    className="form-card__title"
                                >
                                    Move Deal?
                                </h2>

                                <p className="form-card__subtitle">
                                    Move{" "}
                                    <strong>
                                        "{pendingMove.deal.name}"
                                    </strong>{" "}
                                    from{" "}
                                    <strong>
                                        {pendingMove.deal.stage}
                                    </strong>{" "}
                                    to{" "}
                                    <strong>
                                        {pendingMove.targetStage}
                                    </strong>
                                    ?
                                </p>
                            </div>

                            <button
                                type="button"
                                className="form-card__close"
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

            {/* ================================================= */}
            {/* TOOLBAR */}
            {/* ================================================= */}

            <section className="toolbar">
                <div className="search-field">
                    <input
                        type="text"
                        placeholder="Search deals..."
                        value={searchTerm}
                        onChange={(event) =>
                            setSearchTerm(
                                event.target.value
                            )
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
                            setStageFilter(
                                event.target.value
                            )
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

            {/* ================================================= */}
            {/* KANBAN BOARD */}
            {/* ================================================= */}

            <div className="kanban-board">
                {stages.map((stage) => {
                    const stageDeals =
                        visibleDeals.filter(
                            (deal) =>
                                deal.stage === stage
                        );

                    const isValidDrop =
                        canDropDeal(stage);

                    return (
                        <section
                            className={`kanban-column ${
                                draggedDealId &&
                                isValidDrop
                                    ? "kanban-column--drop-target"
                                    : ""
                            } ${
                                draggedDealId &&
                                !isValidDrop
                                    ? "kanban-column--muted"
                                    : ""
                            }`}
                            key={stage}
                            onDragOver={(event) => {
                                if (isValidDrop) {
                                    event.preventDefault();
                                }
                            }}
                            onDrop={() =>
                                handleDrop(stage)
                            }
                        >
                            {/* ================================= */}
                            {/* COLUMN HEADER */}
                            {/* ================================= */}

                            <header className="kanban-column_header">
                                <h2>{stage}</h2>

                                <span className="badge">
                                    {stageDeals.length}
                                </span>
                            </header>

                            {/* ================================= */}
                            {/* COLUMN BODY */}
                            {/* ================================= */}

                            <div className="kanban-column_body">
                                {stageDeals.map(
                                    (deal) => (
                                        <article
                                            className="deal-card"
                                            key={deal.id}
                                            draggable
                                            onDragStart={() =>
                                                handleDragStart(
                                                    deal
                                                )
                                            }
                                            onDragEnd={
                                                handleDragEnd
                                            }
                                        >
                                            <h3>
                                                {deal.name}
                                            </h3>

                                            <p>
                                                {
                                                    deal.company
                                                }
                                            </p>

                                            <strong>
                                                $
                                                {Number(
                                                    deal.value ||
                                                        0
                                                ).toLocaleString()}
                                            </strong>

                                            <small>
                                                Close:{" "}
                                                {deal.closeDate ||
                                                    "Not set"}
                                            </small>

                                            {/* ========================= */}
                                            {/* ACTIONS */}
                                            {/* ========================= */}

                                            <div className="row-actions">
                                                {/* EDIT */}

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

                                                {/* NEXT STAGE */}

                                                {deal.stage !==
                                                    "Negotiation" &&
                                                    deal.stage !==
                                                        "Won" &&
                                                    deal.stage !==
                                                        "Lost" && (
                                                        <button
                                                            type="button"
                                                            className="button button--sm button--primary"
                                                            onClick={() =>
                                                                moveToNextStage(
                                                                    deal
                                                                )
                                                            }
                                                        >
                                                            Next Stage →
                                                        </button>
                                                    )}

                                                {/* WON / LOST */}

                                                {deal.stage ===
                                                    "Negotiation" && (
                                                    <>
                                                        <button
                                                            type="button"
                                                            className="button button--sm button--primary"
                                                            onClick={() =>
                                                                markDealAsWon(
                                                                    deal
                                                                )
                                                            }
                                                        >
                                                            ✓ Won
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="button button--sm button--danger"
                                                            onClick={() =>
                                                                markDealAsLost(
                                                                    deal
                                                                )
                                                            }
                                                        >
                                                            ✕ Lost
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </article>
                                    )
                                )}

                                {stageDeals.length ===
                                    0 && (
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