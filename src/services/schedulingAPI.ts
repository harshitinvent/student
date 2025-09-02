import { 
    Year, 
    CreateYearRequest, 
    UpdateYearRequest,
    Semester,
    CreateSemesterRequest,
    UpdateSemesterRequest,
    Class,
    CreateClassRequest,
    UpdateClassRequest,
    ClassMeetingTime,
    CreateMeetingTimeRequest,
    UpdateMeetingTimeRequest,
    ClassSearchFilters,
    CalendarEvent,
    WeeklySchedule,
    ScheduleConflict,
    YearsResponse,
    YearResponse,
    SemestersResponse,
    SemesterResponse,
    ClassesResponse,
    ClassResponse,
    Campus,
    CreateCampusRequest,
    UpdateCampusRequest,
    CampusSearchFilters,
    CampusesResponse,
    CampusResponse,
    Venue,
    CreateVenueRequest,
    UpdateVenueRequest,
    VenueSearchFilters,
    VenuesResponse,
    VenueResponse,
    Program,
    CreateProgramRequest,
    UpdateProgramRequest,
    ProgramsResponse,
    ProgramResponse,
    Course,
    CreateCourseRequest,
    UpdateCourseRequest,
    CoursesResponse,
    CourseResponse
} from '../types/scheduling';

const API_BASE_URL = 'http://103.189.173.7:8080/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

// ============================================================================
// ACADEMIC YEAR MANAGEMENT
// ============================================================================

export const academicYearAPI = {
    // Get all academic years
    getAllYears: async (): Promise<Year[]> => {
        try {
            const response = await fetch(`${API_BASE_URL}/v1/admin/academics/years`, {
                headers: getAuthHeaders(),
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch academic years');
            }
            
            const data: YearsResponse = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error fetching academic years:', error);
            // Return mock data for development
            return [
                {
                    id: '1',
                    name: '1st Year',
                    year_number: 1,
                    is_active: true,
                    created_at: '2024-01-15T10:00:00Z',
                    updated_at: '2024-01-15T10:00:00Z'
                },
                {
                    id: '2',
                    name: '2nd Year',
                    year_number: 2,
                    is_active: true,
                    created_at: '2024-01-15T10:00:00Z',
                    updated_at: '2024-01-15T10:00:00Z'
                }
            ];
        }
    },

    // Get year by ID
    getYearById: async (id: string): Promise<Year> => {
        const response = await fetch(`${API_BASE_URL}/v1/admin/academics/years/${id}`, {
            headers: getAuthHeaders(),
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch academic year');
        }
        
        const data: YearResponse = await response.json();
        return data.data;
    },

    // Create new academic year
    createYear: async (yearData: CreateYearRequest): Promise<Year> => {
        const response = await fetch(`${API_BASE_URL}/v1/admin/academics/years`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(yearData),
        });
        
        if (!response.ok) {
            throw new Error('Failed to create academic year');
        }
        
        const data: YearResponse = await response.json();
        return data.data;
    },

    // Update academic year
    updateYear: async (id: string, yearData: UpdateYearRequest): Promise<Year> => {
        const response = await fetch(`${API_BASE_URL}/v1/admin/academics/years/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(yearData),
        });
        
        if (!response.ok) {
            throw new Error('Failed to update academic year');
        }
        
        const data: YearResponse = await response.json();
        return data.data;
    },

    // Delete academic year
    deleteYear: async (id: string): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/v1/admin/academics/years/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete academic year');
        }
    }
};

// ============================================================================
// SEMESTER MANAGEMENT
// ============================================================================

export const semesterAPI = {
    // Get all semesters
    getAllSemesters: async (): Promise<Semester[]> => {
        try {
            const response = await fetch(`${API_BASE_URL}/v1/admin/academics/semesters`, {
                headers: getAuthHeaders(),
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch semesters');
            }
            
            const data: SemestersResponse = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error fetching semesters:', error);
            // Return mock data for development
            return [
                {
                    id: '1',
                    year_id: '1',
                    name: '1st Semester',
                    semester_number: 1,
                    start_date: '2024-08-26',
                    end_date: '2024-12-20',
                    registration_start: '2024-04-01',
                    registration_end: '2024-08-25',
                    classes_start: '2024-08-26',
                    classes_end: '2024-12-20',
                    exams_start: '2024-12-16',
                    exams_end: '2024-12-20',
                    status: 'ACTIVE',
                    description: 'First Semester of 1st Year',
                    created_at: '2024-01-15T10:00:00Z',
                    updated_at: '2024-01-15T10:00:00Z',
                    year: {
                        name: '1st Year',
                        year_number: 1
                    }
                },
                {
                    id: '2',
                    year_id: '1',
                    name: '2nd Semester',
                    semester_number: 2,
                    start_date: '2025-01-13',
                    end_date: '2025-05-09',
                    registration_start: '2024-11-01',
                    registration_end: '2025-01-12',
                    classes_start: '2025-01-13',
                    classes_end: '2025-05-09',
                    exams_start: '2025-05-05',
                    exams_end: '2025-05-09',
                    status: 'PLANNED',
                    description: 'Second Semester of 1st Year',
                    created_at: '2024-01-15T10:00:00Z',
                    updated_at: '2024-01-15T10:00:00Z',
                    year: {
                        name: '1st Year',
                        year_number: 1
                    }
                }
            ];
        }
    },

    // Get semesters by year ID
    getSemestersByYear: async (yearId: string): Promise<Semester[]> => {
        try {
            const response = await fetch(`${API_BASE_URL}/v1/admin/academics/years/${yearId}/semesters`, {
                headers: getAuthHeaders(),
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch semesters for year');
            }
            
            const data: SemestersResponse = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error fetching semesters by year:', error);
            return [];
        }
    },

    // Get semester by ID
    getSemesterById: async (id: string): Promise<Semester> => {
        const response = await fetch(`${API_BASE_URL}/v1/admin/academics/semesters/${id}`, {
            headers: getAuthHeaders(),
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch semester');
        }
        
        const data: SemesterResponse = await response.json();
        return data.data;
    },

    // Create new semester
    createSemester: async (semesterData: CreateSemesterRequest): Promise<Semester> => {
        const response = await fetch(`${API_BASE_URL}/v1/admin/academics/semesters`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(semesterData),
        });
        
        if (!response.ok) {
            throw new Error('Failed to create semester');
        }
        
        const data: SemesterResponse = await response.json();
        return data.data;
    },

    // Update semester
    updateSemester: async (id: string, semesterData: UpdateSemesterRequest): Promise<Semester> => {
        const response = await fetch(`${API_BASE_URL}/v1/admin/academics/semesters/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(semesterData),
        });
        
        if (!response.ok) {
            throw new Error('Failed to update semester');
        }
        
        const data: SemesterResponse = await response.json();
        return data.data;
    },

    // Delete semester
    deleteSemester: async (id: string): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/v1/admin/academics/semesters/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete semester');
        }
    }
};

// ============================================================================
// CLASS MANAGEMENT (Updated)
// ============================================================================

export const classAPI = {
    // Get all classes with filters
    getAllClasses: async (filters: ClassSearchFilters): Promise<ClassesResponse> => {
        try {
            const queryParams = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    queryParams.append(key, value.toString());
                }
            });

            const response = await fetch(`${API_BASE_URL}/v1/academics/classes?${queryParams}`, {
                headers: getAuthHeaders(),
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch classes');
            }
            
            const data: ClassesResponse = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching classes:', error);
            // Return mock data for development
            return {
                data: [
                    {
                        id: '1',
                        course_id: '1',
                        semester_id: '1',
                        section_code: '01',
                        instructor_id: '1',
                        max_capacity: 30,
                        current_enrollment: 25,
                        delivery_mode: 'IN_PERSON' as const,
                        status: 'ACTIVE' as const,
                        created_at: '2024-01-15T10:00:00Z',
                        updated_at: '2024-01-15T10:00:00Z',
                        course: {
                            course_code: 'BIO-101',
                            title: 'Introduction to Biology',
                            credit_hours: 3
                        },
                        semester: {
                            name: 'Fall',
                            year_name: '2024-2025',
                            start_date: '2024-08-26',
                            end_date: '2024-12-20'
                        },
                        instructor: {
                            first_name: 'Dr. John',
                            last_name: 'Smith',
                            email: 'john.smith@university.edu'
                        },
                        meeting_times: [
                            {
                                id: '1',
                                class_id: '1',
                                day_of_week: 'MONDAY',
                                start_time: '10:00',
                                end_time: '10:50',
                                venue_id: '1',
                                created_at: '2024-01-15T10:00:00Z',
                                updated_at: '2024-01-15T10:00:00Z',
                                venue: {
                                    name: 'Science Building',
                                    building: 'Science Hall',
                                    room_number: '101',
                                    capacity: 35
                                }
                            }
                        ]
                    }
                ],
                total: 1,
                page: 1,
                page_size: 10,
                message: 'Classes retrieved successfully',
                status: true
            };
        }
    },

    // Get class by ID
    getClassById: async (id: string): Promise<Class> => {
        const response = await fetch(`${API_BASE_URL}/v1/academics/classes/${id}`, {
            headers: getAuthHeaders(),
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch class');
        }
        
        const data: ClassResponse = await response.json();
        return data.data;
    },

    // Create new class
    createClass: async (classData: CreateClassRequest): Promise<Class> => {
        const response = await fetch(`${API_BASE_URL}/v1/admin/academics/classes`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(classData),
        });
        
        if (!response.ok) {
            throw new Error('Failed to create class');
        }
        
        const data: ClassResponse = await response.json();
        return data.data;
    },

    // Update class
    updateClass: async (id: string, classData: UpdateClassRequest): Promise<Class> => {
        const response = await fetch(`${API_BASE_URL}/v1/admin/academics/classes/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(classData),
        });
        
        if (!response.ok) {
            throw new Error('Failed to update class');
        }
        
        const data: ClassResponse = await response.json();
        return data.data;
    },

    // Delete class
    deleteClass: async (id: string): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/v1/admin/academics/classes/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete class');
        }
    },

    // Get faculty's assigned classes
    getFacultyClasses: async (semesterId: string): Promise<Class[]> => {
        const response = await fetch(`${API_BASE_URL}/v1/faculty/me/classes?semesterId=${semesterId}`, {
            headers: getAuthHeaders(),
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch faculty classes');
        }
        
        const data: ClassesResponse = await response.json();
        return data.data;
    }
};

// ============================================================================
// MEETING TIMES MANAGEMENT (Same as before)
// ============================================================================

export const meetingTimeAPI = {
    // Add meeting time to a class
    addMeetingTime: async (classId: string, meetingData: CreateMeetingTimeRequest): Promise<ClassMeetingTime> => {
        const response = await fetch(`${API_BASE_URL}/v1/admin/academics/classes/${classId}/meetings`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(meetingData),
        });
        
        if (!response.ok) {
            if (response.status === 409) {
                const errorData = await response.json();
                throw new Error(`Schedule conflict: ${errorData.message}`);
            }
            throw new Error('Failed to add meeting time');
        }
        
        const data = await response.json();
        return data.data;
    },

    // Update meeting time
    updateMeetingTime: async (meetingId: string, meetingData: UpdateMeetingTimeRequest): Promise<ClassMeetingTime> => {
        const response = await fetch(`${API_BASE_URL}/v1/admin/academics/meetings/${meetingId}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(meetingData),
        });
        
        if (!response.ok) {
            if (response.status === 409) {
                const errorData = await response.json();
                throw new Error(`Schedule conflict: ${errorData.message}`);
            }
            throw new Error('Failed to update meeting time');
        }
        
        const data = await response.json();
        return data.data;
    },

    // Delete meeting time
    deleteMeetingTime: async (meetingId: string): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/v1/admin/academics/meetings/${meetingId}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete meeting time');
        }
    }
};

// ============================================================================
// CALENDAR & SCHEDULE MANAGEMENT (Same as before)
// ============================================================================

export const calendarAPI = {
    // Get calendar events for a date range
    getCalendarEvents: async (startDate: string, endDate: string, semesterId?: string): Promise<CalendarEvent[]> => {
        try {
            const queryParams = new URLSearchParams({
                startDate,
                endDate
            });
            
            if (semesterId) {
                queryParams.append('semesterId', semesterId);
            }

            const response = await fetch(`${API_BASE_URL}/v1/academics/calendar/events?${queryParams}`, {
                headers: getAuthHeaders(),
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch calendar events');
            }
            
            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error fetching calendar events:', error);
            return [];
        }
    },

    // Get weekly schedule
    getWeeklySchedule: async (weekStartDate: string, semesterId?: string): Promise<WeeklySchedule> => {
        try {
            const queryParams = new URLSearchParams({
                weekStartDate
            });
            
            if (semesterId) {
                queryParams.append('semesterId', semesterId);
            }

            const response = await fetch(`${API_BASE_URL}/v1/academics/schedule/weekly?${queryParams}`, {
                headers: getAuthHeaders(),
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch weekly schedule');
            }
            
            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error fetching weekly schedule:', error);
            return {
                monday: [],
                tuesday: [],
                wednesday: [],
                thursday: [],
                friday: [],
                saturday: [],
                sunday: []
            };
        }
    },

    // Check for schedule conflicts
    checkConflicts: async (meetingData: CreateMeetingTimeRequest): Promise<ScheduleConflict[]> => {
        const response = await fetch(`${API_BASE_URL}/v1/admin/academics/schedule/check-conflicts`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(meetingData),
        });
        
        if (!response.ok) {
            throw new Error('Failed to check schedule conflicts');
        }
        
        const data = await response.json();
        return data.conflicts || [];
    }
};

// ============================================================================
// VENUE MANAGEMENT
// ============================================================================

export const venueAPI = {
    // Get all venues with search and filters
    getAllVenues: async (filters: VenueSearchFilters = {}): Promise<VenuesResponse> => {
        try {
            const queryParams = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    queryParams.append(key, value.toString());
                }
            });

            const response = await fetch(`${API_BASE_URL}/v1/admin/venues?${queryParams}`, {
                headers: getAuthHeaders(),
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch venues');
            }
            
            const data: VenuesResponse = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching venues:', error);
            // Return mock data for development
            const mockVenues: Venue[] = [
                {
                    id: 1,
                    code: 'A101',
                    name: 'Room A101',
                    campus_id: 1,
                    campus: {
                        name: 'Seminar Hall',
                        code: 'SEM01'
                    },
                    is_active: true,
                    created_at: '2024-01-15T10:00:00Z',
                    updated_at: '2024-01-15T10:00:00Z'
                },
                {
                    id: 2,
                    code: 'B201',
                    name: 'Auditorium B',
                    campus_id: 2,
                    campus: {
                        name: 'Science Laboratory',
                        code: 'LAB01'
                    },
                    is_active: true,
                    created_at: '2024-01-15T10:00:00Z',
                    updated_at: '2024-01-15T10:00:00Z'
                },
                {
                    id: 3,
                    code: 'C301',
                    name: 'Conference Room C',
                    campus_id: 3,
                    campus: {
                        name: 'Central Library',
                        code: 'LIB01'
                    },
                    is_active: false,
                    created_at: '2024-01-15T10:00:00Z',
                    updated_at: '2024-01-15T10:00:00Z'
                }
            ];

            return {
                status: 'success',
                message: 'Venues retrieved successfully',
                data: {
                    venues: mockVenues,
                    pagination: {
                        page: 1,
                        page_size: 10,
                        total: mockVenues.length,
                        total_pages: 1
                    }
                }
            };
        }
    },

    // Get venue by ID
    getVenueById: async (id: string): Promise<Venue> => {
        try {
            const response = await fetch(`${API_BASE_URL}/v1/admin/venues/${id}`, {
                headers: getAuthHeaders(),
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch venue');
            }
            
            const data: VenueResponse = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error fetching venue:', error);
            throw error;
        }
    },

    // Create new venue
    createVenue: async (venueData: CreateVenueRequest): Promise<Venue> => {
        try {
            const response = await fetch(`${API_BASE_URL}/v1/admin/venues`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(venueData),
            });
            
            if (!response.ok) {
                throw new Error('Failed to create venue');
            }
            
            const data: VenueResponse = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error creating venue:', error);
            throw error;
        }
    },

    // Update venue
    updateVenue: async (id: string | number, venueData: UpdateVenueRequest): Promise<Venue> => {
        try {
            const response = await fetch(`${API_BASE_URL}/v1/admin/venues/${id}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(venueData),
            });
            
            if (!response.ok) {
                throw new Error('Failed to update venue');
            }
            
            const data: VenueResponse = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error updating venue:', error);
            throw error;
        }
    },

    // Delete venue
    deleteVenue: async (id: string | number): Promise<void> => {
        try {
            const response = await fetch(`${API_BASE_URL}/v1/admin/venues/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            });
            
            if (!response.ok) {
                throw new Error('Failed to delete venue');
            }
        } catch (error) {
            console.error('Error deleting venue:', error);
            throw error;
        }
    }
};

// ============================================================================
// CAMPUS MANAGEMENT
// ============================================================================

export const campusAPI = {
    // Get all campuses with search and filters
    getAllCampuses: async (filters: CampusSearchFilters = {}): Promise<CampusesResponse> => {
        try {
            const queryParams = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    queryParams.append(key, value.toString());
                }
            });

            const response = await fetch(`${API_BASE_URL}/v1/admin/campuses?${queryParams}`, {
                headers: getAuthHeaders(),
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch campuses');
            }
            
            const data: CampusesResponse = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching campuses:', error);
            // Return mock data for development
            const mockCampuses: Campus[] = [
                {
                    id: 1,
                    code: 'SEM01',
                    name: 'Seminar Hall',
                    description: 'Main seminar hall for large gatherings',
                    address: '123 University Drive',
                    city: 'New York',
                    state: 'NY',
                    country: 'USA',
                    phone: '+1-555-0123',
                    email: 'seminar@university.edu',
                    is_active: true,
                    created_at: '2024-01-15T10:00:00Z',
                    updated_at: '2024-01-15T10:00:00Z'
                },
                {
                    id: 2,
                    code: 'LAB01',
                    name: 'Science Laboratory',
                    description: 'Advanced science laboratory',
                    address: '456 North Avenue',
                    city: 'New York',
                    state: 'NY',
                    country: 'USA',
                    phone: '+1-555-0456',
                    email: 'lab@university.edu',
                    is_active: true,
                    created_at: '2024-01-15T10:00:00Z',
                    updated_at: '2024-01-15T10:00:00Z'
                },
                {
                    id: 3,
                    code: 'LIB01',
                    name: 'Central Library',
                    description: 'Main university library',
                    address: '789 South Street',
                    city: 'Los Angeles',
                    state: 'CA',
                    country: 'USA',
                    phone: '+1-555-0789',
                    email: 'library@university.edu',
                    is_active: false,
                    created_at: '2024-01-15T10:00:00Z',
                    updated_at: '2024-01-15T10:00:00Z'
                }
            ];

            return {
                status: 'success',
                message: 'Campuses retrieved successfully',
                data: {
                    campuses: mockCampuses,
                    pagination: {
                        page: 1,
                        page_size: 10,
                        total: mockCampuses.length,
                        total_pages: 1
                    }
                }
            };
        }
    },

    // Get campus by ID
    getCampusById: async (id: string): Promise<Campus> => {
        try {
            const response = await fetch(`${API_BASE_URL}/v1/admin/campuses/${id}`, {
                headers: getAuthHeaders(),
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch campus');
            }
            
            const data: CampusResponse = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error fetching campus:', error);
            throw error;
        }
    },

    // Create new campus
    createCampus: async (campusData: CreateCampusRequest): Promise<Campus> => {
        try {
            const response = await fetch(`${API_BASE_URL}/v1/admin/campuses`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(campusData),
            });
            
            if (!response.ok) {
                throw new Error('Failed to create campus');
            }
            
            const data: CampusResponse = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error creating campus:', error);
            throw error;
        }
    },

    // Update campus
    updateCampus: async (id: string | number, campusData: UpdateCampusRequest): Promise<Campus> => {
        try {
            const response = await fetch(`${API_BASE_URL}/v1/admin/campuses/${id}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(campusData),
            });
            
            if (!response.ok) {
                throw new Error('Failed to update campus');
            }
            
            const data: CampusResponse = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error updating campus:', error);
            throw error;
        }
    },

    // Delete campus
    deleteCampus: async (id: string | number): Promise<void> => {
        try {
            const response = await fetch(`${API_BASE_URL}/v1/admin/campuses/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            });
            
            if (!response.ok) {
                throw new Error('Failed to delete campus');
            }
        } catch (error) {
            console.error('Error deleting campus:', error);
            throw error;
        }
    }
}; 

// ============================================================================
// PROGRAM MANAGEMENT
export const programAPI = {
    // Get all programs
    getAllPrograms: async (): Promise<Program[]> => {
        try {
            const response = await fetch(`${API_BASE_URL}/v1/admin/academics/programs`, {
                headers: getAuthHeaders(),
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch programs');
            }
            
            const data = await response.json();
            return data.data || [];
        } catch (error) {
            console.error('Error fetching programs:', error);
            // Return mock data for development
            return [
                {
                    id: '1',
                    name: 'Bachelor of Technology',
                    degree_type: 'B.Tech',
                    stream_id: '1',
                    total_credits_required: 140,
                    status: 'ACTIVE',
                    description: 'Bachelor of Technology in Computer Science',
                    created_at: '2024-01-15T10:00:00Z',
                    updated_at: '2024-01-15T10:00:00Z'
                },
                {
                    id: '2',
                    name: 'Bachelor of Science',
                    degree_type: 'B.Sc',
                    stream_id: '2',
                    total_credits_required: 120,
                    status: 'ACTIVE',
                    description: 'Bachelor of Science in Biology',
                    created_at: '2024-01-15T10:00:00Z',
                    updated_at: '2024-01-15T10:00:00Z'
                }
            ];
        }
    }
};

// ============================================================================
// COURSE MANAGEMENT
export const courseAPI = {
    // Get all courses
    getAllCourses: async (): Promise<Course[]> => {
        try {
            const response = await fetch(`${API_BASE_URL}/v1/admin/academics/courses`, {
                headers: getAuthHeaders(),
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch courses');
            }
            
            const data = await response.json();
            return data.data || [];
        } catch (error) {
            console.error('Error fetching courses:', error);
            // Return mock data for development
            return [
                {
                    id: '1',
                    course_code: 'CS-101',
                    title: 'Introduction to Computer Science',
                    description: 'Basic concepts of computer science',
                    credit_hours: 3,
                    status: 'ACTIVE',
                    programs: ['1'],
                    created_at: '2024-01-15T10:00:00Z',
                    updated_at: '2024-01-15T10:00:00Z'
                },
                {
                    id: '2',
                    course_code: 'BIO-101',
                    title: 'Introduction to Biology',
                    description: 'Basic concepts of biology',
                    credit_hours: 4,
                    status: 'ACTIVE',
                    programs: ['2'],
                    created_at: '2024-01-15T10:00:00Z',
                    updated_at: '2024-01-15T10:00:00Z'
                }
            ];
        }
    }
};

// ============================================================================
// CLASS MEETING TIME MANAGEMENT
export const classMeetingTimeAPI = {
    // Create new class meeting time
    createClassMeetingTime: async (meetingTimeData: CreateMeetingTimeRequest): Promise<ClassMeetingTime> => {
        try {
            const response = await fetch(`${API_BASE_URL}/v1/admin/academics/classes/${meetingTimeData.class_id}/meetings`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(meetingTimeData),
            });
            
            if (!response.ok) {
                throw new Error('Failed to create class meeting time');
            }
            
            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error creating class meeting time:', error);
            // Return mock data for development
            return {
                id: '1',
                class_id: meetingTimeData.class_id,
                day_of_week: meetingTimeData.day_of_week,
                start_time: meetingTimeData.start_time,
                end_time: meetingTimeData.end_time,
                venue_id: meetingTimeData.venue_id,
                created_at: '2024-01-15T10:00:00Z',
                updated_at: '2024-01-15T10:00:00Z'
            };
        }
    }
}; 

// New function to create class with meeting time in one call
export const createClassWithMeetingTime = async (data: {
  classData: CreateClassRequest;
  meetingTimeData: Omit<CreateMeetingTimeRequest, 'class_id'>;
}) => {
  try {
    // First create the class
    const createdClass = await classAPI.createClass(data.classData);
    
    if (!createdClass || !createdClass.id) {
      throw new Error('Failed to create class');
    }
    
    // Then create the meeting time
    const meetingTimeData: CreateMeetingTimeRequest = {
      ...data.meetingTimeData,
      class_id: createdClass.id
    };
    
    const createdMeetingTime = await classMeetingTimeAPI.createClassMeetingTime(meetingTimeData);
    
    return {
      class: createdClass,
      meetingTime: createdMeetingTime
    };
  } catch (error) {
    console.error('Error creating class with meeting time:', error);
    throw error;
  }
}; 