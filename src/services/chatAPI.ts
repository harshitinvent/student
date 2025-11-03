import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from './firebase';
import type {
  Conversation,
  Message,
  ConversationParticipant,
  ReadReceipt,
  ChatUser,
  CreateConversationRequest,
  SendMessageRequest,
  UpdateConversationRequest,
  CreateGroupRequest
} from '../types/chat';

// Collection names
const CONVERSATIONS_COLLECTION = 'conversations';
const MESSAGES_COLLECTION = 'messages';
const PARTICIPANTS_COLLECTION = 'conversation_participants';
const READ_RECEIPTS_COLLECTION = 'read_receipts';
const USERS_COLLECTION = 'chat_users';

// Helper function to get current user ID from localStorage (custom auth)
const getCurrentUserId = (): string => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('User not authenticated');
  }
  
  // First try to get actual user ID from userData
  try {
    const userDataStr = localStorage.getItem('userData');
    if (userDataStr) {
      const userData = JSON.parse(userDataStr);
      if (userData.id) {
        console.log('Using actual user ID from userData:', userData.id, 'Type:', userData.userType, 'Email:', userData.email);
        return userData.id.toString(); // Convert to string for consistency
      }
    }
  } catch (error) {
    console.log('Error parsing userData:', error);
  }
  
  // Fallback to email-based ID
  const userEmail = localStorage.getItem('userEmail');
  const userType = localStorage.getItem('userType');
  
  if (!userEmail) {
    throw new Error('User not authenticated - no email found');
  }
  
  // Generate a consistent user ID based on email and type
  const userId = userType && userEmail ? `${userType.toLowerCase()}_${userEmail.replace('@', '_').replace('.', '_')}` : 'admin_admin_yopmail_com';
  console.log('Using fallback user ID:', userId, 'Email:', userEmail, 'Type:', userType);
  return userId;
};

// Helper function to get current student ID (for student-specific queries)
const getCurrentStudentId = async (): Promise<string> => {
  console.log('getCurrentStudentId - Starting...');
  
  // Use the same logic as getCurrentUserId
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('User not authenticated');
  }
  
  // First try to get actual user ID from userData
  try {
    const userDataStr = localStorage.getItem('userData');
    if (userDataStr) {
      const userData = JSON.parse(userDataStr);
      if (userData.id) {
        console.log('getCurrentStudentId - Using actual user ID from userData:', userData.id, 'Type:', userData.userType, 'Email:', userData.email);
        return userData.id.toString(); // Convert to string for consistency
      }
    }
  } catch (error) {
    console.log('getCurrentStudentId - Error parsing userData:', error);
  }
  
  // Fallback to email-based ID
  const userEmail = localStorage.getItem('userEmail');
  const userType = localStorage.getItem('userType');
  
  if (!userEmail) {
    throw new Error('User not authenticated - no email found');
  }
  
  // Generate consistent user ID based on email and type
  const userId = userType && userEmail ? `${userType.toLowerCase()}_${userEmail.replace('@', '_').replace('.', '_')}` : 'admin_admin_yopmail_com';
  console.log('getCurrentStudentId - Using fallback user ID:', userId, 'Email:', userEmail, 'Type:', userType);
  
  return userId;
};

// Helper function to get or create Firebase user ID for student email
const getOrCreateFirebaseUserId = async (email: string): Promise<string> => {
  console.log('getOrCreateFirebaseUserId - Creating user ID for email:', email);
  
  // Try to get actual user ID from localStorage first
  try {
    const userDataStr = localStorage.getItem('userData');
    if (userDataStr) {
      const userData = JSON.parse(userDataStr);
      if (userData.id && userData.email === email) {
        console.log('getOrCreateFirebaseUserId - Using actual user ID:', userData.id);
        return userData.id.toString();
      }
    }
  } catch (error) {
    console.log('getOrCreateFirebaseUserId - Error parsing userData:', error);
  }
  
  // Fallback: Generate a consistent user ID based on email
  const userType = email.includes('admin') ? 'admin' : 'student';
  const userId = `${userType}_${email.replace('@', '_').replace('.', '_')}`;
  console.log('getOrCreateFirebaseUserId - Using fallback user ID:', userId);
  
  // First, try to find existing user by email
  const usersQuery = query(
    collection(db, USERS_COLLECTION),
    where('email', '==', email)
  );
  
  const usersSnapshot = await getDocs(usersQuery);
  
  if (!usersSnapshot.empty) {
    const existingUserId = usersSnapshot.docs[0].data().uid || userId;
    console.log('getOrCreateFirebaseUserId - Found existing user:', existingUserId);
    return existingUserId;
  }
  
  // If no user found, create a new one with our custom ID
  const newUserRef = doc(db, USERS_COLLECTION, userId);
  
  await setDoc(newUserRef, {
    uid: userId,
    email: email,
    displayName: email.split('@')[0],
    createdAt: serverTimestamp(),
    isActive: true
  });
  
  console.log('getOrCreateFirebaseUserId - Created new user:', userId);
  return userId;
};

// Helper function to convert Firestore timestamp to Date
const timestampToDate = (timestamp: any): Date => {
  if (!timestamp) {
    return new Date();
  }
  
  // If it's already a Date object
  if (timestamp instanceof Date) {
    return timestamp;
  }
  
  // If it's a Firebase Timestamp with toDate method
  if (timestamp && typeof timestamp.toDate === 'function') {
    return timestamp.toDate();
  }
  
  // If it's a Firebase Timestamp with seconds and nanoseconds
  if (timestamp && typeof timestamp.seconds === 'number') {
    return new Date(timestamp.seconds * 1000 + (timestamp.nanoseconds || 0) / 1000000);
  }
  
  // If it's a plain timestamp number (milliseconds)
  if (typeof timestamp === 'number') {
    return new Date(timestamp);
  }
  
  // If it's a string that can be parsed
  if (typeof timestamp === 'string') {
    const parsed = new Date(timestamp);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }
  }
  
  // Fallback to current date
  console.warn('Invalid timestamp format:', timestamp, 'using current date');
  return new Date();
};

// Helper function to convert Date to Firestore timestamp
const dateToTimestamp = (date: Date): Timestamp => {
  return Timestamp.fromDate(date);
};

// Create a new conversation
export const createConversation = async (data: CreateConversationRequest): Promise<Conversation> => {
  try {
    const currentUserId = getCurrentUserId();
    const now = new Date();

    // Create conversation document
    const conversationData = {
      type: data.type,
      title: data.title,
      participants: [...data.participants, currentUserId], // Include current user
      lastMessage: null,
      lastMessageTime: null,
      unreadCount: 0,
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      metadata: data.metadata || {}
    };

    const conversationRef = await addDoc(collection(db, CONVERSATIONS_COLLECTION), conversationData);

    // Create participant records for all participants
    const batch = writeBatch(db);
    
    data.participants.forEach(participantId => {
      const participantRef = doc(collection(db, PARTICIPANTS_COLLECTION));
      batch.set(participantRef, {
        userId: participantId,
        conversationId: conversationRef.id,
        joinedAt: serverTimestamp(),
        lastReadAt: serverTimestamp(),
        role: participantId === currentUserId ? 'admin' : 'member',
        isActive: true,
        metadata: {}
      });
    });

    // Add current user as participant
    const currentUserParticipantRef = doc(collection(db, PARTICIPANTS_COLLECTION));
    batch.set(currentUserParticipantRef, {
      userId: currentUserId,
      conversationId: conversationRef.id,
      joinedAt: serverTimestamp(),
      lastReadAt: serverTimestamp(),
      role: 'admin',
      isActive: true,
      metadata: {}
    });

    await batch.commit();

    // Return the created conversation
    return {
      id: conversationRef.id,
      type: data.type,
      title: data.title,
      participants: [...data.participants, currentUserId],
      lastMessage: undefined,
      lastMessageTime: undefined,
      unreadCount: 0,
      isActive: true,
      createdAt: now,
      updatedAt: now,
      metadata: data.metadata || {}
    };
  } catch (error) {
    console.error('Error creating conversation:', error);
    throw error;
  }
};

// Get all conversations for current user
export const getConversations = async (): Promise<Conversation[]> => {
  try {
    const currentUserId = getCurrentUserId();
    console.log('getConversations - Current user ID:', currentUserId);
    
    // Method 1: Get conversations from participants collection
    const participantsQuery = query(
      collection(db, PARTICIPANTS_COLLECTION),
      where('userId', '==', currentUserId),
      where('isActive', '==', true)
    );
    
    const participantsSnapshot = await getDocs(participantsQuery);
    const conversationIds = participantsSnapshot.docs.map(doc => doc.data().conversationId);
    console.log('getConversations - Found conversation IDs from participants:', conversationIds);
    
    // Method 2: Also check conversations collection directly for user as participant
    const conversationsQuery = query(
      collection(db, CONVERSATIONS_COLLECTION),
      where('participants', 'array-contains', currentUserId),
      where('isActive', '==', true)
    );
    
    const conversationsSnapshot = await getDocs(conversationsQuery);
    const directConversationIds = conversationsSnapshot.docs.map(doc => doc.id);
    console.log('getConversations - Found conversation IDs from conversations:', directConversationIds);
    
    // Combine both methods and remove duplicates
    const allConversationIds = [...new Set([...conversationIds, ...directConversationIds])];
    console.log('getConversations - All conversation IDs:', allConversationIds);
    
    if (allConversationIds.length === 0) {
      console.log('getConversations - No conversations found');
      return [];
    }
    
    // Get conversation details
    const conversations: Conversation[] = [];
    
    for (const conversationId of allConversationIds) {
      const conversationDoc = await getDoc(doc(db, CONVERSATIONS_COLLECTION, conversationId));
      
      if (conversationDoc.exists()) {
        const data = conversationDoc.data();
        
        // Get last message
        const messagesQuery = query(
          collection(db, MESSAGES_COLLECTION),
          where('conversationId', '==', conversationId),
          orderBy('timestamp', 'desc'),
          limit(1)
        );
        
        const messagesSnapshot = await getDocs(messagesQuery);
        const lastMessage = messagesSnapshot.docs[0] ? {
          id: messagesSnapshot.docs[0].id,
          conversationId: messagesSnapshot.docs[0].data().conversationId,
          senderId: messagesSnapshot.docs[0].data().senderId,
          content: messagesSnapshot.docs[0].data().content,
          contentType: messagesSnapshot.docs[0].data().contentType,
          timestamp: timestampToDate(messagesSnapshot.docs[0].data().timestamp),
          isRead: messagesSnapshot.docs[0].data().isRead,
          attachments: messagesSnapshot.docs[0].data().attachments || [],
          replyTo: messagesSnapshot.docs[0].data().replyTo,
          editedAt: messagesSnapshot.docs[0].data().editedAt ? timestampToDate(messagesSnapshot.docs[0].data().editedAt) : undefined,
          deletedAt: messagesSnapshot.docs[0].data().deletedAt ? timestampToDate(messagesSnapshot.docs[0].data().deletedAt) : undefined
        } : undefined;
        
        conversations.push({
          id: conversationDoc.id,
          type: data.type,
          title: data.title,
          participants: data.participants,
          lastMessage,
          lastMessageTime: lastMessage ? lastMessage.timestamp : undefined,
          unreadCount: data.unreadCount || 0,
          isActive: data.isActive,
          createdAt: timestampToDate(data.createdAt),
          updatedAt: timestampToDate(data.updatedAt),
          metadata: data.metadata || {}
        });
      }
    }
    
    // Sort by last message time or creation time
    return conversations.sort((a, b) => {
      const timeA = a.lastMessageTime || a.createdAt;
      const timeB = b.lastMessageTime || b.createdAt;
      return timeB.getTime() - timeA.getTime();
    });
  } catch (error) {
    console.error('Error getting conversations:', error);
    throw error;
  }
};

// Get messages for a conversation
export const getMessages = async (conversationId: string, limitCount: number = 50): Promise<Message[]> => {
  try {
    const messagesQuery = query(
      collection(db, MESSAGES_COLLECTION),
      where('conversationId', '==', conversationId),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(messagesQuery);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        conversationId: data.conversationId,
        senderId: data.senderId,
        content: data.content,
        contentType: data.contentType,
        timestamp: timestampToDate(data.timestamp),
        isRead: data.isRead,
        attachments: data.attachments || [],
        replyTo: data.replyTo,
        editedAt: data.editedAt ? timestampToDate(data.editedAt) : undefined,

        
        deletedAt: data.deletedAt ? timestampToDate(data.deletedAt) : undefined
      };
    }).reverse(); // Reverse to get chronological order
  } catch (error) {
    console.error('Error getting messages:', error);
    throw error;
  }
};

// Send a message
export const sendMessage = async (data: SendMessageRequest): Promise<Message> => {
  try {
    // Get user ID from localStorage first
    const userIdFromStorage = getUserIdFromLocalStorage();
    if (!userIdFromStorage) {
      throw new Error('User not authenticated - no user data found in localStorage');
    }
    
    const currentUserId = userIdFromStorage;
    const now = new Date();
    
    // Create message document
    const messageData = {
      conversationId: data.conversationId,
      senderId: currentUserId,
      content: data.content,
      contentType: data.contentType || 'text',
      timestamp: serverTimestamp(),
      isRead: false,
      attachments: [],
      replyTo: data.replyTo || null,
      editedAt: null,
      deletedAt: null
    };
    
    const messageRef = await addDoc(collection(db, MESSAGES_COLLECTION), messageData);
    
    // Update conversation's last message and timestamp
    await updateDoc(doc(db, CONVERSATIONS_COLLECTION, data.conversationId), {
      lastMessage: {
        id: messageRef.id,
        content: data.content,
        timestamp: serverTimestamp()
      },
      lastMessageTime: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    // Update unread count for other participants
    const participantsQuery = query(
      collection(db, PARTICIPANTS_COLLECTION),
      where('conversationId', '==', data.conversationId),
      where('userId', '!=', currentUserId)
    );
    
    const participantsSnapshot = await getDocs(participantsQuery);
    const batch = writeBatch(db);
    
    participantsSnapshot.docs.forEach(participantDoc => {
      batch.update(participantDoc.ref, {
        unreadCount: (participantDoc.data().unreadCount || 0) + 1
      });
    });
    
    await batch.commit();
    
    // Return the created message
    return {
      id: messageRef.id,
      conversationId: data.conversationId,
      senderId: currentUserId,
      content: data.content,
      contentType: data.contentType || 'text',
      timestamp: now,
      isRead: false,
      attachments: [],
      replyTo: data.replyTo || undefined,
      editedAt: undefined,
      deletedAt: undefined
    };
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// Mark messages as read
export const markMessagesAsRead = async (conversationId: string, messageIds: string[]): Promise<void> => {
  try {
    const currentUserId = getCurrentUserId();
    const now = new Date();
    
    const batch = writeBatch(db);
    
    // Mark messages as read
    messageIds.forEach(messageId => {
      const messageRef = doc(db, MESSAGES_COLLECTION, messageId);
      batch.update(messageRef, { isRead: true });
    });
    
    // Update participant's last read time
    const participantQuery = query(
      collection(db, PARTICIPANTS_COLLECTION),
      where('conversationId', '==', conversationId),
      where('userId', '==', currentUserId)
    );
    
    const participantSnapshot = await getDocs(participantQuery);
    if (!participantSnapshot.empty) {
      const participantDoc = participantSnapshot.docs[0];
      batch.update(participantDoc.ref, {
        lastReadAt: serverTimestamp(),
        unreadCount: 0
      });
    }
    
    await batch.commit();
  } catch (error) {
    console.error('Error marking messages as read:', error);
    throw error;
  }
};

// Subscribe to conversation changes (real-time)
export const subscribeToConversation = (
  conversationId: string,
  callback: (conversation: Conversation) => void
) => {
  return onSnapshot(
    doc(db, CONVERSATIONS_COLLECTION, conversationId),
    async (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        
        // Get last message
        const messagesQuery = query(
          collection(db, MESSAGES_COLLECTION),
          where('conversationId', '==', conversationId),
          orderBy('timestamp', 'desc'),
          limit(1)
        );
        
        const messagesSnapshot = await getDocs(messagesQuery);
        const lastMessage = messagesSnapshot.docs[0] ? {
          id: messagesSnapshot.docs[0].id,
          conversationId: messagesSnapshot.docs[0].data().conversationId,
          senderId: messagesSnapshot.docs[0].data().senderId,
          content: messagesSnapshot.docs[0].data().content,
          contentType: messagesSnapshot.docs[0].data().contentType,
          timestamp: timestampToDate(messagesSnapshot.docs[0].data().timestamp),
          isRead: messagesSnapshot.docs[0].data().isRead,
          attachments: messagesSnapshot.docs[0].data().attachments || [],
          replyTo: messagesSnapshot.docs[0].data().replyTo,
          editedAt: messagesSnapshot.docs[0].data().editedAt ? timestampToDate(messagesSnapshot.docs[0].data().editedAt) : undefined,
          deletedAt: messagesSnapshot.docs[0].data().deletedAt ? timestampToDate(messagesSnapshot.docs[0].data().deletedAt) : undefined
        } : undefined;
        
        const conversation: Conversation = {
          id: doc.id,
          type: data.type,
          title: data.title,
          participants: data.participants,
          lastMessage,
          lastMessageTime: lastMessage ? lastMessage.timestamp : undefined,
          unreadCount: data.unreadCount || 0,
          isActive: data.isActive,
          createdAt: timestampToDate(data.createdAt),
          updatedAt: timestampToDate(data.updatedAt),
          metadata: data.metadata || {}
        };
        
        callback(conversation);
      }
    }
  );
};

// Subscribe to messages in a conversation (real-time)
export const subscribeToMessages = (
  conversationId: string,
  callback: (messages: Message[]) => void
) => {
  console.log('subscribeToMessages - Setting up subscription for conversation:', conversationId);
  
  // Use simple query without orderBy to avoid index issues
  const messagesQuery = query(
    collection(db, MESSAGES_COLLECTION),
    where('conversationId', '==', conversationId)
  );
  
  return onSnapshot(messagesQuery, (snapshot) => {
    console.log('subscribeToMessages - Received snapshot for conversation:', conversationId, 'Docs count:', snapshot.docs.length);
    
    const messages = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        conversationId: data.conversationId,
        senderId: data.senderId,
        content: data.content,
        contentType: data.contentType,
        timestamp: timestampToDate(data.timestamp),
        isRead: data.isRead,
        attachments: data.attachments || [],
        replyTo: data.replyTo,
        editedAt: data.editedAt ? timestampToDate(data.editedAt) : undefined,
        deletedAt: data.deletedAt ? timestampToDate(data.deletedAt) : undefined
      };
    }).sort((a, b) => {
      // Sort by timestamp manually to avoid index requirement
      return a.timestamp.getTime() - b.timestamp.getTime();
    });
    
    console.log('subscribeToMessages - Messages loaded:', messages.length);
    callback(messages);
  });
};

// Upload file attachment
export const uploadAttachment = async (file: File): Promise<string> => {
  try {
    const fileName = `${Date.now()}-${file.name}`;
    const storageRef = ref(storage, `chat-attachments/${fileName}`);
    
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading attachment:', error);
    throw error;
  }
};

// Delete conversation
export const deleteConversation = async (conversationId: string): Promise<void> => {
  try {
    const currentUserId = getCurrentUserId();
    
    // Mark conversation as inactive for current user
    const participantQuery = query(
      collection(db, PARTICIPANTS_COLLECTION),
      where('conversationId', '==', conversationId),
      where('userId', '==', currentUserId)
    );
    
    const participantSnapshot = await getDocs(participantQuery);
    if (!participantSnapshot.empty) {
      await updateDoc(participantSnapshot.docs[0].ref, {
        isActive: false
      });
    }
  } catch (error) {
    console.error('Error deleting conversation:', error);
    throw error;
  }
}; 

// Search users
export const searchUsers = async (searchTerm: string): Promise<ChatUser[]> => {
  try {
    // For now, we'll return mock data since we don't have a users collection
    // In a real app, you would search through your users collection
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    
    const mockUsers: ChatUser[] = [
      {
        id: 'user-1',
        name: 'John Doe',
        email: 'john.doe@university.edu',
        avatar: '/pic/user-avatar.jpg',
        isOnline: true,
        lastSeen: new Date(),
        type: 'student',
        metadata: {
          studentId: 'STU001',
          studentName: 'John Doe',
          studentEmail: 'john.doe@university.edu',
          department: 'Computer Science',
          program: 'Bachelor of Computer Science',
          yearOfStudy: '3rd Year'
        }
      },
      {
        id: 'user-2',
        name: 'Jane Smith',
        email: 'jane.smith@university.edu',
        avatar: '/pic/user-avatar.jpg',
        isOnline: false,
        lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        type: 'student',
        metadata: {
          studentId: 'STU002',
          studentName: 'Jane Smith',
          studentEmail: 'jane.smith@university.edu',
          department: 'Business Administration',
          program: 'Master of Business Administration',
          yearOfStudy: '2nd Year'
        }
      },
      {
        id: 'user-3',
        name: 'Mike Johnson',
        email: 'mike.johnson@university.edu',
        avatar: '/pic/user-avatar.jpg',
        isOnline: true,
        lastSeen: new Date(),
        type: 'teacher',
        metadata: {
          department: 'Engineering',
          program: 'Bachelor of Engineering',
          yearOfStudy: '4th Year'
        }
      }
    ];
    
    // Filter by search term
    return mockUsers.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  } catch (error) {
    console.error('Error searching users:', error);
    return [];
  }
}; 

// Get user conversations (alias for getConversations)
export const getUserConversations = getConversations;

// Subscribe to conversations changes (real-time)
export const subscribeToConversations = (
  callback: (conversations: Conversation[]) => void
) => {
  let unsubscribe: (() => void) | null = null;
  
  const setupSubscription = async () => {
    try {
      // First try to get user ID from localStorage directly
      const userIdFromStorage = getUserIdFromLocalStorage();
      if (userIdFromStorage) {
        console.log('subscribeToConversations - Using user ID from localStorage:', userIdFromStorage);
        setupConversationSubscription(userIdFromStorage);
        return;
      }
      
      // Fallback to async method
      console.log("subscribeToConversations",auth)
      const currentStudentId = await getCurrentStudentId();
      console.log('subscribeToConversations - Current student ID:', currentStudentId);
      setupConversationSubscription(currentStudentId);
    } catch (error) {
      console.error('Error setting up subscription:', error);
      callback([]);
    }
  };
  
  const setupConversationSubscription = (userId: string) => {
    try {
      
      // Get all conversations where current user is a participant
      const participantsQuery = query(
        collection(db, PARTICIPANTS_COLLECTION),
        where('userId', '==', userId),
        where('isActive', '==', true)
      );
    
      console.log('subscribeToConversations - Querying participants collection...');
      
      unsubscribe = onSnapshot(participantsQuery, async (participantsSnapshot) => {
        console.log('subscribeToConversations - Participants snapshot:', participantsSnapshot.docs.length, 'docs');
        
        const conversationIds = participantsSnapshot.docs.map(doc => {
          const data = doc.data();
          console.log('Participant data:', data);
          return data.conversationId;
        });
        
        console.log('subscribeToConversations - Conversation IDs:', conversationIds);
        
        if (conversationIds.length === 0) {
          console.log('subscribeToConversations - No conversations found for user');
          callback([]);
          return;
        }
        
        // Get conversation details
        const conversations: Conversation[] = [];
        
        for (const conversationId of conversationIds) {
          console.log('subscribeToConversations - Loading conversation:', conversationId);
          const conversationDoc = await getDoc(doc(db, CONVERSATIONS_COLLECTION, conversationId));
          
          if (conversationDoc.exists()) {
            const data = conversationDoc.data();
            console.log('subscribeToConversations - Conversation data:', data);
            
            // Get last message - try with orderBy first, fallback to simple query
            let lastMessage = undefined;
            try {
              const messagesQuery = query(
                collection(db, MESSAGES_COLLECTION),
                where('conversationId', '==', conversationId),
                orderBy('timestamp', 'desc'),
                limit(1)
              );
              
              const messagesSnapshot = await getDocs(messagesQuery);
              if (messagesSnapshot.docs.length > 0) {
                const messageData = messagesSnapshot.docs[0].data();
                lastMessage = {
                  id: messagesSnapshot.docs[0].id,
                  conversationId: messageData.conversationId,
                  senderId: messageData.senderId,
                  content: messageData.content,
                  contentType: messageData.contentType,
                  timestamp: timestampToDate(messageData.timestamp),
                  isRead: messageData.isRead,
                  attachments: messageData.attachments || [],
                  replyTo: messageData.replyTo,
                  editedAt: messageData.editedAt ? timestampToDate(messageData.editedAt) : undefined,
                  deletedAt: messageData.deletedAt ? timestampToDate(messageData.deletedAt) : undefined
                };
                console.log('subscribeToConversations - Last message found:', lastMessage);
              }
            } catch (orderByError) {
              console.log('subscribeToConversations - orderBy failed, trying simple query:', orderByError);
              
              // Fallback: get all messages and sort manually
              try {
                const simpleMessagesQuery = query(
                  collection(db, MESSAGES_COLLECTION),
                  where('conversationId', '==', conversationId)
                );
                
                const simpleMessagesSnapshot = await getDocs(simpleMessagesQuery);
                console.log('subscribeToConversations - Simple query found messages:', simpleMessagesSnapshot.docs.length);
                
                if (simpleMessagesSnapshot.docs.length > 0) {
                  // Sort by timestamp manually
                  const messages = simpleMessagesSnapshot.docs.map(doc => ({
                    id: doc.id,
                    data: doc.data(),
                    timestamp: doc.data().timestamp
                  })).sort((a, b) => {
                    const timeA = a.timestamp?.seconds || 0;
                    const timeB = b.timestamp?.seconds || 0;
                    return timeB - timeA; // Descending order
                  });
                  
                  if (messages.length > 0) {
                    const messageData = messages[0].data;
                    lastMessage = {
                      id: messages[0].id,
                      conversationId: messageData.conversationId,
                      senderId: messageData.senderId,
                      content: messageData.content,
                      contentType: messageData.contentType,
                      timestamp: timestampToDate(messageData.timestamp),
                      isRead: messageData.isRead,
                      attachments: messageData.attachments || [],
                      replyTo: messageData.replyTo,
                      editedAt: messageData.editedAt ? timestampToDate(messageData.editedAt) : undefined,
                      deletedAt: messageData.deletedAt ? timestampToDate(messageData.deletedAt) : undefined
                    };
                    console.log('subscribeToConversations - Last message found via simple query:', lastMessage);
                  }
                }
              } catch (simpleError) {
                console.log('subscribeToConversations - Simple query also failed:', simpleError);
              }
            }
            
            conversations.push({
              id: conversationDoc.id,
              type: data.type,
              title: data.title,
              participants: data.participants,
              lastMessage,
              lastMessageTime: lastMessage ? lastMessage.timestamp : undefined,
              unreadCount: data.unreadCount || 0,
              isActive: data.isActive,
              createdAt: timestampToDate(data.createdAt),
              updatedAt: timestampToDate(data.updatedAt),
              metadata: data.metadata || {}
            });
          } else {
            console.log('subscribeToConversations - Conversation not found:', conversationId);
          }
        }
        
        console.log('subscribeToConversations - Final conversations:', conversations.length);
        
        // Sort by last message time or creation time
        const sortedConversations = conversations.sort((a, b) => {
          const timeA = a.lastMessageTime || a.createdAt;
          const timeB = b.lastMessageTime || b.createdAt;
          
          // Handle null/undefined times
          if (!timeA && !timeB) return 0;
          if (!timeA) return 1;
          if (!timeB) return -1;
          
          return timeB.getTime() - timeA.getTime();
        });
        
        callback(sortedConversations);
      });
    } catch (error) {
      console.error('Error setting up conversation subscription:', error);
      callback([]);
    }
  };
  
  // Start the subscription
  setupSubscription();
  
  // Return unsubscribe function
  return () => {
    if (unsubscribe) {
      unsubscribe();
    }
  };
};

// Get conversation messages (alias for getMessages)
export const getConversationMessages = getMessages;

// Get conversation participants with user details
export const getConversationParticipants = async (conversationId: string) => {
  try {
    const participantsQuery = query(
      collection(db, PARTICIPANTS_COLLECTION),
      where('conversationId', '==', conversationId),
      where('isActive', '==', true)
    );
    
    const participantsSnapshot = await getDocs(participantsQuery);
    const participants = participantsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        conversationId: data.conversationId,
        joinedAt: timestampToDate(data.joinedAt),
        lastReadAt: timestampToDate(data.lastReadAt),
        role: data.role || 'member',
        isActive: data.isActive,
        metadata: data.metadata || {}
      };
    });
    
    return participants;
  } catch (error) {
    console.error('Error getting conversation participants:', error);
    return [];
  }
};

// Get user details for participants
export const getParticipantUserDetails = async (userId: string) => {
  try {
    // First try to get from chat_users collection
    const userQuery = query(
      collection(db, USERS_COLLECTION),
      where('uid', '==', userId)
    );
    
    const userSnapshot = await getDocs(userQuery);
    if (!userSnapshot.empty) {
      const userData = userSnapshot.docs[0].data();
      return {
        id: userId,
        name: userData.displayName || userData.email?.split('@')[0] || 'Unknown User',
        email: userData.email || '',
        avatar: userData.avatar || null
      };
    }
    
    // If not found in chat_users, try students collection
    const studentQuery = query(
      collection(db, 'students'),
      where('ID', '==', parseInt(userId) || 0)
    );
    
    const studentSnapshot = await getDocs(studentQuery);
    if (!studentSnapshot.empty) {
      const studentData = studentSnapshot.docs[0].data();
      return {
        id: userId,
        name: `${studentData.first_name} ${studentData.last_name}`,
        email: studentData.email || '',
        avatar: null
      };
    }
    
    // Return basic info if not found
    return {
      id: userId,
      name: `User ${userId}`,
      email: '',
      avatar: null
    };
  } catch (error) {
    console.error('Error getting participant user details:', error);
    return {
      id: userId,
      name: `User ${userId}`,
      email: '',
      avatar: null
    };
  }
};

// Helper function to create test data (for development)
export const createTestData = async () => {
  try {
    const currentStudentId = getUserIdFromLocalStorage();
    if (!currentStudentId) {
      throw new Error('User not authenticated - no user data found in localStorage');
    }
    console.log('Creating test data for student:', currentStudentId);
    
    // Create a test conversation
    const conversationData = {
      type: 'direct' as const,
      title: 'Test Conversation',
      participants: [currentStudentId, 'test-user-123'],
      lastMessage: null,
      lastMessageTime: null,
      unreadCount: 0,
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      metadata: {}
    };

    const conversationRef = await addDoc(collection(db, CONVERSATIONS_COLLECTION), conversationData);
    console.log('Created conversation:', conversationRef.id);

    // Create participant records
    const batch = writeBatch(db);
    
    [currentStudentId, 'test-user-123'].forEach(participantId => {
      const participantRef = doc(collection(db, PARTICIPANTS_COLLECTION));
      batch.set(participantRef, {
        userId: participantId,
        conversationId: conversationRef.id,
        joinedAt: serverTimestamp(),
        lastReadAt: serverTimestamp(),
        role: 'member',
        isActive: true,
        metadata: {}
      });
      console.log('Created participant record for:', participantId);
    });

    await batch.commit();
    console.log('Participant records created');

    // Add a test message
    const messageData = {
      conversationId: conversationRef.id,
      senderId: currentStudentId,
      content: 'Hello! This is a test message from Firebase.',
      contentType: 'text',
      timestamp: serverTimestamp(),
      isRead: false,
      attachments: [],
      replyTo: null,
      editedAt: null,
      deletedAt: null
    };

    await addDoc(collection(db, MESSAGES_COLLECTION), messageData);
    console.log('Test message created');

    console.log('Test data created successfully!');
    return conversationRef.id;
  } catch (error) {
    console.error('Error creating test data:', error);
    throw error;
  }
};

// Debug function to check localStorage and student data
export const debugLocalStorage = () => {
  console.log('=== DEBUG: LocalStorage ===');
  
  // Check regular login data
  const userData = localStorage.getItem('userData');
  if (userData) {
    const user = JSON.parse(userData);
    console.log('Regular login user data:', user);
    console.log('User ID:', user.id);
    console.log('User Name:', user.name);
    console.log('User Email:', user.email);
    console.log('User Type:', user.userType);
  } else {
    console.log('No regular login user data found in localStorage');
  }
  
  // Check Firebase student data
  const savedStudent = localStorage.getItem('studentData');
  if (savedStudent) {
    const studentData = JSON.parse(savedStudent);
    console.log('Firebase student data in localStorage:', studentData);
    console.log('Student ID:', studentData.ID);
    console.log('Student Name:', studentData.first_name, studentData.last_name);
    console.log('Student Email:', studentData.email);
  } else {
    console.log('No Firebase student data found in localStorage');
  }
  
  console.log('=== END DEBUG ===');
};

// Simple function to get user ID from localStorage only
export const getUserIdFromLocalStorage = (): string | null => {
  try {
    // First try regular login
    const userData = localStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      console.log('Found regular login user:', user);
      return user.id.toString();
    }
    
    // Then try Firebase student data
    const studentData = localStorage.getItem('studentData');
    if (studentData) {
      const student = JSON.parse(studentData);
      console.log('Found Firebase student:', student);
      return student.ID.toString();
    }
    
    console.log('No user data found in localStorage');
    return null;
  } catch (error) {
    console.error('Error getting user ID from localStorage:', error);
    return null;
  }
};

// Create test message for a conversation
export const createTestMessage = async (conversationId: string, content: string) => {
  try {
    const userId = getUserIdFromLocalStorage();
    if (!userId) {
      throw new Error('User not authenticated - no user data found in localStorage');
    }

    console.log('Creating test message for conversation:', conversationId);
    
    const messageData = {
      conversationId: conversationId,
      senderId: userId,
      content: content,
      contentType: 'text',
      timestamp: serverTimestamp(),
      isRead: false,
      attachments: [],
      replyTo: null,
      editedAt: null,
      deletedAt: null
    };

    const messageRef = await addDoc(collection(db, MESSAGES_COLLECTION), messageData);
    console.log('Test message created:', messageRef.id);
    return messageRef.id;
  } catch (error) {
    console.error('Error creating test message:', error);
    throw error;
  }
};

// Force load conversations for testing
export const forceLoadConversations = async (callback: (conversations: Conversation[]) => void) => {
  try {
    const userId = getUserIdFromLocalStorage();
    if (!userId) {
      console.log('No user ID found, cannot load conversations');
      callback([]);
      return;
    }

    console.log('Force loading conversations for user:', userId);
    
    // Get all conversations where current user is a participant
    const participantsQuery = query(
      collection(db, PARTICIPANTS_COLLECTION),
      where('userId', '==', userId),
      where('isActive', '==', true)
    );
    
    const participantsSnapshot = await getDocs(participantsQuery);
    console.log('Force load - Participants found:', participantsSnapshot.docs.length);
    
    const conversationIds = participantsSnapshot.docs.map(doc => {
      const data = doc.data();
      console.log('Force load - Participant data:', data);
      return data.conversationId;
    });
    
    console.log('Force load - Conversation IDs:', conversationIds);
    
    if (conversationIds.length === 0) {
      console.log('Force load - No conversations found');
      callback([]);
      return;
    }
    
    // Get conversation details
    const conversations: Conversation[] = [];
    
    for (const conversationId of conversationIds) {
      console.log('Force load - Loading conversation:', conversationId);
      const conversationDoc = await getDoc(doc(db, CONVERSATIONS_COLLECTION, conversationId));
      
      if (conversationDoc.exists()) {
        const data = conversationDoc.data();
        console.log('Force load - Conversation data:', data);
        
        // Get last message for this conversation
        let lastMessage = undefined;
        try {
          const messagesQuery = query(
            collection(db, MESSAGES_COLLECTION),
            where('conversationId', '==', conversationId)
          );
          
          const messagesSnapshot = await getDocs(messagesQuery);
          console.log('Force load - Messages found for conversation:', messagesSnapshot.docs.length);
          
          if (messagesSnapshot.docs.length > 0) {
            // Sort by timestamp manually
            const messages = messagesSnapshot.docs.map(doc => ({
              id: doc.id,
              data: doc.data(),
              timestamp: doc.data().timestamp
            })).sort((a, b) => {
              const timeA = a.timestamp?.seconds || 0;
              const timeB = b.timestamp?.seconds || 0;
              return timeB - timeA; // Descending order
            });
            
            if (messages.length > 0) {
              const messageData = messages[0].data;
              lastMessage = {
                id: messages[0].id,
                conversationId: messageData.conversationId,
                senderId: messageData.senderId,
                content: messageData.content,
                contentType: messageData.contentType,
                timestamp: timestampToDate(messageData.timestamp),
                isRead: messageData.isRead,
                attachments: messageData.attachments || [],
                replyTo: messageData.replyTo,
                editedAt: messageData.editedAt ? timestampToDate(messageData.editedAt) : undefined,
                deletedAt: messageData.deletedAt ? timestampToDate(messageData.deletedAt) : undefined
              };
              console.log('Force load - Last message found:', lastMessage);
            }
          }
        } catch (error) {
          console.log('Force load - Error getting last message:', error);
        }

        const conversation: Conversation = {
          id: conversationDoc.id,
          type: data.type,
          title: data.title,
          participants: data.participants,
          lastMessage: lastMessage,
          lastMessageTime: lastMessage ? lastMessage.timestamp : undefined,
          unreadCount: data.unreadCount || 0,
          isActive: data.isActive,
          createdAt: timestampToDate(data.createdAt),
          updatedAt: timestampToDate(data.updatedAt),
          metadata: data.metadata || {}
        };
        
        console.log('Force load - Created conversation object:', conversation);
        conversations.push(conversation);
      } else {
        console.log('Force load - Conversation not found:', conversationId);
      }
    }
    
    console.log('Force load - Final conversations:', conversations.length);
    callback(conversations);
  } catch (error) {
    console.error('Force load error:', error);
    callback([]);
  }
};

// Debug function to check what conversations exist for a student
export const debugStudentConversations = async () => {
  try {
    const currentStudentId = await getCurrentStudentId();
    console.log('=== DEBUG: Student Conversations ===');
    console.log('Student ID:', currentStudentId);
    
    // Check participants collection
    const participantsQuery = query(
      collection(db, PARTICIPANTS_COLLECTION),
      where('userId', '==', currentStudentId)
    );
    
    const participantsSnapshot = await getDocs(participantsQuery);
    console.log('Participant records found:', participantsSnapshot.docs.length);
    
    participantsSnapshot.docs.forEach((doc, index) => {
      const data = doc.data();
      console.log(`Participant ${index + 1}:`, {
        id: doc.id,
        userId: data.userId,
        conversationId: data.conversationId,
        isActive: data.isActive,
        role: data.role
      });
    });
    
    // Check all conversations
    const conversationsSnapshot = await getDocs(collection(db, CONVERSATIONS_COLLECTION));
    console.log('Total conversations in database:', conversationsSnapshot.docs.length);
    
    conversationsSnapshot.docs.forEach((doc, index) => {
      const data = doc.data();
      console.log(`Conversation ${index + 1}:`, {
        id: doc.id,
        title: data.title,
        type: data.type,
        participants: data.participants,
        isActive: data.isActive
      });
    });
    
    console.log('=== END DEBUG ===');
  } catch (error) {
    console.error('Debug error:', error);
  }
};

// Helper function to create test group conversation
export const createTestGroupData = async () => {
  try {
    const currentStudentId = getUserIdFromLocalStorage();
    if (!currentStudentId) {
      throw new Error('User not authenticated - no user data found in localStorage');
    }
    console.log('Creating test group data for student:', currentStudentId);
    
    // Create a test group conversation
    const conversationData = {
      type: 'group' as const,
      title: 'Computer Science Study Group',
      participants: [currentStudentId, 'test-user-456', 'test-user-789'],
      lastMessage: null,
      lastMessageTime: null,
      unreadCount: 0,
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      metadata: {
        groupName: 'Computer Science Study Group',
        groupDescription: 'Study group for CS students',
        createdBy: currentStudentId
      }
    };

    const conversationRef = await addDoc(collection(db, CONVERSATIONS_COLLECTION), conversationData);
    console.log('Created group conversation:', conversationRef.id);

    // Create participant records for all group members
    const batch = writeBatch(db);
    
    [currentStudentId, 'test-user-456', 'test-user-789'].forEach(participantId => {
      const participantRef = doc(collection(db, PARTICIPANTS_COLLECTION));
      batch.set(participantRef, {
        userId: participantId,
        conversationId: conversationRef.id,
        joinedAt: serverTimestamp(),
        lastReadAt: serverTimestamp(),
        role: participantId === currentStudentId ? 'admin' : 'member',
        isActive: true,
        metadata: {}
      });
      console.log('Created group participant record for:', participantId);
    });

    await batch.commit();
    console.log('Group participant records created');

    // Add a test group message
    const messageData = {
      conversationId: conversationRef.id,
      senderId: currentStudentId,
      content: 'Welcome to the Computer Science Study Group! Let\'s discuss our assignments.',
      contentType: 'text',
      timestamp: serverTimestamp(),
      isRead: false,
      attachments: [],
      replyTo: null,
      editedAt: null,
      deletedAt: null,
      metadata: {
        senderName: 'Current User'
      }
    };

    await addDoc(collection(db, MESSAGES_COLLECTION), messageData);
    console.log('Test group message created');

    console.log('Test group data created successfully!');
    return conversationRef.id;
  } catch (error) {
    console.error('Error creating test group data:', error);
    throw error;
  }
};

// Create group conversation
export const createGroupConversation = async (data: CreateGroupRequest): Promise<Conversation> => {
  try {
    const currentUserId = getCurrentUserId();
    const now = new Date();

    // Create conversation document
    const conversationData = {
      type: 'group' as const,
      title: data.name,
      participants: [...data.participants, currentUserId], // Include current user
      lastMessage: null,
      lastMessageTime: null,
      unreadCount: 0,
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      metadata: {
        groupDescription: data.description || '',
        groupAvatar: data.avatar || '',
        ...data
      }
    };

    const conversationRef = await addDoc(collection(db, CONVERSATIONS_COLLECTION), conversationData);

    // Create participant records for all participants
    const batch = writeBatch(db);
    
    data.participants.forEach(participantId => {
      const participantRef = doc(collection(db, PARTICIPANTS_COLLECTION));
      batch.set(participantRef, {
        userId: participantId,
        conversationId: conversationRef.id,
        joinedAt: serverTimestamp(),
        lastReadAt: serverTimestamp(),
        role: 'member',
        isActive: true,
        metadata: {}
      });
    });

    // Add current user as admin
    const currentUserParticipantRef = doc(collection(db, PARTICIPANTS_COLLECTION));
    batch.set(currentUserParticipantRef, {
      userId: currentUserId,
      conversationId: conversationRef.id,
      joinedAt: serverTimestamp(),
      lastReadAt: serverTimestamp(),
      role: 'admin',
      isActive: true,
      metadata: {}
    });

    await batch.commit();

    // Return the created conversation
    return {
      id: conversationRef.id,
      type: 'group',
      title: data.name,
      participants: [...data.participants, currentUserId],
      lastMessage: undefined,
      lastMessageTime: undefined,
      unreadCount: 0,
      isActive: true,
      createdAt: now,
      updatedAt: now,
      metadata: {
        groupDescription: data.description || '',
        groupAvatar: data.avatar || '',
        ...data
      }
    };
  } catch (error) {
    console.error('Error creating group conversation:', error);
    throw error;
  }
};

// Create direct message conversation
export const createDMConversation = async (data: { recipient_email: string }): Promise<Conversation> => {
  try {
    // Get user ID from localStorage first
    const userIdFromStorage = getUserIdFromLocalStorage();
    if (!userIdFromStorage) {
      throw new Error('User not authenticated - no user data found in localStorage');
    }
    
    const currentUserId = userIdFromStorage;
    const recipientUserId = await getOrCreateFirebaseUserId(data.recipient_email);
    const now = new Date();

    // Check if conversation already exists
    const existingConversationQuery = query(
      collection(db, CONVERSATIONS_COLLECTION),
      where('type', '==', 'direct'),
      where('participants', 'array-contains', currentUserId)
    );
    
    const existingConversationSnapshot = await getDocs(existingConversationQuery);
    
    for (const doc of existingConversationSnapshot.docs) {
      const conversationData = doc.data();
      if (conversationData.participants.includes(recipientUserId)) {
        // Return existing conversation
        return {
          id: doc.id,
          type: 'direct',
          title: conversationData.title,
          participants: conversationData.participants,
          lastMessage: undefined,
          lastMessageTime: undefined,
          unreadCount: conversationData.unreadCount || 0,
          isActive: conversationData.isActive,
          createdAt: timestampToDate(conversationData.createdAt),
          updatedAt: timestampToDate(conversationData.updatedAt),
          metadata: conversationData.metadata || {}
        };
      }
    }

    // Create new conversation
    const conversationData = {
      type: 'direct' as const,
      title: `Direct Message`,
      participants: [currentUserId, recipientUserId],
      lastMessage: null,
      lastMessageTime: null,
      unreadCount: 0,
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      metadata: {}
    };

    const conversationRef = await addDoc(collection(db, CONVERSATIONS_COLLECTION), conversationData);

    // Create participant records
    const batch = writeBatch(db);
    
    [currentUserId, recipientUserId].forEach(participantId => {
      const participantRef = doc(collection(db, PARTICIPANTS_COLLECTION));
      batch.set(participantRef, {
        userId: participantId,
        conversationId: conversationRef.id,
        joinedAt: serverTimestamp(),
        lastReadAt: serverTimestamp(),
        role: 'member',
        isActive: true,
        metadata: {}
      });
    });

    await batch.commit();

    // Return the created conversation
    return {
      id: conversationRef.id,
      type: 'direct',
      title: `Direct Message`,
      participants: [currentUserId, recipientUserId],
      lastMessage: undefined,
      lastMessageTime: undefined,
      unreadCount: 0,
      isActive: true,
      createdAt: now,
      updatedAt: now,
      metadata: {}
    };
  } catch (error) {
    console.error('Error creating DM conversation:', error);
    throw error;
  }
};

// Update read receipt
export const updateReadReceipt = async (conversationId: string, messageId: string): Promise<void> => {
  try {
    const currentUserId = getCurrentUserId();
    const now = new Date();
    
    // Create or update read receipt
    const readReceiptRef = doc(collection(db, READ_RECEIPTS_COLLECTION));
    await addDoc(collection(db, READ_RECEIPTS_COLLECTION), {
      messageId,
      userId: currentUserId,
      readAt: serverTimestamp()
    });
    
    // Mark message as read
    await updateDoc(doc(db, MESSAGES_COLLECTION, messageId), {
      isRead: true
    });
    
    // Update participant's last read time
    const participantQuery = query(
      collection(db, PARTICIPANTS_COLLECTION),
      where('conversationId', '==', conversationId),
      where('userId', '==', currentUserId)
    );
    
    const participantSnapshot = await getDocs(participantQuery);
    if (!participantSnapshot.empty) {
      await updateDoc(participantSnapshot.docs[0].ref, {
        lastReadAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('Error updating read receipt:', error);
    throw error;
  }
};
