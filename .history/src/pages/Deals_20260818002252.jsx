/* ========================================================= */
/* FILE: src/pages/Deals.jsx */
/* ========================================================= */

import { useMemo, useState } from "react";
import RecordForm from "../components/RecordForm";
import { useCRM } from "../context/CRMContext";

const stages = ["New", "Qualified", "Proposal", "Negotiation", "Won", "Lost"];
const fields = [
    { name: "name", label: "Deal name", required: true },
    { name: "company", label: "Company", required: true },
    { name: "value", label: "Value", type: "number", min: "0", required: true },
    { name: "stage", label: "Stage", options: stages, defaultValue: "New" },
    { name: "closeDate", label: "Expected close date", type: "date", required: true }
];

function Deals() {
    const { deals, saveRecord, deleteRecord } = useCRM();
    const [editingDeal, setEditingDeal] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [stageFilter, setStageFilter] = useState("All");

    const visibleDeals = useMemo(() => {
        const search = searchTerm.trim().toLowerCase();
        return deals
            .filter((deal) => stageFilter === "All" || deal.stage === stageFilter)
            .filter((deal) => {
                return [deal.name, deal.company, deal.stage, deal.closeDate, deal.value]
                    .some((value) => String(value ?? "").toLowerCase().includes(search));
            });
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
        saveRecord("deals", { ...deal, value: Number(deal.value) || 0 });
        closeForm();
    }

    function deleteDeal(id) {
        if (window.confirm("Delete this deal? This cannot be undone.")) {
            deleteRecord("deals", id);
            if (editingDeal?.id === id) closeForm();
        }
    }

    return (
        <section className="page">
            <header className="page-header">
                <div>
                    <h1 className="page-title">Deals</h1>
                    <p className="body-text">
                        Track opportunities as they progress through your pipeline.
                    </p>
                </div>
                <div className="page-actions">
                    <button className="button button--primary" type="button" onClick={openNewDeal}>
                        + Add Deal
                    </button>
                </div>
            </header>

            {/* Deal Form */}
            {showForm && (
                <section className="card card--elevated">
                    <div className="card-header card-header--center">
                        <div>
                            <h2 className="card-title">
                                {editingDeal ? "Edit Deal" : "Add Deal"}
                            </h2>
                            <p className="card-subtitle">
                                {editingDeal ? "Update deal details." : "Create a new sales opportunity."}
                            </p>
                        </div>
                        <button className="button button--ghost button--icon" onClick={closeForm}>
                            ✕
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
            )}

            {/* Toolbar */}
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
                            <option key={stage} value={stage}>{stage}</option>
                        ))}
                    </select>
                </div>
            </section>

            {/* Kanban Board */}
            <div className="kanban-board">
                {stages.map((stage) => {
                    const stageDeals = visibleDeals.filter((deal) => deal.stage === stage);
                    return (
                      <section className="kanban-column" key={stage}>
    <header className="kanban-column_header">
        <h2>{stage}</h2>
        <span className="badge">{stageDeals.length}</span>
    </header>
    <div className="kanban-column_body">
                                {stageDeals.map((deal) => (
                                    <article className="deal-card" key={deal.id}>
                                        <h3>{deal.name}</h3>
                                        <p>{deal.company}</p>
                                        <strong>
                                            ${Number(deal.value || 0).toLocaleString()}
                                        </strong>
                                        <small>Close: {deal.closeDate || "Not set"}</small>
                                        <div className="row-actions">
                                            <button
                                                className="button button--sm button--ghost"
                                                onClick={() => openEditDeal(deal)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="button button--sm button--danger"
                                                onClick={() => deleteDeal(deal.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </article>
                                ))}
                                {stageDeals.length === 0 && (
                                    <p className="kanban-empty">No deals</p>
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