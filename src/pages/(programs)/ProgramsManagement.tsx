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
  Select,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  StopOutlined,
  ClockCircleOutlined,
  BookOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import AddEditProgramModal from './AddEditProgramModal';
import ConfirmActionModal from '../../components/shared/ConfirmActionModal';
import DeleteIcon from '../../assets/trash-delete.svg';
import EditIcon from '../../assets/edit.svg';

import BookMarkIcon from '../../assets/bookmark.svg';
// API helpers
const API_BASE = 'http://localhost:8080/api/programs';

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

type Program = {
  ID: string;
  name: string; // Program name (e.g., "Bachelor of Science in Biology")
  degree_type: 'B.S.' | 'B.A.' | 'M.S.' | 'M.A.' | 'Ph.D.' | 'Associate'; // Degree type
  department_id: string; // Department ID
  department_name?: string; // Department name (for display)
  total_credits_required: number; // Total credits required for graduation
  status: 'Active' | 'Planned' | 'Discontinued'; // Program status
  description?: string; // Optional description
  created_at: string;
  updated_at: string;
};

type Department = {
  ID: string;
  name: string;
  description?: string;
};

async function fetchPrograms(
  search = '',
  page = 1,
  pageSize = 10
): Promise<{ programs: Program[]; total: number }> {
  const res = await fetch(
    `${API_BASE}?search=${encodeURIComponent(search)}&page=${page}&pageSize=${pageSize}`,
    {
      headers: getAuthHeaders(),
    }
  );
  if (!res.ok) throw new Error('Failed to fetch programs');
  return res.json();
}

async function fetchDepartments(): Promise<Department[]> {
  console.log('Fetching departments from API...');
  const res = await fetch('http://localhost:8080/api/departments', {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch departments');
  const data = await res.json();
  console.log('Raw API response for departments:', data);
  return data.departments || [];
}
async function fetchStreams(): Promise<Department[]> {
  console.log('Fetching departments from API...');
  const res = await fetch('http://localhost:8080/api/streams', {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch departments');
  const data = await res.json();
  console.log('Raw API response for departments:', data);
  return data.streams || [];
}

async function addProgram(data: {
  name: string;
  degree_type: 'B.S.' | 'B.A.' | 'M.S.' | 'M.A.' | 'Ph.D.' | 'Associate';
  department_id: string;
  total_credits_required: number;
  status: 'Active' | 'Planned' | 'Discontinued';
  description?: string;
}): Promise<any> {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to add program');
  return res.json();
}

async function updateProgram(
  id: string,
  data: {
    name: string;
    degree_type: 'B.S.' | 'B.A.' | 'M.S.' | 'M.A.' | 'Ph.D.' | 'Associate';
    department_id: string;
    total_credits_required: number;
    status: 'Active' | 'Planned' | 'Discontinued';
    description?: string;
  }
): Promise<any> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update program');
  return res.json();
}

async function deleteProgram(id: string): Promise<any> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete program');
  return res.json();
}

export default function ProgramsManagementPage() {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [search, setSearch] = useState('');
  const [degreeTypeFilter, setDegreeTypeFilter] = useState<string>('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editProgram, setEditProgram] = useState<Program | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [tableLoading, setTableLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    action: 'delete' | null;
    program: Program | null;
    loading: boolean;
  }>({ open: false, action: null, program: null, loading: false });

  const loadPrograms = () => {
    setTableLoading(true);
    fetchPrograms(search, page, pageSize)
      .then(({ programs, total }) => {
        // Apply degree type filter
        let filteredPrograms = programs;
        if (degreeTypeFilter) {
          filteredPrograms = programs.filter(
            (program) => program.degree_type === degreeTypeFilter
          );
        }
        setPrograms(filteredPrograms);
        setTotal(filteredPrograms.length);
      })
      .catch((error) => {
        message.error('Failed to load programs');
        console.error(error);
      })
      .finally(() => setTableLoading(false));
  };

  // const loadDepartments = () => {
  //     console.log('Loading departments...');
  //     fetchDepartments()
  //         .then((departments) => {
  //             console.log('Departments loaded:', departments);
  //             setDepartments(departments);
  //         })
  //         .catch((error) => {
  //             message.error('Failed to load departments');
  //             console.error('Error loading departments:', error);
  //         });
  // };

  const loadStreams = () => {
    console.log('Loading departments...');
    fetchStreams()
      .then((departments) => {
        console.log('Departments loaded:', departments);
        setDepartments(departments);
      })
      .catch((error) => {
        message.error('Failed to load departments');
        console.error('Error loading departments:', error);
      });
  };
  // const loadDepartments = () => {
  //     console.log('Loading departments...');
  //     fetchDepartments()
  //         .then((departments) => {
  //             console.log('Departments loaded:', departments);
  //             setDepartments(departments);
  //         })
  //         .catch((error) => {
  //             message.error('Failed to load departments');
  //             console.error('Error loading departments:', error);
  //         });
  // };

  useEffect(() => {
    loadPrograms();
    // loadDepartments();
    loadStreams();
  }, [search, page, pageSize, degreeTypeFilter]);

  const handleAdd = () => {
    setEditProgram(null);
    setModalOpen(true);
  };
  const handleEdit = (program: Program) => {
    setEditProgram(program);
    setModalOpen(true);
  };
  const handleModalClose = () => {
    setModalOpen(false);
    setEditProgram(null);
  };

  const handleModalSubmit = async (data: {
    name: string;
    degree_type: 'B.S.' | 'B.A.' | 'M.S.' | 'M.A.' | 'Ph.D.' | 'Associate';
    department_id: string;
    total_credits_required: number;
    status: 'Active' | 'Planned' | 'Discontinued';
    description?: string;
  }) => {
    try {
      if (editProgram) {
        await updateProgram(editProgram.ID, data);
        message.success('Program updated!');
      } else {
        await addProgram(data);
        message.success('Program added!');
      }
      setModalOpen(false);
      setEditProgram(null);
      loadPrograms();
    } catch (e: any) {
      message.error(e.message);
    }
  };

  const openConfirmModal = (action: 'delete', program: Program) => {
    setConfirmModal({ open: true, action, program, loading: false });
  };

  const closeConfirmModal = () => {
    setConfirmModal((prev) => ({ ...prev, open: false, loading: false }));
  };

  const handleConfirmAction = async () => {
    if (!confirmModal.action || !confirmModal.program) return;
    setConfirmModal((prev) => ({ ...prev, loading: true }));
    try {
      if (confirmModal.action === 'delete') {
        await deleteProgram(confirmModal.program.ID);
        message.success('Program deleted!');
      }
      loadPrograms();
      closeConfirmModal();
    } catch (e: any) {
      message.error(e.message);
      setConfirmModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return <CheckCircleOutlined />;
      case 'Planned':
        return <ClockCircleOutlined />;
      case 'Discontinued':
        return <StopOutlined />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'green';
      case 'Planned':
        return 'blue';
      case 'Discontinued':
        return 'red';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      title: 'Program Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <span className="">{text}</span>,
    },
    {
      title: 'Degree Type',
      dataIndex: 'degree_type',
      key: 'degree_type',
      render: (degree: string) => <span className="">{degree}</span>,
    },
    {
      title: 'Stream',
      dataIndex: 'stream',
      key: 'stream',
      render: (stream: any) => (
        <span className="">{stream?.name || 'Unknown Stream'}</span>
      ),
    },
    {
      title: 'Credits Required',
      dataIndex: 'total_credits_required',
      key: 'total_credits_required',
      render: (credits: number) => <span className="">{credits} credits</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: 'Active' | 'Planned' | 'Discontinued') => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'CreatedAt',
      key: 'CreatedAt',
      render: (date: string) => (
        <span className="">{new Date(date).toLocaleDateString()}</span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: Program) => (
        <div className="flex gap-2">
          <Button
            className="table-action-button"
            onClick={() => handleEdit(record)}
          >
            <img src={EditIcon} alt="Edit" />
          </Button>
          <Button
            className="table-action-button"
            onClick={() => navigate(`/program-management/${record.ID}`)}
          >
            <img src={BookMarkIcon} alt="bookmark" />
          </Button>
          <Button
            className="table-action-button"
            onClick={() => openConfirmModal('delete', record)}
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
              <h3 className="card-title">Program Management</h3>
              <p className="card-subtitle">
                {' '}
                Manage academic programs and majors
              </p>
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
              Add Program
            </Button>
          </div>
        }
      >
        <div className="filters-bar">
          <Input
            placeholder="Search programs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="large"
            prefix={<SearchOutlined />}
            className="filter-input"
            allowClear
          />
          <Select
            placeholder="Filter by degree type"
            value={degreeTypeFilter}
            className="filter-select"
            onChange={setDegreeTypeFilter}
            allowClear
            size="large"
          >
            <Select.Option value="Bachelor">Bachelor</Select.Option>
            <Select.Option value="Master">Master</Select.Option>
            <Select.Option value="PHD">PHD</Select.Option>
          </Select>
        </div>
        <div className="table-responsive mb-3">
          <Table
            columns={columns}
            dataSource={programs}
            rowKey="ID"
            loading={tableLoading}
            pagination={false}
            className="vanue-table"
          />
        </div>

        <Pagination
          className="custom-pagination"
          current={page}
          pageSize={pageSize}
          total={total}
          onChange={(page, pageSize) => {
            setPage(page);
            setPageSize(pageSize);
          }}
          showSizeChanger
          showQuickJumper
          showTotal={(total, range) =>
            `${range[0]}-${range[1]} of ${total} programs`
          }
        />
      </Card>

      <AddEditProgramModal
        open={modalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        initialData={editProgram}
        departments={departments}
      />
      {(() => {
        console.log('ProgramsManagement - departments state:', departments);
        console.log(
          'ProgramsManagement - departments length:',
          departments?.length
        );
        return null;
      })()}

      <ConfirmActionModal
        open={confirmModal.open}
        title="Confirm Action"
        content={`Are you sure you want to delete the program "${confirmModal.program?.name}"?`}
        onConfirm={handleConfirmAction}
        onCancel={closeConfirmModal}
        loading={confirmModal.loading}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}
