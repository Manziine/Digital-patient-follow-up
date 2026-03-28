# Submitting DPFCSS for Deployment

The DPFCSS project is fully configured to be deployed on Render using Infrastructure as Code (IaC) via the `render.yaml` blueprint.

## 1. Prerequisites
- A GitHub account holding the DPFCSS repository.
- A Render account (free tier works for this configuration).
- A MongoDB Atlas account for the production database.

## 2. Environment Setup (MongoDB Atlas)
Since your local MongoDB will not be available over the internet, you MUST set up a cloud database:
1. Log into [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a Free Cluster.
3. Add a database user (save the username and password).
4. Allow Network Access from everywhere (`0.0.0.0/0`) since Render uses dynamic IPs, or use VPC peering if you upgrade.
5. Get your connection string (it looks like `mongodb+srv://<user>:<password>@cluster0...`).

## 3. Deploying using Render Blueprint
This approach auto-deploys both the Node.js backend API and the Vite React frontend using the `render.yaml` configuration file already present in the root.

1. Go to your Render Dashboard.
2. Click **New** -> **Blueprint**.
3. Connect your GitHub repository containing the DPFCSS code.
4. Render will automatically detect the `render.yaml` file.
5. During the setup phase, Render will ask you to supply values for the variables marked as `sync: false` in `render.yaml`:

    **Backend Environment Variables:**
    - `MONGODB_URI`: Insert your MongoDB Atlas connection string (replace `<password>` with your actual password).
    - `JWT_SECRET`: Create a strong randomly generated string (e.g., `super_secret_healthcare_key_2026`).
    - `CLIENT_URL`: Leave blank initially, or guess the URL based on Render's naming scheme (e.g., `https://dpfcss-frontend.onrender.com`). You will need to update this after the frontend is deployed.

    **Frontend Environment Variables:**
    - `VITE_API_URL`: Initially, put a placeholder or guess the backend URL (`https://dpfcss-backend.onrender.com/api`).

6. Click **Apply**.
7. Render will begin building both `dpfcss-backend` (Node server) and `dpfcss-frontend` (Static Site using Vite).

## 4. Post-Deployment Linking
Once both services are successfully deployed:
1. Copy the exact public URL of your Frontend service.
2. Go to the Backend service settings on Render -> Environment. Update `CLIENT_URL` to the frontend URL to allow CORS.
3. Copy the exact public URL of your Backend service, and append `/api` to it.
4. Go to the Frontend service settings on Render -> Environment. Update `VITE_API_URL` to this backend URL.
5. Trigger a **Manual Deploy** for the Frontend so it bakes the new API URL into the static build.

## 5. First Time Login in Production
Since the production database in MongoDB Atlas is empty, the first thing you need to do is seed an administrator.

You can use Postman, or cURL from your terminal, substituting your Render backend URL:
```bash
curl -X POST https://your-backend-url.onrender.com/api/auth/register \
-H "Content-Type: application/json" \
-d '{"name": "Admin", "email": "admin@hospital.rw", "password": "securepassword123", "role": "admin"}'
```
Then log in through your newly deployed frontend site!
