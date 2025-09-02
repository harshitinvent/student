// ============================================================================
// OFFICES MODULE TYPES
// ============================================================================

// Core Meeting Object
export interface OfficeMeeting {
    id: string;
    title: string;
    start_time: string;
    end_time: string;
    is_recurring: boolean;
    recurrence_pattern?: string;
    status: 'SCHEDULED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
    meeting_type: 'AD_HOC' | 'CLASS_AUTO' | 'STUDY_GROUP';
    max_participants?: number;
    description?: string;
    waiting_room_enabled: boolean;
    recording_enabled: boolean;
    auto_mute_participants: boolean;
    
    // Integration Links
    related_class_id?: string;
    related_program_id?: string;
    related_year_id?: string;
    
    // Metadata
    created_at: string;
    updated_at: string;
    
    // Related data
    host?: {
        id: string;
        first_name: string;
        last_name: string;
        username: string;
        avatar_url?: string;
    };
    related_class?: {
        id: string;
        section_code: string;
        course_title: string;
        delivery_mode: string;
    };
    participants?: MeetingParticipant[];
    recordings?: MeetingRecording[];
}

// Meeting Creation Request
export interface CreateMeetingRequest {
    title: string;
    start_time: string;
    end_time: string;
    is_recurring?: boolean;
    recurrence_pattern?: string;
    meeting_type: 'AD_HOC' | 'STUDY_GROUP';
    max_participants?: number;
    description?: string;
    waiting_room_enabled?: boolean;
    recording_enabled?: boolean;
    auto_mute_participants?: boolean;
    participants: string[]; // Array of user IDs
}

// Meeting Update Request
export interface UpdateMeetingRequest {
    title?: string;
    start_time?: string;
    end_time?: string;
    is_recurring?: boolean;
    recurrence_pattern?: string;
    max_participants?: number;
    description?: string;
    waiting_room_enabled?: boolean;
    recording_enabled?: boolean;
    auto_mute_participants?: boolean;
    status?: 'SCHEDULED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
}

// Meeting Participants
export interface MeetingParticipant {
    id: string;
    meeting_id: string;
    user_id: string;
    status: 'INVITED' | 'ACCEPTED' | 'DECLINED' | 'JOINED' | 'LEFT';
    role: 'HOST' | 'PARTICIPANT' | 'OBSERVER';
    joined_at?: string;
    left_at?: string;
    
    // Related data
    user?: {
        id: string;
        first_name: string;
        last_name: string;
        username: string;
        avatar_url?: string;
        email: string;
    };
}

// Meeting Recording
export interface MeetingRecording {
    id: string;
    meeting_id: string;
    recording_url: string;
    file_size: number; // in bytes
    duration_seconds: number;
    recording_quality: 'HD' | 'SD' | 'AUDIO_ONLY';
    recording_format: 'MP4' | 'WEBM' | 'MP3';
    recorded_at: string;
    processed_at?: string;
    status: 'PROCESSING' | 'READY' | 'FAILED';
    
    // Storage info
    storage_location: string;
    is_archived: boolean;
    retention_expiry?: string;
    
    // Metadata
    created_at: string;
    updated_at: string;
}

// User Storage Management
export interface UserStorage {
    user_id: string;
    total_stimit: number; // in bytes
    used_storage: number; // in bytes
    available_storage: number; // in bytes
    storage_plan: 'FREE' | 'BASIC' | 'PREMIUM' | 'ENTERPRISE';
    monthly_cost: number;
    next_billing_date: string;
    
    // Storage breakdown
    recordings_storage: number;
    documents_storage: number;
    other_files_storage: number;
    
    // Limits
    max_recording_duration: number; // in minutes
    max_file_size: number; // in bytes
    retention_period_days: number;
    
    updated_at: string;
}

// Storage Plan
export interface StoragePlan {
    id: string;
    name: string;
    description: string;
    storage_limit: number; // in bytes
    monthly_cost: number;
    features: string[];
    max_participants: number;
    max_recording_duration: number; // in minutes
    retention_period_days: number;
    is_active: boolean;
}

// Meeting Search Filters
export interface MeetingSearchFilters {
    status?: string;
    meeting_type?: string;
    start_date?: string;
    end_date?: string;
    host_id?: string;
    participant_id?: string;
    search_query?: string;
    page?: number;
    limit?: number;
}

// WebRTC Signaling Events
export interface WebRTCEvent {
    type: 'offer' | 'answer' | 'ice-candidate' | 'user-joined' | 'user-left';
    data: any;
    from_user_id: string;
    to_user_id?: string;
    timestamp: string;
}

// Chat Message
export interface ChatMessage {
    id: string;
    meeting_id: string;
    user_id: string;
    message: string;
    message_type: 'text' | 'file' | 'system';
    timestamp: string;
    
    // Related data
    user?: {
        id: string;
        first_name: string;
        last_name: string;
        username: string;
        avatar_url?: string;
    };
}

// Meeting Statistics
export interface MeetingStats {
    meeting_id: string;
    total_participants: number;
    total_duration: number; // in seconds
    recording_count: number;
    chat_message_count: number;
    average_participant_time: number; // in seconds
    peak_concurrent_users: number;
    created_at: string;
}

// API Response Types
export interface OfficeMeetingsResponse {
    data: OfficeMeeting[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
}

export interface OfficeMeetingResponse {
    data: OfficeMeeting;
    message: string;
}

export interface CreateMeetingResponse {
    data: OfficeMeeting;
    message: string;
}

export interface UpdateMeetingResponse {
    data: OfficeMeeting;
    message: string;
}

export interface DeleteMeetingResponse {
    message: string;
}

// Meeting Join Response
export interface JoinMeetingResponse {
    meeting: OfficeMeeting;
    webrtc_config: {
        signaling_server: string;
        ice_servers: any[];
        room_id: string;
    };
    participants: MeetingParticipant[];
    chat_history: ChatMessage[];
}

// Recording Management Requests
export interface StartRecordingRequest {
    meeting_id: string;
    quality: 'HD' | 'SD' | 'AUDIO_ONLY';
    format: 'MP4' | 'WEBM' | 'MP3';
}

export interface StopRecordingRequest {
    meeting_id: string;
    recording_id: string;
}

// Storage Upgrade Request
export interface StorageUpgradeRequest {
    plan_id: string;
    payment_method: string;
}

// Meeting Invitation
export interface MeetingInvitation {
    id: string;
    meeting_id: string;
    invited_user_id: string;
    status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
    sent_at: string;
    responded_at?: string;
    message?: string;
}

// Recurrence Patterns
export interface RecurrencePattern {
    type: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    end_date?: string;
    end_after_occurrences?: number;
    days_of_week?: number[]; // 0=Sunday, 1=Monday, etc.
    day_of_month?: number;
    month?: number;
}

// Meeting Settings
export interface MeetingSettings {
    waiting_room_enabled: boolean;
    recording_enabled: boolean;
    auto_mute_participants: boolean;
    allow_screen_sharing: boolean;
    allow_chat: boolean;
    allow_participant_removal: boolean;
    max_participants: number;
    meeting_password?: string;
} 