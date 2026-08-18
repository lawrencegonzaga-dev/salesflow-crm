import { useState } from "react";

const stages = ["New", "Contacted", "Qualified", "Proposal", "Won", "Lost"];

function LeadForm({ editingLead, onAddLead, onUpdateLead, onCancelEdit }) {
    const [formData, setFormData] = useState({ name: editingLead?.name ?? "", company: editingLead?.company ?? "", email: editingLead?.email ?? "", phone: editingLead?.phone ?? "", stage: editingLead?.stage ?? "New", value: editingLead?.value ?? "" });
    function handleChange({ target: { name, value } }) { setFormData((current) => ({ ...current, [name]: value })); }
    function handleSubmit(event) { event.preventDefault(); const lead = { ...formData, value: Number(formData.value) || 0 }; if (editingLead) onUpdateLead({ ...editingLead, ...lead }); else onAddLead(lead); }
    return <form onSubmit={handleSubmit}><div><label htmlFor="name">Name</label><input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required /></div><div><label htmlFor="company">Company</label><input id="company" name="company" type="text" value={formData.company} onChange={handleChange} required /></div><div><label htmlFor="email">Email</label><input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required /></div><div><label htmlFor="phone">Phone</label><input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} /></div><div><label htmlFor="stage">Stage</label><select id="stage" name="stage" value={formData.stage} onChange={handleChange}>{stages.map((stage) => <option key={stage} value={stage}>{stage}</option>)}</select></div><div><label htmlFor="value">Estimated Value</label><input id="value" name="value" type="number" min="0" step="0.01" value={formData.value} onChange={handleChange} /></div><button type="submit">{editingLead ? "Update Lead" : "Add Lead"}</button>{editingLead && <button type="button" onClick={onCancelEdit}>Cancel</button>}</form>;
}

export default LeadForm;
