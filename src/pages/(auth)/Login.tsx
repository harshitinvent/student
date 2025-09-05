import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Form, Input, Button, Select, Typography } from 'antd';
import { useUserContext } from '../../providers/user';
import ForgotPasswordModal from '../../components/shared/modals/ForgotPasswordModal';

const { Title, Paragraph } = Typography;
const { Option } = Select;

// Add a simple logout utility for now
export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('userType'); // Remove user type
  localStorage.removeItem('userEmail'); // Remove user email
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
}

export default function LoginPage() {
  const { setType, setIsAuthenticated } = useUserContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [forgotPasswordModalOpen, setForgotPasswordModalOpen] = useState(false);

  useEffect(() => {
    function checkAuth() {
      const token = localStorage.getItem('token');
      if (token) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setType(null);
      }
    }
    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, [localStorage.getItem('token')]);

  const onFinish = async (values: any) => {
    setLoading(true);

    try {
      const response = await fetch(
        // 'http://103.189.173.7:8080/api/admin/auth/login',
        'http://103.189.173.7:8080/api/admin/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: values.email.trim(),
            password: values.password,
            user_type: values.type ? values.type : 'student',
          }),
        }
      );

      const data = await response.json();
      console.log('Login response:', data);

      if (response.ok && data.status) {
        localStorage.setItem('token', data?.data?.token);
        localStorage.setItem('userType', values.type ? values.type : 'Student'); // Save user type
        localStorage.setItem('userEmail', values.email.trim()); // Save user email
        setType(values.type ? values.type : 'Student');
        setIsAuthenticated(true);

        console.log('Login successful, navigating to dashboard...');
        // Navigate immediately without delay
        navigate('/');
      } else {
        // ❌ Error from server
        console.error('Login failed:', data.message);
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full items-center justify-center">
      <div className="w-full max-w-400 rounded bg-white p-24 shadow">
        <Title level={3}>Log in</Title>
        <Paragraph className="text-14 text-textDescription">
          Welcome back! Please enter your details.
        </Paragraph>

        <Form
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ type: 'Student' }}
          className="mt-24"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input placeholder="email@email.com" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password placeholder="••••••••" />
          </Form.Item>

          <Form.Item
            label="Log In as:"
            // name="type"
            rules={[{ required: true, message: 'Please select a role' }]}
          >
            <Select placeholder="Select role">
              {/* <Option value="Student">Student</Option>
              <Option value="Teacher">Teacher</Option> */}
              <Option value="student">Student</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              className="mt-16"
            >
              Log In
            </Button>
          </Form.Item>
        </Form>

        <div className="mt-16 text-center">
          <button
            type="button"
            onClick={() => setForgotPasswordModalOpen(true)}
            className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-800"
          >
            Forgot Password?
          </button>
        </div>
      </div>

      <ForgotPasswordModal
        open={forgotPasswordModalOpen}
        onClose={() => setForgotPasswordModalOpen(false)}
      />
    </div>
  );
}
