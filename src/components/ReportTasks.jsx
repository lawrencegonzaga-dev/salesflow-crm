function ReportTasks({ completed, pending, overdue }) {
    return (
        <section className="report-section card">
            <div className="card-header">
                <div>
                    <h2 className="card-title">Task Analysis</h2>
                    <p className="card-subtitle">Completion and due-date status</p>
                </div>
            </div>

            <div className="report-metrics">
                <div>
                    <strong>{completed}</strong>
                    <span>Completed</span>
                </div>
                <div>
                    <strong>{pending}</strong>
                    <span>Pending</span>
                </div>
                <div className="report-metrics__danger">
                    <strong>{overdue}</strong>
                    <span>Overdue</span>
                </div>
            </div>
        </section>
    );
}

export default ReportTasks;
