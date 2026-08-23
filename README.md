# 🏥 Digital Patient Follow-Up & Care Support System (DPFCSS)

<div align="center">

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-18-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

<br/>

**A full-stack, enterprise healthcare management platform designed for post-discharge patient care, clinical appointment scheduling, provider consultations, real-time messaging, and medical record tracking.**

[Frontend Architecture](#-frontend-architecture) · [Backend Architecture](#-backend-api-architecture) · [Quickstart with Docker](#-quickstart-with-docker) · [Deployment](#-cloud-deployment)

</div>

---

## 🚀 Key Features

* **🩺 Multi-Role Portals**: Distinct role-based access control (RBAC) interfaces for **Patients**, **Healthcare Providers (Doctors/Nurses)**, and **Hospital Administrators**.
* **📅 Appointment & Schedule Engine**: Book, reschedule, approve, and track clinical follow-up sessions.
* **💬 Provider-Patient Consultation Messaging**: Direct messaging pipeline between patients and their assigned medical care teams.
* **💊 Medication & Treatment Tracker**: Track active prescriptions, dosage schedules, and treatment adherence.
* **🤖 AI Health Assistant Chatbot**: Integrated clinical intake chatbot for patient symptom screening and FAQs.
* **🎨 Editorial UI/UX Design**: Clean, accessible clinical typography and modern dashboard components built with React & Tailwind CSS.

---

## 🏛️ Architecture

```
                          +-------------------------------+
                          |    React + Vite Web Client    |
                          |   (Port 5173 / Tailored UI)   |
                          +---------------+---------------+
                                          | (REST / Axios)
                                          v
                      +-------------------+-------------------+
                      |      Node.js / Express Backend API    |
                      |        (Port 5000 / JWT Auth)         |
                      +-------------------+-------------------+
                                          |
                                          v
                      +-------------------+-------------------+
                      |        MongoDB Database Engine        |
                      |   (Users, Appointments, Messages)     |
                      +---------------------------------------+
```

---

## ⚡ Quickstart with Docker

```bash
# Clone the repository
git clone https://github.com/Manziine/Digital-patient-follow-up.git
cd Digital-patient-follow-up

# Launch complete stack (Frontend + Backend + MongoDB)
docker compose up -d --build
```

Access services:
* **Frontend Web Portal**: [http://localhost:5173](http://localhost:5173)
* **Backend REST API**: [http://localhost:5000](http://localhost:5000)

---

## 👤 Author

**Arnaud Ineza Manzi**
* GitHub: [@Manziine](https://github.com/Manziine)
* LinkedIn: [Arnaud Ineza Manzi](https://linkedin.com/in/arnaud-ineza-manzi-471221272)
* Email: [ainezamanzi@gmail.com](mailto:ainezamanzi@gmail.com)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
