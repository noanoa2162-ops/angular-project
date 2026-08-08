# LUMINA — Team & Task Management

An Angular 21 frontend for organizing teams, projects, and tasks through a responsive Kanban workflow.

[![CI](https://github.com/noanoa2162-ops/angular-project/actions/workflows/ci.yml/badge.svg)](https://github.com/noanoa2162-ops/angular-project/actions/workflows/ci.yml)
![Angular](https://img.shields.io/badge/Angular-21-DD0031?logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)

## Highlights

- Team and project workspaces with role-aware navigation
- Kanban board with task status, priority, assignee, and due-date flows
- Authentication guards and JWT request interceptors
- Angular Signals for application state
- Lazy-loaded standalone components
- Responsive Angular Material interface

## Architecture

```text
src/app/
├── components/     Feature and page components
├── guards/         Route authorization
├── interceptors/   Authentication and API error handling
├── models/         Typed API contracts
├── services/       Authentication, teams, projects, and tasks
└── shared/         Reusable layout components
```

The frontend reads its API base URL from `src/environments/`. The public educational REST API used by the project is hosted separately at [tasks-teacher-server.onrender.com](https://tasks-teacher-server.onrender.com); its Node.js/PostgreSQL source is not part of this repository.

## Tech Stack

- Angular 21 and TypeScript 5.9
- Angular Material and CDK
- Angular Signals and RxJS
- SCSS
- Vitest through the Angular test runner

## Run Locally

Prerequisites: Node.js 22+ and npm.

```bash
git clone https://github.com/noanoa2162-ops/angular-project.git
cd angular-project
npm ci
npm start
```

Open `http://localhost:4200`.

## Quality Checks

```bash
npm run test:ci
npm run build
```

GitHub Actions runs both commands for every push and pull request.

## Project Timeline

Originally developed in February 2026. Tests, CI, dependency configuration, and documentation were hardened for portfolio presentation in August 2026.
