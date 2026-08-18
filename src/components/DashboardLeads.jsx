/* ========================================================= */
/* FILE: src/components/DashboardLeads.jsx */
/* ========================================================= */

import { useMemo } from "react";

const stages = ["New", "Contacted", "Qualified", "Proposal", "Won", "Lost"];

function DashboardLeads({ leads }) {
    const total = leads.length;

    const stageCounts = useMemo(() => {
        return stages.map((stage) => ({
            stage,
            count: leads.filter((lead) => lead.stage === stage).length
        }));
    }, [leads]);

    // Calculate conversion rate
    const qualified = leads.filter((lead) => lead.stage === "Qualified").length;
    const won = leads.filter((lead) => lead.stage === "Won").length;
    const conversionRate = total > 0 ? Math.round((qualified / total) * 100) : 0;
    const winRate = total > 0 ? Math.round((won / total) * 100) : 0;

    const maxCount = Math.max(1, ...stageCounts.map((s) => s.count));

    return (
        <article className="card">
            <div className="card-header card-header--center">
                <div>
                    <h2 className="card-title">Lead Summary</h2>
                    <p className="card-subtitle">Prospects by stage</p>
                </div>
                <div className="badge badge--primary">
                    {total} total
                </div>
            </div>

            {/* Quick stats */}
            <div style={{ 
                display: "grid", 
                gridTemplateColumns: "1fr 1fr",
                gap: "var(--space-3)",
                marginBottom: "var(--space-4)"
            }}>
                <div className="stat-mini">
                    <span className="stat-mini-label">Conversion</span>
                    <strong className="stat-mini-value">{conversionRate}%</strong>
                </div>
                <div className="stat-mini">
                    <span className="stat-mini-label">Win Rate</span>
                    <strong className="stat-mini-value">{winRate}%</strong>
                </div>
            </div>

            {/* Stage list with bars */}
            <div className="summary-list">
                {stageCounts.map(({ stage, count }) => {
                    const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
                    return (
                        <div className="summary-list__row" key={stage}>
                            <span>{stage}</span>
                            <div className="summary-bar">
                                <div 
                                    className="summary-bar-fill" 
                                    style={{ 
                                        width: `${percentage}%`,
                                        backgroundColor: getStageColor(stage)
                                    }}
                                />
                            </div>
                            <strong>{count}</strong>
                        </div>
                    );
                })}
            </div>
        </article>
    );
}

// Helper function for stage colors
function getStageColor(stage) {
    const colors = {
        "New": "var(--color-info)",
        "Contacted": "var(--color-action)",
        "Qualified": "var(--color-success)",
        "Proposal": "var(--color-warning)",
        "Won": "var(--color-success)",
        "Lost": "var(--color-danger)"
    };
    return colors[stage] || "var(--color-text-muted)";
}

export default DashboardLeads;