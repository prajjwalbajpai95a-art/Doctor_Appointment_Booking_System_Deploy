# 🏥 Doctor Appointment Booking System

A full-stack web application built using the **MERN Stack** (MongoDB, Express.js, React.js, Node.js) that enables patients to book doctor appointments seamlessly while allowing doctors and admins to manage schedules, profiles, and user accounts efficiently.

---

## 👨‍💻 Developed By
**Prajjwal Bajpai**

---

## ✨ Features

### 👤 User / Patient Features
* **Authentication:** User registration and secure login with JWT.
* **Doctor Search & Booking:** Browse doctors, view profiles, and book appointments.
* **Notification System:** Real-time updates on appointment status (Approved/Rejected).
* **Profile Management:** Update personal details and profile picture.

### 🩺 Doctor Features
* **Apply for Doctor Account:** Users can apply to become a verified doctor.
* **Manage Appointments:** Accept or reject appointment requests from patients.
* **Profile Configuration:** Manage timings, fees, specialization, and contact details.

### 👑 Admin Features
* **User & Doctor Management:** View lists of all registered users and doctors.
* **Approval System:** Approve or deny doctor applications.

---

## 🛠️ Tech Stack

* **Frontend:** React.js, Redux Toolkit, CSS3, Axios
* **Backend:** Node.js, Express.js
* **Database:** MongoDB Atlas (Mongoose ODM)
* **Authentication:** JSON Web Tokens (JWT) & BcryptJS

---

## 📁 Project Structure

```text
Doctor_Appointment_Booking_System/
│
├── Doc_Appointment_Backend/      # Express & Node.js API Server
│   ├── config/                   # Database connection configuration
│   ├── controllers/              # Business logic handlers
│   ├── middlewares/              # Authentication & upload middlewares
│   ├── models/                   # Mongoose data schemas
│   ├── routes/                   # API endpoint routes
│   ├── server.js                 # Entry point for backend
│   └── .env                      # Environment variables
│
└── Doc_Appointment_Frontend/     # React Client UI
    ├── public/                   # Static assets
    ├── src/                      # Components, pages, and Redux slices
    └── package.json              # Frontend dependencies
