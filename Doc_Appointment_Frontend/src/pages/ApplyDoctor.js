import React from "react";
import Layout from "../components/Layout";
import { Col, Form, Input, Row, TimePicker, message, Card, Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import axios from "axios";
import moment from "moment";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  GlobalOutlined,
  HomeOutlined,
  MedicineBoxOutlined,
  FieldTimeOutlined,
  DollarOutlined,
  SendOutlined,
} from "@ant-design/icons";

const ApplyDoctor = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handle Form Submission
  const handleFinish = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/apply-doctor",
        {
          ...values,
          userId: user._id,
          timings: [
            moment(values.timings[0]).format("HH:mm"),
            moment(values.timings[1]).format("HH:mm"),
          ],
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
        navigate("/");
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
    <Layout>
      <div className="p-3">
        {/* Banner Header */}
        <div
          className="p-4 mb-4 text-white rounded-4 shadow-sm"
          style={{
            background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
          }}
        >
          <h2 className="mb-1 text-white">Apply as Doctor 👨‍⚕️</h2>
          <p className="m-0 text-light opacity-75">
            Fill in your personal and professional details to register your clinic profile on Doc App.
          </p>
        </div>

        {/* Main Form Card */}
        <Card className="shadow-sm border-0 rounded-4 p-2">
          <Form
            layout="vertical"
            onFinish={handleFinish}
            initialValues={{
              email: user?.email,
            }}
          >
            {/* Personal Details */}
            <h5 className="text-primary mb-3 fw-bold">
              <UserOutlined className="me-2" /> Personal Details
            </h5>
            <Row gutter={20}>
              <Col xs={24} sm={24} md={8}>
                <Form.Item
                  label="First Name"
                  name="firstName"
                  required
                  rules={[{ required: true, message: "First name is required" }]}
                >
                  <Input
                    prefix={<UserOutlined className="text-muted" />}
                    placeholder="Enter your first name"
                    size="large"
                    className="rounded-3"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={8}>
                <Form.Item
                  label="Last Name"
                  name="lastName"
                  required
                  rules={[{ required: true, message: "Last name is required" }]}
                >
                  <Input
                    prefix={<UserOutlined className="text-muted" />}
                    placeholder="Enter your last name"
                    size="large"
                    className="rounded-3"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={8}>
                <Form.Item
                  label="Phone No"
                  name="phone"
                  required
                  rules={[{ required: true, message: "Phone number is required" }]}
                >
                  <Input
                    prefix={<PhoneOutlined className="text-muted" />}
                    placeholder="Enter contact number"
                    size="large"
                    className="rounded-3"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={8}>
                <Form.Item
                  label="Email"
                  name="email"
                  required
                  rules={[{ required: true, message: "Email is required" }]}
                >
                  <Input
                    prefix={<MailOutlined className="text-muted" />}
                    placeholder="Enter email address"
                    size="large"
                    className="rounded-3"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={8}>
                <Form.Item label="Website (Optional)" name="website">
                  <Input
                    prefix={<GlobalOutlined className="text-muted" />}
                    placeholder="Enter website link"
                    size="large"
                    className="rounded-3"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={8}>
                <Form.Item
                  label="Clinic Address"
                  name="address"
                  required
                  rules={[{ required: true, message: "Address is required" }]}
                >
                  <Input
                    prefix={<HomeOutlined className="text-muted" />}
                    placeholder="Enter clinic address"
                    size="large"
                    className="rounded-3"
                  />
                </Form.Item>
              </Col>
            </Row>

            <hr className="my-4" />

            {/* Professional Details */}
            <h5 className="text-primary mb-3 fw-bold">
              <MedicineBoxOutlined className="me-2" /> Professional Details
            </h5>
            <Row gutter={20}>
              <Col xs={24} sm={24} md={8}>
                <Form.Item
                  label="Specialization"
                  name="specialization"
                  required
                  rules={[{ required: true, message: "Specialization is required" }]}
                >
                  <Input
                    prefix={<MedicineBoxOutlined className="text-muted" />}
                    placeholder="e.g. Dental, Skin, Cardiology"
                    size="large"
                    className="rounded-3"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={8}>
                <Form.Item
                  label="Experience (in Years)"
                  name="experience"
                  required
                  rules={[{ required: true, message: "Experience is required" }]}
                >
                  <Input
                    prefix={<FieldTimeOutlined className="text-muted" />}
                    placeholder="e.g. 5"
                    size="large"
                    className="rounded-3"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={8}>
                <Form.Item
                  label="Fees Per Consultation (₹)"
                  name="feesPerCunsaltation"
                  required
                  rules={[{ required: true, message: "Fee is required" }]}
                >
                  <Input
                    prefix={<DollarOutlined className="text-muted" />}
                    type="number"
                    placeholder="e.g. 500"
                    size="large"
                    className="rounded-3"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={8}>
                <Form.Item
                  label="Consultation Timings"
                  name="timings"
                  required
                  rules={[{ required: true, message: "Timings are required" }]}
                >
                  <TimePicker.RangePicker
                    format="HH:mm"
                    size="large"
                    className="w-100 rounded-3"
                  />
                </Form.Item>
              </Col>
            </Row>

            <div className="d-flex justify-content-end mt-4">
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                icon={<SendOutlined />}
                className="px-5 rounded-3 fw-bold"
                style={{
                  background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
                  border: "none",
                }}
              >
                Submit Application
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </Layout>
  );
};

export default ApplyDoctor;