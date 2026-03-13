# DPFCSS Backend API

**Digital Patient Follow-Up and Care Support System** — Node.js / Express / MongoDB REST API.

---

## Prerequisites

- Node.js v18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

---

## Setup

```bash
cd dpfcss-backend
npm install
```

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

### Environment Variables (`.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/dpfcss` |
| `JWT_SECRET` | Secret key for JWT signing | `supersecretkey123` |
| `JWT_EXPIRES_IN` | JWT expiry duration | `7d` |
| `PORT` | Server port (optional) | `5000` |

---

## Running

```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

Server starts on `http://localhost:5000`

---

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| PATCH | `/api/auth/change-password` | Change password |
| GET | `/api/patients/dashboard` | Patient dashboard data |
| GET | `/api/patients/appointments` | Patient appointments |
| GET | `/api/patients/medications` | Patient medications |
| PATCH | `/api/patients/medications/:id/take` | Mark medication as taken |
| GET | `/api/providers/dashboard` | Provider dashboard |
| GET | `/api/providers/patients` | Provider's patients |
| POST | `/api/providers/appointments` | Schedule appointment |
| POST | `/api/providers/medications` | Prescribe medication |
| GET | `/api/providers/profile` | Provider profile |
| PATCH | `/api/providers/profile` | Update provider profile |
| GET | `/api/messages/conversations` | List conversations |
| GET | `/api/messages/:userId` | Get messages with user |
| POST | `/api/messages/:userId` | Send message |
| GET | `/api/notifications` | Get notifications |
| PATCH | `/api/notifications/:id/read` | Mark notification read |
| GET | `/api/admin/dashboard` | Admin dashboard stats |
| GET | `/api/admin/users` | List all users |
| PATCH | `/api/admin/users/:id` | Update user |
| DELETE | `/api/admin/users/:id` | Delete user |

---

## Roles

- `patient` — can view dashboard, take medications, message provider
- `provider` — can manage patients, appointments, prescriptions, message patients
- `admin` — full access to all users and content

---

## Default Seed

No seed script is required. Register your first admin manually via `POST /api/auth/register` with `"role": "admin"`.
