import { useMemo, useState } from "react";
import LeadForm from "../components/LeadForm";
import LeadTable from "../components/LeadTable";
import LeadPipeline from "../components/LeadPipeline";
import { useCRM } from "../context/CRMContext";

const leadStages = ["New", "Contacted", "Qualified", "Converted"];

function dateAfterDays(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
}

function Leads() {
  const { leads, deals, contacts, saveRecord, deleteRecord } = useCRM();

  const [editingLead, setEditingLead] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState("All");
  const [sortBy, setSortBy] = useState("name-asc");
  const [leadTab, setLeadTab] = useState("active");
  const [pendingMove, setPendingMove] = useState(null);

  const activeCount = leads.filter((lead) => lead.stage !== "Converted" && lead.stage !== "Lost").length;
  const convertedCount = leads.filter((lead) => lead.stage === "Converted").length;
  const lostCount = leads.filter((lead) => lead.stage === "Lost").length;

  const pipelineLeads = useMemo(() => {
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

  const visibleLeads = useMemo(
    () =>
      pipelineLeads.filter((lead) => {
        if (leadTab === "converted") return lead.stage === "Converted";
        if (leadTab === "lost") return lead.stage === "Lost";
        return lead.stage !== "Converted" && lead.stage !== "Lost";
      }),
    [pipelineLeads, leadTab]
  );

  function saveLead(lead) {
    const isNewLead = !editingLead;
    saveRecord("leads", lead);

    if (isNewLead) {
      const existingContact = contacts.find(
        (contact) => contact.email?.toLowerCase() === lead.email?.toLowerCase()
      );
      if (!existingContact) {
        saveRecord("contacts", {
          name: lead.name,
          company: lead.company,
          email: lead.email,
          phone: lead.phone || "",
          status: "Prospect",
        });
      }
    }
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

  function handleMoveLead(lead, newStage) {
    if (newStage === "Lost" && lead.stage === "Qualified") {
      setPendingMove({ lead, newStage });
      return;
    }

    const currentIndex = leadStages.indexOf(lead.stage);
    const newIndex = leadStages.indexOf(newStage);
    if (currentIndex === -1 || newIndex === -1) return;
    if (newIndex !== currentIndex + 1) return;
    setPendingMove({ lead, newStage });
  }

  function confirmMove() {
    if (!pendingMove) return;
    const { lead, newStage } = pendingMove;
    saveRecord("leads", { ...lead, stage: newStage });

    const hasConvertedDeal = deals.some(
      (deal) => deal.sourceLeadId === lead.id
    );

    if (newStage === "Converted" && !hasConvertedDeal) {
      saveRecord("deals", {
        sourceLeadId: lead.id,
        name: `${lead.company || lead.name} opportunity`,
        company: lead.company || "",
        email: lead.email || "",
        phone: lead.phone || "",
        value: Number(lead.value || 0),
        stage: "Proposal",
        closeDate: dateAfterDays(30),
      });
    }

    setPendingMove(null);
  }

  function cancelMove() {
    setPendingMove(null);
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

      <div className="tabs">
        <button
          type="button"
          className={`tab ${leadTab === "active" ? "tab--active" : ""}`}
          onClick={() => setLeadTab("active")}
        >
          Active <span className="tab-count">{activeCount}</span>
        </button>
        <button
          type="button"
          className={`tab ${leadTab === "converted" ? "tab--active" : ""}`}
          onClick={() => setLeadTab("converted")}
        >
          Converted <span className="tab-count">{convertedCount}</span>
        </button>
        <button
          type="button"
          className={`tab ${leadTab === "lost" ? "tab--active" : ""}`}
          onClick={() => setLeadTab("lost")}
        >
          Lost <span className="tab-count">{lostCount}</span>
        </button>
      </div>

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
          <select id="lead-stage" value={stageFilter} onChange={(event) => setStageFilter(event.target.value)}>
            <option value="All">All</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Converted">Converted</option>
            <option value="Lost">Lost</option>
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="lead-sort">Sort</label>
          <select id="lead-sort" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="name-asc">Name: A–Z</option>
            <option value="name-desc">Name: Z–A</option>
            <option value="company-asc">Company: A–Z</option>
            <option value="company-desc">Company: Z–A</option>
          </select>
        </div>
      </section>

      <LeadPipeline
        leads={pipelineLeads}
        onEditLead={editLead}
        onMoveLead={handleMoveLead}
      />

      <section className="card">
        <div className="card-header card-header--center">
          <div>
            <h2 className="card-title">
              {leadTab === "active" ? "Active Leads" : leadTab === "converted" ? "Converted Leads" : "Lost Leads"}
            </h2>
            <p className="card-subtitle">
              {visibleLeads.length} {visibleLeads.length === 1 ? "lead" : "leads"}
            </p>
          </div>
        </div>
        <LeadTable leads={visibleLeads} onDeleteLead={deleteLead} onEditLead={editLead} />
      </section>

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

      {pendingMove && (
        <div className="modal-overlay" onClick={cancelMove}>
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="move-lead-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <h2 id="move-lead-title">Move Lead?</h2>
              <button type="button" className="modal-close" onClick={cancelMove} aria-label="Close">
                ×
              </button>
            </div>
            <div className="modal-body">
              <p className="body-text">
                Are you sure you want to move <strong>{pendingMove.lead.name}</strong> from{" "}
                <strong>{pendingMove.lead.stage}</strong> to <strong>{pendingMove.newStage}</strong>?
              </p>
              <div className="row-actions">
                <button type="button" className="button button--ghost" onClick={cancelMove}>
                  Cancel
                </button>
                <button type="button" className="button button--primary" onClick={confirmMove}>
                  Move to {pendingMove.newStage}
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}

export default Leads;
