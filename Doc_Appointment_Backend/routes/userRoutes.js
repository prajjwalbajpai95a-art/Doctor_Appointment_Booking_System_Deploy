const express = require('express');
const {
  loginController,
  registerController,
  authController,
  applyDoctorController,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllDoctorsController,
  bookAppointmentController,
  getDoctorByIdController,
  bookingAvailabilityController,
  userAppointmentsController,
  updateProfilePicController, // New Import
} = require('../controllers/userCtrl');
const authMiddleware = require('../middlewares/authMiddleware');

// router object
const router = express.Router();

// routes
// Login || POST
router.post('/login', loginController);

// Register || POST
router.post('/register', registerController);

// Auth || POST
router.post('/getUserData', authMiddleware, authController);

// Apply Doctor || POST
router.post('/apply-doctor', authMiddleware, applyDoctorController);

// Notifications || POST
router.post('/get-all-notification', authMiddleware, getAllNotificationController);
router.post('/delete-all-notification', authMiddleware, deleteAllNotificationController);

// GET ALL DOC
router.get('/getAllDoctors', authMiddleware, getAllDoctorsController);

// BOOK APPOINTMENT
router.post('/book-appointment', authMiddleware, bookAppointmentController);

// BOOKING AVAILABILITY
router.post('/booking-availability', authMiddleware, bookingAvailabilityController);

// GET DOCTOR BY ID
router.post('/getDoctorById', authMiddleware, getDoctorByIdController);

//Appointments List
router.post('/user-appointments', authMiddleware, userAppointmentsController);

router.post("/update-profile-pic", authMiddleware, updateProfilePicController);

module.exports = router;