import React from "react";
import { Form, Input, message, Button, Card, Row, Col } from "antd";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  MedicineBoxOutlined,
  UserAddOutlined,
  LoginOutlined,
  CheckCircleOutlined,
  SafetyCertificateOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Form Submission Handler
  const onfinishHandler = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post("/api/v1/user/register", values);
      dispatch(hideLoading());
      if (res.data.success) {
        message.success("Registered Successfully!");
        navigate("/login");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Something Went Wrong");
    }
  };

  return (
    <div
      className="vh-100 d-flex align-items-center justify-content-center p-3"
      style={{
        background: "linear-gradient(135deg, #0f2027 0%, #1e3c72 50%, #2a5298 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Ambient Glow Effects */}
      <div
        style={{
          position: "absolute",
          width: "350px",
          height: "350px",
          borderRadius: "50%",
          background: "rgba(42, 82, 152, 0.35)",
          filter: "blur(90px)",
          top: "5%",
          left: "10%",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "350px",
          height: "350px",
          borderRadius: "50%",
          background: "rgba(30, 60, 114, 0.35)",
          filter: "blur(90px)",
          bottom: "5%",
          right: "10%",
        }}
      />

      {/* Main Glassmorphic Card Container */}
      <Card
        className="shadow-lg border-0 rounded-4 overflow-hidden"
        style={{
          maxWidth: "920px",
          width: "100%",
          background: "rgba(255, 255, 255, 0.96)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.35)",
          borderRadius: "24px",
        }}
        bodyStyle={{ padding: 0 }}
      >
        <Row g={0}>
          {/* Left Column: Professional Medical Theme Banner */}
          <Col
            xs={0}
            md={11}
            className="d-flex flex-column justify-content-between p-4 text-white"
            style={{
              background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
              minHeight: "520px",
            }}
          >
            {/* Header Brand Badge */}
            <div className="d-flex align-items-center gap-2">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center bg-white text-primary"
                style={{ width: "40px", height: "40px", fontSize: "20px" }}
              >
                <MedicineBoxOutlined />
              </div>
              <span className="fw-bold fs-5 tracking-wide text-white">DOC APP</span>
            </div>

            {/* Middle Feature Highlights */}
            <div className="my-auto py-3">
              <h3 className="fw-bold text-white mb-3">Join Our Healthcare Network</h3>
              <p className="text-light small opacity-85 mb-4">
                Experience effortless appointment scheduling with top-verified doctors and clinical experts.
              </p>

              <div className="d-flex flex-column gap-3">
                <div className="d-flex align-items-center gap-2 text-light small">
                  <CheckCircleOutlined className="text-info fs-6" />
                  <span>Verified Medical Specialists</span>
                </div>
                <div className="d-flex align-items-center gap-2 text-light small">
                  <CalendarOutlined className="text-info fs-6" />
                  <span>Real-Time Appointment Booking</span>
                </div>
                <div className="d-flex align-items-center gap-2 text-light small">
                  <SafetyCertificateOutlined className="text-info fs-6" />
                  <span>100% Secure Healthcare Records</span>
                </div>
              </div>
            </div>

            {/* Bottom Footer Note */}
            <div className="pt-3 border-top border-light border-opacity-25 text-light opacity-75 small">
              © 2026 Doc App Healthcare Platform
            </div>
          </Col>

          {/* Right Column: Clean Registration Form */}
          <Col xs={24} md={13} className="p-4 p-md-5 d-flex flex-column justify-content-center">
            <div className="text-center mb-4">
              <div
                className="rounded-circle d-inline-flex align-items-center justify-content-center mb-2 shadow-sm"
                style={{
                  width: "58px",
                  height: "58px",
                  background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
                  color: "#ffffff",
                  fontSize: "24px",
                }}
              >
                <UserAddOutlined />
              </div>
              <h3 className="fw-bold mb-1" style={{ color: "#1e3c72" }}>
                Create Account
              </h3>
              <p className="text-muted small m-0">
                Fill in your details to get started with Doc App
              </p>
            </div>

            <Form layout="vertical" onFinish={onfinishHandler} className="row g-2">
              <Form.Item
                label={<span className="fw-semibold text-secondary">Full Name</span>}
                name="name"
                rules={[{ required: true, message: "Please input your full name!" }]}
              >
                <Input
                  prefix={<UserOutlined className="text-muted me-2" />}
                  placeholder="Enter your name"
                  size="large"
                  className="rounded-3"
                />
              </Form.Item>

              <Form.Item
                label={<span className="fw-semibold text-secondary">Email Address</span>}
                name="email"
                rules={[
                  { required: true, message: "Please input your email!" },
                  { type: "email", message: "Please enter a valid email!" },
                ]}
              >
                <Input
                  prefix={<MailOutlined className="text-muted me-2" />}
                  placeholder="name@example.com"
                  size="large"
                  className="rounded-3"
                />
              </Form.Item>

              <Form.Item
                label={<span className="fw-semibold text-secondary">Password</span>}
                name="password"
                rules={[{ required: true, message: "Please input your password!" }]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-muted me-2" />}
                  placeholder="Create a strong password"
                  size="large"
                  className="rounded-3"
                />
              </Form.Item>

              <div className="d-grid mt-3">
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  icon={<UserAddOutlined />}
                  className="rounded-3 fw-bold border-0 shadow-sm"
                  style={{
                    background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
                    height: "45px",
                  }}
                >
                  Register Account
                </Button>
              </div>
            </Form>

            <div className="text-center mt-4 pt-2 border-top">
              <span className="text-muted small">Already have an account? </span>
              <Link
                to="/login"
                className="fw-bold text-decoration-none ms-1"
                style={{ color: "#2a5298" }}
              >
                <LoginOutlined className="me-1" />
                Sign In Here
              </Link>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Register;