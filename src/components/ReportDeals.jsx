const stages = ["New", "Qualified", "Proposal", "Negotiation", "Won", "Lost"];

function ReportDeals({ deals }) {
    const total = deals.length;
    return <section className="report-section card"><div className="card_header"><div><h2 className="card-title">Deal Analysis</h2><p className="body-text">Deal count and value by stage</p></div><strong>{total} deals</strong></div><div className="report-deals-table"><div className="report-deals-table__header"><span>Stage</span><span>Deals</span><span>Value</span></div>{stages.map((stage) => { const stageDeals = deals.filter((deal) => deal.stage === stage); const value = stageDeals.reduce((sum, deal) => sum + Number(deal.value || 0), 0); return <div className="report-deals-table__row" key={stage}><span>{stage}</span><strong>{stageDeals.length}</strong><strong>${value.toLocaleString()}</strong></div>; })}</div></section>;
}

export default ReportDeals;
