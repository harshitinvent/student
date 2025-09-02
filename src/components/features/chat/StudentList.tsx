import React, { useState, useEffect } from 'react';
import { Input, Avatar, Badge, Spin, Empty } from 'antd';
import { SearchOutlined, UserOutlined } from '@ant-design/icons';
import { getAllStudents, searchStudents, getStudentsByDepartment, getStudentsByProgram, type Student } from '../../../services/studentAPI';

const { Search } = Input;

interface StudentListProps {
    onStudentSelect: (student: Student) => void;
    selectedStudentId?: string;
}

const StudentList: React.FC<StudentListProps> = ({ onStudentSelect, selectedStudentId }) => {
    const [students, setStudents] = useState<Student[]>([]);
    const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
    const [selectedProgram, setSelectedProgram] = useState<string>('all');

    useEffect(() => {
        loadStudents();
    }, []);

    useEffect(() => {
        filterStudents();
    }, [students, searchTerm, selectedDepartment, selectedProgram]);

    const loadStudents = async () => {
        try {
            setLoading(true);
            const studentsData = await getAllStudents();
            setStudents(studentsData);
        } catch (error) {
            console.error('Error loading students:', error);
            setStudents([]);
        } finally {
            setLoading(false);
        }
    };

    const filterStudents = () => {
        let filtered = [...students];

        // Filter by search term
        if (searchTerm.trim()) {
            filtered = filtered.filter(student =>
                student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.student_id.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by department (using program as department for now)
        if (selectedDepartment !== 'all') {
            filtered = filtered.filter(student =>
                student.program.toLowerCase().includes(selectedDepartment.toLowerCase())
            );
        }

        // Filter by program
        if (selectedProgram !== 'all') {
            filtered = filtered.filter(student =>
                student.program.toLowerCase().includes(selectedProgram.toLowerCase())
            );
        }

        setFilteredStudents(filtered);
    };

    const handleSearch = (value: string) => {
        setSearchTerm(value);
    };

    const handleDepartmentChange = (department: string) => {
        setSelectedDepartment(department);
    };

    const handleProgramChange = (program: string) => {
        setSelectedProgram(program);
    };

    const getUniqueDepartments = () => {
        // Extract department-like information from programs
        const departments = students
            .map(student => {
                const program = student.program;
                if (program.includes('Computer Science')) return 'Computer Science';
                if (program.includes('Business')) return 'Business';
                if (program.includes('Engineering')) return 'Engineering';
                if (program.includes('Arts')) return 'Arts';
                if (program.includes('Science')) return 'Science';
                return program.split(' ')[0]; // Take first word as department
            })
            .filter(Boolean) as string[];
        return ['all', ...Array.from(new Set(departments))];
    };

    const getUniquePrograms = () => {
        const programs = students
            .map(student => student.program)
            .filter(Boolean) as string[];
        return ['all', ...Array.from(new Set(programs))];
    };

    const getStudentDisplayName = (student: Student) => {
        return `${student.first_name} ${student.last_name}`;
    };

    const getYearText = (year: number) => {
        const yearMap: { [key: number]: string } = {
            1: '1st Year',
            2: '2nd Year',
            3: '3rd Year',
            4: '4th Year',
            5: '5th Year'
        };
        return yearMap[year] || `${year}th Year`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            {/* Search and Filters */}
            <div className="p-4 border-b border-gray-200">
                <Search
                    placeholder="Search students..."
                    allowClear
                    onSearch={handleSearch}
                    className="mb-3"
                />

                {/* Department Filter */}
                <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Department
                    </label>
                    <select
                        value={selectedDepartment}
                        onChange={(e) => handleDepartmentChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {getUniqueDepartments().map(dept => (
                            <option key={dept} value={dept}>
                                {dept === 'all' ? 'All Departments' : dept}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Program Filter */}
                <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Program
                    </label>
                    <select
                        value={selectedProgram}
                        onChange={(e) => handleProgramChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {getUniquePrograms().map(program => (
                            <option key={program} value={program}>
                                {program === 'all' ? 'All Programs' : program}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Student List */}
            <div className="flex-1 overflow-y-auto">
                {filteredStudents.length === 0 ? (
                    <Empty
                        description="No students found"
                        className="mt-8"
                    />
                ) : (
                    <div className="p-2">
                        {filteredStudents.map((student) => (
                            <div
                                key={student.ID}
                                onClick={() => onStudentSelect(student)}
                                className={`p-3 rounded-lg cursor-pointer transition-colors duration-200 mb-2 ${selectedStudentId === student.ID.toString()
                                    ? 'bg-blue-100 border border-blue-300'
                                    : 'hover:bg-gray-50 border border-transparent'
                                    }`}
                            >
                                <div className="flex items-center space-x-3">
                                    <Avatar
                                        size={40}
                                        icon={<UserOutlined />}
                                        className="flex-shrink-0 bg-blue-500"
                                    >
                                        {student.first_name.charAt(0)}{student.last_name.charAt(0)}
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-medium text-gray-900 truncate">
                                                {getStudentDisplayName(student)}
                                            </h4>
                                            <Badge
                                                status={student.is_active ? 'success' : 'default'}
                                                text={student.is_active ? 'Active' : 'Inactive'}
                                                className="text-xs"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 truncate">
                                            {student.student_id}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">
                                            {student.program} • {getYearText(student.year_of_study)}
                                        </p>
                                        <p className="text-xs text-gray-400 truncate">
                                            {student.email}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Results Count */}
            <div className="p-3 border-t border-gray-200 bg-gray-50">
                <p className="text-xs text-gray-500 text-center">
                    {filteredStudents.length} of {students.length} students
                </p>
            </div>
        </div>
    );
};

export default StudentList; 