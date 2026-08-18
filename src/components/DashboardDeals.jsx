/* ========================================================= */
/* FILE: src/components/DashboardDeals.jsx */
/* ========================================================= */

import { useMemo } from "react";

const stages = ["New", "Qualified", "Proposal", "Negotiation", "Won", "Lost"];

function DashboardDeals({ deals }) {
    const stageData = useMemo(() => {
        return stages.map((stage) => {
            const stageDeals = deals.filter((deal) => deal.stage === stage);
            const value = stageDeals.reduce((total, deal) => total + Number(deal.value || 0), 0);
            return {
                stage,
                count: stageDeals.length,
                value,
                deals: stageDeals
            };
        });
    }, [deals]);

    const maxCount = Math.max(1, ...stageData.map((s) => s.count));
    const totalValue = stageData.reduce((sum, s) => sum + s.value, 0);

    return (
        <article className="card">
            <div className="card-header card-header--center">
                <div>
                    <h2 className="card-title">Deal Pipeline</h2>
                    <p className="card-subtitle">Opportunities by stage</p>
                </div>
                <div className="badge badge--success">
                    ${totalValue.toLocaleString()}
                </div>
            </div>

            <div className="pipeline-bars">
                {stageData.map(({ stage, count, value }) => {
                    const percentage = (count / maxCount) * 100;
                    return (
                        <div className="pipeline-row" key={stage}>
                            <span className="pipeline-stage">{stage}</span>
                            <div className="pipeline-track">
                                <div 
                                    className="pipeline-fill" 
                                    style={{ 
                                        width: `${percentage}%`,
                                        backgroundColor: getStageColor(stage)
                                    }}
                                />
                            </div>
                            <div className="pipeline-stats">
                                <strong>{count}</strong>
                                <span className="pipeline-value">
                                    ${value.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </article>
    );
}

function getStageColor(stage) {
    const colors = {
        "New": "var(--color-info)",
        "Qualified": "var(--color-action)",
        "Proposal": "var(--color-warning)",
        "Negotiation": "var(--color-primary-400)",
        "Won": "var(--color-success)",
        "Lost": "var(--color-danger)"
    };
    return colors[stage] || "var(--color-text-muted)";
}

export default DashboardDeals;