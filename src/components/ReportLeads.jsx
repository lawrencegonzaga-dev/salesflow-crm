const stages = ["New", "Contacted", "Qualified", "Proposal", "Won", "Lost"];

function ReportLeads({ leads }) {
    const total = leads.length;
    const qualified = leads.filter((lead) => lead.stage === "Qualified").length;
    const won = leads.filter((lead) => lead.stage === "Won").length;
    return <section className="report-section card"><div className="card_header"><div><h2 className="card-title">Lead Analysis</h2><p className="body-text">Lead distribution and conversion indicators</p></div></div><div className="report-metrics"><div><strong>{total}</strong><span>Total leads</span></div><div><strong>{total ? `${Math.round((qualified / total) * 100)}%` : "0%"}</strong><span>Qualified rate</span></div><div><strong>{total ? `${Math.round((won / total) * 100)}%` : "0%"}</strong><span>Won rate</span></div></div><div className="report-rows">{stages.map((stage) => { const count = leads.filter((lead) => lead.stage === stage).length; return <div className="report-row" key={stage}><span>{stage}</span><div className="report-bar"><i style={{ width: `${total ? (count / total) * 100 : 0}%` }} /></div><strong>{count}</strong></div>; })}</div></section>;
}

export default ReportLeads;
