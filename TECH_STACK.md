# K&co FinOps Platform - Technology Stack

## Core Infrastructure & Database

*   **PostgreSQL (via Supabase)**: Main data warehouse for normalized and aggregated billing data, user management, and client records. Configured with SSL for secure cloud database connections.
*   **Sequelize ORM**: Object-Relational Mapping for database operations, migrations, and model management.
*   **Local Storage (Browser)**: Temporary data persistence for CSV uploads and dashboard state management.

## Application & Analytics Layer

*   **Backend API**: 
    *   **Node.js** with **Express.js** (v5.2.1) for RESTful API endpoints
    *   CSV processing and data transformation
    *   Authentication and authorization middleware
    *   File upload handling with Multer
    *   CORS-enabled for frontend communication
*   **Frontend**: 
    *   **React** (v19.2.0) with **Vite** (v7.2.4) as build tool and dev server
    *   **React Router DOM** (v7.11.0) for client-side routing
    *   Multi-tenant dashboard for internal and client users
    *   Component-based architecture with modular views
*   **State Management**: 
    *   **Zustand** (v5.0.9) for global state (authentication, user data)
    *   Local component state with React hooks (useState, useEffect, useMemo)
*   **Data Visualization**: 
    *   **Recharts** (v3.6.0) for charts and graphs (pie charts, line charts, bar charts)
    *   Custom SVG-based visualizations for region breakdowns
    *   **React Window** (v2.2.3) for virtualized lists and tables

## Authentication & Security

*   **JWT** (jsonwebtoken v9.0.3): Token-based authentication for API requests
*   **bcrypt** (v6.0.0): Password hashing and security
*   **Cookie Parser**: Secure cookie handling for authentication tokens

## UI/UX & Styling

*   **Tailwind CSS** (v3.4.17): Utility-first CSS framework for responsive design
*   **Framer Motion** (v12.23.26): Animation library for smooth transitions and interactions
*   **Lucide React** (v0.561.0): Modern icon library for UI icons
*   **Custom Dark Theme**: Dark color scheme (#0f0f11 background) with purple accent (#a02ff1)

## Development & Collaboration Tools

*   **Git**: Version control (GitHub Team mentioned in reference)
*   **Vite**: Fast build tool and development server with HMR (Hot Module Replacement)
*   **ESLint**: Code linting and quality checks
*   **Nodemon**: Auto-restart backend server during development
*   **PostCSS & Autoprefixer**: CSS processing and vendor prefixing

## Data Processing & Utilities

*   **CSV Parser** (v3.2.0): Parse and process CSV billing files
*   **Axios** (v1.13.2): HTTP client for API requests
*   **Nodemailer** (v7.0.11): Email service for verification and notifications
*   **Dotenv**: Environment variable management

## Key Libraries & Dependencies

### Frontend
- `react-dom` (v19.2.0): React rendering
- `react-virtualized-auto-sizer`: Dynamic sizing for virtualized components
- `react-window-infinite-loader`: Infinite scrolling support

### Backend
- `pg` (v8.16.3): PostgreSQL client for Node.js
- `pg-hstore` (v2.3.4): PostgreSQL hstore support
- `multer` (v2.0.2): File upload middleware
- `cookie-parser` (v1.4.7): Cookie parsing middleware
- `cors` (v2.8.5): Cross-Origin Resource Sharing

## Architecture Patterns

*   **RESTful API**: Backend follows REST principles with modular route handlers
*   **Component-Based Architecture**: Frontend uses React functional components with hooks
*   **Separation of Concerns**: 
    *   Backend: Controllers, Services, Routes, Models, Middlewares
    *   Frontend: Components, Views, Store, Utils
*   **Modular Routing**: Dashboard uses nested routing for different views (Overview, Cost Analysis, Optimization, Reports, etc.)

## Deployment & Hosting (Current Setup)

*   **Development**: 
    *   Frontend: Vite dev server (localhost:5173)
    *   Backend: Express server (localhost:5000)
*   **Database**: Supabase (PostgreSQL cloud service)
*   **Authentication**: Clerk cloud service

---

## Comparison with Reference Architecture

### ✅ Currently Implemented
- PostgreSQL database (via Supabase)
- Node.js/Express backend
- React frontend (using Vite instead of Next.js)
- Multi-tenant dashboard structure
- Authentication system (Clerk)

### 🔄 Differences from Reference
- **Frontend**: Using **Vite + React** instead of **Next.js** (faster dev experience, lighter build)
- **Database**: Using **Supabase** (managed PostgreSQL) instead of self-hosted RDS
- **BI Platform**: Not yet integrated (Metabase mentioned in reference)
- **Cloud Infrastructure**: Currently in development, not yet deployed to AWS

### 🚀 Future Considerations (from Reference)
- **Amazon S3**: For raw and clean data lake (multi-cloud billing exports)
- **Amazon RDS**: If moving from Supabase to self-managed PostgreSQL
- **Amazon Athena**: For ad-hoc querying on S3 data
- **EC2/ECS/Lambda**: For ETL jobs and scheduled tasks
- **Vercel**: For frontend hosting (compatible with Vite builds)
- **Metabase Cloud**: For advanced BI and embedded analytics

