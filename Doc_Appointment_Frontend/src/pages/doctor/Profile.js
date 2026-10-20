import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Col, Form, Input, Row, TimePicker, message, Card, Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../../redux/features/alertSlice";
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
  EditOutlined,
} from "@ant-design/icons";

const Profile = () => {
  const { user } = useSelector((state) => state.user);
  const [doctor, setDoctor] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  // Update Doctor Profile
  const handleFinish = async (values) => {
    try {
      dispatch(showLoading());

      // Safe formatting for timings array
      let formattedTimings = [];
      if (values.timings && values.timings.length === 2) {
        formattedTimings = [
          moment(values.timings[0]).format("HH:mm"),
          moment(values.timings[1]).format("HH:mm"),
        ];
      }

      // Separate userId from values so it doesn't get sent in body
      const { userId, ...updateData } = values;

      const res = await axios.post(
        "/api/v1/doctor/updateProfile",
        {
          ...updateData,
          timings: formattedTimings,
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
        // Refresh the doctor data after successful update
        getDoctorInfo(); 
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Something Went Wrong");
    }
  };

  // Get Doctor Details
  const getDoctorInfo = async () => {
    try {
      const res = await axios.post(
        "/api/v1/doctor/getDoctorInfo",
        { userId: params.id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        setDoctor(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDoctorInfo();
    // eslint-disable-next-line
  }, []);

  // Helper to parse timings safely into moment objects
  const getInitialTimings = () => {
    if (
      doctor?.timings &&
      Array.isArray(doctor.timings) &&
      doctor.timings.length === 2
    ) {
      // Ensure the strings are correctly parsed as "HH:mm"
      const t1 = moment(doctor.timings[0], "HH:mm");
      const t2 = moment(doctor.timings[1], "HH:mm");
      if (t1.isValid() && t2.isValid()) {
        return [t1, t2];
      }
    }
    return null; // Return null if no valid timings exist
  };

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
          <h2 className="mb-1 text-white">Manage Profile 👨‍⚕️</h2>
          <p className="m-0 text-light opacity-75">
            Update your personal, clinic, consultation fees, and timing details.
          </p>
        </div>

        {doctor && (
          <Card className="shadow-sm border-0 rounded-4 p-2">
            <Form
              layout="vertical"
              onFinish={handleFinish}
              initialValues={{
                ...doctor,
                timings: getInitialTimings(),
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
                      placeholder="First name"
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
                      placeholder="Last name"
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
                      placeholder="Phone number"
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
                      placeholder="Email address"
                      size="large"
                      className="rounded-3"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={8}>
                  <Form.Item label="Website" name="website">
                    <Input
                      prefix={<GlobalOutlined className="text-muted" />}
                      placeholder="Website link"
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
                      placeholder="Clinic address"
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
                      placeholder="Specialization"
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
                      placeholder="Experience"
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
                      placeholder="Consultation fee"
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
                  icon={<EditOutlined />}
                  className="px-5 rounded-3 fw-bold"
                  style={{
                    background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
                    border: "none",
                  }}
                >
                  Update Profile
                </Button>
              </div>
            </Form>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Profile;