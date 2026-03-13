# DPFCSS Frontend

**Digital Patient Follow-Up and Care Support System** — React + Vite frontend.

---

## Prerequisites

- Node.js v18+
- Backend API running (see `../dpfcss-backend/README.md`)

---

## Setup

```bash
cd dpfcss-frontend
npm install
```

Create a `.env` file in `dpfcss-frontend/`:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Running

```bash
npm run dev
```

App opens at `http://localhost:5173`

---

## Pages

| Route | Role | Description |
|-------|------|-------------|
| `/` | Public | Landing page |
| `/login` | Public | Login |
| `/register` | Public | Register |
| `/patient` | Patient | Patient dashboard |
| `/patient/messages` | Patient | Messaging with provider |
| `/patient/settings` | Patient | Profile settings |
| `/provider` | Provider | Provider dashboard |
| `/provider/patients` | Provider | Patient list |
| `/provider/appointments` | Provider | Appointments management |
| `/provider/messages` | Provider | Message patients |
| `/provider/settings` | Provider | Provider profile settings |
| `/admin/*` | Admin | Admin control panel |

---

## Tech Stack

- **React 19** + **Vite**
- **React Router v7** — routing
- **Zustand** — auth state management
- **Axios** — API calls
- **Framer Motion** — animations
- **Lucide React** — icons
- **Recharts** — data visualizations
- **React Hot Toast** — notifications

---

## Build for Production

```bash
npm run build
```

Output is in the `dist/` folder. Serve with any static file host (Netlify, Vercel, Nginx, etc.).
