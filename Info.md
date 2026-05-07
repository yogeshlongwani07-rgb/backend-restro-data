# 🍽️ Restro Data — Backend

> Express.js REST API powering user authentication and real-time restaurant discovery via Swiggy's public API.


## Overview

This is the backend service for **Restro Data** — a restaurant discovery app. It handles:

- Secure user **signup / login / logout** with session-based auth
- A **proxy endpoint** that fetches nearby restaurant listings from Swiggy's API using latitude/longitude coordinates (bypassing browser-level CORS restrictions)

The frontend lives at - https://restro-data-xkg3.vercel.app/

---

## Features

- 🔐 **Session-based authentication** — HTTP-only, secure cookies stored in MongoDB via `connect-mongo`
- 🔒 **Password hashing** — bcrypt with salt rounds of 10
- 📍 **Restaurant proxy** — Fetches live data from Swiggy's restaurant listing API by coordinates
- ✅ **Input validation** — Email format checks, duplicate account prevention, minimum password length
- 🌐 **CORS configured** — Supports both local dev (`localhost:5173`) and the production frontend

---

## Tech Stack

| Layer         | Technology                        |
|---------------|-----------------------------------|
| Runtime       | Node.js (ES Modules)              |
| Framework     | Express.js 4.x                    |
| Database      | MongoDB via Mongoose              |
| Auth          | express-session + connect-mongo   |
| Hashing       | bcrypt                            |
| HTTP Client   | node-fetch                        |
| Config        | dotenv                            |

---

## Project Structure

```
backend-restro-data-master/
├── index.js          # All routes, DB connection, session config
├── package.json      # Dependencies & start script
├── .gitignore        # Ignores node_modules/ and .env
└── .vscode/
    └── settings.json
```

> This is a single-file backend. All logic lives in `index.js`.

## Session & Security

- Sessions are stored in MongoDB (`sessions` collection) using `connect-mongo`
- Cookie settings:
  - `httpOnly: true` — prevents JS access
  - `secure: true` — HTTPS only
  - `sameSite: "none"` — required for cross-origin cookies (Vercel frontend ↔ backend)
  - `maxAge: 24 hours`
- `trust proxy` is enabled for deployment behind a reverse proxy (e.g., Render, Railway)

---

## Deployment

Make sure to:
1. Set the `DB` and `PORT` environment variables in your platform's dashboard
2. Add your deployed backend URL to the `origin` array in the CORS config inside `index.js`
3. Ensure `trust proxy` is enabled (already set in `index.js`)

---

## Known Limitations

- **Swiggy proxy may break** — Swiggy's API is unofficial and may block requests or change its structure at any time
- **Session secret is hardcoded** — Should be moved to `.env` before deploying to production
- **No rate limiting** — The `/api/restro` and auth endpoints have no rate limiting applied
- **Single-file architecture** — As the project grows, consider splitting routes and models into separate files

---

## License

This project is open source. Feel free to use, modify, and distribute with attribution.
