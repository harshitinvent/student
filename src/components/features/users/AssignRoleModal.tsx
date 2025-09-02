import React, { useState, useEffect } from 'react';
import { Modal, Form, Select, Button, message, List, Tag, Space } from 'antd';
import { UserWithRoles, Role } from '../../../types/role';
import { userRoleAPI } from '../../../services/roleAPI';

const { Option } = Select;

interface AssignRoleModalProps {
    visible: boolean;
    user: UserWithRoles | null;
    roles: Role[];
    onClose: () => void;
    onSuccess: () => void;
}

export default function AssignRoleModal({
    visible,
    user,
    roles,
    onClose,
    onSuccess,
}: AssignRoleModalProps) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

    useEffect(() => {
        if (visible && user) {
            setSelectedRoles(user.roles.map(r => r.roleId));
        }
    }, [visible, user]);

    const handleSubmit = async () => {
        if (!user) return;

        setLoading(true);
        try {
            // Remove existing roles first
            for (const userRole of user.roles) {
                await userRoleAPI.removeRoleFromUser(user.id, userRole.roleId);
            }

            // Assign new roles
            for (const roleId of selectedRoles) {
                await userRoleAPI.assignRoleToUser({
                    userId: user.id,
                    roleId: roleId,
                });
            }

            onSuccess();
        } catch (error: any) {
            message.error(error.message || 'Failed to assign roles');
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = (roleIds: string[]) => {
        setSelectedRoles(roleIds);
    };

    const getRolePermissions = (roleIds: string[]) => {
        return roles
            .filter(role => roleIds.includes(role.id))
            .flatMap(role => role.permissions);
    };

    const selectedRolePermissions = getRolePermissions(selectedRoles);

    return (
        <Modal
            title={`Assign Roles to ${user?.firstName} ${user?.lastName}`}
            open={visible}
            onCancel={onClose}
            footer={null}
            width={700}
            destroyOnClose
        >
            <div className="space-y-24">
                <div>
                    <h4 className="font-medium mb-8">Current User</h4>
                    <div className="bg-gray-50 p-16 rounded">
                        <div className="font-medium">{user?.firstName} {user?.lastName}</div>
                        <div className="text-sm text-gray-500">{user?.email}</div>
                        <div className="text-sm text-gray-500">Type: {user?.userType}</div>
                    </div>
                </div>

                <Form layout="vertical">
                    <Form.Item
                        label="Select Roles"
                        required
                    >
                        <Select
                            mode="multiple"
                            placeholder="Select roles to assign"
                            value={selectedRoles}
                            onChange={handleRoleChange}
                            optionFilterProp="children"
                            style={{ width: '100%' }}
                        >
                            {roles.map((role) => (
                                <Option key={role.id} value={role.id}>
                                    <div>
                                        <div className="font-medium">{role.name}</div>
                                        <div className="text-xs text-gray-500">{role.description}</div>
                                    </div>
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>

                {selectedRoles.length > 0 && (
                    <div>
                        <h4 className="font-medium mb-8">Assigned Permissions</h4>
                        <div className="bg-blue-50 p-16 rounded max-h-200 overflow-y-auto">
                            {selectedRolePermissions.length > 0 ? (
                                <List
                                    size="small"
                                    dataSource={selectedRolePermissions}
                                    renderItem={(permission) => (
                                        <List.Item>
                                            <div className="flex items-center justify-between w-full">
                                                <div>
                                                    <div className="font-medium">{permission.name}</div>
                                                    <div className="text-xs text-gray-500">{permission.description}</div>
                                                </div>
                                                <Space>
                                                    <Tag color="blue" size="small">{permission.module}</Tag>
                                                    <Tag color="green" size="small">{permission.action}</Tag>
                                                </Space>
                                            </div>
                                        </List.Item>
                                    )}
                                />
                            ) : (
                                <div className="text-gray-500 text-center py-16">
                                    No permissions available for selected roles
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="flex justify-end space-x-8">
                    <Button onClick={onClose}>Cancel</Button>
                    <Button
                        type="primary"
                        onClick={handleSubmit}
                        loading={loading}
                        disabled={selectedRoles.length === 0}
                    >
                        Assign Roles
                    </Button>
                </div>
            </div>
        </Modal>
    );
} 