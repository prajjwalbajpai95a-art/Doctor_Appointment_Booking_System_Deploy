import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { Table, Tag, Card, Row, Col, message } from "antd";
import moment from "moment";
import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  SolutionOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  // ============================================================
  // Fetch Patient Appointments (POST — matches backend route)
  // ============================================================
  const getAppointments = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        "/api/v1/user/user-appointments",
        {}, // body empty — authMiddleware token se userId set karta hai
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("Appointments API Response:", res.data); // 🔍 debug

      if (res.data.success) {
        setAppointments(res.data.data);
      } else {
        message.error(res.data.message || "Failed to fetch appointments");
      }
    } catch (error) {
      console.log("Error fetching appointments:", error);
      message.error("Error fetching appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAppointments();
  }, []);

  // ============================================================
  // Helpers
  // ============================================================
  const getDoctorName = (record) => {
    const doc = record?.doctorDetails || record?.doctorInfo;

    if (doc && typeof doc === "object" && doc !== null) {
      const firstName = doc.firstName || doc.name || "";
      const lastName = doc.lastName || "";
      const fullName = `${firstName} ${lastName}`.trim();
      if (fullName) return `Dr. ${fullName}`;
    }
    return "Dr. Specialist Doctor";
  };

  const getDoctorSpecialization = (record) => {
    const doc = record?.doctorDetails || record?.doctorInfo;
    if (doc && typeof doc === "object" && doc.specialization) {
      return doc.specialization;
    }
    return "General Physician";
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    const m = moment(date);
    return m.isValid() ? m.format("DD-MM-YYYY") : date;
  };

  const formatTime = (time) => {
    if (!time) return "N/A";
    const m = moment(time);
    return m.isValid() ? m.format("hh:mm A") : time;
  };

  // ============================================================
  // Stats
  // ============================================================
  const pendingCount = appointments.filter(
    (a) => (a.status || "").toLowerCase() === "pending"
  ).length;
  const approvedCount = appointments.filter(
    (a) => (a.status || "").toLowerCase() === "approved"
  ).length;

  // ============================================================
  // Columns
  // ============================================================
  const columns = [
    {
      title: "Appointment ID",
      dataIndex: "_id",
      render: (id) => (
        <span className="text-muted fw-semibold">
          #{id ? id.slice(-6).toUpperCase() : "N/A"}
        </span>
      ),
    },
    {
      title: "Doctor Name",
      dataIndex: "doctorDetails",
      render: (text, record) => (
        <div className="d-flex align-items-center">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center me-2 text-primary fw-bold"
            style={{ width: "35px", height: "35px", backgroundColor: "#e8f4ff" }}
          >
            <UserOutlined />
          </div>
          <div className="d-flex flex-column">
            <span className="fw-semibold">{getDoctorName(record)}</span>
            <small className="text-muted">
              {getDoctorSpecialization(record)}
            </small>
          </div>
        </div>
      ),
    },
    {
      title: "Date & Time",
      dataIndex: "date",
      render: (text, record) => (
        <div className="d-flex flex-column">
          <span className="fw-medium text-dark">
            <CalendarOutlined className="me-1 text-primary" />
            {formatDate(record.date)}
          </span>
          <small className="text-muted">
            <ClockCircleOutlined className="me-1 text-warning" />
            {formatTime(record.time)}
          </small>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => {
        const s = (status || "pending").toLowerCase();
        if (s === "pending") {
          return (
            <Tag color="warning" icon={<ClockCircleOutlined />}>
              PENDING
            </Tag>
          );
        } else if (s === "approved") {
          return (
            <Tag color="success" icon={<CheckCircleOutlined />}>
              APPROVED
            </Tag>
          );
        } else {
          return (
            <Tag color="error" icon={<CloseCircleOutlined />}>
              REJECTED
            </Tag>
          );
        }
      },
    },
  ];

  // ============================================================
  // Render
  // ============================================================
  return (
    <Layout>
      <div className="p-3">
        {/* Banner */}
        <div
          className="p-4 mb-4 text-white rounded-4 shadow-sm"
          style={{
            background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
          }}
        >
          <h2 className="mb-1 text-white">My Appointments 🩺</h2>
          <p className="m-0 text-light opacity-75">
            Track your scheduled visits, appointment status, and consultation
            timings.
          </p>
        </div>

        {/* Stats */}
        <Row gutter={[16, 16]} className="mb-4">
          <Col xs={24} sm={8}>
            <Card
              className="shadow-sm border-0 rounded-3 text-center"
              style={{ background: "#e8f4ff" }}
            >
              <h3 className="text-primary m-0 fw-bold">{appointments.length}</h3>
              <small className="text-muted fw-semibold">Total Bookings</small>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card
              className="shadow-sm border-0 rounded-3 text-center"
              style={{ background: "#fff9e6" }}
            >
              <h3 className="text-warning m-0 fw-bold">{pendingCount}</h3>
              <small className="text-muted fw-semibold">
                Pending Confirmation
              </small>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card
              className="shadow-sm border-0 rounded-3 text-center"
              style={{ background: "#e6f9f0" }}
            >
              <h3 className="text-success m-0 fw-bold">{approvedCount}</h3>
              <small className="text-muted fw-semibold">Approved Visits</small>
            </Card>
          </Col>
        </Row>

        {/* Table */}
        <Card className="shadow-sm border-0 rounded-4">
          <h5 className="mb-3 text-dark fw-bold">
            <SolutionOutlined className="me-2 text-primary" />
            Booking History
          </h5>
          <Table
            columns={columns}
            dataSource={appointments}
            rowKey="_id"
            loading={loading}
            pagination={{ pageSize: 6 }}
            className="rounded-3 overflow-hidden"
          />
        </Card>
      </div>
    </Layout>
  );
};

export default Appointments;