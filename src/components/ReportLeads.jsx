import { useMemo } from "react";

const stages = ["New", "Contacted", "Qualified", "Proposal", "Won", "Lost"];

function ReportLeads({ leads }) {
    const analysis = useMemo(() => {
        const total = leads.length;
        const qualified = leads.filter(
            (lead) => lead.stage === "Qualified"
        ).length;
        const won = leads.filter((lead) => lead.stage === "Won").length;

        return {
            total,
            qualifiedRate: total ? Math.round((qualified / total) * 100) : 0,
            wonRate: total ? Math.round((won / total) * 100) : 0,
            stages: stages.map((stage) => ({
                stage,
                count: leads.filter((lead) => lead.stage === stage).length,
            })),
        };
    }, [leads]);

    return (
        <section className="report-section card">
            <div className="card-header">
                <div>
                    <h2 className="card-title">Lead Analysis</h2>
                    <p className="card-subtitle">
                        Lead distribution and conversion indicators
                    </p>
                </div>
            </div>

            <div className="report-metrics">
                <div>
                    <strong>{analysis.total}</strong>
                    <span>Total leads</span>
                </div>
                <div>
                    <strong>{analysis.qualifiedRate}%</strong>
                    <span>Qualified rate</span>
                </div>
                <div>
                    <strong>{analysis.wonRate}%</strong>
                    <span>Won rate</span>
                </div>
            </div>

            <div className="report-rows">
                {analysis.stages.map(({ stage, count }) => (
                    <div className="report-row" key={stage}>
                        <span>{stage}</span>
                        <div className="report-bar">
                            <i
                                style={{
                                    width: `${
                                        analysis.total
                                            ? (count / analysis.total) * 100
                                            : 0
                                    }%`,
                                }}
                            />
                        </div>
                        <strong>{count}</strong>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default ReportLeads;
