import React from "react";
import { Form, Input, message, Button, Card } from "antd";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  MailOutlined,
  LockOutlined,
  MedicineBoxOutlined,
  LoginOutlined,
  UserAddOutlined,
} from "@ant-design/icons";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Form Submission Handler
  const onfinishHandler = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post("/api/v1/user/login", values);
      window.location.reload();
      dispatch(hideLoading());
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        message.success("Login Successfully!");
        navigate("/");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Something went wrong");
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
      {/* Professional Ambient Glow Elements */}
      <div
        style={{
          position: "absolute",
          width: "350px",
          height: "350px",
          borderRadius: "50%",
          background: "rgba(42, 82, 152, 0.4)",
          filter: "blur(90px)",
          top: "10%",
          left: "15%",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "350px",
          height: "350px",
          borderRadius: "50%",
          background: "rgba(30, 60, 114, 0.4)",
          filter: "blur(90px)",
          bottom: "10%",
          right: "15%",
        }}
      />

      {/* Main Glassmorphic Login Card */}
      <Card
        className="shadow-lg border-0 rounded-4 p-4"
        style={{
          maxWidth: "420px",
          width: "100%",
          background: "rgba(255, 255, 255, 0.96)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.35)",
          borderRadius: "20px",
        }}
      >
        {/* Header Icon & Title */}
        <div className="text-center mb-4">
          <div
            className="rounded-circle d-inline-flex align-items-center justify-content-center mb-2 shadow-sm"
            style={{
              width: "62px",
              height: "62px",
              background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
              color: "#ffffff",
              fontSize: "28px",
            }}
          >
            <MedicineBoxOutlined />
          </div>
          <h3 className="fw-bold mb-1" style={{ color: "#1e3c72" }}>
            DOC APP
          </h3>
          <p className="text-muted small m-0">
            Enter your credentials to access your account
          </p>
        </div>

        {/* Login Form */}
        <Form layout="vertical" onFinish={onfinishHandler} className="row g-2">
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
              placeholder="Enter your password"
              size="large"
              className="rounded-3"
            />
          </Form.Item>

          <div className="d-grid mt-3">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              icon={<LoginOutlined />}
              className="rounded-3 fw-bold border-0 shadow-sm"
              style={{
                background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
                height: "45px",
              }}
            >
              Sign In
            </Button>
          </div>
        </Form>

        {/* Footer Navigation Link */}
        <div className="text-center mt-4 pt-2 border-top">
          <span className="text-muted small">Don't have an account? </span>
          <Link
            to="/register"
            className="fw-bold text-decoration-none ms-1"
            style={{ color: "#2a5298" }}
          >
            <UserAddOutlined className="me-1" />
            Register Here
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;