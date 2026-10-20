import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { Row, Col, Card, Input, Tag, Button, Avatar } from "antd";
import { useNavigate } from "react-router-dom";
import {
  SearchOutlined,
  UserOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  SolutionOutlined,
} from "@ant-design/icons";

const HomePage = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Get Doctors Data
  const getUserData = async () => {
    try {
      const res = await axios.get("/api/v1/user/getAllDoctors", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      if (res.data.success) {
        setDoctors(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  // Filter Doctors based on Search Input
  const filteredDoctors = doctors.filter(
    (doc) =>
      doc.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h2 className="mb-1">Find & Book Your Doctor 👨‍⚕️</h2>
          <p className="m-0 text-light">
            Search top specialists, view availability, and schedule appointments instantly.
          </p>
        </div>

        {/* Stats Summary Widgets */}
        <Row gutter={[16, 16]} className="mb-4">
          <Col xs={24} sm={8}>
            <Card
              className="shadow-sm border-0 rounded-3 text-center"
              style={{ background: "#e8f4ff" }}
            >
              <h4 className="text-primary m-0">
                <SolutionOutlined /> {doctors.length}
              </h4>
              <small className="text-muted">Total Available Doctors</small>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card
              className="shadow-sm border-0 rounded-3 text-center"
              style={{ background: "#e6f9f0" }}
            >
              <h4 className="text-success m-0">
                <ClockCircleOutlined /> 24/7
              </h4>
              <small className="text-muted">Instant Booking Active</small>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card
              className="shadow-sm border-0 rounded-3 text-center"
              style={{ background: "#fff4e6" }}
            >
              <h4 className="text-warning m-0">
                <UserOutlined /> Verified
              </h4>
              <small className="text-muted">Specialized Healthcare</small>
            </Card>
          </Col>
        </Row>

        {/* Search Bar */}
        <div className="mb-4">
          <Input
            size="large"
            placeholder="Search by Doctor Name or Specialization (e.g. Skin, Dental)..."
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-3 shadow-sm"
          />
        </div>

        {/* Doctor Cards Section */}
        <h4 className="mb-3">Available Specialists</h4>
        <Row gutter={[16, 16]}>
          {filteredDoctors && filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor) => (
              <Col xs={24} sm={12} md={8} lg={8} key={doctor._id}>
                <Card
                  hoverable
                  className="shadow-sm border-0 rounded-4 h-100"
                  style={{ transition: "all 0.3s ease" }}
                  onClick={() =>
                    navigate(`/doctor/book-appointment/${doctor._id}`)
                  }
                >
                  <div className="d-flex align-items-center mb-3">
                    {/* Doctor Profile Photo / Avatar */}
                    <Avatar
                      size={60}
                      src={
                        doctor.image ||
                        `https://api.dicebear.com/7.x/initials/svg?seed=${doctor.firstName}%20${doctor.lastName}`
                      }
                      icon={<UserOutlined />}
                      className="me-3 border border-2 border-primary shadow-sm"
                    />

                    <div>
                      <h5 className="m-0">
                        Dr. {doctor.firstName} {doctor.lastName}
                      </h5>
                      <Tag color="blue" className="mt-1">
                        {doctor.specialization}
                      </Tag>
                    </div>
                  </div>

                  <hr className="my-2" />

                  <p className="mb-2 text-muted">
                    <SolutionOutlined className="me-2" /> <b>Experience:</b>{" "}
                    {doctor.experience} Years
                  </p>
                  <p className="mb-2 text-muted">
                    <DollarOutlined className="me-2" /> <b>Consultation Fee:</b>{" "}
                    ₹{doctor.feesPerCunsaltation}
                  </p>
                  <p className="mb-3 text-muted">
                    <ClockCircleOutlined className="me-2" /> <b>Timings:</b>{" "}
                    {doctor.timings[0]} - {doctor.timings[1]}
                  </p>

                  <Button
                    type="primary"
                    block
                    className="rounded-3"
                    style={{ background: "#2a5298" }}
                  >
                    Book Appointment
                  </Button>
                </Card>
              </Col>
            ))
          ) : (
            <Col span={24}>
              <div className="text-center p-5 text-muted">
                <h5>No Doctors Found matching "{searchTerm}"</h5>
              </div>
            </Col>
          )}
        </Row>
      </div>
    </Layout>
  );
};

export default HomePage;