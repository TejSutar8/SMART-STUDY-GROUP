# SMART STUDY GROUP FINDER

A complete full-stack web app that helps students find study partners by matching **subject**, **skill level**, and **availability time**, with real-time group chat and peer ratings.

## Tech Stack
- **Frontend:** React (Vite), TailwindCSS, React Router, Axios
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT
- **Realtime:** Socket.io

## Project Structure
```
study-group-finder
├── client
│   ├── src
│   │   ├── pages
│   │   ├── components
│   │   ├── services
│   │   ├── context
│   │   ├── App.jsx
│   │   └── main.jsx
├── server
│   ├── controllers
│   ├── routes
│   ├── middleware
│   ├── config
│   ├── prisma
│   └── server.js
└── README.md
```

## Core Features
1. JWT authentication (register/login)
2. User profile with college, skill level, subjects, and availability
3. Study group matching and recommendation
4. Group create/join/leave
5. Dashboard for suggested groups, joined groups, and sessions
6. Real-time group chat with Socket.io
7. Rating study partners

## API Endpoints
### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Users
- `GET /api/users/profile`
- `PUT /api/users/profile`

### Subjects
- `GET /api/subjects`

### Groups
- `POST /api/groups/create`
- `GET /api/groups`
- `POST /api/groups/join`
- `POST /api/groups/leave`

### Messages
- `GET /api/messages/:groupId`
- `POST /api/messages`

### Ratings
- `POST /api/ratings`

## Matching Algorithm
The recommendation logic filters groups based on:
- same `subjectId`
- same or similar `skillLevel` from `UserSubject`
- same `availabilityTime` and `scheduleTime`

Implemented in `server/controllers/groupController.js`.

## Setup Guide

### 1) Install Node.js
Install Node.js v18+ from https://nodejs.org.

### 2) Install PostgreSQL
Install PostgreSQL and ensure service is running.

### 3) Create Database
```sql
CREATE DATABASE study_group_db;
```

### 4) Prisma Setup
From `server` folder:
```bash
npm install
npx prisma generate
```

### 5) Backend Installation
```bash
cd server
npm install
```

### 6) Frontend Installation
```bash
cd client
npm install
```

### 7) Environment Variables
Backend `.env`:
```env
PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/study_group_db"
JWT_SECRET=your_secret_key
```
Frontend `.env`:
```env
VITE_API_URL=http://localhost:5000
```

### 8) Database Migrations
```bash
cd server
npx prisma migrate dev --name init
node prisma/seed.js
```

### 9) Run Locally
Backend:
```bash
cd server
npm install
npx prisma migrate dev
npm run dev
```
Frontend:
```bash
cd client
npm install
npm run dev
```

## Seed Data
- Included in: `server/prisma/seed.js`
- Adds sample subjects, users, user-subject mappings, and a sample group.

## SQL Schema
- Included in: `server/prisma/sql_schema.sql`

## Postman Examples
- Included in: `server/postman_collection.json`
- Import into Postman and set `baseUrl` + `token` variables.

## Tailwind UI Layout
- Landing page hero
- Auth cards (login/register)
- Dashboard with card grid and forms
- Chat panel with message stream
- Profile details card

