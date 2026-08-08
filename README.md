# Order Management System — Frontend

A single-page React application for managing orders, employees, departments, items, suppliers, and stores. Built with **React 19**, **React Router v7**, **Vite**, **Axios**, and **Recharts**.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Routes](#available-routes)
- [Running Tests](#running-tests)
- [Project Structure](#project-structure)
- [Build & Deploy](#build--deploy)

---

## Tech Stack

| Layer | Library / Tool |
|---|---|
| UI Framework | React 19 |
| Routing | React Router v7 |
| HTTP Client | Axios |
| Charts | Recharts |
| Icons | Lucide React |
| Build Tool | Vite 7 |
| Styling | Tailwind CSS v4 + custom CSS tokens |
| State Management | React Context API (Auth, Theme, Notifications) |
| Testing | Vitest + React Testing Library |

---

## Prerequisites

- **Node.js** v22+ (v22.11+ recommended)
- **npm** v10+
- The **backend API** running at `http://localhost:5091` (see [OrderManagementSystem](../OrderManagementSystem))

---

## Getting Started

```bash
# 1. Clone the repository
git clone <URL>
cd OrderManagementSystemFE

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env if your API runs on a different port

# 4. Start the development server
npm run dev
```

The app will be available at **http://localhost:5173**.

---

## Environment Variables

Create a `.env` file in the project root (copy from `.env.example`):

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE` | `http://localhost:5091/api` | Full base URL of the backend REST API |
| `VITE_API_PORT` | `5091` | Port used to auto-construct the API URL when running on a non-localhost host |

> **Note**: Never commit `.env` — it is listed in `.gitignore`. Only `.env.example` should be committed.

---

## Available Routes

| Path | Page | Description |
|---|---|---|
| `/` | → `/dashboard` | Redirects to Dashboard |
| `/dashboard` | Dashboard | KPI stat cards, charts, recent employees |
| `/departments` | Departments | CRUD for departments |
| `/subdepartments` | Sub-Departments | CRUD for sub-departments |
| `/employees` | Employees | CRUD for employees |
| `/items` | Items | CRUD for item catalogue |
| `/suppliers` | Suppliers | CRUD for suppliers |
| `/stores` | Stores | CRUD for stores |

All routes are client-side only — the page never does a full reload (SPA behaviour via `BrowserRouter`).

---

## Running Tests

```bash
# Run all tests once (CI mode)
npm run test

# Run in watch mode during development
npm run test:watch

# Open the Vitest UI browser interface
npm run test:ui
```

Tests live in `src/tests/` organised by type:

```
src/tests/
├── setup.js                        # jest-dom matchers
├── test-utils.jsx                  # custom render with ThemeProvider wrapper
├── services/
│   ├── authService.test.js
│   └── employeeService.test.js
├── hooks/
│   └── usePaginatedResource.test.jsx
└── components/
    ├── Button.test.jsx
    ├── Input.test.jsx
    └── Tag.test.jsx
```

---

## Project Structure

```
src/
├── api/            # Axios client (auth token injection, 401 refresh)
├── components/     # Reusable UI components (Button, Input, Table, Modal, …)
├── forms/          # Form layout helpers
├── hooks/          # Custom React hooks (useApiResource, usePaginatedResource, …)
├── layout/         # AppLayout, Grid
├── modals/         # Composite modal components (ItemModal, DeleteConfirmModal)
├── pages/          # Route-level page components
├── providers/      # React Context providers (Auth, Theme, Notification)
├── services/       # API service functions (CRUD per entity)
├── tests/          # Vitest + RTL unit tests
├── tokens/         # Design token definitions (theme colours, typography)
└── utils/          # Shared utilities (normalizeKeys, enums, …)
```

---

## Build & Deploy

```bash
# Create a production build
npm run build

# Preview the production build locally
npm run preview
```

The output is placed in the `dist/` directory and can be deployed to any static host (Netlify, Vercel, Azure Static Web Apps, etc.).

1. Connect your GitHub repository to Netlify.
2. Set **Build command**: `npm run build`
3. Set **Publish directory**: `dist`
4. Add environment variables in Vercel dashboard.
5. Vercel will automatically redeploy on every push to `main`.

