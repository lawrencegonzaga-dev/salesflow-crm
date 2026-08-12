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
