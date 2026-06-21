# Restro Data Backend

A Node.js + Express backend that provides:

* User authentication (Signup, Login, Logout)
* Session-based authentication using Express Session
* MongoDB session storage with Connect-Mongo
* Restaurant data fetching from Swiggy API
* CORS support for frontend integration

---

## Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* Express Session
* Connect-Mongo
* bcrypt
* dotenv
* node-fetch
* CORS

---

## Features

### Authentication

* User Signup
* User Login
* User Logout
* Session Persistence
* Password Hashing with bcrypt

### Restaurant API

* Fetch restaurant listings using latitude and longitude coordinates
* Proxy requests through backend to avoid frontend CORS issues


---

## Environment Variables

Create a `.env` file in the root directory:

```env
DB=mongodb+srv://your-mongodb-connection-string
PORT=5000
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/restro-data-backend.git
cd restro-data-backend
```

### Install Dependencies

```bash
npm install
```

### Start Server

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

Server runs on:

```bash
http://localhost:5000
```

---

## API Endpoints

### Health Check

#### GET /

Returns server status.

Response:

```json
{
  "message": "Ok"
}
```

---

### Test Route

#### GET /test

Response:

```json
{
  "message": "Working"
}
```

---

## Authentication Routes

### Signup

#### POST /signup

Request Body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "1234"
}
```

Success Response:

```json
{
  "message": "OK"
}
```

---

### Login

#### POST /login

Request Body:

```json
{
  "email": "john@example.com",
  "password": "1234"
}
```

Success Response:

```json
{
  "message": "Login successful",
  "userId": "user_id",
  "userName": "John Doe"
}
```

---

### Check Session

#### GET /session

Success Response:

```json
{
  "loggedIn": true,
  "user": {
    "id": "user_id",
    "name": "John Doe"
  }
}
```

Unauthenticated Response:

```json
{
  "loggedIn": false
}
```

---

### Logout

#### POST /logout

Response:

```json
{
  "message": "Logged out"
}
```

---

## Restaurant API

### Get Restaurants

#### GET /api/restro

Query Parameters:

```bash
/api/restro?lat=28.6139&lng=77.2090
```

Example:

```bash
http://localhost:5000/api/restro?lat=28.6139&lng=77.2090
```

Response:

Returns restaurant listing data fetched from Swiggy.

---

## Session Configuration

Sessions are stored in MongoDB using Connect-Mongo.

Cookie Settings:

```javascript
cookie: {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 1000 * 60 * 60 * 24
}
```

Session Duration:

```text
24 Hours
```

---

## Security Features

* Password hashing using bcrypt
* HTTP-only cookies
* MongoDB session storage
* Email validation
* Protected session endpoint
* Secure cookie support for production

---

## Frontend Configuration

Allowed Origins:

```javascript
[
  "http://localhost:5173",
  "https://restro-data-xkg3.vercel.app"
]
```

If you deploy a new frontend, update the CORS configuration accordingly.

---

## Deployment Notes

For production deployment:

1. Set environment variables correctly.
2. Use HTTPS.
3. Store session secrets securely.
4. Replace hardcoded session secret with:

```env
SESSION_SECRET=your_secret_key
```

And use:

```javascript
secret: process.env.SESSION_SECRET
```

---

## Future Improvements

* JWT Authentication
* User Profile Management
* Password Reset
* Rate Limiting
* Input Sanitization
* API Caching
* Restaurant Search Filters
* Authentication Middleware

---

## Author

Built with Node.js, Express, MongoDB, and Swiggy API integration.
