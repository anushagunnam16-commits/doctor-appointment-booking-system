# Doctor Appointment Booking System

A backend application that enables patients to search doctors, view availability, and schedule appointments through REST APIs.

## Features

- Patient registration
- Doctor registration
- JWT Authentication
- Secure password hashing using bcrypt
- Appointment booking
- Availability management
- Input validation
- MySQL database integration

## Tech Stack

### Backend

- Node.js
- Express.js
- MySQL
- JWT
- bcrypt

### Tools

- Git
- GitHub
- Postman
- VS Code

## API Endpoints

### Register User

POST /register

### Login

POST /login

### Book Appointment

POST /appointments

### View Appointments

GET /appointments

## Project Structure

doctor-appointment-booking-system/
│
├── routes/
├── controllers/
├── middleware/
├── models/
├── app.js
├── package.json
└── README.md

## Installation

### Clone Repository

git clone <repo-url>

### Install Dependencies

npm install

### Configure Environment Variables

Create a .env file:

DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
JWT_SECRET=

### Run Application

node app.js

## Future Enhancements

- Doctor ratings and reviews
- Appointment reminders
- Video consultation support
- Admin dashboard

## Author

Anusha Gunnam
