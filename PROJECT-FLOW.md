# SalesFlow CRM — Project Flow Story

A complete walkthrough of how SalesFlow CRM works, how its pages connect, and how data flows through the application.

---

## 🎯 Core Architecture Overview

```
User Opens App
    ↓
main.jsx — Wraps everything in <CRMProvider>
    ↓
App.jsx — Router → AppLayout (Sidebar + Header + Content)
    ↓
8 Pages Rendered via Routes
    ↓
All pages pull data from CRMContext (shared state)
```

**The heart of the app** is `CRMContext.jsx` — it holds ALL data (`contacts`, `leads`, `deals`, `tasks`, `events`, `settings`), saves to localStorage, and exposes `saveRecord()`, `deleteRecord()`, `saveSettings()`, and `resetDemoData()` to every page.

### App Shell (layouts/AppLayout.jsx)

| Piece    | File                  | Responsibility                          |
| -------- | --------------------- | --------------------------------------- |
| Sidebar  | components/Sidebar.jsx | Navigation to all 8 pages               |
| Header   | components/Header.jsx  | Search bar, notifications, profile icon |
| Main     | layouts/AppLayout.jsx  | Content area that renders each page     |

### Routes (App.jsx)

| Path        | Page                       |
| ----------- | -------------------------- |
| `/`         | Dashboard                  |
| `/dashboard`| Dashboard                  |
| `/contacts` | Contacts                   |
| `/leads`    | Leads                      |
| `/deals`    | Deals                      |
| `/tasks`    | Tasks                      |
| `/calendar` | Calendar                   |
| `/reports`  | Reports                    |
| `/settings` | Settings                   |

---

## 🔄 THE COMPLETE DATA FLOW CYCLE

```
User adds a Contact/Lead/Deal/Task/Event
    ↓
Page calls saveRecord(type, data)
    ↓
CRMContext updates shared state
    ↓
useEffect auto-saves to localStorage
    ↓
All other pages re-render with fresh data instantly
    ↓
Dashboard stats update • Calendar shows new item • Reports include new data
```

**Key insight:** Because ALL pages share the same `CRMContext`, data entered on any page **immediately reflects everywhere** — this is the cross-page integration that makes it feel like a real product.

---

## 📊 1. DASHBOARD — "The Command Center"

**Route:** `/` and `/dashboard`

**Purpose:** Gives the salesperson a quick snapshot of their entire business.

### Flow

1. Pulls `contacts`, `leads`, `deals`, `tasks`, `events` from `useCRM()`
2. Computes **4 stat cards**:
   - Total Contacts (+ how many are customers)
   - Active Leads (+ how many are qualified)
   - Open Deals (+ total pipeline value)
   - Revenue (+ won deals count)
3. **Lead Summary widget** — shows leads grouped by stage (New → Won/Lost) with conversion & win rates
4. **Deal Pipeline widget** — shows deals by stage with dollar values
5. **Task Overview widget** — counts Overdue / Today / Upcoming tasks
6. **Recent Activity** — shows last 2 tasks, last 2 deals, last 1 lead as an activity feed
7. **Upcoming Calendar Items** — merges task due dates, deal close dates, and events, filters to future only, shows top 5

### Key Files

| File                           | Role                                     |
| ------------------------------ | ---------------------------------------- |
| `pages/Dashboard.jsx`          | Main dashboard page with all logic       |
| `components/StatCard.jsx`      | Reusable stat card component             |
| `components/DashboardLeads.jsx`| Lead summary by stage with bars          |
| `components/DashboardDeals.jsx`| Deal pipeline by stage with values       |
| `components/DashboardTasks.jsx`| Task overview (overdue/today/upcoming)   |
| `components/RecentActivity.jsx`| Activity feed + upcoming calendar items  |

---

## 👤 2. CONTACTS — "Address Book"

**Route:** `/contacts`

**Purpose:** Manage people and companies.

### Flow

1. Displays all contacts in a table
2. **Add Contact** → opens modal form → `saveRecord("contacts", ...)` → added to shared state → auto-saves to localStorage
3. **Edit Contact** → opens modal prefilled → updates the contact
4. **Delete Contact** → removes from state
5. **Search** — filters by name, company, email, phone
6. **Status filter** — Prospect / Customer / Inactive
7. **Sort** — by name or company A–Z / Z–A

### Key Files

| File                            | Role                                     |
| ------------------------------- | ---------------------------------------- |
| `pages/Contacts.jsx`            | Contacts page with filtering logic       |
| `components/ContactForm.jsx`    | Add/Edit contact form                    |
| `components/ContactTable.jsx`   | Table wrapper                            |
| `components/ContactRow.jsx`     | Single row with edit/delete actions      |
| `components/ContactCard.jsx`    | Card view of a contact                   |

---

## 🎯 3. LEADS — "Prospect Tracking"

**Route:** `/leads`

**Purpose:** Track raw prospects through a sales funnel.

### Flow

1. Shows a **visual pipeline** of 6 stages: New → Contacted → Qualified → Proposal → Won → Lost
2. Each stage shows stacked lead cards
3. Below the pipeline: a **table view** of the same filtered leads
4. **Add / Edit / Delete Lead** — full CRUD via modal
5. **Search, Stage filter, Sort** — all applied in real-time to BOTH the pipeline and the table simultaneously

### Key Files

| File                            | Role                                     |
| ------------------------------- | ---------------------------------------- |
| `pages/Leads.jsx`               | Leads page with filtering logic          |
| `components/LeadForm.jsx`       | Add/Edit lead form                       |
| `components/LeadPipeline.jsx`   | Visual kanban-style pipeline             |
| `components/LeadTable.jsx`      | Table of leads                           |
| `components/LeadRow.jsx`        | Single lead row                          |

---

## 💼 4. DEALS — "Sales Pipeline with Drag & Drop"

**Route:** `/deals`

**Purpose:** Track revenue opportunities — this is the money page.

### Flow

1. **Kanban board** with 6 columns: New → Qualified → Proposal → Negotiation → Won → Lost
2. Each deal card shows: name, company, value, close date
3. ⭐ **Drag & Drop feature** — drag a deal card to another column to change its stage instantly (saved to state)
4. **Add / Edit Deal** — forms with name, company, value, stage, close date
5. **Delete Deal** — with confirmation
6. **Search + Stage filter**

### Key Files

| File                            | Role                                     |
| ------------------------------- | ---------------------------------------- |
| `pages/Deals.jsx`               | Deals page with drag & drop logic        |
| `components/RecordForm.jsx`     | Generic reusable form (driven by fields) |

---

## ✅ 5. TASKS — "Work Management"

**Route:** `/tasks`

**Purpose:** Track what needs to get done.

### Flow

1. Table of all tasks with title, assignedTo, priority, status, due date
2. **Date grouping logic** — auto-classifies each task as:
   - `Overdue` (past due, not completed)
   - `Today`
   - `Upcoming`
   - `Completed`
3. **Add / Edit Task** — title, description, assignedTo, priority (Low/Med/High), status (Todo/In Progress/Completed), due date
4. **Mark Complete** button — one-click status change to "Completed"
5. **Search, Status filter, Priority filter, Due filter, Sort** — extremely filterable

### Key Files

| File                            | Role                                     |
| ------------------------------- | ---------------------------------------- |
| `pages/Tasks.jsx`               | Tasks page with date grouping            |
| `components/TaskForm.jsx`       | Add/Edit task form                       |
| `components/TaskTable.jsx`      | Table of tasks                           |
| `components/TaskRow.jsx`        | Single task row with complete action     |

---

## 📅 6. CALENDAR — "Unified Schedule"

**Route:** `/calendar`

**Purpose:** See everything on one calendar.

### Flow

1. Builds a **monthly calendar grid** (previous/next month, "Today" button)
2. **Merges 3 data sources** onto the calendar:
   - Tasks → shown on their due date
   - Deals → shown on their close date as "Deal name close"
   - Events → standalone events you create
3. **Add / Edit / Delete Event** — full CRUD in a modal
4. Clicking an item lets you edit or delete it

### Key Files

| File                            | Role                                     |
| ------------------------------- | ---------------------------------------- |
| `pages/Calendar.jsx`            | Calendar page merging data sources       |
| `components/CalendarHeader.jsx` | Month navigation controls                |
| `components/CalendarGrid.jsx`   | Monthly grid rendering                   |
| `components/CalendarForm.jsx`   | Add/Edit event form                      |
| `components/CalendarEvent.jsx`  | Single event item                        |

---

## 📈 7. REPORTS — "Business Intelligence"

**Route:** `/reports`

**Purpose:** Analyze performance.

### Flow

1. **Filters** at top: Report type (All/Sales/Leads/Deals/Tasks) + Start date + End date
2. **Sales Summary** — pipeline value, won value, lost value, win rate
3. **Leads Report** — leads by stage breakdown
4. **Deals Report** — deals table (filtered by date range)
5. **Tasks Report** — completed / pending / overdue counts
6. All reports respect the selected **date range** (filters deals by closeDate, tasks by dueDate)

### Key Files

| File                            | Role                                     |
| ------------------------------- | ---------------------------------------- |
| `pages/Reports.jsx`             | Reports page with date filtering         |
| `components/ReportFilters.jsx`  | Report type + date range filters         |
| `components/ReportSummary.jsx`  | Sales summary stats                      |
| `components/ReportLeads.jsx`    | Leads by stage report                    |
| `components/ReportDeals.jsx`    | Deals table report                       |
| `components/ReportTasks.jsx`    | Tasks completion report                  |

---

## ⚙️ 8. SETTINGS — "Personalization"

**Route:** `/settings`

**Purpose:** Customize the app.

### Flow

1. **Appearance** — Light / Dark / System theme (actually sets `data-theme` attribute on `<html>`, so dark mode works globally)
2. **Profile** — update first name, last name, email, phone, company
3. **Notifications** — toggle switches for email, tasks, deals, leads (currently local state only, not saved globally)

### Key Files

| File                    | Role                            |
| ----------------------- | ------------------------------- |
| `pages/Settings.jsx`    | Settings page with theme + profile + notifications |

---

## 🗄️ THE SHARED DATA LAYER (CRMContext)

**File:** `src/context/CRMContext.jsx`

### What it holds

| Collection | Example Fields                                      |
| ---------- | --------------------------------------------------- |
| `contacts` | name, company, email, phone, status                 |
| `leads`    | name, company, email, phone, stage, source, value   |
| `deals`    | name, company, value, stage, closeDate              |
| `tasks`    | title, description, assignedTo, priority, status, dueDate |
| `events`   | title, date, type                                   |
| `settings` | profile (name, email, role) + preferences (theme, notifications) |

### What it exposes

| Method            | Purpose                                         |
| ----------------- | ----------------------------------------------- |
| `saveRecord(type, record)` | Creates a new record or updates an existing one (detects by `id`) |
| `deleteRecord(type, id)`   | Removes a record from the collection           |
| `saveSettings(settings)`   | Replaces the settings object                   |
| `resetDemoData()`          | Restores the original demo data                |

### Persistence

- On app load: reads from `localStorage` (`salesflow-crm-data` key), falls back to demo seed data
- On any state change: auto-saves the entire dataset back to `localStorage`

---

## ✨ THE "WOW" FEATURES (best to highlight in your portfolio)

1. **Drag & drop Kanban** for deals — shows interactivity skills
2. **Cross-page data integration** — add a deal, it appears on Dashboard, Calendar, and Reports
3. **Unified calendar** merging tasks + deals + events
4. **Live search/filter/sort** on multiple pages
5. **Dark mode** actually works
6. **Modular component architecture** — reusable Card, Badge, Button, Modal, Table

---

## 🏗️ Project Structure

```
src/
├── App.jsx                  # Router setup
├── main.jsx                 # Entry point (CRMProvider wrapper)
├── components/              # Reusable UI components
│   ├── DashboardLeads.jsx
│   ├── DashboardDeals.jsx
│   ├── DashboardTasks.jsx
│   ├── RecentActivity.jsx
│   ├── StatCard.jsx
│   ├── ContactForm.jsx
│   ├── ContactTable.jsx
│   ├── ContactRow.jsx
│   ├── ContactCard.jsx
│   ├── LeadForm.jsx
│   ├── LeadTable.jsx
│   ├── LeadRow.jsx
│   ├── LeadPipeline.jsx
│   ├── RecordForm.jsx       # Generic form builder
│   ├── TaskForm.jsx
│   ├── TaskTable.jsx
│   ├── TaskRow.jsx
│   ├── CalendarHeader.jsx
│   ├── CalendarGrid.jsx
│   ├── CalendarForm.jsx
│   ├── CalendarEvent.jsx
│   ├── ReportFilters.jsx
│   ├── ReportSummary.jsx
│   ├── ReportLeads.jsx
│   ├── ReportDeals.jsx
│   ├── ReportTasks.jsx
│   ├── Header.jsx
│   ├── Sidebar.jsx
├── context/
│   └── CRMContext.jsx       # Global state + localStorage persistence
├── data/
│   └── navigation.js        # Sidebar navigation config
├── layouts/
│   └── AppLayout.jsx        # App shell (sidebar + header + main)
├── pages/                   # One file per route
│   ├── Dashboard.jsx
│   ├── Contacts.jsx
│   ├── Leads.jsx
│   ├── Deals.jsx
│   ├── Tasks.jsx
│   ├── Calendar.jsx
│   ├── Reports.jsx
│   └── Settings.jsx
└── styles/                  # CSS architecture (design tokens + components)
```

---

## 🚀 Tech Stack

| Layer       | Technology                                   |
| ----------- | -------------------------------------------- |
| Framework   | React 19                                     |
| Build Tool  | Vite                                         |
| Routing     | React Router 7                               |
| State       | React Context + useReducer-style update logic |
| Persistence | localStorage                                 |
| Styling     | Custom CSS with design tokens (CSS variables) |

---

*Documentation generated for portfolio showcase purposes.*