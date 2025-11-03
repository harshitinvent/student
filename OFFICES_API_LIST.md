# OFFICES MODULE API LIST

## Quick Reference - All Endpoints

| Method                   | Endpoint                                  | Description            | Authentication |
| ------------------------ | ----------------------------------------- | ---------------------- | -------------- |
| **MEETING MANAGEMENT**   |
| POST                     | `/api/offices/meetings`                   | Create new meeting     | Bearer Token   |
| GET                      | `/api/offices/meetings`                   | Get user's meetings    | Bearer Token   |
| GET                      | `/api/offices/meetings/{id}`              | Get meeting by ID      | Bearer Token   |
| PUT                      | `/api/offices/meetings/{id}`              | Update meeting         | Bearer Token   |
| DELETE                   | `/api/offices/meetings/{id}`              | Delete meeting         | Bearer Token   |
| POST                     | `/api/offices/meetings/{id}/join`         | Join meeting           | Bearer Token   |
| **RECORDING MANAGEMENT** |
| GET                      | `/api/offices/recordings`                 | Get meeting recordings | Bearer Token   |
| POST                     | `/api/offices/recordings/start`           | Start recording        | Bearer Token   |
| POST                     | `/api/offices/recordings/stop`            | Stop recording         | Bearer Token   |
| **STORAGE MANAGEMENT**   |
| GET                      | `/api/offices/storage`                    | Get user storage info  | Bearer Token   |
| POST                     | `/api/offices/storage/upgrade`            | Upgrade storage plan   | Bearer Token   |
| **CHAT SYSTEM**          |
| GET                      | `/api/offices/chat/{meeting_id}`          | Get meeting chat       | Bearer Token   |
| POST                     | `/api/offices/chat/{meeting_id}`          | Send chat message      | Bearer Token   |
| **WEBRTC**               |
| GET                      | `/api/offices/webrtc/config/{meeting_id}` | Get WebRTC config      | Bearer Token   |
| **STATISTICS**           |
| GET                      | `/api/offices/stats/{meeting_id}`         | Get meeting stats      | Bearer Token   |
| **AUTO-CREATE**          |
| POST                     | `/api/offices/meetings/auto-create`       | Create from class      | Bearer Token   |
| **INVITATIONS**          |
| POST                     | `/api/offices/invitations`                | Send invitations       | Bearer Token   |
| GET                      | `/api/offices/invitations`                | Get invitations        | Bearer Token   |
| **COMMON USERS**         |
| GET                      | `/api/common/users`                       | Get all users          | Bearer Token   |
| GET                      | `/api/common/users?search={query}`        | Search users           | Bearer Token   |
| **HEALTH CHECK**         |
| GET                      | `/api/offices/health`                     | API health status      | None           |

---

## Key Features

### 🔐 **Authentication**

- All endpoints require `Authorization: Bearer <token>` header
- JWT token from login/signup required

### 📊 **Pagination**

- List endpoints support `page` and `limit` parameters
- Response includes pagination metadata

### 🔍 **Search & Filtering**

- Meetings: by status, type, date range
- Users: by name, username, email
- Recordings: by meeting ID

### 📹 **Meeting Types**

- `AD_HOC`: Manual meetings
- `STUDY_GROUP`: Group study sessions
- `CLASS_AUTO`: Auto-generated from classes

### 📱 **WebRTC Integration**

- Real-time video/audio communication
- STUN/TURN server configuration
- Signaling server for connection management

### 💾 **Storage Plans**

- Basic: 10GB, $9.99/month
- Premium: 100GB, $29.99/month
- Enterprise: 1TB, $99.99/month

---

## Response Format

### Success Response

```json
{
  "success": true,
  "data": {...},
  "message": "Operation successful"
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": "Additional details"
  }
}
```

---

## Rate Limits

| Endpoint Type  | Limit | Window     |
| -------------- | ----- | ---------- |
| Standard APIs  | 100   | per minute |
| Recording APIs | 10    | per minute |
| WebRTC APIs    | 50    | per minute |

---

## Base URL

```
http://localhost:8080/api
```

## Documentation

Complete API documentation: `OFFICES_API_DOCUMENTATION.md`
