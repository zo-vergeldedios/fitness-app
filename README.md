# Workout Planner App

A workout planning and tracking application that helps me build structured training programs, log performance, and track progressive overload over time.

Users can organize workouts by day (Monday–Sunday), store exercises per day, and update weights, reps, and sets anytime.

---

## Key Features

- Weekly workout split (Monday–Sunday planning system)
- Track weights, reps, and sets per exercise
- Edit and update workouts anytime
- Persistent data storage using Supabase (PostgreSQL)
- Full CRUD functionality (Create, Read, Update, Delete)
- Error handling and feedback for failed requests
- Component-like UI structure built with vanilla JavaScript
- Client–server communication using Express

---

## Tech Stack

- HTML, CSS, JavaScript (Vanilla)
- Node.js + Express
- PostgreSQL (Supabase)
- REST API architecture
- Async JavaScript (async/await, .then/.catch)

---

## What I Learned

This project helped me move from writing JavaScript to thinking like a full-stack developer.

I practiced:

- DOM manipulation at scale
- Building reusable UI logic without frameworks
- Handling asynchronous operations with async/await
- Debugging server and client failures using .then() and .catch()
- Designing CRUD-based systems
- Structuring frontend and backend communication
- Working with SQL queries through Supabase
- Thinking in data flow (UI → server → database → UI)

---

## Error Handling

I implemented error handling to understand system reliability:

- Server connection failures
- Failed database updates
- Invalid or missing workout data
- API request failures

Instead of silent failures, the app provides clear debugging feedback using .catch() and async error handling on the server.

---

## Setup Instructions

1. Create a `.env` file:

```env
PORT=3000

PG_CONNECTION_STRING="postgresql://postgres:[Database_Password]@db.asdfasd.supabase.co:5432/postgres"
```

2. Install node js on your computer.
3. Run `npm install`, to install the packages listed on package.json.
4. Run the app by opening the index file with Live Server
