// API Base URL - configure this based on your environment
const API_BASE = 'http://localhost:8080/api/students';

// Helper function to get authentication headers
function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export interface Student {
  ID: number; // API returns number
  CreatedAt: string; // API returns "2025-08-13T05:37:57.027906Z"
  UpdatedAt: string; // API returns "2025-08-13T05:37:57.027906Z"
  student_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  program: string;
  year_of_study: number;
  is_active: boolean;
  created_at: string;
}

export interface CreateStudentRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  program: string;
  year_of_study: number;
}

export interface UpdateStudentRequest extends Partial<CreateStudentRequest> {}

// Get all students from API
export const getAllStudents = async (): Promise<Student[]> => {
  try {
    const res = await fetch(`${API_BASE}?page=1&pageSize=1000`, {
      headers: getAuthHeaders(),
    });
    
    if (!res.ok) {
      console.error('API Error:', res.status, res.statusText);
      const errorText = await res.text();
      console.error('Error response:', errorText);
      throw new Error(
        `Failed to fetch students: ${res.status} ${res.statusText}`
      );
    }
    
    const response = await res.json();
    console.log('API Response:', response);
    console.log('API Response type:', typeof response);
    console.log('API Response keys:', Object.keys(response));

    // Handle different possible response formats
    if (Array.isArray(response)) {
      console.log('Response is an array, length:', response.length);
      return response;
    } else if (response && response.data && response.data.students && Array.isArray(response.data.students)) {
      // Handle the actual API response structure: {data: {students: [...], limit: 10, page: 1, total: 2}}
      console.log('Found students in response.data.students:', response.data.students.length);
      console.log('Sample student:', response.data.students[0]);
      return response.data.students;
    } else if (response && response.students && Array.isArray(response.students)) {
      console.log('Found students in response.students:', response.students.length);
      return response.students;
    } else if (response && response.data && Array.isArray(response.data)) {
      console.log('Found students in response.data:', response.data.length);
      return response.data;
    } else if (response && response.content && Array.isArray(response.content)) {
      console.log('Found students in response.content:', response.content.length);
      return response.content;
    } else if (response && response.items && Array.isArray(response.items)) {
      console.log('Found students in response.items:', response.items.length);
      return response.items;
    } else if (response && response.results && Array.isArray(response.results)) {
      console.log('Found students in response.results:', response.results.length);
      return response.results;
    } else {
      console.error('Unexpected response format:', response);
      console.error('Response structure:', JSON.stringify(response, null, 2));
      throw new Error('Invalid response format - no student array found');
    }
  } catch (error) {
    console.error('API call failed:', error);
    // Fallback to mock data for development
    console.log('Using mock data for development');
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return [
      {
        ID: 1,
        CreatedAt: '2022-09-01T00:00:00Z',
        UpdatedAt: '2022-09-01T00:00:00Z',
        student_id: 'STU001',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@university.edu',
        phone_number: '+1234567890',
        program: 'Bachelor of Computer Science',
        year_of_study: 3,
        is_active: true,
        created_at: '2022-09-01T00:00:00Z'
      },
      {
        ID: 2,
        CreatedAt: '2023-09-01T00:00:00Z',
        UpdatedAt: '2023-09-01T00:00:00Z',
        student_id: 'STU002',
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane.smith@university.edu',
        phone_number: '+1234567891',
        program: 'Master of Business Administration',
        year_of_study: 2,
        is_active: true,
        created_at: '2023-09-01T00:00:00Z'
      },
      {
        ID: 3,
        CreatedAt: '2021-09-01T00:00:00Z',
        UpdatedAt: '2021-09-01T00:00:00Z',
        student_id: 'STU003',
        first_name: 'Mike',
        last_name: 'Johnson',
        email: 'mike.johnson@university.edu',
        phone_number: '+1234567892',
        program: 'Bachelor of Engineering',
        year_of_study: 4,
        is_active: true,
        created_at: '2021-09-01T00:00:00Z'
      },
      {
        ID: 4,
        CreatedAt: '2023-09-01T00:00:00Z',
        UpdatedAt: '2023-09-01T00:00:00Z',
        student_id: 'STU004',
        first_name: 'Sarah',
        last_name: 'Wilson',
        email: 'sarah.wilson@university.edu',
        phone_number: '+1234567893',
        program: 'Bachelor of Arts',
        year_of_study: 2,
        is_active: true,
        created_at: '2023-09-01T00:00:00Z'
      },
      {
        ID: 5,
        CreatedAt: '2024-09-01T00:00:00Z',
        UpdatedAt: '2024-09-01T00:00Z',
        student_id: 'STU005',
        first_name: 'David',
        last_name: 'Brown',
        email: 'david.brown@university.edu',
        phone_number: '+1234567894',
        program: 'Master of Science',
        year_of_study: 1,
        is_active: true,
        created_at: '2024-09-01T00:00:00Z'
      }
    ];
  }
};

// Get students by department
export const getStudentsByDepartment = async (department: string): Promise<Student[]> => {
  try {
    const students = await getAllStudents();
    // Since the API doesn't have department field, we'll filter by program
    return students.filter(student => 
      student.program.toLowerCase().includes(department.toLowerCase())
    );
  } catch (error) {
    console.error('Error fetching students by department:', error);
    throw error;
  }
};

// Get students by program
export const getStudentsByProgram = async (program: string): Promise<Student[]> => {
  try {
    const students = await getAllStudents();
    return students.filter(student => 
      student.program.toLowerCase().includes(program.toLowerCase())
    );
  } catch (error) {
    console.error('Error fetching students by program:', error);
    throw error;
  }
};

// Search students
export const searchStudents = async (searchTerm: string): Promise<Student[]> => {
  try {
    const students = await getAllStudents();
    const lowerSearchTerm = searchTerm.toLowerCase();
    
    return students.filter(student => 
      student.first_name.toLowerCase().includes(lowerSearchTerm) ||
      student.last_name.toLowerCase().includes(lowerSearchTerm) ||
      student.email.toLowerCase().includes(lowerSearchTerm) ||
      student.student_id.toLowerCase().includes(lowerSearchTerm) ||
      student.program.toLowerCase().includes(lowerSearchTerm)
    );
  } catch (error) {
    console.error('Error searching students:', error);
    throw error;
  }
};

// Get student by ID
export const getStudentById = async (id: string): Promise<Student | null> => {
  try {
    const students = await getAllStudents();
    return students.find(student => student.ID.toString() === id) || null;
  } catch (error) {
    console.error('Error fetching student:', error);
    throw error;
  }
}; 