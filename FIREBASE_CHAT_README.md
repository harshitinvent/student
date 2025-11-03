# Firebase Real-Time Chat Integration

This document describes the Firebase real-time chat integration for the student management system.

## Overview

The chat system allows students to communicate with each other in real-time using Firebase Firestore and Authentication. Each student can only see their own conversations and chat with other students.

## Features

### 🔐 Authentication
- Firebase Authentication for student login/signup
- Student-specific data filtering
- Secure user sessions

### 💬 Real-Time Chat
- Real-time message updates using Firestore listeners
- Direct messaging between students
- Conversation management
- Message timestamps and read status

### 🎯 Student-Specific Access
- Students can only see their own conversations
- Filtered student list (excludes current user)
- Secure data access based on authentication

## File Structure

```
src/
├── providers/
│   └── firebaseAuth.tsx          # Firebase authentication context
├── components/features/chat/
│   └── StudentChat.tsx           # Main student chat component
├── pages/
│   ├── (auth)/
│   │   └── StudentLogin.tsx      # Student login/signup page
│   ├── (chat)/
│   │   └── StudentChatPage.tsx   # Student chat page wrapper
│   └── TestFirebaseChat.tsx      # Test page for Firebase chat
├── services/
│   ├── firebase.ts               # Firebase configuration
│   └── chatAPI.ts                # Chat API with Firebase integration
└── types/
    └── chat.ts                   # Chat type definitions
```

## Setup Instructions

### 1. Firebase Configuration

The Firebase configuration is already set up in `src/services/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "AIzaSyAMoTkY0Vn3lUkkq26bC4RI8dEh6XGX9uA",
  authDomain: "auronedu.firebaseapp.com",
  projectId: "auronedu",
  storageBucket: "auronedu.firebasestorage.app",
  messagingSenderId: "843506301838",
  appId: "1:843506301838:web:4defa525aa7a2201a4c2df",
  measurementId: "G-CRFRWZH35E"
};
```

### 2. Firestore Security Rules

Make sure your Firestore security rules allow authenticated users to access their data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Students can only access their own data
    match /students/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Conversations - users can only access conversations they participate in
    match /conversations/{conversationId} {
      allow read, write: if request.auth != null && 
        request.auth.uid in resource.data.participants;
    }
    
    // Messages - users can only access messages from their conversations
    match /messages/{messageId} {
      allow read, write: if request.auth != null && 
        request.auth.uid in get(/databases/$(database)/documents/conversations/$(resource.data.conversationId)).data.participants;
    }
  }
}
```

## Usage

### 1. Student Login

Navigate to `/student-login` to access the student login page:

- **Login**: Use existing Firebase credentials
- **Sign Up**: Create new student account with profile information

### 2. Student Chat

After login, navigate to `/student-chat` to access the chat interface:

- View available students to chat with
- Start new conversations
- Send and receive real-time messages
- View conversation history

### 3. Testing

Navigate to `/test-firebase-chat` to see the test page with instructions.

## API Functions

### Authentication
- `signIn(email, password)` - Sign in existing user
- `signUp(email, password, studentData)` - Create new student account
- `logout()` - Sign out current user

### Chat Operations
- `getConversations()` - Get user's conversations
- `createDMConversation(recipientId)` - Start direct message
- `sendMessage(messageData)` - Send message
- `subscribeToMessages(conversationId, callback)` - Real-time message updates

## Real-Time Features

### Message Updates
Messages are updated in real-time using Firestore listeners:

```typescript
const unsubscribe = subscribeToMessages(conversationId, (messages) => {
  setMessages(messages);
});
```

### Conversation Updates
Conversation lists are updated when new messages arrive or conversations are created.

## Security

- All data access is filtered by authenticated user ID
- Students can only see their own conversations
- Firebase security rules enforce data access restrictions
- Authentication is required for all operations

## Testing

1. **Single User Test**: Login and create conversations
2. **Multi-User Test**: Open multiple browser windows with different student accounts
3. **Real-Time Test**: Send messages and verify real-time updates across windows

## Troubleshooting

### Common Issues

1. **Authentication Errors**: Check Firebase configuration and security rules
2. **Real-Time Not Working**: Verify Firestore listeners are properly set up
3. **Permission Denied**: Check Firestore security rules
4. **Messages Not Loading**: Verify user is authenticated and has proper permissions

### Debug Mode

Enable console logging to debug issues:

```typescript
console.log('Current user:', user);
console.log('Student data:', student);
console.log('Conversations:', conversations);
```

## Future Enhancements

- Group chat functionality
- File sharing in messages
- Message reactions and replies
- Online/offline status
- Push notifications
- Message search functionality
- Chat history export

## Support

For issues or questions regarding the Firebase chat integration, check:

1. Firebase Console for authentication and database status
2. Browser console for error messages
3. Network tab for API call failures
4. Firestore security rules for permission issues
