# Student Management System

A full-stack CRUD web application for managing student records. Built with React, TypeScript, and Supabase (PostgreSQL database with auto-generated REST API).

## Project Overview

The Student Management System allows users to add, view, edit, delete, search, and filter student records through a clean, responsive web interface. All data is persisted in a PostgreSQL database via Supabase, which automatically provides a REST API.

## Problem Statement

Educational institutions need a simple, reliable way to manage student information. Manual record-keeping is error-prone and hard to search. This system digitizes student records with proper validation, search, and a professional UI.

## Objectives

- Implement full CRUD operations (Create, Read, Update, Delete)
- Validate form inputs on both client and server side
- Display meaningful success and error messages
- Provide search and filter functionality
- Build a responsive, professional UI that works on desktop and mobile

## Features

1. **Add a student** — form with validation for all fields
2. **View all students** — sortable table with ID, name, email, phone, department, year, CGPA
3. **View a single student** — edit modal pre-populates student data
4. **Edit/update a student** — full form with validation
5. **Delete a student** — confirmation dialog to prevent accidental deletion
6. **Search students** — search by name, email, or department (updates dynamically)
7. **Filter by department** — dropdown filter
8. **Dashboard stats** — total students, number of departments, average CGPA
9. **Form validation** — name, email format, phone format, department, year range, CGPA range
10. **Success/error notifications** — toast messages for every operation
11. **Responsive design** — works on desktop, tablet, and mobile

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Tailwind CSS |
| Icons | Lucide React |
| API | Supabase auto-generated REST API (PostgREST) |
| Database | PostgreSQL (via Supabase) |
| Build Tool | Vite |

## System Architecture

```
User
  ↓
React Frontend (Vite + TypeScript)
  ↓
Supabase JS Client (Fetch API)
  ↓
Supabase REST API (PostgREST)
  ↓
PostgreSQL Database
```

**Data flow:**
1. User interacts with the React UI (clicks "Add Student", fills form, etc.)
2. The Supabase JS client sends HTTP requests to the auto-generated REST API
3. The API translates requests into SQL operations on the PostgreSQL database
4. Results flow back through the API to the frontend
5. The UI updates with the new data and shows a success/error notification

## Database Design

### `students` table

| Column | Type | Constraints |
|--------|------|-------------|
| id | bigint (identity) | Primary key, auto-incrementing |
| name | text | NOT NULL |
| email | text | NOT NULL, UNIQUE |
| phone | text | NOT NULL |
| department | text | NOT NULL |
| year | integer | NOT NULL, CHECK (1-5) |
| cgpa | numeric(3,2) | NOT NULL, CHECK (0-10) |
| created_at | timestamptz | DEFAULT now() |

### Key Concepts

- **Primary key**: The `id` column uniquely identifies each student. It auto-increments, so each new student gets the next available ID.
- **Unique constraint**: The `email` column has a UNIQUE constraint, preventing two students from sharing the same email address.
- **Check constraints**: `year` must be between 1-5, and `cgpa` must be between 0-10. The database enforces these rules regardless of how data is inserted.
- **Row Level Security (RLS)**: Enabled on the table with policies allowing public read/write access (single-tenant app, no authentication required).

## API Endpoints

The Supabase client library interacts with the auto-generated REST API:

| Operation | Method | Description |
|-----------|--------|-------------|
| Create | POST | Insert a new student record |
| Read All | GET | Fetch all students, ordered by creation date |
| Read One | GET | Fetch a single student by ID |
| Update | PATCH | Update an existing student by ID |
| Delete | DELETE | Remove a student by ID |

All API responses return JSON. Errors include meaningful messages (e.g., duplicate email returns "A student with this email already exists").

## CRUD Implementation

### Create (POST)
- User clicks "Add Student" and fills the form
- Client-side validation runs before submission
- Supabase client sends an INSERT request
- On success, the student list refreshes and a success toast appears
- On failure (e.g., duplicate email), an error toast shows the server message

### Read (GET)
- On page load, all students are fetched ordered by `created_at` descending
- Stats (total, departments, average CGPA) are computed from the fetched data
- Search and filter operate on the client-side for instant results

### Update (PUT/PATCH)
- User clicks the edit icon on a student row
- The form modal opens pre-populated with that student's data
- After validation, an UPDATE request is sent
- The list refreshes on success

### Delete (DELETE)
- User clicks the delete icon
- A confirmation modal appears to prevent accidental deletion
- On confirm, a DELETE request is sent
- The list refreshes and a success toast appears

## Validation

### Client-side validation (in `src/lib/validation.ts`)
- **Name**: Required, minimum 2 characters
- **Email**: Required, must match valid email format regex
- **Phone**: Required, 7-15 characters, digits and + - ( ) spaces allowed
- **Department**: Required, selected from dropdown
- **Year**: Required, must be between 1 and 5
- **CGPA**: Required, must be between 0 and 10

Validation errors appear directly below the relevant form fields.

### Server-side validation (database constraints)
- Email uniqueness enforced by UNIQUE constraint
- Year range enforced by CHECK constraint
- CGPA range enforced by CHECK constraint
- NOT NULL constraints on all required fields

## Testing

### Postman / API Testing

Since this project uses Supabase's auto-generated REST API, you can test the endpoints using Postman with these configurations:

**Base URL**: `https://nufjixvalniipetocnfa.supabase.co/rest/v1/students`

**Headers required**:
```
apikey: <your-anon-key>
Authorization: Bearer <your-anon-key>
Content-Type: application/json
```

| Test Case | Method | URL | Body | Expected Status |
|-----------|--------|-----|------|-----------------|
| Create student (valid) | POST | `/students` | `{"name":"John","email":"john@test.com","phone":"1234567890","department":"CS","year":2,"cgpa":8.5}` | 201 |
| Create student (missing name) | POST | `/students` | `{"email":"test@test.com"}` | 400 |
| Create student (invalid email) | POST | `/students` | `{"name":"John","email":"notanemail"}` | 400 |
| Create student (duplicate email) | POST | `/students` | `{"name":"Jane","email":"john@test.com",...}` | 409 |
| Create student (invalid CGPA) | POST | `/students` | `{"name":"John","email":"x@y.com","phone":"123","department":"CS","year":1,"cgpa":15}` | 400 |
| Get all students | GET | `/students?select=*` | — | 200 |
| Get one student | GET | `/students?id=eq.1` | — | 200 |
| Get invalid student ID | GET | `/students?id=eq.99999` | — | 200 (empty array) |
| Update student | PATCH | `/students?id=eq.1` | `{"name":"Updated Name"}` | 200 |
| Update invalid ID | PATCH | `/students?id=eq.99999` | `{"name":"X"}` | 200 (empty) |
| Delete student | DELETE | `/students?id=eq.1` | — | 204 |
| Delete invalid ID | DELETE | `/students?id=eq.99999` | — | 204 |

## Installation Steps

### Prerequisites
- Node.js 18+ (includes npm)
- A Supabase project (free tier at https://supabase.com)

### 1. Clone and install
```bash
git clone <your-repo-url>
cd student-management-system
npm install
```

### 2. Environment variables
Create a `.env` file in the project root:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Database setup
Run the migration SQL (provided in the Supabase dashboard) to create the `students` table with RLS policies and constraints.

## How to Run the Frontend
```bash
npm run dev
```
The app will be available at `http://localhost:5173`.

## How to Run the Backend
The backend is managed by Supabase — no local server needed. The database and REST API are hosted on Supabase's cloud infrastructure. Simply ensure your `.env` file has the correct Supabase URL and anon key.

## Screenshots to Capture

For your college submission, capture these screenshots:

1. **VS Code project structure** — Shows the file organization
2. **Database table** — Supabase dashboard → Table Editor → students table
3. **Supabase API running** — Supabase dashboard → API docs
4. **API GET request in Postman** — GET all students returning JSON
5. **API POST request in Postman** — POST creating a new student
6. **API PATCH request in Postman** — PATCH updating a student
7. **API DELETE request in Postman** — DELETE removing a student
8. **React dashboard** — Main page with stats cards and student table
9. **Add Student form** — Modal with all fields
10. **Student list** — Table with multiple students
11. **Edit operation** — Form pre-populated with student data
12. **Delete confirmation** — Warning dialog before deletion
13. **Validation error** — Form showing field-level error messages
14. **Search/filter** — Filtered student list
15. **GitHub repository** — Repo page with commit history

## Challenges and Solutions

| Challenge | Solution |
|-----------|---------|
| Handling duplicate email errors | Map PostgreSQL error code 23505 to a user-friendly message |
| Real-time search without API calls | Filter on the client side after fetching all records |
| Form validation before submission | Separate validation function with field-level error display |
| Responsive table on mobile | Horizontal scroll with `overflow-x-auto` |
| Preventing accidental deletes | Confirmation modal before delete operation |

## Future Enhancements

1. **User authentication** — Login/logout with role-based access
2. **Export to CSV/PDF** — Download student records
3. **Pagination** — For large datasets
4. **Sorting** — Click column headers to sort
5. **Bulk operations** — Select multiple students for batch delete
6. **Student profile photos** — Upload and display avatars
7. **Course enrollment** — Link students to courses
8. **Attendance tracking** — Mark and view attendance

## GitHub Repository

Repository: `<your-github-repo-url>`

## Viva Preparation

### What is CRUD?
CRUD stands for Create, Read, Update, Delete — the four basic operations for managing data in an application.

### What is REST API?
REST (Representational State Transfer) is an architectural style for APIs that uses HTTP methods (GET, POST, PUT, DELETE) to perform operations on resources identified by URLs.

### What is React?
React is a JavaScript library for building user interfaces using reusable components and a virtual DOM for efficient rendering.

### What is SQLite / PostgreSQL?
SQLite is a lightweight file-based database. PostgreSQL is a powerful open-source relational database. Both use SQL for queries. This project uses PostgreSQL via Supabase.

### What is an ORM?
ORM (Object-Relational Mapping) is a technique that maps database tables to programming language objects, letting you work with data as objects instead of writing raw SQL.

### What is a primary key?
A primary key is a column (or set of columns) that uniquely identifies each row in a table. In this project, `id` is the primary key.

### What is a unique constraint?
A unique constraint ensures no two rows have the same value in a column. The `email` column has a unique constraint.

### What is JSON?
JSON (JavaScript Object Notation) is a lightweight data format used for sending and receiving data between client and server.

### What is GET?
An HTTP method that retrieves data from the server without modifying it.

### What is POST?
An HTTP method that sends new data to the server to create a resource.

### What is PUT/PATCH?
HTTP methods that update an existing resource. PUT replaces the entire resource; PATCH updates only the sent fields.

### What is DELETE?
An HTTP method that removes a resource from the server.

### What is CORS?
CORS (Cross-Origin Resource Sharing) is a browser security mechanism that controls which domains can access resources on a different domain.

### What is validation?
Validation ensures data meets required rules before processing — e.g., email format, required fields, numeric ranges.

### Client-side vs server-side validation?
Client-side validation runs in the browser for instant feedback. Server-side validation runs on the server/database for security and data integrity. Both are needed.

### How does React communicate with the backend?
React uses HTTP requests (via fetch or a client library like Supabase JS) to send and receive JSON data from the backend API.

### Explain the complete project workflow:
1. User opens the app → React fetches all students from the database via the Supabase API
2. The dashboard shows stats and the student table
3. User can add, edit, or delete students — each action validates input, sends an API request, and updates the UI
4. Search and filter work instantly on the loaded data
5. Success and error messages appear as toast notifications
