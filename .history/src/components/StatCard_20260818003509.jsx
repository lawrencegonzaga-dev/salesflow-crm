function StatCard({ label, value, detail, trend }) {
    return (
        <article className="stat-card">
            <span>{label}</span>
            <strong>{value}</strong>
            <div className="stat-card__footer">
                <small>{detail}</small>
                {trend && (
                    <span className={`stat-change stat-change--${trend.direction === "up" ? "positive" : "negative"}`}>
                        {trend.direction === "up" ? "▲" : "▼"} {trend.value}%
                    </span>
                )}
            </div>
        </article>
    );
}

export default StatCard;