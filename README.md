# SalesFlow CRM

SalesFlow is a frontend CRM application for managing contacts, leads, deals, tasks, calendar events, and sales workflows.

It is built with React and Vite and focuses on practical React state management, CRM business rules, browser persistence, reusable UI components, accessibility, and automated testing.

## Features

### Dashboard

- CRM summary metrics
- Contact and customer totals
- Active and qualified Lead tracking
- Open Deal pipeline value
- Won revenue tracking
- Task summaries
- Upcoming tasks, Deal close dates, and events
- Workspace highlights
- Quick navigation to CRM records

### Contacts

- Create, edit, and delete Contacts
- Search Contacts
- Active and Inactive views
- Sort by name or company
- Prospect, Customer, and Inactive statuses
- Delete confirmation
- Undo deleted Contacts

### Leads

- Active Lead pipeline
- Board and table views
- Search, filtering, and sorting
- Controlled lifecycle transitions
- Qualified Lead conversion
- Converted and Lost history
- Delete confirmation and Undo

Lead lifecycle:

```text
New -> Contacted -> Qualified -> Converted
 |         |            |
 +---------+------------+----> Lost
```

Rules:

- New Leads begin at `New`.
- Active stages progress sequentially.
- A Lead can be marked `Lost` from any active stage.
- Only a `Qualified` Lead can be converted.
- `Converted` and `Lost` are terminal stages.
- Terminal Leads cannot return to the active pipeline.

Creating a Lead does not automatically create a Contact or Deal.

### Lead Conversion

When a Qualified Lead is converted, SalesFlow:

1. Normalizes the Lead email address.
2. Looks for an existing Contact with the same non-empty normalized email.
3. Reuses the matching Contact when one exists.
4. Otherwise creates a new Contact with status `Prospect`.
5. Creates exactly one new Deal at stage `New`.
6. Links the Deal to the source Lead through `sourceLeadId`.
7. Links the Deal to the resolved Contact through `contactId`.
8. Marks the Lead as `Converted`.

Lead conversion is idempotent. Repeating a conversion cannot create another Deal for the same source Lead.

### Deals

- Board and table views
- Search and stage filtering
- Controlled Deal lifecycle transitions
- Open, Won, and Lost views
- Deal values and expected close dates
- Delete confirmation and Undo

Deal lifecycle:

```text
New -> Qualified -> Proposal -> Negotiation -> Won
                                      |
                                      +-------> Lost
```

Rules:

- Open Deal stages progress sequentially.
- Deals cannot normally skip stages.
- Deals cannot move backward through the normal lifecycle.
- Only a Deal in `Negotiation` can close.
- `Won` and `Lost` are terminal stages.

Creating a Deal directly does not automatically create a Contact.

### Tasks

- Create, edit, and delete Tasks
- Todo, In Progress, and Completed statuses
- Low, Medium, and High priorities
- Due-date tracking
- Search, filtering, and sorting
- Board and table views
- Delete confirmation and Undo

### Calendar

- Monthly calendar
- CRM events
- Task due dates
- Deal close dates
- Event creation, editing, and deletion
- Previous and next month navigation

### Reports

SalesFlow includes summaries for:

- Leads
- Deals
- Tasks
- Pipeline value
- Won revenue
- CRM performance data

### Settings

- Profile information
- Notification preferences
- Default application view
- Light theme
- Dark theme
- System theme
- Demo workspace reset

When `System` is selected, SalesFlow follows the operating-system color preference.

## Persistence

SalesFlow is intentionally a frontend-only application.

CRM workspace data is persisted in browser `localStorage` using:

```text
salesflow-crm-data
```

Current persisted workspace schema:

```text
version: 2
```

The persistence layer handles:

- workspace serialization
- workspace loading
- schema versioning
- migration of supported older workspaces
- collection normalization
- malformed stored-data recovery
- record identity
- creation and update timestamps
- record restoration
- persistence failure reporting

React state updates and browser-storage writes are treated as separate concerns.

If a valid CRM operation succeeds but `localStorage` later fails, the current application state remains usable and SalesFlow displays a persistence warning.

Because there is no backend or cloud database, stored CRM data belongs to the current browser and device.

## Architecture

SalesFlow separates presentation, shared state, CRM business rules, and persistence.

```text
Browser
  |
  v
React Router
  |
  v
AppLayout
  |
  v
Pages + Components
  |
  v
CRMContext
  |
  +---- Domain Rules
  |       |
  |       +---- Leads
  |       |
  |       `---- Deals
  |
  `---- Persistence Utilities
              |
              v
          localStorage
```

Main responsibilities:

```text
Components
    -> presentation and reusable interactions

Pages
    -> feature coordination and local UI state

CRMContext
    -> shared CRM state and actions

Domain Modules
    -> Lead and Deal lifecycle rules

Persistence Utilities
    -> record integrity, loading, migration, and storage
```

## Technical Documentation

More detailed documentation is available in:

- [Architecture](docs/architecture.md)
- [Data Model](docs/data-model.md)
- [State Management](docs/state-management.md)

## Project Structure

```text
salesflow-crm/
|
├── docs/
│   ├── architecture.md
│   ├── data-model.md
│   └── state-management.md
|
├── public/
│   ├── favicon.svg
│   ├── icons.svg
│   └── _redirects
|
├── src/
│   ├── components/
│   │   └── ui/
│   │
│   ├── context/
│   │   └── CRMContext.jsx
│   │
│   ├── data/
│   │   └── navigation.js
│   │
│   ├── domain/
│   │   ├── deals.js
│   │   └── leads.js
│   │
│   ├── hooks/
│   ├── layouts/
│   │   └── AppLayout.jsx
│   ├── pages/
│   ├── styles/
│   ├── utils/
│   │   ├── a11y.js
│   │   └── persistence.js
│   │
│   ├── App.jsx
│   └── main.jsx
|
├── index.html
├── package.json
├── README.md
├── vercel.json
└── vite.config.js
```

## Tech Stack

- React 19
- React Router 7
- Vite 8
- JavaScript
- CSS
- React Context
- Browser `localStorage`
- Vitest
- ESLint
- Prettier
- React Icons

The application does not use:

- Redux
- Zustand
- backend APIs
- authentication services
- external databases

## Getting Started

### Requirements

- Node.js
- npm

### Install Dependencies

```bash
npm install
```

### Start the Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview the Production Build

```bash
npm run preview
```

## Quality Checks

Run the complete project check:

```bash
npm run check
```

Or run checks individually:

```bash
npm run format:check
npm run lint
npm run test
npm run build
```

The automated test suite covers important regression areas including:

- persistence behavior
- malformed stored-data handling
- workspace migration
- CRUD behavior
- record identity and timestamps
- Lead lifecycle rules
- Deal lifecycle rules
- Lead conversion
- duplicate-conversion prevention

## Accessibility

SalesFlow includes accessibility-focused behavior such as:

- keyboard-accessible tabs
- modal focus management
- visible keyboard focus states
- accessible form validation
- `aria-invalid` and error descriptions
- destructive confirmation dialogs
- accessible Toast semantics
- keyboard navigation helpers
- Not Found route handling

## Deployment

SalesFlow builds as a static single-page application.

Create the production bundle with:

```bash
npm run build
```

The generated files are placed in:

```text
dist/
```

Because SalesFlow uses `BrowserRouter`, static hosting requires an SPA fallback so direct navigation to application routes resolves to `index.html`.

### Vercel

```text
Build command: npm run build
Output directory: dist
```

The repository includes `vercel.json` for SPA route fallback.

### Netlify

```text
Build command: npm run build
Publish directory: dist
```

The repository includes `public/_redirects` for Netlify SPA fallback.

This allows routes such as:

```text
/dashboard
/contacts
/leads
/deals
/tasks
/calendar
/reports
/settings
```

to be opened directly without returning a hosting-platform 404.

## Project Scope

SalesFlow is a frontend portfolio CRM focused on demonstrating application architecture and realistic CRM workflows without introducing a backend that the project does not need.

The project focuses on:

- React fundamentals
- shared and local state management
- CRUD behavior
- CRM lifecycle modeling
- domain rules
- browser persistence
- reusable components
- accessibility
- automated testing
- static deployment

The following are intentionally outside the current scope:

- authentication
- server-side APIs
- cloud synchronization
- multi-user authorization
- production databases
- real-time collaboration

This keeps the project focused on frontend engineering fundamentals while still modeling realistic Contacts, Leads, Deals, Tasks, and sales workflows.
