import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import { Table, message, Tag, Card, Row, Col, Button } from "antd";
import moment from "moment";
import {
  MedicineBoxOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  PhoneOutlined,
  UserOutlined,
  CheckOutlined,
  CloseOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);

  // Fetch All Doctors
  const getDoctors = async () => {
    try {
      const res = await axios.get("/api/v1/admin/getAllDoctors", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setDoctors(res.data.data);
      }
    } catch (error) {
      console.log(error);
      message.error("Error fetching doctors list");
    }
  };

  // Handle Account Status (Approve / Reject)
  const handleAccountStatus = async (record, status) => {
    try {
      const res = await axios.post(
        "/api/v1/admin/changeAccountStatus",
        { doctorId: record._id, userId: record.userId, status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        message.success(res.data.message);
        getDoctors(); // Refresh list
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      message.error("Something went wrong");
    }
  };

  useEffect(() => {
    getDoctors();
  }, []);

  // Summary Widgets Stats
  const approvedCount = doctors.filter((d) => d.status === "approved").length;
  const pendingCount = doctors.filter((d) => d.status === "pending").length;

  const columns = [
    {
      title: "Doctor Name",
      dataIndex: "name",
      render: (text, record) => (
        <div className="d-flex align-items-center">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center me-2 text-primary fw-bold"
            style={{ width: "38px", height: "38px", backgroundColor: "#e8f4ff" }}
          >
            <UserOutlined />
          </div>
          <div>
            <div className="fw-bold text-dark">
              Dr. {record.firstName} {record.lastName}
            </div>
            <small className="text-muted">{record.specialization || "Specialist"}</small>
          </div>
        </div>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      render: (text, record) => (
        <span className="text-muted fw-medium">
          <PhoneOutlined className="me-1 text-primary" />
          {record.phone}
        </span>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (text, record) => (
        <span className="text-muted small">
          <CalendarOutlined className="me-1" />
          {moment(record.createdAt).format("DD-MM-YYYY")}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => {
        if (status === "approved") {
          return <Tag color="success" icon={<CheckCircleOutlined />}>APPROVED</Tag>;
        } else if (status === "pending") {
          return <Tag color="warning" icon={<ClockCircleOutlined />}>PENDING</Tag>;
        } else {
          return <Tag color="error">REJECTED</Tag>;
        }
      },
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex gap-2">
          {record.status === "pending" ? (
            <Button
              type="primary"
              size="small"
              icon={<CheckOutlined />}
              style={{ backgroundColor: "#2e7d32", borderColor: "#2e7d32" }}
              onClick={() => handleAccountStatus(record, "approved")}
            >
              Approve
            </Button>
          ) : (
            <Button
              type="primary"
              danger
              size="small"
              icon={<CloseOutlined />}
              onClick={() => handleAccountStatus(record, "rejected")}
            >
              Reject
            </Button>
          )}
        </div>
      ),
    },
  ];

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
          <h2 className="mb-1 text-white">Doctors Management 👨‍⚕️</h2>
          <p className="m-0 text-light opacity-75">
            Review registered doctor applications, approve clinic profiles, and manage access.
          </p>
        </div>

        {/* Widgets Section */}
        <Row gutter={[16, 16]} className="mb-4">
          <Col xs={24} sm={8}>
            <Card className="shadow-sm border-0 rounded-3 text-center" style={{ background: "#e8f4ff" }}>
              <h3 className="text-primary m-0 fw-bold">{doctors.length}</h3>
              <small className="text-muted fw-semibold">Total Registered Doctors</small>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="shadow-sm border-0 rounded-3 text-center" style={{ background: "#e6f9f0" }}>
              <h3 className="text-success m-0 fw-bold">{approvedCount}</h3>
              <small className="text-muted fw-semibold">Active / Approved Doctors</small>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="shadow-sm border-0 rounded-3 text-center" style={{ background: "#fff9e6" }}>
              <h3 className="text-warning m-0 fw-bold">{pendingCount}</h3>
              <small className="text-muted fw-semibold">Pending Approval Requests</small>
            </Card>
          </Col>
        </Row>

        {/* Doctors Table Card */}
        <Card className="shadow-sm border-0 rounded-4">
          <h5 className="mb-3 text-dark fw-bold">
            <MedicineBoxOutlined className="me-2 text-primary" />
            All Registered Doctors List
          </h5>
          <Table
            columns={columns}
            dataSource={doctors}
            rowKey="_id"
            pagination={{ pageSize: 6 }}
            className="rounded-3 overflow-hidden"
          />
        </Card>
      </div>
    </Layout>
  );
};

export default Doctors;