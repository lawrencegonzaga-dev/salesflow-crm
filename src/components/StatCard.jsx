import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";

function StatCard({ label, value, detail, trend }) {
    const TrendIcon = trend?.direction === "up"
        ? FaArrowTrendUp
        : FaArrowTrendDown;

    return (
        <article className="stat-card">
            <span>{label}</span>
            <strong>{value}</strong>
            <div className="stat-card__footer">
                <small>{detail}</small>
                {trend && (
                    <span className={`stat-change stat-change--${trend.direction === "up" ? "positive" : "negative"}`}>
                        <TrendIcon aria-hidden="true" /> {trend.value}%
                    </span>
                )}
            </div>
        </article>
    );
}

export default StatCard;
