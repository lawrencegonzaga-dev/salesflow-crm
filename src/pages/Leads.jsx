import { useMemo, useState } from "react";
import LeadForm from "../components/LeadForm";
import LeadTable from "../components/LeadTable";
import LeadPipeline from "../components/LeadPipeline";
import { useCRM } from "../context/CRMContext";

const stages = ["New", "Contacted", "Qualified", "Proposal", "Won", "Lost"];

function Leads() {
    const { leads, saveRecord, deleteRecord } = useCRM();
    const [editingLead, setEditingLead] = useState(null); const [searchTerm, setSearchTerm] = useState(""); const [stageFilter, setStageFilter] = useState("All"); const [sortBy, setSortBy] = useState("name-asc");
    const visibleLeads = useMemo(() => { const search = searchTerm.trim().toLowerCase(); const [field, direction] = sortBy.split("-"); return leads.filter((lead) => stageFilter === "All" || lead.stage === stageFilter).filter((lead) => [lead.name, lead.company, lead.email, lead.phone, lead.stage, lead.source].some((value) => String(value ?? "").toLowerCase().includes(search))).toSorted((first, second) => { const comparison = field === "value" ? Number(first[field] || 0) - Number(second[field] || 0) : String(first[field] ?? "").localeCompare(String(second[field] ?? "")); return direction === "asc" ? comparison : -comparison; }); }, [leads, searchTerm, stageFilter, sortBy]);
    function saveLead(lead) { saveRecord("leads", lead); setEditingLead(null); }
    function deleteLead(id) { if (window.confirm("Delete this lead? This cannot be undone.")) { deleteRecord("leads", id); if (editingLead?.id === id) setEditingLead(null); } }
    return <section className="page leads-content"><header className="page-header"><div><h1 className="page-title">Leads</h1><p className="body-text">Manage prospects and track their sales progress.</p></div></header><div className="card"><h2 className="card-title">{editingLead ? "Edit lead" : "Add lead"}</h2><LeadForm key={editingLead?.id ?? "new"} editingLead={editingLead} onAddLead={saveLead} onUpdateLead={saveLead} onCancelEdit={() => setEditingLead(null)} /></div><div className="toolbar"><input type="text" aria-label="Search leads" placeholder="Search leads..." value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} /><select aria-label="Filter leads by stage" value={stageFilter} onChange={(event) => setStageFilter(event.target.value)}><option value="All">All stages</option>{stages.map((stage) => <option key={stage} value={stage}>{stage}</option>)}</select><select aria-label="Sort leads" value={sortBy} onChange={(event) => setSortBy(event.target.value)}><option value="name-asc">Name: A–Z</option><option value="name-desc">Name: Z–A</option><option value="company-asc">Company: A–Z</option><option value="company-desc">Company: Z–A</option><option value="stage-asc">Stage: A–Z</option><option value="value-desc">Value: high to low</option><option value="value-asc">Value: low to high</option></select></div><LeadPipeline leads={visibleLeads} onEditLead={setEditingLead} /><LeadTable leads={visibleLeads} onDeleteLead={deleteLead} onEditLead={setEditingLead} /></section>;
}

export default Leads;
