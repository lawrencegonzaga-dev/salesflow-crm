import { useState } from "react";

const stages = ["New", "Contacted", "Qualified"];

function LeadForm({ editingLead, onAddLead, onUpdateLead, onCancelEdit }) {
    const [formData, setFormData] = useState({
        name: editingLead?.name ?? "",
        company: editingLead?.company ?? "",
        email: editingLead?.email ?? "",
        phone: editingLead?.phone ?? "",
        stage: editingLead?.stage ?? "New",
        value: editingLead?.value ?? ""
    });

    function handleChange({ target: { name, value } }) {
        setFormData((current) => ({ ...current, [name]: value }));
    }

    function handleSubmit(event) {
        event.preventDefault();
        const lead = { ...formData, value: Number(formData.value) || 0 };
        if (editingLead) onUpdateLead({ ...editingLead, ...lead });
        else onAddLead(lead);
    }

    return (
        <form className="record-form" onSubmit={handleSubmit}>
            <label className="form-group" htmlFor="lead-name">
                <span className="form-label form-label--required">Name</span>
                <input id="lead-name" name="name" type="text" value={formData.name} onChange={handleChange} required />
            </label>

            <label className="form-group" htmlFor="lead-company">
                <span className="form-label form-label--required">Company</span>
                <input id="lead-company" name="company" type="text" value={formData.company} onChange={handleChange} required />
            </label>

            <label className="form-group" htmlFor="lead-email">
                <span className="form-label form-label--required">Email</span>
                <input id="lead-email" name="email" type="email" value={formData.email} onChange={handleChange} required />
            </label>

            <label className="form-group" htmlFor="lead-phone">
                <span className="form-label">Phone</span>
                <input id="lead-phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
            </label>

            <label className="form-group" htmlFor="lead-stage">
                <span className="form-label">Stage</span>
                <select id="lead-stage" name="stage" value={formData.stage} onChange={handleChange}>
                    {stages.map((stage) => <option key={stage} value={stage}>{stage}</option>)}
                </select>
            </label>

            <label className="form-group" htmlFor="lead-value">
                <span className="form-label">Estimated Value</span>
                <input id="lead-value" name="value" type="number" min="0" step="0.01" value={formData.value} onChange={handleChange} />
            </label>

            <div className="form-actions form-actions--right">
                {editingLead && (
                    <button className="button button--ghost" type="button" onClick={onCancelEdit}>
                        Cancel
                    </button>
                )}
                <button className="button button--primary" type="submit">
                    {editingLead ? "Update Lead" : "Add Lead"}
                </button>
            </div>
        </form>
    );
}

export default LeadForm;