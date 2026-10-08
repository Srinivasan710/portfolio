# 🚀 DevPortfolio — Full-Stack Developer Portfolio

A production-quality full-stack developer portfolio built with **React + TypeScript** on the frontend and **Node.js + Express + MongoDB** on the backend.

---

## 🌟 Features

- ✅ Responsive across Mobile, Tablet, Laptop, Desktop
- ✅ Dark / Light mode toggle
- ✅ Smooth scroll single-page navigation
- ✅ REST API with Swagger / OpenAPI documentation
- ✅ In-memory fallback (works even without MongoDB)
- ✅ Contact form with frontend + backend validation
- ✅ Project filtering by category
- ✅ Skill progress bars with category tabs
- ✅ Experience timeline
- ✅ MongoDB seed script

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Bootstrap 5, Bootstrap Icons, Axios, React Router v6 |
| Backend | Node.js, Express.js, TypeScript, REST API |
| Database | MongoDB, Mongoose |
| Docs | Swagger / OpenAPI 3.0 |
| Tools | Vite, tsx, dotenv, CORS |

---

## 📁 Project Structure

```
portfolio/
├── client/                    # React frontend
│   ├── src/
│   │   ├── assets/            # Global CSS
│   │   ├── components/        # Reusable UI components
│   │   ├── hooks/             # useApi custom hook
│   │   ├── layouts/           # MainLayout wrapper
│   │   ├── pages/             # Portfolio sections
│   │   ├── services/          # Axios API layer
│   │   ├── types/             # TypeScript interfaces
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
│
├── server/                    # Express backend
│   ├── src/
│   │   ├── config/            # DB + Swagger config
│   │   ├── controllers/       # Route handlers
│   │   ├── data/              # Seed data
│   │   ├── middleware/        # Validation + error handling
│   │   ├── models/            # Mongoose schemas
│   │   ├── routes/            # Express routers
│   │   ├── scripts/           # seed.ts
│   │   ├── services/          # Business logic
│   │   ├── types/             # TypeScript interfaces
│   │   ├── utils/             # ApiError + ApiResponse
│   │   ├── app.ts
│   │   └── server.ts
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## ⚙️ Environment Variables

### Server (`server/.env`)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/portfolio
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Client (`client/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Installation & Running

### 1. Install Server Dependencies
```bash
cd server
npm install
```

### 2. Install Client Dependencies
```bash
cd client
npm install
```

### 3. Run the Backend Server
```bash
cd server
npm run dev
```
> API runs at **http://localhost:5000**  
> Swagger docs at **http://localhost:5000/api-docs**

### 4. Run the Frontend Client
```bash
cd client
npm run dev
```
> App runs at **http://localhost:5173**

---

## 🌱 Seeding the Database

Requires MongoDB to be running:
```bash
cd server
npm run seed
```

> **Note:** The server also works **without MongoDB** using built-in in-memory fallback data.

---

## 📄 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Server & DB health |
| GET | `/api/projects` | All projects (filterable) |
| GET | `/api/projects/:id` | Project by ID |
| POST | `/api/projects` | Create project |
| PUT | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |
| GET | `/api/experiences` | All experiences |
| GET | `/api/experiences/:id` | Experience by ID |
| POST | `/api/experiences` | Create experience |
| PUT | `/api/experiences/:id` | Update experience |
| DELETE | `/api/experiences/:id` | Delete experience |
| GET | `/api/skills` | All skills (filterable) |
| POST | `/api/skills` | Create skill |
| PUT | `/api/skills/:id` | Update skill |
| DELETE | `/api/skills/:id` | Delete skill |
| GET | `/api/services` | All services |
| POST | `/api/services` | Create service |
| PUT | `/api/services/:id` | Update service |
| DELETE | `/api/services/:id` | Delete service |
| POST | `/api/contact` | Submit contact message |
| GET | `/api/contact` | Get all messages |

---

## 📚 Swagger Documentation

Visit **http://localhost:5000/api-docs** after starting the server.

---

## 🏗️ Production Build

```bash
# Build client
cd client
npm run build

# Build server
cd server
npm run build
npm start
```
