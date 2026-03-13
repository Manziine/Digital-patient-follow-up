# DPFCSS Project

Digital Patient Follow-Up and Care Support System — Full-stack healthcare web application.

## Project Structure

```
dpfcss-backend/    ← Node.js / Express / MongoDB REST API
dpfcss-frontend/   ← React + Vite web application
```

## Quick Start

**Backend:**
```bash
cd dpfcss-backend
npm install
cp .env.example .env   # fill in MONGODB_URI + JWT_SECRET
npm run dev
```

**Frontend:**
```bash
cd dpfcss-frontend
npm install
npm run dev
```

See each folder's `README.md` for full details.

## Features

- 🔐 JWT Authentication (patient / provider / admin roles)
- 🏥 Patient dashboard: appointments, medications, adherence tracking
- 👨‍⚕️ Provider dashboard: patient list, follow-up scheduling, prescription management
- 💬 Real-time messaging between patients and providers
- 🔔 In-app notifications
- 📊 Admin analytics panel
- 🌍 Optimized for low-bandwidth environments (Rwanda)
