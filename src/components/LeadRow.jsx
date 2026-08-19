function LeadRow({
  lead,
  onDeleteLead,
  onEditLead,
  onConvertLead,
}) {
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
        <span className="lead-stage">{lead.stage}</span>
      </td>
      <td>{value}</td>
      <td>
        <div className="row-actions">
          <button
            type="button"
            className="button button--sm button--ghost"
            onClick={() => onEditLead(lead)}
          >
            Edit
          </button>
          {lead.stage === "Qualified" && !lead.converted && (
            <button
              type="button"
              className="button button--sm button--primary"
              onClick={() => onConvertLead(lead)}
            >
              Convert
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

export default LeadRow;