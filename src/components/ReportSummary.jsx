function ReportSummary({ pipelineValue, wonValue, lostValue, winRate }) {
    const metrics = [["Total pipeline value", pipelineValue], ["Won value", wonValue], ["Lost value", lostValue], ["Win rate", `${winRate}%`]];
    return <section className="report-section"><h2 className="card-title">Sales Summary</h2><div className="report-summary">{metrics.map(([label, value]) => <article className="stat-card" key={label}><span>{label}</span><strong>{typeof value === "number" ? `$${value.toLocaleString()}` : value}</strong></article>)}</div></section>;
}

export default ReportSummary;
