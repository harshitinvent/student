import { Permission } from '../types/role';

export const AVAILABLE_PERMISSIONS: Permission[] = [
  // Dashboard
  {
    id: 'dashboard_read',
    name: 'View Dashboard',
    module: 'dashboard',
    action: 'read',
    description: 'Can view the main dashboard'
  },
  {
    id: 'dashboard_write',
    name: 'Edit Dashboard',
    module: 'dashboard',
    action: 'write',
    description: 'Can edit dashboard content'
  },
  {
    id: 'dashboard_create',
    name: 'Create Dashboard',
    module: 'dashboard',
    action: 'create',
    description: 'Can create dashboard widgets'
  },
  {
    id: 'dashboard_delete',
    name: 'Delete Dashboard',
    module: 'dashboard',
    action: 'delete',
    description: 'Can delete dashboard content'
  },

  // Departments
  {
    id: 'departments_read',
    name: 'View Departments',
    module: 'departments',
    action: 'read',
    description: 'Can view departments list'
  },
  {
    id: 'departments_create',
    name: 'Create Department',
    module: 'departments',
    action: 'create',
    description: 'Can create new departments'
  },
  {
    id: 'departments_write',
    name: 'Edit Department',
    module: 'departments',
    action: 'write',
    description: 'Can edit existing departments'
  },
  {
    id: 'departments_delete',
    name: 'Delete Department',
    module: 'departments',
    action: 'delete',
    description: 'Can delete departments'
  },

  // Students
  {
    id: 'students_read',
    name: 'View Students',
    module: 'students',
    action: 'read',
    description: 'Can view students list'
  },
  {
    id: 'students_create',
    name: 'Create Student',
    module: 'students',
    action: 'create',
    description: 'Can create new students'
  },
  {
    id: 'students_write',
    name: 'Edit Student',
    module: 'students',
    action: 'write',
    description: 'Can edit student information'
  },
  {
    id: 'students_delete',
    name: 'Delete Student',
    module: 'students',
    action: 'delete',
    description: 'Can delete students'
  },

  // Teachers
  {
    id: 'teachers_read',
    name: 'View Teachers',
    module: 'teachers',
    action: 'read',
    description: 'Can view teachers list'
  },
  {
    id: 'teachers_create',
    name: 'Create Teacher',
    module: 'teachers',
    action: 'create',
    description: 'Can create new teachers'
  },
  {
    id: 'teachers_write',
    name: 'Edit Teacher',
    module: 'teachers',
    action: 'write',
    description: 'Can edit teacher information'
  },
  {
    id: 'teachers_delete',
    name: 'Delete Teacher',
    module: 'teachers',
    action: 'delete',
    description: 'Can delete teachers'
  },

  // Course Management
  {
    id: 'course-management_read',
    name: 'View Course Management',
    module: 'course-management',
    action: 'read',
    description: 'Can view course management'
  },
  {
    id: 'course-management_create',
    name: 'Create Course',
    module: 'course-management',
    action: 'create',
    description: 'Can create new courses'
  },
  {
    id: 'course-management_write',
    name: 'Edit Course',
    module: 'course-management',
    action: 'write',
    description: 'Can edit course information'
  },
  {
    id: 'course-management_delete',
    name: 'Delete Course',
    module: 'course-management',
    action: 'delete',
    description: 'Can delete courses'
  },

  // Assignments
  {
    id: 'assignments_read',
    name: 'View Assignments',
    module: 'assignments',
    action: 'read',
    description: 'Can view assignments list'
  },
  {
    id: 'assignments_create',
    name: 'Create Assignment',
    module: 'assignments',
    action: 'create',
    description: 'Can create new assignments'
  },
  {
    id: 'assignments_write',
    name: 'Edit Assignment',
    module: 'assignments',
    action: 'write',
    description: 'Can edit assignments'
  },
  {
    id: 'assignments_delete',
    name: 'Delete Assignment',
    module: 'assignments',
    action: 'delete',
    description: 'Can delete assignments'
  },

  // Financial Management
  {
    id: 'financial-management_read',
    name: 'View Financial Management',
    module: 'financial-management',
    action: 'read',
    description: 'Can view financial management'
  },
  {
    id: 'financial-management_create',
    name: 'Create Financial Record',
    module: 'financial-management',
    action: 'create',
    description: 'Can create financial records'
  },
  {
    id: 'financial-management_write',
    name: 'Edit Financial Record',
    module: 'financial-management',
    action: 'write',
    description: 'Can edit financial records'
  },
  {
    id: 'financial-management_delete',
    name: 'Delete Financial Record',
    module: 'financial-management',
    action: 'delete',
    description: 'Can delete financial records'
  },

  // Financial Transactions
  {
    id: 'financial-transactions_read',
    name: 'View Financial Transactions',
    module: 'financial-transactions',
    action: 'read',
    description: 'Can view financial transactions'
  },
  {
    id: 'financial-transactions_create',
    name: 'Create Financial Transaction',
    module: 'financial-transactions',
    action: 'create',
    description: 'Can create financial transactions'
  },
  {
    id: 'financial-transactions_write',
    name: 'Edit Financial Transaction',
    module: 'financial-transactions',
    action: 'write',
    description: 'Can edit financial transactions'
  },
  {
    id: 'financial-transactions_delete',
    name: 'Delete Financial Transaction',
    module: 'financial-transactions',
    action: 'delete',
    description: 'Can delete financial transactions'
  },

  // Vendor Management
  {
    id: 'vendor-management_read',
    name: 'View Vendor Management',
    module: 'vendor-management',
    action: 'read',
    description: 'Can view vendor management'
  },
  {
    id: 'vendor-management_create',
    name: 'Create Vendor',
    module: 'vendor-management',
    action: 'create',
    description: 'Can create new vendors'
  },
  {
    id: 'vendor-management_write',
    name: 'Edit Vendor',
    module: 'vendor-management',
    action: 'write',
    description: 'Can edit vendor information'
  },
  {
    id: 'vendor-management_delete',
    name: 'Delete Vendor',
    module: 'vendor-management',
    action: 'delete',
    description: 'Can delete vendors'
  },

  // Invoice Management
  {
    id: 'invoice-management_read',
    name: 'View Invoice Management',
    module: 'invoice-management',
    action: 'read',
    description: 'Can view invoice management'
  },
  {
    id: 'invoice-management_create',
    name: 'Create Invoice',
    module: 'invoice-management',
    action: 'create',
    description: 'Can create new invoices'
  },
  {
    id: 'invoice-management_write',
    name: 'Edit Invoice',
    module: 'invoice-management',
    action: 'write',
    description: 'Can edit invoice information'
  },
  {
    id: 'invoice-management_delete',
    name: 'Delete Invoice',
    module: 'invoice-management',
    action: 'delete',
    description: 'Can delete invoices'
  },

  // Payment Reports
  {
    id: 'payment-reports_read',
    name: 'View Payment Reports',
    module: 'payment-reports',
    action: 'read',
    description: 'Can view payment reports'
  },
  {
    id: 'payment-reports_create',
    name: 'Create Payment Report',
    module: 'payment-reports',
    action: 'create',
    description: 'Can create payment reports'
  },

  // Fee Structure
  {
    id: 'fee-structure_read',
    name: 'View Fee Structure',
    module: 'fee-structure',
    action: 'read',
    description: 'Can view fee structure'
  },
  {
    id: 'fee-structure_write',
    name: 'Edit Fee Structure',
    module: 'fee-structure',
    action: 'write',
    description: 'Can edit fee structure'
  },

  // Admissions
  {
    id: 'admissions_read',
    name: 'View Admissions',
    module: 'admissions',
    action: 'read',
    description: 'Can view admissions'
  },
  {
    id: 'admissions_create',
    name: 'Create Admission',
    module: 'admissions',
    action: 'create',
    description: 'Can create new admissions'
  },
  {
    id: 'admissions_write',
    name: 'Edit Admission',
    module: 'admissions',
    action: 'write',
    description: 'Can edit admission information'
  },
  {
    id: 'admissions_delete',
    name: 'Delete Admission',
    module: 'admissions',
    action: 'delete',
    description: 'Can delete admissions'
  },

  // Role Management
  {
    id: 'role-management_read',
    name: 'View Role Management',
    module: 'role-management',
    action: 'read',
    description: 'Can view role management'
  },
  {
    id: 'role-management_create',
    name: 'Create Role',
    module: 'role-management',
    action: 'create',
    description: 'Can create new roles'
  },
  {
    id: 'role-management_write',
    name: 'Edit Role',
    module: 'role-management',
    action: 'write',
    description: 'Can edit role information'
  },
  {
    id: 'role-management_delete',
    name: 'Delete Role',
    module: 'role-management',
    action: 'delete',
    description: 'Can delete roles'
  },

  // User Management
  {
    id: 'user-management_read',
    name: 'View User Management',
    module: 'user-management',
    action: 'read',
    description: 'Can view user management'
  },
  {
    id: 'user-management_create',
    name: 'Create User',
    module: 'user-management',
    action: 'create',
    description: 'Can create new users'
  },
  {
    id: 'user-management_write',
    name: 'Edit User',
    module: 'user-management',
    action: 'write',
    description: 'Can edit user information'
  },
  {
    id: 'user-management_delete',
    name: 'Delete User',
    module: 'user-management',
    action: 'delete',
    description: 'Can delete users'
  },

  // Accommodations
  {
    id: 'accommodations_read',
    name: 'View Accommodations',
    module: 'accommodations',
    action: 'read',
    description: 'Can view accommodations'
  },
  {
    id: 'accommodations_create',
    name: 'Create Accommodation',
    module: 'accommodations',
    action: 'create',
    description: 'Can create new accommodations'
  },
  {
    id: 'accommodations_write',
    name: 'Edit Accommodation',
    module: 'accommodations',
    action: 'write',
    description: 'Can edit accommodation information'
  },
  {
    id: 'accommodations_delete',
    name: 'Delete Accommodation',
    module: 'accommodations',
    action: 'delete',
    description: 'Can delete accommodations'
  },

  // Calendar
  {
    id: 'calendar_read',
    name: 'View Calendar',
    module: 'calendar',
    action: 'read',
    description: 'Can view calendar'
  },
  {
    id: 'calendar_create',
    name: 'Create Calendar Event',
    module: 'calendar',
    action: 'create',
    description: 'Can create calendar events'
  },
  {
    id: 'calendar_write',
    name: 'Edit Calendar Event',
    module: 'calendar',
    action: 'write',
    description: 'Can edit calendar events'
  },
  {
    id: 'calendar_delete',
    name: 'Delete Calendar Event',
    module: 'calendar',
    action: 'delete',
    description: 'Can delete calendar events'
  },

  // Chat
  {
    id: 'chat_read',
    name: 'View Chat',
    module: 'chat',
    action: 'read',
    description: 'Can view chat messages'
  },
  {
    id: 'chat_create',
    name: 'Send Chat Message',
    module: 'chat',
    action: 'create',
    description: 'Can send chat messages'
  },
  {
    id: 'chat_write',
    name: 'Edit Chat Message',
    module: 'chat',
    action: 'write',
    description: 'Can edit chat messages'
  },
  {
    id: 'chat_delete',
    name: 'Delete Chat Message',
    module: 'chat',
    action: 'delete',
    description: 'Can delete chat messages'
  },

  // Settings
  {
    id: 'settings_read',
    name: 'View Settings',
    module: 'settings',
    action: 'read',
    description: 'Can view settings'
  },
  {
    id: 'settings_write',
    name: 'Edit Settings',
    module: 'settings',
    action: 'write',
    description: 'Can edit settings'
  },

  // Reports
  {
    id: 'reports_read',
    name: 'View Reports',
    module: 'reports',
    action: 'read',
    description: 'Can view system reports'
  },
  {
    id: 'reports_create',
    name: 'Generate Reports',
    module: 'reports',
    action: 'create',
    description: 'Can generate new reports'
  },

  // Announcements
  {
    id: 'announcements_read',
    name: 'View Announcements',
    module: 'announcements',
    action: 'read',
    description: 'Can view announcements'
  },
  {
    id: 'announcements_create',
    name: 'Create Announcement',
    module: 'announcements',
    action: 'create',
    description: 'Can create announcements'
  },
  {
    id: 'announcements_write',
    name: 'Edit Announcement',
    module: 'announcements',
    action: 'write',
    description: 'Can edit announcements'
  },
  {
    id: 'announcements_delete',
    name: 'Delete Announcement',
    module: 'announcements',
    action: 'delete',
    description: 'Can delete announcements'
  },

  // Whiteboard
  {
    id: 'whiteboard_read',
    name: 'View Whiteboard',
    module: 'whiteboard',
    action: 'read',
    description: 'Can view whiteboard content'
  },
  {
    id: 'whiteboard_create',
    name: 'Create Whiteboard',
    module: 'whiteboard',
    action: 'create',
    description: 'Can create whiteboard content'
  },
  {
    id: 'whiteboard_write',
    name: 'Edit Whiteboard',
    module: 'whiteboard',
    action: 'write',
    description: 'Can edit whiteboard content'
  },
  {
    id: 'whiteboard_delete',
    name: 'Delete Whiteboard',
    module: 'whiteboard',
    action: 'delete',
    description: 'Can delete whiteboard content'
  },

  // Prerequisites
  {
    id: 'prerequisites_read',
    name: 'View Prerequisites',
    module: 'prerequisites',
    action: 'read',
    description: 'Can view course prerequisites'
  },
  {
    id: 'prerequisites_create',
    name: 'Create Prerequisites',
    module: 'prerequisites',
    action: 'create',
    description: 'Can create course prerequisites'
  },
  {
    id: 'prerequisites_write',
    name: 'Edit Prerequisites',
    module: 'prerequisites',
    action: 'write',
    description: 'Can edit course prerequisites'
  },
  {
    id: 'prerequisites_delete',
    name: 'Delete Prerequisites',
    module: 'prerequisites',
    action: 'delete',
    description: 'Can delete course prerequisites'
  },

  // Academic Years Management
  {
    id: 'academic-years_read',
    name: 'View Academic Years',
    module: 'academic-years',
    action: 'read',
    description: 'Can view academic years (1st Year, 2nd Year, etc.)'
  },
  {
    id: 'academic-years_create',
    name: 'Create Academic Year',
    module: 'academic-years',
    action: 'create',
    description: 'Can create new academic years'
  },
  {
    id: 'academic-years_write',
    name: 'Edit Academic Year',
    module: 'academic-years',
    action: 'write',
    description: 'Can edit academic year information'
  },
  {
    id: 'academic-years_delete',
    name: 'Delete Academic Year',
    module: 'academic-years',
    action: 'delete',
    description: 'Can delete academic years'
  },

  // Semester Management
  {
    id: 'semester-management_read',
    name: 'View Semesters',
    module: 'semester-management',
    action: 'read',
    description: 'Can view semesters for each year level'
  },
  {
    id: 'semester-management_create',
    name: 'Create Semester',
    module: 'semester-management',
    action: 'create',
    description: 'Can create new semesters'
  },
  {
    id: 'semester-management_write',
    name: 'Edit Semester',
    module: 'semester-management',
    action: 'write',
    description: 'Can edit semester information'
  },
  {
    id: 'semester-management_delete',
    name: 'Delete Semester',
    module: 'semester-management',
    action: 'delete',
    description: 'Can delete semesters'
  },

  // Class Scheduling - Class Management
  {
    id: 'class-management_read',
    name: 'View Class Management',
    module: 'class-management',
    action: 'read',
    description: 'Can view class sections'
  },
  {
    id: 'class-management_create',
    name: 'Create Class Sections',
    module: 'class-management',
    action: 'create',
    description: 'Can create class sections'
  },
  {
    id: 'class-management_write',
    name: 'Edit Class Sections',
    module: 'class-management',
    action: 'write',
    description: 'Can edit class sections'
  },
  {
    id: 'class-management_delete',
    name: 'Delete Class Sections',
    module: 'class-management',
    action: 'delete',
    description: 'Can delete class sections'
  },

  // Class Scheduling - Meeting Times
  {
    id: 'meeting-times_read',
    name: 'View Meeting Times',
    module: 'meeting-times',
    action: 'read',
    description: 'Can view class meeting times'
  },
  {
    id: 'meeting-times_create',
    name: 'Create Meeting Times',
    module: 'meeting-times',
    action: 'create',
    description: 'Can create class meeting times'
  },
  {
    id: 'meeting-times_write',
    name: 'Edit Meeting Times',
    module: 'meeting-times',
    action: 'write',
    description: 'Can edit class meeting times'
  },
  {
    id: 'meeting-times_delete',
    name: 'Delete Meeting Times',
    module: 'meeting-times',
    action: 'delete',
    description: 'Can delete class meeting times'
  },

  // Class Scheduling - Calendar
  {
    id: 'class-calendar_read',
    name: 'View Class Calendar',
    module: 'class-calendar',
    action: 'read',
    description: 'Can view class calendar'
  },

  // Campus Management
  {
    id: 'campus-management_read',
    name: 'View Campuses',
    module: 'campus-management',
    action: 'read',
    description: 'Can view campus information'
  },
  {
    id: 'campus-management_create',
    name: 'Create Campus',
    module: 'campus-management',
    action: 'create',
    description: 'Can create new campuses'
  },
  {
    id: 'campus-management_write',
    name: 'Edit Campus',
    module: 'campus-management',
    action: 'write',
    description: 'Can edit campus information'
  },
  {
    id: 'campus-management_delete',
    name: 'Delete Campus',
    module: 'campus-management',
    action: 'delete',
    description: 'Can delete campuses'
  },

  // Venue Management
  {
    id: 'venue-management_read',
    name: 'View Venues',
    module: 'venue-management',
    action: 'read',
    description: 'Can view venue information'
  },
  {
    id: 'venue-management_create',
    name: 'Create Venue',
    module: 'venue-management',
    action: 'create',
    description: 'Can create new venues'
  },
  {
    id: 'venue-management_write',
    name: 'Edit Venue',
    module: 'venue-management',
    action: 'write',
    description: 'Can edit venue information'
  },
  {
    id: 'venue-management_delete',
    name: 'Delete Venue',
    module: 'venue-management',
    action: 'delete',
    description: 'Can delete venues'
  }
];

export const MODULES = [
  'dashboard',
  'departments',
  'students',
  'teachers',
  'course-management',
  'assignments',
  'financial-management',
  'financial-transactions',
  'vendor-management',
  'invoice-management',
  'payment-reports',
  'fee-structure',
  'admissions',
  'announcements',
  'role-management',
  'user-management',
  'reports',
  'accommodations',
  'calendar',
  'chat',
  'settings',
  'whiteboard',
  'prerequisites',
  'academic-years',
  'semester-management',
  'class-management',
  'meeting-times',
  'class-calendar',
  'campus-management',
  'venue-management'
];

export const ACTIONS = ['read', 'write', 'delete', 'create'] as const; 