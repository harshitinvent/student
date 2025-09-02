import React, { useState, useEffect } from 'react';
import { Button, Table, Space, Tag, Modal, message, Popconfirm, Select, Avatar } from 'antd';
import { HugeiconsIcon } from '@hugeicons/react';
import { EditIcon, DeleteIcon, PlusSignIcon, UserIcon } from '@hugeicons/core-free-icons';
import { UserWithRoles, Role } from '../../types/role';
import { userRoleAPI, roleAPI } from '../../services/roleAPI';
import AddEditUserModal from '../../components/features/users/AddEditUserModal';
// import AssignRoleModal from '../../components/features/users/AssignRoleModal';
import PageTitleArea from '../../components/shared/PageTitleArea';
import { useUserContext } from '../../providers/user';

const { Option } = Select;

export default function UsersPage() {
    const { hasPermission } = useUserContext();
    const [users, setUsers] = useState<UserWithRoles[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(false);
    const [userModalVisible, setUserModalVisible] = useState(false);
    const [roleModalVisible, setRoleModalVisible] = useState(false);
    const [editingUser, setEditingUser] = useState<UserWithRoles | null>(null);
    const [selectedUser, setSelectedUser] = useState<UserWithRoles | null>(null);

    useEffect(() => {
        fetchUsers();
        fetchRoles();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await userRoleAPI.getAllUsersWithRoles();
            setUsers(data);
        } catch (error) {
            message.error('Failed to fetch users');
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRoles = async () => {
        try {
            const data = await roleAPI.getAllRoles();
            setRoles(data);
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    };

    const handleCreateUser = () => {
        setEditingUser(null);
        setUserModalVisible(true);
    };

    const handleEditUser = (user: UserWithRoles) => {
        setEditingUser(user);
        setUserModalVisible(true);
    };

    const handleAssignRole = (user: UserWithRoles) => {
        setSelectedUser(user);
        setRoleModalVisible(true);
    };

    const handleDeleteUser = async (userId: string) => {
        try {
            // Add delete user API call here
            message.success('User deleted successfully');
            fetchUsers();
        } catch (error) {
            message.error('Failed to delete user');
            console.error('Error deleting user:', error);
        }
    };

    const handleUserModalClose = () => {
        setUserModalVisible(false);
        setEditingUser(null);
    };

    const handleUserModalSuccess = () => {
        setUserModalVisible(false);
        setEditingUser(null);
        fetchUsers();
        message.success(editingUser ? 'User updated successfully' : 'User created successfully');
    };

    const handleRoleModalClose = () => {
        setRoleModalVisible(false);
        setSelectedUser(null);
    };

    const handleRoleModalSuccess = () => {
        setRoleModalVisible(false);
        setSelectedUser(null);
        fetchUsers();
        message.success('Role assigned successfully');
    };

    const getUserInitials = (firstName: string, lastName: string) => {
        return `${firstName}${lastName}`;
    };

    const columns = [
        {
            title: 'User',
            key: 'user',
            render: (user: UserWithRoles) => (
                <div className="flex items-center space-x-12">
                    <Avatar size={40} icon={<HugeiconsIcon icon={UserIcon} />}>
                        {getUserInitials(user.first_name, user.last_name)}
                    </Avatar>
                    <div>
                        <div className="font-medium">{`${user.first_name} ${user.last_name}`}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                </div>
            ),
        },
        {
            title: 'User Type',
            dataIndex: 'userType',
            key: 'userType',
            render: (userType: string) => (
                <Tag color={
                    userType === 'Admin' ? 'red' :
                        userType === 'Teacher' ? 'blue' :
                            'green'
                }>
                    {userType}
                </Tag>
            ),
        },
        {
            title: 'Assigned Roles',
            dataIndex: 'roles',
            key: 'roles',
            render: (roles: any[]) => (
                <div>
                    {roles.slice(0, 2).map((userRole) => (
                        <Tag key={userRole.id} color="blue" style={{ marginBottom: 4 }}>
                            {userRole?.name}
                        </Tag>
                    ))}
                    {roles.length > 2 && (
                        <Tag color="default">+{roles?.length - 2} more</Tag>
                    )}
                    {roles.length === 0 && (
                        <span className="text-gray-400">No roles assigned</span>
                    )}
                </div>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'is_active',
            key: 'is_active',
            render: (is_active: boolean) => (
                <Tag color={is_active ? 'green' : 'red'}>
                    {is_active ? 'Active' : 'Inactive'}
                </Tag>
            ),
        },
        {
            title: 'Created At',
            dataIndex: 'CreatedAt',
            key: 'CreatedAt',
            render: (date: string) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: UserWithRoles) => (
                <Space size="middle">
                    <Button
                        type="text"
                        icon={<HugeiconsIcon icon={EditIcon} />}
                        onClick={() => handleEditUser(record)}
                        title="Edit User"
                    />
                    {/* <Button
                        type="text"
                        onClick={() => handleAssignRole(record)}
                        title="Assign Role"
                    >
                        Assign Role
                    </Button> */}
                    <Popconfirm
                        title="Are you sure you want to delete this user?"
                        description="This action cannot be undone."
                        onConfirm={() => handleDeleteUser(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            type="text"
                            danger
                            icon={<HugeiconsIcon icon={DeleteIcon} />}
                            title="Delete User"
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="p-24">
            <PageTitleArea
                title="User Management"
                subtitle="Manage users and their role assignments"
                action={
                    (
                        <Button
                            type="primary"
                            icon={<HugeiconsIcon icon={PlusSignIcon} />}
                            onClick={handleCreateUser}
                        >
                            Create User
                        </Button>
                    )
                }
            />

            <div className="mt-24">
                <Table
                    columns={columns}
                    dataSource={users}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} of ${total} users`,
                    }}
                />
            </div>

            <AddEditUserModal
                visible={userModalVisible}
                user={editingUser}
                roles={roles}
                onClose={handleUserModalClose}
                onSuccess={handleUserModalSuccess}
            />

            {/* <AssignRoleModal
                visible={roleModalVisible}
                user={selectedUser}
                roles={roles}
                onClose={handleRoleModalClose}
                onSuccess={handleRoleModalSuccess}
            /> */}
        </div>
    );
} 