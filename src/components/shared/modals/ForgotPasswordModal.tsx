import { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { MailOutlined, LockOutlined, KeyOutlined } from '@ant-design/icons';

const API_BASE = 'http://103.189.173.7:8080/api/admin/auth';

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

interface ForgotPasswordModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ForgotPasswordModal({
  open,
  onClose,
}: ForgotPasswordModalProps) {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSendOtp = async () => {
    if (!email) {
      message.error('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (response.ok && data.status) {
        message.success('OTP sent to your email successfully!');
        setStep('otp');
      } else {
        message.error(data.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      message.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (values: any) => {
    if (values.password !== values.confirmPassword) {
      message.error('Passwords do not match');
      return;
    }

    setOtpLoading(true);
    try {
      const response = await fetch(`${API_BASE}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          otp: values.otp,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.status) {
        message.success('Password reset successfully!');
        onClose();
        setStep('email');
        setEmail('');
        form.resetFields();
      } else {
        message.error(
          data.message || 'Invalid OTP or failed to reset password'
        );
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      message.error('Something went wrong. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setStep('email');
    setEmail('');
    form.resetFields();
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      title={
        <div className="text-center">
          <h2 className="mb-2 text-xl font-semibold">
            {step === 'email' ? 'Forgot Password' : 'Reset Password'}
          </h2>
          <p className="text-sm text-gray-600">
            {step === 'email'
              ? 'Enter your email to receive a reset code'
              : 'Enter the OTP sent to your email and set new password'}
          </p>
        </div>
      }
      width={400}
      centered
    >
      {step === 'email' ? (
        <div className="mt-6">
          <div className="mb-4">
            <Input
              size="large"
              placeholder="Enter your email"
              prefix={<MailOutlined className="text-gray-400" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onPressEnter={handleSendOtp}
            />
          </div>
          <Button
            type="primary"
            size="large"
            block
            loading={loading}
            onClick={handleSendOtp}
          >
            Send OTP
          </Button>
        </div>
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleResetPassword}
          className="mt-6"
        >
          <Form.Item
            name="otp"
            label="OTP Code"
            rules={[
              { required: true, message: 'Please enter OTP' },
              { len: 4, message: 'OTP must be 4 digits' },
              { pattern: /^\d{4}$/, message: 'OTP must contain only numbers' },
            ]}
          >
            <Input
              size="large"
              placeholder="Enter 4-digit OTP"
              prefix={<KeyOutlined className="text-gray-400" />}
              maxLength={4}
            />
          </Form.Item>

          <Form.Item
            name="password"
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
            label="Confirm Password"
            rules={[
              { required: true, message: 'Please confirm your password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
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
            <Button
              size="large"
              block
              onClick={() => {
                setStep('email');
                form.resetFields();
              }}
            >
              Back
            </Button>
            <Button
              type="primary"
              size="large"
              block
              htmlType="submit"
              loading={otpLoading}
            >
              Reset Password
            </Button>
          </div>
        </Form>
      )}
    </Modal>
  );
}
