import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Checkbox, Button, message, Spin, Collapse } from 'antd';
import { Role, CreateRoleRequest, UpdateRoleRequest, Permission } from '../../../types/role';
import { roleAPI } from '../../../services/roleAPI';
import { AVAILABLE_PERMISSIONS, MODULES } from '../../../constants/permissions';

const { TextArea } = Input;
const { Panel } = Collapse;

interface AddEditRoleModalProps {
    visible: boolean;
    role: Role | null;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddEditRoleModal({
    visible,
    role,
    onClose,
    onSuccess,
}: AddEditRoleModalProps) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

    const isEditing = !!role;

    useEffect(() => {
        if (visible) {
            loadPermissions();
            if (role) {
                form.setFieldsValue({
                    name: role.name,
                    description: role.description,
                });
                setSelectedPermissions(role.permissions.map(p => p.id));
            } else {
                form.resetFields();
                setSelectedPermissions([]);
            }
        }
    }, [visible, role, form]);

    const loadPermissions = async () => {
        setPermissions(AVAILABLE_PERMISSIONS);
    };

    // Debug: Log permissions state
    useEffect(() => {
        console.log('Current permissions state:', permissions.length);
        console.log('Sample permissions:', permissions.slice(0, 3));
        console.log('All modules:', MODULES);
    }, [permissions]);

    const handleSubmit = async (values: any) => {
        setLoading(true);
        try {
            if (isEditing && role) {
                const updateData: UpdateRoleRequest = {
                    name: values.name,
                    description: values.description,
                    permissions: selectedPermissions,
                };
                await roleAPI.updateRole(role.ID, updateData);
            } else {
                const createData: CreateRoleRequest = {
                    name: values.name,
                    description: values.description,
                    permissions: selectedPermissions,
                };
                await roleAPI.createRole(createData);
            }
            onSuccess();
        } catch (error: any) {
            message.error(error.message || 'Failed to save role');
        } finally {
            setLoading(false);
        }
    };

    const handlePermissionChange = (permissionId: string, checked: boolean) => {
        if (checked) {
            setSelectedPermissions(prev => [...prev, permissionId]);
        } else {
            setSelectedPermissions(prev => prev.filter(id => id !== permissionId));
        }
    };

    const handleSelectAllModule = (module: string, checked: boolean) => {
        const modulePermissions = permissions.filter(p => p.module === module);
        const modulePermissionIds = modulePermissions.map(p => p.id);

        if (checked) {
            setSelectedPermissions(prev => [...new Set([...prev, ...modulePermissionIds])]);
        } else {
            setSelectedPermissions(prev => prev.filter(id => !modulePermissionIds.includes(id)));
        }
    };

    const getModulePermissions = (module: string) => {
        return permissions.filter(p => p.module === module);
    };

    const isModuleSelected = (module: string) => {
        const modulePermissions = getModulePermissions(module);
        const modulePermissionIds = modulePermissions.map(p => p.id);
        return modulePermissionIds.every(id => selectedPermissions.includes(id));
    };

    const isModuleIndeterminate = (module: string) => {
        const modulePermissions = getModulePermissions(module);
        const modulePermissionIds = modulePermissions.map(p => p.id);
        const selectedCount = modulePermissionIds.filter(id => selectedPermissions.includes(id)).length;
        return selectedCount > 0 && selectedCount < modulePermissionIds.length;
    };

    return (
        <Modal
            title={isEditing ? 'Edit Role' : 'Create New Role'}
            open={visible}
            onCancel={onClose}
            footer={null}
            width={800}
            destroyOnHidden
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                    name: '',
                    description: '',
                }}
            >
                <Form.Item
                    name="name"
                    label="Role Name"
                    rules={[
                        { required: true, message: 'Please enter role name' },
                        { min: 2, message: 'Role name must be at least 2 characters' },
                    ]}
                >
                    <Input placeholder="Enter role name" />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Description"
                    rules={[
                        { required: true, message: 'Please enter role description' },
                        { min: 10, message: 'Description must be at least 10 characters' },
                    ]}
                >
                    <TextArea
                        placeholder="Enter role description"
                        rows={3}
                    />
                </Form.Item>

                <Form.Item label="Permissions">
                    <div className="border rounded p-16 max-h-400 overflow-y-auto">
                        <div className="mb-4">
                            <div className="text-sm text-gray-600 mb-2">
                                Total Permissions: {permissions.length}
                            </div>
                            <div className="text-sm text-gray-600 mb-2">
                                Selected Permissions: {selectedPermissions.length}
                            </div>
                            <div className="text-sm text-gray-600 mb-2">
                                Available Modules: {MODULES.length}
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    console.log('All permissions:', permissions);
                                    console.log('All modules:', MODULES);
                                    console.log('Sample module permissions:', getModulePermissions('dashboard'));
                                }}
                                className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded"
                            >
                                Debug Info
                            </button>
                        </div>

                        {permissions.length === 0 ? (
                            <div className="text-center py-8">
                                <Spin size="large" />
                                <div className="mt-4 text-gray-500">Loading permissions...</div>
                            </div>
                        ) : (
                            <Collapse defaultActiveKey={MODULES.slice(0, 3)}>
                                {MODULES.map((module) => {
                                    const modulePermissions = getModulePermissions(module);
                                    console.log(`Module ${module}:`, modulePermissions.length, 'permissions');

                                    if (modulePermissions.length === 0) {
                                        console.log(`No permissions found for module: ${module}`);
                                        return null;
                                    }

                                    return (
                                        <Panel
                                            key={module}
                                            header={
                                                <div className="flex items-center justify-between w-full">
                                                    <span className="capitalize font-medium">{module} ({modulePermissions.length})</span>
                                                    <Checkbox
                                                        checked={isModuleSelected(module)}
                                                        indeterminate={isModuleIndeterminate(module)}
                                                        onChange={(e) => handleSelectAllModule(module, e.target.checked)}
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        Select All
                                                    </Checkbox>
                                                </div>
                                            }
                                        >
                                            <div className="grid grid-cols-2 gap-8">
                                                {modulePermissions.map((permission) => (
                                                    <div key={permission.id} className="flex items-center">
                                                        <Checkbox
                                                            checked={selectedPermissions.includes(permission.id)}
                                                            onChange={(e) => handlePermissionChange(permission.id, e.target.checked)}
                                                        >
                                                            <div>
                                                                <div className="font-medium">{permission.name}</div>
                                                                <div className="text-xs text-gray-500">{permission.description}</div>
                                                            </div>
                                                        </Checkbox>
                                                    </div>
                                                ))}
                                            </div>
                                        </Panel>
                                    );
                                }).filter(Boolean)}
                            </Collapse>
                        )}
                    </div>
                </Form.Item>

                <div className="flex justify-end space-x-8 mt-24">
                    <Button onClick={onClose}>Cancel</Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        disabled={selectedPermissions.length === 0}
                    >
                        {isEditing ? 'Update Role' : 'Create Role'}
                    </Button>
                </div>
            </Form>
        </Modal>
    );
} 