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
