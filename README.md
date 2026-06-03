# -Antares- 🏫

**TypeScript-based admin panel and API server for school websites.**

A modern, fully typed school management system built with Node.js/Express (Backend) and React (Frontend), using TypeScript for type safety and better development experience.

## 📁 Repository structure

- `Backend/` — Node.js/Express server with TypeScript (API, authentication, file uploads)
  - `src/` — Source code organized by feature
    - `controllers/` — API request handlers
    - `models/` — Database models
    - `routes/` — API endpoints
    - `middleware/` — Express middleware (auth, CORS, logging)
    - `services/` — Business logic and external integrations
    - `types/` — TypeScript interfaces and types
    - `utils/` — Helper functions
    - `config/` — Configuration management

- `Frontend/` — React admin panel with TypeScript
  - `src/`
    - `components/` — React components
    - `services/` — API client services
    - `hooks/` — Custom React hooks
    - `types/` — TypeScript interfaces
    - `utils/` — Helper functions and utilities
    - `config/` — Configuration

- `maybe/`, `docs/`, `main/` — archived attempts and documentation

## 🚀 Quick start (local development)

**Requirements:** Node.js v16+, npm, and MySQL 5.7+

### Step 1: Setup MySQL Database

First, make sure MySQL is running on your system. Then create the database:

```bash
cd Backend

# Copy environment template
cp .env.example .env

# Edit .env with your MySQL credentials
# (Update MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD if needed)

# Run database setup (creates database & tables)
npm run setup-db
```

**Alternative: Manual setup with MySQL CLI**

```bash
mysql -u root -p

CREATE DATABASE IF NOT EXISTS admin_panel_db;
USE admin_panel_db;

-- Tables will be auto-created by the Node.js setup script
```

### Step 2: Setup Backend

```bash
cd Backend
npm install

# Already did this above, but if not:
npm run setup-db
```

Start backend in development mode:

```bash
npm run dev      # Uses ts-node for direct TypeScript execution
# Server runs on http://localhost:5000
```

**Or for production:**
```bash
npm run build    # Compile TypeScript to dist/
npm start        # Run compiled JavaScript
```

### Step 3: Setup Frontend

```bash
cd ../Frontend
npm install

# Optional: Create .env file
cp .env.example .env

npm run dev   # or npm start
# Frontend runs on http://localhost:3000
```

### Step 4: Build for production

**Backend:**
```bash
cd Backend
npm run build
npm start
```

**Frontend:**
```bash
cd Frontend
npm run build
```

Static files are placed in `Frontend/build/` and can be served by the backend or deployed separately.

## 🔧 Environment variables

### Backend (.env)

```bash
# Server
PORT=5000
NODE_ENV=development

# Database
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=admin_panel_db

# Security
JWT_SECRET=change_me_in_production

# CORS
CORS_ORIGINS=http://localhost:3000,http://192.168.0.224:3000

# Optional: AWS/S3
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
S3_BUCKET=your_bucket
```

### Frontend (.env)

```bash
REACT_APP_API_URL=http://localhost:5000/api
NODE_ENV=development
```

## 📋 Database Schema

**Tables created by setup script:**
- `users` — User accounts with roles (user, admin, teacher)
- `news` — News articles with author and status
- `gallery` — Image galleries with categories
- `content` — Page content (about, contact, etc.)
- `transparency` — School transparency/info documents

**Auto-created indexes:**
- Users by email
- News by author and status
- Gallery by category
- Content by slug

## 🛠 Development commands

**Backend:**
```bash
npm run dev          # Start with ts-node (live reload)
npm run build        # Compile TypeScript
npm run watch        # Watch mode with tsc
npm run setup-db     # Initialize/reset database
npm run lint         # Run ESLint
npm run lint:fix     # Fix linting issues
```

**Frontend:**
```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run type-check   # TypeScript check
```

## 📖 Key project features

✅ **Full TypeScript support** — type-safe code across backend and frontend  
✅ **Structured architecture** — clean separation of concerns  
✅ **Modern React** — functional components with hooks  
✅ **Express.js API** — RESTful endpoints with middleware  
✅ **JWT authentication** — secure token-based auth  
✅ **CORS enabled** — ready for cross-origin requests  
✅ **Database setup** — automated MySQL table creation  
✅ **Error handling** — consistent API responses  
✅ **Custom hooks** — `useForm`, `useAsync` for common patterns  
✅ **Utility services** — validation, storage, formatting helpers  
✅ **ESLint + Prettier** — code quality and formatting  

## 🐛 Troubleshooting

**Database error: "Unknown database 'admin_panel_db'"?**
```bash
# Run the database setup script
cd Backend
npm run setup-db
```

**Backend won't start?**
- Check MySQL is running: `mysql -u root -p`
- Verify `.env` credentials match your MySQL setup
- Check port 5000 is not in use: `lsof -i :5000`
- Run: `npm run setup-db` to initialize database

**Frontend can't reach API?**
- Verify backend is running on `http://localhost:5000`
- Check CORS settings match your frontend URL
- Look at browser console and backend logs

**TypeScript errors?**
- Run `npm run build` to see all errors
- Check `.tsconfig.json` paths are correct
- Run `npm install` to ensure dependencies are updated

## 📚 File structure

```
Backend/src/
├── config/        → Configuration (env, database settings)
├── controllers/   → API handlers
├── middleware/    → Middleware (auth, error handling)
├── models/        → Database models & queries
├── routes/        → API route definitions
├── services/      → Business logic
├── types/         → TypeScript interfaces
├── utils/         → Helper functions
└── index.ts       → Express app setup

Frontend/src/
├── components/    → React components
├── hooks/         → Custom React hooks
├── services/      → API client services
├── types/         → TypeScript interfaces
├── utils/         → Helpers (validation, formatting)
└── config/        → App configuration
```

## 🔐 Database

The project uses **MySQL** for data storage. Models are defined in `Backend/src/models/` using callback-based queries.

**Tables automatically created:**
- Users with roles (admin, teacher, user)
- News with drafts and published status
- Gallery with categories
- Content pages with slug routing
- Transparency/school info

## 📝 License & contributions

This is an educational/school project. Contributions welcome — please open a pull request or contact the repository owner.

---

**Version:** 2.0.0 (TypeScript refactor)  
**Last updated:** December 2025
