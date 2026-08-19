import { useMemo } from "react";

const stages = ["New", "Qualified", "Proposal", "Negotiation", "Won", "Lost"];

function ReportDeals({ deals }) {
    const stageData = useMemo(
        () =>
            stages.map((stage) => {
                const stageDeals = deals.filter((deal) => deal.stage === stage);

                return {
                    stage,
                    count: stageDeals.length,
                    value: stageDeals.reduce(
                        (sum, deal) => sum + Number(deal.value || 0),
                        0
                    ),
                };
            }),
        [deals]
    );

    return (
        <section className="report-section card">
            <div className="card-header">
                <div>
                    <h2 className="card-title">Deal Analysis</h2>
                    <p className="card-subtitle">Deal count and value by stage</p>
                </div>
                <strong>{deals.length} deals</strong>
            </div>

            <div className="report-deals-table">
                <div className="report-deals-table__header">
                    <span>Stage</span>
                    <span>Deals</span>
                    <span>Value</span>
                </div>
                {stageData.map(({ stage, count, value }) => (
                    <div className="report-deals-table__row" key={stage}>
                        <span>{stage}</span>
                        <strong>{count}</strong>
                        <strong>${value.toLocaleString()}</strong>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default ReportDeals;
