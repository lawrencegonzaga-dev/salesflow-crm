function LeadRow({ lead, onDeleteLead, onEditLead }) {
    const value = Number(lead.value || 0).toLocaleString(undefined, {
        style: "currency",
        currency: "USD",
    });

    return (
        <tr>
            <td>{lead.name}</td>
            <td>{lead.company}</td>
            <td>{lead.email}</td>
            <td>{lead.phone || "—"}</td>
            <td>
                <span className="lead-stage">
                    {lead.stage}
                </span>
            </td>
            <td>{value}</td>
            <td>
                <button
                    type="button"
                    onClick={() => onEditLead(lead)}
                >
                    Edit
                </button>

                {/* <button
                    type="button"
                    onClick={() => onDeleteLead(lead.id)}
                >
                    Delete
                </button> */}
            </td>
        </tr>
    );
}

export default LeadRow;