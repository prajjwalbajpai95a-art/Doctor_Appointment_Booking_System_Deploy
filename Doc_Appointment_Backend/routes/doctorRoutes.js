const express = require("express");
const {
  getDoctorInfoController,
  updateDoctorProfileController,
  getDoctorByIdController,
  getDoctorAppointmentsController,
  updateStatusController,
  getAllDoctorsControllers,
} = require("../controllers/doctorCtrl");

const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// ============================================================
// POST SINGLE DOCTOR INFO
// ============================================================
router.post("/getDoctorInfo", authMiddleware, getDoctorInfoController);

// ============================================================
// POST UPDATE DOCTOR PROFILE
// ============================================================
router.post(
  "/updateProfile",
  authMiddleware,
  updateDoctorProfileController
);

// ============================================================
// POST GET SINGLE DOCTOR INFO (By ID)
// ============================================================
router.post("/getDoctorById", authMiddleware, getDoctorByIdController);

// ============================================================
// GET DOCTOR APPOINTMENTS
// ============================================================
router.post(
  "/doctor-appointments",
  authMiddleware,
  getDoctorAppointmentsController
);

// ============================================================
// POST UPDATE APPOINTMENT STATUS (Approve / Reject)
// ============================================================
router.post("/update-status", authMiddleware, updateStatusController);

// ============================================================
// GET ALL APPROVED DOCTORS LIST
// ============================================================
router.get("/getAllDoctors", authMiddleware, getAllDoctorsControllers);

module.exports = router;