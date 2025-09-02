import React, { useState, useEffect } from 'react';
import { Typography, Button, Input, message } from 'antd';
import { SendOutlined, MessageOutlined } from '@ant-design/icons';
import { useParams } from 'react-router';
import MessageList from '../../components/features/chat/MessageList';
import ChatHeader from '../../components/features/chat/ChatHeader';
import NewChatModal from '../../components/features/chat/NewChatModal';
import { sendMessage, getConversations } from '../../services/chatAPI';
import type { Conversation, Message } from '../../types/chat';

const { Text, Title } = Typography;
const { TextArea } = Input;

const Chat: React.FC = () => {
  const params = useParams();
  const conversationId = params.id;

  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mock user for development (replace with real auth later)
  const mockUser = {
    id: 'current-user-id',
    name: 'Current User',
    email: 'user@example.com'
  };

  useEffect(() => {
    if (conversationId) {
      loadConversation(conversationId);
    }
  }, [conversationId]);

  const loadConversation = async (id: string) => {
    try {
      setLoading(true);
      // Load conversation details
      const conversations = await getConversations();
      const conversation = conversations.find(c => c.id === id);

      if (conversation) {
        setSelectedConversation(conversation);
        loadMessages(id);
      } else {
        message.error('Conversation not found');
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
      message.error('Failed to load conversation');
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      console.log('Loading messages for conversation:', conversationId);
      // For now, we'll use mock messages since Firebase might not be set up
      // In production, this would call getMessages(conversationId)
      const mockMessages: Message[] = [
        {
          id: '1',
          conversationId,
          senderId: 'student-1',
          content: 'Hello! How can I help you today?',
          contentType: 'text',
          timestamp: new Date(Date.now() - 3600000), // 1 hour ago
          isRead: false
        },
        {
          id: '2',
          conversationId,
          senderId: mockUser.id,
          content: 'Hi! I have a question about the assignment.',
          contentType: 'text',
          timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
          isRead: true
        },
        {
          id: '3',
          conversationId,
          senderId: 'student-1',
          content: 'Sure! What would you like to know?',
          contentType: 'text',
          timestamp: new Date(Date.now() - 900000), // 15 minutes ago
          isRead: true
        }
      ];
      console.log('Mock messages loaded:', mockMessages);
      setMessages(mockMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
      message.error('Failed to load messages');
      setMessages([]);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      console.log('Sending message:', newMessage.trim());
      const messageData = {
        conversationId: selectedConversation.id,
        content: newMessage.trim(),
        contentType: 'text' as const
      };

      await sendMessage(messageData);

      // Add message to local state
      const newMsg: Message = {
        id: Date.now().toString(),
        conversationId: selectedConversation.id,
        senderId: mockUser.id,
        content: newMessage.trim(),
        contentType: 'text',
        timestamp: new Date(),
        isRead: false
      };

      setMessages(prev => [...prev, newMsg]);
      setNewMessage('');
      message.success('Message sent!');
    } catch (error) {
      console.error('Error sending message:', error);
      message.error('Failed to send message');
    }
  };

  const handleNewChat = () => {
    setIsNewChatModalOpen(true);
  };

  const handleCreateGroup = async (data: any) => {
    try {
      console.log('Creating group chat:', data);
      // Implementation for creating group chat
      message.success('Group chat created!');
      setIsNewChatModalOpen(false);
      // loadConversations(); // Refresh conversations - removed
    } catch (error) {
      console.error('Error creating group chat:', error);
      message.error('Failed to create group chat');
    }
  };

  const handleCreateDM = async (recipientId: string) => {
    try {
      console.log('Creating DM with:', recipientId);
      // Implementation for creating direct message
      message.success('Direct message started!');
      setIsNewChatModalOpen(false);
      // loadConversations(); // Refresh conversations - removed
    } catch (error) {
      console.error('Error creating DM:', error);
      message.error('Failed to create direct message');
    }
  };

  const handleConversationSelect = (conversation: Conversation) => {
    console.log('Selected conversation:', conversation);
    setSelectedConversation(conversation);
  };

  return (
    <div className="chat-page">
      {conversationId && loading ? (
        <div className="chat-loading">
          <div className="loading-content">
            <div className="loading-spinner">
              <MessageOutlined className="loading-icon" />
            </div>
            <Text className="loading-text">Loading conversation...</Text>
          </div>
        </div>
      ) : selectedConversation ? (
        <>
          {/* Chat Header */}
          <ChatHeader
            conversation={selectedConversation}
            onBack={() => window.location.href = '/chat'}
          />

          {/* Messages */}
          <div className="messages-container">
            <MessageList
              messages={messages}
              currentUserId={mockUser.id}
              conversation={selectedConversation}
            />
          </div>

          {/* Message Input */}
          <div className="message-input-container">
            <div className="input-wrapper">
              <TextArea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                autoSize={{ minRows: 1, maxRows: 4 }}
                onPressEnter={(e) => {
                  if (!e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="message-textarea"
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="send-button"
                size="large"
              >
                Send
              </Button>
            </div>
          </div>
        </>
      ) : (
        /* Welcome Screen */
        <div className="welcome-screen">
          <div className="welcome-content">
            <div className="welcome-icon">
              <MessageOutlined />
            </div>
            <Title level={2} className="welcome-title">Welcome to Student Chat</Title>
            <Text className="welcome-subtitle">
              Select a conversation from the left panel to start chatting with your students
            </Text>
            <div className="welcome-actions">
              <Button
                type="primary"
                icon={<MessageOutlined />}
                onClick={() => window.location.href = '/students-chat'}
                size="large"
                className="browse-button"
              >
                Browse Students
              </Button>
              <Button
                type="default"
                icon={<MessageOutlined />}
                onClick={handleNewChat}
                size="large"
                className="new-chat-button"
              >
                Start New Chat
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* New Chat Modal */}
      <NewChatModal
        open={isNewChatModalOpen}
        onCancel={() => setIsNewChatModalOpen(false)}
        onCreateGroup={handleCreateGroup}
        onCreateDM={handleCreateDM}
        currentUserId={mockUser.id}
      />

      <style jsx>{`
        .chat-page {
          height: 100%;
          display: flex;
          flex-direction: column;
          background: white;
        }

        .chat-loading {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8fafc;
        }

        .loading-content {
          text-align: center;
          padding: 40px;
        }

        .loading-spinner {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          animation: pulse 2s infinite;
        }

        .loading-icon {
          font-size: 36px;
          color: white;
        }

        .loading-text {
          font-size: 16px;
          color: #64748b;
          font-weight: 500;
        }

        .messages-container {
          flex: 1;
          overflow: hidden;
          background: #f8fafc;
        }

        .message-input-container {
          padding: 20px;
          border-top: 1px solid #e2e8f0;
          background: white;
        }

        .input-wrapper {
          display: flex;
          gap: 12px;
          align-items: flex-end;
        }

        .message-textarea {
          flex: 1;
          border-radius: 8px;
          border: 1px solid #d1d5db;
          resize: none;
          font-size: 14px;
          line-height: 1.5;
        }

        .message-textarea:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .send-button {
          height: 44px;
          padding: 0 20px;
          border-radius: 8px;
          font-weight: 600;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
        }

        .send-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .welcome-screen {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          padding: 40px;
        }

        .welcome-content {
          text-align: center;
          max-width: 500px;
        }

        .welcome-icon {
          width: 120px;
          height: 120px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 32px;
          box-shadow: 0 20px 40px rgba(102, 126, 234, 0.2);
        }

        .welcome-icon .anticon {
          font-size: 60px;
          color: white;
        }

        .welcome-title {
          color: #1e293b;
          margin-bottom: 16px;
          font-weight: 700;
        }

        .welcome-subtitle {
          color: #64748b;
          font-size: 16px;
          line-height: 1.6;
          margin-bottom: 32px;
          display: block;
        }

        .welcome-actions {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .browse-button {
          height: 48px;
          padding: 0 32px;
          font-size: 16px;
          font-weight: 600;
          border-radius: 8px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
        }

        .browse-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }

        .new-chat-button {
          height: 48px;
          padding: 0 32px;
          font-size: 16px;
          font-weight: 600;
          border-radius: 8px;
          border: 2px solid #667eea;
          color: #667eea;
        }

        .new-chat-button:hover {
          background: #667eea;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.7);
          }
          70% {
            transform: scale(1.05);
            box-shadow: 0 0 0 10px rgba(102, 126, 234, 0);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(102, 126, 234, 0);
          }
        }
      `}</style>
    </div>
  );
};

export default Chat;
