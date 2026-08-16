function RecentActivity({ activities, title = "Recent Activity" }) {
    return <article className="card"><div className="card_header"><h2 className="card-title">{title}</h2></div><ul className="activity-list">{activities.length ? activities.map((activity) => <li key={activity.key}><div><strong>{activity.title}</strong><span>{activity.detail}</span></div>{activity.date && <time>{activity.date}</time>}</li>) : <li>Nothing to show yet.</li>}</ul></article>;
}

export default RecentActivity;
