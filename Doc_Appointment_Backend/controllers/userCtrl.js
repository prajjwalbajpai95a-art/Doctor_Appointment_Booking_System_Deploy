const userModel = require("../models/userModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const doctorModel = require("../models/doctorModel");
const appointmentModel = require("../models/appointmentModel");
const moment = require("moment");

// REGISTER CONTROLLER
const registerController = async (req, res) => {
  try {
    const existingUser = await userModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "User Already Exists",
      });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const newUser = new userModel(req.body);
    await newUser.save();
    res.status(201).send({
      success: true,
      message: "User Registered Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Register Controller Error: ${error.message}`,
    });
  }
};

// LOGIN CONTROLLER
const loginController = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(200).send({
        message: "User not found",
        success: false,
      });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(200).send({
        message: "Invalid Email or Password",
        success: false,
      });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).send({
      message: "Login Successful",
      success: true,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: `Error in Login CTRL: ${error.message}`,
    });
  }
};

// AUTH CONTROLLER || POST (GET USER DATA)
const authController = async (req, res) => {
  try {
    const user = await userModel.findById({ _id: req.body.userId });
    if (!user) {
      return res.status(200).send({
        success: false,
        message: "user not found",
      });
    } else {
      res.status(200).send({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          isDoctor: user.isDoctor,
          isAdmin: user.isAdmin,
          notification: user.notification,
          seennotification: user.seennotification,
          profilePic: user.profilePic, // <--- Yeh ensure karein ki included ho
        },
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "auth error",
      error,
    });
  }
};
// APPLY DOCTOR CONTROLLER
const applyDoctorController = async (req, res) => {
  try {
    const newDoctor = new doctorModel({ ...req.body, status: "pending" });
    await newDoctor.save();

    // 1. Admin Account Update
    const adminUser = await userModel.findOne({ isAdmin: true });
    if (adminUser) {
      const adminNotification = adminUser.notification || [];
      adminNotification.push({
        type: "apply-doctor-request",
        message: `${newDoctor.firstName} ${newDoctor.lastName} Has Applied For A Doctor Account`,
        data: {
          doctorId: newDoctor._id,
          name: newDoctor.firstName + " " + newDoctor.lastName,
          onClickPath: "/admin/doctors",
        },
      });
      await userModel.findByIdAndUpdate(adminUser._id, {
        notification: adminNotification,
      });
    }

    // 2. Current User Account Update
    const user = await userModel.findById(req.body.userId);
    if (user) {
      const userNotification = user.notification || [];
      userNotification.push({
        type: "apply-doctor-request-sent",
        message:
          "Your doctor account application has been submitted successfully and is pending approval.",
        data: {
          onClickPath: "/notification",
        },
      });
      await userModel.findByIdAndUpdate(user._id, {
        notification: userNotification,
      });
    }

    res.status(201).send({
      success: true,
      message: "Doctor Application Submitted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: `Error in Apply Doctor CTRL: ${error.message}`,
    });
  }
};

// GET ALL NOTIFICATIONS CONTROLLER
const getAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    const seennotification = user.seennotification || [];
    const notification = user.notification || [];
    seennotification.push(...notification);
    user.notification = [];
    user.seennotification = seennotification;
    const updatedUser = await user.save();
    res.status(200).send({
      success: true,
      message: "all notifications marked as read",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error in notification",
      success: false,
      error,
    });
  }
};

// DELETE ALL NOTIFICATIONS CONTROLLER
const deleteAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    user.notification = [];
    user.seennotification = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "Notifications Deleted successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "unable to delete all notifications",
      error,
    });
  }
};

// GET ALL DOCTORS
const getAllDoctorsController = async (req, res) => {
  try {
    const doctors = await doctorModel.find({ status: "approved" });
    res.status(200).send({
      success: true,
      message: "Doctors Lists Fetched Successfully",
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While Fetching Doctor",
    });
  }
};

// BOOK APPOINTMENT CONTROLLER
const bookAppointmentController = async (req, res) => {
  try {
    req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    req.body.time = moment(req.body.time, "HH:mm").toISOString();
    req.body.status = "pending";

    // 1. Doctor model se complete doctor details fetch karo
    const doctor = await doctorModel.findById(req.body.doctorId);

    // 2. doctorInfo me complete object save karo (sirf ID string nahi)
    const newAppointment = new appointmentModel({
      userId: req.body.userId,
      doctorId: req.body.doctorId,
      doctorInfo: doctor, // Complete doctor object save hoga
      userInfo: req.body.userInfo,
      date: req.body.date,
      time: req.body.time,
      status: req.body.status,
    });

    await newAppointment.save();

    // Send notification to doctor
    const user = await userModel.findOne({ _id: doctor.userId });
    user.notification.push({
      type: "New-appointment-request",
      message: `A new appointment request from ${req.body.userInfo.name}`,
      onClickPath: "/user/appointments",
    });
    await user.save();

    res.status(200).send({
      success: true,
      message: "Appointment Booked Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While Booking Appointment",
    });
  }
};

// GET SINGLE DOC INFO
const getDoctorByIdController = async (req, res) => {
  try {
    const doctorId = req.body.doctorId || req.params.doctorId;

    let doctor = await doctorModel.findOne({ _id: doctorId });

    if (!doctor) {
      doctor = await doctorModel.findOne({ userId: doctorId });
    }

    if (!doctor) {
      return res.status(200).send({
        success: false,
        message: "Doctor Not Found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Single Doc Info Fetched",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Single doctor info",
    });
  }
};

// BOOKING AVAILABILITY CONTROLLER
const bookingAvailabilityController = async (req, res) => {
  try {
    const date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    const fromTime = moment(req.body.time, "HH:mm")
      .subtract(1, "hours")
      .toISOString();
    const toTime = moment(req.body.time, "HH:mm")
      .add(1, "hours")
      .toISOString();
    const doctorId = req.body.doctorId;

    const appointments = await appointmentModel.find({
      doctorId,
      date,
      time: {
        $gte: fromTime,$lte: toTime,
      },
    });

    if (appointments.length > 0) {
      return res.status(200).send({
        message: "Appointments not Available at this time",
        success: false,
      });
    } else {
      return res.status(200).send({
        success: true,
        message: "Appointments Available",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error In Booking Availability",
    });
  }
};

/////////////
const userAppointmentsController = async (req, res) => {
  try {
    const currentUserId = req.body.userId;

    console.log("=====================================================");
    console.log("🔍 currentUserId:", currentUserId);
    console.log("🔍 type:", typeof currentUserId);
    console.log("🔍 String form:", String(currentUserId));

    // 🔥 SAB appointments print karo with exact userId
    const allAppointments = await appointmentModel.find({});
    console.log("📦 Total appointments in DB:", allAppointments.length);

    allAppointments.forEach((a, i) => {
      const dbUserId = String(a.userId);
      const reqUserId = String(currentUserId);
      console.log(`   [${i}] DB userId   = "${dbUserId}"`);
      console.log(`       REQ userId  = "${reqUserId}"`);
      console.log(`       EQUAL?      = ${dbUserId === reqUserId}`);
      console.log(`       LENGTHS:    DB=${dbUserId.length}, REQ=${reqUserId.length}`);
    });
    console.log("=====================================================");

    if (!currentUserId) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized - userId missing",
      });
    }

    // 🔥 ROBUST QUERY — String + ObjectId dono try karo
    let appointments = await appointmentModel.find({
      userId: currentUserId,
    });

    // Agar upar se empty aaya, to String form try karo
    if (appointments.length === 0) {
      appointments = await appointmentModel.find({
        userId: String(currentUserId),
      });
    }

    // Agar phir bhi empty, to ObjectId form try karo
    if (appointments.length === 0) {
      try {
        appointments = await appointmentModel.find({
          userId: new mongoose.Types.ObjectId(currentUserId),
        });
      } catch (e) {
        console.log("ObjectId conversion failed:", e.message);
      }
    }

    console.log("✅ Final Query result count:", appointments.length);

    // Doctor details populate
    const populatedAppointments = await Promise.all(
      appointments.map(async (appointment) => {
        let doctorDetails = null;
        try {
          if (
            appointment.doctorInfo &&
            typeof appointment.doctorInfo === "object" &&
            appointment.doctorInfo !== null &&
            appointment.doctorInfo.firstName
          ) {
            doctorDetails = appointment.doctorInfo;
          } else {
            const docId = appointment.doctorId || appointment.doctorInfo;
            if (docId) {
              doctorDetails = await doctorModel.findById(docId);
            }
          }
        } catch (err) {
          console.log("Doctor fetch error:", err.message);
        }

        return {
          ...appointment.toObject(),
          doctorDetails,
        };
      })
    );

    res.status(200).send({
      success: true,
      message: "Users appointments fetched successfully",
      data: populatedAppointments,
    });
  } catch (error) {
    console.log("Error in userAppointmentsController:", error);
    res.status(500).send({
      success: false,
      message: "Error in User Appointments",
      error: error.message,
    });
  }
};

// Update Profile Pic Controller
const updateProfilePicController = async (req, res) => {
  try {
    const { userId, profilePic } = req.body;
    const user = await userModel.findByIdAndUpdate(
      userId,
      { profilePic },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Profile photo updated successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in updating profile picture",
      error,
    });
  }
};
 
module.exports = {
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
  updateProfilePicController,
};