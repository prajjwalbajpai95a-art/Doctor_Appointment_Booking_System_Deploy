import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import moment from "moment";
import { Table, message, Tag, Card, Row, Col, Button } from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CheckOutlined,
  CloseOutlined,
  PhoneOutlined,
  MailOutlined,
  SolutionOutlined,
} from "@ant-design/icons";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  // ============================================================
  // Fetch Appointments (POST)
  // ============================================================
  const getAppointments = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        "/api/v1/doctor/doctor-appointments",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        setAppointments(res.data.data || []);
      } else {
        message.error(res.data.message || "Failed to fetch appointments");
      }
    } catch (error) {
      console.error("Fetch appointments error:", error);
      message.error(
        error?.response?.data?.message || "Error fetching appointments"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAppointments();
  }, []);

  // ============================================================
  // Update Status (Approve / Reject)
  // ============================================================
  const handleStatus = async (record, status) => {
    try {
      setLoading(true);
      const res = await axios.post(
        "/api/v1/doctor/update-status",
        { appointmentId: record._id, status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        message.success(res.data.message || `Appointment ${status}`);
        await getAppointments();
      } else {
        message.error(res.data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Update status error:", error);
      message.error(
        error?.response?.data?.message ||
          "Something went wrong in updating status"
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // Helper: Patient Name
  // ============================================================
  const getPatientName = (record) => {
    if (record?.patientName && record.patientName !== "N/A") {
      return record.patientName;
    }
    if (
      record?.userInfo &&
      typeof record.userInfo === "object" &&
      record.userInfo.name
    ) {
      return record.userInfo.name;
    }
    if (
      record?.userId &&
      typeof record.userId === "object" &&
      record.userId.name
    ) {
      return record.userId.name;
    }
    return "Patient";
  };

  // ============================================================
  // Helper: Patient Contact (Phone ya Email)
  // ============================================================
  const getPatientContact = (record) => {
    // 1. Backend enriched patientPhone
    if (record?.patientPhone && record.patientPhone !== "N/A") {
      return record.patientPhone;
    }
    // 2. userInfo object
    if (record?.userInfo) {
      if (record.userInfo.phone) return record.userInfo.phone;
      if (record.userInfo.mobile) return record.userInfo.mobile;
      if (record.userInfo.email) return record.userInfo.email;
    }
    // 3. Populated userId
    if (record?.userId && typeof record.userId === "object") {
      if (record.userId.phone) return record.userId.phone;
      if (record.userId.mobile) return record.userId.mobile;
      if (record.userId.email) return record.userId.email;
    }
    return "N/A";
  };

  // ============================================================
  // Date + Time Formatters
  // ============================================================
  const formatDate = (date) => {
    if (!date) return "N/A";
    const strict = moment(date, "DD-MM-YYYY", true);
    if (strict.isValid()) return strict.format("DD-MM-YYYY");
    const loose = moment(date);
    return loose.isValid() ? loose.format("DD-MM-YYYY") : date;
  };

  const formatTime = (time) => {
    if (!time) return "N/A";
    const strict = moment(time, ["HH:mm", "hh:mm A", "HH:mm:ss"], true);
    if (strict.isValid()) return strict.format("hh:mm A");
    const loose = moment(time, ["HH:mm", "hh:mm A", "HH:mm:ss"]);
    return loose.isValid() ? loose.format("hh:mm A") : time;
  };

  // ============================================================
  // Stats
  // ============================================================
  const totalRequests = appointments.length;
  const pendingApprovals = appointments.filter(
    (a) => (a.status || "pending").toLowerCase() === "pending"
  ).length;
  const confirmedAppointments = appointments.filter(
    (a) => (a.status || "").toLowerCase() === "approved"
  ).length;

  // ============================================================
  // Table Columns
  // ============================================================
  const columns = [
    {
      title: "Patient Name",
      dataIndex: "patientName",
      key: "patientName",
      render: (_, record) => (
        <div className="d-flex align-items-center">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center me-2 text-primary fw-bold"
            style={{ width: "36px", height: "36px", backgroundColor: "#e8f4ff" }}
          >
            <UserOutlined />
          </div>
          <span className="fw-bold text-dark text-capitalize">
            {getPatientName(record)}
          </span>
        </div>
      ),
    },
    {
      title: "Contact",
      dataIndex: "patientPhone",
      key: "patientPhone",
      render: (_, record) => {
        const contact = getPatientContact(record);
        const isEmail = contact && contact.includes("@");
        return (
          <span className="text-muted fw-medium">
            {isEmail ? (
              <MailOutlined className="me-1 text-primary" />
            ) : (
              <PhoneOutlined className="me-1 text-primary" />
            )}
            {contact}
          </span>
        );
      },
    },
    {
      title: "Date & Time",
      dataIndex: "date",
      key: "date",
      render: (_, record) => (
        <div className="d-flex flex-column">
          <span className="fw-medium text-dark">
            <CalendarOutlined className="me-1 text-primary" />
            {formatDate(record.date)}
          </span>
          <small className="text-muted">
            <ClockCircleOutlined className="me-1" />
            {formatTime(record.time)}
          </small>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const s = (status || "pending").toLowerCase();
        if (s === "approved") {
          return (
            <Tag color="success" icon={<CheckOutlined />}>
              APPROVED
            </Tag>
          );
        }
        if (s === "rejected") {
          return (
            <Tag color="error" icon={<CloseOutlined />}>
              REJECTED
            </Tag>
          );
        }
        return (
          <Tag color="warning" icon={<ClockCircleOutlined />}>
            PENDING
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_, record) => {
        const s = (record.status || "pending").toLowerCase();
        if (s === "pending") {
          return (
            <div className="d-flex gap-2">
              <Button
                type="primary"
                size="small"
                icon={<CheckOutlined />}
                style={{ backgroundColor: "#2e7d32", borderColor: "#2e7d32" }}
                onClick={() => handleStatus(record, "approved")}
              >
                Approve
              </Button>
              <Button
                type="primary"
                danger
                size="small"
                icon={<CloseOutlined />}
                onClick={() => handleStatus(record, "rejected")}
              >
                Reject
              </Button>
            </div>
          );
        }
        return <span className="text-muted small">No action needed</span>;
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
          <h2 className="mb-1 text-white">Appointments Management 📅</h2>
          <p className="m-0 text-light opacity-75">
            Manage your patient schedules, review requests, and update
            consultation status.
          </p>
        </div>

        {/* Stats */}
        <Row gutter={[16, 16]} className="mb-4">
          <Col xs={24} sm={8}>
            <Card
              className="shadow-sm border-0 rounded-3 text-center"
              style={{ background: "#e8f4ff" }}
            >
              <h3 className="text-primary m-0 fw-bold">{totalRequests}</h3>
              <small className="text-muted fw-semibold">Total Requests</small>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card
              className="shadow-sm border-0 rounded-3 text-center"
              style={{ background: "#fff9e6" }}
            >
              <h3 className="text-warning m-0 fw-bold">{pendingApprovals}</h3>
              <small className="text-muted fw-semibold">Pending Approvals</small>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card
              className="shadow-sm border-0 rounded-3 text-center"
              style={{ background: "#e6f9f0" }}
            >
              <h3 className="text-success m-0 fw-bold">
                {confirmedAppointments}
              </h3>
              <small className="text-muted fw-semibold">
                Confirmed Appointments
              </small>
            </Card>
          </Col>
        </Row>

        {/* Table */}
        <Card className="shadow-sm border-0 rounded-4">
          <h5 className="mb-3 text-dark fw-bold">
            <SolutionOutlined className="me-2 text-primary" />
            Recent Patient Requests
          </h5>
          <Table
            columns={columns}
            dataSource={appointments}
            rowKey="_id"
            loading={loading}
            pagination={{ pageSize: 6 }}
            className="rounded-3 overflow-hidden"
            scroll={{ x: 700 }}
          />
        </Card>
      </div>
    </Layout>
  );
};

export default DoctorAppointments;