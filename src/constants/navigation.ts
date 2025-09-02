import {
  HomeIcon,
  CalculatorIcon,
  NoteAddIcon,
  BookOpenIcon,
  DocumentValidationIcon,
  CpuIcon,
  UserIcon,
  CalendarIcon,
  LayersIcon,
  ChattingIcon,
  NotificationIcon,
  SettingsIcon,
  MortarboardIcon,
  UserEditIcon,
  UserMultipleIcon,
  MegaphoneIcon,
  Layout3ColumnIcon,
  CoinsIcon,
  Analytics01Icon,
  BuildingIcon,
  TeachingIcon
} from '@hugeicons/core-free-icons';
import type { NavigationItemType } from '../types/navigation';

import HomePage from '../pages/Home';
import CoursesPage from '../pages/(course)/Courses';
import CourseContentPage from '../pages/(course)/CourseContent';
import CanvasCatalogPage from '../pages/(canvas)/Canvases';
import AssignmentsPage from '../pages/(assigment)/Assignments';
import FinancialManagementPage from '../pages/(financial)/FinancialManagement';
import WhiteboardPage from '../pages/Whiteboard';
import ResourcesPage from '../pages/(resources)/Resources';
import ChatPage from '../pages/(chat)/Chat';
import ChatLayout from '../layouts/ChatLayout';
import StudentsChatPage from '../pages/(chat)/StudentsChat';
import CalendarPage from '../pages/(calendar)/Calendar';
import AccommodationsPage from '../pages/(accommodation)/Accommodations';
import GeneralSettings from '../pages/(settings)/GeneralSettings';
import PersonalSettings from '../pages/(settings)/PersonalSettings';
import OfficesPage from '../pages/(offices)/Offices';
import DepartmentsPage from '../pages/(department)/Departments';
import StudentsPage from '../pages/(students)/Students';
import TeachersPage from '../pages/(teachers)/Teachers';
import StreamsPage from '../pages/(streams)/Streams';
import SimplePrerequisitesPage from '../pages/(prerequisites)/SimplePrerequisites';
import ProgramsManagementPage from '../pages/(programs)/ProgramsManagement';
import CoursesManagementPage from '../pages/(courses)/CoursesManagement';
import AcademicYearsPage from '../pages/(scheduling)/AcademicYears';
import { Amenities } from '../pages/(accommodation)/Amenities';
import SemesterManagementPage from '../pages/(scheduling)/SemesterManagement';
import CampusManagementPage from '../pages/(scheduling)/CampusManagement';
import VenueManagementPage from '../pages/(scheduling)/VenueManagement';
import ClassManagementPage from '../pages/(scheduling)/ClassManagement';
import ClassCalendarPage from '../pages/(scheduling)/ClassCalendar';
import FinancialTransactionsPage from '../pages/(financial)/FinancialTransactions';
import FinancialTransactionsModule from '../pages/(financial)/FinancialTransactionsModule';
import VendorManagementPage from '../pages/(financial)/VendorManagement';
import InvoiceManagementPage from '../pages/(financial)/InvoiceManagement';
import UsersPage from '../pages/(users)/Users';
import RolesPage from '../pages/(roles)/Roles';

export const NAVIGATION: NavigationItemType[] = [
  {
    id: 'home',
    name: 'Home',
    icon: HomeIcon,
    path: '/',
    component: HomePage,
  },
  {
    id: 'courses',
    name: 'Courses',
    icon: CalculatorIcon,
    path: '/courses',
    component: CoursesPage,
  },
  {
    id: 'assignments',
    name: 'Assignments',
    icon: NoteAddIcon,
    path: '/assignments',
    component: AssignmentsPage,
    // sublist: [
    //   {
    //     name: 'Assignment Submission',
    //     path: '/assignments/submission',
    //   },
    //   {
    //     name: 'Assignment Results',
    //     path: '/assignments/results',
    //   },
    // ],
  },
  {
    id: 'accommodations',
    name: 'Accommodations',
    icon: NoteAddIcon,
    path: '/accommodations',
    component: AccommodationsPage,
  },
  {
    id: 'resources',
    name: 'Resources',
    icon: BookOpenIcon,
    path: '/resources',
    component: ResourcesPage,

    sublist: [
      {
        name: 'Google Meet',
        path: '/google-meet',
      },
      {
        name: 'Tutorials',
        path: '/tutorials',
      },
      {
        name: 'Question Bank',
        path: '/question-bank',
      },
    ],
  },
  {
    id: 'tests',
    name: 'Tests',
    icon: DocumentValidationIcon,
    path: '/tests',
    sublist: [
      {
        name: 'Test Content',
        path: '/tests/content',
      },
    ],
  },
  {
    id: 'ai',
    name: 'AI',
    icon: CpuIcon,
    path: '/ai',
    sublist: [
      {
        name: 'Flash Cards',
        path: '/ai/flashcards',
      },
      {
        name: 'AI Chat',
        path: '/ai/chat',
      },
      {
        name: 'Generated Video',
        path: '/ai/generated-video',
      },
    ],
  },
  {
    id: 'personal',
    name: 'Personal',
    icon: UserIcon,
    path: '/personal',
    sublist: [
      {
        name: 'Finances',
        path: '/personal/finances',
      },
      {
        name: 'Grade History',
        path: '/personal/grade-history',
      },
      {
        name: 'Personal Info',
        path: '/personal/info',
      },
    ],
  },
  {
    id: 'calendar',
    name: 'Calendar',
    icon: CalendarIcon,
    path: '/calendar',
    component: CalendarPage,
  },
  {
    id: 'canvas',
    name: 'Canvas',
    icon: LayersIcon,
    path: '/canvases',
    component: CanvasCatalogPage,
  },
  {
    id: 'chat',
    name: 'Chat',
    icon: ChattingIcon,
    path: '/chat',
    component: ChatPage,
    layout: ChatLayout,
  },
  {
    id: 'students-chat',
    name: 'Students Chat',
    icon: UserIcon,
    path: '/students-chat',
    component: StudentsChatPage,
  },
  {
    id: 'notifications',
    name: 'Notifications',
    icon: NotificationIcon,
    path: '/notifications',
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: SettingsIcon,
    path: '/settings',
    component: GeneralSettings,
  },
  {
    id: 'offices',
    name: 'Offices',
    icon: Layout3ColumnIcon,
    path: '/offices',
    component: OfficesPage,
  },
];

export const NAVIGATION_ADMIN: NavigationItemType[] = [
  {
    id: 'home',
    name: 'Home',
    icon: HomeIcon,
    path: '/',
    component: HomePage,
  },
  {
    id: 'departments',
    name: 'Departments',
    icon: DocumentValidationIcon,
    path: '/departments',
    component: DepartmentsPage,
  },
  {
    id: 'whiteboard',
    name: 'Whiteboard',
    icon: Analytics01Icon,
    path: '/whiteboard',
    component: WhiteboardPage,
  },
  {
    id: 'offices',
    name: 'Offices',
    icon: Layout3ColumnIcon,
    path: '/offices',
    component: OfficesPage,
  },
  {
    id: 'students',
    name: 'Students',
    icon: MortarboardIcon,
    path: '/students',
    component: StudentsPage,
  },
  {
    id: 'teachers',
    name: 'Teachers',
    icon: UserMultipleIcon,
    path: '/teachers',
    component: TeachersPage,
  },
  {
    id: 'streams',
    name: 'Streams',
    icon: BookOpenIcon,
    path: '/streams',
    component: StreamsPage,
  },
  {
    id: 'prerequisites',
    name: 'Prerequisites',
    icon: BookOpenIcon,
    path: '/prerequisites',
    component: SimplePrerequisitesPage,
  },
  {
    id: 'academic-years',
    name: 'Academic Years',
    icon: CalendarIcon,
    path: '/scheduling/years',
    component: AcademicYearsPage,
  },
  {
    id: 'anemities',
    name: 'Amenities',
    icon: TeachingIcon,
    path: '/accomodations/amenities',
    component: Amenities,
  },
  {
    id: 'semester-management',
    name: 'Semester Management',
    icon: CalendarIcon,
    path: '/scheduling/semesters',
    component: SemesterManagementPage,
  },
  // {
  //   id: 'campus-management',
  //   name: 'Campus Management',
  //   icon: BuildingIcon,
  //   path: '/scheduling/campuses',
  //   component: CampusManagementPage,
  // },
  {
    id: 'venue-management',
    name: 'Venue Management',
    icon: BuildingIcon,
    path: '/scheduling/venues',
    component: VenueManagementPage,
  },
  {
    id: 'class-scheduling',
    name: 'Class Scheduling',
    icon: CalendarIcon,
    path: '/scheduling',
    sublist: [
      {
        name: 'Class Management',
        path: '/scheduling/classes',
        component: ClassManagementPage,
      },
      {
        name: 'Class Calendar',
        path: '/scheduling/calendar',
        component: ClassCalendarPage,
      },
    ],
  },
  {
    id: 'program-management',
    name: 'Program Management',
    icon: BookOpenIcon,
    path: '/program-management',
    component: ProgramsManagementPage,
  },
  {
    id: 'course-management',
    name: 'Course Management',
    icon: BookOpenIcon,
    path: '/course-management',
    component: CoursesManagementPage,
  },
  {
    id: 'admissions',
    name: 'Admissions',
    icon: UserEditIcon,
    path: '/admissions',
  },
  {
    id: 'announcements',
    name: 'Announcements',
    icon: MegaphoneIcon,
    path: '/announcements',
  },
  {
    id: 'financial-management',
    name: 'Financial Management',
    icon: CoinsIcon,
    path: '/financial-management',
    component: FinancialManagementPage,
  },
  {
    id: 'financial-transactions',
    name: 'Financial Transactions',
    icon: CoinsIcon,
    path: '/financial-transactions',
    component: FinancialTransactionsPage,
  },
  {
    id: 'vendor-management',
    name: 'Vendor Management',
    icon: BuildingIcon,
    path: '/vendor-management',
    component: VendorManagementPage,
  },
  {
    id: 'invoice-management',
    name: 'Invoice Management',
    icon: DocumentValidationIcon,
    path: '/invoice-management',
    component: InvoiceManagementPage,
  },
  {
    id: 'payment-reports',
    name: 'Payment Reports',
    icon: Analytics01Icon,
    path: '/payment-reports',
  },
  {
    id: 'fee-structure',
    name: 'Fee Structure',
    icon: DocumentValidationIcon,
    path: '/fee-structure',
  },
  {
    id: 'role-management',
    name: 'Role Management',
    icon: UserIcon,
    path: '/roles',
    component: RolesPage,
  },
  {
    id: 'user-management',
    name: 'User Management',
    icon: UserIcon,
    path: '/users',
    component: UsersPage,
  },
  {
    id: 'reports',
    name: 'Reports',
    icon: Analytics01Icon,
    path: '/reports',
  },
  {
    id: 'accommodations',
    name: 'Accommodations',
    icon: BuildingIcon,
    path: '/accommodations',
    component: AccommodationsPage,
  },
  // {
  //   id: 'departments',
  //   name: 'Departments',
  //   icon: DocumentValidationIcon, // Use a valid imported icon
  //   path: '/departments',
  // },
  {
    id: 'calendar',
    name: 'Calendar',
    icon: CalendarIcon,
    path: '/calendar',
    component: CalendarPage,
  },
  {
    id: 'canvas',
    name: 'Canvas',
    icon: LayersIcon,
    path: '/canvases',
    component: CanvasCatalogPage,
  },
  {
    id: 'chat',
    name: 'Chat',
    icon: ChattingIcon,
    path: '/chat',
    component: ChatPage,
    layout: ChatLayout,
  },
  {
    id: 'notifications',
    name: 'Notifications',
    icon: NotificationIcon,
    path: '/notifications',
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: SettingsIcon,
    path: '/settings',
    component: PersonalSettings,
  },
];
