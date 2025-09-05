import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar as AntCalendar,
  Button,
  Modal,
  Form,
  Select,
  Input,
  DatePicker,
  TimePicker,
  Card,
  Row,
  Col,
  Tag,
  Space,
  Tabs,
  Badge,
  message,
  Pagination,
  Drawer,
  Divider,
  Checkbox,
} from 'antd';
import {
  PlusOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  EnvironmentOutlined,
  BookOutlined,
  LeftOutlined,
  RightOutlined,
  SearchOutlined,
  ClearOutlined,
  FilterOutlined,
  DeleteOutlined,
  CheckOutlined,
  ReloadOutlined,
  ArrowRightOutlined,
  BellOutlined,
  DownOutlined,
} from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { useUserContext } from '../../providers/user';
import {
  academicYearAPI,
  semesterAPI,
  programAPI,
  courseAPI,
  campusAPI,
  venueAPI,
  classAPI,
} from '../../services/schedulingAPI';
import {
  Year,
  Semester,
  Program,
  Course,
  Campus,
  Venue,
  Class,
  ClassMeetingTime,
} from '../../types/scheduling';
import { Color } from 'antd/es/color-picker';

const { Option } = Select;
const { TabPane } = Tabs;

interface CalendarEvent {
  id: string;
  title: string;
  start: Dayjs;
  end: Dayjs;
  class: Class;
  type: 'CLASS' | 'EVENT';
  section_code: string; // Add section code for color logic
  meetingTime: {
    id: string;
    day_of_week: string;
    start_time: string;
    end_time: string;
    venue_id?: number;
    venue?: any;
  };
}

interface ClassFormData {
  id: string;
  section_code: string;
  course_id: string;
  instructor_id: string;
  venue_id: string;
  campus_id: string;
  capacity: string;
  class_date: Dayjs | null;
  class_time: [Dayjs, Dayjs] | null;
  is_recurring: boolean;
  recurrence_pattern: string;
  recurrence_end_date?: Dayjs | null;
}

const Calendar: React.FC = React.memo(() => {
  const { hasPermission } = useUserContext();
  const [viewMode, setViewMode] = useState<'weekly' | 'monthly' | 'daily'>(
    'weekly'
  );
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [isCreateClassModalVisible, setIsCreateClassModalVisible] =
    useState(false);
  const [createClassForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isFilterDrawerVisible, setIsFilterDrawerVisible] = useState(false);
  const [isClassDetailsModalVisible, setIsClassDetailsModalVisible] =
    useState(false);
  const [selectedClassForDetails, setSelectedClassForDetails] =
    useState<Class | null>(null);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);

  // Custom CSS Styles - Exact screenshots design
  const styles = {
    calendarContainer: {
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
    },
    header: {
      backgroundColor: 'white',
      borderBottom: '1px solid #e5e7eb',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    },
    headerLeft: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '8px',
    },
    headerTitle: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: '#1f2937',
      margin: 0,
    },
    headerSubtitle: {
      fontSize: '16px',
      color: '#6b7280',
      margin: 0,
    },
    headerRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    },
    filterButton: {
      height: '40px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      color: '#374151',
    },
    createButton: {
      height: '40px',
      backgroundColor: '#1890ff',
      borderColor: '#1890ff',
      borderRadius: '8px',
      color: 'white',
    },
    refreshButton: {
      height: '40px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      color: '#374151',
    },
    mainLayout: {
      display: 'flex',
    },
    sidebar: {
      width: '320px',
      padding: '24px',
      backgroundColor: '#f9fafb',
      minHeight: 'calc(100vh - 120px)',
      borderRight: '1px solid #e5e7eb',
    },
    sidebarContent: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '16px',
    },
    createSidebarButton: {
      width: '100%',
      height: '48px',
      backgroundColor: '#000',
      borderColor: '#000',
      borderRadius: '8px',
      color: 'white',
    },
    selectActionsButton: {
      width: '100%',
      height: '48px',
      textAlign: 'left' as const,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      backgroundColor: 'white',
      color: '#374151',
    },
    miniCalendar: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '24px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    },
    miniCalendarHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '16px',
    },
    miniCalendarNavButton: {
      background: 'none',
      border: 'none',
      color: '#6b7280',
      cursor: 'pointer',
      padding: '4px',
      borderRadius: '4px',
    },
    miniCalendarMonth: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#1f2937',
    },
    miniCalendarDays: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '4px',
      marginBottom: '8px',
    },
    miniCalendarDayHeader: {
      textAlign: 'center' as const,
      fontSize: '12px',
      fontWeight: '500',
      color: '#6b7280',
      padding: '4px',
    },
    miniCalendarGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '4px',
    },
    miniCalendarDay: {
      position: 'relative' as const,
      textAlign: 'center' as const,
      fontSize: '12px',
      padding: '4px',
      cursor: 'pointer',
      borderRadius: '4px',
      color: '#374151',
    },
    miniCalendarEmptyDay: {
      padding: '4px',
    },
    miniCalendarSelectedDay: {
      backgroundColor: '#e5e7eb',
    },
    miniCalendarSelectedText: {
      fontWeight: '600',
    },
    miniCalendarEventDot: {
      position: 'absolute' as const,
      bottom: '0',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '6px',
      height: '6px',
      borderRadius: '50%',
    },
    upcomingEvents: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '16px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    },
    upcomingEventsTitle: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: '12px',
      margin: '0 0 12px 0',
    },
    upcomingEventsList: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '12px',
    },
    upcomingEventItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    upcomingEventColorBar: {
      width: '4px',
      height: '32px',
      borderRadius: '2px',
    },
    upcomingEventContent: {
      flex: 1,
    },
    upcomingEventTitle: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#1f2937',
      marginBottom: '4px',
    },
    upcomingEventDate: {
      display: 'flex',
      alignItems: 'center',
      fontSize: '12px',
      color: '#6b7280',
    },
    upcomingEventIcon: {
      marginRight: '4px',
      fontSize: '12px',
    },
    upcomingEventArrow: {
      color: '#9ca3af',
      fontSize: '12px',
    },
    mainContent: {
      flex: 1,
      padding: '24px',
    },
    calendarCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    },
    calendarHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '24px',
    },
    viewSelector: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    },
    viewSelect: {
      width: '120px',
    },
    calendarNavigation: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    },
    navButton: {
      border: 'none',
      color: '#6b7280',
    },
    calendarTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1f2937',
    },
    todayButton: {
      height: '40px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      color: '#374151',
      backgroundColor: 'white',
    },
  };

  // Multiple class creation states
  const [classForms, setClassForms] = useState<ClassFormData[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedSemester, setSelectedSemester] = useState<string>('');
  const [selectedProgram, setSelectedProgram] = useState<string>('');
  const [selectedCampus, setSelectedCampus] = useState<string>('');

  // Data states
  const [years, setYears] = useState<Year[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [availableVenues, setAvailableVenues] = useState<Venue[]>([]);
  const [availableTeachers, setAvailableTeachers] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);

  // Form states
  const [selectedDateForClass, setSelectedDateForClass] =
    useState<Dayjs | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState<
    [Dayjs, Dayjs] | null
  >(null);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [selectedVenue, setSelectedVenue] = useState<string>('');
  const [selectedTeacher, setSelectedTeacher] = useState<string>('');

  // Calendar navigation states
  const [currentWeek, setCurrentWeek] = useState<Dayjs>(dayjs());
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs());
  const [currentDay, setCurrentDay] = useState<Dayjs>(dayjs());

  // Event creation states
  const [eventForms, setEventForms] = useState<EventFormData[]>([]);
  const [activeTab, setActiveTab] = useState<'class' | 'event'>('class');

  // Flag to prevent unnecessary re-renders during modal operations
  const [isModalOperation, setIsModalOperation] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  // Load semesters when year changes
  useEffect(() => {
    if (selectedYear && selectedYear !== '') {
      loadSemestersByYear(selectedYear);
    } else {
      setSemesters([]);
    }
  }, [selectedYear]);

  // Load courses when program changes
  useEffect(() => {
    if (selectedProgram && selectedProgram !== '') {
      loadCoursesByProgram(selectedProgram);
    } else {
      setCourses([]);
    }
  }, [selectedProgram]);

  // Load venues when campus changes
  useEffect(() => {
    if (selectedCampus && selectedCampus !== '') {
      loadVenuesByCampus(selectedCampus);
    } else {
      setVenues([]);
    }
  }, [selectedCampus]);

  // Check availability when date/time changes
  useEffect(() => {
    if (selectedDateForClass && selectedTimeRange) {
      checkAvailability();
    }
  }, [selectedDateForClass, selectedTimeRange]);

  // Initialize with one class form when modal opens - COMPLETELY ISOLATED
  useEffect(() => {
    if (isCreateClassModalVisible && classForms.length === 0) {
      // Only add form, don't trigger any other state changes
      const newForm: ClassFormData = {
        id: `class-${Date.now()}-${Math.random()}`,
        section_code: '',
        course_id: '',
        instructor_id: '',
        venue_id: '',
        campus_id: '',
        capacity: '',
        class_date: null,
        class_time: null,
        is_recurring: false,
        recurrence_pattern: '',
        recurrence_end_date: null,
      };
      setClassForms([newForm]);

      // Reset flag after form is added
      setTimeout(() => setIsModalOperation(false), 100);
    }
  }, [isCreateClassModalVisible]); // ONLY modal visibility, nothing else

  const renderView = () => {
    switch (viewMode) {
      case 'daily':
        return renderDailyView();
      case 'weekly':
        return renderWeeklyView();
      case 'monthly':
        return renderMonthlyView();
      default:
        return null;
    }
  };

  const loadInitialData = async () => {
    try {
      setLoading(true);

      // Single batch API call for ALL data - much faster than separate calls
      const [
        yearsData,
        programsData,
        campusesData,
        classesData,
        teachersData,
        studentsData,
      ] = await Promise.all([
        fetch('http://103.189.173.7:8080/api/common/years').then((res) =>
          res.json()
        ),
        fetch('http://103.189.173.7:8080/api/common/programs').then((res) =>
          res.json()
        ),
        fetch('http://103.189.173.7:8080/api/common/campuses').then((res) =>
          res.json()
        ),
        classAPI.getAllClasses({ semester_id: '' }),
        fetch('http://103.189.173.7:8080/api/common/teachers').then((res) =>
          res.json()
        ),
        fetch('http://103.189.173.7:8080/api/common/students', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }).then((res) => res.json()),
      ]);

      // Set all data at once to prevent multiple re-renders
      setYears(yearsData?.data || yearsData || []);
      setPrograms(programsData?.data || programsData || []);
      setCampuses(campusesData?.data || campusesData || []);
      setClasses(classesData?.data?.classes || []);
      setTeachers(teachersData?.data || teachersData || []);
      setStudents(studentsData?.data || studentsData || []);

      console.log('=== DATA LOADING DEBUG ===');
      console.log('All data loaded successfully in single batch');
      console.log(
        'Classes count:',
        (classesData?.data || classesData || []).length
      );
    } catch (error) {
      console.error('Error loading initial data:', error);
      message.error('Failed to load initial data');
    } finally {
      setLoading(false);
    }
  };

  const loadSemestersByYear = async (yearId: string) => {
    try {
      console.log('Loading semesters for year:', yearId);
      const response = await fetch(
        `http://103.189.173.7:8080/api/common/years/${yearId}/semesters?year_id=${yearId}`
      );
      const semestersData = await response.json();
      console.log('Semesters API response:', semestersData);

      const semestersArray = semestersData?.data || semestersData || [];
      setSemesters(semestersArray);
      console.log('Semesters loaded:', semestersArray.length);
    } catch (error) {
      console.error('Error loading semesters:', error);
      message.error('Failed to load semesters');
      setSemesters([]);
    }
  };

  const loadCoursesByProgram = async (programId: string) => {
    try {
      console.log('Loading courses for program:', programId);
      const response = await fetch(
        `http://103.189.173.7:8080/api/common/programs/${programId}/courses?program_id=${programId}`
      );
      const coursesData = await response.json();
      console.log('Courses API response:', coursesData);

      const coursesArray = coursesData?.data || coursesData || [];
      setCourses(coursesArray);
      console.log('Courses loaded:', coursesArray.length);
    } catch (error) {
      console.error('Error loading courses:', error);
      message.error('Failed to load courses for selected program');
      setCourses([]);
    }
  };

  const loadVenuesByCampus = async (campusId: string) => {
    try {
      console.log('Loading venues for campus:', campusId);
      const response = await fetch(
        `http://103.189.173.7:8080/api/common/campuses/${campusId}/venues?campus_id=${campusId}`
      );
      const venuesData = await response.json();
      console.log('Venues API response:', venuesData);

      const venuesArray = venuesData?.data || venuesData || [];
      setVenues(venuesArray);
      console.log('Venues loaded:', venuesArray.length);
    } catch (error) {
      console.error('Error loading venues:', error);
      message.error('Failed to load venues for selected campus');
      setVenues([]);
    }
  };

  const loadVenuesForForm = async (campusId: string) => {
    try {
      console.log('Loading venues for campus:', campusId);
      const response = await fetch(
        `http://103.189.173.7:8080/api/common/campuses/${campusId}/venues?campus_id=${campusId}`
      );
      const venuesData = await response.json();
      console.log('Venues API response:', venuesData);

      const venuesArray = venuesData?.data || venuesData || [];
      setVenues(venuesArray);
      return venuesArray;
    } catch (error) {
      console.error('Error loading venues:', error);
      message.error('Failed to load venues for selected campus');
      return [];
    }
  };

  const checkAvailability = () => {
    if (!selectedDateForClass || !selectedTimeRange) return;

    const [startTime, endTime] = selectedTimeRange;
    const dayOfWeek = selectedDateForClass.day();

    const dayNames = [
      'SUNDAY',
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY',
    ];
    const dayString = dayNames[dayOfWeek] as
      | 'SUNDAY'
      | 'MONDAY'
      | 'TUESDAY'
      | 'WEDNESDAY'
      | 'THURSDAY'
      | 'FRIDAY'
      | 'SATURDAY';

    const safeClasses = Array.isArray(classes) ? classes : [];
    const safeVenues = Array.isArray(venues) ? venues : [];
    const safeTeachers = Array.isArray(teachers) ? teachers : [];

    // Check venue availability
    const unavailableVenues = safeClasses
      .filter((cls) => {
        return cls.meeting_times?.some(
          (mt) =>
            mt.day_of_week === dayString &&
            mt.start_time === startTime.format('HH:mm') &&
            mt.end_time === endTime.format('HH:mm')
        );
      })
      .map(
        (cls) =>
          cls.meeting_times?.find(
            (mt) =>
              mt.day_of_week === dayString &&
              mt.start_time === startTime.format('HH:mm') &&
              mt.end_time === endTime.format('HH:mm')
          )?.venue_id
      )
      .filter(Boolean);

    const availableVenues = safeVenues.filter(
      (venue) => !unavailableVenues.includes(venue.id?.toString())
    );
    setAvailableVenues(availableVenues);

    // Check teacher availability
    const unavailableTeachers = safeClasses
      .filter((cls) => {
        return cls.meeting_times?.some(
          (mt) =>
            mt.day_of_week === dayString &&
            mt.start_time === startTime.format('HH:mm') &&
            mt.end_time === endTime.format('HH:mm')
        );
      })
      .map((cls) => cls.instructor_id)
      .filter(Boolean);

    const availableTeachers = safeTeachers.filter(
      (teacher) => !unavailableTeachers.includes(teacher.id?.toString())
    );
    setAvailableTeachers(availableTeachers);
  };

  const handleCreateClass = async (values: any) => {
    console.log('Creating class with values:', values);

    // Get the actual date and time values from the form
    const classDate = values.class_date;
    const classTime = values.class_time;

    if (!classDate || !classTime || !classTime[0] || !classTime[1]) {
      message.error('Please select both date and time');
      return;
    }

    try {
      setLoading(true);

      const [startTime, endTime] = classTime;
      const dayNames = [
        'SUNDAY',
        'MONDAY',
        'TUESDAY',
        'WEDNESDAY',
        'THURSDAY',
        'FRIDAY',
        'SATURDAY',
      ];
      const dayString = dayNames[classDate.day()] as
        | 'SUNDAY'
        | 'MONDAY'
        | 'TUESDAY'
        | 'WEDNESDAY'
        | 'THURSDAY'
        | 'FRIDAY'
        | 'SATURDAY';

      // Single API call with all data including meeting date
      const requestData = {
        course_id: values.course_id,
        year_id: values.year_id,
        semester_id: values.semester_id,
        section_code: values.section_code,
        instructor_id: values.instructor_id,
        max_capacity: parseInt(values.capacity),
        delivery_mode: 'IN_PERSON',
        status: 'PLANNED',

        // Meeting time details
        day_of_week: dayString,
        start_time: startTime.format('HH:mm'),
        end_time: endTime.format('HH:mm'),
        venue_id: values.venue_id,

        // Meeting date details
        meeting_date: classDate.format('YYYY-MM-DD'),
        is_recurring: false,
        recurrence_pattern: '',
      };

      console.log('Sending request to backend:', requestData);

      // Call the new combined API endpoint
      const response = await fetch(
        'http://103.189.173.7:8080/api/v1/admin/academics/classes/with-meeting-time',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(requestData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create class');
      }

      const result = await response.json();
      console.log('Class and meeting time created:', result);

      message.success('Class created successfully!');
      setIsCreateClassModalVisible(false);
      createClassForm.resetFields();

      // Reset form states
      setSelectedYear('');
      setSelectedSemester('');
      setSelectedProgram('');
      setSelectedCampus('');
      setSelectedDateForClass(null);
      setSelectedTimeRange(null);

      // Refresh only classes data to show new class in calendar (much faster)
      await refreshClassesOnly();
    } catch (error: any) {
      console.error('Error creating class:', error);

      // Handle specific database errors
      if (error.message && error.message.includes('duplicated key')) {
        message.error(
          'A class with this combination already exists. Please use a different section code or check for duplicates.'
        );
      } else if (error.message && error.message.includes('constraint')) {
        message.error(
          'Database constraint violation. Please check your input data.'
        );
      } else {
        message.error(`Failed to create class: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const calendarEvents = useMemo((): CalendarEvent[] => {
    // Skip calculation during modal operations to prevent unnecessary re-renders
    if (isModalOperation) {
      return [];
    }

    const safeClasses = Array.isArray(classes) ? classes : [];
    const events: CalendarEvent[] = [];

    safeClasses.forEach((cls) => {
      // Check if class has meeting time data
      if (!cls.day_of_week || !cls.start_time || !cls.end_time) {
        return;
      }

      // Parse the meeting date
      let eventDate;
      if (cls.meeting_date) {
        eventDate = dayjs(cls.meeting_date);
      } else {
        return;
      }

      // Parse time from HH:mm format
      const [startHour, startMinute] = cls.start_time.split(':').map(Number);
      const [endHour, endMinute] = cls.end_time.split(':').map(Number);

      if (
        isNaN(startHour) ||
        isNaN(startMinute) ||
        isNaN(endHour) ||
        isNaN(endMinute)
      ) {
        return;
      }

      // Create event start and end times
      const eventStart = eventDate.hour(startHour).minute(startMinute);
      const eventEnd = eventDate.hour(endHour).minute(endMinute);

      const event: CalendarEvent = {
        id: `${cls.id}`,
        title: `${cls.course?.class_code || cls.course?.name || 'Unknown Course'} - ${cls.class_code || 'Unknown Section'}`,
        start: eventStart,
        end: eventEnd,
        class: cls,
        type: 'CLASS', // Mark as class
        section_code: cls.section_code || '', // Add section code for color logic
        meetingTime: {
          id: cls.id,
          day_of_week: cls.day_of_week,
          start_time: cls.start_time,
          end_time: cls.end_time,
          venue_id: cls.venue?.id,
          venue: cls.venue,
        },
      };

      events.push(event);
    });

    return events;
  }, [classes, isModalOperation]); // Include isModalOperation to prevent recalculations

  // Function to get calendar events (for backward compatibility)
  const getCalendarEvents = (): CalendarEvent[] => calendarEvents;

  // Weekly navigation functions
  const goToPreviousWeek = () => {
    setCurrentWeek((prev) => prev.subtract(1, 'week'));
  };

  const goToNextWeek = () => {
    setCurrentWeek((prev) => prev.add(1, 'week'));
  };

  const goToCurrentWeek = () => {
    setCurrentWeek(dayjs());
  };

  // Monthly navigation functions
  const goToPreviousMonth = () => {
    setCurrentMonth((prev) => prev.subtract(1, 'month'));
  };

  const goToNextMonth = () => {
    setCurrentMonth((prev) => prev.add(1, 'month'));
  };

  const goToCurrentMonth = () => {
    setCurrentMonth(dayjs());
  };

  // Daily navigation functions
  const goToPreviousDay = () => {
    setCurrentDay((prev) => prev.subtract(1, 'day'));
  };

  const goToNextDay = () => {
    setCurrentDay((prev) => prev.add(1, 'day'));
  };

  const goToCurrentDay = () => {
    setCurrentDay(dayjs());
  };

  const renderWeeklyView = () => {
    const events = getCalendarEvents();
    const weekDays = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const timeSlots = Array.from({ length: 24 }, (_, i) => i); // 0 AM to 11 PM (24 hours)

    const safeEvents = Array.isArray(events) ? events : [];
    const weekStart = currentWeek.startOf('week');
    const weekEnd = currentWeek.endOf('week');

    return (
      <div className="weekly-calendar">
        <div className="calendar-header">
          {/* <Button icon={<CalendarOutlined />} onClick={goToCurrentWeek}>This Week</Button> */}
          <Select
            prefix={<CalendarOutlined />}
            className="view-select-calender"
            value={viewMode}
            onChange={(value) => setViewMode(value)}
            suffixIcon={<DownOutlined />}
          >
            <Option value="daily">Daily</Option>
            <Option value="weekly">Weekly</Option>
            <Option value="monthly">Month</Option>
          </Select>
          <div className="calendar-navigation">
            <Button
              className="month-navigate-btn"
              icon={<LeftOutlined />}
              onClick={goToPreviousWeek}
            ></Button>
            <h2>
              Weekly Schedule - {weekStart.format('MMM D')} to{' '}
              {weekEnd.format('MMM D, YYYY')}
            </h2>
            <Button
              className="month-navigate-btn"
              icon={<RightOutlined />}
              onClick={goToNextWeek}
            ></Button>
          </div>
          <Button className="today-button" onClick={goToCurrentDay}>
            Today
          </Button>
        </div>

        <div className="calendar-grid">
          <div className="time-column">
            <div className="time-header"></div>
            {timeSlots.map((hour) => (
              <div key={hour} className="time-slot">
                {hour === 0
                  ? '12 AM'
                  : hour === 12
                    ? '12 PM'
                    : hour > 12
                      ? `${hour - 12} PM`
                      : `${hour} AM`}
              </div>
            ))}
          </div>

          {weekDays.map((day, dayIndex) => (
            <div key={day} className="day-column">
              <div className="day-header">{day}</div>
              {timeSlots.map((hour) => {
                const hourEvents = safeEvents.filter((event) => {
                  // Get the event date
                  const eventDate = event.start;

                  // Get current week start and end
                  const weekStart = currentWeek.startOf('week');
                  const weekEnd = currentWeek.endOf('week');

                  // Check if event is in the current week
                  const isInCurrentWeek =
                    (eventDate.isSame(weekStart, 'day') ||
                      eventDate.isAfter(weekStart, 'day')) &&
                    (eventDate.isSame(weekEnd, 'day') ||
                      eventDate.isBefore(weekEnd, 'day'));

                  // Get the day of week for the event (0 = Sunday, 1 = Monday, etc.)
                  const eventDayOfWeek = eventDate.day();

                  // Check if event matches the current column day
                  const currentColumnDay = dayIndex; // 0 = Sunday, 1 = Monday, etc.
                  const matchesDay = eventDayOfWeek === currentColumnDay;

                  // Check if event matches the current hour
                  const matchesHour = eventDate.hour() === hour;

                  const shouldShow =
                    isInCurrentWeek && matchesDay && matchesHour;

                  return shouldShow;
                });

                return (
                  <div
                    key={hour}
                    className="time-slot"
                    style={{
                      cursor: hourEvents.length > 0 ? 'pointer' : 'default',
                      position: 'relative',
                    }}
                    onClick={() => {
                      if (hourEvents.length > 0) {
                        // Show all events for this time slot in a modal
                        setSelectedClassForDetails({
                          id: `week-${day}-${hour}`,
                          section_code: `${day} ${hour === 0 ? '12 AM' : hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}`,
                          course: {
                            name: `${hourEvents.length} Event(s)`,
                            code: '',
                          },
                          instructor: { first_name: '', last_name: '' },
                          venue: { name: 'Multiple Venues' },
                          campus: { name: 'Multiple Campuses' },
                          max_capacity: hourEvents.length,
                          day_of_week: day.toUpperCase(),
                          start_time:
                            hourEvents[0]?.start.format('HH:mm') || '',
                          end_time:
                            hourEvents[hourEvents.length - 1]?.end.format(
                              'HH:mm'
                            ) || '',
                          meeting_times: hourEvents.map((event) => ({
                            id: event.id,
                            day_of_week: event.start
                              .format('dddd')
                              .toUpperCase(),
                            start_time: event.start.format('HH:mm'),
                            end_time: event.end.format('HH:mm'),
                            venue_id: event.meetingTime.venue_id,
                            venue: event.meetingTime.venue,
                          })),
                          // Add custom properties for week view
                          _hourEvents: hourEvents,
                          _day: day,
                          _hour: hour,
                        } as any);
                        setIsClassDetailsModalVisible(true);
                      }
                    }}
                  >
                    {hourEvents.length > 0 ? (
                      hourEvents.map((event) => {
                        console.log(event, 'eventeventeventevent');
                        const colors = getEventColors(event.section_code);

                        return (
                          <div
                            key={event.id}
                            className="calendar-event"
                            style={{
                              background: colors.background,
                              color: '#000',
                              padding: '12px',
                              borderRadius: '10px',
                              marginBottom: '8px',
                              border: 'none',
                              borderLeft: colors.border,
                              position: 'relative',
                              transition: 'all 0.3s ease',
                              textAlign: 'left',
                            }}
                          >
                            {/* Event type indicator */}
                            {/* <span style={{
                              position: 'absolute',
                              top: '8px',
                              right: '8px',
                              fontSize: '12px',
                              opacity: '0.9'
                            }}>
                              {colors.icon}
                            </span>*/}
                            <div
                              className="event-title"
                              style={{
                                fontWeight: '600',
                                marginBottom: '8px',
                                fontSize: '14px',
                              }}
                            >
                              {event.title}
                            </div>
                            <div
                              className="event-details"
                              style={{
                                fontSize: '12px',
                                opacity: '0.9',
                                marginBottom: '4px',
                              }}
                            >
                              {event.class.teacher?.first_name &&
                              event.class.teacher?.last_name
                                ? `${event.class.teacher.first_name} ${event.class.teacher.last_name}`
                                : event.class.instructor?.first_name &&
                                    event.class.instructor?.last_name
                                  ? `${event.class.instructor.first_name} ${event.class.instructor.last_name}`
                                  : 'Unknown Teacher'}
                            </div>
                            <div
                              className="event-location"
                              style={{
                                fontSize: '12px',
                                opacity: '0.8',
                                marginBottom: '4px',
                              }}
                            >
                              {event.meetingTime.venue?.name || 'Unknown Venue'}
                            </div>
                            <div
                              className="event-time"
                              style={{
                                fontSize: '12px',
                                opacity: '0.8',
                                fontWeight: '500',
                              }}
                            >
                              {event.start.format('HH:mm')} -{' '}
                              {event.end.format('HH:mm')}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div style={{ color: '#ccc', fontSize: '10px' }}></div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderMonthlyView = () => {
    const events = getCalendarEvents();
    const safeEvents = Array.isArray(events) ? events : [];

    return (
      <div className="monthly-calendar">
        <div className="calendar-header">
          {/* <Button icon={<CalendarOutlined />} onClick={goToCurrentMonth}  >This Month</Button> */}
          <Select
            prefix={<CalendarOutlined />}
            className="view-select-calender"
            value={viewMode}
            onChange={(value) => setViewMode(value)}
            suffixIcon={<DownOutlined />}
          >
            <Option value="daily">Daily</Option>
            <Option value="weekly">Weekly</Option>
            <Option value="monthly">Month</Option>
          </Select>
          <div
            className="calendar-navigation"
            style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
          >
            <Button
              className="month-navigate-btn"
              icon={<LeftOutlined />}
              onClick={goToPreviousMonth}
            ></Button>
            <h2>Monthly Schedule - {currentMonth.format('MMMM YYYY')}</h2>
            <Button
              className="month-navigate-btn"
              icon={<RightOutlined />}
              onClick={goToNextMonth}
            ></Button>
          </div>
          <Button className="today-button" onClick={goToCurrentDay}>
            Today
          </Button>
        </div>

        <AntCalendar
          value={currentMonth}
          onChange={setCurrentMonth}
          className="ant-calendar-monthly-main"
          style={{
            border: '1px solid #e9ecef',
          }}
          dateCellRender={(date) => {
            const dayEvents = safeEvents.filter((event) => {
              const eventDate = event.start;
              const isSameDay = eventDate.isSame(date, 'day');

              return isSameDay;
            });

            return (
              <div
                className="monthly-events"
                style={{
                  padding: '2px',
                  cursor: dayEvents.length > 0 ? 'pointer' : 'default',
                  minHeight: '60px',
                }}
                onClick={() => {
                  if (dayEvents.length > 0) {
                    // Show all events for this day in a modal
                    setSelectedClassForDetails({
                      id: `day-${date.format('YYYY-MM-DD')}`,
                      section_code: `Day: ${date.format('DD MMM YYYY')}`,
                      course: {
                        name: `${dayEvents.length} Event(s)`,
                        code: '',
                      },
                      instructor: { first_name: '', last_name: '' },
                      venue: { name: 'Multiple Venues' },
                      campus: { name: 'Multiple Campuses' },
                      max_capacity: dayEvents.length,
                      day_of_week: date.format('dddd').toUpperCase(),
                      start_time: dayEvents[0]?.start.format('HH:mm') || '',
                      end_time:
                        dayEvents[dayEvents.length - 1]?.end.format('HH:mm') ||
                        '',
                      meeting_times: dayEvents.map((event) => ({
                        id: event.id,
                        day_of_week: event.start.format('dddd').toUpperCase(),
                        start_time: event.start.format('HH:mm'),
                        end_time: event.end.format('HH:mm'),
                        venue_id: event.meetingTime.venue_id,
                        venue: event.meetingTime.venue,
                      })),
                      // Add custom properties for day view
                      _dayEvents: dayEvents,
                      _date: date.format('YYYY-MM-DD'),
                    } as any);
                    setIsClassDetailsModalVisible(true);
                  }
                }}
              >
                {dayEvents.slice(0, 2).map((event) => {
                  const colors = getEventColors(event.section_code);

                  return (
                    <div
                      key={event.id}
                      className="monthly-event clickable"
                      onClick={() => handleClassClick(event.class)}
                      style={{
                        cursor: 'pointer',
                        background: colors.background,
                        color: '#000',
                        padding: '4px 8px',
                        marginBottom: '8px',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontWeight: '600',
                        border: 'none',
                        borderLeft: colors.border,
                        transition: 'all 0.3s ease',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        lineHeight: '1.2',
                        position: 'relative',
                      }}
                      // onMouseEnter={(e) => {
                      //   e.currentTarget.style.background = colors.hoverBackground;
                      //   e.currentTarget.style.transform = 'scale(1.05)';
                      //   e.currentTarget.style.color = colors.hovercolor;
                      // }}
                      // onMouseLeave={(e) => {
                      //   e.currentTarget.style.background = colors.background;
                      //   e.currentTarget.style.transform = 'scale(1)';
                      //   e.currentTarget.style.color = colors.hovercolor;
                      // }}
                      title={`${event.type === 'CLASS' ? '📚 Class' : '🎉 Event'}: ${event.title}`}
                    >
                      {/* Event type indicator */}
                      <span
                        style={{
                          position: 'absolute',
                          top: '2px',
                          right: '4px',
                          fontSize: '8px',
                          opacity: '0.8',
                        }}
                      >
                        {/* {colors.icon} */}
                      </span>
                      {event.title}
                    </div>
                  );
                })}
                {dayEvents.length > 2 && (
                  <div
                    style={{
                      fontSize: '10px',
                      color: '#666',
                      textAlign: 'center',
                      padding: '3px 8px',
                      backgroundColor: '#f0f0f0',
                      borderRadius: '4px',
                      border: '1px dashed #d9d9d9',
                      cursor: 'pointer',
                      marginTop: '2px',
                    }}
                  >
                    +{dayEvents.length - 2} more
                  </div>
                )}
              </div>
            );
          }}
        />
      </div>
    );
  };

  const renderDailyView = () => {
    const events = getCalendarEvents();
    const safeEvents = Array.isArray(events) ? events : [];
    const timeSlots = Array.from({ length: 24 }, (_, i) => i); // 0 AM to 11 PM (24 hours)

    const dayEvents = safeEvents.filter((event) => {
      const eventDate = event.start;
      const isSameDay = eventDate.isSame(currentDay, 'day');

      return isSameDay;
    });

    return (
      <div className="daily-calendar">
        <div className="calendar-header">
          <Select
            prefix={<CalendarOutlined />}
            className="view-select-calender"
            value={viewMode}
            onChange={(value) => setViewMode(value)}
            suffixIcon={<DownOutlined />}
          >
            <Option value="daily">Daily</Option>
            <Option value="weekly">Weekly</Option>
            <Option value="monthly">Month</Option>
          </Select>
          <div className="calendar-navigation">
            <Button
              className="month-navigate-btn"
              icon={<LeftOutlined />}
              onClick={goToPreviousDay}
            ></Button>
            <h2>Daily Schedule - {currentDay.format('dddd, MMMM D, YYYY')}</h2>
            <Button
              className="month-navigate-btn"
              icon={<RightOutlined />}
              onClick={goToNextDay}
            ></Button>
          </div>
          <Button
            className="today-button"
            icon={<CalendarOutlined />}
            onClick={goToCurrentDay}
          >
            Today
          </Button>
        </div>

        <div className="daily-time-grid">
          <div className="time-column">
            <div className="time-header"></div>
            {timeSlots.map((hour) => (
              <div key={hour} className="time-slot">
                {hour === 0
                  ? '12 AM'
                  : hour === 12
                    ? '12 PM'
                    : hour > 12
                      ? `${hour - 12} PM`
                      : `${hour} AM`}
              </div>
            ))}
          </div>

          <div className="events-column">
            <div className="day-header">Monday</div>
            {timeSlots.map((hour) => {
              const hourEvents = dayEvents.filter((event) => {
                const eventHour = event.start.hour();
                const matchesHour = eventHour === hour;

                return matchesHour;
              });

              return (
                <div
                  key={hour}
                  className="time-slot daytimeing-list"
                  style={{
                    cursor: hourEvents.length > 0 ? 'pointer' : 'default',
                    position: 'relative',
                  }}
                  onClick={() => {
                    if (hourEvents.length > 0) {
                      // Show all events for this time slot in a modal
                      setSelectedClassForDetails({
                        id: `daily-${currentDay.format('YYYY-MM-DD')}-${hour}`,
                        section_code: `${currentDay.format('dddd')} ${hour === 0 ? '12 AM' : hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}`,
                        course: {
                          name: `${hourEvents.length} Event(s)`,
                          code: '',
                        },
                        instructor: { first_name: '', last_name: '' },
                        venue: { name: 'Multiple Venues' },
                        campus: { name: 'Multiple Campuses' },
                        max_capacity: hourEvents.length,
                        day_of_week: currentDay.format('dddd').toUpperCase(),
                        start_time: hourEvents[0]?.start.format('HH:mm') || '',
                        end_time:
                          hourEvents[hourEvents.length - 1]?.end.format(
                            'HH:mm'
                          ) || '',
                        meeting_times: hourEvents.map((event) => ({
                          id: event.id,
                          day_of_week: event.start.format('dddd').toUpperCase(),
                          start_time: event.start.format('HH:mm'),
                          end_time: event.end.format('HH:mm'),
                          venue_id: event.meetingTime.venue_id,
                          venue: event.meetingTime.venue,
                        })),
                        // Add custom properties for daily view
                        _hourEvents: hourEvents,
                        _date: currentDay.format('YYYY-MM-DD'),
                        _hour: hour,
                      } as any);
                      setIsClassDetailsModalVisible(true);
                    }
                  }}
                >
                  {hourEvents.length > 0 ? (
                    hourEvents.map((event) => {
                      const colors = getEventColors(event.section_code);

                      return (
                        <div
                          key={event.id}
                          className="daily-event-item"
                          style={{
                            background: colors.background,
                            color: '#000',
                            padding: '12px',
                            borderRadius: '8px',
                            marginBottom: '8px',
                            border: 'none',
                            textAlign: 'left',
                            borderLeft: colors.border,
                            position: 'relative',
                            transition: 'all 0.3s ease',
                          }}
                        >
                          {/* Event type indicator */}
                          {/*  <span style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            fontSize: '12px',
                            opacity: '0.9'
                          }}>
                            {colors.icon}
                          </span>*/}

                          <div
                            className="event-title"
                            style={{
                              fontWeight: '600',
                              marginBottom: '8px',
                              fontSize: '14px',
                            }}
                          >
                            {event.title}
                          </div>
                          <div className="event-details">
                            <div
                              className="event-time"
                              style={{
                                fontSize: '12px',
                                opacity: '0.9',
                                marginBottom: '4px',
                              }}
                            >
                              <ClockCircleOutlined />{' '}
                              {event.start.format('HH:mm')} -{' '}
                              {event.end.format('HH:mm')}
                            </div>
                            <div
                              className="event-teacher"
                              style={{
                                fontSize: '12px',
                                opacity: '0.8',
                                marginBottom: '4px',
                              }}
                            >
                              <UserOutlined />{' '}
                              {event.class.teacher?.first_name &&
                              event.class.teacher?.last_name
                                ? `${event.class.teacher.first_name} ${event.class.teacher.last_name}`
                                : event.class.instructor?.first_name &&
                                    event.class.instructor?.last_name
                                  ? `${event.class.instructor.first_name} ${event.class.instructor.last_name}`
                                  : 'Unknown Teacher'}
                            </div>
                            <div
                              className="event-venue"
                              style={{
                                fontSize: '12px',
                                opacity: '0.8',
                              }}
                            >
                              <EnvironmentOutlined />{' '}
                              {event.meetingTime.venue?.name || 'Unknown Venue'}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div
                      style={{
                        color: '#ccc',
                        fontSize: '12px',
                        textAlign: 'center',
                      }}
                    ></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {dayEvents.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '40px',
              color: '#666',
              marginTop: '20px',
            }}
          >
            <p>
              No classes scheduled for {currentDay.format('dddd, MMMM D, YYYY')}
            </p>
            <p style={{ fontSize: '14px', marginTop: '10px' }}>
              Available events: {safeEvents.length} total
            </p>
          </div>
        )}
      </div>
    );
  };

  const applyFilters = async () => {
    console.log('Applying filters...');
    console.log('Selected Program:', selectedProgram);
    console.log('Selected Year:', selectedYear);
    console.log('Selected Semester:', selectedSemester);
    console.log('Selected Course:', selectedCourse);
    console.log('Selected Campus:', selectedCampus);
    console.log('Selected Venue:', selectedVenue);
    console.log('Selected Teacher:', selectedTeacher);

    try {
      setLoading(true);

      console.log('Applying filters to API...');

      // Make API call with filters
      const response = await classAPI.getAllClasses({
        semester_id: selectedSemester || '',
        year_id: selectedYear || undefined,
        instructor_id: selectedTeacher || undefined,
        course_code: selectedCourse || undefined,
        delivery_mode: undefined,
        status: undefined,
        day_of_week: undefined,
        available_seats: undefined,
        department_id: undefined,
      });

      if (response?.data) {
        setClasses(response.data);
        message.success(
          `Found ${response.data.length} classes matching your filters`
        );
        console.log('Filtered classes loaded:', response.data.length);
      } else {
        setClasses([]);
        message.info('No classes found matching your filters');
      }
    } catch (error) {
      console.error('Error applying filters:', error);
      message.error('Failed to apply filters. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = async () => {
    console.log('Clearing filters...');
    setSelectedProgram('');
    setSelectedYear('');
    setSelectedSemester('');
    setSelectedCourse('');
    setSelectedCampus('');
    setSelectedVenue('');
    setSelectedTeacher('');

    try {
      setLoading(true);
      // After clearing filters, refresh only classes data (much faster)
      await refreshClassesOnly();
      message.success('All filters cleared. Showing all classes.');
    } catch (error) {
      console.error('Error clearing filters:', error);
      message.error('Failed to clear filters. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClassClick = (cls: Class) => {
    setSelectedClassForDetails(cls);
    setIsClassDetailsModalVisible(true);
  };

  const addNewClassForm = () => {
    const newForm: ClassFormData = {
      id: `class-${Date.now()}-${Math.random()}`,
      section_code: '',
      course_id: '',
      instructor_id: '',
      venue_id: '',
      campus_id: '',
      capacity: '',
      class_date: null,
      class_time: null,
      is_recurring: false,
      recurrence_pattern: '',
      recurrence_end_date: null,
    };
    setClassForms((prev) => [...prev, newForm]);
  };

  const removeClassForm = (formId: string) => {
    setClassForms((prev) => prev.filter((form) => form.id !== formId));
  };

  const updateClassForm = (
    formId: string,
    field: keyof ClassFormData,
    value: any
  ) => {
    setClassForms((prev) =>
      prev.map((form) =>
        form.id === formId ? { ...form, [field]: value } : form
      )
    );
  };

  const handleCreateMultipleClasses = async () => {
    // Validate that program, year, and semester are selected
    if (!selectedProgram || !selectedYear || !selectedSemester) {
      message.error('Please select Program, Year, and Semester first');
      return;
    }

    // Validate that at least one class form has data
    const validForms = classForms.filter((form) => {
      const hasBasicFields =
        form.section_code &&
        form.course_id &&
        form.instructor_id &&
        form.venue_id &&
        form.campus_id &&
        form.capacity &&
        form.class_date &&
        form.class_time;

      // If recurring, also validate recurrence pattern
      if (form.is_recurring) {
        return hasBasicFields && form.recurrence_pattern;
      }

      return hasBasicFields;
    });

    if (validForms.length === 0) {
      message.error('Please fill in at least one complete class form');
      return;
    }

    try {
      setLoading(true);

      // Prepare array of all class data - Generate all instances for recurring classes

      const allClassesData: ClassInstanceData[] = [];

      validForms.forEach((form) => {
        if (form.is_recurring && form.recurrence_pattern && form.class_date) {
          // Generate all recurring instances
          const endDate = form.recurrence_end_date || dayjs().add(6, 'months');
          const instances = generateRecurringInstances(
            form,
            form.class_date,
            endDate
          );
          // Add is_recurring flag to all instances
          instances.forEach((instance) => {
            instance.is_recurring = true;
          });
          allClassesData.push(...instances);
        } else {
          // Single class - create one instance
          const [startTime, endTime] = form.class_time!;
          const dayNames = [
            'SUNDAY',
            'MONDAY',
            'TUESDAY',
            'WEDNESDAY',
            'THURSDAY',
            'FRIDAY',
            'SATURDAY',
          ];
          const dayString = dayNames[form.class_date!.day()] as
            | 'SUNDAY'
            | 'MONDAY'
            | 'TUESDAY'
            | 'WEDNESDAY'
            | 'THURSDAY'
            | 'FRIDAY'
            | 'SATURDAY';

          allClassesData.push({
            course_id: form.course_id,
            year_id: selectedYear,
            semester_id: selectedSemester,
            section_code: form.section_code,
            instructor_id: form.instructor_id,
            max_capacity: parseInt(form.capacity),
            delivery_mode: 'IN_PERSON',
            status: 'PLANNED',
            day_of_week: dayString,
            start_time: startTime.format('HH:mm'),
            end_time: endTime.format('HH:mm'),
            venue_id: form.venue_id,
            campus_id: form.campus_id,
            meeting_date: form.class_date!.format('YYYY-MM-DD'),
            is_recurring: false,
          });
        }
      });

      // Prepare the complete request payload - Simple structure
      const requestPayload = {
        classes: allClassesData,
        global_settings: {
          program_id: selectedProgram,
          year_id: selectedYear,
          semester_id: selectedSemester,
        },
      };

      console.log('Sending bulk classes data to API:', requestPayload);

      // Show preview of what will be created
      message.info(`📋 Creating ${allClassesData.length} class(es)`);

      // Single API call with all classes data
      const response = await fetch(
        'http://103.189.173.7:8080/api/v1/admin/academics/classes/bulk-create',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(requestPayload),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log('All classes created successfully:', result);

        // Show success summary
        const recurringCount = allClassesData.filter(
          (c) => c.is_recurring
        ).length;
        const oneTimeCount = allClassesData.filter(
          (c) => !c.is_recurring
        ).length;

        let summaryMessage = `✅ Successfully created ${allClassesData.length} class(es)!`;
        if (recurringCount > 0) {
          summaryMessage += ` (${recurringCount} recurring, ${oneTimeCount} one-time)`;
        }

        message.success(summaryMessage);

        // Show detailed results if available
        if (result.data && result.data.classes_created) {
          console.log('Classes created:', result.data.classes_created);

          // Show individual class results
          result.data.classes_created.forEach((classResult: any) => {
            if (classResult.success) {
              if (classResult.is_recurring) {
                message.success(
                  `✅ ${classResult.section_code}: ${classResult.instances_created} instances created with ${classResult.recurrence_pattern} pattern`
                );
              } else {
                message.success(
                  `✅ ${classResult.section_code}: Class created successfully`
                );
              }
            } else {
              message.error(
                `❌ ${classResult.section_code}: ${classResult.error}`
              );
            }
          });
        }

        // Reset and close modal
        setIsCreateClassModalVisible(false);
        setClassForms([]);
        setSelectedYear('');
        setSelectedSemester('');
        setSelectedProgram('');

        // Force refresh calendar to show new classes immediately
        await refreshClassesOnly();
      } else {
        const errorData = await response.json();
        console.error('Failed to create classes:', errorData);
        message.error(
          `❌ Failed to create classes: ${errorData.error || 'Unknown error'}`
        );
      }
    } catch (error: any) {
      console.error('Error creating multiple classes:', error);
      message.error(
        `❌ Error creating classes: ${error.message || 'Unknown error'}`
      );
    } finally {
      setLoading(false);
    }
  };

  const resetClassForms = () => {
    setClassForms([]);
    setSelectedYear('');
    setSelectedSemester('');
    setSelectedProgram('');
    addNewClassForm();
  };

  // Function to generate recurring instances based on pattern
  const generateRecurringInstances = (
    form: ClassFormData,
    startDate: Dayjs,
    endDate: Dayjs
  ): ClassInstanceData[] => {
    const instances: ClassInstanceData[] = [];
    let currentDate = startDate.clone();

    // Get the day of week for the start date
    const dayOfWeek = startDate.day();
    const [startTime, endTime] = form.class_time!;

    switch (form.recurrence_pattern) {
      case 'WEEKLY':
        while (
          currentDate.isBefore(endDate) ||
          currentDate.isSame(endDate, 'day')
        ) {
          instances.push({
            course_id: form.course_id,
            year_id: selectedYear,
            semester_id: selectedSemester,
            section_code: form.section_code,
            instructor_id: form.instructor_id,
            max_capacity: parseInt(form.capacity),
            delivery_mode: 'IN_PERSON',
            status: 'PLANNED',
            day_of_week: [
              'SUNDAY',
              'MONDAY',
              'TUESDAY',
              'WEDNESDAY',
              'THURSDAY',
              'FRIDAY',
              'SATURDAY',
            ][dayOfWeek],
            start_time: startTime.format('HH:mm'),
            end_time: endTime.format('HH:mm'),
            venue_id: form.venue_id,
            campus_id: form.campus_id,
            meeting_date: currentDate.format('YYYY-MM-DD'),
            is_recurring: true,
          });
          currentDate = currentDate.add(1, 'week');
        }
        break;

      case 'BIWEEKLY':
        while (
          currentDate.isBefore(endDate) ||
          currentDate.isSame(endDate, 'day')
        ) {
          instances.push({
            course_id: form.course_id,
            year_id: selectedYear,
            semester_id: selectedSemester,
            section_code: form.section_code,
            instructor_id: form.instructor_id,
            max_capacity: parseInt(form.capacity),
            delivery_mode: 'IN_PERSON',
            status: 'PLANNED',
            day_of_week: [
              'SUNDAY',
              'MONDAY',
              'TUESDAY',
              'WEDNESDAY',
              'THURSDAY',
              'FRIDAY',
              'SATURDAY',
            ][dayOfWeek],
            start_time: startTime.format('HH:mm'),
            end_time: endTime.format('HH:mm'),
            venue_id: form.venue_id,
            campus_id: form.campus_id,
            meeting_date: currentDate.format('YYYY-MM-DD'),
            is_recurring: true,
          });
          currentDate = currentDate.add(2, 'week');
        }
        break;

      case 'MONTHLY':
        while (
          currentDate.isBefore(endDate) ||
          currentDate.isSame(endDate, 'day')
        ) {
          instances.push({
            course_id: form.course_id,
            year_id: selectedYear,
            semester_id: selectedSemester,
            section_code: form.section_code,
            instructor_id: form.instructor_id,
            max_capacity: parseInt(form.capacity),
            delivery_mode: 'IN_PERSON',
            status: 'PLANNED',
            day_of_week: [
              'SUNDAY',
              'MONDAY',
              'TUESDAY',
              'WEDNESDAY',
              'THURSDAY',
              'FRIDAY',
              'SATURDAY',
            ][dayOfWeek],
            start_time: startTime.format('HH:mm'),
            end_time: endTime.format('HH:mm'),
            venue_id: form.venue_id,
            campus_id: form.campus_id,
            meeting_date: currentDate.format('YYYY-MM-DD'),
            is_recurring: true,
          });
          currentDate = currentDate.add(1, 'month');
        }
        break;

      case 'WEEKDAYS':
        while (
          currentDate.isBefore(endDate) ||
          currentDate.isSame(endDate, 'day')
        ) {
          const currentDay = currentDate.day();
          if (currentDay >= 1 && currentDay <= 5) {
            // Monday to Friday
            instances.push({
              course_id: form.course_id,
              year_id: selectedYear,
              semester_id: selectedSemester,
              section_code: form.section_code,
              instructor_id: form.instructor_id,
              max_capacity: parseInt(form.capacity),
              delivery_mode: 'IN_PERSON',
              status: 'PLANNED',
              day_of_week: [
                'SUNDAY',
                'MONDAY',
                'TUESDAY',
                'WEDNESDAY',
                'THURSDAY',
                'FRIDAY',
                'SATURDAY',
              ][currentDay],
              start_time: startTime.format('HH:mm'),
              end_time: endTime.format('HH:mm'),
              venue_id: form.venue_id,
              campus_id: form.campus_id,
              meeting_date: currentDate.format('YYYY-MM-DD'),
              is_recurring: true,
            });
          }
          currentDate = currentDate.add(1, 'day');
        }
        break;

      case 'MONDAY_WEDNESDAY_FRIDAY':
        while (
          currentDate.isBefore(endDate) ||
          currentDate.isSame(endDate, 'day')
        ) {
          const currentDay = currentDate.day();
          if (currentDay === 1 || currentDay === 3 || currentDay === 5) {
            // Monday, Wednesday, Friday
            instances.push({
              course_id: form.course_id,
              year_id: selectedYear,
              semester_id: selectedSemester,
              section_code: form.section_code,
              instructor_id: form.instructor_id,
              max_capacity: parseInt(form.capacity),
              delivery_mode: 'IN_PERSON',
              status: 'PLANNED',
              day_of_week: [
                'SUNDAY',
                'MONDAY',
                'TUESDAY',
                'WEDNESDAY',
                'THURSDAY',
                'FRIDAY',
                'SATURDAY',
              ][currentDay],
              start_time: startTime.format('HH:mm'),
              end_time: endTime.format('HH:mm'),
              venue_id: form.venue_id,
              campus_id: form.campus_id,
              meeting_date: currentDate.format('YYYY-MM-DD'),
              is_recurring: true,
            });
          }
          currentDate = currentDate.add(1, 'day');
        }
        break;

      case 'TUESDAY_THURSDAY':
        while (
          currentDate.isBefore(endDate) ||
          currentDate.isSame(endDate, 'day')
        ) {
          const currentDay = currentDate.day();
          if (currentDay === 2 || currentDay === 4) {
            // Tuesday, Thursday
            instances.push({
              course_id: form.course_id,
              year_id: selectedYear,
              semester_id: selectedSemester,
              section_code: form.section_code,
              instructor_id: form.instructor_id,
              max_capacity: parseInt(form.capacity),
              delivery_mode: 'IN_PERSON',
              status: 'PLANNED',
              day_of_week: [
                'SUNDAY',
                'MONDAY',
                'TUESDAY',
                'WEDNESDAY',
                'THURSDAY',
                'FRIDAY',
                'SATURDAY',
              ][currentDay],
              start_time: startTime.format('HH:mm'),
              end_time: endTime.format('HH:mm'),
              venue_id: form.venue_id,
              campus_id: form.campus_id,
              meeting_date: currentDate.format('YYYY-MM-DD'),
              is_recurring: true,
            });
          }
          currentDate = currentDate.add(1, 'day');
        }
        break;

      case 'DAILY':
        while (
          currentDate.isBefore(endDate) ||
          currentDate.isSame(endDate, 'day')
        ) {
          instances.push({
            course_id: form.course_id,
            year_id: selectedYear,
            semester_id: selectedSemester,
            section_code: form.section_code,
            instructor_id: form.instructor_id,
            max_capacity: parseInt(form.capacity),
            delivery_mode: 'IN_PERSON',
            status: 'PLANNED',
            day_of_week: [
              'SUNDAY',
              'MONDAY',
              'TUESDAY',
              'WEDNESDAY',
              'THURSDAY',
              'FRIDAY',
              'SATURDAY',
            ][currentDate.day()],
            start_time: startTime.format('HH:mm'),
            end_time: endTime.format('HH:mm'),
            venue_id: form.venue_id,
            campus_id: form.campus_id,
            meeting_date: currentDate.format('YYYY-MM-DD'),
            is_recurring: true,
          });
          currentDate = currentDate.add(1, 'day');
        }
        break;

      default:
        // For custom patterns, just add the initial date
        instances.push({
          course_id: form.course_id,
          year_id: selectedYear,
          semester_id: selectedSemester,
          section_code: form.section_code,
          instructor_id: form.instructor_id,
          max_capacity: parseInt(form.capacity),
          delivery_mode: 'IN_PERSON',
          status: 'PLANNED',
          day_of_week: [
            'SUNDAY',
            'MONDAY',
            'TUESDAY',
            'WEDNESDAY',
            'THURSDAY',
            'FRIDAY',
            'SATURDAY',
          ][dayOfWeek],
          start_time: startTime.format('HH:mm'),
          end_time: endTime.format('HH:mm'),
          venue_id: form.venue_id,
          campus_id: form.campus_id,
          meeting_date: startDate.format('YYYY-MM-DD'),
          is_recurring: true,
        });
    }

    return instances;
  };

  // Interface for class instance data
  interface ClassInstanceData {
    course_id: string;
    year_id: string;
    semester_id: string;
    section_code: string;
    instructor_id: string;
    max_capacity: number;
    delivery_mode: string;
    status: string;
    day_of_week: string;
    start_time: string;
    end_time: string;
    venue_id: string;
    campus_id: string;
    meeting_date: string;
    is_recurring?: boolean;
  }

  // Interface for event form data
  interface EventFormData {
    id: string;
    event_name: string;
    date: Dayjs | null;
    time: [Dayjs, Dayjs] | null;
    students: string[]; // Multiple student IDs
    teachers: string[]; // Multiple teacher IDs
    campus_id?: string; // Optional
    venue_id?: string; // Optional
    program_id?: string; // Optional
    course_id?: string; // Optional
    year_id?: string; // Optional
    semester_id?: string; // Optional
    type: 'EVENT' | 'CLASS';
  }

  // Function to add new event form
  const addNewEventForm = () => {
    const newEventForm: EventFormData = {
      id: `event-${Date.now()}-${Math.random()}`,
      event_name: '',
      date: null,
      time: null,
      students: [],
      teachers: [],
      campus_id: '',
      venue_id: '',
      program_id: '',
      course_id: '',
      year_id: '',
      semester_id: '',
      type: 'EVENT',
    };
    setEventForms([...eventForms, newEventForm]);
  };

  // Function to remove event form
  const removeEventForm = (formId: string) => {
    setEventForms(eventForms.filter((form) => form.id !== formId));
  };

  // Function to update event form
  const updateEventForm = (
    formId: string,
    field: keyof EventFormData,
    value: any
  ) => {
    setEventForms(
      eventForms.map((form) =>
        form.id === formId ? { ...form, [field]: value } : form
      )
    );
  };

  // Function to handle event creation
  const handleCreateEvents = async () => {
    try {
      setLoading(true);

      // Validate event forms
      const validEventForms = eventForms.filter((form) => {
        const hasBasicFields = form.event_name && form.date && form.time;
        return hasBasicFields;
      });

      if (validEventForms.length === 0) {
        message.error(
          'Please fill in at least one event with required fields (Event Name, Date, Time)'
        );
        return;
      }

      // Prepare array of all event data
      const eventsData = validEventForms.map((form) => {
        const [startTime, endTime] = form.time!;

        return {
          event_name: form.event_name,
          date: form.date!.format('YYYY-MM-DD'),
          start_time: startTime.format('HH:mm'),
          end_time: endTime.format('HH:mm'),
          students: form.students,
          teachers: form.teachers,
          campus_id: form.campus_id || null,
          venue_id: form.venue_id || null,
          program_id: form.program_id || null,
          course_id: form.course_id || null,
          year_id: form.year_id || null,
          semester_id: form.semester_id || null,
          type: 'EVENT',
        };
      });

      // Prepare the complete request payload
      const requestPayload = {
        events: eventsData,
        type: 'EVENT',
      };

      console.log('Sending events data to API:', requestPayload);

      // Show preview of what will be created
      message.info(`📋 Creating ${eventsData.length} event(s)`);

      // API call for events (you can use the same endpoint or create a new one)
      const response = await fetch(
        'http://103.189.173.7:8080/api/v1/admin/academics/events/bulk-create',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(requestPayload),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log('All events created successfully:', result);

        message.success(
          `✅ Successfully created ${eventsData.length} event(s)!`
        );

        // Reset forms and close modal
        setEventForms([]);
        setIsCreateClassModalVisible(false);

        // Force refresh calendar to show new events immediately
        await refreshEventsOnly();
        setTimeout(() => {
          forceCalendarRefresh();
        }, 300);
      } else {
        const errorData = await response.json();
        message.error(
          `Failed to create events: ${errorData.message || 'Unknown error'}`
        );
      }
    } catch (error: any) {
      console.error('Error creating events:', error);
      message.error(
        `Error creating events: ${error.message || 'Unknown error'}`
      );
    } finally {
      setLoading(false);
    }
  };

  // Function to reset event forms
  const resetEventForms = () => {
    setEventForms([]);
    setActiveTab('class');
  };

  // Function to render class creation tab
  const renderClassCreationTab = () => (
    <div>
      {/* Status Message */}
      {loading && (
        <div
          style={{
            marginBottom: '24px',
            padding: '16px',
            backgroundColor: '#e6f7ff',
            border: '1px solid #91d5ff',
            borderRadius: '8px',
          }}
        >
          <div
            style={{
              color: '#1890ff',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <div className="loading-spinner"></div>
            Creating multiple classes...
          </div>
        </div>
      )}

      {/* Global Settings Section */}
      <div
        className="form-section"
        style={{
          marginBottom: '24px',
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
        }}
      >
        <h3
          className="section-title"
          style={{ marginBottom: '16px', color: '#1890ff' }}
        >
          🌍 Global Settings (Applied to All Classes)
        </h3>

        <Row gutter={16}>
          {/* Program */}
          <Col span={8}>
            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  fontWeight: 'bold',
                  marginBottom: '8px',
                  display: 'block',
                }}
              >
                Program <span style={{ color: 'red' }}>*</span>
              </label>
              <Select
                placeholder="Select Program"
                style={{ width: '100%' }}
                value={selectedProgram}
                onChange={setSelectedProgram}
                showSearch
                optionFilterProp="children"
              >
                {(programs || []).map((program) => (
                  <Option key={program.id} value={program.id}>
                    {program.name}
                  </Option>
                ))}
              </Select>
            </div>
          </Col>

          {/* Year */}
          <Col span={8}>
            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  fontWeight: 'bold',
                  marginBottom: '8px',
                  display: 'block',
                }}
              >
                Year <span style={{ color: 'red' }}>*</span>
              </label>
              <Select
                placeholder="Select Year"
                style={{ width: '100%' }}
                value={selectedYear}
                onChange={setSelectedYear}
                showSearch
                optionFilterProp="children"
              >
                {(years || []).map((year) => (
                  <Option key={year.id} value={year.id}>
                    {year.name}
                  </Option>
                ))}
              </Select>
            </div>
          </Col>

          {/* Semester */}
          <Col span={8}>
            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  marginBottom: '8px',
                  display: 'block',
                  fontWeight: 'bold',
                }}
              >
                Semester <span style={{ color: 'red' }}>*</span>
              </label>
              <Select
                placeholder="Select Semester"
                style={{ width: '100%' }}
                disabled={!selectedYear}
                value={selectedSemester}
                onChange={setSelectedSemester}
                showSearch
                optionFilterProp="children"
              >
                {(semesters || []).map((semester) => (
                  <Option key={semester.id} value={semester.id}>
                    {semester.name}
                  </Option>
                ))}
              </Select>
            </div>
          </Col>
        </Row>

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Button
            type="dashed"
            onClick={addNewClassForm}
            icon={<PlusOutlined />}
            style={{ width: '200px', height: '40px' }}
          >
            Add Another Class
          </Button>
        </div>

        <div
          style={{
            marginTop: '12px',
            padding: '12px',
            backgroundColor: '#fff7e6',
            borderRadius: '6px',
            border: '1px solid #ffd591',
          }}
        >
          <p style={{ margin: 0, fontSize: '12px', color: '#d46b08' }}>
            💡 <strong>Helpful Note:</strong> Program, Year, and Semester are
            global settings that apply to all classes. Individual class details
            (Course, Campus, Venue, Teacher, etc.) are set per class below.
          </p>
        </div>
      </div>

      {/* Individual Class Forms */}
      <div className="class-forms">
        {classForms.map((form, index) => (
          <div
            key={form.id}
            className="class-form"
            style={{
              marginBottom: '24px',
              padding: '20px',
              border: '1px solid #d9d9d9',
              borderRadius: '8px',
              backgroundColor: 'white',
            }}
          >
            <div
              className="form-header"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
                paddingBottom: '12px',
                borderBottom: '1px solid #f0f0f0',
              }}
            >
              <h4 style={{ margin: 0, color: '#1890ff' }}>
                Class #{index + 1}
                {form.is_recurring && (
                  <Tag color="blue" style={{ marginLeft: '8px' }}>
                    🔄 Recurring
                  </Tag>
                )}
              </h4>
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => removeClassForm(form.id)}
                size="small"
              >
                Remove
              </Button>
            </div>

            <Row gutter={16}>
              <Col span={6}>
                <div style={{ marginBottom: '16px' }}>
                  <label
                    style={{
                      fontWeight: 'bold',
                      marginBottom: '8px',
                      display: 'block',
                    }}
                  >
                    Class Code <span style={{ color: 'red' }}>*</span>
                  </label>
                  <Input
                    placeholder="e.g., 01, 02, A, B"
                    value={form.section_code}
                    onChange={(e) =>
                      updateClassForm(form.id, 'section_code', e.target.value)
                    }
                  />
                </div>
              </Col>

              <Col span={6}>
                <div style={{ marginBottom: '16px' }}>
                  <label
                    style={{
                      fontWeight: 'bold',
                      marginBottom: '8px',
                      display: 'block',
                    }}
                  >
                    Course <span style={{ color: 'red' }}>*</span>
                  </label>
                  <Select
                    placeholder="Select Course"
                    style={{ width: '100%' }}
                    value={form.course_id}
                    onChange={(value) =>
                      updateClassForm(form.id, 'course_id', value)
                    }
                    showSearch
                    optionFilterProp="children"
                    disabled={!selectedProgram}
                  >
                    {(courses || []).map((course) => (
                      <Option key={course.id} value={course.id}>
                        {course.course_code} - {course.name}
                      </Option>
                    ))}
                  </Select>
                </div>
              </Col>

              <Col span={6}>
                <div style={{ marginBottom: '16px' }}>
                  <label
                    style={{
                      fontWeight: 'bold',
                      marginBottom: '8px',
                      display: 'block',
                    }}
                  >
                    Teacher <span style={{ color: 'red' }}>*</span>
                  </label>
                  <Select
                    placeholder="Select Teacher"
                    style={{ width: '100%' }}
                    value={form.instructor_id}
                    onChange={(value) =>
                      updateClassForm(form.id, 'instructor_id', value)
                    }
                    showSearch
                    optionFilterProp="children"
                  >
                    {(teachers || []).map((teacher) => (
                      <Option key={teacher.id} value={teacher.id}>
                        {teacher.first_name} {teacher.last_name}
                      </Option>
                    ))}
                  </Select>
                </div>
              </Col>

              <Col span={6}>
                <div style={{ marginBottom: '16px' }}>
                  <label
                    style={{
                      fontWeight: 'bold',
                      marginBottom: '8px',
                      display: 'block',
                    }}
                  >
                    Capacity <span style={{ color: 'red' }}>*</span>
                  </label>
                  <Input
                    type="number"
                    placeholder="e.g., 30"
                    value={form.capacity}
                    onChange={(e) =>
                      updateClassForm(form.id, 'capacity', e.target.value)
                    }
                  />
                </div>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={6}>
                <div style={{ marginBottom: '16px' }}>
                  <label
                    style={{
                      fontWeight: 'bold',
                      marginBottom: '8px',
                      display: 'block',
                    }}
                  >
                    Campus <span style={{ color: 'red' }}>*</span>
                  </label>
                  <Select
                    placeholder="Select Campus"
                    style={{ width: '100%' }}
                    value={form.campus_id}
                    onChange={async (value) => {
                      updateClassForm(form.id, 'campus_id', value);
                      updateClassForm(form.id, 'venue_id', ''); // Reset venue when campus changes
                      if (value) {
                        const venuesForCampus = await loadVenuesForForm(value);
                        setVenues(venuesForCampus);
                      }
                    }}
                    showSearch
                    optionFilterProp="children"
                  >
                    {(campuses || []).map((campus) => (
                      <Option key={campus.id} value={campus.id}>
                        {campus.name}
                      </Option>
                    ))}
                  </Select>
                </div>
              </Col>

              <Col span={6}>
                <div style={{ marginBottom: '16px' }}>
                  <label
                    style={{
                      fontWeight: 'bold',
                      marginBottom: '8px',
                      display: 'block',
                    }}
                  >
                    Venue <span style={{ color: 'red' }}>*</span>
                  </label>
                  <Select
                    placeholder="Select Venue"
                    style={{ width: '100%' }}
                    value={form.venue_id}
                    onChange={(value) =>
                      updateClassForm(form.id, 'venue_id', value)
                    }
                    showSearch
                    optionFilterProp="children"
                    disabled={!form.campus_id}
                  >
                    {(venues || []).map((venue) => (
                      <Option key={venue.id} value={venue.id}>
                        {venue.name}
                      </Option>
                    ))}
                  </Select>
                </div>
              </Col>

              <Col span={6}>
                <div style={{ marginBottom: '16px' }}>
                  <label
                    style={{
                      fontWeight: 'bold',
                      marginBottom: '8px',
                      display: 'block',
                    }}
                  >
                    Date <span style={{ color: 'red' }}>*</span>
                  </label>
                  <DatePicker
                    style={{ width: '100%' }}
                    value={form.class_date}
                    onChange={(date) =>
                      updateClassForm(form.id, 'class_date', date)
                    }
                    placeholder="Select Date"
                  />
                </div>
              </Col>

              <Col span={6}>
                <div style={{ marginBottom: '16px' }}>
                  <label
                    style={{
                      fontWeight: 'bold',
                      marginBottom: '8px',
                      display: 'block',
                    }}
                  >
                    Time <span style={{ color: 'red' }}>*</span>
                  </label>
                  <TimePicker.RangePicker
                    style={{ width: '100%' }}
                    value={form.class_time}
                    onChange={(time) =>
                      updateClassForm(form.id, 'class_time', time)
                    }
                    placeholder={['Start Time', 'End Time']}
                    format="HH:mm"
                  />
                </div>
              </Col>
            </Row>

            {/* Recurring Options */}
            <div
              style={{
                marginTop: '16px',
                padding: '16px',
                backgroundColor: '#f6ffed',
                borderRadius: '6px',
                border: '1px solid #b7eb8f',
              }}
            >
              <div style={{ marginBottom: '12px' }}>
                <Checkbox
                  checked={form.is_recurring}
                  onChange={(e) =>
                    updateClassForm(form.id, 'is_recurring', e.target.checked)
                  }
                >
                  Make this class recurring
                </Checkbox>
              </div>

              {form.is_recurring && (
                <div>
                  <Row gutter={16}>
                    <Col span={8}>
                      <div style={{ marginBottom: '12px' }}>
                        <label
                          style={{
                            fontWeight: 'bold',
                            marginBottom: '8px',
                            display: 'block',
                          }}
                        >
                          Recurrence Pattern{' '}
                          <span style={{ color: 'red' }}>*</span>
                        </label>
                        <Select
                          placeholder="Select Pattern"
                          style={{ width: '100%' }}
                          value={form.recurrence_pattern}
                          onChange={(value) =>
                            updateClassForm(
                              form.id,
                              'recurrence_pattern',
                              value
                            )
                          }
                        >
                          <Option value="WEEKLY">Weekly</Option>
                          <Option value="BIWEEKLY">Bi-weekly</Option>
                          <Option value="MONTHLY">Monthly</Option>
                          <Option value="MONTHLY_SAME_WEEKDAY">
                            Monthly (same weekday)
                          </Option>
                          <Option value="WEEKDAYS">Weekdays (Mon-Fri)</Option>
                          <Option value="WEEKENDS">Weekends (Sat-Sun)</Option>
                          <Option value="MONDAY_WEDNESDAY_FRIDAY">
                            Monday, Wednesday, Friday
                          </Option>
                          <Option value="TUESDAY_THURSDAY">
                            Tuesday, Thursday
                          </Option>
                          <Option value="DAILY">Daily</Option>
                          <Option value="CUSTOM">Custom</Option>
                        </Select>
                      </div>
                    </Col>

                    <Col span={8}>
                      <div style={{ marginBottom: '12px' }}>
                        <label
                          style={{
                            fontWeight: 'bold',
                            marginBottom: '8px',
                            display: 'block',
                          }}
                        >
                          End Date
                        </label>
                        <DatePicker
                          style={{ width: '100%' }}
                          value={form.recurrence_end_date}
                          onChange={(date) =>
                            updateClassForm(
                              form.id,
                              'recurrence_end_date',
                              date
                            )
                          }
                          placeholder="Select End Date"
                        />
                      </div>
                    </Col>

                    <Col span={8}>
                      <div style={{ marginBottom: '12px' }}>
                        <label
                          style={{
                            fontWeight: 'bold',
                            marginBottom: '8px',
                            display: 'block',
                          }}
                        >
                          Pattern Description
                        </label>
                        <div
                          style={{
                            padding: '8px',
                            backgroundColor: '#fff7e6',
                            borderRadius: '4px',
                            border: '1px solid #ffd591',
                          }}
                        >
                          <p
                            style={{
                              margin: 0,
                              fontSize: '12px',
                              color: '#d46b08',
                            }}
                          >
                            {form.recurrence_pattern === 'WEEKLY' &&
                              'Every week on the same day'}
                            {form.recurrence_pattern === 'BIWEEKLY' &&
                              'Every two weeks on the same day'}
                            {form.recurrence_pattern === 'MONTHLY' &&
                              'Every month on the same date'}
                            {form.recurrence_pattern ===
                              'MONTHLY_SAME_WEEKDAY' &&
                              'Every month on the same weekday'}
                            {form.recurrence_pattern === 'WEEKDAYS' &&
                              'Every Monday to Friday'}
                            {form.recurrence_pattern === 'WEEKENDS' &&
                              'Every Saturday and Sunday'}
                            {form.recurrence_pattern ===
                              'MONDAY_WEDNESDAY_FRIDAY' &&
                              'Every Monday, Wednesday, and Friday'}
                            {form.recurrence_pattern === 'TUESDAY_THURSDAY' &&
                              'Every Tuesday and Thursday'}
                            {form.recurrence_pattern === 'DAILY' && 'Every day'}
                            {form.recurrence_pattern === 'CUSTOM' &&
                              'Custom pattern (describe below)'}
                            {!form.recurrence_pattern &&
                              'Select a pattern to see description'}
                          </p>
                        </div>
                      </div>
                    </Col>
                  </Row>

                  {/* Custom Pattern Description */}
                  {form.recurrence_pattern === 'CUSTOM' && (
                    <div
                      style={{
                        marginTop: '12px',
                        padding: '8px',
                        backgroundColor: '#fff7e6',
                        borderRadius: '4px',
                        border: '1px solid #ffd591',
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          fontSize: '12px',
                          color: '#d46b08',
                        }}
                      >
                        ✏️ <strong>Custom Pattern:</strong> Please describe your
                        specific recurrence pattern in detail above.
                      </p>
                    </div>
                  )}

                  {/* Instance Preview */}
                  {form.recurrence_pattern &&
                    form.recurrence_pattern !== 'CUSTOM' &&
                    form.class_date && (
                      <div
                        style={{
                          marginTop: '12px',
                          padding: '8px',
                          backgroundColor: '#f6ffed',
                          borderRadius: '4px',
                          border: '1px solid #b7eb8f',
                        }}
                      >
                        <p
                          style={{
                            margin: 0,
                            fontSize: '12px',
                            color: '#389e0d',
                          }}
                        >
                          📅 <strong>Preview:</strong> This will create
                          approximately{' '}
                          {(() => {
                            if (!form.class_date) return '0';
                            const endDate =
                              form.recurrence_end_date ||
                              dayjs().add(6, 'months');
                            const instances = generateRecurringInstances(
                              form,
                              form.class_date,
                              endDate
                            );
                            return instances.length;
                          })()}{' '}
                          class instances from{' '}
                          {form.class_date.format('MMM D, YYYY')} to{' '}
                          {(
                            form.recurrence_end_date || dayjs().add(6, 'months')
                          ).format('MMM D, YYYY')}
                        </p>
                      </div>
                    )}
                </div>
              )}
            </div>

            {/* Class Summary */}
            <div
              style={{
                marginTop: '16px',
                padding: '12px',
                backgroundColor: '#f0f8ff',
                borderRadius: '6px',
                border: '1px solid #91d5ff',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ fontSize: '12px', color: '#1890ff' }}>
                  <strong>Class Summary:</strong> {form.section_code} •{' '}
                  {form.class_date
                    ? form.class_date.format('MMM D, YYYY')
                    : 'Date not set'}{' '}
                  •{' '}
                  {form.class_time
                    ? `${form.class_time[0]?.format('HH:mm')} - ${form.class_time[1]?.format('HH:mm')}`
                    : 'Time not set'}
                </div>
                <div style={{ fontSize: '12px', color: '#1890ff' }}>
                  {form.is_recurring ? '🔄 Recurring' : '📅 One-time'}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Action Buttons */}
        <div
          style={{
            marginTop: '24px',
            padding: '20px',
            borderTop: '1px solid #d9d9d9',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <Button onClick={resetClassForms} icon={<ClearOutlined />}>
              Reset All
            </Button>
          </div>

          <Space size="large">
            <Button
              onClick={() => setIsCreateClassModalVisible(false)}
              size="large"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={handleCreateMultipleClasses}
              loading={loading}
              size="large"
              icon={<PlusOutlined />}
              disabled={
                !selectedProgram ||
                !selectedYear ||
                !selectedSemester ||
                classForms.length === 0
              }
            >
              Create {classForms.length} Class
              {classForms.length !== 1 ? 'es' : ''}
            </Button>
          </Space>
        </div>
      </div>
    </div>
  );

  // Function to render event creation tab
  const renderEventCreationTab = () => (
    <div>
      {/* Status Message */}
      {loading && (
        <div
          style={{
            marginBottom: '24px',
            padding: '16px',
            backgroundColor: '#e6f7ff',
            border: '1px solid #91d5ff',
            borderRadius: '8px',
          }}
        >
          <div
            style={{
              color: '#1890ff',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <div className="loading-spinner"></div>
            Creating events...
          </div>
        </div>
      )}

      {/* Event Creation Guide */}
      <div
        style={{
          marginBottom: '24px',
          padding: '16px',
          backgroundColor: '#f6ffed',
          border: '1px solid #b7eb8f',
          borderRadius: '8px',
        }}
      >
        <div
          style={{
            color: '#52c41a',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <CalendarOutlined />
          <strong>Event Creation Ready!</strong>
        </div>
        <p style={{ margin: '8px 0 0 0', color: '#666', fontSize: '14px' }}>
          Fill in the event details below. You can add more events using the
          "Add More Events" button at the bottom.
        </p>
      </div>

      {/* Event Forms Section */}
      <div className="event-forms">
        {eventForms.map((form, index) => (
          <div
            key={form.id}
            className="event-form"
            style={{
              marginBottom: '24px',
              padding: '20px',
              border: '1px solid #d9d9d9',
              borderRadius: '8px',
              backgroundColor: 'white',
            }}
          >
            <div
              className="form-header"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
                paddingBottom: '12px',
                borderBottom: '1px solid #f0f0f0',
              }}
            >
              <h4 style={{ margin: 0, color: '#722ed1' }}>
                🎉 Event #{index + 1}
              </h4>
              {eventForms.length > 1 && (
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => removeEventForm(form.id)}
                  size="small"
                >
                  Remove
                </Button>
              )}
            </div>

            <Row gutter={16}>
              <Col span={12}>
                <div style={{ marginBottom: '16px' }}>
                  <label
                    style={{
                      fontWeight: 'bold',
                      marginBottom: '8px',
                      display: 'block',
                    }}
                  >
                    Event Name <span style={{ color: 'red' }}>*</span>
                  </label>
                  <Input
                    placeholder="e.g., Annual Sports Day, Science Fair, Parent Meeting"
                    value={form.event_name}
                    onChange={(e) =>
                      updateEventForm(form.id, 'event_name', e.target.value)
                    }
                  />
                </div>
              </Col>

              <Col span={12}>
                <div style={{ marginBottom: '16px' }}>
                  <label
                    style={{
                      fontWeight: 'bold',
                      marginBottom: '8px',
                      display: 'block',
                    }}
                  >
                    Date <span style={{ color: 'red' }}>*</span>
                  </label>
                  <DatePicker
                    style={{ width: '100%' }}
                    value={form.date}
                    onChange={(date) => updateEventForm(form.id, 'date', date)}
                    placeholder="Select Date"
                  />
                </div>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <div style={{ marginBottom: '16px' }}>
                  <label
                    style={{
                      fontWeight: 'bold',
                      marginBottom: '8px',
                      display: 'block',
                    }}
                  >
                    Time <span style={{ color: 'red' }}>*</span>
                  </label>
                  <TimePicker.RangePicker
                    style={{ width: '100%' }}
                    value={form.time}
                    onChange={(time) => updateEventForm(form.id, 'time', time)}
                    placeholder={['Start Time', 'End Time']}
                    format="HH:mm"
                  />
                </div>
              </Col>

              <Col span={12}>
                <div style={{ marginBottom: '16px' }}>
                  <label
                    style={{
                      fontWeight: 'bold',
                      marginBottom: '8px',
                      display: 'block',
                    }}
                  >
                    Students (Multiple Selection)
                  </label>
                  <Select
                    mode="multiple"
                    placeholder="Select Students"
                    style={{ width: '100%' }}
                    value={form.students}
                    onChange={(value) =>
                      updateEventForm(form.id, 'students', value)
                    }
                    showSearch
                    optionFilterProp="children"
                  >
                    {(students || []).map((student) => (
                      <Option key={student.id} value={student.id}>
                        {student.name} - {student.student_id}
                      </Option>
                    ))}
                  </Select>
                </div>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <div style={{ marginBottom: '16px' }}>
                  <label
                    style={{
                      fontWeight: 'bold',
                      marginBottom: '8px',
                      display: 'block',
                    }}
                  >
                    Teachers (Multiple Selection)
                  </label>
                  <Select
                    mode="multiple"
                    placeholder="Select Teachers"
                    style={{ width: '100%' }}
                    value={form.teachers}
                    onChange={(value) =>
                      updateEventForm(form.id, 'teachers', value)
                    }
                    showSearch
                    optionFilterProp="children"
                  >
                    {(teachers || []).map((teacher) => (
                      <Option key={teacher.id} value={teacher.id}>
                        {teacher.first_name} {teacher.last_name}
                      </Option>
                    ))}
                  </Select>
                </div>
              </Col>

              <Col span={12}>
                <div style={{ marginBottom: '16px' }}>
                  <label
                    style={{
                      fontWeight: 'bold',
                      marginBottom: '8px',
                      display: 'block',
                    }}
                  >
                    Campus (Optional)
                  </label>
                  <Select
                    placeholder="Select Campus"
                    style={{ width: '100%' }}
                    value={form.campus_id}
                    onChange={async (value) => {
                      updateClassForm(form.id, 'campus_id', value);
                      updateClassForm(form.id, 'venue_id', ''); // Reset venue when campus changes
                      if (value) {
                        const venuesForCampus = await loadVenuesForForm(value);
                        setVenues(venuesForCampus);
                      }
                    }}
                    // onChange={(value) => updateEventForm(form.id, 'campus_id', value)}
                    showSearch
                    optionFilterProp="children"
                    allowClear
                  >
                    {(campuses || []).map((campus) => (
                      <Option key={campus.id} value={campus.id}>
                        {campus.name}
                      </Option>
                    ))}
                  </Select>
                </div>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <div style={{ marginBottom: '16px' }}>
                  <label
                    style={{
                      fontWeight: 'bold',
                      marginBottom: '8px',
                      display: 'block',
                    }}
                  >
                    Venue (Optional)
                  </label>
                  <Select
                    placeholder="Select Venue"
                    style={{ width: '100%' }}
                    value={form.venue_id}
                    onChange={(value) =>
                      updateEventForm(form.id, 'venue_id', value)
                    }
                    showSearch
                    optionFilterProp="children"
                    disabled={!form.campus_id}
                    allowClear
                  >
                    {(venues || []).map((venue) => (
                      <Option key={venue.id} value={venue.id}>
                        {venue.name}
                      </Option>
                    ))}
                  </Select>
                </div>
              </Col>

              <Col span={8}>
                <div style={{ marginBottom: '16px' }}>
                  <label
                    style={{
                      fontWeight: 'bold',
                      marginBottom: '8px',
                      display: 'block',
                    }}
                  >
                    Program (Optional)
                  </label>
                  <Select
                    placeholder="Select Program"
                    style={{ width: '100%' }}
                    value={form.program_id}
                    onChange={setSelectedProgram}
                    // onChange={(value) => updateEventForm(form.id, 'program_id', value) setSelectedProgram}

                    showSearch
                    optionFilterProp="children"
                    allowClear
                  >
                    {(programs || []).map((program) => (
                      <Option key={program.id} value={program.id}>
                        {program.name}
                      </Option>
                    ))}
                  </Select>
                </div>
              </Col>

              <Col span={8}>
                <div style={{ marginBottom: '16px' }}>
                  <label
                    style={{
                      fontWeight: 'bold',
                      marginBottom: '8px',
                      display: 'block',
                    }}
                  >
                    Course (Optional)
                  </label>
                  <Select
                    placeholder="Select Course"
                    style={{ width: '100%' }}
                    value={form.course_id}
                    onChange={(value) =>
                      updateEventForm(form.id, 'course_id', value)
                    }
                    showSearch
                    optionFilterProp="children"
                    disabled={!form.program_id}
                    allowClear
                  >
                    {(courses || []).map((course) => (
                      <Option key={course.id} value={course.id}>
                        {course.course_code} - {course.name}
                      </Option>
                    ))}
                  </Select>
                </div>
              </Col>
            </Row>

            {/* Event Summary */}
            <div
              style={{
                marginTop: '16px',
                padding: '12px',
                backgroundColor: '#f9f0ff',
                borderRadius: '6px',
                border: '1px solid #d3adf7',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ fontSize: '12px', color: '#722ed1' }}>
                  <strong>Event Summary:</strong>{' '}
                  {form.event_name || 'Event name not set'} •{' '}
                  {form.date ? form.date.format('MMM D, YYYY') : 'Date not set'}{' '}
                  •{' '}
                  {form.time
                    ? `${form.time[0]?.format('HH:mm')} - ${form.time[1]?.format('HH:mm')}`
                    : 'Time not set'}
                </div>
                <div style={{ fontSize: '12px', color: '#722ed1' }}>
                  👥 {form.students.length} Students • 👨‍🏫 {form.teachers.length}{' '}
                  Teachers
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Add More Events Button */}
        {eventForms.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Button
              type="dashed"
              onClick={addNewEventForm}
              icon={<PlusOutlined />}
              style={{ width: '200px', height: '40px' }}
            >
              Add Another Event
            </Button>
          </div>
        )}

        {/* Action Buttons */}
        {eventForms.length > 0 && (
          <div
            style={{
              marginTop: '24px',
              padding: '20px',
              borderTop: '1px solid #d9d9d9',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <Button onClick={resetEventForms} icon={<ClearOutlined />}>
                Reset All
              </Button>
            </div>

            <Space size="large">
              <Button
                onClick={() => setIsCreateClassModalVisible(false)}
                size="large"
              >
                Cancel
              </Button>
              <Button
                type="primary"
                onClick={handleCreateEvents}
                loading={loading}
                size="large"
                icon={<PlusOutlined />}
                disabled={eventForms.length === 0}
              >
                Create {eventForms.length} Event
                {eventForms.length !== 1 ? 's' : ''}
              </Button>
            </Space>
          </div>
        )}
      </div>
    </div>
  );

  // Function to refresh only classes data (much faster than full data reload)
  const refreshClassesOnly = async () => {
    try {
      console.log('🔄 Refreshing classes data...');
      setLoading(true);

      const classesData = await classAPI.getAllClasses({ semester_id: '' });
      console.log('📡 API Response:', classesData);

      // Handle different API response structures
      let finalClasses = [];
      if (classesData?.data?.classes) {
        finalClasses = classesData.data.classes;
        console.log('✅ Using classesData.data.classes structure');
      } else if (classesData?.data) {
        finalClasses = classesData.data;
        console.log('✅ Using classesData.data structure');
      } else if (Array.isArray(classesData)) {
        finalClasses = classesData;
        console.log('✅ Using direct array structure');
      } else {
        console.warn('⚠️ Unknown API response structure:', classesData);
        finalClasses = [];
      }

      console.log('📊 Final classes to set:', finalClasses.length);
      setClasses(finalClasses);

      // Force calendar events recalculation
      setTimeout(() => {
        console.log('🔄 Forcing calendar events recalculation...');
        // Trigger a small state change to force re-render
        setCurrentDay(dayjs());
      }, 100);
    } catch (error) {
      console.error('❌ Error refreshing classes:', error);
      message.error('Failed to refresh classes data');
    } finally {
      setLoading(false);
    }
  };

  // Function to refresh only events data
  const refreshEventsOnly = async () => {
    try {
      console.log('🔄 Refreshing events data...');
      // For now, just refresh classes since events are stored there
      // But we'll add better logging and force refresh
      await refreshClassesOnly();

      // Additional force refresh for events
      setTimeout(() => {
        console.log('🔄 Forcing events recalculation...');
        // Trigger a small state change to force re-render
        setCurrentDay(dayjs());
      }, 200);
    } catch (error) {
      console.error('❌ Error refreshing events:', error);
      message.error('Failed to refresh events data');
    }
  };

  // Force refresh function to ensure calendar updates
  const forceCalendarRefresh = () => {
    console.log('🔄 Force refreshing calendar...');
    // Force re-render by updating multiple date states
    setCurrentDay(dayjs());
    setCurrentMonth(dayjs());
    setCurrentWeek(dayjs());

    // Also force classes state update
    setClasses((prev) => [...prev]);
  };

  // Function to determine event colors based on section_code logic
  const getEventColors = (sectionCode: string) => {
    // If section_code contains "EVENT" (case insensitive) - Show as EVENT
    if (sectionCode && sectionCode.toLowerCase().includes('event')) {
      return {
        background: '#f5222d38', // Red gradient for events
        border: '3px solid #8b0000cc',
        // shadow: '0 2px 8px rgba(245, 34, 45, 0.3)',
        hoverBackground: 'linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%)',
        // hoverShadow: '0 4px 12px rgba(245, 34, 45, 0.4)',
        icon: '🎉',
        type: 'EVENT',
        hovercolor: '#fff',
      };
    }

    // Default: Regular class (Green gradient) - Show as CLASS
    return {
      background: '#E5F8E7', // Green gradient for classes
      // shadow: '0 2px 8px #00B512CC',
      border: '3px solid #00B512CC',
      hoverBackground: 'linear-gradient(135deg, #73d13d 0%, #95de64 100%)',
      // hoverShadow: '0 4px 12px rgba(82, 196, 26, 0.4)',
      icon: '📚',
      type: 'CLASS',
      hovercolor: '#fff',
    };
  };

  return (
    <div className="calendar-page">
      {/* Top Header - Exact design from screenshot */}
      <div className="calendar-header">
        <div className="header-left">
          <h1>Academic Calendar</h1>
          <p>Manage class schedules and academic planning</p>
        </div>
        <div className="header-right">
          {
            <>
              <Button
                icon={<FilterOutlined />}
                onClick={() => setIsFilterDrawerVisible(true)}
                className="filter-icon-button"
                style={{ marginRight: '12px' }}
              >
                Filter Classes
              </Button>
              {/* <Button
                className="create-date"
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsCreateClassModalVisible(true)}
                style={{ marginRight: '12px' }}
              >
                Create Classes & Events
              </Button> */}
              <Button
                className="filter-icon-button"
                icon={<ReloadOutlined />}
                onClick={forceCalendarRefresh}
                title="Refresh Calendar Data"
              >
                Refresh
              </Button>
            </>
          }
        </div>
      </div>

      <Row gutter={16} className="calendar-row">
        <Col span={24} lg={6} xxl={5} className="calendar-col">
          <div className="calendar-sidebar-calendar">
            <div className="calendar-sidebar-header-main">
              {/* <Button
                type="primary"
                icon={<PlusOutlined />}
                size="large"
                className="create-date"
              >
                Create
              </Button> */}
            </div>
            <Select
              className="select-actions-calendar"
              style={{ width: '100%' }}
              placeholder="Select Actions"
            >
              <Option value="daily">Daily View</Option>
              <Option value="weekly">Weekly View</Option>
              <Option value="monthly">Monthly View</Option>
            </Select>

            {/* Mini Calendar */}
            <div style={styles.miniCalendar}>
              <div style={styles.miniCalendarHeader}>
                <button style={styles.miniCalendarNavButton}>
                  <LeftOutlined />
                </button>
                <span style={styles.miniCalendarMonth}>January 2025</span>
                <button style={styles.miniCalendarNavButton}>
                  <RightOutlined />
                </button>
              </div>

              <div style={styles.miniCalendarDays}>
                {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day) => (
                  <div key={day} style={styles.miniCalendarDayHeader}>
                    {day}
                  </div>
                ))}
              </div>

              <div style={styles.miniCalendarGrid}>
                {Array.from({ length: 42 }, (_, index) => {
                  const day = index - 5;
                  const isCurrentMonth = day > 0 && day <= 31;
                  const isSelected = day === 30;
                  const hasEvent = [4, 17, 18].includes(day);

                  if (day <= 0 || day > 31) {
                    return (
                      <div
                        key={index}
                        style={styles.miniCalendarEmptyDay}
                      ></div>
                    );
                  }

                  return (
                    <div
                      key={index}
                      style={{
                        ...styles.miniCalendarDay,
                        ...(isSelected && styles.miniCalendarSelectedDay),
                      }}
                    >
                      <span
                        style={
                          isSelected ? styles.miniCalendarSelectedText : {}
                        }
                      >
                        {day}
                      </span>
                      {hasEvent && (
                        <div
                          style={{
                            ...styles.miniCalendarEventDot,
                            backgroundColor: day === 4 ? '#0b99ff' : '#00b512',
                          }}
                        ></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="calendar-sidebar-eventslist">
              <h3 className="events-list-title">Upcoming Events</h3>
              <div className="calendar-event-item-main">
                <div className="calendar-event-item">
                  <div className="calendar-event-icon">
                    <div className="calendar-event-title success">
                      Event Title
                    </div>
                    <div className="calendar-event-date">
                      <ClockCircleOutlined />
                      2023-10-01
                    </div>
                  </div>
                  <div className="calendar-event-details">
                    <RightOutlined />
                  </div>
                </div>
                <div className="calendar-event-item">
                  <div className="calendar-event-icon">
                    <div className="calendar-event-title primary">
                      Parent Meeting
                    </div>
                    <div className="calendar-event-date">
                      <ClockCircleOutlined />
                      2023-10-01
                    </div>
                  </div>
                  <div className="calendar-event-details">
                    <RightOutlined />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Col>

        {/* Main Content Area */}
        <Col span={24} lg={18} xxl={19} className="calendar-col">
          <Card className="calendar-card">{renderView()}</Card>
        </Col>
      </Row>

      {/* Create Multiple Classes Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PlusOutlined style={{ color: '#1890ff' }} />
            Create Classes & Events
          </div>
        }
        open={isCreateClassModalVisible}
        onCancel={() => setIsCreateClassModalVisible(false)}
        footer={null}
        width={1000}
        destroyOnClose
      >
        {/* Tabs for Class and Event Creation */}
        <Tabs
          activeKey={activeTab}
          onChange={(key) => {
            const newTab = key as 'class' | 'event';
            setActiveTab(newTab);

            // Initialize form only when switching to event tab and no forms exist
            if (newTab === 'event' && eventForms.length === 0) {
              addNewEventForm();
            }
          }}
          style={{ marginBottom: '20px' }}
        >
          <TabPane tab="📚 Create Classes" key="class">
            {/* Class Creation Content */}
            {renderClassCreationTab()}
          </TabPane>
          <TabPane tab="🎉 Create Events" key="event">
            {/* Event Creation Content */}
            {renderEventCreationTab()}
          </TabPane>
        </Tabs>
      </Modal>

      {/* Filter Drawer */}
      <Drawer
        title={
          <div className="drawer-title">
            <FilterOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
            Filter Classes
          </div>
        }
        placement="right"
        width={400}
        open={isFilterDrawerVisible}
        onClose={() => setIsFilterDrawerVisible(false)}
        className="filter-drawer"
      >
        <Form layout="vertical" className="filter-form">
          {/* Program Filter */}
          <Form.Item label="Program">
            <Select
              placeholder="All Programs"
              allowClear
              value={selectedProgram}
              onChange={(value) => setSelectedProgram(value)}
              className="filter-select"
            >
              {(programs || []).map((program) => (
                <Option key={program.id} value={program.id}>
                  {program.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Year Filter */}
          <Form.Item label="Year">
            <Select
              placeholder="All Years"
              allowClear
              value={selectedYear}
              onChange={(value) => setSelectedYear(value)}
              className="filter-select"
            >
              {(years || []).map((year) => (
                <Option key={year.id} value={year.id}>
                  {year.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Semester Filter */}
          <Form.Item label="Semester">
            <Select
              placeholder="All Semesters"
              allowClear
              disabled={!selectedYear}
              value={selectedSemester}
              onChange={(value) => setSelectedSemester(value)}
              className="filter-select"
            >
              {(semesters || []).map((semester) => (
                <Option key={semester.id} value={semester.id}>
                  {semester.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Course Filter */}
          <Form.Item label="Course">
            <Select
              placeholder="All Courses"
              allowClear
              disabled={!selectedProgram}
              value={selectedCourse}
              onChange={(value) => setSelectedCourse(value)}
              className="filter-select"
            >
              {(courses || []).map((course) => (
                <Option key={course.id} value={course.id}>
                  {course.course_code} - {course.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Campus Filter */}
          <Form.Item label="Campus">
            <Select
              placeholder="All Campuses"
              allowClear
              value={selectedCampus}
              onChange={(value) => setSelectedCampus(value)}
              className="filter-select"
            >
              {(campuses || []).map((campus) => (
                <Option key={campus.id} value={campus.id}>
                  {campus.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Venue Filter */}
          <Form.Item label="Venue">
            <Select
              placeholder="All Venues"
              allowClear
              disabled={!selectedCampus}
              value={selectedVenue}
              onChange={(value) => setSelectedVenue(value)}
              className="filter-select"
            >
              {(venues || []).map((venue) => (
                <Option key={venue.id} value={venue.id}>
                  {venue.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Teacher Filter */}
          <Form.Item label="Teacher">
            <Select
              placeholder="All Teachers"
              allowClear
              value={selectedTeacher}
              onChange={(value) => setSelectedTeacher(value)}
              className="filter-select"
            >
              {(teachers || []).map((teacher) => (
                <Option key={teacher.id} value={teacher.id}>
                  {teacher.first_name} {teacher.last_name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Filter Actions */}
          <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
            <Button type="primary" onClick={applyFilters} style={{ flex: 1 }}>
              Apply Filters
            </Button>
            <Button onClick={clearFilters} style={{ flex: 1 }}>
              Clear All
            </Button>
          </div>
        </Form>
      </Drawer>

      {/* Class Details Modal */}
      <Modal
        title="Class Details"
        open={isDetailsModalVisible}
        onCancel={() => setIsDetailsModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedClassForDetails && (
          <div>
            <Row gutter={16}>
              <Col span={12}>
                <div style={{ marginBottom: '16px' }}>
                  <strong>Section Code:</strong>{' '}
                  {selectedClassForDetails.section_code}
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <strong>Course:</strong>{' '}
                  {selectedClassForDetails.course?.name || 'N/A'}
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <strong>Teacher:</strong>{' '}
                  {selectedClassForDetails.instructor?.first_name}{' '}
                  {selectedClassForDetails.instructor?.last_name}
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <strong>Capacity:</strong>{' '}
                  {selectedClassForDetails.max_capacity}
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: '16px' }}>
                  <strong>Date:</strong>{' '}
                  {selectedClassForDetails.meeting_date
                    ? dayjs(selectedClassForDetails.meeting_date).format(
                        'MMM D, YYYY'
                      )
                    : 'N/A'}
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <strong>Time:</strong> {selectedClassForDetails.start_time} -{' '}
                  {selectedClassForDetails.end_time}
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <strong>Venue:</strong>{' '}
                  {selectedClassForDetails.venue?.name || 'N/A'}
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <strong>Created:</strong>{' '}
                  {selectedClassForDetails.created_at
                    ? dayjs(selectedClassForDetails.created_at).format(
                        'MMM D, YYYY'
                      )
                    : 'N/A'}
                </div>
              </Col>
            </Row>
          </div>
        )}
      </Modal>

      {/* Multiple Events Modal - Shows all events for a time slot or day */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            📅{' '}
            {selectedClassForDetails?._dayEvents
              ? 'Day Events'
              : selectedClassForDetails?._hourEvents
                ? 'Time Slot Events'
                : 'Class Details'}
            {selectedClassForDetails?._dayEvents && (
              <span
                style={{
                  marginLeft: '12px',
                  fontSize: '14px',
                  color: '#666',
                  fontWeight: 'normal',
                }}
              >
                ({selectedClassForDetails._dayEvents.length} total)
              </span>
            )}
            {selectedClassForDetails?._hourEvents && (
              <span
                style={{
                  marginLeft: '12px',
                  fontSize: '14px',
                  color: '#666',
                  fontWeight: 'normal',
                }}
              >
                ({selectedClassForDetails._hourEvents.length} total)
              </span>
            )}
          </div>
        }
        open={isClassDetailsModalVisible}
        onCancel={() => setIsClassDetailsModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedClassForDetails && (
          <div>
            {/* Header Information */}
            <div
              style={{
                marginBottom: '24px',
                padding: '16px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                border: '1px solid #e9ecef',
              }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>📅 Schedule:</strong>{' '}
                    {selectedClassForDetails.section_code}
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>⏰ Time:</strong>{' '}
                    {selectedClassForDetails.start_time} -{' '}
                    {selectedClassForDetails.end_time}
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>🏢 Venue:</strong>{' '}
                    {(
                      selectedClassForDetails._dayEvents ||
                      selectedClassForDetails._hourEvents
                    )?.length === 1
                      ? (
                          selectedClassForDetails._dayEvents?.[0] ||
                          selectedClassForDetails._hourEvents?.[0]
                        )?.meetingTime?.venue?.name || 'Unknown'
                      : `${(selectedClassForDetails._dayEvents || selectedClassForDetails._hourEvents)?.length || 0} Venues`}
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>🏫 Campus:</strong>{' '}
                    {(
                      selectedClassForDetails._dayEvents ||
                      selectedClassForDetails._hourEvents
                    )?.length === 1
                      ? (
                          selectedClassForDetails._dayEvents?.[0] ||
                          selectedClassForDetails._hourEvents?.[0]
                        )?.class?.campus?.name || 'Unknown'
                      : `${(selectedClassForDetails._dayEvents || selectedClassForDetails._hourEvents)?.length || 0} Campuses`}
                  </div>
                </Col>
              </Row>

              {/* Summary Counts */}
              {(selectedClassForDetails._dayEvents ||
                selectedClassForDetails._hourEvents) && (
                <div
                  style={{
                    marginTop: '16px',
                    padding: '12px',
                    backgroundColor: '#e6f7ff',
                    borderRadius: '6px',
                    border: '1px solid #91d5ff',
                  }}
                >
                  <Row gutter={24}>
                    <Col span={12}>
                      <div style={{ textAlign: 'center' }}>
                        <div
                          style={{
                            fontSize: '20px',
                            fontWeight: 'bold',
                            color: '#1890ff',
                          }}
                        >
                          {(
                            selectedClassForDetails._dayEvents ||
                            selectedClassForDetails._hourEvents
                          )?.filter((event: any) => {
                            const colors = getEventColors(event.section_code);
                            return colors.type === 'CLASS';
                          }).length || 0}
                        </div>
                        <div style={{ fontSize: '14px', color: '#666' }}>
                          📚 Total Classes
                        </div>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div style={{ textAlign: 'center' }}>
                        <div
                          style={{
                            fontSize: '20px',
                            fontWeight: 'bold',
                            color: '#f5222d',
                          }}
                        >
                          {(
                            selectedClassForDetails._dayEvents ||
                            selectedClassForDetails._hourEvents
                          )?.filter((event: any) => {
                            const colors = getEventColors(event.section_code);
                            return colors.type === 'EVENT';
                          }).length || 0}
                        </div>
                        <div style={{ fontSize: '14px', color: '#666' }}>
                          🎉 Total Events
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              )}
            </div>

            {/* Events List */}
            {(selectedClassForDetails._dayEvents ||
              selectedClassForDetails._hourEvents) && (
              <div>
                <h3 style={{ marginBottom: '16px', color: '#1890ff' }}>
                  📋 Events (
                  {selectedClassForDetails._dayEvents?.length ||
                    selectedClassForDetails._hourEvents?.length ||
                    0}
                  )
                </h3>

                {(
                  selectedClassForDetails._dayEvents ||
                  selectedClassForDetails._hourEvents
                )?.map((event: any, index: number) => {
                  const colors = getEventColors(event.section_code);

                  return (
                    <div
                      key={event.id}
                      style={{
                        background: colors.background,
                        color: '#000',
                        padding: '16px',
                        borderRadius: '8px',
                        marginBottom: '12px',
                        border: 'none',
                        position: 'relative',
                      }}
                    >
                      {/* Event type indicator */}
                      <span
                        style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          fontSize: '16px',
                          opacity: '0.9',
                        }}
                      >
                        {colors.icon}
                      </span>

                      <div style={{ marginBottom: '8px' }}>
                        <strong style={{ fontSize: '16px' }}>
                          {event.title}
                        </strong>
                      </div>

                      <Row gutter={16}>
                        <Col span={6}>
                          <div style={{ fontSize: '12px', opacity: '0.9' }}>
                            <strong>⏰ Time:</strong>{' '}
                            {event.start.format('HH:mm')} -{' '}
                            {event.end.format('HH:mm')}
                          </div>
                        </Col>
                        <Col span={6}>
                          <div style={{ fontSize: '12px', opacity: '0.9' }}>
                            <strong>🏢 Venue:</strong>{' '}
                            {event.meetingTime.venue?.name || 'Unknown'}
                          </div>
                        </Col>
                        <Col span={6}>
                          <div style={{ fontSize: '12px', opacity: '0.9' }}>
                            <strong>🏫 Campus:</strong>{' '}
                            {event.class?.campus?.name || 'Unknown'}
                          </div>
                        </Col>
                        <Col span={6}>
                          <div style={{ fontSize: '12px', opacity: '0.9' }}>
                            <strong>📚 Type:</strong> {colors.type}
                          </div>
                        </Col>
                      </Row>

                      {/* Additional Event Details */}
                      <div style={{ marginTop: '8px' }}>
                        {event.class?.course && (
                          <div
                            style={{
                              fontSize: '12px',
                              opacity: '0.8',
                              marginBottom: '4px',
                            }}
                          >
                            <strong>📖 Course:</strong>{' '}
                            {event.class.course.name ||
                              event.class.course.code ||
                              'Unknown'}
                          </div>
                        )}

                        {event.class?.instructor && (
                          <div
                            style={{
                              fontSize: '12px',
                              opacity: '0.8',
                              marginBottom: '4px',
                            }}
                          >
                            <strong>👨‍🏫 Instructor:</strong>{' '}
                            {event.class.instructor.first_name}{' '}
                            {event.class.instructor.last_name}
                          </div>
                        )}

                        {event.class?.teacher && (
                          <div
                            style={{
                              fontSize: '12px',
                              opacity: '0.8',
                              marginBottom: '4px',
                            }}
                          >
                            <strong>👨‍🏫 Teacher:</strong>{' '}
                            {event.class.teacher.first_name}{' '}
                            {event.class.teacher.last_name}
                          </div>
                        )}

                        {event.class?.max_capacity && (
                          <div
                            style={{
                              fontSize: '12px',
                              opacity: '0.8',
                              marginBottom: '4px',
                            }}
                          >
                            <strong>👥 Capacity:</strong>{' '}
                            {event.class.max_capacity}
                          </div>
                        )}
                      </div>

                      {/* Section Code and Type based on section code */}
                      <div
                        style={{
                          marginTop: '8px',
                          display: 'flex',
                          gap: '8px',
                          flexWrap: 'wrap',
                        }}
                      >
                        {event.section_code && (
                          <div
                            style={{
                              fontSize: '12px',
                              opacity: '0.8',
                              backgroundColor: 'rgba(255,255,255,0.1)',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              display: 'inline-block',
                            }}
                          >
                            <strong>🏷️ Section:</strong> {event.section_code}
                          </div>
                        )}

                        {/* Event Type based on section code */}
                        <div
                          style={{
                            fontSize: '12px',
                            opacity: '0.8',
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            display: 'inline-block',
                          }}
                        >
                          <strong>📚 Type:</strong> {colors.type}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Single Class Details (fallback) */}
            {!selectedClassForDetails._dayEvents &&
              !selectedClassForDetails._hourEvents && (
                <div>
                  <Row gutter={16}>
                    <Col span={12}>
                      <div style={{ marginBottom: '16px' }}>
                        <strong>Section Code:</strong>{' '}
                        {selectedClassForDetails.section_code}
                      </div>
                      <div style={{ marginBottom: '16px' }}>
                        <strong>Course:</strong>{' '}
                        {selectedClassForDetails.course?.name || 'N/A'}
                      </div>
                      <div style={{ marginBottom: '16px' }}>
                        <strong>Teacher:</strong>{' '}
                        {selectedClassForDetails.instructor?.first_name}{' '}
                        {selectedClassForDetails.instructor?.last_name}
                      </div>
                      <div style={{ marginBottom: '16px' }}>
                        <strong>Capacity:</strong>{' '}
                        {selectedClassForDetails.max_capacity}
                      </div>
                    </Col>
                    <Col span={12}>
                      <div style={{ marginBottom: '16px' }}>
                        <strong>Date:</strong>{' '}
                        {selectedClassForDetails.meeting_date
                          ? dayjs(selectedClassForDetails.meeting_date).format(
                              'MMM D, YYYY'
                            )
                          : 'N/A'}
                      </div>
                      <div style={{ marginBottom: '16px' }}>
                        <strong>Time:</strong>{' '}
                        {selectedClassForDetails.start_time} -{' '}
                        {selectedClassForDetails.end_time}
                      </div>
                      <div style={{ marginBottom: '16px' }}>
                        <strong>Venue:</strong>{' '}
                        {selectedClassForDetails.venue?.name || 'N/A'}
                      </div>
                      <div style={{ marginBottom: '16px' }}>
                        <strong>Created:</strong>{' '}
                        {selectedClassForDetails.created_at
                          ? dayjs(selectedClassForDetails.created_at).format(
                              'MMM D, YYYY'
                            )
                          : 'N/A'}
                      </div>
                    </Col>
                  </Row>
                </div>
              )}
          </div>
        )}
      </Modal>
    </div>
  );
});

export default Calendar;
