import { useMemo } from "react";
import StatCard from "../components/StatCard";
import DashboardLeads from "../components/DashboardLeads";
import DashboardDeals from "../components/DashboardDeals";
import DashboardTasks from "../components/DashboardTasks";
import RecentActivity from "../components/RecentActivity";
import { useCRM } from "../context/CRMContext";

function localDate() { const now = new Date(); return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`; }

function Dashboard() {
    const { contacts = [], leads = [], deals = [], tasks = [], events = [] } = useCRM();
    const today = localDate();
    const activeLeads = leads.filter((lead) => !["Won", "Lost"].includes(lead.stage));
    const openDeals = deals.filter((deal) => !["Won", "Lost"].includes(deal.stage));
    const revenue = deals.filter((deal) => deal.stage === "Won").reduce((total, deal) => total + Number(deal.value || 0), 0);
    const openTasks = tasks.filter((task) => task.status !== "Completed");
    const overdueTasks = openTasks.filter((task) => task.dueDate < today);
    const todayTasks = openTasks.filter((task) => task.dueDate === today);
    const upcomingTasks = openTasks.filter((task) => task.dueDate > today);
    const calendarItems = useMemo(() => [
        ...tasks.map((task) => ({ key: `task-${task.id}`, title: task.title, detail: `Task · ${task.status}`, date: task.dueDate })),
        ...deals.map((deal) => ({ key: `deal-${deal.id}`, title: deal.name, detail: "Deal close date", date: deal.closeDate })),
        ...events.map((event) => ({ key: `event-${event.id}`, title: event.title, detail: "Calendar event", date: event.date }))
    ].filter((item) => item.date >= today).toSorted((first, second) => first.date.localeCompare(second.date)).slice(0, 5), [tasks, deals, events, today]);
    const recentActivities = useMemo(() => [
        ...tasks.slice(-2).reverse().map((task) => ({ key: `recent-task-${task.id}`, title: task.title, detail: `Task assigned to ${task.assignedTo}` })),
        ...deals.slice(-2).reverse().map((deal) => ({ key: `recent-deal-${deal.id}`, title: deal.name, detail: `Deal moved to ${deal.stage}` })),
        ...leads.slice(-1).reverse().map((lead) => ({ key: `recent-lead-${lead.id}`, title: lead.name, detail: `Lead in ${lead.stage}` }))
    ].slice(0, 5), [tasks, deals, leads]);

    return <section className="page dashboard-content">
        <header className="page-header"><div><h1 className="page-title">Dashboard</h1><p className="body-text">A live view of your customer, sales, and task activity.</p></div></header>
        <div className="dashboard-stat"><StatCard label="Total Contacts" value={contacts.length} detail={`${contacts.filter((contact) => contact.status === "Customer").length} customers`} /><StatCard label="Active Leads" value={activeLeads.length} detail={`${leads.filter((lead) => lead.stage === "Qualified").length} qualified`} /><StatCard label="Open Deals" value={openDeals.length} detail={`$${openDeals.reduce((total, deal) => total + Number(deal.value || 0), 0).toLocaleString()} pipeline`} /><StatCard label="Revenue" value={`$${revenue.toLocaleString()}`} detail={`${deals.filter((deal) => deal.stage === "Won").length} won deals`} /></div>
        <div className="dashboard-grid"><DashboardLeads leads={leads} /><DashboardDeals deals={deals} /><DashboardTasks overdue={overdueTasks} today={todayTasks} upcoming={upcomingTasks} /><RecentActivity activities={recentActivities} /></div>
        <RecentActivity title="Upcoming Calendar Items" activities={calendarItems} />
    </section>;
}

export default Dashboard;
