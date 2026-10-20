import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useSelector, useDispatch } from "react-redux";
import { Card, Avatar, Tag, Button, message } from "antd";
import {
  UserOutlined,
  MailOutlined,
  SafetyOutlined,
  IdcardOutlined,
  UploadOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { setUser } from "../redux/features/userSlice";
import { showLoading, hideLoading } from "../redux/features/alertSlice";

const UserProfile = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [profilePic, setProfilePic] = useState("");
  const [fileSelected, setFileSelected] = useState(false);

  // Sync profile pic state with logged-in user details
  useEffect(() => {
    if (user?.profilePic) {
      setProfilePic(user.profilePic);
    }
  }, [user]);

  // Convert image file to Base64
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        return message.error("Image size should be less than 3MB");
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setProfilePic(reader.result);
        setFileSelected(true);
      };
    }
  };

  // Upload and persist profile photo
  const handleUpdateProfilePic = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/update-profile-pic",
        { userId: user._id, profilePic },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success("Profile photo saved successfully!");
        // Persist in Redux state
        dispatch(setUser(res.data.data));
        setFileSelected(false);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Something went wrong while saving profile photo");
    }
  };

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
          <h2 className="mb-1 text-white">My Profile 👤</h2>
          <p className="m-0 text-light opacity-75">
            View your registered personal details and upload profile photo directly from your device.
          </p>
        </div>

        {/* Profile Section */}
        <div className="row g-4">
          <div className="col-md-4">
            <Card className="shadow-sm border-0 rounded-4 text-center p-4">
              <div className="d-flex justify-content-center mb-3">
                {profilePic ? (
                  <Avatar
                    size={100}
                    src={profilePic}
                    className="shadow-sm border border-2 border-primary"
                  />
                ) : (
                  <Avatar
                    size={100}
                    style={{
                      background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
                      color: "#ffffff",
                      fontSize: "36px",
                      fontWeight: "bold",
                    }}
                  >
                    {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </Avatar>
                )}
              </div>

              <h4 className="fw-bold text-dark mb-1">{user?.name}</h4>
              <p className="text-muted small mb-3">{user?.email}</p>

              <div className="d-flex justify-content-center gap-2 flex-wrap mb-4">
                {user?.isDoctor && <Tag color="blue">Doctor</Tag>}
                {user?.isAdmin && <Tag color="purple">Admin</Tag>}
                {!user?.isDoctor && !user?.isAdmin && <Tag color="green">Patient</Tag>}
              </div>

              <hr className="my-3" />

              {/* Upload Controls */}
              <div className="text-start">
                <label className="fw-semibold text-secondary small mb-2 d-block">
                  Choose Photo from Device:
                </label>

                <input
                  type="file"
                  accept="image/*"
                  id="profile-pic-input"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />

                <Button
                  type="default"
                  icon={<UploadOutlined />}
                  onClick={() => document.getElementById("profile-pic-input").click()}
                  className="w-100 rounded-3 mb-2 py-2 fw-semibold border-primary text-primary"
                >
                  Select File from Device
                </Button>

                {fileSelected && (
                  <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    onClick={handleUpdateProfilePic}
                    style={{
                      background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
                      borderColor: "#1e3c72",
                    }}
                    className="w-100 rounded-3 fw-bold mt-1"
                  >
                    Save Uploaded Photo
                  </Button>
                )}
              </div>
            </Card>
          </div>

          <div className="col-md-8">
            <Card className="shadow-sm border-0 rounded-4 p-4 h-100">
              <h5 className="fw-bold text-dark mb-4">
                <IdcardOutlined className="me-2 text-primary" />
                Personal Information
              </h5>

              <div className="d-flex align-items-center py-3 border-bottom">
                <div className="text-muted w-25">
                  <UserOutlined className="me-2 text-primary" /> Full Name
                </div>
                <div className="fw-bold text-dark">{user?.name}</div>
              </div>

              <div className="d-flex align-items-center py-3 border-bottom">
                <div className="text-muted w-25">
                  <MailOutlined className="me-2 text-primary" /> Email Address
                </div>
                <div className="fw-bold text-dark">{user?.email}</div>
              </div>

              <div className="d-flex align-items-center py-3 border-bottom">
                <div className="text-muted w-25">
                  <SafetyOutlined className="me-2 text-primary" /> Account Role
                </div>
                <div>
                  {user?.isDoctor ? (
                    <span className="text-success fw-bold">Verified Doctor Account</span>
                  ) : user?.isAdmin ? (
                    <span className="text-purple fw-bold">Administrator Account</span>
                  ) : (
                    <span className="text-primary fw-bold">Regular Patient Account</span>
                  )}
                </div>
              </div>

              <div className="d-flex align-items-center py-3">
                <div className="text-muted w-25">
                  <IdcardOutlined className="me-2 text-primary" /> User ID
                </div>
                <div className="text-muted small">{user?._id}</div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;