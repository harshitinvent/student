# RBAC (Role & Permission) API List

---

## 1. Get All Permissions (Static List)
- **GET** `/api/permissions`
- **Response:**
```json
[
  {
    "id": "dashboard_read",
    "name": "View Dashboard",
    "module": "dashboard",
    "action": "read",
    "description": "Can view the main dashboard"
  },
  ...
]
```

---

## 2. Role APIs

### Create Role
- **POST** `/api/roles`
- **Body:**
```json
{
  "name": "Admin",
  "description": "Full access",
  "permissions": ["dashboard_read", "students_create", ...]
}
```

### Get All Roles
- **GET** `/api/roles`

### Update Role
- **PUT** `/api/roles/{roleId}`
- **Body:** (same as create)

### Delete Role
- **DELETE** `/api/roles/{roleId}`

---

## 3. User APIs

### Create User
- **POST** `/api/users`
- **Body:**
```json
{
  "firstName": "Amit",
  "lastName": "Sharma",
  "email": "amit@example.com",
  "password": "password123",
  "roleIds": ["1"]
}
```

### Get All Users (with roles)
- **GET** `/api/users/with-roles`

### Update User
- **PUT** `/api/users/{userId}`
- **Body:** (same as create)

### Delete User
- **DELETE** `/api/users/{userId}`

---

## 4. Auth/Login

### Login
- **POST** `/api/auth/login`
- **Body:**
```json
{
  "email": "amit@example.com",
  "password": "password123"
}
```
- **Response:**
```json
{
  "token": "JWT_TOKEN",
  "user": {
    "id": "1",
    "firstName": "Amit",
    "lastName": "Sharma",
    "email": "amit@example.com",
    "roles": [
      {
        "id": "1",
        "name": "Admin",
        "permissions": [ ... ]
      }
    ]
  }
}
```

---

## 5. Get Current User Permissions
- **GET** `/api/users/me/permissions`
- **Header:** `Authorization: Bearer <token>`
- **Response:**
```json
{
  "userId": "1",
  "permissions": [
    {
      "module": "dashboard",
      "permissions": { "read": true, "write": true, "delete": false, "create": false }
    },
    ...
  ]
}
```

---

**Note:**
- Permissions list is static (no create/update/delete for permissions).
- Roles and users can be created/updated/deleted.
- Role permissions are assigned by permission IDs from the static list.
- User permissions are calculated from assigned roles. 