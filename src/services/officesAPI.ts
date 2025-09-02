import { 
    OfficeMeeting, 
    CreateMeetingRequest, 
    UpdateMeetingRequest, 
    MeetingRecording, 
    UserStorage,
    OfficeMeetingsResponse,
    JoinMeetingResponse,
    MeetingSearchFilters
} from '../types/offices';

const API_BASE_URL = 'http://103.189.173.7:8080/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

// Mock data for development
const mockMeetings: OfficeMeeting[] = [
    {
        id: '1',
        title: 'Team Standup Meeting',
        start_time: '2024-01-15T09:00:00Z',
        end_time: '2024-01-15T09:30:00Z',
        is_recurring: true,
        status: 'SCHEDULED',
        meeting_type: 'AD_HOC',
        max_participants: 15,
        description: 'Daily team standup to discuss progress and blockers',
        waiting_room_enabled: true,
        recording_enabled: false,
        auto_mute_participants: true,
        created_at: '2024-01-10T08:00:00Z',
        updated_at: '2024-01-10T08:00:00Z',
        host: {
            id: 'user1',
            first_name: 'John',
            last_name: 'Doe',
            username: 'johndoe',
            avatar_url: '/pic/user-avatar.jpg'
        },
        participants: []
    },
    {
        id: '2',
        title: 'Project Review Session',
        start_time: '2024-01-15T14:00:00Z',
        end_time: '2024-01-15T15:00:00Z',
        is_recurring: false,
        status: 'ONGOING',
        meeting_type: 'STUDY_GROUP',
        max_participants: 8,
        description: 'Review of Q4 project deliverables and planning for Q1',
        waiting_room_enabled: true,
        recording_enabled: true,
        auto_mute_participants: false,
        created_at: '2024-01-12T10:00:00Z',
        updated_at: '2024-01-15T14:00:00Z',
        host: {
            id: 'user2',
            first_name: 'Jane',
            last_name: 'Smith',
            username: 'janesmith',
            avatar_url: '/pic/user-avatar.jpg'
        },
        participants: []
    }
];

const mockRecordings: MeetingRecording[] = [
    {
        id: 'rec1',
        meeting_id: '1',
        recording_url: 'https://storage.example.com/recordings/rec1.mp4',
        file_size: 256000000, // 256 MB
        duration_seconds: 1800, // 30 minutes
        recording_quality: 'HD',
        recording_format: 'MP4',
        recorded_at: '2024-01-14T09:00:00Z',
        processed_at: '2024-01-14T09:05:00Z',
        status: 'READY',
        storage_location: 'cloud',
        is_archived: false,
        created_at: '2024-01-14T09:00:00Z',
        updated_at: '2024-01-14T09:05:00Z'
    },
    {
        id: 'rec2',
        meeting_id: '2',
        recording_url: 'https://storage.example.com/recordings/rec2.mp4',
        file_size: 512000000, // 512 MB
        duration_seconds: 3600, // 1 hour
        recording_quality: 'HD',
        recording_format: 'MP4',
        recorded_at: '2024-01-13T14:00:00Z',
        processed_at: '2024-01-13T14:10:00Z',
        status: 'READY',
        storage_location: 'cloud',
        is_archived: false,
        created_at: '2024-01-13T14:00:00Z',
        updated_at: '2024-01-13T14:10:00Z'
    }
];

const mockUserStorage: UserStorage = {
    user_id: 'user1',
    total_stimit: 107374182400, // 100 GB
    used_storage: 21474836480, // 20 GB
    available_storage: 85899345920, // 80 GB
    storage_plan: 'PREMIUM',
    monthly_cost: 29.99,
    next_billing_date: '2024-02-15T00:00:00Z',
    recordings_storage: 16106127360, // 15 GB
    documents_storage: 5368709120, // 5 GB
    other_files_storage: 0,
    max_recording_duration: 120, // 2 hours
    max_file_size: 1073741824, // 1 GB
    retention_period_days: 365,
    updated_at: '2024-01-15T00:00:00Z'
};

// Main Offices API
export const officesAPI = {
    // Create a new meeting
    createMeeting: async (meetingData: CreateMeetingRequest): Promise<OfficeMeeting> => {
        try {
            const response = await fetch(`${API_BASE_URL}/offices/meetings`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(meetingData)
            });

            if (!response.ok) {
                throw new Error('Failed to create meeting');
            }

            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error creating meeting:', error);
            // Return mock data for development
            const newMeeting: OfficeMeeting = {
                id: Date.now().toString(),
                ...meetingData,
                is_recurring: meetingData.is_recurring || false,
                status: 'SCHEDULED',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                host: {
                    id: 'user1',
                    first_name: 'John',
                    last_name: 'Doe',
                    username: 'johndoe',
                    avatar_url: '/pic/user-avatar.jpg'
                },
                participants: [],
                recordings: []
            };
            mockMeetings.push(newMeeting);
            return newMeeting;
        }
    },

    // Get user's meetings with filters
    getMyMeetings: async (filters: MeetingSearchFilters = {}): Promise<OfficeMeetingsResponse> => {
        try {
            const queryParams = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined) {
                    queryParams.append(key, value.toString());
                }
            });

            const response = await fetch(`${API_BASE_URL}/offices/meetings?${queryParams}`, {
                method: 'GET',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to fetch meetings');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching meetings:', error);
            // Return mock data for development
            return {
                data: mockMeetings,
                total: mockMeetings.length,
                page: 1,
                limit: 10,
                total_pages: 1
            };
        }
    },

    // Get meeting by ID
    getMeetingById: async (meetingId: string): Promise<OfficeMeeting> => {
        try {
            const response = await fetch(`${API_BASE_URL}/offices/meetings/${meetingId}`, {
                method: 'GET',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to fetch meeting');
            }

            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error fetching meeting:', error);
            // Return mock data for development
            const meeting = mockMeetings.find(m => m.id === meetingId);
            if (!meeting) {
                throw new Error('Meeting not found');
            }
            return meeting;
        }
    },

    // Update meeting
    updateMeeting: async (meetingId: string, meetingData: UpdateMeetingRequest): Promise<OfficeMeeting> => {
        try {
            const response = await fetch(`${API_BASE_URL}/offices/meetings/${meetingId}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(meetingData)
            });

            if (!response.ok) {
                throw new Error('Failed to update meeting');
            }

            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error updating meeting:', error);
            // Update mock data for development
            const meetingIndex = mockMeetings.findIndex(m => m.id === meetingId);
            if (meetingIndex === -1) {
                throw new Error('Meeting not found');
            }
            mockMeetings[meetingIndex] = {
                ...mockMeetings[meetingIndex],
                ...meetingData,
                updated_at: new Date().toISOString()
            };
            return mockMeetings[meetingIndex];
        }
    },

    // Delete meeting
    deleteMeeting: async (meetingId: string): Promise<void> => {
        try {
            const response = await fetch(`${API_BASE_URL}/offices/meetings/${meetingId}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to delete meeting');
            }
        } catch (error) {
            console.error('Error deleting meeting:', error);
            // Remove from mock data for development
            const meetingIndex = mockMeetings.findIndex(m => m.id === meetingId);
            if (meetingIndex !== -1) {
                mockMeetings.splice(meetingIndex, 1);
            }
        }
    },

    // Join meeting
    joinMeeting: async (meetingId: string): Promise<JoinMeetingResponse> => {
        try {
            const response = await fetch(`${API_BASE_URL}/offices/meetings/${meetingId}/join`, {
                method: 'POST',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to join meeting');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error joining meeting:', error);
            // Return mock data for development
            const meeting = mockMeetings.find(m => m.id === meetingId);
            if (!meeting) {
                throw new Error('Meeting not found');
            }
            return {
                meeting,
                webrtc_config: {
                    signaling_server: 'wss://signaling.example.com',
                    ice_servers: [
                        { urls: 'stun:stun.l.google.com:19302' }
                    ],
                    room_id: meetingId
                },
                participants: [],
                chat_history: []
            };
        }
    }
};

// Recording API
export const recordingAPI = {
    // Get meeting recordings
    getMeetingRecordings: async (meetingId: string): Promise<MeetingRecording[]> => {
        try {
            const response = await fetch(`${API_BASE_URL}/offices/recordings?meeting_id=${meetingId}`, {
                method: 'GET',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to fetch recordings');
            }

            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error fetching recordings:', error);
            // Return mock data for development
            return mockRecordings.filter(r => r.meeting_id === meetingId);
        }
    },

    // Start recording
    startRecording: async (meetingId: string, quality: 'HD' | 'SD' | 'AUDIO_ONLY'): Promise<MeetingRecording> => {
        try {
            const response = await fetch(`${API_BASE_URL}/offices/recordings/start`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ meeting_id: meetingId, quality })
            });

            if (!response.ok) {
                throw new Error('Failed to start recording');
            }

            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error starting recording:', error);
            throw error;
        }
    },

    // Stop recording
    stopRecording: async (meetingId: string): Promise<void> => {
        try {
            const response = await fetch(`${API_BASE_URL}/offices/recordings/stop`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ meeting_id: meetingId })
            });

            if (!response.ok) {
                throw new Error('Failed to stop recording');
            }
        } catch (error) {
            console.error('Error stopping recording:', error);
            throw error;
        }
    }
};

// Storage API
export const storageAPI = {
    // Get user storage info
    getUserStorage: async (): Promise<UserStorage> => {
        try {
            const response = await fetch(`${API_BASE_URL}/offices/storage`, {
                method: 'GET',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to fetch storage info');
            }

            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error fetching storage info:', error);
            // Return mock data for development
            return mockUserStorage;
        }
    },

    // Upgrade storage plan
    upgradeStoragePlan: async (planId: string): Promise<UserStorage> => {
        try {
            const response = await fetch(`${API_BASE_URL}/offices/storage/upgrade`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ plan_id: planId })
            });

            if (!response.ok) {
                throw new Error('Failed to upgrade storage plan');
            }

            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error upgrading storage plan:', error);
            throw error;
        }
    }
};

// Chat API
export const chatAPI = {
    // Get meeting chat messages
    getMeetingChat: async (meetingId: string): Promise<any[]> => {
        try {
            const response = await fetch(`${API_BASE_URL}/offices/chat/${meetingId}`, {
                method: 'GET',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to fetch chat messages');
            }

            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error fetching chat messages:', error);
            return [];
        }
    },

    // Send chat message
    sendMessage: async (meetingId: string, message: string): Promise<any> => {
        try {
            const response = await fetch(`${API_BASE_URL}/offices/chat/${meetingId}`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ message })
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    }
};

// WebRTC API
export const webrtcAPI = {
    // Get WebRTC configuration
    getWebRTCConfig: async (meetingId: string): Promise<any> => {
        try {
            const response = await fetch(`${API_BASE_URL}/offices/webrtc/config/${meetingId}`, {
                method: 'GET',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to get WebRTC config');
            }

            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error getting WebRTC config:', error);
            return {
                signaling_server: 'wss://signaling.example.com',
                ice_servers: [
                    { urls: 'stun:stun.l.google.com:19302' }
                ],
                room_id: meetingId
            };
        }
    }
};

// Statistics API
export const statsAPI = {
    // Get meeting statistics
    getMeetingStats: async (meetingId: string): Promise<any> => {
        try {
            const response = await fetch(`${API_BASE_URL}/offices/stats/${meetingId}`, {
                method: 'GET',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to get meeting stats');
            }

            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error getting meeting stats:', error);
            return {
                meeting_id: meetingId,
                total_participants: 5,
                total_duration: 1800,
                recording_count: 1,
                chat_message_count: 25
            };
        }
    }
};

// Auto-create API for class-based meetings
export const autoCreateAPI = {
    // Create meeting from class schedule
    createFromClass: async (classId: string, date: string): Promise<OfficeMeeting> => {
        try {
            const response = await fetch(`${API_BASE_URL}/offices/meetings/auto-create`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ class_id: classId, date })
            });

            if (!response.ok) {
                throw new Error('Failed to auto-create meeting');
            }

            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error auto-creating meeting:', error);
            throw error;
        }
    }
};

// Invitation API
export const invitationAPI = {
    // Send meeting invitation
    sendInvitation: async (meetingId: string, userIds: string[]): Promise<any[]> => {
        try {
            const response = await fetch(`${API_BASE_URL}/offices/invitations`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ meeting_id: meetingId, user_ids: userIds })
            });

            if (!response.ok) {
                throw new Error('Failed to send invitations');
            }

            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error sending invitations:', error);
            throw error;
        }
    },

    // Get meeting invitations
    getMeetingInvitations: async (meetingId: string): Promise<any[]> => {
        try {
            const response = await fetch(`${API_BASE_URL}/offices/invitations?meeting_id=${meetingId}`, {
                method: 'GET',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to get invitations');
            }

            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error getting invitations:', error);
            return [];
        }
    }
}; 