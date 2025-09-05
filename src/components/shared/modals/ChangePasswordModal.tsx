import { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { LockOutlined } from '@ant-design/icons';

const API_BASE = 'http://103.189.173.7:8080/api/profile';

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({
  open,
  onClose,
}: ChangePasswordModalProps) {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleChangePassword = async (values: any) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error('New passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok && data.status) {
        message.success('Password changed successfully!');
        onClose();
        form.resetFields();
      } else {
        message.error(data.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      message.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    form.resetFields();
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      title={
        <div className="text-center">
          <h2 className="mb-2 text-xl font-semibold">Change Password</h2>
          <p className="text-sm text-gray-600">
            Enter your current password and set a new password
          </p>
        </div>
      }
      width={400}
      centered
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleChangePassword}
        className="mt-6"
      >
        <Form.Item
          name="currentPassword"
          label="Current Password"
          rules={[
            { required: true, message: 'Please enter your current password' },
          ]}
        >
          <Input.Password
            size="large"
            placeholder="Enter current password"
            prefix={<LockOutlined className="text-gray-400" />}
          />
        </Form.Item>

        <Form.Item
          name="newPassword"
          label="New Password"
          rules={[
            { required: true, message: 'Please enter new password' },
            { min: 6, message: 'Password must be at least 6 characters' },
          ]}
        >
          <Input.Password
            size="large"
            placeholder="Enter new password"
            prefix={<LockOutlined className="text-gray-400" />}
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Confirm New Password"
          rules={[
            { required: true, message: 'Please confirm your new password' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Passwords do not match'));
              },
            }),
          ]}
        >
          <Input.Password
            size="large"
            placeholder="Confirm new password"
            prefix={<LockOutlined className="text-gray-400" />}
          />
        </Form.Item>

        <div className="flex gap-3">
          <Button size="large" block onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="primary"
            size="large"
            block
            htmlType="submit"
            loading={loading}
          >
            Change Password
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
