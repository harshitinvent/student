import React, { useState, useEffect } from 'react';
import {
    Table,
    Button,
    Input,
    Modal,
    Form,
    message,
    Space,
    Tag,
    Popconfirm,
    DatePicker,
    Select,
    Card,
    Row,
    Col,
    Statistic
} from 'antd';
import type { Key } from 'antd/es/table/interface';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    BookOutlined,
    SearchOutlined
} from '@ant-design/icons';
import {
    Semester,
    CreateSemesterRequest,
    UpdateSemesterRequest,
    Year
} from '../../types/scheduling';
import { semesterAPI, academicYearAPI } from '../../services/schedulingAPI';
import PageTitleArea from '../../components/shared/PageTitleArea';
import dayjs from 'dayjs';
import DeleteIcon from "../../assets/trash-delete.svg"; 
import EditIcon from "../../assets/edit.svg";

const { Search } = Input;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

export default function SemesterManagementPage() {
    const [semesters, setSemesters] = useState<Semester[]>([]);
    const [years, setYears] = useState<Year[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingSemester, setEditingSemester] = useState<Semester | null>(null);
    const [searchText, setSearchText] = useState('');
    const [selectedYear, setSelectedYear] = useState<string>('');
    const [form] = Form.useForm();

    useEffect(() => {
        loadYears();
    }, []);

    useEffect(() => {
        if (years && years.length > 0) {
            setSelectedYear(years[0].id);
        }
    }, [years]);

    useEffect(() => {
        if (selectedYear) {
            loadSemesters();
        }
    }, [selectedYear]);

    const loadYears = async () => {
        try {
            const data = await academicYearAPI.getAllYears();
            setYears(data || []); // Ensure we never set null
        } catch (error) {
            message.error('Failed to load years');
            console.error('Error loading years:', error);
            setYears([]); // Set empty array on error
        }
    };

    const loadSemesters = async () => {
        if (!selectedYear) return;

        setLoading(true);
        try {
            const data = await semesterAPI.getSemestersByYear(selectedYear);
            setSemesters(data || []); // Ensure we never set null
        } catch (error) {
            message.error('Failed to load semesters');
            console.error('Error loading semesters:', error);
            setSemesters([]); // Set empty array on error
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingSemester(null);
        form.resetFields();
        form.setFieldsValue({ year_id: selectedYear });
        setModalVisible(true);
    };

    const handleEdit = (semester: Semester) => {
        setEditingSemester(semester);
        form.setFieldsValue({
            year_id: semester.year_id,
            name: semester.name,
            semester_number: semester.semester_number,
            start_date: dayjs(semester.start_date),
            end_date: dayjs(semester.end_date),
            registration_start: dayjs(semester.registration_start),
            registration_end: dayjs(semester.registration_end),
            classes_start: dayjs(semester.classes_start),
            classes_end: dayjs(semester.classes_end),
            exams_start: dayjs(semester.exams_start),
            exams_end: dayjs(semester.exams_end),
            status: semester.status,
            description: semester.description
        });
        setModalVisible(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await semesterAPI.deleteSemester(id);
            message.success('Semester deleted successfully');
            loadSemesters();
        } catch (error) {
            message.error('Failed to delete semester');
            console.error('Error deleting semester:', error);
        }
    };

    const handleModalSubmit = async () => {
        try {
            const values = await form.validateFields();
            const { start_date, end_date, registration_start, registration_end, classes_start, classes_end, exams_start, exams_end, ...otherValues } = values;

            const semesterData = {
                ...otherValues,
                // start_date: start_date.format('YYYY-MM-DD'),
                // end_date: end_date.format('YYYY-MM-DD'),
                // registration_start: registration_start.format('YYYY-MM-DD'),
                // registration_end: registration_end.format('YYYY-MM-DD'),
                // classes_start: classes_start.format('YYYY-MM-DD'),
                // classes_end: classes_end.format('YYYY-MM-DD'),
                // exams_start: exams_start.format('YYYY-MM-DD'),
                // exams_end: exams_end.format('YYYY-MM-DD')
            };

            if (editingSemester) {
                await semesterAPI.updateSemester(editingSemester.id, semesterData);
                message.success('Semester updated successfully');
            } else {
                await semesterAPI.createSemester(semesterData);
                message.success('Semester created successfully');
            }

            setModalVisible(false);
            loadSemesters();
        } catch (error) {
            message.error('Failed to save semester');
            console.error('Error saving semester:', error);
        }
    };

    const handleModalCancel = () => {
        setModalVisible(false);
        form.resetFields();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return 'green';
            case 'PLANNED':
                return 'blue';
            case 'COMPLETED':
                return 'gray';
            default:
                return 'default';
        }
    };

    const getStatusText = (isActive: boolean) => {
        return isActive ? 'Active' : 'Inactive';
    };

    const getSemesterNumberColor = (number: number) => {
        switch (number) {
            case 1:
                return 'blue';
            case 2:
                return 'green';
            default:
                return 'default';
        }
    };

    const columns = [
        {
            title: 'Semester',
            dataIndex: 'name',
            key: 'name',
            render: (name: string, record: Semester) => (
                <Space>
                    {/* <Tag color={getSemesterNumberColor(record.semester_number)}>
                        {record.semester_number}
                    </Tag> */}
                    {name}
                </Space>
            ),
        },
        {
            title: 'Year',
            dataIndex: 'year_id',
            key: 'year_id',
            render: (yearId: string) => {
                const year = years.find(y => y.id === yearId);
                return year ? (
                    <Tag color="purple">{year.name}</Tag>
                ) : '-';
            },
            filters: (years || []).map(year => ({ text: year.name, value: year.id })),
            onFilter: (value: boolean | Key, record: Semester) => record.year_id === value,
        },
        // {
        //     title: 'Duration',
        //     key: 'duration',
        //     render: (record: Semester) => {
        //         const start = dayjs(record.start_date);
        //         const end = dayjs(record.end_date);
        //         const months = Math.ceil(end.diff(start, 'month', true));
        //         return `${months} months`;
        //     },
        // },
        // {
        //     title: 'Classes Period',
        //     key: 'classes_period',
        //     render: (record: Semester) => (
        //         <div className="text-sm">
        //             <div>{dayjs(record.classes_start).format('MMM DD')} - {dayjs(record.classes_end).format('MMM DD, YYYY')}</div>
        //         </div>
        //     ),
        // },
        {
            title: 'Status',
            dataIndex: 'is_active',
            key: 'is_active',
            render: (status: string) => (
                <Tag color={getStatusColor(status)}>
                    {getStatusText(status)}
                </Tag>
            ),
            filters: [
                { text: 'Active', value: 'ACTIVE' },
                { text: 'Planned', value: 'PLANNED' },
                { text: 'Completed', value: 'COMPLETED' },
            ],
            onFilter: (value: boolean | Key, record: Semester) => record.status === value,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Semester) => (
                <Space>
                    <Button
                         className="table-action-button"
                        type="link" 
                        onClick={() => handleEdit(record)}
                    >
                      <img src={EditIcon} alt="Edit" />
                    </Button>
                    <Popconfirm
                        title="Are you sure you want to delete this semester?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                         className="table-action-button"
                            type="link"
                            danger 
                        >
                             <img src={DeleteIcon} alt="delete" />
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const filteredSemesters = (semesters || []).filter(semester =>
        semester.name.toLowerCase().includes(searchText.toLowerCase()) ||
        semester.description?.toLowerCase().includes(searchText.toLowerCase())
    );

    const activeSemesters = (semesters || []).filter(semester => semester.status === 'ACTIVE').length;
    const plannedSemesters = (semesters || []).filter(semester => semester.status === 'PLANNED').length;
    const completedSemesters = (semesters || []).filter(semester => semester.status === 'COMPLETED').length;

    return (
      <div className="venue-management-page">
        {/* Year Selection and Search */}
        <Card
          className="vanue-management-card mb-6"
          title={
            <div className="card-header-main">
              <div className="card-header">
                <h3 className="card-title">Semester Management</h3>
                <p className="card-subtitle">
                  Manage semesters for each year level (1st Semester, 2nd
                  Semester)
                </p>
              </div>
              <Button
                type="primary"
                onClick={handleCreate}
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
              prefix={<SearchOutlined />}
              placeholder="Search semesters..."
              allowClear
              size="large"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ maxWidth: 400 }}
            />
            <Select
              value={selectedYear}
              onChange={setSelectedYear}
              className="filter-select"
              size="large"
              placeholder="Select year"
            >
              {(years || []).map((year) => (
                <Select.Option key={year.id} value={year.id}>
                  {year.name}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div className='table-responsive'>
  <Table
            columns={columns}
            className="vanue-table"
            dataSource={filteredSemesters}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} semesters`,
            }}
          />
          </div>
        </Card>

        
 

        {/* Add/Edit Semester Modal */}
        <Modal
          open={modalVisible}
          onCancel={handleModalCancel}
          footer={<div className="modal-custom-footer">
                <Button className="fill-grey-btn" onClick={handleModalCancel}>Cancel</Button>
                <Button className="fill-dark-btn" type="primary" htmlType="submit">
                  {editingSemester ? 'Update' : 'Create'}
                </Button>
              </div>}
          className="add-vendor-modal"
          title={
            <div className="text-left">
              <h2 className="mb-2 text-xl font-semibold">
                {editingSemester ? 'Edit Semester' : 'Add New Semester'}
              </h2>
              <p className="text-sm text-gray-600">
                {editingSemester
                  ? 'Update semester information'
                  : 'Enter semester details'}
              </p>
            </div>
          }
          width={450}
          centered
        >
          <Form form={form} layout="vertical" onFinish={handleModalSubmit}>
            <Row gutter={16}>
              <Col span={24} md={12}>
                <Form.Item
                    className="input-field-main"
                  name="year_id"
                  label="Year"
                  rules={[{ required: true, message: 'Please select a year' }]}
                >
                  <Select className="input-field-inn-select" placeholder="Select year">
                    {(years || []).map((year) => (
                      <Select.Option key={year.id} value={year.id}>
                        {year.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24} md={12}>
                <Form.Item
                className="input-field-main"
                  name="semester_number"
                  label="Semester Number"
                  rules={[
                    { required: true, message: 'Please enter semester number' },
                    // { type: 'number', min: 1, max: 2, message: 'Semester number must be 1 or 2' }
                  ]}
                >
                  <Input className="input-field-inn" type="number" min={1} max={2} placeholder="1 or 2" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
            className="input-field-main"
              name="name"
              label="Semester Name"
              rules={[
                { required: true, message: 'Please enter semester name' },
              ]}
            >
              <Input className="input-field-inn" placeholder="e.g., 1st Semester, 2nd Semester" />
            </Form.Item>

            {/* <Row gutter={16}>
                        <Col span={24} md={12}>
                            <Form.Item
                                name="start_date"
                                label="Start Date"
                                rules={[
                                    { required: true, message: 'Please select start date' }
                                ]}
                            >
                                <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
                            </Form.Item>
                        </Col>
                        <Col span={24} md={12}>
                            <Form.Item
                                name="end_date"
                                label="End Date"
                                rules={[
                                    { required: true, message: 'Please select end date' }
                                ]}
                            >
                                <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={24} md={12}>
                            <Form.Item
                                name="registration_start"
                                label="Registration Start"
                                rules={[
                                    { required: true, message: 'Please select registration start date' }
                                ]}
                            >
                                <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
                            </Form.Item>
                        </Col>
                        <Col span={24} md={12}>
                            <Form.Item
                                name="registration_end"
                                label="Registration End"
                                rules={[
                                    { required: true, message: 'Please select registration end date' }
                                ]}
                            >
                                <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={24} md={12}>
                            <Form.Item
                                name="classes_start"
                                label="Classes Start"
                                rules={[
                                    { required: true, message: 'Please select classes start date' }
                                ]}
                            >
                                <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
                            </Form.Item>
                        </Col>
                        <Col span={24} md={12}>
                            <Form.Item
                                name="classes_end"
                                label="Classes End"
                                rules={[
                                    { required: true, message: 'Please select classes end date' }
                                ]}
                            >
                                <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={24} md={12}>
                            <Form.Item
                                name="exams_start"
                                label="Exams Start"
                                rules={[
                                    { required: true, message: 'Please select exams start date' }
                                ]}
                            >
                                <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
                            </Form.Item>
                        </Col>
                        <Col span={24} md={12}>
                            <Form.Item
                                name="exams_end"
                                label="Exams End"
                                rules={[
                                    { required: true, message: 'Please select exams end date' }
                                ]}
                            >
                                <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={24} md={12}>
                            <Form.Item
                                name="status"
                                label="Status"
                                rules={[
                                    { required: true, message: 'Please select status' }
                                ]}
                            >
                                <Select placeholder="Select status">
                                    <Select.Option value="PLANNED">Planned</Select.Option>
                                    <Select.Option value="ACTIVE">Active</Select.Option>
                                    <Select.Option value="COMPLETED">Completed</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={24} md={12}>
                            <Form.Item
                                name="description"
                                label="Description"
                            >
                                <TextArea rows={2} placeholder="Optional description" />
                            </Form.Item>
                        </Col>
                    </Row> */}
 
          </Form>
        </Modal>
      </div>
    );
} 