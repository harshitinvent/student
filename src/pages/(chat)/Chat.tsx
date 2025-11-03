import React, { useState, useEffect, useRef } from 'react';
import { Typography, Button, Input, message, Drawer, Badge } from 'antd';
import { SendOutlined, MessageOutlined, TeamOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router';
import MessageList from '../../components/features/chat/MessageList';
import MessageListWhatsApp from '../../components/features/chat/MessageListWhatsApp';
import ChatHeader from '../../components/features/chat/ChatHeader';
import ChatHeaderWhatsApp from '../../components/features/chat/ChatHeaderWhatsApp';
import MessageInput from '../../components/features/chat/MessageInput';
import NewChatModal from '../../components/features/chat/NewChatModal';
import ParticipantList from '../../components/features/chat/ParticipantList';
import ChatParticipantsList from '../../components/features/chat/ChatParticipantsList';
import NotificationManager from '../../components/features/chat/NotificationManager';
import { useMessageNotifications } from '../../utils/hooks/useMessageNotifications';
import {
  sendMessage,
  getConversations,
  subscribeToMessages,
  subscribeToConversation,
  markMessagesAsRead,
  createDMConversation,
  createGroupConversation
} from '../../services/chatAPI';
import { useUserContext } from '../../providers/user';
import type { Conversation, Message, CreateGroupRequest } from '../../types/chat';
import '../../styles/chat.css';
import '../../styles/chat-custom.css';

const { Text, Title } = Typography;
const { TextArea } = Input;

const Chat: React.FC = () => {
  const params = useParams();
  const navigate = useNavigate();
  const conversationId = params.id;
  const { type: userType, isAuthenticated } = useUserContext();
  const { notifications, addNotification, removeNotification } = useMessageNotifications();

  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [participantsDrawerOpen, setParticipantsDrawerOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [lastMessageTimestamp, setLastMessageTimestamp] = useState<Date | null>(null);
  const [globalLastMessageTimestamps, setGlobalLastMessageTimestamps] = useState<Record<string, Date>>({});

  // Refs for real-time subscriptions
  const messagesUnsubscribeRef = useRef<(() => void) | null>(null);
  const conversationUnsubscribeRef = useRef<(() => void) | null>(null);
  const globalMessagesUnsubscribeRef = useRef<(() => void)[] | null>(null);

  // Get current user info
  const getCurrentUser = () => {
    const userEmail = localStorage.getItem('userEmail');
    const userType = localStorage.getItem('userType');
    const token = localStorage.getItem('token');

    // Use the same ID logic as chatAPI for consistency
    let userId = 'admin_admin_yopmail_com'; // Default fallback

    // First try to get actual user ID from userData (same as chatAPI)
    try {
      const userDataStr = localStorage.getItem('userData');
      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        if (userData.id) {
          userId = userData.id.toString();
        }
      }
    } catch (error) {
      console.log('Error parsing userData in getCurrentUser:', error);
    }

    // Fallback to email-based ID if userData not found
    if (userId === 'admin_admin_yopmail_com' && userType && userEmail) {
      userId = `${userType.toLowerCase()}_${userEmail.replace('@', '_').replace('.', '_')}`;
    }

    return {
      id: userId,
      name: userType === 'Admin' ? 'Admin User' : 'Current User',
      email: userEmail || 'admin@yopmail.com',
      type: userType || 'Admin',
      isAuthenticated: !!token
    };
  };

  const currentUser = getCurrentUser();

  // Debug: Log current user info
  console.log('=== CURRENT USER DEBUG ===');
  console.log('Current user ID:', currentUser.id);
  console.log('Current user email:', currentUser.email);
  console.log('Current user type:', currentUser.type);

  // Check if Firebase is available and working
  const checkFirebaseAvailability = async (): Promise<boolean> => {
    try {
      // Try to get conversations to test Firebase connectivity
      await getConversations();
      return true;
    } catch (error) {
      console.log('Firebase not available:', error);
      return false;
    }
  };

  // Create fallback conversation based on ID
  const createFallbackConversation = (id: string): Conversation => {
    console.log('Creating fallback conversation for ID:', id);

    // Determine conversation type and details based on ID
    // Handle specific known conversation IDs
    const isGroupChat = id.includes('group') || id.includes('CS') || id.includes('fM6iMHoKla4n2JJwJC2q') || id.includes('fff') || id.length > 10;

    if (isGroupChat) {
      // Check for specific conversation IDs to match the image
      let title = 'CS0104';
      if (id.includes('fff') || id === '11eeTT8cfNJLY7QoCHOC') {
        title = 'fff';
      }

      // Check if this is CS0104 conversation
      const isCS0104 = id.includes('CS') || id === 'fM6iMHoKla4n2JJwJC2q' || title === 'CS0104';

      return {
        id: id,
        type: 'group',
        title: title,
        participants: [currentUser.id, 'user-1', 'user-2', 'user-3'],
        lastMessage: isCS0104 ? {
          id: 'last-cs0104',
          conversationId: id,
          senderId: 'user-1',
          content: 'hghggh',
          contentType: 'text',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
          isRead: true,
          senderName: 'Unknown User'
        } : undefined,
        lastMessageTime: isCS0104 ? new Date(Date.now() - 4 * 60 * 60 * 1000) : undefined,
        unreadCount: 0,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: {
          groupName: title,
          groupDescription: title === 'CS0104' ? 'Computer Science Study Group' : 'Group Chat',
          groupMembers: [
            { id: currentUser.id, name: currentUser.name, email: currentUser.email, isOnline: true },
            { id: 'user-1', name: 'Unknown User', email: 'user1@university.edu', isOnline: true },
            { id: 'user-2', name: 'Unknown User', email: 'user2@university.edu', isOnline: false },
            { id: 'user-3', name: 'Unknown User', email: 'user3@university.edu', isOnline: true }
          ]
        }
      };
    } else {
      // Check if this is a direct chat with Shree
      const isDirectChat = id.includes('chat-with') || id.includes('shree') || id === 'WRv5WNpeTmZLEGt5w5uS';

      if (isDirectChat) {
        return {
          id: id,
          type: 'direct',
          title: 'Chat with Shree kumar',
          participants: [currentUser.id, 'shree-kumar'],
          lastMessage: undefined,
          lastMessageTime: undefined,
          unreadCount: 0,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          metadata: {
            studentName: 'Shree kumar',
            studentEmail: 'shree.kumar@university.edu',
            groupMembers: [
              { id: currentUser.id, name: currentUser.name, email: currentUser.email, isOnline: true },
              { id: 'shree-kumar', name: 'Shree kumar', email: 'shree.kumar@university.edu', isOnline: true }
            ]
          }
        };
      } else {
        return {
          id: id,
          type: 'direct',
          title: 'Shree Kumar',
          participants: [currentUser.id, 'student-1'],
          lastMessage: undefined,
          lastMessageTime: undefined,
          unreadCount: 0,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          metadata: {
            studentName: 'Shree Kumar',
            studentEmail: 'shree.kumar@university.edu',
            groupMembers: [
              { id: currentUser.id, name: currentUser.name, email: currentUser.email, isOnline: true },
              { id: 'student-1', name: 'Shree Kumar', email: 'shree.kumar@university.edu', isOnline: true }
            ]
          }
        };
      }
    }
  };

  // Load mock messages for fallback conversation
  const loadMockMessages = (conversationId: string) => {
    console.log('Loading mock messages for conversation:', conversationId);

    // Check conversation type to match the screenshot
    const isDirectChat = conversationId.includes('chat-with') || conversationId.includes('shree') || conversationId === 'WRv5WNpeTmZLEGt5w5uS';
    const isFffConversation = conversationId.includes('fff') || conversationId === '11eeTT8cfNJLY7QoCHOC';
    const isCS0104Conversation = conversationId.includes('CS') || conversationId === 'fM6iMHoKla4n2JJwJC2q';

    let mockMessages: Message[] = [];

    if (isCS0104Conversation) {
      // Messages for CS0104 conversation from the screenshot
      mockMessages = [
        {
          id: 'msg-1',
          conversationId: conversationId,
          senderId: 'user-1',
          content: 'HI Everyone',
          contentType: 'text',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 32 * 60 * 1000), // 12:32 PM
          isRead: true,
          senderName: 'Group Member'
        },
        {
          id: 'msg-2',
          conversationId: conversationId,
          senderId: 'user-2',
          content: 'How are you',
          contentType: 'text',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 33 * 60 * 1000), // 12:33 PM
          isRead: true,
          senderName: 'Group Member'
        },
        {
          id: 'msg-3',
          conversationId: conversationId,
          senderId: currentUser.id,
          content: 'bbb',
          contentType: 'text',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 12:00 PM
          isRead: true,
          senderName: currentUser.name
        },
        {
          id: 'msg-4',
          conversationId: conversationId,
          senderId: currentUser.id,
          content: 'www',
          contentType: 'text',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 29 * 60 * 1000), // 12:29 PM
          isRead: true,
          senderName: currentUser.name
        },
        {
          id: 'msg-5',
          conversationId: conversationId,
          senderId: 'user-3',
          content: 'GYU',
          contentType: 'text',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 - 11 * 60 * 1000), // 11:49 AM
          isRead: true,
          senderName: 'Group Member'
        },
        {
          id: 'msg-6',
          conversationId: conversationId,
          senderId: 'user-3',
          content: 'GYUcvcvc',
          contentType: 'text',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 - 11 * 60 * 1000), // 11:49 AM
          isRead: true,
          senderName: 'Group Member'
        },
        {
          id: 'msg-7',
          conversationId: conversationId,
          senderId: currentUser.id,
          content: 'Hiii',
          contentType: 'text',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 - 12 * 60 * 1000), // 11:48 AM
          isRead: true,
          senderName: currentUser.name
        }
      ];
    } else if (isDirectChat) {
      // Messages for "Chat with Shree kumar" conversation from the screenshot
      mockMessages = [
        {
          id: 'msg-1',
          conversationId: conversationId,
          senderId: 'shree-kumar',
          content: 'hii',
          contentType: 'text',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 3 * 60 * 1000), // 3 days ago at 03:01 AM
          isRead: true,
          senderName: 'S'
        },
        {
          id: 'msg-2',
          conversationId: conversationId,
          senderId: currentUser.id,
          content: 'hello',
          contentType: 'text',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 1000), // 3 days ago at 03:02 AM
          isRead: true,
          senderName: currentUser.name
        },
        {
          id: 'msg-3',
          conversationId: conversationId,
          senderId: 'shree-kumar',
          content: 'hii',
          contentType: 'text',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 1 * 60 * 1000), // 3 days ago at 03:02 AM
          isRead: true,
          senderName: 'S'
        },
        {
          id: 'msg-4',
          conversationId: conversationId,
          senderId: 'shree-kumar',
          content: 'Hi SHree',
          contentType: 'text',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000 + 32 * 60 * 1000), // 3 days ago at 12:32 PM
          isRead: true,
          senderName: 'S'
        },
        {
          id: 'msg-5',
          conversationId: conversationId,
          senderId: currentUser.id,
          content: 'Hi Admin',
          contentType: 'text',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000 + 32 * 60 * 1000), // 3 days ago at 12:32 PM
          isRead: true,
          senderName: currentUser.name
        },
        {
          id: 'msg-6',
          conversationId: conversationId,
          senderId: 'shree-kumar',
          content: 'hii',
          contentType: 'text',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000 + 33 * 60 * 1000), // 3 days ago at 12:33 PM
          isRead: true,
          senderName: 'S'
        }
      ];
    } else if (isFffConversation) {
      // Messages for "fff" conversation from the image
      mockMessages = [
        {
          id: 'msg-1',
          conversationId: conversationId,
          senderId: 'user-1',
          content: 'hi',
          contentType: 'text',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 3 days ago at 10:48 AM
          isRead: true,
          senderName: 'Group Member'
        },
        {
          id: 'msg-2',
          conversationId: conversationId,
          senderId: currentUser.id,
          content: 'bbb',
          contentType: 'text',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000), // 3 days ago at 12:00 PM
          isRead: true,
          senderName: currentUser.name
        },
        {
          id: 'msg-3',
          conversationId: conversationId,
          senderId: 'user-2',
          content: 'gf',
          contentType: 'text',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 3.5 * 60 * 60 * 1000), // 3 days ago at 11:52 AM
          isRead: true,
          senderName: 'Group Member'
        },
        {
          id: 'msg-4',
          conversationId: conversationId,
          senderId: currentUser.id,
          content: 'vvv',
          contentType: 'text',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000), // 3 days ago at 12:29 PM
          isRead: true,
          senderName: currentUser.name
        },
        {
          id: 'msg-5',
          conversationId: conversationId,
          senderId: 'user-3',
          content: 'HI Everyone',
          contentType: 'text',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 4.5 * 60 * 60 * 1000), // 3 days ago at 12:32 PM
          isRead: true,
          senderName: 'Group Member'
        }
      ];
    } else {
      // Default messages for other conversations
      mockMessages = [
        {
          id: 'msg-1',
          conversationId: conversationId,
          senderId: currentUser.id,
          content: 'Hi',
          contentType: 'text',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago (11:40 AM)
          isRead: true,
          senderName: currentUser.name
        },
        {
          id: 'msg-2',
          conversationId: conversationId,
          senderId: 'user-1',
          content: 'fvfg',
          contentType: 'text',
          timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000), // 1.5 hours ago (12:12 PM)
          isRead: true,
          senderName: 'Unknown User'
        },
        {
          id: 'msg-3',
          conversationId: conversationId,
          senderId: currentUser.id,
          content: 'hi',
          contentType: 'text',
          timestamp: new Date(Date.now() - 1.4 * 60 * 60 * 1000), // 1.4 hours ago (12:11 PM)
          isRead: true,
          senderName: currentUser.name
        },
        {
          id: 'msg-4',
          conversationId: conversationId,
          senderId: 'user-1',
          content: 'hghggh',
          contentType: 'text',
          timestamp: new Date(Date.now() - 1.3 * 60 * 60 * 1000), // 1.3 hours ago (12:12 PM)
          isRead: true,
          senderName: 'Unknown User'
        },
        {
          id: 'msg-5',
          conversationId: conversationId,
          senderId: 'user-2',
          content: 'vbbvb',
          contentType: 'text',
          timestamp: new Date(Date.now() - 1.2 * 60 * 60 * 1000), // 1.2 hours ago (12:24 PM)
          isRead: true,
          senderName: 'Unknown User'
        }
      ];
    }

    setMessages(mockMessages);
    console.log('Loaded mock messages:', mockMessages);
  };



  useEffect(() => {
    console.log('Chat component mounted/updated');
    console.log('conversationId:', conversationId);
    console.log('isAuthenticated:', isAuthenticated);

    if (conversationId) {
      console.log('Loading conversation with ID:', conversationId);
      loadConversation(conversationId);
    } else {
      console.log('No conversation ID provided, showing welcome screen');
      setSelectedConversation(null);
      setMessages([]);
    }

    // Set up global message listener for notifications from all conversations
    const setupGlobalMessageListener = async () => {
      try {
        // Get all conversations for the current user
        const conversations = await getConversations();
        console.log('Setting up notifications for', conversations.length, 'conversations');

        // Set up message listeners for all conversations
        conversations.forEach(conv => {
          // Only set up listener if it's not the current conversation (current one is handled separately)
          if (conv.id !== conversationId) {
            console.log('Setting up notification listener for conversation:', conv.id);

            const unsubscribe = subscribeToMessages(conv.id, (messages) => {
              if (messages.length > 0) {
                const latestMessage = messages[messages.length - 1];
                const latestMessageTime = new Date(latestMessage.timestamp);
                const conversationId = conv.id;

                // Get the last timestamp we saw for this conversation
                const lastSeenTime = globalLastMessageTimestamps[conversationId];

                // Show notification only if this message is truly NEW and from someone else
                console.log('=== GLOBAL SENDER ID COMPARISON ===');
                console.log('Message sender ID:', latestMessage.senderId);
                console.log('Current user ID:', currentUser.id);
                console.log('Are they different?', latestMessage.senderId !== currentUser.id);
                console.log('Message time:', latestMessageTime);
                console.log('Last seen time:', lastSeenTime);

                if (latestMessage.senderId !== currentUser.id &&
                  (!lastSeenTime || latestMessageTime > lastSeenTime)) {

                  let senderName = 'Unknown User';
                  if (conv.metadata?.studentName) {
                    senderName = conv.metadata.studentName;
                  } else if (conv.title && conv.title !== 'Direct Message') {
                    senderName = conv.title.replace('Chat with ', '');
                  } else if (conv.type === 'direct') {
                    const otherParticipant = conv.participants.find(p => p !== currentUser.id);
                    if (otherParticipant) {
                      senderName = `User ${otherParticipant}`;
                    }
                  }

                  console.log('=== GLOBAL NOTIFICATION ===');
                  console.log('Message from other chat:', latestMessage.content);
                  console.log('From:', senderName);
                  console.log('Conversation:', conv.title);
                  console.log('Message time:', latestMessageTime);
                  console.log('Last seen time:', lastSeenTime);

                  addNotification(latestMessage, conv, senderName);
                }

                // Update the last seen timestamp for this conversation
                setGlobalLastMessageTimestamps(prev => ({
                  ...prev,
                  [conversationId]: latestMessageTime
                }));
              }
            });

            // Store unsubscribe function
            if (!globalMessagesUnsubscribeRef.current) {
              globalMessagesUnsubscribeRef.current = [];
            }
            globalMessagesUnsubscribeRef.current?.push(unsubscribe);
          }
        });

        console.log('Global message listener setup completed');
      } catch (error) {
        console.error('Error setting up global message listener:', error);
      }
    };

    setupGlobalMessageListener();

    // Cleanup subscriptions on unmount
    return () => {
      if (messagesUnsubscribeRef.current) {
        messagesUnsubscribeRef.current();
      }
      if (conversationUnsubscribeRef.current) {
        conversationUnsubscribeRef.current();
      }
      if (globalMessagesUnsubscribeRef.current) {
        globalMessagesUnsubscribeRef.current.forEach(unsubscribe => unsubscribe());
        globalMessagesUnsubscribeRef.current = null;
      }
    };
  }, [conversationId, isAuthenticated, addNotification]);


  const loadConversation = async (id: string) => {
    try {
      setLoading(true);
      console.log('Loading conversation with ID:', id);

      // Reset the last message timestamp for current conversation
      setLastMessageTimestamp(null);

      // Cleanup previous subscriptions
      if (messagesUnsubscribeRef.current) {
        messagesUnsubscribeRef.current();
      }
      if (conversationUnsubscribeRef.current) {
        conversationUnsubscribeRef.current();
      }

      // Try to load conversation from Firebase
      try {
        console.log('=== FIREBASE CHAT DEBUG ===');
        console.log('Looking for conversation ID:', id);
        console.log('Current user:', currentUser);
        console.log('Attempting to load conversations from Firebase...');

        const conversations = await getConversations();
        console.log('Successfully loaded conversations:', conversations.length, 'conversations');
        console.log('Conversation details:', conversations.map(c => ({ id: c.id, title: c.title, type: c.type })));

        const conversation = conversations.find(c => c.id === id);
        console.log('Found conversation:', conversation ? 'YES' : 'NO');
        if (conversation) {
          console.log('Conversation details:', conversation);
        }

        if (conversation) {
          console.log('Found matching conversation:', conversation);
          setSelectedConversation(conversation);

          // Subscribe to real-time conversation updates
          try {
            conversationUnsubscribeRef.current = subscribeToConversation(id, (updatedConversation) => {
              console.log('Conversation updated:', updatedConversation);
              setSelectedConversation(updatedConversation);
            });
          } catch (subError) {
            console.warn('Could not subscribe to conversation updates:', subError);
          }

          // Subscribe to real-time messages
          try {
            console.log('Setting up message subscription for conversation:', id);
            messagesUnsubscribeRef.current = subscribeToMessages(id, (newMessages) => {
              console.log('=== MESSAGES LOADED ===');
              console.log('Conversation ID:', id);
              console.log('Messages count:', newMessages.length);
              console.log('Messages:', newMessages);

              // Sort messages by timestamp (oldest first for display)
              const sortedMessages = newMessages.sort((a, b) =>
                new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
              );

              // Check for truly NEW messages (not just initial load)
              if (lastMessageTimestamp && sortedMessages.length > 0) {
                const latestMessage = sortedMessages[sortedMessages.length - 1];
                const latestMessageTime = new Date(latestMessage.timestamp);

                // Only show notification if this message is newer than the last one we saw
                console.log('=== SENDER ID COMPARISON ===');
                console.log('Message sender ID:', latestMessage.senderId);
                console.log('Current user ID:', currentUser.id);
                console.log('Are they different?', latestMessage.senderId !== currentUser.id);

                if (latestMessageTime > lastMessageTimestamp && latestMessage.senderId !== currentUser.id) {
                  // Get sender name from conversation metadata or use a default
                  let senderName = 'Unknown User';
                  if (conversation.metadata?.studentName) {
                    senderName = conversation.metadata.studentName;
                  } else if (conversation.title && conversation.title !== 'Direct Message') {
                    senderName = conversation.title.replace('Chat with ', '');
                  } else if (conversation.type === 'direct') {
                    // For direct messages, try to get the other participant's name
                    const otherParticipant = conversation.participants.find(p => p !== currentUser.id);
                    if (otherParticipant) {
                      senderName = `User ${otherParticipant}`;
                    }
                  }

                  console.log('=== NEW MESSAGE NOTIFICATION ===');
                  console.log('Message:', latestMessage.content);
                  console.log('From:', senderName);
                  console.log('Conversation:', conversation.title);
                  console.log('Message time:', latestMessageTime);
                  console.log('Last seen time:', lastMessageTimestamp);
                  console.log('Is current conversation:', conversationId === id);

                  // Show notification for truly new messages from others
                  addNotification(latestMessage, conversation, senderName);
                }
              }

              // Update the last message timestamp
              if (sortedMessages.length > 0) {
                const latestMessage = sortedMessages[sortedMessages.length - 1];
                setLastMessageTimestamp(new Date(latestMessage.timestamp));
              }

              setMessages(sortedMessages);

              // Mark messages as read when they arrive
              const unreadMessages = sortedMessages.filter(msg =>
                !msg.isRead && msg.senderId !== currentUser.id
              );

              if (unreadMessages.length > 0) {
                markMessagesAsRead(id, unreadMessages.map(msg => msg.id));
              }
            });
          } catch (subError) {
            console.warn('Could not subscribe to messages:', subError);
          }

          console.log('Successfully loaded conversation and subscribed to updates');
          return; // Successfully loaded conversation
        } else {
          console.log('Conversation not found in Firebase, ID:', id);
          // No conversation found in Firebase, show "No chat found"
          setSelectedConversation(null);
          setMessages([]);
          setLoading(false);
          return;
        }
      } catch (firebaseError) {
        console.error('Firebase error:', firebaseError);
        console.log('Firebase error during conversation load');
        // Firebase error, show "No chat found"
        setSelectedConversation(null);
        setMessages([]);
        setLoading(false);
        return;
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
      // Messages are now loaded via real-time subscription
      // This function is kept for backward compatibility
    } catch (error) {
      console.error('Error loading messages:', error);
      message.error('Failed to load messages');
      setMessages([]);
    }
  };

  const handleSendMessage = async (messageContent?: string) => {
    const content = messageContent || newMessage.trim();
    if (!content || !selectedConversation || sending) return;

    setNewMessage(''); // Clear input immediately for better UX

    try {
      setSending(true);
      console.log('Sending message:', content);

      await sendMessage({
        conversationId: selectedConversation.id,
        content: content,
        contentType: 'text'
      });

      // Message will be added via real-time subscription
    } catch (error) {
      console.error('Error sending message:', error);
      message.error('Failed to send message. Please try again.');
      // Restore message if sending failed
      setNewMessage(content);
    } finally {
      setSending(false);
    }
  };

  const handleNewChat = () => {
    setIsNewChatModalOpen(true);
  };

  const handleCreateGroup = async (data: CreateGroupRequest) => {
    try {
      console.log('Creating group chat:', data);
      const conversation = await createGroupConversation(data);
      message.success('Group chat created!');
      setIsNewChatModalOpen(false);
      // Navigate to the new conversation
      navigate(`/chat/${conversation.id}`);
    } catch (error) {
      console.error('Error creating group chat:', error);
      message.error('Failed to create group chat');
    }
  };

  const handleCreateDM = async (recipientEmail: string) => {
    try {
      console.log('Creating DM with:', recipientEmail);
      const conversation = await createDMConversation({ recipient_email: recipientEmail });
      message.success('Direct message started!');
      setIsNewChatModalOpen(false);
      // Navigate to the new conversation
      navigate(`/chat/${conversation.id}`);
    } catch (error) {
      console.error('Error creating DM:', error);
      message.error('Failed to create direct message');
    }
  };

  const handleConversationSelect = (conversation: Conversation) => {
    console.log('Selected conversation:', conversation);
    setSelectedConversation(conversation);
  };

  // Debug logging
  console.log('Rendering Chat component:');
  console.log('- conversationId:', conversationId);
  console.log('- loading:', loading);
  console.log('- selectedConversation:', selectedConversation);
  console.log('- messages count:', messages.length);

  return (
    <div className="chat-container">
      <div className="chat-main">
        {conversationId && loading ? (
          <div className="loading-container">
            <div className="loading-icon">
              <MessageOutlined className="text-3xl text-white" />
            </div>
            <Text className="loading-text">Loading conversation...</Text>
          </div>
        ) : selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="chat-header">
              <ChatHeaderWhatsApp
                conversation={selectedConversation}
                onBack={() => navigate('/chat')}
                onShowParticipants={() => setParticipantsDrawerOpen(true)}
              />
            </div>

            {/* Messages */}
            <MessageListWhatsApp
              messages={messages}
              currentUserId={currentUser.id}
              conversation={selectedConversation}
            />

            {/* Message Input */}
            <div className="message-input-container">
              <MessageInput
                onSendMessage={handleSendMessage}
                placeholder="Type a message..."
                disabled={sending}
                loading={sending}
              />
            </div>
          </>
        ) : (
          /* Welcome Screen or No Chat Found */
          <div className="welcome-screen">
            <div className="welcome-icon">
              <MessageOutlined className="text-4xl text-white" />
            </div>
            {conversationId ? (
              <>
                <Title level={1} className="welcome-title">No Chat Found</Title>
                <Text className="welcome-description">
                  The requested chat conversation could not be found. It may have been deleted or you may not have access to it.
                </Text>
              </>
            ) : (
              <>
                <Title level={1} className="welcome-title">Welcome to Student Chat</Title>
                <Text className="welcome-description">
                  Connect with your students through real-time messaging. Start conversations, create groups, and build meaningful relationships.
                </Text>
              </>
            )}


            <div className="welcome-actions">
              <Button
                type="primary"
                icon={<MessageOutlined />}
                onClick={() => navigate('/students-chat')}
                size="large"
                className="welcome-button primary"
              >
                Browse Students
              </Button>
              <Button
                type="default"
                icon={<TeamOutlined />}
                onClick={handleNewChat}
                size="large"
                className="welcome-button secondary"
              >
                Start New Chat
              </Button>

            </div>
          </div>
        )}

        {/* New Chat Modal */}
        <NewChatModal
          open={isNewChatModalOpen}
          onCancel={() => setIsNewChatModalOpen(false)}
          onCreateGroup={handleCreateGroup}
          onCreateDM={handleCreateDM}
          currentUserId={currentUser.id}
        />

        {/* Participants Drawer */}
        <Drawer
          title="Chat Participants"
          placement="right"
          onClose={() => setParticipantsDrawerOpen(false)}
          open={participantsDrawerOpen}
          width={400}
        >
          {selectedConversation && (
            <ChatParticipantsList
              conversation={selectedConversation}
              canManageParticipants={userType === 'Admin'}
            />
          )}
        </Drawer>

        {/* Notification Manager */}
        <NotificationManager
          notifications={notifications}
          onRemoveNotification={removeNotification}
          onOpenChat={(conversationId: string) => navigate(`/chat/${conversationId}`)}
        />
      </div>
    </div>
  );

};

export default Chat;

