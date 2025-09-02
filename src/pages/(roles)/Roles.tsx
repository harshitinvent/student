import React, { useState, useEffect } from 'react';
import { Button, Table, Space, Tag, Modal, message, Popconfirm } from 'antd';
import { HugeiconsIcon } from '@hugeicons/react';
import { EditIcon, DeleteIcon, PlusSignIcon } from '@hugeicons/core-free-icons';
import { Role } from '../../types/role';
import { roleAPI } from '../../services/roleAPI';
import AddEditRoleModal from '../../components/features/roles/AddEditRoleModal';
import PageTitleArea from '../../components/shared/PageTitleArea';
import { useUserContext } from '../../providers/user';

const { confirm } = Modal;

export default function RolesPage() {
    const { hasPermission } = useUserContext();
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        setLoading(true);
        try {
            const data = await roleAPI.getAllRoles();
            setRoles(data);
        } catch (error) {
            message.error('Failed to fetch roles');
            console.error('Error fetching roles:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateRole = () => {
        setEditingRole(null);
        setModalVisible(true);
    };

    const handleEditRole = (role: Role) => {
        setEditingRole(role);
        setModalVisible(true);
    };

    const handleDeleteRole = async (roleId: string) => {
        try {
            await roleAPI.deleteRole(roleId);
            message.success('Role deleted successfully');
            fetchRoles();
        } catch (error) {
            message.error('Failed to delete role');
            console.error('Error deleting role:', error);
        }
    };

    const handleModalClose = () => {
        setModalVisible(false);
        setEditingRole(null);
    };

    const handleModalSuccess = () => {
        setModalVisible(false);
        setEditingRole(null);
        fetchRoles();
        message.success(editingRole ? 'Role updated successfully' : 'Role created successfully');
    };

    const columns = [
        {
            title: 'Role Name',
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => <strong>{text}</strong>,
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
        },
        {
            title: 'Permissions',
            dataIndex: 'permissions',
            key: 'permissions',
            render: (permissions: any[]) => (
                <div>
                    {permissions.slice(0, 3).map((permission) => (
                        <Tag key={permission.id} color="blue" style={{ marginBottom: 4 }}>
                            {permission.name}
                        </Tag>
                    ))}
                    {permissions.length > 3 && (
                        <Tag color="default">+{permissions.length - 3} more</Tag>
                    )}
                </div>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'isActive',
            key: 'isActive',
            render: (isActive: boolean) => (
                <Tag color={isActive ? 'red' : 'green'}>
                    {isActive ? 'Inactive' : 'Active'}
                </Tag>
            ),
        },
        {
            title: 'Created At',
            dataIndex: 'UpdatedAt',
            key: 'UpdatedAt',
            render: (date: string) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Role) => (
                <Space size="middle">
                    {(
                        <Button
                            type="text"
                            icon={<HugeiconsIcon icon={EditIcon} />}
                            onClick={() => handleEditRole(record)}
                            title="Edit Role"
                        />
                    )}
                    {hasPermission('role-management', 'delete') && (
                        <Popconfirm
                            title="Are you sure you want to delete this role?"
                            description="This action cannot be undone."
                            onConfirm={() => handleDeleteRole(record.id)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                                type="text"
                                danger
                                icon={<HugeiconsIcon icon={DeleteIcon} />}
                                title="Delete Role"
                            />
                        </Popconfirm>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div className="p-24">
            <PageTitleArea
                title="Role Management"
                subtitle="Manage user roles and permissions"
                action={
                    (
                        <Button
                            type="primary"
                            icon={<HugeiconsIcon icon={PlusSignIcon} />}
                            onClick={handleCreateRole}
                        >
                            Create Role
                        </Button>
                    )
                }
            />

            <div className="mt-24">
                <Table
                    columns={columns}
                    dataSource={roles}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} of ${total} roles`,
                    }}
                />
            </div>

            <AddEditRoleModal
                visible={modalVisible}
                role={editingRole}
                onClose={handleModalClose}
                onSuccess={handleModalSuccess}
            />
        </div>
    );
} 