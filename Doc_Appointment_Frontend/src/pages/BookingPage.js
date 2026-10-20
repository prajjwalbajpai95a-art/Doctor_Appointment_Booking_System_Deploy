import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { DatePicker, TimePicker, message, Card, Button, Tag, Row, Col } from "antd";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import {
  UserOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  MedicineBoxOutlined,
} from "@ant-design/icons";

const BookingPage = () => {
  const { user } = useSelector((state) => state.user);
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [isAvailable, setIsAvailable] = useState(false);

  // Doctor details fetch function
  const getUserData = async () => {
    try {
      const docId = params.doctorId || params.id;
      const token = localStorage.getItem("token");

      let res = await axios.post(
        "/api/v1/user/getDoctorById",
        { doctorId: docId },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      if (!res.data.success || !res.data.data) {
        res = await axios.post(
          "/api/v1/doctor/getDoctorById",
          { doctorId: docId },
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
      }

      if (res.data.success && res.data.data) {
        setDoctors(res.data.data);
      } else {
        console.log("Doctor details not found:", res.data.message);
      }
    } catch (error) {
      console.log("Error in fetching doctor:", error);
    }
  };

  // Check Availability Function
  const handleAvailability = async () => {
    try {
      if (!date || !time) {
        return message.error("Date & Time required");
      }
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/booking-availability",
        { doctorId: params.doctorId || params.id, date, time },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        setIsAvailable(true);
        message.success(res.data.message);
      } else {
        setIsAvailable(false);
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Something went wrong in availability check");
    }
  };

  // Corrected Booking Function (Passes complete doctor object as doctorInfo)
  const handleBooking = async () => {
    try {
      if (!date || !time) {
        return message.error("Date & Time are required!");
      }
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/book-appointment",
        {
          doctorId: params.doctorId || params.id,
          userId: user?._id,
          doctorInfo: doctors, // FIXED: Sends complete doctors object to DB
          date: date,
          time: time,
          userInfo: user,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
        navigate("/appointments"); // Booking ke baad appointments page par navigate karein
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Error in booking appointment");
    }
  };

  useEffect(() => {
    getUserData();
    //eslint-disable-next-line
  }, []);

  return (
    <Layout>
      <div className="p-3">
        {/* Banner Section */}
        <div
          className="p-4 mb-4 text-white rounded-4 shadow-sm"
          style={{
            background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
          }}
        >
          <h2 className="mb-1 text-white">Book Your Appointment 📅</h2>
          <p className="m-0 text-light opacity-75">
            Select your preferred date and time slot to confirm your doctor visit.
          </p>
        </div>

        {doctors ? (
          <Row gutter={[20, 20]}>
            {/* Doctor Info Card */}
            <Col xs={24} md={10}>
              <Card className="shadow-sm border-0 rounded-4 p-2 text-center">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 text-primary fw-bold"
                  style={{ width: "80px", height: "80px", backgroundColor: "#e8f4ff", fontSize: "32px" }}
                >
                  {doctors?.firstName?.[0] || "D"}
                </div>
                <h3 className="fw-bold text-dark m-0">
                  Dr. {doctors?.firstName} {doctors?.lastName}
                </h3>
                <Tag color="blue" className="mt-2 fs-6 px-3 py-1 rounded-pill">
                  {doctors?.specialization || "Specialist"}
                </Tag>

                <hr className="my-3" />

                <div className="text-start px-2">
                  <p className="mb-2 text-muted fs-6">
                    <MedicineBoxOutlined className="me-2 text-primary" />
                    <b>Experience:</b> {doctors?.experience} Years
                  </p>
                  <p className="mb-2 text-muted fs-6">
                    <DollarOutlined className="me-2 text-success" />
                    <b>Consultation Fee:</b> ₹{doctors?.feesPerCunsaltation || doctors?.feesPerConsultation}
                  </p>
                  <p className="mb-0 text-muted fs-6">
                    <ClockCircleOutlined className="me-2 text-warning" />
                    <b>Timings:</b> {doctors?.timings?.[0]} - {doctors?.timings?.[1]}
                  </p>
                </div>
              </Card>
            </Col>

            {/* Date Time Picker & Action Card */}
            <Col xs={24} md={14}>
              <Card className="shadow-sm border-0 rounded-4 p-3">
                <h5 className="text-primary mb-3 fw-bold">
                  <CalendarOutlined className="me-2" /> Select Visit Date & Time
                </h5>

                <div className="d-flex flex-column gap-3">
                  <div>
                    <label className="fw-semibold mb-1">Select Date:</label>
                    <DatePicker
                      size="large"
                      className="w-100 rounded-3"
                      format="DD-MM-YYYY"
                      onChange={(value) => {
                        setIsAvailable(false);
                        setDate(value ? moment(value).format("DD-MM-YYYY") : "");
                      }}
                    />
                  </div>

                  <div>
                    <label className="fw-semibold mb-1">Select Time Slot:</label>
                    <TimePicker
                      size="large"
                      className="w-100 rounded-3"
                      format="HH:mm"
                      onChange={(value) => {
                        setIsAvailable(false);
                        setTime(value ? moment(value).format("HH:mm") : "");
                      }}
                    />
                  </div>

                  <Button
                    type="default"
                    size="large"
                    icon={<CheckCircleOutlined />}
                    className="w-100 rounded-3 fw-semibold mt-2"
                    style={{ borderColor: "#1e3c72", color: "#1e3c72" }}
                    onClick={handleAvailability}
                  >
                    Check Availability
                  </Button>

                  <Button
                    type="primary"
                    size="large"
                    className="w-100 rounded-3 fw-bold"
                    style={{
                      background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
                      border: "none",
                    }}
                    onClick={handleBooking}
                  >
                    Book Now
                  </Button>
                </div>
              </Card>
            </Col>
          </Row>
        ) : (
          <div className="text-center p-5">
            <h4 className="text-muted">Loading Doctor Details...</h4>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BookingPage;