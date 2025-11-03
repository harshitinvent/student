import { useEffect, useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Button,
  Pagination,
  Card,
  Table,
  Tag,
  message,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  StopOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import AddEditCourseModal from './AddEditCourseModal';
import ConfirmActionModal from '../../components/shared/ConfirmActionModal';
import DeleteIcon from '../../assets/trash-delete.svg';
import EditIcon from '../../assets/edit.svg';
// API helpers
const API_BASE = 'http://localhost:8080/api/courses';

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

type Course = {
  ID: string;
  course_code: string; // Unique course code (e.g., "BIO-101")
  title: string; // Course title (e.g., "Introduction to Cell Biology")
  description: string; // Course description
  credit_hours: number; // Credit hours (e.g., 3, 4, 6)
  status: 'Active' | 'Retired'; // Course status
  is_active: boolean; // Legacy field for backward compatibility
  programs?: string[]; // Array of program IDs
  created_at: string;
  updated_at: string;
};

async function fetchCourses(
  search = '',
  page = 1,
  pageSize = 10
): Promise<{ courses: Course[]; total: number }> {
  const res = await fetch(
    `${API_BASE}?search=${encodeURIComponent(search)}&page=${page}&pageSize=${pageSize}`,
    {
      headers: getAuthHeaders(),
    }
  );
  if (!res.ok) throw new Error('Failed to fetch courses');
  return res.json();
}

async function fetchPrograms(): Promise<
  Array<{
    ID: string;
    name: string;
    degree_type: string;
    department_name?: string;
  }>
> {
  const res = await fetch('http://localhost:8080/api/programs', {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch programs');
  const data = await res.json();
  return data.data || data || [];
}

async function addCourse(data: {
  course_code: string;
  title: string;
  description: string;
  credit_hours: number;
  status: 'Active' | 'Retired';
  programs?: string[];
}): Promise<any> {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to add course');
  return res.json();
}

async function updateCourse(
  id: string,
  data: {
    course_code: string;
    title: string;
    description: string;
    credit_hours: number;
    status: 'Active' | 'Retired';
    programs?: string[];
  }
): Promise<any> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update course');
  return res.json();
}

async function deleteCourse(id: string): Promise<any> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete course');
  return res.json();
}

async function activateCourse(id: string): Promise<any> {
  const res = await fetch(`${API_BASE}/${id}/activate`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to activate course');
  return res.json();
}

async function deactivateCourse(id: string): Promise<any> {
  const res = await fetch(`${API_BASE}/${id}/deactivate`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to deactivate course');
  return res.json();
}

export default function CoursesManagementPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [programs, setPrograms] = useState<
    Array<{
      ID: string;
      name: string;
      degree_type: string;
      department_name?: string;
    }>
  >([]);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editCourse, setEditCourse] = useState<Course | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [tableLoading, setTableLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    action: 'delete' | 'activate' | 'deactivate' | null;
    course: Course | null;
    loading: boolean;
  }>({ open: false, action: null, course: null, loading: false });

  const loadCourses = () => {
    setTableLoading(true);
    fetchCourses(search, page, pageSize)
      .then((res) => {
        setCourses(res.courses);
        setTotal(res.total);
      })
      .catch(() => message.error('Failed to load courses'))
      .finally(() => setTableLoading(false));
  };

  const loadPrograms = () => {
    fetchPrograms()
      .then(setPrograms)
      .catch((error) => {
        message.error('Failed to load programs');
        console.error(error);
      });
  };

  useEffect(() => {
    loadCourses();
    loadPrograms();
  }, [search, page, pageSize]);

  const handleAdd = () => {
    setEditCourse(null);
    setModalOpen(true);
  };
  const handleEdit = (course: Course) => {
    setEditCourse(course);
    setModalOpen(true);
  };
  const handleModalClose = () => {
    setModalOpen(false);
    setEditCourse(null);
  };

  const handleModalSubmit = async (data: {
    course_code: string;
    title: string;
    description: string;
    credit_hours: number;
    status: 'Active' | 'Retired';
    programs?: string[];
  }) => {
    try {
      if (editCourse) {
        await updateCourse(editCourse.ID, data);
        message.success('Course updated!');
      } else {
        await addCourse(data);
        message.success('Course added!');
      }
      setModalOpen(false);
      setEditCourse(null);
      loadCourses();
    } catch (e: any) {
      message.error(e.message);
    }
  };

  const openConfirmModal = (
    action: 'delete' | 'activate' | 'deactivate',
    course: Course
  ) => {
    setConfirmModal({ open: true, action, course, loading: false });
  };

  const closeConfirmModal = () => {
    setConfirmModal((prev) => ({ ...prev, open: false, loading: false }));
  };

  const handleConfirmAction = async () => {
    if (!confirmModal.action || !confirmModal.course) return;
    setConfirmModal((prev) => ({ ...prev, loading: true }));
    try {
      if (confirmModal.action === 'delete') {
        await deleteCourse(confirmModal.course.ID);
        message.success('Course deleted!');
      } else if (confirmModal.action === 'activate') {
        await activateCourse(confirmModal.course.ID);
        message.success('Course activated!');
      } else if (confirmModal.action === 'deactivate') {
        await deactivateCourse(confirmModal.course.ID);
        message.success('Course deactivated!');
      }
      loadCourses();
      closeConfirmModal();
    } catch (e: any) {
      message.error(e.message);
      setConfirmModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const columns = [
    {
      title: 'Course Code',
      dataIndex: 'course_code',
      key: 'course_code',
      render: (text: string) => <span className="">{text}</span>,
    },
    {
      title: 'Course Title',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => <span className=" ">{text}</span>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (description: string) => (
        <div className="max-w-xs">
          <p className="line-clamp-2">
            {description || 'No description provided'}
          </p>
        </div>
      ),
    },
    {
      title: 'Credit Hours',
      dataIndex: 'credit_hours',
      key: 'credit_hours',
      render: (hours: number) => (
        <span className="text-sm font-medium">{hours} credits</span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: 'Active' | 'Retired') => (
        <Tag
          color={status === 'Active' ? 'green' : 'red'}
          icon={status === 'Active'}
        >
          {status}
        </Tag>
      ),
    },
    {
      title: 'Prerequisites',
      key: 'prerequisites',
      render: (_: any, course: Course) => {
        // This would be populated from API in real implementation
        const prerequisites: any[] = []; // Placeholder for prerequisites data
        return (
          <div>
            {prerequisites.length > 0 ? (
              <div className="space-y-1">
                {prerequisites.map((prereq: any, index: number) => (
                  <Tag key={index} color="blue">
                    {prereq.course_code}
                  </Tag>
                ))}
              </div>
            ) : (
              <span className="text-sm text-gray-400">No prerequisites</span>
            )}
          </div>
        );
      },
    },
    {
      title: 'Created',
      dataIndex: 'CreatedAt',
      key: 'CreatedAt',
      render: (date: string) => (
        <span className="text-sm text-gray-500">
          {new Date(date).toLocaleDateString()}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, course: Course) => (
        <div className="flex gap-3">
          <Button
            className="table-action-button"
            onClick={() => handleEdit(course)}
          >
            <img src={EditIcon} alt="Edit" />
          </Button>
          <Button
            className="table-action-status-button"
            icon={course.is_active ? <StopOutlined /> : <CheckCircleOutlined />}
            onClick={() =>
              openConfirmModal(
                course.is_active ? 'deactivate' : 'activate',
                course
              )
            }
          >
            {course.is_active ? 'Deactivate' : 'Activate'}
          </Button>
          <Button
            className="table-action-button"
            onClick={() => openConfirmModal('delete', course)}
          >
            <img src={DeleteIcon} alt="delete" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="venue-management-page">
      <Card
        className="vanue-management-card mb-6"
        title={
          <div className="card-header-main">
            <div className="card-header">
              <h3 className="card-title">Course Management</h3>
              {/* <p className="card-subtitle">
                          Manage semesters for each year level (1st Semester, 2nd
                          Semester)
                        </p> */}
            </div>
            <Button
              type="primary"
              onClick={handleAdd}
              style={{
                backgroundColor: '#000000',
                borderColor: '#000000',
                fontWeight: 500,
                color: '#ffffff',
                borderRadius: '6px',
              }}
            >
              Add Semester
            </Button>
          </div>
        }
      >
        <div className="filters-bar">
          <Input
            className="filter-input"
            placeholder="Search courses by name or course ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
            size="large"
            prefix={<SearchOutlined />}
          // onSearch={v => setSearch(v)}
          />
        </div>
        <div className="table-responsive">
          <Table
            className="vanue-table"
            columns={columns}
            dataSource={courses}
            rowKey="ID"
            loading={tableLoading}
            pagination={{
              current: page,
              pageSize,
              total,
              showSizeChanger: true,
              onChange: (p, ps) => {
                setPage(p);
                setPageSize(ps || 10);
              },
            }}
          />
        </div>

        <AddEditCourseModal
          open={modalOpen}
          onClose={handleModalClose}
          onSubmit={handleModalSubmit}
          initialData={editCourse}
          programs={programs}
        />

        <ConfirmActionModal
          open={confirmModal.open}
          action={confirmModal.action as any}
          departmentName={confirmModal.course ? confirmModal.course.name : ''}
          onConfirm={handleConfirmAction}
          onCancel={closeConfirmModal}
          loading={confirmModal.loading}
        />
      </Card>
    </div>
  );
}
