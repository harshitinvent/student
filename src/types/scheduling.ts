// Year Management (Student Year Levels)
export interface Year {
    id: string;
    name: string; // "1st Year", "2nd Year", "3rd Year", "4th Year"
    year_number: number; // 1, 2, 3, 4
    is_active: boolean; // true = Active, false = Inactive
    created_at: string;
    updated_at: string;
}

export interface CreateYearRequest {
    name: string;
    year_number: number;
    is_active?: boolean;
}

export interface UpdateYearRequest {
    name?: string;
    year_number?: number;
    is_active?: boolean;
}

// Semester Management (belongs to a specific Year)
export interface Semester {
    id: string;
    year_id: string; // Foreign key to Year
    name: string; // "1st Semester", "2nd Semester"
    semester_number: number; // 1, 2
    start_date: string;
    end_date: string;
    registration_start: string;
    registration_end: string;
    classes_start: string;
    classes_end: string;
    exams_start: string;
    exams_end: string;
    status: 'ACTIVE' | 'PLANNED' | 'COMPLETED';
    description?: string;
    created_at: string;
    updated_at: string;
    
    // Related data
    year?: {
        name: string;
        year_number: number;
    };
}

export interface CreateSemesterRequest {
    year_id: string;
    name: string;
    semester_number: number;
    start_date: string;
    end_date: string;
    registration_start: string;
    registration_end: string;
    classes_start: string;
    classes_end: string;
    exams_start: string;
    exams_end: string;
    status?: 'ACTIVE' | 'PLANNED' | 'COMPLETED';
    description?: string;
}

export interface UpdateSemesterRequest {
    year_id?: string;
    name?: string;
    semester_number?: number;
    start_date?: string;
    end_date?: string;
    registration_start?: string;
    registration_end?: string;
    classes_start?: string;
    classes_end?: string;
    exams_start?: string;
    exams_end?: string;
    status?: 'ACTIVE' | 'PLANNED' | 'COMPLETED';
    description?: string;
}

// Class Section Management (Updated)
export interface Class {
    id: string;
    course_id: string;
    year_id: string;
    semester_id: string;
    section_code: string;
    instructor_id: string;
    max_capacity: number;
    current_enrollment: number;
    delivery_mode: 'IN_PERSON' | 'ONLINE_SYNC' | 'ONLINE_ASYNC' | 'HYBRID';
    status: 'PLANNED' | 'ACTIVE' | 'CANCELLED' | 'COMPLETED';
    created_at: string;
    updated_at: string;
    
    // New fields from API response
    class_code?: string;
    capacity?: number;
    notes?: string;
    
    // Meeting time data directly in class object
    day_of_week?: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
    start_time?: string;
    end_time?: string;
    meeting_date?: string;
    is_recurring?: boolean;
    recurrence_pattern?: string;
    
    // Related data
    course?: {
        id: number;
        code: string;
        name: string;
        credits: number;
    };
    semester?: {
        id: number;
        year_id: number;
        semester_number: number;
        name: string;
        is_active: boolean;
        created_at: string;
        updated_at: string;
    };
    instructor?: {
        id: number;
        teacher_id: string;
        first_name: string;
        last_name: string;
        email: string;
        phone: string;
    };
    teacher?: {
        id: number;
        teacher_id: string;
        first_name: string;
        last_name: string;
        email: string;
        phone: string;
    };
    year?: {
        id: number;
        year_number: number;
        name: string;
        is_active: boolean;
        created_at: string;
        updated_at: string;
    };
    program?: {
        id: number;
        degree_type: string;
        status: string;
    };
    campus?: {
        id: number;
        code: string;
        name: string;
        description: string;
        address: string;
        city: string;
        state: string;
        country: string;
    };
    venue?: {
        id: number;
        code: string;
        name: string;
        type: string;
        capacity: number;
        building: string;
        floor: string;
        room_number: string;
        is_active: boolean;
        campus_id: number;
    };
    meeting_times?: ClassMeetingTime[];
    meetings?: ClassMeetingTime[] | null;
}

export interface CreateClassRequest {
    course_id: string;
    year_id: string; // Add year_id field
    semester_id: string; // Updated
    section_code: string;
    instructor_id: string;
    max_capacity: number;
    delivery_mode: 'IN_PERSON' | 'ONLINE_SYNC' | 'ONLINE_ASYNC' | 'HYBRID';
    status?: 'PLANNED' | 'ACTIVE' | 'CANCELLED' | 'COMPLETED';
}

export interface UpdateClassRequest {
    instructor_id?: string;
    max_capacity?: number;
    delivery_mode?: 'IN_PERSON' | 'ONLINE_SYNC' | 'ONLINE_ASYNC' | 'HYBRID';
    status?: 'PLANNED' | 'ACTIVE' | 'CANCELLED' | 'COMPLETED';
}

// Class Meeting Times (Same as before)
export interface ClassMeetingTime {
    id: string;
    class_id: string;
    day_of_week: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
    start_time: string;
    end_time: string;
    venue_id: string;
    created_at: string;
    updated_at: string;
    
    venue?: {
        name: string;
        building: string;
        room_number: string;
        capacity: number;
    };
}

export interface CreateMeetingTimeRequest {
    class_id: string;
    day_of_week: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
    start_time: string;
    end_time: string;
    venue_id: string;
}

export interface UpdateMeetingTimeRequest {
    day_of_week?: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
    start_time?: string;
    end_time?: string;
    venue_id?: string;
}

// Class Enrollment
export interface ClassEnrollment {
    id: string;
    class_id: string;
    student_id: string;
    enrollment_date: string;
    status: 'ENROLLED' | 'WITHDRAWN' | 'WAITLISTED';
    
    student?: {
        first_name: string;
        last_name: string;
        student_id: string;
    };
}

// Calendar View Models
export interface CalendarEvent {
    id: string;
    title: string;
    start: string;
    end: string;
    class_id: string;
    section_code: string;
    course_title: string;
    instructor_name: string;
    venue_name: string;
    color: string;
    type: 'class' | 'exam' | 'meeting';
}

export interface WeeklySchedule {
    monday: ClassMeetingTime[];
    tuesday: ClassMeetingTime[];
    wednesday: ClassMeetingTime[];
    thursday: ClassMeetingTime[];
    friday: ClassMeetingTime[];
    saturday: ClassMeetingTime[];
    sunday: ClassMeetingTime[];
}

// Filter and Search
export interface ClassSearchFilters {
    semester_id: string; // Updated
    year_id?: string;
    department_id?: string;
    course_code?: string;
    instructor_id?: string;
    day_of_week?: string;
    available_seats?: boolean;
    delivery_mode?: string;
    status?: string;
}

// Conflict Detection
export interface ScheduleConflict {
    type: 'INSTRUCTOR_CONFLICT' | 'VENUE_CONFLICT' | 'TIME_OVERLAP';
    message: string;
    conflicting_class?: {
        id: string;
        section_code: string;
        course_title: string;
        instructor_name: string;
        venue_name: string;
    };
}

// API Response Types
export interface YearsResponse {
    data: Year[];
    total: number;
    page: number;
    page_size: number;
    message: string;
    status: boolean;
}

export interface YearResponse {
    data: Year;
    message: string;
    status: boolean;
}

export interface SemestersResponse {
    data: Semester[];
    total: number;
    page: number;
    page_size: number;
    message: string;
    status: boolean;
}

export interface SemesterResponse {
    data: Semester;
    message: string;
    status: boolean;
}

export interface ClassesResponse {
    data: Class[];
    total: number;
    page: number;
    page_size: number;
    message: string;
    status: boolean;
}

export interface ClassResponse {
    data: Class;
    message: string;
    status: boolean;
} 

// Campus Management
export interface Campus {
    id: number | string;
    code: string; // Campus code like "SEM01"
    name: string; // "Seminar Hall"
    description?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    phone?: string;
    email?: string;
    is_active?: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface CreateCampusRequest {
    name: string;
    code: string;
    description?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    phone?: string;
    email?: string;
    is_active?: boolean;
}

export interface UpdateCampusRequest {
    name?: string;
    code?: string;
    description?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    phone?: string;
    email?: string;
    is_active?: boolean;
}

export interface CampusSearchFilters {
    search?: string;
    city?: string;
    state?: string;
    country?: string;
    is_active?: boolean;
    page?: number;
    page_size?: number;
}

export interface CampusesResponse {
    status: string;
    message: string;
    data: {
        campuses: Campus[];
        pagination: {
            page: number;
            page_size: number;
            total: number;
            total_pages: number;
        };
    };
}

export interface CampusResponse {
    status: string;
    message: string;
    data: Campus;
} 

// Venue Management
export interface Venue {
    id: number | string;
    code: string; // Venue code like "A101", "B201"
    name: string; // "Room A101", "Auditorium B"
    campus_id: number | string; // Foreign key to Campus
    campus?: {
        name: string;
        code: string;
    };
    is_active?: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface CreateVenueRequest {
    code: string;
    name: string;
    campus_id: number | string;
    is_active?: boolean;
}

export interface UpdateVenueRequest {
    code?: string;
    name?: string;
    campus_id?: number | string;
    is_active?: boolean;
}

export interface VenueSearchFilters {
    search?: string;
    campus_id?: number | string;
    is_active?: boolean;
    page?: number;
    page_size?: number;
}

export interface VenuesResponse {
    status: string;
    message: string;
    data: {
        venues: Venue[];
        pagination: {
            page: number;
            page_size: number;
            total: number;
            total_pages: number;
        };
    };
}

export interface VenueResponse {
    status: string;
    message: string;
    data: Venue;
} 

// ============================================================================
// STREAM MANAGEMENT (Academic Streams/Departments)
export interface Stream {
    id: string;
    name: string; // "Computer Science", "Biology", "Mathematics"
    code: string; // "CS", "BIO", "MATH"
    description?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface CreateStreamRequest {
    name: string;
    code: string;
    description?: string;
    is_active?: boolean;
}

export interface UpdateStreamRequest {
    name?: string;
    code?: string;
    description?: string;
    is_active?: boolean;
}

export interface StreamsResponse {
    data: Stream[];
    pagination: {
        page: number;
        page_size: number;
        total: number;
        total_pages: number;
    };
    message: string;
    status: string;
}

export interface StreamResponse {
    data: Stream;
    message: string;
    status: string;
}

// ============================================================================
// PROGRAM MANAGEMENT
export interface Program {
    id: string;
    name: string;
    degree_type: string; // "B.Tech", "B.Sc", "M.Tech", etc.
    stream_id: string; // Foreign key to Stream
    total_credits_required: number;
    status: 'ACTIVE' | 'PLANNED' | 'DISCONTINUED';
    description?: string;
    created_at: string;
    updated_at: string;
}

export interface CreateProgramRequest {
    name: string;
    degree_type: string;
    stream_id: string;
    total_credits_required: number;
    status?: 'ACTIVE' | 'PLANNED' | 'DISCONTINUED';
    description?: string;
}

export interface UpdateProgramRequest {
    name?: string;
    degree_type?: string;
    stream_id?: string;
    total_credits_required?: number;
    status?: 'ACTIVE' | 'PLANNED' | 'DISCONTINUED';
    description?: string;
}

export interface ProgramsResponse {
    data: Program[];
    pagination: {
        page: number;
        page_size: number;
        total: number;
        total_pages: number;
    };
    message: string;
    status: string;
}

export interface ProgramResponse {
    data: Program;
    message: string;
    status: string;
}

// ============================================================================
// COURSE MANAGEMENT
export interface Course {
    id: string;
    course_code: string; // Unique code like "CS-101", "BIO-101"
    title: string;
    description?: string;
    credit_hours: number;
    status: 'ACTIVE' | 'RETIRED';
    programs?: string[]; // Array of program IDs this course belongs to
    created_at: string;
    updated_at: string;
}

export interface CreateCourseRequest {
    course_code: string;
    title: string;
    description?: string;
    credit_hours: number;
    status?: 'ACTIVE' | 'RETIRED';
    programs?: string[];
}

export interface UpdateCourseRequest {
    course_code?: string;
    title?: string;
    description?: string;
    credit_hours?: number;
    status?: 'ACTIVE' | 'RETIRED';
    programs?: string[];
}

export interface CoursesResponse {
    data: Course[];
    pagination: {
        page: number;
        page_size: number;
        total: number;
        total_pages: number;
    };
    message: string;
    status: string;
}

export interface CourseResponse {
    data: Course;
    message: string;
    status: string;
} 