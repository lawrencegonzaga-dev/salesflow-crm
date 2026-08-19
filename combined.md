# SalesFlow CRM - Agent Rules

## Project Identity

SalesFlow CRM is a React 19 + Vite CRM application for managing contacts, leads, deals, tasks, and events. Data persists in localStorage via React Context. No backend.

## Core Rules

- Source code is the final source of truth. Documentation describes intent, not guaranteed truth.
- If documentation conflicts with implementation: inspect the implementation, follow the working architecture, update docs if the change is intentional.
- Do not modify unrelated files.
- Keep changes minimal and focused on the task.

## Coding Conventions

- Functional components with hooks only (no class components).
- Use `useMemo` for derived data calculations.
- Import React and libraries at the top of files.
- Use meaningful, descriptive variable names.
- Follow existing component patterns (see `docs/components.md`).
- Use CSS classes from the existing design system (see `docs/components.md`).

## Safety Boundaries

- Do not delete or restructure existing directories without explicit approval.
- Do not change the localStorage data schema without updating `docs/data-model.md`.
- Do not add new dependencies without explicit approval.
- Do not modify `src/context/CRMContext.jsx` without understanding the full state flow.

## Task Execution Behavior

- Start with `AGENTS.md`, then consult the relevant documentation in `docs/`.
- Read only the files directly related to the task.
- Implement the change, then validate with targeted checks.
- Update documentation only if the change affects architecture or behavior.

## Usage Efficiency

Keep agent usage proportional to the task while preserving correctness.

- For questions that can be answered from the provided context, respond directly without running tools.
- Do not reread files already inspected unless they changed or a specific detail is missing.
- Locate code with targeted `rg` searches before opening files; avoid broad repository scans.
- Read the smallest useful file section instead of printing entire large files.
- Combine closely related read-only checks into one tool call when the output remains easy to review.
- Do not inspect generated output, history folders, dependencies, or unrelated files unless the task requires it.
- Do not use sub-agents for routine or tightly coupled work.
- Keep progress updates brief and send them only when they help the user follow longer work.
- Prefer one focused implementation pass followed by targeted lint or tests for the changed files.
- Run the production build only when changes can affect compilation, bundling, routing, or release behavior.
- Use browser-based visual verification only for meaningful UI or interaction changes.
- Do not repeat a successful check unless a later edit could invalidate it.
- Stop once the requested outcome is implemented, verified proportionally, and documented where required.

## Repository Exploration

Do not scan the entire repository for routine tasks.

Start with:
1. `AGENTS.md`
2. Relevant documentation in `docs/`
3. Files directly related to the task

Expand exploration only when:
- The task crosses multiple architectural areas.
- The relevant documentation is incomplete.
- You encounter unfamiliar patterns.
- You need to trace data flow.
- The initial implementation does not explain the observed behavior.
- Validation reveals an issue requiring investigation.

Avoid unrelated files and directories.

## Autonomy

For routine implementation decisions, proceed without asking for confirmation.

Do not ask about:
- Component names
- Variable names
- Minor styling decisions
- File placement
- Reasonable implementation details

Ask only when:
- Requirements are genuinely ambiguous.
- A destructive operation is required.
- A major architectural change is necessary.
- Security or data integrity could be affected.

## Validation Commands

```bash
npm run dev       # Start development server
npm run build     # Production build
npm run lint      # ESLint check
npm run preview   # Preview production build
```

## Documentation Maintenance

When making an architectural or behavioral change that invalidates documentation:
- Update the affected documentation in the same task.
- Do not rewrite documentation for unrelated changes.
- Keep documentation concise and implementation-focused.

## Project Documentation

Before making significant changes, consult the relevant documentation:

- [Architecture](docs/architecture.md) - How the app is organized
- [Data Model](docs/data-model.md) - Schema & relationships
- [Components](docs/components.md) - UI rules & patterns
- [State Management](docs/state-management.md) - How data flows
- [Development](docs/development.md) - How to work on it
- [Deployment](docs/deployment.md) - How to ship it
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
# SalesFlow — CSS & Application Architecture

```text
SalesFlow
│
├── Foundation
│   ├── Reset
│   ├── Base
│   ├── Variables
│   ├── Spacing
│   ├── Typography
│   ├── Colors
│   ├── Radius
│   └── Shadows
│
├── Application Layout
│   ├── Sidebar
│   ├── Header
│   └── Main
│
├── Page Layouts
│   ├── Dashboard
│   ├── Contacts
│   ├── Leads
│   ├── Deals
│   ├── Tasks
│   ├── Calendar
│   ├── Reports
│   └── Settings
│
└── Components
    ├── Sidebar
    ├── Header
    ├── Toolbar
    ├── Button
    ├── Form
    ├── Card
    ├── Badge
    ├── Table
    ├── Modal
    ├── Kanban
    └── Calendar
```

---

## 1. Foundation

The **Foundation** layer contains the global rules and design tokens used throughout the application.

```text
Foundation
│
├── Reset
├── Base
├── Variables
├── Spacing
├── Typography
├── Colors
├── Radius
└── Shadows
```

### Responsibilities

| Area       | Purpose                                         |
| ---------- | ----------------------------------------------- |
| Reset      | Removes browser default styles                  |
| Base       | Defines global HTML/body styles                 |
| Variables  | Stores reusable design values                   |
| Spacing    | Defines the spacing system                      |
| Typography | Defines fonts, sizes, weights, and line heights |
| Colors     | Defines the application's color system          |
| Radius     | Defines border-radius values                    |
| Shadows    | Defines reusable shadow values                  |

---

## 2. Application Layout

The **Application Layout** controls the overall structure of SalesFlow.

```text
Application Layout
│
├── Sidebar
├── Header
└── Main
```

These elements establish the main application shell that surrounds the individual pages.

---

## 3. Page Layouts

The **Page Layouts** layer contains the structure specific to each major SalesFlow page.

```text
Page Layouts
│
├── Dashboard
├── Contacts
├── Leads
├── Deals
├── Tasks
├── Calendar
├── Reports
└── Settings
```

Each page can compose reusable components from the **Components** layer.

---

## 4. Components

The **Components** layer contains reusable UI components used throughout the application.

```text
Components
│
├── Sidebar
├── Header
├── Toolbar
├── Button
├── Form
├── Card
├── Badge
├── Table
├── Modal
├── Kanban
└── Calendar
```

### Component Responsibilities

| Component | Purpose                                            |
| --------- | -------------------------------------------------- |
| Sidebar   | Application navigation                             |
| Header    | Application-level controls and information         |
| Toolbar   | Page-level actions, search, filtering, and sorting |
| Button    | User actions                                       |
| Form      | User input and data submission                     |
| Card      | Grouping related content                           |
| Badge     | Status and category indicators                     |
| Table     | Structured data presentation                       |
| Modal     | Dialogs and focused interactions                   |
| Kanban    | Visual workflow management                         |
| Calendar  | Date and schedule management                       |

---

# Architecture Overview

```text
                    SALESFLOW
                        │
        ┌───────────────┼────────────────┐
        │               │                │
        ▼               ▼                ▼
   Foundation     Application       Components
                   Layout
        │               │                │
        │               │                ├── Button
        │               │                ├── Form
        │               │                ├── Card
        │               │                ├── Table
        │               │                ├── Modal
        │               │                └── ...
        │               │
        │               ├── Sidebar
        │               ├── Header
        │               └── Main
        │
        └───────────────┐
                        ▼
                  Page Layouts
                        │
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
    Dashboard       Contacts          Leads
        │               │               │
        └───────────────┴───────────────┘
                        │
                        ▼
                 Reusable Components
```

---

## Architecture Rule

The general responsibility of each layer is:

```text
Foundation
    ↓
Defines the visual system

Application Layout
    ↓
Defines the application shell

Page Layouts
    ↓
Defines page-specific structure

Components
    ↓
Provides reusable UI
```

The goal is to keep **global styles, application structure, page structure, and reusable UI components separated** so the SalesFlow codebase remains organized as the application grows.


Yes. Based on what we've established for your CRM, the **pipeline and rules** should be:

### Lead Pipeline

```text
NEW → CONTACTED → QUALIFIED
                  │
                  ▼
              CONVERTED
                  │
                  ▼
            DEAL: QUALIFIED
```

#### Lead rules

| Stage         | Meaning                          | Allowed action                    |
| ------------- | -------------------------------- | --------------------------------- |
| **New**       | Newly captured lead              | Move → Contacted                  |
| **Contacted** | You've reached/contacted them    | Move → Qualified                  |
| **Qualified** | Lead is a real sales opportunity | **Convert to Deal**               |
| **Rejected**  | Lead isn't worth pursuing        | Move to Rejected                  |
| **Converted** | Lead has become a Deal           | No longer active in Lead pipeline |

The important distinction is:

> **Converting a Lead does NOT create a Deal at `New`. It creates the Deal at `Qualified`.**

So:

```text
Lead
  New
   ↓
  Contacted
   ↓
  Qualified
   ↓
  [Convert to Deal]
   ↓
Deal
  Qualified
   ↓
  Proposal
   ↓
  Negotiation
   ├──→ Won
   └──→ Lost
```

### Deal Pipeline

```text
QUALIFIED → PROPOSAL → NEGOTIATION
                          ├──→ WON
                          └──→ LOST
```

And **Won/Lost are terminal**.

So the system should **not** mix these two pipelines:

```text
LEAD PIPELINE
New → Contacted → Qualified → Convert

DEAL PIPELINE
Qualified → Proposal → Negotiation → Won/Lost
```

### What happens to the Contact?

When the Lead is created, the Contact is already created as:

```text
Contact
status: Prospect
```

When the Lead is converted into a Deal, you **don't create another Contact**.

The existing Prospect remains the same person/company, while the Deal represents the sales opportunity.

Then when the Deal reaches **Won**, that's when the Contact can become:

```text
Customer
```

So the overall relationship is:

```text
Contact
  │
  ├── Prospect
  │
  └── Lead
       │
       └── Qualified
            │
            ▼
          Deal
            │
            ├── Qualified
            ├── Proposal
            ├── Negotiation
            │     ├── Won → Contact becomes Customer
            │     └── Lost
```

**Rejected** is a Lead outcome, while **Lost** is a Deal outcome. That's an important distinction for making the CRM feel reasonable rather than like one giant pipeline.
