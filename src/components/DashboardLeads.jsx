const stages = ["New", "Contacted", "Qualified", "Proposal", "Won", "Lost"];

function DashboardLeads({ leads }) {
    return <article className="card"><div className="card_header"><div><h2 className="card-title">Lead Summary</h2><p className="body-text">Prospects by stage</p></div><strong>{leads.length} total</strong></div><div className="summary-list">{stages.map((stage) => <div className="summary-list__row" key={stage}><span>{stage}</span><strong>{leads.filter((lead) => lead.stage === stage).length}</strong></div>)}</div></article>;
}

export default DashboardLeads;
