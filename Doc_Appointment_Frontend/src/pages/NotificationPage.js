import React from "react";
import Layout from "../components/Layout";
import { message, Tabs, Card, Button, List, Badge, Empty } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import { setUser } from "../redux/features/userSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  BellOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  BellFilled,
  RightOutlined,
  ReadOutlined,
} from "@ant-design/icons";

const NotificationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  // Mark all notifications as read
  const handleMarkAllRead = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/get-all-notification",
        { userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
        dispatch(setUser(res.data.data));
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Something went wrong");
    }
  };

  // Delete all read notifications
  const handleDeleteAllRead = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/delete-all-notification",
        { userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
        dispatch(setUser(res.data.data));
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Something went wrong in notification deletion");
    }
  };

  const unreadCount = user?.notification?.length || 0;
  const readCount = user?.seennotification?.length || 0;

  const tabItems = [
    {
      key: "1",
      label: (
        <span className="fw-semibold">
          <BellFilled className="me-1 text-primary" />
          Unread Notifications{" "}
          {unreadCount > 0 && <Badge count={unreadCount} className="ms-1" />}
        </span>
      ),
      children: (
        <Card className="shadow-sm border-0 rounded-4 mt-2">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="m-0 fw-bold text-dark">Recent Alerts ({unreadCount})</h6>
            {unreadCount > 0 && (
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={handleMarkAllRead}
                style={{
                  background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
                  borderColor: "#1e3c72",
                }}
                className="rounded-3"
              >
                Mark All Read
              </Button>
            )}
          </div>

          {unreadCount === 0 ? (
            <Empty description="No Unread Notifications" className="my-4" />
          ) : (
            <List
              itemLayout="horizontal"
              dataSource={user?.notification}
              renderItem={(notificationMssg) => (
                <List.Item
                  className="px-3 py-3 rounded-3 mb-2 shadow-2xs border-0"
                  style={{
                    backgroundColor: "#f4f8ff",
                    cursor: notificationMssg.onClickPath ? "pointer" : "default",
                  }}
                  onClick={() =>
                    notificationMssg.onClickPath &&
                    navigate(notificationMssg.onClickPath)
                  }
                >
                  <List.Item.Meta
                    avatar={
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center text-primary"
                        style={{
                          width: "38px",
                          height: "38px",
                          backgroundColor: "#e8f4ff",
                        }}
                      >
                        <BellOutlined />
                      </div>
                    }
                    title={
                      <span className="fw-semibold text-dark">
                        {notificationMssg.message}
                      </span>
                    }
                  />
                  {notificationMssg.onClickPath && (
                    <RightOutlined className="text-muted" />
                  )}
                </List.Item>
              )}
            />
          )}
        </Card>
      ),
    },
    {
      key: "2",
      label: (
        <span className="fw-semibold">
          <ReadOutlined className="me-1 text-secondary" />
          Read Notifications ({readCount})
        </span>
      ),
      children: (
        <Card className="shadow-sm border-0 rounded-4 mt-2">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="m-0 fw-bold text-dark">Past Notifications ({readCount})</h6>
            {readCount > 0 && (
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                onClick={handleDeleteAllRead}
                className="rounded-3"
              >
                Clear History
              </Button>
            )}
          </div>

          {readCount === 0 ? (
            <Empty description="No Read Notifications" className="my-4" />
          ) : (
            <List
              itemLayout="horizontal"
              dataSource={user?.seennotification}
              renderItem={(notificationMssg) => (
                <List.Item
                  className="px-3 py-3 rounded-3 mb-2 border-bottom"
                  style={{
                    backgroundColor: "#fcfcfc",
                    cursor: notificationMssg.onClickPath ? "pointer" : "default",
                  }}
                  onClick={() =>
                    notificationMssg.onClickPath &&
                    navigate(notificationMssg.onClickPath)
                  }
                >
                  <List.Item.Meta
                    avatar={
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center text-muted"
                        style={{
                          width: "38px",
                          height: "38px",
                          backgroundColor: "#f0f0f0",
                        }}
                      >
                        <ReadOutlined />
                      </div>
                    }
                    title={
                      <span className="text-muted">
                        {notificationMssg.message}
                      </span>
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </Card>
      ),
    },
  ];

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
          <h2 className="mb-1 text-white">Notifications Center 🔔</h2>
          <p className="m-0 text-light opacity-75">
            Stay updated with your appointment requests, status changes, and system alerts.
          </p>
        </div>

        {/* Tabs Container */}
        <Tabs defaultActiveKey="1" items={tabItems} size="large" />
      </div>
    </Layout>
  );
};

export default NotificationPage;