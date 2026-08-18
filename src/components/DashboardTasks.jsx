    function DashboardTasks({ overdue, today, upcoming }) {
        const groups = [["Overdue", overdue, "dashboard-task--overdue"], ["Today", today, "dashboard-task--today"], ["Upcoming", upcoming, "dashboard-task--upcoming"]];
        return <article className="card"><div className="card_header"><div><h2 className="card-title">Task Overview</h2><p className="body-text">Open work by due date</p></div></div><div className="dashboard-task-groups">{groups.map(([label, tasks, className]) => <div className={`dashboard-task-group ${className}`} key={label}><strong>{tasks.length}</strong><span>{label}</span></div>)}</div></article>;
    }

    export default DashboardTasks;
