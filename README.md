# Student Records API
**DCIT 26 | Express.js and MongoDB**

## Overview

This project is a backend application that manages student information through a REST API. It uses Node.js and Express.js to handle HTTP requests, MongoDB to store student records, and Mongoose to define the data structure and validate inputs.

The system supports creating, viewing, updating, and deleting student records.

## Technologies Used

- **Node.js** – Runs the backend application.
- **Express.js** – Handles API routes and HTTP requests.
- **MongoDB** – Stores student information in a database.
- **Mongoose** – Defines the student model and validates data.
- **Nodemon** – Restarts the server automatically during development.

## Directory Layout

```text
lab5-student-api/
├── backend/
│   ├── models/
│   │   └── Student.js
│   └── server.js
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

The `models` folder contains the student schema, while `server.js` handles the server configuration and API endpoints. The environment files manage application settings, and `package.json` lists the dependencies and available scripts.

## Student Record Fields

| Field | Type | Details |
|---|---|---|
| `fullName` | String | Required; whitespace is trimmed |
| `course` | String | Required; whitespace is trimmed |
| `yearLevel` | Number | Required integer from 1 to 4 |
| `section` | String | Optional; whitespace is trimmed |
| `createdAt` | Date | Automatically assigned the current timestamp |

MongoDB also generates an `_id` for each student document. These identifiers are used when retrieving, updating, or deleting individual records.

## Main Functions

| Operation | Purpose |
|---|---|
| Create | Adds a new student record to the database |
| Read | Retrieves all student records or a specific record |
| Update | Modifies an existing student record |
| Delete | Removes a student record from the database |

The API also provides a health-check endpoint, validates incoming data, and returns appropriate HTTP status codes and JSON responses. The server starts accepting requests only after the database connection is established.

## Installation Guide

### Requirements

Install Node.js (version 18 or later recommended), npm (version 9 or later), and MongoDB Community Server or prepare a MongoDB Atlas connection. MongoDB Compass or `mongosh` may be used to inspect the database.

### Step 1: Download the Project

```bash
git clone https://github.com/CardboardB0X/DCIT-26_LAB5_Express_and_MongoDB.git lab5-student-api
cd lab5-student-api
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure the Database

Create a `.env` file using `.env.example` as a template:

```bash
cp .env.example .env
```

Add the following configuration:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/lab5_students
```

This configuration uses a local MongoDB database named `lab5_students`. If using MongoDB Atlas, replace the connection string with the appropriate Atlas URI.

**Important:** Keep `.env` out of version control because it may contain sensitive configuration details.

## Start the Application

For development, run:

```bash
npm run dev
```

For normal startup, run:

```bash
npm start
```

Make sure MongoDB is running and the environment variables are configured before starting the application. When the connection succeeds, the API becomes available at `http://localhost:5000`.

## Available Routes

All student-related routes use the `/api/students` base path.

| Method | Route | Function |
|---|---|---|
| GET | `/api/health` | Checks the API status |
| GET | `/api/students` | Lists all students |
| GET | `/api/students/:id` | Finds a student by ID |
| POST | `/api/students` | Registers a student record |
| PUT | `/api/students/:id` | Updates a student record |
| DELETE | `/api/students/:id` | Deletes a student record |

### Example: Register a Student

Send a `POST` request to `/api/students` with the `Content-Type: application/json` header.

```json
{
  "fullName": "Alex Santos",
  "course": "BSIT",
  "yearLevel": 2,
  "section": "IT-2A"
}
```

A successful request returns `201 Created`. The response includes the saved student information, its generated `_id`, and its creation timestamp.

### Example: Update a Student

Send a `PUT` request to `/api/students/:id` with the fields to be updated.

```json
{
  "yearLevel": 3,
  "section": "IT-3A"
}
```

A successful update returns `200 OK` and the updated record.

### Other Requests

- **Health check:** `GET /api/health`
- **List students:** `GET /api/students`
- **Find a student:** `GET /api/students/:id`
- **Delete a student:** `DELETE /api/students/:id`

Replace `:id` with the actual MongoDB document ID when working with a specific student.

## Testing Through cURL

With the server running, use the following commands to test the endpoints from your terminal.

```bash
# Check the API
curl http://localhost:5000/api/health

# Add a student
curl -X POST http://localhost:5000/api/students \
  -H "Content-Type: application/json" \
  -d "{\"fullName\":\"Alex Santos\",\"course\":\"BSIT\",\"yearLevel\":2,\"section\":\"IT-2A\"}"

# View all students
curl http://localhost:5000/api/students

# Find a student
curl http://localhost:5000/api/students/<STUDENT_ID>

# Update a student
curl -X PUT http://localhost:5000/api/students/<STUDENT_ID> \
  -H "Content-Type: application/json" \
  -d "{\"yearLevel\":3,\"section\":\"IT-3A\"}"

# Delete a student
curl -X DELETE http://localhost:5000/api/students/<STUDENT_ID>
```

Replace `<STUDENT_ID>` with a valid ID returned by the API. The POST request can be used first to create a record for testing.

## Response Codes and Error Handling

| Code | Description |
|---|---|
| `200 OK` | The request was completed successfully |
| `201 Created` | A new student record was created |
| `400 Bad Request` | The ID format is invalid or the submitted data fails validation |
| `404 Not Found` | No student record matches the provided ID |
| `500 Internal Server Error` | An unexpected server error occurred |

For example, an invalid student ID may return:

```json
{
  "message": "Invalid student ID format"
}
```

A record that does not exist may return:

```json
{
  "message": "Student record not found"
}
```

Validation errors can occur when required fields are missing or `yearLevel` falls outside the allowed range. Errors are returned in JSON format, and internal stack traces are not exposed to API clients.

## Project Purpose

This project demonstrates the use of REST API principles, database integration, schema validation, and CRUD operations in a Node.js application.

## License

Created for academic purposes as part of **DCIT 26**.
