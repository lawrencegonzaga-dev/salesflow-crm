/* ========================================================= */
/* FILE: src/pages/Deals.jsx */
/* ========================================================= */

import { useMemo, useState } from "react";
import RecordForm from "../components/RecordForm";
import { useCRM } from "../context/CRMContext";

/* ========================================================= */
/* DEAL STAGES */
/* ========================================================= */

const stages = [
    "New",
    "Qualified",
    "Proposal",
    "Negotiation",
    "Won",
];

const finalStages = ["Won", "Lost"];

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
        options: [...stages, "Lost"],
        defaultValue: "New",
    },
    {
        name: "closeDate",
        label: "Expected close date",
        type: "date",
        required: true,
    },
];

/* ========================================================= */
/* MAIN COMPONENT */
/* ========================================================= */

function Deals() {
    const { deals, saveRecord, deleteRecord } = useCRM();

    const [editingDeal, setEditingDeal] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");
    const [stageFilter, setStageFilter] = useState("All");

    /* ========================================================= */
    /* OPEN NEW DEAL */
    /* ========================================================= */

    function openNewDeal() {
        setEditingDeal(null);
        setShowForm(true);
    }

    /* ========================================================= */
    /* OPEN EDIT DEAL */
    /* ========================================================= */

    function openEditDeal(deal) {
        setEditingDeal(deal);
        setShowForm(true);
    }

    /* ========================================================= */
    /* CLOSE FORM */
    /* ========================================================= */

    function closeForm() {
        setEditingDeal(null);
        setShowForm(false);
    }

    /* ========================================================= */
    /* SAVE DEAL */
    /* ========================================================= */

    function saveDeal(deal) {
        saveRecord("deals", {
            ...deal,
            value: Number(deal.value) || 0,
        });

        closeForm();
    }

    /* ========================================================= */
    /* DELETE DEAL */
    /* ========================================================= */

    function deleteDeal(id) {
        if (
            window.confirm(
                "Delete this deal? This cannot be undone."
            )
        ) {
            deleteRecord("deals", id);

            if (editingDeal?.id === id) {
                closeForm();
            }
        }
    }

    /* ========================================================= */
    /* MOVE DEAL TO NEXT STAGE */
    /* ========================================================= */

    function moveToNextStage(deal) {
        /*
         * Lost is a separate terminal state.
         * It cannot automatically move forward.
         */
        if (deal.stage === "Lost") {
            return;
        }

        const currentIndex = stages.indexOf(deal.stage);

        /*
         * Safety check.
         */
        if (currentIndex === -1) {
            return;
        }

        /*
         * Already Won.
         */
        if (currentIndex >= stages.length - 1) {
            return;
        }

        const nextStage = stages[currentIndex + 1];

        saveRecord("deals", {
            ...deal,
            stage: nextStage,
        });
    }

    /* ========================================================= */
    /* MOVE DEAL TO PREVIOUS STAGE */
    /* ========================================================= */

    function moveToPreviousStage(deal) {
        /*
         * Won and Lost can be reopened.
         *
         * They return to Negotiation.
         */
        if (deal.stage === "Won" || deal.stage === "Lost") {
            saveRecord("deals", {
                ...deal,
                stage: "Negotiation",
            });

            return;
        }

        const currentIndex = stages.indexOf(deal.stage);

        /*
         * Safety check.
         */
        if (currentIndex <= 0) {
            return;
        }

        const previousStage = stages[currentIndex - 1];

        saveRecord("deals", {
            ...deal,
            stage: previousStage,
        });
    }

    /* ========================================================= */
    /* MARK DEAL AS LOST */
    /* ========================================================= */

    function markAsLost(deal) {
        if (
            window.confirm(
                `Move "${deal.name}" to Lost?`
            )
        ) {
            saveRecord("deals", {
                ...deal,
                stage: "Lost",
            });
        }
    }

    /* ========================================================= */
    /* MARK DEAL AS WON */
    /* ========================================================= */

    function markAsWon(deal) {
        if (
            window.confirm(
                `Mark "${deal.name}" as Won?`
            )
        ) {
            saveRecord("deals", {
                ...deal,
                stage: "Won",
            });
        }
    }

    /* ========================================================= */
    /* FILTER DEALS */
    /* ========================================================= */

    const visibleDeals = useMemo(() => {
        const search = searchTerm
            .trim()
            .toLowerCase();

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
    }, [
        deals,
        searchTerm,
        stageFilter,
    ]);

    /* ========================================================= */
    /* ACTIVE PIPELINE DEALS */
    /* ========================================================= */

    const activeDeals = useMemo(() => {
        return visibleDeals.filter(
            (deal) =>
                deal.stage !== "Won" &&
                deal.stage !== "Lost"
        );
    }, [visibleDeals]);

    /* ========================================================= */
    /* WON DEALS */
    /* Latest 3 only
     * ========================================================= */

    const wonDeals = useMemo(() => {
        return visibleDeals
            .filter((deal) => deal.stage === "Won")
            .slice(-3)
            .reverse();
    }, [visibleDeals]);

    /* ========================================================= */
    /* LOST DEALS */
    /* Latest 3 only
     * ========================================================= */

    const lostDeals = useMemo(() => {
        return visibleDeals
            .filter((deal) => deal.stage === "Lost")
            .slice(-3)
            .reverse();
    }, [visibleDeals]);

    /* ========================================================= */
    /* DEAL CARD */
    /* ========================================================= */

    function DealCard({ deal }) {
        const currentIndex = stages.indexOf(
            deal.stage
        );

        const canGoPrevious =
            deal.stage === "Won" ||
            deal.stage === "Lost" ||
            currentIndex > 0;

        const canGoNext =
            currentIndex >= 0 &&
            currentIndex < stages.length - 1;

        return (
            <article
                className="deal-card"
                key={deal.id}
            >
                {/* ========================================= */}
                {/* DEAL INFORMATION */}
                {/* ========================================= */}

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
                    {deal.closeDate || "Not set"}
                </small>

                {/* ========================================= */}
                {/* CURRENT STAGE */}
                {/* ========================================= */}

                <span className="badge">
                    {deal.stage}
                </span>

                {/* ========================================= */}
                {/* STAGE CONTROLS */}
                {/* ========================================= */}

                <div className="row-actions">
                    <button
                        type="button"
                        className="button button--sm button--ghost"
                        disabled={!canGoPrevious}
                        onClick={() =>
                            moveToPreviousStage(
                                deal
                            )
                        }
                    >
                        ← Previous
                    </button>

                    <button
                        type="button"
                        className="button button--sm button--ghost"
                        disabled={!canGoNext}
                        onClick={() =>
                            moveToNextStage(
                                deal
                            )
                        }
                    >
                        Next →
                    </button>
                </div>

                {/* ========================================= */}
                {/* FINAL STAGE ACTIONS */}
                {/* ========================================= */}

                {deal.stage !== "Won" &&
                    deal.stage !== "Lost" && (
                        <div className="row-actions">
                            <button
                                type="button"
                                className="button button--sm button--ghost"
                                onClick={() =>
                                    markAsWon(deal)
                                }
                            >
                                ✓ Won
                            </button>

                            <button
                                type="button"
                                className="button button--sm button--danger"
                                onClick={() =>
                                    markAsLost(
                                        deal
                                    )
                                }
                            >
                                Lost
                            </button>
                        </div>
                    )}

                {/* ========================================= */}
                {/* EDIT / DELETE */}
                {/* ========================================= */}

                <div className="row-actions">
                    <button
                        type="button"
                        className="button button--sm button--ghost"
                        onClick={() =>
                            openEditDeal(deal)
                        }
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        className="button button--sm button--danger"
                        onClick={() =>
                            deleteDeal(deal.id)
                        }
                    >
                        Delete
                    </button>
                </div>
            </article>
        );
    }

    /* ========================================================= */
    /* PAGE */
    /* ========================================================= */

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
                        Track opportunities as they
                        progress through your
                        sales pipeline.
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

                        {[
                            "New",
                            "Qualified",
                            "Proposal",
                            "Negotiation",
                            "Won",
                            "Lost",
                        ].map((stage) => (
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
            {/* ACTIVE PIPELINE */}
            {/* ================================================= */}

            <section className="card">

                <div className="card-header">
                    <div>
                        <h2 className="card-title">
                            Active Pipeline
                        </h2>

                        <p className="card-subtitle">
                            Move deals through each
                            stage of the sales process.
                        </p>
                    </div>
                </div>

                <div className="kanban-board">

                    {stages.map((stage) => {

                        const stageDeals =
                            activeDeals.filter(
                                (deal) =>
                                    deal.stage ===
                                    stage
                            );

                        return (
                            <section
                                className="kanban-column"
                                key={stage}
                            >

                                {/* ================================= */}
                                {/* COLUMN HEADER */}
                                {/* ================================= */}

                                <header className="kanban-column_header">

                                    <h2>
                                        {stage}
                                    </h2>

                                    <span className="badge">
                                        {
                                            stageDeals.length
                                        }
                                    </span>

                                </header>

                                {/* ================================= */}
                                {/* COLUMN BODY */}
                                {/* ================================= */}

                                <div className="kanban-column_body">

                                    {stageDeals.map(
                                        (deal) => (
                                            <DealCard
                                                key={
                                                    deal.id
                                                }
                                                deal={
                                                    deal
                                                }
                                            />
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

            {/* ================================================= */}
            {/* WON DEALS */}
            {/* ================================================= */}

            <section className="card">

                <div className="card-header">
                    <div>
                        <h2 className="card-title">
                            Won Deals
                        </h2>

                        <p className="card-subtitle">
                            Latest 3 won deals.
                        </p>
                    </div>
                </div>

                <div className="kanban-board">

                    {wonDeals.map((deal) => (
                        <DealCard
                            key={deal.id}
                            deal={deal}
                        />
                    ))}

                    {wonDeals.length === 0 && (
                        <p className="kanban-empty">
                            No won deals
                        </p>
                    )}

                </div>

            </section>

            {/* ================================================= */}
            {/* LOST DEALS */}
            {/* ================================================= */}

            <section className="card">

                <div className="card-header">
                    <div>
                        <h2 className="card-title">
                            Lost Deals
                        </h2>

                        <p className="card-subtitle">
                            Latest 3 lost deals.
                        </p>
                    </div>
                </div>

                <div className="kanban-board">

                    {lostDeals.map((deal) => (
                        <DealCard
                            key={deal.id}
                            deal={deal}
                        />
                    ))}

                    {lostDeals.length === 0 && (
                        <p className="kanban-empty">
                            No lost deals
                        </p>
                    )}

                </div>

            </section>

        </section>
    );
}

export default Deals;