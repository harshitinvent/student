# RBAC API Documentation

## Overview

This document contains all the required APIs for the Role-Based Access Control (RBAC) system in the university admin panel.

## Base URL

```
http://103.189.173.7:8080/api
```

## Authentication

All APIs require Bearer token authentication:

```
Authorization: Bearer {jwt_token}
```

---

## 1. Role Management APIs

### 1.1 Get All Roles

**Endpoint:** `GET /roles`  
**Description:** Retrieve all roles with their permissions

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "role_001",
      "name": "Super Admin",
      "description": "Full system access with all permissions",
      "permissions": [
        {
          "id": "dashboard_read",
          "name": "View Dashboard",
          "module": "dashboard",
          "action": "read",
          "description": "Can view the main dashboard"
        }
      ],
      "isActive": true,
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-01-01T00:00:00Z"
    }
  ]
}
```

### 1.2 Get Role by ID

**Endpoint:** `GET /roles/{roleId}`  
**Description:** Retrieve a specific role by ID

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "role_001",
    "name": "Super Admin",
    "description": "Full system access with all permissions",
    "permissions": [...],
    "isActive": true,
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-01T00:00:00Z"
  }
}
```

### 1.3 Create Role

**Endpoint:** `POST /roles`  
**Description:** Create a new role

**Request Body:**

```json
{
  "name": "Department Head",
  "description": "Department level access with limited permissions",
  "permissions": ["dashboard_read", "students_read", "students_write"]
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "role_002",
    "name": "Department Head",
    "description": "Department level access with limited permissions",
    "permissions": [...],
    "isActive": true,
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-01T00:00:00Z"
  }
}
```

### 1.4 Update Role

**Endpoint:** `PUT /roles/{roleId}`  
**Description:** Update an existing role

**Request Body:**

```json
{
  "name": "Updated Department Head",
  "description": "Updated description",
  "permissions": [
    "dashboard_read",
    "students_read",
    "students_write",
    "teachers_read"
  ],
  "isActive": true
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "role_002",
    "name": "Updated Department Head",
    "description": "Updated description",
    "permissions": [...],
    "isActive": true,
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-01T00:00:00Z"
  }
}
```

### 1.5 Delete Role

**Endpoint:** `DELETE /roles/{roleId}`  
**Description:** Delete a role

**Response:**

```json
{
  "success": true,
  "message": "Role deleted successfully"
}
```

---

## 2. Permission Management APIs

### 2.1 Get All Permissions

**Endpoint:** `GET /permissions`  
**Description:** Retrieve all available permissions

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "dashboard_read",
      "name": "View Dashboard",
      "module": "dashboard",
      "action": "read",
      "description": "Can view the main dashboard"
    },
    {
      "id": "users_create",
      "name": "Create Users",
      "module": "user-management",
      "action": "create",
      "description": "Can create new users"
    }
  ]
}
```

### 2.2 Get Permissions by Module

**Endpoint:** `GET /permissions/module/{moduleName}`  
**Description:** Retrieve permissions for a specific module

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "users_read",
      "name": "View Users",
      "module": "user-management",
      "action": "read",
      "description": "Can view users list"
    },
    {
      "id": "users_create",
      "name": "Create Users",
      "module": "user-management",
      "action": "create",
      "description": "Can create new users"
    },
    {
      "id": "users_write",
      "name": "Edit Users",
      "module": "user-management",
      "action": "write",
      "description": "Can edit user information"
    },
    {
      "id": "users_delete",
      "name": "Delete Users",
      "module": "user-management",
      "action": "delete",
      "description": "Can delete users"
    }
  ]
}
```

---

## 3. User Management APIs

### 3.1 Get All Users with Roles

**Endpoint:** `GET /users/with-roles`  
**Description:** Retrieve all users with their assigned roles

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "user_001",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@university.edu",
      "userType": "Admin",
      "roles": [
        {
          "id": "user_role_001",
          "userId": "user_001",
          "roleId": "role_001",
          "role": {
            "id": "role_001",
            "name": "Super Admin",
            "description": "Full system access with all permissions",
            "permissions": [...],
            "isActive": true,
            "createdAt": "2025-01-01T00:00:00Z",
            "updatedAt": "2025-01-01T00:00:00Z"
          },
          "assignedAt": "2025-01-01T00:00:00Z",
          "assignedBy": "system"
        }
      ],
      "permissions": [...],
      "isActive": true,
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-01-01T00:00:00Z"
    }
  ]
}
```

### 3.2 Get User by ID with Roles

**Endpoint:** `GET /users/{userId}/with-roles`  
**Description:** Retrieve a specific user with their roles

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "user_001",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@university.edu",
    "userType": "Admin",
    "roles": [...],
    "permissions": [...],
    "isActive": true,
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-01T00:00:00Z"
  }
}
```

### 3.3 Create User

**Endpoint:** `POST /users`  
**Description:** Create a new user

**Request Body:**

```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@university.edu",
  "userType": "Teacher",
  "password": "secure_password_123",
  "roleIds": ["role_002"]
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "user_002",
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@university.edu",
    "userType": "Teacher",
    "roles": [...],
    "isActive": true,
    "createdAt": "2025-01-02T00:00:00Z",
    "updatedAt": "2025-01-02T00:00:00Z"
  }
}
```

### 3.4 Update User

**Endpoint:** `PUT /users/{userId}`  
**Description:** Update an existing user

**Request Body:**

```json
{
  "firstName": "Jane",
  "lastName": "Smith Updated",
  "email": "jane.smith.updated@university.edu",
  "userType": "Teacher",
  "isActive": true
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "user_002",
    "firstName": "Jane",
    "lastName": "Smith Updated",
    "email": "jane.smith.updated@university.edu",
    "userType": "Teacher",
    "roles": [...],
    "isActive": true,
    "createdAt": "2025-01-02T00:00:00Z",
    "updatedAt": "2025-01-02T00:00:00Z"
  }
}
```

### 3.5 Delete User

**Endpoint:** `DELETE /users/{userId}`  
**Description:** Delete a user

**Response:**

```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

## 4. User Role Assignment APIs

### 4.1 Assign Role to User

**Endpoint:** `POST /users/assign-role`  
**Description:** Assign a role to a user

**Request Body:**

```json
{
  "userId": "user_001",
  "roleId": "role_002"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Role assigned successfully"
}
```

### 4.2 Remove Role from User

**Endpoint:** `DELETE /users/{userId}/roles/{roleId}`  
**Description:** Remove a role from a user

**Response:**

```json
{
  "success": true,
  "message": "Role removed successfully"
}
```

---

## 5. User Permissions APIs

### 5.1 Get Current User Permissions

**Endpoint:** `GET /users/me/permissions`  
**Description:** Get permissions for the currently logged-in user

**Response:**

```json
{
  "success": true,
  "data": {
    "userId": "user_001",
    "permissions": [
      {
        "module": "dashboard",
        "permissions": {
          "read": true,
          "write": true,
          "delete": true,
          "create": true
        }
      },
      {
        "module": "user-management",
        "permissions": {
          "read": true,
          "write": true,
          "delete": true,
          "create": true
        }
      },
      {
        "module": "role-management",
        "permissions": {
          "read": true,
          "write": true,
          "delete": true,
          "create": true
        }
      }
    ]
  }
}
```

### 5.2 Get User Permissions by ID

**Endpoint:** `GET /users/{userId}/permissions`  
**Description:** Get permissions for a specific user

**Response:**

```json
{
  "success": true,
  "data": {
    "userId": "user_001",
    "permissions": [
      {
        "module": "dashboard",
        "permissions": {
          "read": true,
          "write": false,
          "delete": false,
          "create": false
        }
      },
      {
        "module": "students",
        "permissions": {
          "read": true,
          "write": true,
          "delete": false,
          "create": false
        }
      }
    ]
  }
}
```

---

## 6. Error Responses

### 6.1 Validation Error

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": ["Name is required", "Email must be valid"]
}
```

### 6.2 Not Found Error

```json
{
  "success": false,
  "message": "Role not found"
}
```

### 6.3 Unauthorized Error

```json
{
  "success": false,
  "message": "Unauthorized access"
}
```

### 6.4 Server Error

```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## 7. Database Schema

### 7.1 Roles Table

```sql
CREATE TABLE roles (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 7.2 Permissions Table

```sql
CREATE TABLE permissions (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  module VARCHAR(50) NOT NULL,
  action VARCHAR(20) NOT NULL,
  description TEXT
);
```

### 7.3 Role Permissions Table

```sql
CREATE TABLE role_permissions (
  role_id VARCHAR(36),
  permission_id VARCHAR(36),
  PRIMARY KEY (role_id, permission_id),
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);
```

### 7.4 Users Table

```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  user_type ENUM('Admin', 'Teacher', 'Student') NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 7.5 User Roles Table

```sql
CREATE TABLE user_roles (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36),
  role_id VARCHAR(36),
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  assigned_by VARCHAR(36),
  PRIMARY KEY (user_id, role_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);
```

---

## 8. Sample Data

### 8.1 Sample Permissions

```sql
INSERT INTO permissions (id, name, module, action, description) VALUES
('dashboard_read', 'View Dashboard', 'dashboard', 'read', 'Can view the main dashboard'),
('dashboard_write', 'Edit Dashboard', 'dashboard', 'write', 'Can edit dashboard content'),
('users_read', 'View Users', 'user-management', 'read', 'Can view users list'),
('users_create', 'Create Users', 'user-management', 'create', 'Can create new users'),
('users_write', 'Edit Users', 'user-management', 'write', 'Can edit user information'),
('users_delete', 'Delete Users', 'user-management', 'delete', 'Can delete users'),
('roles_read', 'View Roles', 'role-management', 'read', 'Can view roles list'),
('roles_create', 'Create Roles', 'role-management', 'create', 'Can create new roles'),
('roles_write', 'Edit Roles', 'role-management', 'write', 'Can edit role information'),
('roles_delete', 'Delete Roles', 'role-management', 'delete', 'Can delete roles');
```

### 8.2 Sample Roles

```sql
INSERT INTO roles (id, name, description, is_active) VALUES
('role_001', 'Super Admin', 'Full system access with all permissions', true),
('role_002', 'Department Head', 'Department level access with limited permissions', true),
('role_003', 'Finance Admin', 'Financial management access', true);
```

---

## 9. Implementation Priority

1. **Roles APIs** (GET, POST, PUT, DELETE)
2. **Permissions APIs** (GET all, GET by module)
3. **Users APIs** (GET with roles, POST, PUT, DELETE)
4. **User Role Assignment APIs** (POST assign, DELETE remove)
5. **User Permissions APIs** (GET current user, GET by user ID)

---

## 10. Notes

- All timestamps should be in ISO 8601 format
- UUIDs should be used for all IDs
- Password hashing should be done using bcrypt or similar
- JWT tokens should be used for authentication
- CORS should be enabled for frontend integration
- Input validation should be implemented for all endpoints
- Error logging should be implemented for debugging
