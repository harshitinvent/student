export type ConversationType = 'DM' | 'GROUP';

export type ConversationStatus = 'ACTIVE' | 'ARCHIVED';

export type ParticipantRole = 'ADMIN' | 'MEMBER';

export type ContentType = 'TEXT' | 'FILE';

// Chat User interface that matches our student structure
export interface ChatUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isOnline?: boolean;
  lastSeen?: Date;
  type: 'student' | 'teacher' | 'admin';
  metadata?: {
    studentId?: string;
    studentName?: string;
    studentEmail?: string;
    department?: string;
    program?: string;
    yearOfStudy?: string;
  };
}

// Student interface for chat - matches the actual API response
export interface Student {
  ID: number; // API returns number
  CreatedAt: string; // API returns "2025-08-13T05:37:57.027906Z"
  UpdatedAt: string; // API returns "2025-08-13T05:37:57.027906Z"
  student_id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar_url?: string;
  program: string;
  year_of_study: string;
  enrollment_date: string;
  status: string;
  department?: string;
  semester?: number;
}

// Conversation interface
export interface Conversation {
  id: string;
  type: 'direct' | 'group';
  title: string;
  participants: string[];
  lastMessage?: Message;
  lastMessageTime?: Date;
  unreadCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  metadata?: {
    studentId?: string;
    studentName?: string;
    studentEmail?: string;
    groupDescription?: string;
    groupAvatar?: string;
  };
}

// Message interface
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  contentType: 'text' | 'file' | 'image' | 'system';
  timestamp: Date;
  isRead: boolean;
  attachments?: MessageAttachment[];
  replyTo?: string;
  editedAt?: Date;
  deletedAt?: Date;
}

// Message attachment interface
export interface MessageAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: Date;
}

// Conversation participant interface
export interface ConversationParticipant {
  userId: string;
  conversationId: string;
  joinedAt: Date;
  lastReadAt: Date;
  role: 'admin' | 'member' | 'viewer';
  isActive: boolean;
  metadata?: {
    displayName?: string;
    avatar?: string;
  };
}

// Read receipt interface
export interface ReadReceipt {
  messageId: string;
  userId: string;
  readAt: Date;
}

// Create conversation request
export interface CreateConversationRequest {
  type: 'direct' | 'group';
  participants: string[];
  title: string;
  metadata?: {
    studentId?: string;
    studentName?: string;
    studentEmail?: string;
    groupDescription?: string;
    groupAvatar?: string;
  };
}

// Send message request
export interface SendMessageRequest {
  conversationId: string;
  content: string;
  contentType?: 'text' | 'file' | 'image' | 'system';
  attachments?: File[];
  replyTo?: string;
}

// Update conversation request
export interface UpdateConversationRequest {
  title?: string;
  metadata?: Record<string, any>;
}

// Chat notification interface
export interface ChatNotification {
  id: string;
  type: 'message' | 'mention' | 'reaction' | 'system';
  title: string;
  message: string;
  conversationId?: string;
  senderId?: string;
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string;
}

// Chat search result interface
export interface ChatSearchResult {
  conversations: Conversation[];
  messages: Message[];
  users: ChatUser[];
}

// Chat statistics interface
export interface ChatStats {
  totalConversations: number;
  totalMessages: number;
  activeUsers: number;
  unreadMessages: number;
  messagesToday: number;
  conversationsToday: number;
}

// Create group request interface
export interface CreateGroupRequest {
  name: string;
  participants: string[];
  description?: string;
  avatar?: string;
} 