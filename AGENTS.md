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
