const stages = ["New", "Qualified", "Proposal", "Negotiation", "Won", "Lost"];

function DashboardDeals({ deals }) {
    const maxCount = Math.max(1, ...stages.map((stage) => deals.filter((deal) => deal.stage === stage).length));
    return <article className="card"><div className="card_header"><div><h2 className="card-title">Deal Pipeline</h2><p className="body-text">Opportunities by stage</p></div></div><div className="pipeline-bars">{stages.map((stage) => { const stageDeals = deals.filter((deal) => deal.stage === stage); const value = stageDeals.reduce((total, deal) => total + Number(deal.value || 0), 0); return <div className="pipeline-row" key={stage}><span>{stage}</span><div className="pipeline-track"><div className="pipeline-fill" style={{ width: `${(stageDeals.length / maxCount) * 100}%` }} /></div><strong title={`${value.toLocaleString()} pipeline value`}>{stageDeals.length}</strong></div>; })}</div></article>;
}

export default DashboardDeals;
