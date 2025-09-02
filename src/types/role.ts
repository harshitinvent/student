export interface Permission {
  id: string;
  name: string;
  module: string;
  action: 'read' | 'write' | 'delete' | 'create';
  description: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserRole {
  id: string;
  userId: string;
  roleId: string;
  role: Role;
  assignedAt: string;
  assignedBy: string;
}

export interface UserWithRoles {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: 'Admin' | 'Teacher' | 'Student';
  roles: UserRole[];
  permissions: Permission[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoleRequest {
  name: string;
  description: string;
  permissions: string[]; // Permission IDs
}

export interface UpdateRoleRequest {
  name?: string;
  description?: string;
  permissions?: string[]; // Permission IDs
  isActive?: boolean;
}

export interface AssignRoleRequest {
  userId: string;
  roleId: string;
}

export interface ModulePermission {
  module: string;
  permissions: {
    read: boolean;
    write: boolean;
    delete: boolean;
    create: boolean;
  };
}

export interface UserPermissions {
  userId: string;
  permissions: ModulePermission[];
} 