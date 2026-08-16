import { useMemo, useState } from "react";

import LeadForm from "../components/LeadForm";
import LeadTable from "../components/LeadTable";
import LeadPipeline from "../components/LeadPipeline";

import { useCRM } from "../context/CRMContext";

function Leads() {
    const {
        leads,
        saveRecord,
        deleteRecord
    } = useCRM();

    const [editingLead, setEditingLead] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [sortBy, setSortBy] = useState("name-asc");

    const visibleLeads = useMemo(() => {
        const search = searchTerm.trim().toLowerCase();
        const [field, direction] = sortBy.split("-");

        return leads
            .filter((lead) => {
                return (
                    statusFilter === "All" ||
                    lead.status === statusFilter
                );
            })
            .filter((lead) => {
                return [
                    lead.name,
                    lead.company,
                    lead.email,
                    lead.phone,
                    lead.status
                ].some((value) =>
                    String(value ?? "")
                        .toLowerCase()
                        .includes(search)
                );
            })
            .toSorted((first, second) => {
                const firstValue = String(first[field] ?? "");
                const secondValue = String(second[field] ?? "");

                const comparison = firstValue.localeCompare(secondValue);

                return direction === "asc"
                    ? comparison
                    : -comparison;
            });
    }, [leads, searchTerm, statusFilter, sortBy]);

    function saveLead(lead) {
        saveRecord("leads", lead);
        setEditingLead(null);
    }

    function deleteLead(id) {
        deleteRecord("leads", id);
    }

    function editLead(lead) {
        setEditingLead(lead);
    }

    function cancelEdit() {
        setEditingLead(null);
    }

    return (
        <section className="page leads-content">

            <header className="page-header">
                <div>
                    <h1 className="page-title">
                        Leads
                    </h1>

                    <p className="body-text">
                        Manage prospects and track their sales progress.
                    </p>
                </div>
            </header>

            <div className="card">
                <h2 className="card-title">
                    {editingLead ? "Edit lead" : "Add lead"}
                </h2>

                <LeadForm
                    key={editingLead?.id ?? "new"}
                    editingLead={editingLead}
                    onAddLead={saveLead}
                    onUpdateLead={saveLead}
                    onCancelEdit={cancelEdit}
                />
            </div>

            <div className="toolbar">

                <input
                    type="text"
                    aria-label="Search leads"
                    placeholder="Search leads..."
                    value={searchTerm}
                    onChange={(event) =>
                        setSearchTerm(event.target.value)
                    }
                />

                <select
                    aria-label="Filter leads by status"
                    value={statusFilter}
                    onChange={(event) =>
                        setStatusFilter(event.target.value)
                    }
                >
                    <option value="All">All</option>
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Proposal">Proposal</option>
                    <option value="Won">Won</option>
                    <option value="Lost">Lost</option>
                </select>

                <select
                    aria-label="Sort leads"
                    value={sortBy}
                    onChange={(event) =>
                        setSortBy(event.target.value)
                    }
                >
                    <option value="name-asc">
                        Name: A–Z
                    </option>

                    <option value="name-desc">
                        Name: Z–A
                    </option>

                    <option value="company-asc">
                        Company: A–Z
                    </option>

                    <option value="company-desc">
                        Company: Z–A
                    </option>
                </select>

            </div>

            <LeadPipeline leads={visibleLeads} />

            <LeadTable
                leads={visibleLeads}
                onDeleteLead={deleteLead}
                onEditLead={editLead}
            />

        </section>
    );
}

export default Leads;