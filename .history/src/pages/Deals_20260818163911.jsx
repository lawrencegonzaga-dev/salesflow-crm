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
        options: [...stages, ...finalStages],
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
    const {
        deals,
        saveRecord,
        deleteRecord,
    } = useCRM();

    const [editingDeal, setEditingDeal] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [stageFilter, setStageFilter] = useState("All");
    const [draggedDealId, setDraggedDealId] = useState(null);

    /* ========================================================= */
    /* SEARCH + FILTER */
    /* ========================================================= */

    const visibleDeals = useMemo(() => {
        const search = searchTerm.trim().toLowerCase();

        return deals
            .filter((deal) => {
                if (stageFilter === "All") {
                    return true;
                }

                return deal.stage === stageFilter;
            })
            .filter((deal) => {
                return [
                    deal.name,
                    deal.company,
                    deal.stage,
                    deal.closeDate,
                    deal.value,
                ].some((value) =>
                    String(value ?? "")
                        .toLowerCase()
                        .includes(search)
                );
            });
    }, [
        deals,
        searchTerm,
        stageFilter,
    ]);

    /* ========================================================= */
    /* RECENT WON / LOST */
    /* ========================================================= */

    const recentWonDeals = useMemo(() => {
        return deals
            .filter((deal) => deal.stage === "Won")
            .sort((first, second) => {
                const firstDate =
                    first.updatedAt ||
                    first.closeDate ||
                    "";

                const secondDate =
                    second.updatedAt ||
                    second.closeDate ||
                    "";

                return secondDate.localeCompare(firstDate);
            })
            .slice(0, 3);
    }, [deals]);

    const recentLostDeals = useMemo(() => {
        return deals
            .filter((deal) => deal.stage === "Lost")
            .sort((first, second) => {
                const firstDate =
                    first.updatedAt ||
                    first.closeDate ||
                    "";

                const secondDate =
                    second.updatedAt ||
                    second.closeDate ||
                    "";

                return secondDate.localeCompare(firstDate);
            })
            .slice(0, 3);
    }, [deals]);

    /* ========================================================= */
    /* FORM */
    /* ========================================================= */

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

    /* ========================================================= */
    /* DELETE */
    /* ========================================================= */

    function deleteDeal(id) {
        const deal = deals.find(
            (item) => item.id === id
        );

        if (
            window.confirm(
                `Delete "${deal?.name ?? "this deal"}"? This cannot be undone.`
            )
        ) {
            deleteRecord("deals", id);

            if (editingDeal?.id === id) {
                closeForm();
            }
        }
    }

    /* ========================================================= */
    /* DRAG & DROP */
    /* ========================================================= */

    function handleDragStart(deal) {
        setDraggedDealId(deal.id);
    }

    function handleDragEnd() {
        setDraggedDealId(null);
    }

    function handleDrop(stage) {
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

        if (draggedDeal.stage === stage) {
            setDraggedDealId(null);
            return;
        }

        saveRecord("deals", {
            ...draggedDeal,
            stage,
        });

        setDraggedDealId(null);
    }

    /* ========================================================= */
    /* RENDER */
    /* ========================================================= */

    return (
        <section className="page">
            {/* ================================================= */
                PAGE HEADER
            ================================================= */}

            <header className="page-header">
                <div>
                    <h1 className="page-title">
                        Deals
                    </h1>

                    <p className="body-text">
                        Track opportunities as they progress
                        through your pipeline.
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

            {/* ================================================= */
                DEAL FORM MODAL
            ================================================= */}

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

            {/* ================================================= */
                TOOLBAR
            ================================================= */}

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
                            All active stages
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

            {/* ================================================= */
                ACTIVE PIPELINE
            ================================================= */}

            <section className="deals-section">
                <div className="section-header">
                    <div>
                        <h2 className="section-title">
                            Active Pipeline
                        </h2>

                        <p className="body-text">
                            Move deals through the sales
                            pipeline using drag and drop.
                        </p>
                    </div>
                </div>

                <div className="kanban-board">
                    {stages.map((stage) => {
                        const stageDeals =
                            visibleDeals.filter(
                                (deal) =>
                                    deal.stage === stage
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
                                                    {
                                                        deal.name
                                                    }
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

                                                    <button
                                                        type="button"
                                                        className="button button--sm button--danger"
                                                        onClick={() =>
                                                            deleteDeal(
                                                                deal.id
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </button>
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

            {/* ================================================= */
                RECENT WON
            ================================================= */}

            <section className="card deals-final-section">
                <div className="card-header">
                    <div>
                        <h2 className="card-title">
                            Recently Won
                        </h2>

                        <p className="card-subtitle">
                            Latest 3 completed wins
                        </p>
                    </div>
                </div>

                {recentWonDeals.length === 0 ? (
                    <div className="table-empty">
                        <div className="empty-icon">
                            🏆
                        </div>

                        <div className="empty-title">
                            No won deals
                        </div>

                        <div className="empty-description">
                            Deals moved to Won will appear
                            here.
                        </div>
                    </div>
                ) : (
                    <div className="table-wrap">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Deal</th>
                                    <th>Company</th>
                                    <th>Value</th>
                                    <th>Close Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {recentWonDeals.map(
                                    (deal) => (
                                        <tr key={deal.id}>
                                            <td>
                                                <strong>
                                                    {
                                                        deal.name
                                                    }
                                                </strong>
                                            </td>

                                            <td>
                                                {
                                                    deal.company
                                                }
                                            </td>

                                            <td>
                                                $
                                                {Number(
                                                    deal.value ||
                                                        0
                                                ).toLocaleString()}
                                            </td>

                                            <td>
                                                {
                                                    deal.closeDate
                                                }
                                            </td>

                                            <td>
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

                                                    <button
                                                        type="button"
                                                        className="button button--sm button--danger"
                                                        onClick={() =>
                                                            deleteDeal(
                                                                deal.id
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            {/* ================================================= */
                RECENT LOST
            ================================================= */}

            <section className="card deals-final-section">
                <div className="card-header">
                    <div>
                        <h2 className="card-title">
                            Recently Lost
                        </h2>

                        <p className="card-subtitle">
                            Latest 3 lost opportunities
                        </p>
                    </div>
                </div>

                {recentLostDeals.length === 0 ? (
                    <div className="table-empty">
                        <div className="empty-icon">
                            📉
                        </div>

                        <div className="empty-title">
                            No lost deals
                        </div>

                        <div className="empty-description">
                            Deals moved to Lost will appear
                            here.
                        </div>
                    </div>
                ) : (
                    <div className="table-wrap">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Deal</th>
                                    <th>Company</th>
                                    <th>Value</th>
                                    <th>Close Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {recentLostDeals.map(
                                    (deal) => (
                                        <tr key={deal.id}>
                                            <td>
                                                <strong>
                                                    {
                                                        deal.name
                                                    }
                                                </strong>
                                            </td>

                                            <td>
                                                {
                                                    deal.company
                                                }
                                            </td>

                                            <td>
                                                $
                                                {Number(
                                                    deal.value ||
                                                        0
                                                ).toLocaleString()}
                                            </td>

                                            <td>
                                                {
                                                    deal.closeDate
                                                }
                                            </td>

                                            <td>
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

                                                    <button
                                                        type="button"
                                                        className="button button--sm button--danger"
                                                        onClick={() =>
                                                            deleteDeal(
                                                                deal.id
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </section>
    );
}

export default Deals;