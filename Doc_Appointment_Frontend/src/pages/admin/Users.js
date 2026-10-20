import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import { Table, message, Tag, Card, Row, Col, Button } from "antd";
import moment from "moment";
import {
  UserOutlined,
  MailOutlined,
  MedicineBoxOutlined,
  StopOutlined,
  TeamOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

const Users = () => {
  const [users, setUsers] = useState([]);

  // Fetch All Users
  const getUsers = async () => {
    try {
      const res = await axios.get("/api/v1/admin/getAllUsers", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (error) {
      console.log(error);
      message.error("Error fetching users list");
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  // Summary Widgets Stats
  const totalUsers = users.length;
  const doctorUsers = users.filter((u) => u.isDoctor).length;
  const patientUsers = users.filter((u) => !u.isDoctor).length;

  // Helper to safely format date (Fallback to Mongo ObjectId timestamp if createdAt missing)
  const getFormattedDate = (record) => {
    if (record?.createdAt) {
      return moment(record.createdAt).format("DD-MM-YYYY");
    }
    // Extract creation date from MongoDB ObjectId string if createdAt doesn't exist
    if (record?._id && record._id.length === 24) {
      const timestamp = parseInt(record._id.substring(0, 8), 16) * 1000;
      if (!isNaN(timestamp)) {
        return moment(timestamp).format("DD-MM-YYYY");
      }
    }
    return moment().format("DD-MM-YYYY");
  };

  const columns = [
    {
      title: "User Name",
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
            <div className="fw-bold text-dark text-capitalize">{record.name}</div>
            <small className="text-muted">ID: #{record._id.slice(-6)}</small>
          </div>
        </div>
      ),
    },
    {
      title: "Email Address",
      dataIndex: "email",
      render: (email) => (
        <span className="text-muted fw-medium">
          <MailOutlined className="me-1 text-primary" />
          {email}
        </span>
      ),
    },
    {
      title: "Account Role",
      dataIndex: "isDoctor",
      render: (isDoctor) =>
        isDoctor ? (
          <Tag color="blue" icon={<MedicineBoxOutlined />}>
            DOCTOR
          </Tag>
        ) : (
          <Tag color="cyan" icon={<UserOutlined />}>
            PATIENT
          </Tag>
        ),
    },
    {
      title: "Registered Date",
      dataIndex: "createdAt",
      render: (text, record) => (
        <span className="text-dark fw-medium small">
          <CalendarOutlined className="me-1 text-primary" />
          {getFormattedDate(record)}
        </span>
      ),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <Button
          type="primary"
          danger
          size="small"
          icon={<StopOutlined />}
          className="rounded-2"
          onClick={() => message.info(`Block user feature for ${record.name}`)}
        >
          Block
        </Button>
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
          <h2 className="mb-1 text-white">Users Management 👥</h2>
          <p className="m-0 text-light opacity-75">
            Monitor registered patients and system accounts registered on Doc App.
          </p>
        </div>

        {/* Stats Summary Widgets */}
        <Row gutter={[16, 16]} className="mb-4">
          <Col xs={24} sm={8}>
            <Card className="shadow-sm border-0 rounded-3 text-center" style={{ background: "#e8f4ff" }}>
              <h3 className="text-primary m-0 fw-bold">{totalUsers}</h3>
              <small className="text-muted fw-semibold">Total Registered Accounts</small>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="shadow-sm border-0 rounded-3 text-center" style={{ background: "#e6f9f0" }}>
              <h3 className="text-success m-0 fw-bold">{patientUsers}</h3>
              <small className="text-muted fw-semibold">Active Patients</small>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="shadow-sm border-0 rounded-3 text-center" style={{ background: "#fff9e6" }}>
              <h3 className="text-warning m-0 fw-bold">{doctorUsers}</h3>
              <small className="text-muted fw-semibold">Registered Doctors</small>
            </Card>
          </Col>
        </Row>

        {/* Users Table Card */}
        <Card className="shadow-sm border-0 rounded-4">
          <h5 className="mb-3 text-dark fw-bold">
            <TeamOutlined className="me-2 text-primary" />
            All System Users
          </h5>
          <Table
            columns={columns}
            dataSource={users}
            rowKey="_id"
            pagination={{ pageSize: 6 }}
            className="rounded-3 overflow-hidden"
          />
        </Card>
      </div>
    </Layout>
  );
};

export default Users;