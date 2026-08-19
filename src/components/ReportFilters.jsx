function ReportFilters({
    reportType,
    startDate,
    endDate,
    onReportTypeChange,
    onStartDateChange,
    onEndDateChange,
}) {
    return (
        <section className="card">
            <div className="card-header">
                <div>
                    <h2 className="card-title">Report filters</h2>
                    <p className="card-subtitle">
                        Date ranges apply to deal close dates and task due dates.
                    </p>
                </div>
            </div>

            <div className="report-filters">
                <label className="form-group" htmlFor="report-type">
                    <span className="form-label">Report type</span>
                    <select
                        id="report-type"
                        value={reportType}
                        onChange={(event) =>
                            onReportTypeChange(event.target.value)
                        }
                    >
                        <option value="All">All reports</option>
                        <option value="Sales">Sales summary</option>
                        <option value="Leads">Lead analysis</option>
                        <option value="Deals">Deal analysis</option>
                        <option value="Tasks">Task analysis</option>
                    </select>
                </label>

                <label className="form-group" htmlFor="report-start">
                    <span className="form-label">From</span>
                    <input
                        id="report-start"
                        type="date"
                        value={startDate}
                        onChange={(event) =>
                            onStartDateChange(event.target.value)
                        }
                    />
                </label>

                <label className="form-group" htmlFor="report-end">
                    <span className="form-label">To</span>
                    <input
                        id="report-end"
                        type="date"
                        value={endDate}
                        onChange={(event) =>
                            onEndDateChange(event.target.value)
                        }
                    />
                </label>
            </div>
        </section>
    );
}

export default ReportFilters;
