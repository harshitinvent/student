import type { Conversation, Message } from '../types/chat';

// Mock data for admin chat system (non-Firebase)
const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    type: 'direct',
    title: 'John Doe',
    participants: ['admin', '1'], // Using student ID as string
    lastMessage: {
      id: 'msg-1',
      conversationId: 'conv-1',
      senderId: 'admin',
      content: 'I\'ll help you with that assignment. Let me check the details.',
      contentType: 'text',
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      isRead: false
    },
    lastMessageTime: new Date(Date.now() - 1800000),
    unreadCount: 1,
    isActive: true,
    createdAt: new Date(Date.now() - 86400000), // 1 day ago
    updatedAt: new Date(Date.now() - 1800000),
    metadata: {
      studentId: '1',
      studentName: 'John Doe',
      studentEmail: 'john.doe@university.edu'
    }
  },
  {
    id: 'conv-2',
    type: 'direct',
    title: 'Jane Smith',
    participants: ['admin', '2'], // Using student ID as string
    lastMessage: {
      id: 'msg-2',
      conversationId: 'conv-2',
      senderId: 'admin',
      content: 'I\'ll help you with that. Let me check the details.',
      contentType: 'text',
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      isRead: true
    },
    lastMessageTime: new Date(Date.now() - 7200000),
    unreadCount: 0,
    isActive: true,
    createdAt: new Date(Date.now() - 172800000), // 2 days ago
    updatedAt: new Date(Date.now() - 7200000),
    metadata: {
      studentId: '2',
      studentName: 'Jane Smith',
      studentEmail: 'jane.smith@university.edu'
    }
  },
  {
    id: 'conv-3',
    type: 'group',
    title: 'Computer Science Group',
    participants: ['admin', '1', '2', '3'], // All students in the group
    lastMessage: {
      id: 'msg-3',
      conversationId: 'conv-3',
      senderId: 'admin',
      content: 'Welcome everyone! This is our CS discussion group.',
      contentType: 'text',
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      isRead: true
    },
    lastMessageTime: new Date(Date.now() - 1800000),
    unreadCount: 0,
    isActive: true,
    createdAt: new Date(Date.now() - 259200000), // 3 days ago
    updatedAt: new Date(Date.now() - 1800000),
    metadata: {
      groupDescription: 'Discussion group for Computer Science students',
      groupMembers: [
        { id: '1', name: 'John Doe', email: 'john.doe@university.edu' },
        { id: '2', name: 'Jane Smith', email: 'jane.smith@university.edu' },
        { id: '3', name: 'Mike Johnson', email: 'mike.johnson@university.edu' }
      ]
    }
  },
  {
    id: 'conv-4',
    type: 'group',
    title: 'Mathematics Group',
    participants: ['admin', '1', '4', '5'], // Different group with some overlapping members
    lastMessage: {
      id: 'msg-4',
      conversationId: 'conv-4',
      senderId: 'admin',
      content: 'Math assignment deadline is next week!',
      contentType: 'text',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      isRead: true
    },
    lastMessageTime: new Date(Date.now() - 3600000),
    unreadCount: 0,
    isActive: true,
    createdAt: new Date(Date.now() - 345600000), // 4 days ago
    updatedAt: new Date(Date.now() - 3600000),
    metadata: {
      groupDescription: 'Mathematics discussion group',
      groupMembers: [
        { id: '1', name: 'John Doe', email: 'john.doe@university.edu' },
        { id: '4', name: 'Sarah Wilson', email: 'sarah.wilson@university.edu' },
        { id: '5', name: 'David Brown', email: 'david.brown@university.edu' }
      ]
    }
  }
];

const mockMessages: { [conversationId: string]: Message[] } = {
  'conv-1': [
    {
      id: 'msg-1',
      conversationId: 'conv-1',
      senderId: 'student-1',
      content: 'Hello, I have a question about the assignment.',
      contentType: 'text',
      timestamp: new Date(Date.now() - 3600000),
      isRead: true
    },
    {
      id: 'msg-2',
      conversationId: 'conv-1',
      senderId: 'admin',
      content: 'Hi John! What\'s your question?',
      contentType: 'text',
      timestamp: new Date(Date.now() - 3500000),
      isRead: true
    },
    {
      id: 'msg-3',
      conversationId: 'conv-1',
      senderId: 'student-1',
      content: 'I\'m not sure about the deadline for the project submission.',
      contentType: 'text',
      timestamp: new Date(Date.now() - 3400000),
      isRead: true
    },
    {
      id: 'msg-4',
      conversationId: 'conv-1',
      senderId: 'admin',
      content: 'I\'ll help you with that assignment. Let me check the details.',
      contentType: 'text',
      timestamp: new Date(Date.now() - 1800000),
      isRead: false
    }
  ],
  'conv-2': [
    {
      id: 'msg-4',
      conversationId: 'conv-2',
      senderId: 'student-2',
      content: 'Can you help me with the course registration?',
      contentType: 'text',
      timestamp: new Date(Date.now() - 8000000),
      isRead: true
    },
    {
      id: 'msg-5',
      conversationId: 'conv-2',
      senderId: 'admin',
      content: 'I\'ll help you with that. Let me check the details.',
      contentType: 'text',
      timestamp: new Date(Date.now() - 7200000),
      isRead: true
    }
  ],
  'conv-3': [
    {
      id: 'msg-6',
      conversationId: 'conv-3',
      senderId: 'admin',
      content: 'Welcome to the Computer Science discussion group!',
      contentType: 'text',
      timestamp: new Date(Date.now() - 259200000),
      isRead: true
    },
    {
      id: 'msg-7',
      conversationId: 'conv-3',
      senderId: 'student-1',
      content: 'Thanks for creating this group!',
      contentType: 'text',
      timestamp: new Date(Date.now() - 250000000),
      isRead: true
    },
    {
      id: 'msg-8',
      conversationId: 'conv-3',
      senderId: 'student-3',
      content: 'Thanks for the clarification!',
      contentType: 'text',
      timestamp: new Date(Date.now() - 1800000),
      isRead: true
    }
  ]
};

// Get all conversations for admin
export const getAdminConversations = async (): Promise<Conversation[]> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockConversations;
  } catch (error) {
    console.error('Error getting admin conversations:', error);
    throw error;
  }
};

// Get messages for a conversation
export const getAdminMessages = async (conversationId: string): Promise<Message[]> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockMessages[conversationId] || [];
  } catch (error) {
    console.error('Error getting admin messages:', error);
    throw error;
  }
};

// Send a message (mock implementation)
export const sendAdminMessage = async (data: {
  conversationId: string;
  content: string;
  contentType?: 'text' | 'file' | 'image' | 'system';
}): Promise<Message> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId: data.conversationId,
      senderId: 'admin',
      content: data.content,
      contentType: data.contentType || 'text',
      timestamp: new Date(),
      isRead: false
    };

    // Add to mock messages
    if (!mockMessages[data.conversationId]) {
      mockMessages[data.conversationId] = [];
    }
    mockMessages[data.conversationId].push(newMessage);

    // Update conversation last message
    const conversation = mockConversations.find(c => c.id === data.conversationId);
    if (conversation) {
      conversation.lastMessage = newMessage;
      conversation.lastMessageTime = newMessage.timestamp;
      conversation.updatedAt = new Date();
    }

    return newMessage;
  } catch (error) {
    console.error('Error sending admin message:', error);
    throw error;
  }
};

// Get participant information for a conversation
export const getConversationParticipants = async (conversationId: string): Promise<{
  id: string;
  name: string;
  email: string;
  type: 'admin' | 'student';
  isOnline?: boolean;
}[]> => {
  try {
    const conversation = mockConversations.find(c => c.id === conversationId);
    if (!conversation) return [];

    const participants = conversation.participants.map(participantId => {
      if (participantId === 'admin') {
        return {
          id: 'admin',
          name: 'Admin',
          email: 'admin@university.edu',
          type: 'admin' as const,
          isOnline: true
        };
      }

      // Find student information
      const studentInfo = conversation.metadata?.groupMembers?.find(
        (member: any) => member.id === participantId
      ) || {
        id: participantId,
        name: `Student ${participantId}`,
        email: `student${participantId}@university.edu`
      };

      return {
        id: participantId,
        name: studentInfo.name,
        email: studentInfo.email,
        type: 'student' as const,
        isOnline: Math.random() > 0.5 // Random online status for demo
      };
    });

    return participants;
  } catch (error) {
    console.error('Error getting conversation participants:', error);
    return [];
  }
};

// Get all groups a student is part of
export const getStudentGroups = async (studentId: string): Promise<Conversation[]> => {
  try {
    return mockConversations.filter(conv => 
      conv.type === 'group' && conv.participants.includes(studentId)
    );
  } catch (error) {
    console.error('Error getting student groups:', error);
    return [];
  }
};

// Add student to a group
export const addStudentToGroup = async (conversationId: string, studentId: string, studentInfo: {
  name: string;
  email: string;
}): Promise<boolean> => {
  try {
    const conversation = mockConversations.find(c => c.id === conversationId);
    if (!conversation || conversation.type !== 'group') return false;

    // Add student to participants
    if (!conversation.participants.includes(studentId)) {
      conversation.participants.push(studentId);
    }

    // Add student to group members metadata
    if (!conversation.metadata.groupMembers) {
      conversation.metadata.groupMembers = [];
    }

    const existingMember = conversation.metadata.groupMembers.find(
      (member: any) => member.id === studentId
    );

    if (!existingMember) {
      conversation.metadata.groupMembers.push({
        id: studentId,
        name: studentInfo.name,
        email: studentInfo.email
      });
    }

    conversation.updatedAt = new Date();
    return true;
  } catch (error) {
    console.error('Error adding student to group:', error);
    return false;
  }
};

// Remove student from a group
export const removeStudentFromGroup = async (conversationId: string, studentId: string): Promise<boolean> => {
  try {
    const conversation = mockConversations.find(c => c.id === conversationId);
    if (!conversation || conversation.type !== 'group') return false;

    // Remove student from participants
    conversation.participants = conversation.participants.filter(id => id !== studentId);

    // Remove student from group members metadata
    if (conversation.metadata.groupMembers) {
      conversation.metadata.groupMembers = conversation.metadata.groupMembers.filter(
        (member: any) => member.id !== studentId
      );
    }

    conversation.updatedAt = new Date();
    return true;
  } catch (error) {
    console.error('Error removing student from group:', error);
    return false;
  }
};

// Create a new conversation
export const createAdminConversation = async (data: {
  type: 'direct' | 'group';
  participants: string[];
  title: string;
  metadata?: any;
}): Promise<Conversation> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newConversation: Conversation = {
      id: `conv-${Date.now()}`,
      type: data.type,
      title: data.title,
      participants: data.participants,
      lastMessage: undefined,
      lastMessageTime: undefined,
      unreadCount: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: data.metadata || {}
    };

    mockConversations.unshift(newConversation);
    mockMessages[newConversation.id] = [];

    return newConversation;
  } catch (error) {
    console.error('Error creating admin conversation:', error);
    throw error;
  }
};
