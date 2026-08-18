/* ========================================================= */
/* FILE: src/components/RecentActivity.jsx */
/* ========================================================= */

function RecentActivity({ activities, title = "Recent Activity" }) {
    return (
        <article className="card">
            <div className="card-header">
                <div>
                    <h2 className="card-title">{title}</h2>
                    <p className="card-subtitle">
                        Latest updates from your CRM
                    </p>
                </div>
                {activities.length > 0 && (
                    <span className="badge badge--neutral">
                        {activities.length} items
                    </span>
                )}
            </div>

            {activities.length > 0 ? (
                <ul className="activity-list">
                    {activities.map((activity) => {
                        const icon = getActivityIcon(activity.type);
                        return (
                            <li key={activity.key}>
                                <div className="activity-content">
                                    <span className="activity-icon">{icon}</span>
                                    <div>
                                        <strong>{activity.title}</strong>
                                        <span>{activity.detail}</span>
                                    </div>
                                </div>
                                {activity.date && (
                                    <time className="activity-time">
                                        {formatDate(activity.date)}
                                    </time>
                                )}
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <div className="activity-empty">
                    <span className="empty-icon">📭</span>
                    <p>No recent activity</p>
                </div>
            )}
        </article>
    );
}

function getActivityIcon(type) {
    const icons = {
        task: "✅",
        deal: "💼",
        lead: "🎯",
        event: "📅"
    };
    return icons[type] || "📌";
}

function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.getTime() === today.getTime()) return "Today";
    if (date.getTime() === tomorrow.getTime()) return "Tomorrow";
    if (date.getTime() === yesterday.getTime()) return "Yesterday";
    
    return date.toLocaleDateString("en-US", { 
        month: "short", 
        day: "numeric" 
    });
}

export default RecentActivity;