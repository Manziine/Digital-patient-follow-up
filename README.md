# DPFCSS (Digital Patient Follow-Up and Care Support System)

Digital Patient Follow-Up and Care Support System — Full-stack healthcare web application optimized for low-bandwidth environments (Rwanda).

## Project Structure

This is a monorepo setup containing both the backend API and the frontend application:
- `dpfcss-backend/` ← Node.js / Express / MongoDB REST API
- `dpfcss-frontend/` ← React + Vite web application

## Prerequisites

Before you begin, ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v16.x or higher recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- [Git](https://git-scm.com/)

You also need a MongoDB database. You can create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or install MongoDB locally.

## Local Setup Instructions

Follow these step-by-step instructions to get the project completely set up and running locally.

### 1. Clone the repository

First, download the project files by cloning the repository and navigating into it:

```bash
git clone <repository-url>
cd Digital-patient-follow-up
```
*(Skip this step if you already have the files locally.)*

### 2. Set up the Backend API

Open a terminal and navigate to the backend directory:

```bash
cd dpfcss-backend
```

Install the backend dependencies:

```bash
npm install
```

Set up the environment variables:

1. Create a file named `.env` in the `dpfcss-backend` folder. You can do this by duplicating the provided example file:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` in your text editor and fill in the following details:
   - `MONGODB_URI`: Insert your MongoDB connection string (e.g., from MongoDB Atlas). Replace `<user>` and `<password>` with your database credentials.
   - `JWT_SECRET`: Add a secure, random string for JSON Web Token authentication (e.g., `my_local_development_secret_key`).
   - `PORT`: This is set to `5000` by default. It's recommended to leave it as `5000`.

Start the backend development server:

```bash
npm run dev
```

The backend should now start up and display a message indicating it is connected to MongoDB and running on `http://localhost:5000`. **Keep this terminal window running.**

### 3. Set up the Frontend Application

Open a **new** terminal window and navigate to the frontend directory (starting from the root project folder):

```bash
cd dpfcss-frontend
```

Install the frontend dependencies:

```bash
npm install
```

Set up the frontend environment variables:

1. Create a file named `.env` in the `dpfcss-frontend` folder:
   ```bash
   cp .env.example .env
   ```
2. Open the `.env` file. For local development, the `VITE_API_URL` should be left empty or commented out (as Vite is already configured to proxy `/api` requests to `localhost:5000`).
   ```env
   # VITE_API_URL=
   ```

Start the frontend development server:

```bash
npm run dev
```

The frontend will start and typically run on `http://localhost:5173` (or another port shown in the terminal). 

### 4. Verify the Application

1. Open your web browser and navigate to the local URL provided by the frontend terminal (usually `http://localhost:5173`).
2. You should see the application's landing page!
3. Click "Get Started" or "Register" to create a new user account and verify that the frontend can successfully communicate with the backend and database.

---

## Features list

- 🔐 **JWT Authentication**: Secure role-based access control for patient, provider, and admin profiles.
- 🏥 **Patient Dashboard**: Users can manage appointments, track their medication intake, and monitor their health adherence.
- 👨‍⚕️ **Provider Dashboard**: Healthcare workers can view their patient roster, schedule follow-ups, and manage vital prescriptions.
- 💬 **Messaging**: Secure and real-time communication platform built to connect patients and providers.
- 🔔 **Notifications System**: In-app alerts designed to notify users of due tasks and important updates.
- 📊 **Admin Analytics**: Centralized overview panel displaying critical system statistics.
- 🌍 **Accessibility**: Application architecture strictly optimized for low-bandwidth environments.

## Troubleshooting

- **Backend fails to connect to the database:** Ensure your MongoDB cluster's IP Access List (in MongoDB Atlas Network Access) allows your current IP address, or use `0.0.0.0/0` for testing purposes. Verify that the username and password in `MONGODB_URI` are correct and don't contain unescaped special characters.
- **Frontend can't reach the API (Network Errors/CORS):** Ensure the backend terminal is actually running without errors on port 5000. Check the frontend's `vite.config.js` to ensure the proxy is correctly pointed to `http://localhost:5000`.
