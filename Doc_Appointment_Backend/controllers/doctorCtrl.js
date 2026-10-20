const doctorModel = require("../models/doctorModel");
const appointmentModel = require("../models/appointmentModel");
const userModel = require("../models/userModels");

// ============================================================
// 1. Get Doctor Appointments Controller
// ============================================================
const getDoctorAppointmentsController = async (req, res) => {
  try {
    // Step 1: Logged-in user ke basis par Doctor Profile dhoondho
    const doctor = await doctorModel.findOne({ userId: req.body.userId });

    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: "Doctor profile not found",
      });
    }

    // Step 2: Robust Query — doctorId ko String, ObjectId, aur direct userId sabse match karo
    const appointments = await appointmentModel.find({
      $or: [
        { doctorId: doctor._id.toString() },
        { doctorId: doctor._id },
        { doctorId: req.body.userId },
      ],
    });

    // Step 3: Har appointment ke liye patient details fetch karo (parallel)
    const populatedAppointments = await Promise.all(
      appointments.map(async (appointment) => {
        let patientName = "N/A";
        let patientPhone = "N/A";

        try {
          // Case A: userInfo already populated object hai
          if (
            appointment.userInfo &&
            typeof appointment.userInfo === "object" &&
            appointment.userInfo !== null
          ) {
            patientName =
              appointment.userInfo.name ||
              appointment.userInfo.username ||
              "N/A";
            patientPhone =
              appointment.userInfo.phone ||
              appointment.userInfo.mobile ||
              "N/A";
          }
          // Case B: userInfo string ID hai ya sirf userId available hai
          else {
            const userIdToFetch =
              typeof appointment.userInfo === "string"
                ? appointment.userInfo
                : appointment.userId;

            if (userIdToFetch) {
              const userDetails = await userModel.findById(userIdToFetch);
              if (userDetails) {
                patientName =
                  userDetails.name || userDetails.username || "N/A";
                patientPhone =
                  userDetails.phone || userDetails.email || "N/A";
              }
            }
          }
        } catch (err) {
          console.log(
            `Error fetching patient info for appointment ${appointment._id}:`,
            err.message
          );
          // patientName / patientPhone "N/A" hi rahenge
        }

        return {
          ...appointment.toObject(),
          patientName,
          patientPhone,
        };
      })
    );

    res.status(200).send({
      success: true,
      message: "Doctor appointments fetched successfully",
      data: populatedAppointments,
    });
  } catch (error) {
    console.log("Error in getDoctorAppointmentsController:", error);
    res.status(500).send({
      success: false,
      message: "Error in fetching Doctor Appointments",
      error: error.message,
    });
  }
};

// ============================================================
// 2. Update Doctor Profile Controller
// ============================================================
const updateDoctorProfileController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOneAndUpdate(
      { userId: req.body.userId },
      req.body,
      { new: true }
    );

    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Doctor Profile Updated Successfully",
      data: doctor,
    });
  } catch (error) {
    console.log("Error in updateDoctorProfileController:", error);
    res.status(500).send({
      success: false,
      message: "Error in updating Doctor Profile",
      error: error.message,
    });
  }
};

// ============================================================
// 3. Get Doctor Info Controller
// ============================================================
const getDoctorInfoController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ userId: req.body.userId });

    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Doctor info fetched successfully",
      data: doctor,
    });
  } catch (error) {
    console.log("Error in getDoctorInfoController:", error);
    res.status(500).send({
      success: false,
      message: "Error in getting Doctor info",
      error: error.message,
    });
  }
};

// ============================================================
// 4. Get Doctor By ID Controller
// ============================================================
const getDoctorByIdController = async (req, res) => {
  try {
    const doctor = await doctorModel.findById(req.body.doctorId);

    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Doctor info fetched successfully",
      data: doctor,
    });
  } catch (error) {
    console.log("Error in getDoctorByIdController:", error);
    res.status(500).send({
      success: false,
      message: "Error in getting Doctor by ID",
      error: error.message,
    });
  }
};

// ============================================================
// 5. Update Appointment Status Controller (Approve/Reject)
// ============================================================
const updateStatusController = async (req, res) => {
  try {
    const { appointmentId, status } = req.body;

    const appointment = await appointmentModel.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).send({
        success: false,
        message: "Appointment not found",
      });
    }

    // Patient ko notification bhejo
    const user = await userModel.findById(appointment.userId);
    if (user) {
      user.notification.push({
        type: "appointment-status-updated",
        message: `Your appointment status has been ${status}`,
        onClickPath: "/appointments",
      });
      await user.save();
    }

    res.status(200).send({
      success: true,
      message: `Appointment ${status} successfully`,
      data: appointment,
    });
  } catch (error) {
    console.log("Error in updateStatusController:", error);
    res.status(500).send({
      success: false,
      message: "Error in updating appointment status",
      error: error.message,
    });
  }
};

// ============================================================
// 6. Get Doctor List Controller
// ============================================================
const getAllDoctorsControllers = async (req, res) => {
  try {
    const doctors = await doctorModel.find({ status: "approved" });

    res.status(200).send({
      success: true,
      message: "Doctors list fetched successfully",
      data: doctors,
    });
  } catch (error) {
    console.log("Error in getAllDoctorsControllers:", error);
    res.status(500).send({
      success: false,
      message: "Error in fetching Doctors list",
      error: error.message,
    });
  }
};

// ============================================================
// Module Exports
// ============================================================
module.exports = {
  getDoctorAppointmentsController,
  updateDoctorProfileController,
  getDoctorInfoController,
  getDoctorByIdController,
  updateStatusController,
  getAllDoctorsControllers,
};