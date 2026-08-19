import { useMemo } from "react";

function ReportSummary({ pipelineValue, wonValue, lostValue, winRate }) {
    const metrics = useMemo(
        () => [
            ["Total pipeline value", pipelineValue],
            ["Won value", wonValue],
            ["Lost value", lostValue],
            ["Win rate", `${winRate}%`],
        ],
        [pipelineValue, wonValue, lostValue, winRate]
    );

    return (
        <section className="report-section" aria-labelledby="sales-summary-title">
            <h2 id="sales-summary-title" className="card-title">Sales Summary</h2>
            <div className="report-summary">
                {metrics.map(([label, value]) => (
                    <article className="stat-card" key={label}>
                        <span>{label}</span>
                        <strong>
                            {typeof value === "number"
                                ? `$${value.toLocaleString()}`
                                : value}
                        </strong>
                    </article>
                ))}
            </div>
        </section>
    );
}

export default ReportSummary;
