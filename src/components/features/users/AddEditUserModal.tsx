import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Button, message, Switch } from 'antd';
import { UserWithRoles, Role } from '../../../types/role';
import { userRoleAPI } from '../../../services/roleAPI';

const { Option } = Select;

interface AddEditUserModalProps {
    visible: boolean;
    user: UserWithRoles | null;
    roles: Role[];
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddEditUserModal({
    visible,
    user,
    roles,
    onClose,
    onSuccess,
}: AddEditUserModalProps) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

    const isEditing = !!user;

    useEffect(() => {
        if (visible) {
            if (user) {
                form.setFieldsValue({
                    firstName: user.first_name,
                    lastName: user.last_name,
                    email: user.email,
                    userType: user.user_type,
                    isActive: user.is_active,
                });
                setSelectedRoles(user.roles.map(r => r.ID));
            } else {
                form.resetFields();
                setSelectedRoles([]);
            }
        }
    }, [visible, user, form]);

    const handleSubmit = async (values: any) => {
        setLoading(true);
        try {
            if (isEditing && user) {
                // Update existing user
                const updateData = {
                    firstName: values.firstName,
                    lastName: values.lastName,
                    email: values.email,
                    user_type: values.userType,
                    isActive: values.isActive,
                    roleIds: selectedRoles,
                };
                await userRoleAPI.updateUser(user.ID, updateData);
                message.success('User updated successfully');
            } else {
                // Create new user
                const createData = {
                    firstName: values.firstName,
                    lastName: values.lastName,
                    email: values.email,
                    password: values.password,
                    user_type: values.userType,
                    isActive: values.isActive,
                    roleIds: selectedRoles,
                };
                await userRoleAPI.createUser(createData);
                message.success('User created successfully');
            }
            onSuccess();
        } catch (error: any) {
            message.error(error.message || 'Failed to save user');
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = (roleIds: string[]) => {
        setSelectedRoles(roleIds);
    };

    return (
        <Modal
            title={isEditing ? 'Edit User' : 'Create New User'}
            open={visible}
            onCancel={onClose}
            footer={null}
            width={600}
            destroyOnClose
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                    firstName: '',
                    lastName: '',
                    email: '',
                    userType: 'admin',
                    isActive: true,
                }}
            >
                <div className="grid grid-cols-2 gap-16">
                    <Form.Item
                        name="firstName"
                        label="First Name"
                        rules={[
                            { required: true, message: 'Please enter first name' },
                            { min: 2, message: 'First name must be at least 2 characters' },
                        ]}
                    >
                        <Input placeholder="Enter first name" />
                    </Form.Item>

                    <Form.Item
                        name="lastName"
                        label="Last Name"
                        rules={[
                            { required: true, message: 'Please enter last name' },
                            { min: 2, message: 'Last name must be at least 2 characters' },
                        ]}
                    >
                        <Input placeholder="Enter last name" />
                    </Form.Item>
                </div>

                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        { required: true, message: 'Please enter email' },
                        { type: 'email', message: 'Please enter a valid email' },
                    ]}
                >
                    <Input placeholder="Enter email address" />
                </Form.Item>

                <Form.Item
                    name="userType"
                    label="User Type"
                    rules={[{ required: true, message: 'Please select user type' }]}
                >
                    <Select placeholder="Select user type">
                        <Option value="Admin">Admin</Option>
                        {/* <Option value="Teacher">Teacher</Option>
                        <Option value="Student">Student</Option> */}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="roles"
                    label="Assign Roles"
                >
                    <Select
                        mode="multiple"
                        placeholder="Select roles to assign"
                        value={selectedRoles}
                        onChange={handleRoleChange}
                        optionFilterProp="children"
                    >
                        {roles.map((role) => (
                            <Option key={role.ID} value={role.ID}>
                                {role.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="isActive"
                    label="Status"
                    valuePropName="checked"
                >
                    <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                </Form.Item>

                {!isEditing && (
                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[
                            { required: true, message: 'Please enter password' },
                            { min: 6, message: 'Password must be at least 6 characters' },
                        ]}
                    >
                        <Input.Password placeholder="Enter password" />
                    </Form.Item>
                )}

                <div className="flex justify-end space-x-8 mt-24">
                    <Button onClick={onClose}>Cancel</Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                    >
                        {isEditing ? 'Update User' : 'Create User'}
                    </Button>
                </div>
            </Form>
        </Modal>
    );
} 