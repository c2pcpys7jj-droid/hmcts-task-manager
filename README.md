# HMCTS Task Manager

A simple task management application for the HMCTS Developer Challenge. Built to allow caseworkers to manage their tasks efficiently.

## Stack
- **Backend:** Node.js, Express, TypeScript, SQLite3
- **Frontend:** React, TypeScript, Vite

## Setup Instructions

### 1. Backend
Open a terminal and run:
```bash
cd backend
npm install
npm run dev
```
The API will run on `http://localhost:4000`.

### 2. Frontend
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
The app will run on `http://localhost:5173`.

## API Endpoints

- `GET /api/tasks` - List all tasks
- `POST /api/tasks` - Create a task
- `GET /api/tasks/:id` - Get a specific task
- `PUT /api/tasks/:id` - Update a task
- `PATCH /api/tasks/:id/status` - Update task status
- `DELETE /api/tasks/:id` - Delete a task

## Running Tests
To run the backend Jest tests:
```bash
cd backend
npm test
```
