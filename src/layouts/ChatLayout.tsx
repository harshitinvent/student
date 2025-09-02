import React, { useState, useEffect } from 'react';
import { Link, useParams, Outlet } from 'react-router';
import { Avatar, Typography, Badge, Spin, Button } from 'antd';
import { MessageOutlined, UserOutlined, TeamOutlined, PlusOutlined } from '@ant-design/icons';
import SearchInput from '../components/shared/form-elements/SearchInput';
import { getConversations } from '../services/chatAPI';
import type { Conversation } from '../types/chat';

const { Text, Title } = Typography;

export default function ChatLayout() {
  const params = useParams();
  const [searchValue, setSearchValue] = useState<string>('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const conversationsData = await getConversations();
      setConversations(conversationsData);
    } catch (error) {
      console.error('Error loading conversations:', error);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

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
        {/* Header */}
        <div className="chat-header">
          <div className="chat-header-content">
            <div className="chat-logo">
              <MessageOutlined className="chat-logo-icon" />
            </div>
            <div className="chat-title-section">
              <h1 className="chat-title">Student Chat</h1>
              <p className="chat-subtitle">Connect with your students</p>
            </div>
          </div>
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

        {/* Search */}
        <div className="chat-search">
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
              <Text className="empty-title">No conversations yet</Text>
              <Text className="empty-subtitle">Start chatting with your students to see conversations here</Text>
              <Button
                type="primary"
                onClick={() => window.location.href = '/students-chat'}
                className="start-chat-button"
                size="large"
              >
                Start First Chat
              </Button>
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

      <style jsx>{`
        .chat-layout {
          display: flex;
          height: 100vh;
          background: #f8fafc;
        }

        .chat-sidebar {
          width: 320px;
          background: white;
          border-right: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
        }

        .chat-header {
          padding: 24px;
          border-bottom: 1px solid #e2e8f0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .chat-header-content {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
        }

        .chat-logo {
          width: 48px;
          height: 48px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 16px;
        }

        .chat-logo-icon {
          font-size: 24px;
          color: white;
        }

        .chat-title-section {
          flex: 1;
        }

        .chat-title {
          font-size: 20px;
          font-weight: 700;
          margin: 0 0 4px 0;
          color: white;
        }

        .chat-subtitle {
          font-size: 14px;
          margin: 0;
          color: rgba(255, 255, 255, 0.8);
        }

        .new-chat-button {
          width: 100%;
          height: 44px;
          font-size: 16px;
          font-weight: 600;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.9);
          border: none;
          color: #667eea;
        }

        .new-chat-button:hover {
          background: white;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .chat-search {
          padding: 20px;
          border-bottom: 1px solid #e2e8f0;
          background: white;
        }

        .conversations-container {
          flex: 1;
          overflow-y: auto;
          background: #f8fafc;
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

        .start-chat-button {
          height: 40px;
          padding: 0 24px;
          border-radius: 8px;
          font-weight: 600;
        }

        .conversations-list {
          padding: 16px;
        }

        .chat-content {
          flex: 1;
          background: white;
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
  return (
    <Link
      to={`/chat/${conversation.id}`}
      className="conversation-item"
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

      <style jsx>{`
        .conversation-item {
          display: block;
          margin-bottom: 8px;
          border-radius: 12px;
          transition: all 0.2s ease;
          text-decoration: none;
        }

        .conversation-item:hover {
          background: white;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
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

        .conversation-time {
          font-size: 12px;
          color: #94a3b8;
          flex-shrink: 0;
          margin-left: 8px;
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
      `}</style>
    </Link>
  );
}
