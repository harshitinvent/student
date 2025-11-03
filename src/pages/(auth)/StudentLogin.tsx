import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, message, Tabs, Divider } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, BookOutlined } from '@ant-design/icons';
import { useFirebaseAuth } from '../../providers/firebaseAuth';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const StudentLogin: React.FC = () => {
    const { signIn, signUp, loading } = useFirebaseAuth();
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);

    const handleLogin = async (values: { email: string; password: string }) => {
        try {
            await signIn(values.email, values.password);
            message.success('Login successful!');
            navigate('/student-chat');
        } catch (error: any) {
            console.error('Login error:', error);
            message.error(error.message || 'Login failed');
        }
    };

    const handleSignUp = async (values: any) => {
        try {
            await signUp(values.email, values.password, {
                first_name: values.firstName,
                last_name: values.lastName,
                student_id: values.studentId,
                phone_number: values.phone,
                program: values.program,
                year_of_study: values.yearOfStudy
            });
            message.success('Account created successfully!');
            navigate('/student-chat');
        } catch (error: any) {
            console.error('Signup error:', error);
            message.error(error.message || 'Signup failed');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <Card className="shadow-2xl border-0 rounded-2xl">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <UserOutlined className="text-2xl text-white" />
                        </div>
                        <Title level={2} className="mb-2">
                            Student Portal
                        </Title>
                        <Text className="text-gray-600">
                            Access your real-time chat with other students
                        </Text>
                    </div>

                    <Tabs
                        activeKey={isLogin ? 'login' : 'signup'}
                        onChange={(key) => setIsLogin(key === 'login')}
                        centered
                    >
                        <TabPane tab="Login" key="login">
                            <Form
                                form={form}
                                onFinish={handleLogin}
                                layout="vertical"
                                size="large"
                            >
                                <Form.Item
                                    name="email"
                                    rules={[
                                        { required: true, message: 'Please enter your email' },
                                        { type: 'email', message: 'Please enter a valid email' }
                                    ]}
                                >
                                    <Input
                                        prefix={<MailOutlined className="text-gray-400" />}
                                        placeholder="Email address"
                                        className="rounded-lg"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="password"
                                    rules={[
                                        { required: true, message: 'Please enter your password' },
                                        { min: 6, message: 'Password must be at least 6 characters' }
                                    ]}
                                >
                                    <Input.Password
                                        prefix={<LockOutlined className="text-gray-400" />}
                                        placeholder="Password"
                                        className="rounded-lg"
                                    />
                                </Form.Item>

                                <Form.Item>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        loading={loading}
                                        className="w-full h-12 rounded-lg font-semibold"
                                        size="large"
                                    >
                                        Sign In
                                    </Button>
                                </Form.Item>
                            </Form>
                        </TabPane>

                        <TabPane tab="Sign Up" key="signup">
                            <Form
                                form={form}
                                onFinish={handleSignUp}
                                layout="vertical"
                                size="large"
                            >
                                <div className="grid grid-cols-2 gap-4">
                                    <Form.Item
                                        name="firstName"
                                        rules={[{ required: true, message: 'Please enter your first name' }]}
                                    >
                                        <Input
                                            prefix={<UserOutlined className="text-gray-400" />}
                                            placeholder="First name"
                                            className="rounded-lg"
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="lastName"
                                        rules={[{ required: true, message: 'Please enter your last name' }]}
                                    >
                                        <Input
                                            prefix={<UserOutlined className="text-gray-400" />}
                                            placeholder="Last name"
                                            className="rounded-lg"
                                        />
                                    </Form.Item>
                                </div>

                                <Form.Item
                                    name="studentId"
                                    rules={[{ required: true, message: 'Please enter your student ID' }]}
                                >
                                    <Input
                                        prefix={<BookOutlined className="text-gray-400" />}
                                        placeholder="Student ID"
                                        className="rounded-lg"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="email"
                                    rules={[
                                        { required: true, message: 'Please enter your email' },
                                        { type: 'email', message: 'Please enter a valid email' }
                                    ]}
                                >
                                    <Input
                                        prefix={<MailOutlined className="text-gray-400" />}
                                        placeholder="Email address"
                                        className="rounded-lg"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="phone"
                                    rules={[{ required: true, message: 'Please enter your phone number' }]}
                                >
                                    <Input
                                        prefix={<PhoneOutlined className="text-gray-400" />}
                                        placeholder="Phone number"
                                        className="rounded-lg"
                                    />
                                </Form.Item>

                                <div className="grid grid-cols-2 gap-4">
                                    <Form.Item
                                        name="program"
                                        rules={[{ required: true, message: 'Please enter your program' }]}
                                    >
                                        <Input
                                            placeholder="Program"
                                            className="rounded-lg"
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="yearOfStudy"
                                        rules={[{ required: true, message: 'Please enter your year of study' }]}
                                    >
                                        <Input
                                            type="number"
                                            min="1"
                                            max="5"
                                            placeholder="Year"
                                            className="rounded-lg"
                                        />
                                    </Form.Item>
                                </div>

                                <Form.Item
                                    name="password"
                                    rules={[
                                        { required: true, message: 'Please enter your password' },
                                        { min: 6, message: 'Password must be at least 6 characters' }
                                    ]}
                                >
                                    <Input.Password
                                        prefix={<LockOutlined className="text-gray-400" />}
                                        placeholder="Password"
                                        className="rounded-lg"
                                    />
                                </Form.Item>

                                <Form.Item>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        loading={loading}
                                        className="w-full h-12 rounded-lg font-semibold"
                                        size="large"
                                    >
                                        Create Account
                                    </Button>
                                </Form.Item>
                            </Form>
                        </TabPane>
                    </Tabs>

                    <Divider>
                        <Text className="text-gray-500 text-sm">
                            Real-time chat powered by Firebase
                        </Text>
                    </Divider>
                </Card>
            </div>
        </div>
    );
};

export default StudentLogin;
