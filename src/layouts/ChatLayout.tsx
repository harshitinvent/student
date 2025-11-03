import React, { useState, useEffect } from 'react';
import { Link, useParams, Outlet } from 'react-router';
import { Avatar, Typography, Badge, Spin, Button } from 'antd';
import { MessageOutlined, UserOutlined, TeamOutlined, PlusOutlined } from '@ant-design/icons';
import SearchInput from '../components/shared/form-elements/SearchInput';
import { subscribeToConversations } from '../services/chatAPI';
import type { Conversation } from '../types/chat';

const { Text, Title } = Typography;

export default function ChatLayout() {
  const params = useParams();
  const [searchValue, setSearchValue] = useState<string>('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up real-time Firebase conversation subscription
    setLoading(true);

    // First try to load real Firebase conversations
    const loadRealConversations = async () => {
      try {
        const { getConversations } = await import('../services/chatAPI');
        const realConversations = await getConversations();

        if (realConversations.length > 0) {
          console.log('Loaded real conversations from Firebase:', realConversations.length);
          setConversations(realConversations);
          setLoading(false);
          return;
        } else {
          console.log('No conversations found in Firebase');
          setConversations([]);
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error('Error loading Firebase conversations:', error);
        // Only show mock data if Firebase is not available
        console.log('Firebase not available, showing empty list');
        setConversations([]);
        setLoading(false);
        return;
      }
    };

    loadRealConversations();

    // Create mock conversations to match the image (only for demo purposes)
    const mockConversations: Conversation[] = [
      {
        id: 'cs0104-group',
        type: 'group',
        title: 'CS0104',
        participants: ['current-user', 'user-1', 'user-2', 'user-3'],
        lastMessage: {
          id: 'last-1',
          conversationId: 'cs0104-group',
          senderId: 'user-1',
          content: 'VCV',
          contentType: 'text',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          isRead: true,
          senderName: 'User'
        },
        lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
        unreadCount: 0,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: {
          groupName: 'CS0104',
          groupDescription: 'Computer Science Study Group',
          groupMembers: [
            { id: 'current-user', name: 'Current User', email: 'current@university.edu', isOnline: true },
            { id: 'user-1', name: 'User', email: 'user1@university.edu', isOnline: true },
            { id: 'user-2', name: 'User', email: 'user2@university.edu', isOnline: false },
            { id: 'user-3', name: 'User', email: 'user3@university.edu', isOnline: true }
          ]
        }
      },
      {
        id: 'fff-group',
        type: 'group',
        title: 'fff',
        participants: ['current-user', 'user-1', 'user-2', 'user-3', 'user-4'],
        lastMessage: {
          id: 'last-2',
          conversationId: 'fff-group',
          senderId: 'user-1',
          content: 'Hi',
          contentType: 'text',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
          isRead: true,
          senderName: 'Group Member'
        },
        lastMessageTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        unreadCount: 0,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: {
          groupName: 'fff',
          groupDescription: 'Group Chat',
          groupMembers: [
            { id: 'current-user', name: 'Current User', email: 'current@university.edu', isOnline: true },
            { id: 'user-1', name: 'Group Member', email: 'user1@university.edu', isOnline: true },
            { id: 'user-2', name: 'Group Member', email: 'user2@university.edu', isOnline: false },
            { id: 'user-3', name: 'Group Member', email: 'user3@university.edu', isOnline: true },
            { id: 'user-4', name: 'Group Member', email: 'user4@university.edu', isOnline: true }
          ]
        }
      },
      {
        id: 'chat-with-s',
        type: 'direct',
        title: 'Chat with S...',
        participants: ['current-user', 'student-1'],
        lastMessage: {
          id: 'last-3',
          conversationId: 'chat-with-s',
          senderId: 'student-1',
          content: 'fddffdffddff',
          contentType: 'text',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
          isRead: true,
          senderName: 'Student'
        },
        lastMessageTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        unreadCount: 0,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: {
          studentName: 'Student',
          studentEmail: 'student@university.edu',
          groupMembers: [
            { id: 'current-user', name: 'Current User', email: 'current@university.edu', isOnline: true },
            { id: 'student-1', name: 'Student', email: 'student@university.edu', isOnline: true }
          ]
        }
      }
    ];

    // Set up Firebase subscription for real-time updates
    try {
      const unsubscribe = subscribeToConversations((conversations) => {
        console.log('Firebase conversation update:', conversations.length, 'conversations');
        setConversations(conversations); // Always set conversations, even if empty
      });

      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    } catch (error) {
      console.log('Firebase subscription failed, using mock data');
    }
  }, []);

  const formatTime = (timestamp: Date) => {
    try {
      const now = new Date();
      const diff = now.getTime() - timestamp.getTime();
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);

      if (minutes < 1) return 'Just now';
      if (minutes < 60) return `${minutes}m ago`;
      if (hours < 24) return `${hours}h ago`;
      if (days < 7) return `${days}d ago`;
      return timestamp.toLocaleDateString();
    } catch (error) {
      return 'Unknown time';
    }
  };

  const getConversationTitle = (conversation: Conversation) => {
    if (conversation.title) {
      return conversation.title;
    }

    if (conversation.type === 'group') {
      // For group chats, show the group name from metadata
      return conversation.metadata?.groupName || conversation.metadata?.groupDescription || 'Group Chat';
    }

    if (conversation.type === 'direct' && conversation.metadata?.studentName) {
      return conversation.metadata.studentName;
    }

    return 'Untitled Conversation';
  };

  const getConversationIcon = (conversation: Conversation) => {
    if (conversation.type === 'group') {
      return <TeamOutlined />;
    }
    return <UserOutlined />;
  };

  const getConversationAvatar = (conversation: Conversation) => {
    if (conversation.type === 'group') {
      return (
        <Avatar
          size={48}
          icon={<TeamOutlined />}
          className="bg-blue-500"
        />
      );
    }

    if (conversation.metadata?.studentName) {
      const names = conversation.metadata.studentName.split(' ');
      const initials = names.map(n => n.charAt(0)).join('').toUpperCase();
      return (
        <Avatar
          size={48}
          className="bg-green-500"
        >
          {initials}
        </Avatar>
      );
    }

    return (
      <Avatar
        size={48}
        icon={<UserOutlined />}
        className="bg-gray-500"
      />
    );
  };

  return (
    <div className="chat-layout">
      {/* Left Sidebar - Student Chat Only */}
      <div className="chat-sidebar">
        {/* Top Search Bar */}
        <div className="top-search-bar">
          <SearchInput
            value={searchValue}
            onChange={(value) => setSearchValue(value)}
            onSubmit={() => { }}
            placeholder="Search..."
          />
        </div>

        {/* Student Chat Card */}
        <div className="student-chat-card">
          <div className="chat-header-content">
            <div className="chat-logo">
              <MessageOutlined className="chat-logo-icon" />
            </div>
            <div className="chat-title-section">
              <h1 className="chat-title">Student Chat</h1>
              <p className="chat-subtitle">Connect with your students</p>
            </div>
          </div>
        </div>

        {/* New Chat Button */}
        <div className="new-chat-button-container">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => window.location.href = '/students-chat'}
            className="new-chat-button"
            size="large"
          >
            + New Chat
          </Button>
        </div>

        {/* Search Conversations */}
        <div className="chat-search-conversations">
          <SearchInput
            value={searchValue}
            onChange={(value) => setSearchValue(value)}
            onSubmit={() => { }}
            placeholder="Search conversations..."
          />
        </div>

        {/* Conversations List */}
        <div className="conversations-container">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner">
                <Spin size="large" />
              </div>
              <Text className="loading-text">Loading conversations...</Text>
            </div>
          ) : conversations.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <MessageOutlined />
              </div>
              <Text className="empty-title">No chats found</Text>
              <Text className="empty-subtitle">
                No conversations available. Start a new chat or check back later.
              </Text>
              <div className="empty-actions">
                <Button
                  type="primary"
                  onClick={() => window.location.href = '/students-chat'}
                  className="start-chat-button"
                  size="large"
                >
                  Browse Students
                </Button>
                <Button
                  type="default"
                  onClick={() => window.location.href = '/student-chat'}
                  className="start-chat-button"
                  size="large"
                >
                  Student Chat
                </Button>
              </div>
            </div>
          ) : (
            <div className="conversations-list">
              {conversations.map((conversation) => (
                <ChatListItem
                  key={conversation.id}
                  conversation={conversation}
                  formatTime={formatTime}
                  getConversationTitle={getConversationTitle}
                  getConversationIcon={getConversationIcon}
                  getConversationAvatar={getConversationAvatar}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Chat Content */}
      <div className="chat-content">
        <Outlet />
      </div>

      <style>{`
        /* Modern Chat Layout - Original Design */
        .chat-layout {
          display: flex;
          height: 100%;
          background: #f8fafc;
        }

        .chat-sidebar {
          width: 320px;
          background: #f8fafc;
          border-right: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
        }

        .top-search-bar {
          padding: 16px 20px;
          border-bottom: 1px solid #e2e8f0;
          background: white;
        }

        .student-chat-card {
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          margin: 0;
        }

        .new-chat-button-container {
          padding: 16px 20px;
          background: white;
          border-bottom: 1px solid #e2e8f0;
        }

        .chat-search-conversations {
          padding: 16px 20px;
          border-bottom: 1px solid #e2e8f0;
          background: white;
        }

        .student-chat-card .chat-header-content {
          display: flex;
          align-items: center;
          margin-bottom: 0;
        }

        .student-chat-card .chat-logo {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 12px;
        }

        .student-chat-card .chat-logo-icon {
          font-size: 20px;
          color: white;
        }

        .student-chat-card .chat-title-section {
          flex: 1;
        }

        .student-chat-card .chat-title {
          font-size: 18px;
          font-weight: 700;
          margin: 0 0 4px 0;
          color: white;
        }

        .student-chat-card .chat-subtitle {
          font-size: 13px;
          margin: 0;
          color: rgba(255, 255, 255, 0.8);
        }

        .new-chat-button {
          width: 100%;
          height: 40px;
          font-size: 14px;
          font-weight: 600;
          border-radius: 8px;
          background: #667eea;
          border: 1px solid #667eea;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .new-chat-button:hover {
          background: #5a67d8;
          border-color: #5a67d8;
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.15);
        }


        .conversations-container {
          flex: 1;
          overflow-y: auto;
          background: white;
        }

        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          text-align: center;
        }

        .loading-spinner {
          margin-bottom: 16px;
        }

        .loading-text {
          color: #64748b;
          font-size: 14px;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          text-align: center;
        }

        .empty-icon {
          width: 64px;
          height: 64px;
          background: #e2e8f0;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          font-size: 28px;
          color: #94a3b8;
        }

        .empty-title {
          display: block;
          font-size: 16px;
          font-weight: 600;
          color: #475569;
          margin-bottom: 8px;
        }

        .empty-subtitle {
          display: block;
          font-size: 14px;
          color: #64748b;
          margin-bottom: 24px;
          line-height: 1.5;
        }

        .empty-actions {
          display: flex;
          gap: 12px;
          flex-direction: column;
          width: 100%;
        }

        .start-chat-button {
          height: 40px;
          padding: 0 24px;
          border-radius: 8px;
          font-weight: 600;
        }

        .conversations-list {
          padding: 0;
        }

        .chat-content {
          flex: 1;
          background: white;
          display: flex;
          flex-direction: column;
          // overflow: hidden;
        }

        /* Conversation Item Styles */
        .conversation-item {
          display: flex;
          align-items: center;
          padding: 16px;
          margin: 8px 16px;
          border-radius: 12px;
          text-decoration: none;
          color: inherit;
          transition: all 0.2s ease;
          border: 1px solid #e2e8f0;
          background: white;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .conversation-item:hover {
          background: #f8fafc;
          border-color: #667eea;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
        }

        .conversation-item.active {
          background: #667eea;
          color: white;
          border-color: #667eea;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .conversation-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 16px;
          font-size: 16px;
          font-weight: 600;
          color: white;
          background: #667eea;
        }

        .conversation-avatar.group {
          background: #667eea;
        }

        .conversation-avatar.direct {
          background: #10b981;
        }

        .conversation-content {
          flex: 1;
          min-width: 0;
        }

        .conversation-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 4px;
        }

        .conversation-title {
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex: 1;
          margin-bottom: 4px;
        }

        .conversation-item.active .conversation-title {
          color: white;
        }

        .conversation-type {
          font-size: 10px;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 4px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-left: 8px;
        }

        .conversation-type.group {
          background: #dbeafe;
          color: #1e40af;
        }

        .conversation-type.direct {
          background: #dcfce7;
          color: #166534;
        }

        .conversation-item.active .conversation-type {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }

        .conversation-preview {
          font-size: 14px;
          color: #64748b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 8px;
        }

        .conversation-item.active .conversation-preview {
          color: rgba(255, 255, 255, 0.8);
        }

        .conversation-time {
          font-size: 12px;
          color: #94a3b8;
          font-weight: 500;
        }

        .conversation-item.active .conversation-time {
          color: rgba(255, 255, 255, 0.7);
        }

        /* Search Input Styles */
        .search-input {
          width: 100%;
          height: 36px;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 0 12px;
          font-size: 13px;
          background: #f8fafc;
          color: #1e293b;
        }

        .search-input:focus {
          outline: none;
          border-color: #667eea;
          background: white;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .search-input::placeholder {
          color: #94a3b8;
        }

        /* Custom scrollbar */
        .conversations-container::-webkit-scrollbar {
          width: 4px;
        }

        .conversations-container::-webkit-scrollbar-track {
          background: #f1f5f9;
        }

        .conversations-container::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 2px;
        }

        .conversations-container::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}

export function ChatListItem({
  conversation,
  formatTime,
  getConversationTitle,
  getConversationIcon,
  getConversationAvatar
}: {
  conversation: Conversation;
  formatTime: (timestamp: Date) => string;
  getConversationTitle: (conversation: Conversation) => string;
  getConversationIcon: (conversation: Conversation) => React.ReactNode;
  getConversationAvatar: (conversation: Conversation) => React.ReactNode;
}) {
  const params = useParams();
  const isActive = params.id === conversation.id;

  return (
    <Link
      to={`/chat/${conversation.id}`}
      className={`conversation-item ${isActive ? 'active' : ''}`}
    >
      <div className="conversation-content">
        <div className="conversation-avatar">
          {getConversationAvatar(conversation)}
          {conversation.unreadCount > 0 && (
            <Badge
              count={conversation.unreadCount}
              size="small"
              className="unread-badge"
            />
          )}
        </div>

        <div className="conversation-details">
          <div className="conversation-header">
            <Text className="conversation-title">
              {getConversationTitle(conversation)}
            </Text>
            <Text className="conversation-time">
              {formatTime(conversation.createdAt)}
            </Text>
          </div>

          <Text className="conversation-preview">
            {conversation.lastMessage ? conversation.lastMessage.content : 'No messages yet'}
          </Text>

          <div className="conversation-meta">
            {getConversationIcon(conversation)}
            <Text className="conversation-type">
              {conversation.type === 'group' ? 'Group' : 'Direct'}
            </Text>
          </div>
        </div>
      </div>

      <style>{`
        .conversation-item {
          display: block;
          margin: 8px 16px;
          border-radius: 12px;
          transition: all 0.2s ease;
          text-decoration: none;
          background: white;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .conversation-item:hover {
          background: #f8fafc;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .conversation-item.active {
          background: #667eea;
          color: white;
          border-color: #667eea;
        }

        .conversation-content {
          display: flex;
          align-items: flex-start;
          padding: 16px;
          gap: 16px;
        }

        .conversation-avatar {
          position: relative;
          flex-shrink: 0;
        }

        .unread-badge {
          position: absolute;
          top: -4px;
          right: -4px;
        }

        .conversation-details {
          flex: 1;
          min-width: 0;
        }

        .conversation-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .conversation-title {
          font-weight: 600;
          color: #1e293b;
          font-size: 14px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .conversation-item.active .conversation-title {
          color: white;
        }

        .conversation-time {
          font-size: 12px;
          color: #94a3b8;
          flex-shrink: 0;
          margin-left: 8px;
        }

        .conversation-item.active .conversation-time {
          color: rgba(255, 255, 255, 0.8);
        }

        .conversation-preview {
          display: block;
          font-size: 13px;
          color: #64748b;
          margin-bottom: 8px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          line-height: 1.4;
        }

        .conversation-item.active .conversation-preview {
          color: rgba(255, 255, 255, 0.8);
        }

        .conversation-meta {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .conversation-type {
          font-size: 11px;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .conversation-item.active .conversation-type {
          color: rgba(255, 255, 255, 0.8);
        }
      `}</style>
    </Link>
  );
}
