# Role-Based Access Control (RBAC) Implementation Guide

## Overview
This guide explains how to implement and use the comprehensive Role-Based Access Control (RBAC) system for the University Admin Panel.

## Features Implemented

### 1. **Role Management**
- ✅ Create, edit, and delete roles
- ✅ Assign permissions to roles
- ✅ Role status management (active/inactive)
- ✅ Bulk permission selection by module

### 2. **User Management**
- ✅ Create, edit, and delete users
- ✅ Assign multiple roles to users
- ✅ User status management
- ✅ Role assignment interface

### 3. **Permission System**
- ✅ Granular permissions (read, write, delete, create)
- ✅ Module-based permissions
- ✅ Permission aggregation from multiple roles
- ✅ Dynamic permission checking

### 4. **Navigation Control**
- ✅ Permission-based sidebar navigation
- ✅ Dynamic menu filtering
- ✅ Route protection with permission guards

### 5. **API Integration**
- ✅ Complete API service layer
- ✅ Error handling and loading states
- ✅ Token-based authentication

## File Structure

```
src/
├── types/
│   └── role.ts                    # TypeScript interfaces
├── constants/
│   └── permissions.ts             # Available permissions
├── services/
│   └── roleAPI.ts                 # API service functions
├── components/
│   ├── features/
│   │   ├── roles/
│   │   │   └── AddEditRoleModal.tsx
│   │   └── users/
│   │       ├── AddEditUserModal.tsx
│   │       └── AssignRoleModal.tsx
│   └── shared/
│       ├── PermissionGuard.tsx
│       └── PermissionBasedNavigation.tsx
├── pages/
│   ├── (roles)/
│   │   └── Roles.tsx
│   └── (users)/
│       └── Users.tsx
└── providers/
    └── user.tsx                   # Updated with permissions
```

## How to Use

### 1. **Setting Up Roles**

#### Create a New Role
1. Navigate to **User Management > Role Management**
2. Click **"Create Role"** button
3. Fill in role details:
   - **Name**: e.g., "Department Head"
   - **Description**: e.g., "Manages department operations"
4. Select permissions by module:
   - Use **"Select All"** for full module access
   - Or select individual permissions
5. Click **"Create Role"**

#### Edit Existing Role
1. Find the role in the roles list
2. Click the **edit icon**
3. Modify role details and permissions
4. Click **"Update Role"**

### 2. **Managing Users**

#### Create a New User
1. Navigate to **User Management > User Management**
2. Click **"Create User"** button
3. Fill in user details:
   - **First Name** and **Last Name**
   - **Email** address
   - **User Type** (Admin/Teacher/Student)
   - **Password**
4. Select roles to assign
5. Set user status (Active/Inactive)
6. Click **"Create User"**

#### Assign Roles to User
1. Find the user in the users list
2. Click **"Assign Role"** button
3. Select/deselect roles from the dropdown
4. Review assigned permissions
5. Click **"Assign Roles"**

### 3. **Permission System**

#### Understanding Permissions
Each permission has:
- **Module**: The system module (e.g., "departments", "students")
- **Action**: The operation (read, write, delete, create)
- **Description**: What the permission allows

#### Permission Aggregation
When a user has multiple roles:
- Permissions are combined using **OR logic**
- If any role grants a permission, the user has it
- No permission conflicts or overrides

### 4. **Navigation Control**

#### How Navigation Works
- Sidebar automatically filters based on user permissions
- Only accessible modules are shown
- Sublist items are also filtered
- Home/Dashboard is always accessible

#### Adding New Modules
1. Add module to `MODULES` array in `constants/permissions.ts`
2. Add permissions for the module
3. Add navigation item to `constants/navigation.ts`
4. Create corresponding page component
5. Add route in `routes/routes.tsx`

### 5. **Route Protection**

#### Using PermissionGuard
```tsx
import PermissionGuard from '../components/shared/PermissionGuard';

<PermissionGuard module="departments" action="read">
  <DepartmentsPage />
</PermissionGuard>
```

#### Protecting Components
```tsx
import { useUserContext } from '../providers/user';

const { hasPermission } = useUserContext();

// Show/hide elements based on permissions
{hasPermission('departments', 'create') && (
  <Button onClick={handleCreate}>Create Department</Button>
)}
```

## API Integration

### Backend Requirements
The system expects these API endpoints:

#### Role Management
- `GET /api/roles` - Get all roles
- `POST /api/roles` - Create role
- `PUT /api/roles/{id}` - Update role
- `DELETE /api/roles/{id}` - Delete role

#### User Management
- `GET /api/users/with-roles` - Get all users with roles
- `POST /api/users` - Create user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

#### Permission Management
- `GET /api/permissions` - Get all permissions
- `GET /api/users/me/permissions` - Get current user permissions

#### Role Assignment
- `POST /api/users/assign-role` - Assign role to user
- `DELETE /api/users/{userId}/roles/{roleId}` - Remove role from user

### API Response Format
```json
{
  "status": true,
  "data": [...],
  "message": "Success"
}
```

## Default Permissions

The system includes permissions for these modules:
- **Dashboard** - Basic dashboard access
- **Departments** - Department management
- **Students** - Student management
- **Teachers** - Teacher management
- **Courses** - Course management
- **Assignments** - Assignment management
- **Financial** - Financial management
- **Transactions** - Transaction management
- **Vendors** - Vendor management
- **Invoices** - Invoice management
- **Users** - User management
- **Roles** - Role management
- **Accommodations** - Accommodation management
- **Calendar** - Calendar management
- **Chat** - Chat functionality
- **Settings** - System settings
- **Reports** - Report generation
- **Whiteboard** - Whiteboard functionality

## Security Features

### 1. **Authentication**
- JWT token-based authentication
- Automatic token validation
- Secure token storage

### 2. **Authorization**
- Permission-based access control
- Route-level protection
- Component-level permission checks

### 3. **Data Validation**
- Input validation on all forms
- Server-side validation support
- Error handling and user feedback

## Best Practices

### 1. **Role Design**
- Create roles based on job functions, not individuals
- Use descriptive role names
- Document role purposes

### 2. **Permission Assignment**
- Follow principle of least privilege
- Grant minimum required permissions
- Review permissions regularly

### 3. **User Management**
- Assign roles during user creation
- Review role assignments periodically
- Deactivate unused accounts

### 4. **Security**
- Use strong passwords
- Implement password policies
- Enable audit logging
- Regular security reviews

## Troubleshooting

### Common Issues

#### 1. **User Can't Access Module**
- Check if user has assigned roles
- Verify role has required permissions
- Check if role is active
- Review permission aggregation

#### 2. **Navigation Items Missing**
- Verify user has module access permissions
- Check navigation configuration
- Ensure route is properly defined

#### 3. **API Errors**
- Check authentication token
- Verify API endpoint availability
- Review request/response format
- Check server logs

#### 4. **Permission Not Working**
- Clear browser cache
- Check user context loading
- Verify permission helper functions
- Review role assignments

### Debug Tools

#### 1. **Check User Permissions**
```tsx
const { userPermissions, hasPermission } = useUserContext();
console.log('User Permissions:', userPermissions);
console.log('Has departments read:', hasPermission('departments', 'read'));
```

#### 2. **Check Accessible Modules**
```tsx
const { getAccessibleModules } = useUserContext();
console.log('Accessible Modules:', getAccessibleModules());
```

## Future Enhancements

### 1. **Role Hierarchy**
- Parent-child role relationships
- Permission inheritance
- Role-based permission overrides

### 2. **Advanced Permissions**
- Time-based permissions
- Location-based access
- Conditional permissions

### 3. **Audit Features**
- Permission change logging
- Access attempt tracking
- Security event monitoring

### 4. **Bulk Operations**
- Bulk role assignment
- Bulk permission updates
- Import/export functionality

## Support

For technical support or questions:
1. Check the API documentation
2. Review error logs
3. Test with different user roles
4. Verify database permissions
5. Contact development team

---

This RBAC system provides a robust, scalable foundation for managing user access in the University Admin Panel. Follow the guidelines above to ensure proper implementation and maintenance. 