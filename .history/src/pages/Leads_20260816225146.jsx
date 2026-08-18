import { useMemo, useState } from "react";

import LeadForm from "../components/LeadForm";
import LeadTable from "../components/LeadTable";
import LeadPipeline from "../components/LeadPipeline";

import { useCRM } from "../context/CRMContext";

function Leads() {
  const { leads, saveRecord, deleteRecord } = useCRM();

  const [editingLead, setEditingLead] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState("All");
  const [sortBy, setSortBy] = useState("name-asc");

  const visibleLeads = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    const [field, direction] = sortBy.split("-");

    return leads
      .filter((lead) => stageFilter === "All" || lead.stage === stageFilter)
      .filter((lead) =>
        [lead.name, lead.company, lead.email, lead.phone, lead.stage].some((value) =>
          String(value ?? "").toLowerCase().includes(search)
        )
      )
      .toSorted((first, second) => {
        const firstValue = String(first[field] ?? "");
        const secondValue = String(second[field] ?? "");
        const comparison = firstValue.localeCompare(secondValue);
        return direction === "asc" ? comparison : -comparison;
      });
  }, [leads, searchTerm, stageFilter, sortBy]);

  function saveLead(lead) {
    saveRecord("leads", lead);
    closeForm();
  }

  function deleteLead(id) {
    if (window.confirm("Delete this lead? This cannot be undone.")) {
      deleteRecord("leads", id);
      if (editingLead?.id === id) closeForm();
    }
  }

  function openNewLead() {
    setEditingLead(null);
    setShowForm(true);
  }

  function editLead(lead) {
    setEditingLead(lead);
    setShowForm(true);
  }

  function closeForm() {
    setEditingLead(null);
    setShowForm(false);
  }

  return (
    <section className="page leads-content">
      <header className="page-header">
        <div>
          <h1 className="page-title">Leads</h1>
          <p className="body-text">Manage prospects and track their sales progress.</p>
        </div>
        <div className="page-actions">
          <button className="button button--primary" type="button" onClick={openNewLead}>
            + Add Lead
          </button>
        </div>
      </header>

      {/* Toolbar */}
      <section className="toolbar">
        <div className="search-field">
          <input
            type="text"
            aria-label="Search leads"
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="lead-stage">Stage</label>
          <select
            id="lead-stage"
            value={stageFilter}
            onChange={(event) => setStageFilter(event.target.value)}
          >
            <option value="All">All</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Proposal">Proposal</option>
            <option value="Won">Won</option>
            <option value="Lost">Lost</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="lead-sort">Sort</label>
          <select
            id="lead-sort"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            <option value="name-asc">Name: A–Z</option>
            <option value="name-desc">Name: Z–A</option>
            <option value="company-asc">Company: A–Z</option>
            <option value="company-desc">Company: Z–A</option>
          </select>
        </div>
      </section>

      {/* Pipeline + Table */}
      <LeadPipeline leads={visibleLeads} onEditLead={editLead} />

      <section className="card">
        <div className="card-header card-header--center">
          <div>
            <h2 className="card-title">Lead List</h2>
            <p className="card-subtitle">
              {visibleLeads.length} {visibleLeads.length === 1 ? "lead" : "leads"}
            </p>
          </div>
        </div>

        <LeadTable leads={visibleLeads} onDeleteLead={deleteLead} onEditLead={editLead} />
      </section>

      {/* Lead Form Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={closeForm}>
          <section className="modal" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingLead ? "Edit Lead" : "Add Lead"}</h2>
              <button type="button" className="modal-close" onClick={closeForm} aria-label="Close">
                ×
              </button>
            </div>
            <div className="modal-body">
              <LeadForm
                key={editingLead?.id ?? "new"}
                editingLead={editingLead}
                onAddLead={saveLead}
                onUpdateLead={saveLead}
                onCancelEdit={closeForm}
              />
            </div>
          </section>
        </div>
      )}
    </section>
  );
}

export default Leads;