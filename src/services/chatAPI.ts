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
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';
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

// Helper function to get current user ID (you'll need to implement this based on your auth system)
const getCurrentUserId = (): string => {
  // For now, return a default user ID
  // In a real app, this should come from your authentication context
  return 'current-user-id';
};

// Helper function to convert Firestore timestamp to Date
const timestampToDate = (timestamp: Timestamp | null): Date => {
  return timestamp ? timestamp.toDate() : new Date();
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
    
    // Get all conversations where current user is a participant
    const participantsQuery = query(
      collection(db, PARTICIPANTS_COLLECTION),
      where('userId', '==', currentUserId),
      where('isActive', '==', true)
    );
    
    const participantsSnapshot = await getDocs(participantsQuery);
    const conversationIds = participantsSnapshot.docs.map(doc => doc.data().conversationId);
    
    if (conversationIds.length === 0) {
      return [];
    }
    
    // Get conversation details
    const conversations: Conversation[] = [];
    
    for (const conversationId of conversationIds) {
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
    const currentUserId = getCurrentUserId();
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
  const messagesQuery = query(
    collection(db, MESSAGES_COLLECTION),
    where('conversationId', '==', conversationId),
    orderBy('timestamp', 'asc')
  );
  
  return onSnapshot(messagesQuery, (snapshot) => {
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
    });
    
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

// Get conversation messages (alias for getMessages)
export const getConversationMessages = getMessages;

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
export const createDMConversation = async (data: { recipient_id: string }): Promise<Conversation> => {
  try {
    const currentUserId = getCurrentUserId();
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
      if (conversationData.participants.includes(data.recipient_id)) {
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
      participants: [currentUserId, data.recipient_id],
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
    
    [currentUserId, data.recipient_id].forEach(participantId => {
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
      participants: [currentUserId, data.recipient_id],
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

// Get conversation participants
export const getConversationParticipants = async (conversationId: string): Promise<ChatUser[]> => {
  try {
    const participantsQuery = query(
      collection(db, PARTICIPANTS_COLLECTION),
      where('conversationId', '==', conversationId),
      where('isActive', '==', true)
    );
    
    const participantsSnapshot = await getDocs(participantsQuery);
    
    // For now, return mock user data since we don't have a users collection
    // In a real app, you would fetch user details from your users collection
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
        lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000),
        type: 'student',
        metadata: {
          studentId: 'STU002',
          studentName: 'Jane Smith',
          studentEmail: 'jane.smith@university.edu',
          department: 'Business Administration',
          program: 'Master of Business Administration',
          yearOfStudy: '2nd Year'
        }
      }
    ];
    
    // Filter mock users to match participant IDs
    const participantIds = participantsSnapshot.docs.map(doc => doc.data().userId);
    return mockUsers.filter(user => participantIds.includes(user.id));
  } catch (error) {
    console.error('Error getting conversation participants:', error);
    return [];
  }
}; 