# LUMINA ✨

A modern task management and team collaboration platform built with Angular 21.

![LUMINA](https://img.shields.io/badge/LUMINA-Task%20Management-667eea?style=for-the-badge)
![Angular](https://img.shields.io/badge/Angular-21-DD0031?style=for-the-badge&logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)

## 🌟 Features

- **Team Management** - Create and manage teams with role-based access
- **Project Organization** - Organize work into projects with customizable workflows
- **Kanban Boards** - Visual task management with drag-and-drop functionality
- **Task Tracking** - Create, assign, and track tasks with priorities and due dates
- **User Authentication** - Secure login and registration system
- **Responsive Design** - Works seamlessly on desktop and mobile devices

## 🚀 Live Demo

- **Frontend**: Deployed on Render
- **Backend API**: [tasks-teacher-server.onrender.com](https://tasks-teacher-server.onrender.com)

## 🛠️ Tech Stack

### Frontend
- **Framework**: Angular 21 (Standalone Components)
- **UI Components**: Angular Material, Angular CDK
- **Styling**: SCSS with custom design system
- **State Management**: Angular Signals
- **HTTP Client**: Angular HttpClient with interceptors

### Backend
- **Server**: Node.js with Express
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **API**: RESTful API

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Angular CLI (`npm install -g @angular/cli`)

### Setup

1. Clone the repository:
```bash
git clone https://github.com/your-username/angular_project.git
cd angular_project
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
ng serve
```

4. Open your browser and navigate to `http://localhost:4200`

## 🏗️ Project Structure

```
src/
├── app/
│   ├── core/              # Core modules (guards, interceptors, services, models)
│   │   ├── guards/        # Route guards (auth)
│   │   ├── interceptors/  # HTTP interceptors (auth, error handling)
│   │   ├── models/        # TypeScript interfaces
│   │   └── services/      # API services
│   ├── features/          # Feature modules
│   │   ├── auth/          # Login/Register
│   │   ├── board/         # Kanban board
│   │   ├── dashboard/     # User dashboard
│   │   ├── landing/       # Landing page
│   │   ├── projects/      # Project management
│   │   ├── teams/         # Team management
│   │   ├── profile/       # User profile
│   │   └── settings/      # App settings
│   └── shared/            # Shared components (navbar, sidebar, layout)
├── environments/          # Environment configurations
└── styles.scss           # Global styles
```

## 🔧 Configuration

### Environment Variables

The app uses environment files in `src/environments/`:

- `environment.development.ts` - Development settings
- `environment.ts` - Production settings

### Proxy Configuration (Development)

The `proxy.conf.json` file routes API calls to the backend server during development.

## 📝 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| GET | `/api/teams` | Get user's teams |
| POST | `/api/teams` | Create new team |
| GET | `/api/projects` | Get projects |
| POST | `/api/projects` | Create project |
| GET | `/api/tasks` | Get tasks |
| POST | `/api/tasks` | Create task |
| PATCH | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

## 🧪 Testing

```bash
# Run unit tests
ng test

# Run tests with coverage
ng test --coverage
```

## 🏭 Building for Production

```bash
# Build the project
ng build

# Build with production configuration
ng build --configuration=production
```

Build artifacts will be stored in the `dist/` directory.

## 🚀 Deployment

### Render Deployment

1. Connect your GitHub repository to Render
2. Set build command: `npm run build`
3. Set publish directory: `dist/angular-project/browser`
4. Add environment variables if needed

## 📄 License

This project is licensed under the MIT License.

---

Made with ❤️ using Angular
