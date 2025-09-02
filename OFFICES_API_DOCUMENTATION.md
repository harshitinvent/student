# OFFICES MODULE API DOCUMENTATION

## Overview
The Offices module provides comprehensive meeting management, video conferencing, recording, and storage capabilities for the school management system.

## Base URL
```
http://103.189.173.7:8080/api/offices
```

## Authentication
All endpoints require Bearer token authentication:
```
Authorization: Bearer <your-jwt-token>
```

---

## 1. MEETING MANAGEMENT APIs

### 1.1 Create Meeting
**Endpoint:** `POST /api/offices/meetings`

**Request Body:**
```json
{
  "title": "Team Standup Meeting",
  "start_time": "2024-01-15T09:00:00Z",
  "end_time": "2024-01-15T09:30:00Z",
  "meeting_type": "AD_HOC",
  "max_participants": 15,
  "description": "Daily team standup to discuss progress",
  "participants": ["user1", "user2", "user3"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "meeting_123",
    "title": "Team Standup Meeting",
    "start_time": "2024-01-15T09:00:00Z",
    "end_time": "2024-01-15T09:30:00Z",
    "status": "SCHEDULED",
    "meeting_type": "AD_HOC",
    "max_participants": 15,
    "description": "Daily team standup to discuss progress",
    "host": {
      "id": "user1",
      "first_name": "John",
      "last_name": "Doe",
      "username": "johndoe"
    },
    "participants": [],
    "created_at": "2024-01-10T08:00:00Z"
  },
  "message": "Meeting created successfully"
}
```

### 1.2 Get My Meetings
**Endpoint:** `GET /api/offices/meetings`

**Query Parameters:**
- `status` (optional): SCHEDULED, ONGOING, COMPLETED, CANCELLED
- `meeting_type` (optional): AD_HOC, STUDY_GROUP
- `start_date` (optional): YYYY-MM-DD
- `end_date` (optional): YYYY-MM-DD
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "meeting_123",
      "title": "Team Standup Meeting",
      "start_time": "2024-01-15T09:00:00Z",
      "end_time": "2024-01-15T09:30:00Z",
      "status": "SCHEDULED",
      "meeting_type": "AD_HOC",
      "host": {
        "id": "user1",
        "first_name": "John",
        "last_name": "Doe"
      },
      "participants": []
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10,
  "total_pages": 1
}
```

### 1.3 Get Meeting by ID
**Endpoint:** `GET /api/offices/meetings/{meeting_id}`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "meeting_123",
    "title": "Team Standup Meeting",
    "start_time": "2024-01-15T09:00:00Z",
    "end_time": "2024-01-15T09:30:00Z",
    "status": "SCHEDULED",
    "meeting_type": "AD_HOC",
    "max_participants": 15,
    "description": "Daily team standup",
    "host": {
      "id": "user1",
      "first_name": "John",
      "last_name": "Doe"
    },
    "participants": [],
    "recordings": []
  }
}
```

### 1.4 Update Meeting
**Endpoint:** `PUT /api/offices/meetings/{meeting_id}`

**Request Body:**
```json
{
  "title": "Updated Team Standup",
  "start_time": "2024-01-15T10:00:00Z",
  "end_time": "2024-01-15T10:30:00Z",
  "max_participants": 20,
  "description": "Updated description"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "meeting_123",
    "title": "Updated Team Standup",
    "start_time": "2024-01-15T10:00:00Z",
    "end_time": "2024-01-15T10:30:00Z",
    "status": "SCHEDULED",
    "updated_at": "2024-01-10T09:00:00Z"
  },
  "message": "Meeting updated successfully"
}
```

### 1.5 Delete Meeting
**Endpoint:** `DELETE /api/offices/meetings/{meeting_id}`

**Response:**
```json
{
  "success": true,
  "message": "Meeting deleted successfully"
}
```

### 1.6 Join Meeting
**Endpoint:** `POST /api/offices/meetings/{meeting_id}/join`

**Response:**
```json
{
  "success": true,
  "data": {
    "meeting": {
      "id": "meeting_123",
      "title": "Team Standup Meeting",
      "status": "ONGOING"
    },
    "webrtc_config": {
      "signaling_server": "wss://signaling.example.com",
      "ice_servers": [
        { "urls": "stun:stun.l.google.com:19302" }
      ],
      "room_id": "meeting_123"
    },
    "participants": [],
    "chat_history": []
  }
}
```

---

## 2. RECORDING MANAGEMENT APIs

### 2.1 Get Meeting Recordings
**Endpoint:** `GET /api/offices/recordings`

**Query Parameters:**
- `meeting_id` (optional): Filter by meeting ID

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "rec_123",
      "meeting_id": "meeting_123",
      "recording_url": "https://storage.example.com/recordings/rec_123.mp4",
      "file_size": 256000000,
      "duration_seconds": 1800,
      "recording_quality": "HD",
      "recording_format": "MP4",
      "recorded_at": "2024-01-14T09:00:00Z",
      "status": "READY"
    }
  ]
}
```

### 2.2 Start Recording
**Endpoint:** `POST /api/offices/recordings/start`

**Request Body:**
```json
{
  "meeting_id": "meeting_123",
  "quality": "HD"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "rec_123",
    "meeting_id": "meeting_123",
    "status": "PROCESSING",
    "recording_url": null,
    "started_at": "2024-01-15T09:00:00Z"
  }
}
```

### 2.3 Stop Recording
**Endpoint:** `POST /api/offices/recordings/stop`

**Request Body:**
```json
{
  "meeting_id": "meeting_123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Recording stopped successfully"
}
```

---

## 3. STORAGE MANAGEMENT APIs

### 3.1 Get User Storage
**Endpoint:** `GET /api/offices/storage`

**Response:**
```json
{
  "success": true,
  "data": {
    "user_id": "user1",
    "total_stimit": 107374182400,
    "used_storage": 21474836480,
    "available_storage": 85899345920,
    "storage_plan": "PREMIUM",
    "monthly_cost": 29.99,
    "next_billing_date": "2024-02-15T00:00:00Z",
    "recordings_storage": 16106127360,
    "documents_storage": 5368709120,
    "other_files_storage": 0,
    "max_recording_duration": 120,
    "max_file_size": 1073741824,
    "retention_period_days": 365
  }
}
```

### 3.2 Upgrade Storage Plan
**Endpoint:** `POST /api/offices/storage/upgrade`

**Request Body:**
```json
{
  "plan_id": "premium_plan",
  "payment_method": "credit_card"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user_id": "user1",
    "storage_plan": "PREMIUM",
    "monthly_cost": 29.99,
    "next_billing_date": "2024-02-15T00:00:00Z"
  },
  "message": "Storage plan upgraded successfully"
}
```

---

## 4. CHAT APIs

### 4.1 Get Meeting Chat
**Endpoint:** `GET /api/offices/chat/{meeting_id}`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "msg_123",
      "meeting_id": "meeting_123",
      "user_id": "user1",
      "message": "Hello everyone!",
      "message_type": "text",
      "timestamp": "2024-01-15T09:00:00Z",
      "user": {
        "id": "user1",
        "first_name": "John",
        "last_name": "Doe",
        "username": "johndoe"
      }
    }
  ]
}
```

### 4.2 Send Chat Message
**Endpoint:** `POST /api/offices/chat/{meeting_id}`

**Request Body:**
```json
{
  "message": "Hello everyone!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "msg_124",
    "meeting_id": "meeting_123",
    "user_id": "user1",
    "message": "Hello everyone!",
    "message_type": "text",
    "timestamp": "2024-01-15T09:01:00Z"
  }
}
```

---

## 5. WEBRTC APIs

### 5.1 Get WebRTC Configuration
**Endpoint:** `GET /api/offices/webrtc/config/{meeting_id}`

**Response:**
```json
{
  "success": true,
  "data": {
    "signaling_server": "wss://signaling.example.com",
    "ice_servers": [
      { "urls": "stun:stun.l.google.com:19302" }
    ],
    "room_id": "meeting_123"
  }
}
```

---

## 6. STATISTICS APIs

### 6.1 Get Meeting Statistics
**Endpoint:** `GET /api/offices/stats/{meeting_id}`

**Response:**
```json
{
  "success": true,
  "data": {
    "meeting_id": "meeting_123",
    "total_participants": 5,
    "total_duration": 1800,
    "recording_count": 1,
    "chat_message_count": 25,
    "average_participant_time": 1500,
    "peak_concurrent_users": 5
  }
}
```

---

## 7. AUTO-CREATE APIs

### 7.1 Create Meeting from Class
**Endpoint:** `POST /api/offices/meetings/auto-create`

**Request Body:**
```json
{
  "class_id": "class_123",
  "date": "2024-01-15"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "meeting_124",
    "title": "Mathematics Class - Chapter 5",
    "start_time": "2024-01-15T09:00:00Z",
    "end_time": "2024-01-15T10:00:00Z",
    "status": "SCHEDULED",
    "meeting_type": "CLASS_AUTO",
    "related_class_id": "class_123"
  }
}
```

---

## 8. INVITATION APIs

### 8.1 Send Meeting Invitations
**Endpoint:** `POST /api/offices/invitations`

**Request Body:**
```json
{
  "meeting_id": "meeting_123",
  "user_ids": ["user1", "user2", "user3"]
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "inv_123",
      "meeting_id": "meeting_123",
      "invited_user_id": "user1",
      "status": "PENDING",
      "sent_at": "2024-01-10T08:00:00Z"
    }
  ]
}
```

### 8.2 Get Meeting Invitations
**Endpoint:** `GET /api/offices/invitations`

**Query Parameters:**
- `meeting_id` (optional): Filter by meeting ID

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "inv_123",
      "meeting_id": "meeting_123",
      "invited_user_id": "user1",
      "status": "PENDING",
      "sent_at": "2024-01-10T08:00:00Z"
    }
  ]
}
```

---

## 9. COMMON USERS API

### 9.1 Get All Users
**Endpoint:** `GET /api/common/users`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "user1",
      "first_name": "John",
      "last_name": "Doe",
      "username": "johndoe",
      "email": "john.doe@university.edu",
      "avatar_url": "/pic/user-avatar.jpg"
    }
  ]
}
```

### 9.2 Search Users
**Endpoint:** `GET /api/common/users?search={query}`

**Query Parameters:**
- `search`: Search query for name, username, or email

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "user1",
      "first_name": "John",
      "last_name": "Doe",
      "username": "johndoe",
      "email": "john.doe@university.edu"
    }
  ]
}
```

---

## 10. ERROR RESPONSES

### Standard Error Format
```json
{
  "success": false,
  "error": {
    "code": "MEETING_NOT_FOUND",
    "message": "Meeting with ID 'meeting_123' not found",
    "details": "The requested meeting does not exist or has been deleted"
  }
}
```

### Common Error Codes
- `UNAUTHORIZED`: Invalid or missing authentication token
- `FORBIDDEN`: User doesn't have permission to access this resource
- `NOT_FOUND`: Requested resource not found
- `VALIDATION_ERROR`: Request data validation failed
- `INTERNAL_ERROR`: Server internal error

---

## 11. PAGINATION

### Pagination Response Format
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "total_pages": 10,
    "has_next": true,
    "has_prev": false
  }
}
```

---

## 12. WEBSOCKET EVENTS

### WebRTC Signaling Events
```json
{
  "type": "offer|answer|ice-candidate|user-joined|user-left",
  "data": {...},
  "from_user_id": "user1",
  "to_user_id": "user2",
  "timestamp": "2024-01-15T09:00:00Z"
}
```

---

## 13. RATE LIMITING

- **Standard endpoints**: 100 requests per minute
- **Recording endpoints**: 10 requests per minute
- **WebRTC endpoints**: 50 requests per minute

---

## 14. DEPLOYMENT NOTES

### Environment Variables
```bash
OFFICES_API_BASE_URL=http://103.189.173.7:8080/api
OFFICES_SIGNALING_SERVER=wss://signaling.example.com
OFFICES_STORAGE_BUCKET=meeting-recordings
OFFICES_MAX_FILE_SIZE=1073741824
```

### Health Check
**Endpoint:** `GET /api/offices/health`

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T09:00:00Z",
  "version": "1.0.0"
}
```

---

## 15. TESTING

### Postman Collection
Import the `Offices_API.postman_collection.json` file for testing all endpoints.

### Test Data
Use the provided test users and meetings for development and testing purposes.

---

## 16. SUPPORT

For API support and questions:
- **Email**: api-support@university.edu
- **Documentation**: https://docs.university.edu/offices-api
- **Status Page**: https://status.university.edu 