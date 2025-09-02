import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Tag, Space, message, Modal, Form, Select, InputNumber, Tabs } from 'antd';
import { PlusOutlined, EditOutlined, BookOutlined, LeftOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import EditIcon from "../../assets/edit.svg";

// Types
type ProgramCourse = {
  id: string;
  program_id: string;
  course_id: string;
  course_code: string;
  course_title: string;
  requirement_type: 'CORE' | 'ELECTIVE' | 'GENERAL_EDUCATION';
  credits_allocated: number;
  created_at: string;
};

type Course = {
  ID: string;
  course_code: string;
  title: string;
  description: string;
  credit_hours: number;
  status: 'Active' | 'Retired';
};

type Program = {
  ID: string;
  name: string;
  degree_type: 'B.S.' | 'B.A.' | 'M.S.' | 'M.A.' | 'Ph.D.' | 'Associate';
  department_id: string;
  department_name?: string;
  total_credits_required: number;
  status: 'Active' | 'Planned' | 'Discontinued';
  description?: string;
  created_at: string;
};

// API Functions
const API_BASE = 'http://103.189.173.7:8080/api/programs';

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function fetchProgram(id: string): Promise<Program> {
  const res = await fetch(`${API_BASE}/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch program');
  const data = await res.json();
  return data.data || data;
}

async function fetchProgramCourses(programId: string): Promise<ProgramCourse[]> {
  const res = await fetch(`${API_BASE}/${programId}/courses`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch program courses');
  const data = await res.json();
  return data.data || data || [];
}

async function fetchAvailableCourses(): Promise<Course[]> {
  const res = await fetch('http://103.189.173.7:8080/api/courses', {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch courses');
  const data = await res.json();
  return data.data || data || [];
}

async function linkCourseToProgram(programId: string, data: {
  course_id: string;
  requirement_type: 'CORE' | 'ELECTIVE' | 'GENERAL_EDUCATION';
  credits_allocated: number;
}): Promise<any> {
  const res = await fetch(`${API_BASE}/${programId}/courses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to link course to program');
  return res.json();
}

async function unlinkCourseFromProgram(programId: string, courseId: string): Promise<any> {
  const res = await fetch(`${API_BASE}/${programId}/courses/${courseId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to unlink course from program');
  return res.json();
}

export default function ProgramDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [program, setProgram] = useState<Program | null>(null);
  const [programCourses, setProgramCourses] = useState<ProgramCourse[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkModalLoading, setLinkModalLoading] = useState(false);
  const [form] = Form.useForm();

  const loadData = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const [programData, availableCoursesData] = await Promise.all([
        fetchProgram(id),
        // fetchProgramCourses(id),
        fetchAvailableCourses()
      ]);


      console.log("programData================= ", programData)
      // console.log("coursesData================= ", coursesData)
      console.log("availableCoursesData================= ", availableCoursesData)
      setProgram(programData);
      // setProgramCourses(coursesData);
      setAvailableCourses(availableCoursesData.courses);
    } catch (error) {
      message.error('Failed to load program details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleLinkCourse = async (values: any) => {
    if (!id) return;

    setLinkModalLoading(true);
    try {
      await linkCourseToProgram(id, values);
      message.success('Course linked successfully');
      setLinkModalOpen(false);
      form.resetFields();
      loadData(); // Reload data
    } catch (error) {
      message.error('Failed to link course');
      console.error(error);
    } finally {
      setLinkModalLoading(false);
    }
  };

  const handleEditCourse = (course: ProgramCourse) => {
    // TODO: Implement edit course functionality
    message.info('Edit course functionality coming soon');
  };

  const handleEditCatalogCourse = (course: Course) => {
    // TODO: Implement edit catalog course functionality
    message.info('Edit catalog course functionality coming soon');
  };

  const getRequirementTypeColor = (type: string) => {
    switch (type) {
      case 'CORE': return 'red';
      case 'ELECTIVE': return 'blue';
      case 'GENERAL_EDUCATION': return 'green';
      default: return 'default';
    }
  };

  const getRequirementTypeLabel = (type: string) => {
    switch (type) {
      case 'CORE': return 'Core';
      case 'ELECTIVE': return 'Elective';
      case 'GENERAL_EDUCATION': return 'General Education';
      default: return type;
    }
  };

  const columns = [
    {
      title: 'Course Code',
      dataIndex: 'course_code',
      key: 'course_code',
      render: (code: string) => (
        <span className="font-mono text-sm">{code}</span>
      ),
    },
    {
      title: 'Course Title',
      dataIndex: 'course_title',
      key: 'course_title',
      render: (title: string) => (
        <span className="text-sm font-medium">{title}</span>
      ),
    },
    {
      title: 'Requirement Type',
      dataIndex: 'requirement_type',
      key: 'requirement_type',
      render: (type: string) => (
        <Tag color={getRequirementTypeColor(type)}>
          {getRequirementTypeLabel(type)}
        </Tag>
      ),
    },
    {
      title: 'Credits',
      dataIndex: 'credits_allocated',
      key: 'credits_allocated',
      render: (credits: number) => (
        <span className="text-sm">{credits} credits</span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: ProgramCourse) => (
        <Space>
          <Button
            className="table-action-button"
            onClick={() => handleEditCourse(record)}
          >
            <img src={EditIcon} alt="Edit" />
          </Button>
        </Space>
      ),
    },
  ];

  if (loading) {
    return <div className="p-6">Loading program details...</div>;
  }

  if (!program) {
    return <div className="p-6">Program not found</div>;
  }

  // Filter out courses that are already linked
  const unlinkedCourses = availableCourses.filter(course =>
    !programCourses.some(pc => pc.course_id === course.ID)
  );

  return (
    <div className="venue-management-page">
      <div className="mb-6">
        <div className="page-headding-line">
          <Button
            className="back-button"
            onClick={() => navigate('/program-management')}
          >
            <LeftOutlined />
          </Button>
          <h6>Back to Programs</h6>
        </div>

        <Card
          className="vanue-management-card mb-6"
          title={
            <div className="card-header-main">
              <div className="card-header">
                <h3 className="card-title">Program Details</h3>
                {/* <p className="card-subtitle">
                            Manage approved vendors and their payment information
                            </p> */}
              </div>
            </div>
          }
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold">{program.name}</h3>
              <p className="text-gray-600">{program.degree_type}</p>
              <p className="text-sm text-gray-500">
                Department: {program.department_name || 'Unknown'}
              </p>
            </div>
            <div className="text-right">
              <Tag color={program.status === 'Active' ? 'green' : 'orange'}>
                {program.status}
              </Tag>
              <p className="mt-2 text-sm text-gray-600">
                Total Credits Required: {program.total_credits_required}
              </p>
            </div>
          </div>
          {program.description && (
            <p className="mt-4 text-gray-700">{program.description}</p>
          )}
        </Card>
      </div>

      <Card>
        <Tabs
          defaultActiveKey="programs"
          items={[
            {
              key: 'programs',
              label: 'Academic Programs',
              children: (
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">
                        Academic Programs ({programCourses.length})
                      </h3>
                      <p className="text-gray-600">
                        Manage degree programs and their requirements
                      </p>
                    </div>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => setLinkModalOpen(true)}
                      disabled={unlinkedCourses.length === 0}
                      style={{
                        backgroundColor: '#000000',
                        borderColor: '#000000',
                        fontWeight: 500,
                        color: '#ffffff',
                        borderRadius: '6px',
                      }}
                    >
                      Create Program
                    </Button>
                  </div>
                  <div className='table-responsive'>
                    <Table
                      className="vanue-table"
                      columns={columns}
                      dataSource={programCourses}
                      rowKey="id"
                      pagination={false}
                      locale={{
                        emptyText: (
                          <div className="py-8 text-center">
                            <BookOutlined className="mb-4 text-4xl text-gray-300" />
                            <p className="text-gray-500">
                              No courses linked to this program
                            </p>
                            <Button
                              type="primary"
                              onClick={() => setLinkModalOpen(true)}
                              className="mt-6 fill-dark-btn"
                            >
                              Link First Course
                            </Button>
                          </div>
                        ),
                      }}
                    />
                  </div>
                </div>
              ),
            },
            {
              key: 'courses',
              label: 'Course Catalog',
              children: (
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">
                        Course Catalog ({availableCourses.length})
                      </h3>
                      <p className="text-gray-600">
                        Browse and manage available courses
                      </p>
                    </div>
                  </div>
                  <div className='table-responsive'>
                    <Table
                      className="vanue-table"
                      columns={[
                        {
                          title: 'Course Code',
                          dataIndex: 'course_code',
                          key: 'course_code',
                          render: (code: string) => (
                            <span className="">{code}</span>
                          ),
                        },
                        {
                          title: 'Course Title',
                          dataIndex: 'title',
                          key: 'title',
                          render: (title: string) => (
                            <span className="">{title}</span>
                          ),
                        },
                        {
                          title: 'Credits',
                          dataIndex: 'credit_hours',
                          key: 'credit_hours',
                          render: (credits: number) => (
                            <span className="">{credits} credits</span>
                          ),
                        },
                        {
                          title: 'Status',
                          dataIndex: 'status',
                          key: 'status',
                          render: (status: string) => (
                            <Tag
                              color={status === 'Active' ? 'green' : 'orange'}
                            >
                              {status}
                            </Tag>
                          ),
                        },
                        {
                          title: 'Actions',
                          key: 'actions',
                          render: (_: any, record: Course) => (
                            <Space>
                              <Button
                                type="text"
                                className="table-action-button"
                                onClick={() => handleEditCatalogCourse(record)}
                              >
                                <img src={EditIcon} alt="Edit" />
                              </Button>
                            </Space>
                          ),
                        },
                      ]}
                      dataSource={availableCourses}
                      rowKey="ID"
                      pagination={false}
                    />
                  </div>
                </div>
              ),
            },
            {
              key: 'prerequisites',
              label: 'Prerequisites',
              children: (
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Prerequisites</h3>
                      <p className="text-gray-600">
                        Manage course prerequisites and requirements
                      </p>
                    </div>
                  </div>
                  <div className="py-8 text-center">
                    <BookOutlined className="mb-4 text-4xl text-gray-300" />
                    <p className="text-gray-500">
                      Prerequisites management coming soon
                    </p>
                  </div>
                </div>
              ),
            },
          ]}
        />
      </Card>

      {/* Link Course Modal */}
      <Modal
        className="add-vendor-modal"
        title="Link Course to Program"
        open={linkModalOpen}
        onCancel={() => {
          setLinkModalOpen(false);
          form.resetFields();
        }}
        footer={<div className="modal-custom-footer">
          <Button
            className='fill-grey-btn'
            onClick={() => {
              setLinkModalOpen(false);
              form.resetFields();
            }}
          >
            Cancel
          </Button>
          <Button
            className='fill-dark-btn'
            type="primary"
            htmlType="submit"
            loading={linkModalLoading}
          >
            Link Course
          </Button>

        </div>}
        width={450}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleLinkCourse}
          initialValues={{
            requirement_type: 'CORE',
            credits_allocated: 3,
          }}
        >
          <Form.Item
            className='input-field-main'
            name="course_id"
            label="Select Course"
            rules={[{ required: true, message: 'Please select a course' }]}
          >
            <Select
              className="input-field-inn-select"
              placeholder="Choose a course to link"
              showSearch
              optionFilterProp="children"
            >
              {unlinkedCourses.map((course) => (
                <Select.Option key={course.ID} value={course.ID}>
                  {course.course_code} - {course.title}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            className='input-field-main'
            name="requirement_type"
            label="Requirement Type"
            rules={[
              { required: true, message: 'Please select requirement type' },
            ]}
          >
            <Select className="input-field-inn-select">
              <Select.Option value="CORE">Core (Mandatory)</Select.Option>
              <Select.Option value="ELECTIVE">
                Elective (Optional)
              </Select.Option>
              <Select.Option value="GENERAL_EDUCATION">
                General Education
              </Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            className='input-field-main'
            name="credits_allocated"
            label="Credits Allocated"
            rules={[{ required: true, message: 'Please enter credits' }]}
          >
            <InputNumber
              className="input-field-inn-number"
              min={1}
              max={6}
              placeholder="Enter credits"
              width={"100%"}
            />
          </Form.Item>


        </Form>
      </Modal>
    </div>
  );
} 