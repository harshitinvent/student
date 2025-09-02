# Chat Feature Setup Guide

This guide will help you set up the Chat feature using Firebase for the School Management System.

## Prerequisites

- Node.js and npm installed
- Firebase project created
- Basic knowledge of Firebase services

## 1. Install Firebase Dependencies

First, install the required Firebase packages:

```bash
npm install firebase react-firebase-hooks
```

## 2. Firebase Project Setup

### 2.1 Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter your project name (e.g., "school-system-chat")
4. Follow the setup wizard

### 2.2 Enable Services
Enable the following Firebase services:
- **Firestore Database** - For storing chat data
- **Authentication** - For user management
- **Storage** - For file attachments

### 2.3 Firestore Database Rules
Set up Firestore security rules in the Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can read/write conversations they're participants in
    match /conversations/{conversationId} {
      allow read, write: if request.auth != null && 
        exists(/databases/$(database)/documents/conversation_participants/$(conversationId + '_' + request.auth.uid));
    }
    
    // Users can read/write participants for conversations they're in
    match /conversation_participants/{participantId} {
      allow read, write: if request.auth != null && 
        (participantId == conversationId + '_' + request.auth.uid || 
         exists(/databases/$(database)/documents/conversation_participants/$(conversationId + '_' + request.auth.uid)));
    }
    
    // Users can read/write messages in conversations they're participants in
    match /messages/{messageId} {
      allow read, write: if request.auth != null && 
        exists(/databases/$(database)/documents/conversation_participants/$(resource.data.conversation_id + '_' + request.auth.uid));
    }
    
    // Users can read/write read receipts for conversations they're in
    match /read_receipts/{receiptId} {
      allow read, write: if request.auth != null && 
        (receiptId == conversationId + '_' + request.auth.uid || 
         exists(/databases/$(database)/documents/conversation_participants/$(conversationId + '_' + request.auth.uid)));
    }
  }
}
```

### 2.4 Storage Rules
Set up Storage security rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /chat-attachments/{conversationId}/{fileName} {
      allow read, write: if request.auth != null && 
        exists(/databases/$(database)/documents/conversation_participants/$(conversationId + '_' + request.auth.uid));
    }
  }
}
```

## 3. Configuration

### 3.1 Update Firebase Config
Update `src/services/firebase.ts` with your Firebase project configuration:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### 3.2 Environment Variables (Optional)
Create a `.env` file in your project root:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

Then update `src/services/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
```

## 4. Database Structure

The Chat feature uses the following Firestore collections:

### 4.1 conversations
```typescript
{
  id: string;
  type: 'DM' | 'GROUP';
  name?: string; // For group chats
  status: 'ACTIVE' | 'ARCHIVED';
  creator_id?: string;
  related_record_type?: string; // e.g., "CLASS", "DEPARTMENT"
  related_record_id?: string;
  created_at: Timestamp;
  updated_at: Timestamp;
}
```

### 4.2 conversation_participants
```typescript
{
  id: string;
  conversation_id: string;
  user_id: string;
  role: 'ADMIN' | 'MEMBER';
  joined_at: Timestamp;
}
```

### 4.3 messages
```typescript
{
  id: string;
  conversation_id: string;
  author_id: string;
  content_type: 'TEXT' | 'FILE';
  content_text?: string;
  attachment_url?: string;
  attachment_name?: string;
  attachment_size?: number;
  created_at: Timestamp;
  updated_at?: Timestamp;
}
```

### 4.4 read_receipts
```typescript
{
  id: string; // Format: conversationId_userId
  conversation_id: string;
  user_id: string;
  last_read_message_id: string;
  last_read_at: Timestamp;
}
```

### 4.5 users
```typescript
{
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'STUDENT' | 'FACULTY' | 'STAFF';
  department?: string;
  isOnline?: boolean;
  lastSeen?: Timestamp;
}
```

## 5. Features

### 5.1 Direct Messages (DM)
- One-on-one private conversations
- Automatic conversation creation
- Re-opens existing conversations

### 5.2 Group Chats
- User-created group conversations
- Admin controls for group management
- Participant management

### 5.3 System-Generated Groups
- Automatic creation based on academic events
- Class-based chat groups
- Department-based communication

### 5.4 File Sharing
- Support for file attachments
- Secure file storage in Firebase Storage
- File download functionality

### 5.5 Real-time Messaging
- WebSocket-like real-time updates
- Message synchronization across devices
- Read receipts

## 6. Integration with Academic System

### 6.1 Automatic Group Creation
The system automatically creates chat groups when:
- A new class is created
- Students enroll in classes
- Academic terms begin

### 6.2 Group Lifecycle Management
- **Active**: During the academic term
- **Archived**: After term ends (read-only)
- **Purged**: 180 days after term ends (deleted)

### 6.3 Enrollment Integration
- Students are automatically added to class chat groups
- Students are removed when they withdraw
- Instructors are set as group admins

## 7. Usage

### 7.1 Starting a New Chat
1. Click "New Chat" button
2. Choose between DM or Group Chat
3. Search for users
4. Create conversation

### 7.2 Sending Messages
1. Select a conversation
2. Type your message
3. Press Enter or click Send
4. Attach files if needed

### 7.3 Managing Groups
1. Click the three-dot menu in chat header
2. View conversation info
3. Edit group settings (if admin)
4. Leave conversation

## 8. Security Considerations

- All data access is controlled by Firestore security rules
- Users can only access conversations they're participants in
- File uploads are restricted to conversation participants
- Authentication is required for all operations

## 9. Performance Optimization

- Messages are paginated (50 messages per load)
- Real-time subscriptions are managed efficiently
- File uploads use Firebase Storage for scalability
- Read receipts are batched for better performance

## 10. Troubleshooting

### Common Issues:
1. **Firebase not initialized**: Check your configuration
2. **Permission denied**: Verify Firestore security rules
3. **File upload fails**: Check Storage rules and file size limits
4. **Real-time updates not working**: Verify WebSocket connections

### Debug Mode:
Enable Firebase debug mode in development:
```typescript
if (import.meta.env.DEV) {
  import('firebase/firestore').then(({ enableNetwork }) => {
    enableNetwork();
  });
}
```

## 11. Next Steps

After setup, consider implementing:
- Push notifications for offline users
- Message encryption for sensitive conversations
- Advanced search and filtering
- Message reactions and replies
- Voice and video calling integration

## Support

For issues or questions:
1. Check Firebase Console logs
2. Verify security rules
3. Test with Firebase Emulator Suite
4. Review browser console for errors 