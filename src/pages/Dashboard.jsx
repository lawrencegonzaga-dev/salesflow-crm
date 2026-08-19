/* ========================================================= */
/* FILE: src/pages/Dashboard.jsx */
/* ========================================================= */

import { useMemo } from "react";
import { FaCircle } from "react-icons/fa6";
import StatCard from "../components/StatCard";
import DashboardLeads from "../components/DashboardLeads";
import DashboardDeals from "../components/DashboardDeals";
import DashboardTasks from "../components/DashboardTasks";
import RecentActivity from "../components/RecentActivity";
import { useCRM } from "../context/CRMContext";

function localDate() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function Dashboard() {
    const { contacts = [], leads = [], deals = [], tasks = [], events = [] } = useCRM();
    const today = localDate();
    const hasData = useMemo(
        () => [contacts, leads, deals, tasks, events].some((records) => records.length > 0),
        [contacts, leads, deals, tasks, events]
    );

    // Memoized calculations
    const stats = useMemo(() => {
        const activeLeads = leads.filter((lead) => !["Won", "Lost"].includes(lead.stage));
        const openDeals = deals.filter((deal) => !["Won", "Lost"].includes(deal.stage));
        const revenue = deals
            .filter((deal) => deal.stage === "Won")
            .reduce((total, deal) => total + Number(deal.value || 0), 0);
        const customers = contacts.filter((contact) => contact.status === "Customer").length;
        const qualifiedLeads = leads.filter((lead) => lead.stage === "Qualified").length;

        return {
            totalContacts: contacts.length,
            customers,
            activeLeads: activeLeads.length,
            qualifiedLeads,
            openDeals: openDeals.length,
            pipelineValue: openDeals.reduce((total, deal) => total + Number(deal.value || 0), 0),
            revenue,
            wonDeals: deals.filter((deal) => deal.stage === "Won").length
        };
    }, [contacts, leads, deals]);

    // Task calculations
    const taskStats = useMemo(() => {
        const openTasks = tasks.filter((task) => task.status !== "Completed");
        return {
            overdue: openTasks.filter((task) => task.dueDate < today),
            today: openTasks.filter((task) => task.dueDate === today),
            upcoming: openTasks.filter((task) => task.dueDate > today)
        };
    }, [tasks, today]);

    // Calendar items
    const calendarItems = useMemo(() => {
        return [
            ...tasks.map((task) => ({
                key: `task-${task.id}`,
                title: task.title,
                detail: `Task · ${task.status}`,
                date: task.dueDate,
                type: "task"
            })),
            ...deals.map((deal) => ({
                key: `deal-${deal.id}`,
                title: deal.name,
                detail: "Deal close date",
                date: deal.closeDate,
                type: "deal"
            })),
            ...events.map((event) => ({
                key: `event-${event.id}`,
                title: event.title,
                detail: "Calendar event",
                date: event.date,
                type: "event"
            }))
        ]
            .filter((item) => item.date && item.date >= today)
            .sort((a, b) => a.date.localeCompare(b.date))
            .slice(0, 5);
    }, [tasks, deals, events, today]);

    // Recent activities
    const recentActivities = useMemo(() => {
        return [
            ...tasks.slice(-2).reverse().map((task) => ({
                key: `recent-task-${task.id}`,
                title: task.title,
                detail: `Task assigned to ${task.assignedTo}`,
                type: "task"
            })),
            ...deals.slice(-2).reverse().map((deal) => ({
                key: `recent-deal-${deal.id}`,
                title: deal.name,
                detail: `Deal moved to ${deal.stage}`,
                type: "deal"
            })),
            ...leads.slice(-1).reverse().map((lead) => ({
                key: `recent-lead-${lead.id}`,
                title: lead.name,
                detail: `Lead in ${lead.stage}`,
                type: "lead"
            }))
        ].slice(0, 5);
    }, [tasks, deals, leads]);

    return (
        <section className="page">
            {/* Page Header */}
            <header className="page-header">
                <div>
                    <h1 className="page-title">Dashboard</h1>
                    <p className="body-text">
                        A live view of your customer, sales, and task activity.
                    </p>
                </div>
                <div className="page-actions">
                    <span className="badge badge--success">
                        <FaCircle aria-hidden="true" /> Live
                    </span>
                </div>
            </header>

            {!hasData && (
                <div className="card table-empty" role="status">
                    <div className="empty-title">Your dashboard is ready</div>
                    <div className="empty-description">
                        Add contacts, leads, deals, tasks, or events to see CRM insights here.
                    </div>
                </div>
            )}

            {/* Stats Grid */}
            <div className="page-grid--4">
                <StatCard
                    label="Total Contacts"
                    value={stats.totalContacts}
                    detail={`${stats.customers} customers`}
                />
                <StatCard
                    label="Active Leads"
                    value={stats.activeLeads}
                    detail={`${stats.qualifiedLeads} qualified`}
                />
                <StatCard
                    label="Open Deals"
                    value={stats.openDeals}
                    detail={`$${stats.pipelineValue.toLocaleString()} pipeline`}
                />
                <StatCard
                    label="Revenue"
                    value={`$${stats.revenue.toLocaleString()}`}
                    detail={`${stats.wonDeals} won deals`}
                />
            </div>

            {/* Dashboard Grid */}
            <div className="page-grid">
                <DashboardLeads leads={leads} />
                <DashboardDeals deals={deals} />
                <DashboardTasks 
                    overdue={taskStats.overdue} 
                    today={taskStats.today} 
                    upcoming={taskStats.upcoming} 
                />
                <RecentActivity activities={recentActivities} />
            </div>

            {/* Upcoming Calendar */}
            <RecentActivity 
                title="Upcoming Calendar Items" 
                activities={calendarItems} 
            />
        </section>
    );
}

export default Dashboard;
