import LeadRow from "./LeadRow";

function LeadTable({ leads, onDeleteLead, onEditLead }) {
    return <div className="lead-table-wrap"><table className="table"><thead><tr><th>Name</th><th>Company</th><th>Email</th><th>Phone</th><th>Stage</th><th>Value</th><th aria-label="Actions" /></tr></thead><tbody>{leads.length ? leads.map((lead) => <LeadRow key={lead.id} lead={lead} onDeleteLead={onDeleteLead} onEditLead={onEditLead} />) : <tr><td className="lead-table__empty" colSpan="7">No leads match your search or filter.</td></tr>}</tbody></table></div>;
}

export default LeadTable;
