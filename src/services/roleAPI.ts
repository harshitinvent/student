import { 
  Role, 
  Permission, 
  CreateRoleRequest, 
  UpdateRoleRequest, 
  AssignRoleRequest,
  UserWithRoles,
  UserPermissions 
} from '../types/role';

const API_BASE_URL = 'http://103.189.173.7:8080/api';

// Role Management APIs
export const roleAPI = {
  // Get all roles
  getAllRoles: async (): Promise<Role[]> => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/roles`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch roles');
      }
      
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching roles:', error);
      // Fallback to mock data for development
      console.log('Using mock data for development');
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return [
        {
          id: '1',
          name: 'Super Admin',
          description: 'Full system access with all permissions',
          permissions: [
            { id: 'dashboard_read', name: 'View Dashboard', module: 'dashboard', action: 'read', description: 'Can view the main dashboard' },
            { id: 'users_read', name: 'View Users', module: 'user-management', action: 'read', description: 'Can view users list' },
            { id: 'users_create', name: 'Create Users', module: 'user-management', action: 'create', description: 'Can create new users' },
            { id: 'roles_read', name: 'View Roles', module: 'role-management', action: 'read', description: 'Can view roles list' },
            { id: 'roles_create', name: 'Create Roles', module: 'role-management', action: 'create', description: 'Can create new roles' }
          ],
          isActive: true,
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-01-01T00:00:00Z'
        },
        {
          id: '2',
          name: 'Department Head',
          description: 'Department level access with limited permissions',
          permissions: [
            { id: 'dashboard_read', name: 'View Dashboard', module: 'dashboard', action: 'read', description: 'Can view the main dashboard' },
            { id: 'students_read', name: 'View Students', module: 'students', action: 'read', description: 'Can view students list' },
            { id: 'students_write', name: 'Edit Students', module: 'students', action: 'write', description: 'Can edit student information' },
            { id: 'teachers_read', name: 'View Teachers', module: 'teachers', action: 'read', description: 'Can view teachers list' },
            { id: 'teachers_write', name: 'Edit Teachers', module: 'teachers', action: 'write', description: 'Can edit teacher information' }
          ],
          isActive: true,
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-01-01T00:00:00Z'
        },
        {
          id: '3',
          name: 'Finance Admin',
          description: 'Financial management access',
          permissions: [
            { id: 'dashboard_read', name: 'View Dashboard', module: 'dashboard', action: 'read', description: 'Can view the main dashboard' },
            { id: 'financial_read', name: 'View Financial', module: 'financial-management', action: 'read', description: 'Can view financial data' },
            { id: 'financial_write', name: 'Edit Financial', module: 'financial-management', action: 'write', description: 'Can edit financial data' },
            { id: 'invoices_read', name: 'View Invoices', module: 'invoice-management', action: 'read', description: 'Can view invoices' },
            { id: 'invoices_write', name: 'Edit Invoices', module: 'invoice-management', action: 'write', description: 'Can edit invoices' }
          ],
          isActive: true,
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-01-01T00:00:00Z'
        }
      ];
    }
  },

  // Get role by ID
  getRoleById: async (roleId: string): Promise<Role> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/roles/${roleId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch role');
    }
    
    const data = await response.json();
    return data.data;
  },

  // Create new role
  createRole: async (roleData: CreateRoleRequest): Promise<Role> => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/roles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(roleData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create role');
      }
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error creating role:', error);
      // Mock response for development
      console.log('Creating mock role:', roleData);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return {
        id: Date.now().toString(),
        name: roleData.name,
        description: roleData.description,
        permissions: roleData.permissions.map(permissionId => ({
          id: permissionId,
          name: permissionId.replace('_', ' '),
          module: permissionId.split('_')[0],
          action: permissionId.split('_')[1] as 'read' | 'write' | 'delete' | 'create',
          description: `Permission for ${permissionId}`
        })),
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
  },

  // Update role
  updateRole: async (roleId: string, roleData: UpdateRoleRequest): Promise<Role> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/roles/${roleId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(roleData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update role');
    }
    
    const data = await response.json();
    return data.data;
  },

  // Delete role
  deleteRole: async (roleId: string): Promise<void> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/roles/${roleId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete role');
    }
  },

  // Get all permissions
  getAllPermissions: async (): Promise<Permission[]> => {
    // Always return static permissions
    const { AVAILABLE_PERMISSIONS } = await import('../constants/permissions');
    return AVAILABLE_PERMISSIONS;
  },

  // Get permissions by module
  getPermissionsByModule: async (module: string): Promise<Permission[]> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/permissions/module/${module}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch module permissions');
    }
    
    const data = await response.json();
    return data.data || [];
  }
};

// User Role Management APIs
export const userRoleAPI = {
  // Get all users with roles
  getAllUsersWithRoles: async (): Promise<UserWithRoles[]> => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/users/with-roles`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch users with roles');
      }
      
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching users with roles:', error);
      // Fallback to mock data for development
      console.log('Using mock users for development');
      await new Promise((resolve) => setTimeout(resolve, 500));

      return [
        {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@university.edu',
          userType: 'Admin',
          roles: [
            {
              id: '1',
              userId: '1',
              roleId: '1',
              role: {
                id: '1',
                name: 'Super Admin',
                description: 'Full system access with all permissions',
                permissions: [],
                isActive: true,
                createdAt: '2025-01-01T00:00:00Z',
                updatedAt: '2025-01-01T00:00:00Z'
              },
              assignedAt: '2025-01-01T00:00:00Z',
              assignedBy: 'system'
            }
          ],
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-01-01T00:00:00Z',
          isActive: true,
          permissions: []
        },
        {
          id: '2',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@university.edu',
          userType: 'Teacher',
          roles: [
            {
              id: '2',
              userId: '2',
              roleId: '2',
              role: {
                id: '2',
                name: 'Department Head',
                description: 'Department level access with limited permissions',
                permissions: [],
                isActive: true,
                createdAt: '2025-01-01T00:00:00Z',
                updatedAt: '2025-01-01T00:00:00Z'
              },
              assignedAt: '2025-01-02T00:00:00Z',
              assignedBy: 'system'
            }
          ],
          createdAt: '2025-01-02T00:00:00Z',
          updatedAt: '2025-01-02T00:00:00Z',
          isActive: true,
          permissions: []
        },
        {
          id: '3',
          firstName: 'Mike',
          lastName: 'Johnson',
          email: 'mike.johnson@university.edu',
          userType: 'Admin',
          roles: [
            {
              id: '3',
              userId: '3',
              roleId: '3',
              role: {
                id: '3',
                name: 'Finance Admin',
                description: 'Financial management access',
                permissions: [],
                isActive: true,
                createdAt: '2025-01-01T00:00:00Z',
                updatedAt: '2025-01-01T00:00:00Z'
              },
              assignedAt: '2025-01-03T00:00:00Z',
              assignedBy: 'system'
            }
          ],
          createdAt: '2025-01-03T00:00:00Z',
          updatedAt: '2025-01-03T00:00:00Z',
          isActive: true,
          permissions: []
        }
      ];
    }
  },

  // Get user by ID with roles
  getUserWithRoles: async (userId: string): Promise<UserWithRoles> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/users/${userId}/with-roles`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch user with roles');
    }
    
    const data = await response.json();
    return data.data;
  },

  // Create User
  createUser: async (userData: any): Promise<UserWithRoles> => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create user');
      }
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error creating user:', error);
      // Mock response for development
      console.log('Creating mock user:', userData);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return {
        id: Date.now().toString(),
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        userType: userData.userType,
        roles: userData.roleIds ? userData.roleIds.map((roleId: string) => ({
          id: roleId,
          userId: Date.now().toString(),
          roleId: roleId,
          role: {
            id: roleId,
            name: `Role ${roleId}`,
            description: `Mock role ${roleId}`,
            permissions: [],
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          assignedAt: new Date().toISOString(),
          assignedBy: 'system'
        })) : [],
        permissions: [],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
  },

  // Update User
  updateUser: async (userId: string, userData: any): Promise<UserWithRoles> => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user');
      }
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error updating user:', error);
      // Mock response for development
      console.log('Updating mock user:', userData);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return {
        id: userId,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        userType: userData.userType,
        roles: userData.roleIds ? userData.roleIds.map((roleId: string) => ({
          id: roleId,
          userId: userId,
          roleId: roleId,
          role: {
            id: roleId,
            name: `Role ${roleId}`,
            description: `Mock role ${roleId}`,
            permissions: [],
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          assignedAt: new Date().toISOString(),
          assignedBy: 'system'
        })) : [],
        permissions: [],
        isActive: userData.isActive,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
  },

  // Assign role to user
  assignRoleToUser: async (assignmentData: AssignRoleRequest): Promise<void> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/users/assign-role`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(assignmentData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to assign role');
    }
  },

  // Remove role from user
  removeRoleFromUser: async (userId: string, roleId: string): Promise<void> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/users/${userId}/roles/${roleId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to remove role');
    }
  },

  // Get user permissions
  getUserPermissions: async (userId: string): Promise<UserPermissions> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/users/${userId}/permissions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch user permissions');
    }
    
    const data = await response.json();
    return data.data;
  },

  // Get current user permissions
  getCurrentUserPermissions: async (): Promise<UserPermissions> => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/users/me/permissions`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch current user permissions');
      }
      
      const data = await response.json();
      console.log('Raw API response:', data);
      
      // Transform API response to our format
      if (data.data && Array.isArray(data.data)) {
        const permissions = data.data;
        const modulePermissions: { [key: string]: { read: boolean, write: boolean, delete: boolean, create: boolean } } = {};
        
        // Group permissions by module
        permissions.forEach((permission: any) => {
          const { module, action } = permission;
          if (!modulePermissions[module]) {
            modulePermissions[module] = { read: false, write: false, delete: false, create: false };
          }
          modulePermissions[module][action as keyof typeof modulePermissions[typeof module]] = true;
        });
        
        // Convert to our format
        const transformedPermissions = Object.entries(modulePermissions).map(([module, perms]) => ({
          module,
          permissions: perms
        }));
        
        console.log('Transformed permissions:', transformedPermissions);
        
        return {
          userId: 'current-user',
          permissions: transformedPermissions
        };
      }
      
      return data.data;
    } catch (error) {
      console.error('Error fetching user permissions:', error);
      // Fallback to mock data for development
      console.log('Using mock permissions for development');
      await new Promise((resolve) => setTimeout(resolve, 500));

      return {
        userId: '1',
        permissions: [
          {
            module: 'dashboard',
            permissions: { read: true, write: true, delete: true, create: true }
          },
          {
            module: 'departments',
            permissions: { read: true, write: true, delete: true, create: true }
          },
          {
            module: 'students',
            permissions: { read: true, write: true, delete: true, create: true }
          },
          {
            module: 'teachers',
            permissions: { read: true, write: true, delete: true, create: true }
          },
          {
            module: 'course-management',
            permissions: { read: true, write: true, delete: true, create: true }
          },
          {
            module: 'assignments',
            permissions: { read: true, write: true, delete: true, create: true }
          },
          {
            module: 'financial-management',
            permissions: { read: true, write: true, delete: true, create: true }
          },
          {
            module: 'financial-transactions',
            permissions: { read: true, write: true, delete: true, create: true }
          },
          {
            module: 'vendor-management',
            permissions: { read: true, write: true, delete: true, create: true }
          },
          {
            module: 'invoice-management',
            permissions: { read: true, write: true, delete: true, create: true }
          },
          {
            module: 'user-management',
            permissions: { read: true, write: true, delete: true, create: true }
          },
          {
            module: 'role-management',
            permissions: { read: true, write: true, delete: true, create: true }
          },
          {
            module: 'accommodations',
            permissions: { read: true, write: true, delete: true, create: true }
          },
          {
            module: 'calendar',
            permissions: { read: true, write: true, delete: true, create: true }
          },
          {
            module: 'chat',
            permissions: { read: true, write: true, delete: true, create: true }
          },
          {
            module: 'settings',
            permissions: { read: true, write: true, delete: false, create: false }
          },
          {
            module: 'reports',
            permissions: { read: true, write: false, delete: false, create: true }
          },
          {
            module: 'payment-reports',
            permissions: { read: true, write: false, delete: false, create: true }
          },
          {
            module: 'fee-structure',
            permissions: { read: true, write: true, delete: false, create: false }
          },
          {
            module: 'admissions',
            permissions: { read: true, write: true, delete: true, create: true }
          },
          {
            module: 'announcements',
            permissions: { read: true, write: true, delete: true, create: true }
          },
          {
            module: 'whiteboard',
            permissions: { read: true, write: true, delete: true, create: true }
          },
          {
            module: 'offices',
            permissions: { read: true, write: true, delete: true, create: true }
          }
        ]
      };
    }
  }
};

// Permission Check Helper
export const permissionHelper = {
  // Check if user has specific permission
  hasPermission: (userPermissions: UserPermissions, module: string, action: string): boolean => {
    // const modulePermission = userPermissions.permissions.find(p => p?.module === module);
    // if (!modulePermission) return false;
    
    return false;
  },

  // Check if user has any permission for a module
  hasModuleAccess: (userPermissions: UserPermissions, module: string): boolean => {
    if (!userPermissions || !userPermissions.permissions) return false;
    
    const modulePermission = userPermissions.permissions.find(p => p.module === module);
    if (!modulePermission) return false;
    
    return Object.values(modulePermission.permissions).some(permission => permission);
  },

  // Get all accessible modules for user
  getAccessibleModules: (userPermissions: UserPermissions): string[] => {
    if (!userPermissions || !userPermissions.permissions) return [];
    
    return userPermissions.permissions
      .filter(p => Object.values(p.permissions).some(permission => permission))
      .map(p => p.module);
  }
}; 