import { useMemo, useState } from "react";
import ReportFilters from "../components/ReportFilters";
import ReportSummary from "../components/ReportSummary";
import ReportLeads from "../components/ReportLeads";
import ReportDeals from "../components/ReportDeals";
import ReportTasks from "../components/ReportTasks";
import { useCRM } from "../context/CRMContext";

function localDate() { const now = new Date(); return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`; }
function inRange(date, start, end) { return Boolean(date) && (!start || date >= start) && (!end || date <= end); }

function Reports() {
    const { leads = [], deals = [], tasks = [] } = useCRM();
    const [reportType, setReportType] = useState("All"); const [startDate, setStartDate] = useState(""); const [endDate, setEndDate] = useState("");
    const today = localDate();
    const filteredDeals = useMemo(() => deals.filter((deal) => inRange(deal.closeDate, startDate, endDate)), [deals, startDate, endDate]);
    const filteredTasks = useMemo(() => tasks.filter((task) => inRange(task.dueDate, startDate, endDate)), [tasks, startDate, endDate]);
    const sales = useMemo(() => { const won = filteredDeals.filter((deal) => deal.stage === "Won"); const lost = filteredDeals.filter((deal) => deal.stage === "Lost"); const closed = won.length + lost.length; return { pipelineValue: filteredDeals.filter((deal) => !["Won", "Lost"].includes(deal.stage)).reduce((sum, deal) => sum + Number(deal.value || 0), 0), wonValue: won.reduce((sum, deal) => sum + Number(deal.value || 0), 0), lostValue: lost.reduce((sum, deal) => sum + Number(deal.value || 0), 0), winRate: closed ? Math.round((won.length / closed) * 100) : 0 }; }, [filteredDeals]);
    const completed = filteredTasks.filter((task) => task.status === "Completed").length;
    const pending = filteredTasks.filter((task) => task.status !== "Completed").length;
    const overdue = filteredTasks.filter((task) => task.status !== "Completed" && task.dueDate < today).length;
    const shows = (type) => reportType === "All" || reportType === type;
    return <section className="page report-content"><header className="page-header"><div><h1 className="page-title">Reports</h1><p className="body-text">Turn CRM activity into useful sales and work insights.</p></div></header><ReportFilters reportType={reportType} startDate={startDate} endDate={endDate} onReportTypeChange={setReportType} onStartDateChange={setStartDate} onEndDateChange={setEndDate} />{shows("Sales") && <ReportSummary {...sales} />}{shows("Leads") && <ReportLeads leads={leads} />}{shows("Deals") && <ReportDeals deals={filteredDeals} />}{shows("Tasks") && <ReportTasks completed={completed} pending={pending} overdue={overdue} />}</section>;
}

export default Reports;
