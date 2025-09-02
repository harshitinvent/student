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
    Select,
    Card,
    Row,
    Col,
    Statistic,
    Pagination,
    Tooltip,
    Tabs
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    SearchOutlined,
    FilterOutlined,
    EnvironmentOutlined,
    HomeOutlined,
    LeftOutlined,
    UserOutlined
} from '@ant-design/icons';
import {
    Venue,
    CreateVenueRequest,
    UpdateVenueRequest,
    VenueSearchFilters,
    Campus
} from '../../types/scheduling';


import { venueAPI, campusAPI } from '../../services/schedulingAPI';
import PageTitleArea from '../../components/shared/PageTitleArea';
import EditIcon from "../../assets/edit.svg";
import DeleteIcon from "../../assets/trash-delete.svg";
import CampusManagementPage from './CampusManagement';
const { Search } = Input;
const { TabPane } = Tabs;

export default function VenueManagementPage() {
    const [venues, setVenues] = useState<Venue[]>([]);
    const [campuses, setCampuses] = useState<Campus[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingVenue, setEditingVenue] = useState<Venue | null>(null);
    const [searchText, setSearchText] = useState('');
    const [filters, setFilters] = useState<VenueSearchFilters>({
        page: 1,
        page_size: 10
    });
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [form] = Form.useForm();

    useEffect(() => {
        loadVenues();
        loadCampuses();
    }, [filters, currentPage, pageSize]);

    const loadVenues = async () => {
        setLoading(true);
        try {
            const searchFilters: VenueSearchFilters = {
                ...filters,
                search: searchText || undefined,
                page: currentPage,
                page_size: pageSize
            };

            const response = await venueAPI.getAllVenues(searchFilters);
            console.log('Venues API Response:', response);

            // Ensure we always set an array
            const venuesData = response.data.venues;
            if (Array.isArray(venuesData)) {
                setVenues(venuesData);
            } else {
                console.warn('API returned non-array data:', venuesData);
                setVenues([]);
            }

            setTotal(response.data.pagination.total || 0);
        } catch (error) {
            message.error('Failed to load venues');
            console.error('Error loading venues:', error);
            setVenues([]);
        } finally {
            setLoading(false);
        }
    };

    const loadCampuses = async () => {
        try {
            const response = await campusAPI.getAllCampuses({});
            if (response.data?.campuses) {
                setCampuses(response.data.campuses);
            }
        } catch (error) {
            console.error('Error loading campuses:', error);
        }
    };

    const handleCreate = () => {
        setEditingVenue(null);
        form.resetFields();
        setModalVisible(true);
    };

    const handleEdit = (venue: Venue) => {
        setEditingVenue(venue);
        form.setFieldsValue({
            code: venue.code,
            name: venue.name,
            campus_id: venue.campus_id,
            is_active: venue.is_active
        });
        setModalVisible(true);
    };

    const handleDelete = async (id: string | number) => {
        try {
            await venueAPI.deleteVenue(id);
            message.success('Venue deleted successfully');
            loadVenues();
        } catch (error) {
            message.error('Failed to delete venue');
            console.error('Error deleting venue:', error);
        }
    };

    const handleModalSubmit = async () => {
        try {
            const values = await form.validateFields();
            console.log('Form values to submit:', values);

            if (editingVenue) {
                console.log('Updating venue:', editingVenue.id, 'with data:', values);
                await venueAPI.updateVenue(editingVenue.id, values);
                message.success('Venue updated successfully');
            } else {
                console.log('Creating new venue with data:', values);
                await venueAPI.createVenue(values);
                message.success('Venue created successfully');
            }

            setModalVisible(false);
            loadVenues();
        } catch (error) {
            message.error('Failed to save venue');
            console.error('Error saving venue:', error);
        }
    };

    const handleModalCancel = () => {
        setModalVisible(false);
        form.resetFields();
    };

    const handleSearch = (value: string) => {
        setSearchText(value);
        setCurrentPage(1);
        setFilters(prev => ({ ...prev, page: 1 }));
    };

    const handleFilterChange = (key: string, value: any) => {
        setCurrentPage(1);
        setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
    };

    const handlePageChange = (page: number, size?: number) => {
        setCurrentPage(page);
        if (size) {
            setPageSize(size);
        }
    };

    const getStatusColor = (isActive: boolean) => {
        return isActive ? 'green' : 'red';
    };

    const getStatusText = (isActive: boolean) => {
        return isActive ? 'Active' : 'Inactive';
    };

    const columns = [
  {
    title: "Venue",
    key: "venue_info",
    render: (record: Venue) => (
      <div className='venue-info-table'>
        <div className="vanue-main-name"><UserOutlined />{record.name}</div>
        <div className="vanue-subname">Code: {record.code}</div>
        <div className='vanue-features-tags'>
            <span>Has Projector</span>
            <span>Has Whiteboard</span>
        </div>
      </div>
    ),
  },
//   {
//     title: "Campus",
//     key: "campus",
//     render: (record: Venue) => (
//       <div className="text-sm">
//         <div className="flex items-center gap-1 text-gray-600">
//           <EnvironmentOutlined />
//           {record.campus?.name || "Unknown Campus"}
//         </div>
//         <div className="text-gray-500 text-xs mt-1">
//           Campus Code: {record.campus?.code || "N/A"}
//         </div>
//       </div>
//     ),
//   },
//   {
//     title: "Status",
//     dataIndex: "is_active",
//     key: "is_active",
//     render: (isActive: any) => (
//       <Tag color={getStatusColor(Boolean(isActive))}>
//         {getStatusText(Boolean(isActive))}
//       </Tag>
//     ),
//     filters: [
//       { text: "Active", value: true },
//       { text: "Inactive", value: false },
//     ],
//     onFilter: (value: boolean | React.Key, record: Venue) =>
//       Boolean(record.is_active) === value,
//   },

 
  {
    title: "Building, Type & Status",
    key: "building",
    render: () => (
      <div className="building-column">
        <div className="building-name">Science Building</div>
        <p>ACADEMIC</p>
        <div className="building-type text-blue-500">Meeting Room</div>
        <Tag color="green" className="status-tag">
          Available
        </Tag>
      </div>
    ),
  },
  {
    title: "Credits",
    key: "credits",
    render: () => (
      <div className="credits-column">
        <div className="credits-date">10/07/2025</div>
        <div className="credits-dept text-xs text-gray-500">
          Maintenance Staff
        </div>
      </div>
    ),
  },
  {
    title: "Capacity",
    key: "capacity",
    render: () => (
      <div className="capacity-column flex items-center gap-1">
        <span role="img" aria-label="capacity">
         <UserOutlined />
        </span>
        150
      </div>
    ),
  },
    {
    title: "Last Updated",
    key: "actions",
    render: (_: any, record: Venue) => (
      <Space>
        <Button
          type="link" 
          onClick={() => handleEdit(record)}
          className='table-action-button'
        >
          <img src={EditIcon} alt="Edit" />
        </Button>
        <Popconfirm
          title="Are you sure you want to delete this venue?"
          onConfirm={() => handleDelete(record.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="link" className='table-action-button'>
         <img src={DeleteIcon} alt="Delete" />
          </Button>
        </Popconfirm>
      </Space>
    ),
  },
];


    const activeVenues = venues.filter(venue => venue.is_active === true).length;
    const inactiveVenues = venues.filter(venue => venue.is_active === false).length;

    return (
      <div className="venue-management-page">
        <div className="page-headding-line">
          <Button className="back-button">
            <LeftOutlined />
          </Button>
          <h6>Venues & Buildings</h6>
        </div>
        <Tabs defaultActiveKey="venues" className="custom-tabs">
          <TabPane tab="Venues" key="venues">
            <div className="p-6">
              {/* <PageTitleArea
                title="Venue Management"
                subtitle="Manage university venues linked to campuses"
                action={
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleCreate}
                  >
                    Add Venue
                  </Button>
                }
              /> */}

              {/* Search and Filters */}
              <Card
                className="vanue-management-card mb-6"
                title={
                  <div className="card-header">
                    <h3 className="card-title">Venues (4)</h3>
                    <p className="card-subtitle">
                      Manage campus spaces and their attributes
                    </p>
                  </div>
                }
                extra={
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleCreate}
                    style={{
                                backgroundColor: '#000000',
                                borderColor: '#000000',
                                fontWeight: 500,
                                color: '#ffffff',
                                borderRadius: '6px',
                            }}
                  >
                    Add Venue
                  </Button>
                }
              >
                <div className="filters-bar">
                  {/* Search */}
                  <Input
                    placeholder="Search rooms..."
                    allowClear
                    size="large"
                    prefix={<SearchOutlined />}
                    onSearch={handleSearch}
                    className="filter-input"
                  />

                  {/* All Types */}
                  <Select
                    placeholder="All Types"
                    size="large"
                    className="filter-select"
                  >
                    <Select.Option value="classroom">Classroom</Select.Option>
                    <Select.Option value="meeting">Meeting Room</Select.Option>
                    <Select.Option value="conference">
                      Conference Hall
                    </Select.Option>
                  </Select>

                  {/* Status */}
                  <Select
                    placeholder="All Statuses"
                    size="large"
                    className="filter-select"
                  >
                    <Select.Option value="active">Active</Select.Option>
                    <Select.Option value="inactive">Inactive</Select.Option>
                  </Select>

                  {/* Buildings */}
                  <Select
                    placeholder="All Buildings"
                    size="large"
                    className="filter-select"
                  >
                    <Select.Option value="science">
                      Science Building
                    </Select.Option>
                    <Select.Option value="arts">Arts Building</Select.Option>
                    <Select.Option value="commerce">
                      Commerce Building
                    </Select.Option>
                  </Select>

                  {/* Min capacity */}
                  <Select
                    placeholder="Min capacity"
                    size="large"
                    className="filter-select"
                  >
                    <Select.Option value="10">10</Select.Option>
                    <Select.Option value="30">30</Select.Option>
                    <Select.Option value="50">50</Select.Option>
                  </Select>

                  {/* Max capacity */}
                  <Select
                    placeholder="Max capacity"
                    size="large"
                    className="filter-select"
                  >
                    <Select.Option value="50">50</Select.Option>
                    <Select.Option value="100">100</Select.Option>
                    <Select.Option value="200">200</Select.Option>
                  </Select>

                  {/* Features */}
                  <Select
                    placeholder="Features"
                    mode="multiple"
                    size="large"
                    className="filter-select"
                  >
                    <Select.Option value="projector">
                      Has Projector
                    </Select.Option>
                    <Select.Option value="whiteboard">
                      Has Whiteboard
                    </Select.Option>
                    <Select.Option value="video">
                      Video Conferencing
                    </Select.Option>
                    <Select.Option value="tiered">Tiered Seating</Select.Option>
                  </Select>

                  {/* Action Button */}
                  <Button className="filter-button">Features</Button>
                </div>
                 <div className="table-responsive">
                  <Table
                    columns={columns}
                    dataSource={venues}
                    rowKey="id"
                    loading={loading}
                    pagination={false}
                    className="vanue-table"
                  />
                </div>
  <div className="mt-4 flex items-center justify-between">
                  <div className="text-gray-600">
                    {total > 0
                      ? `Showing ${Math.max(1, (currentPage - 1) * pageSize + 1)} to ${Math.min(currentPage * pageSize, total)} of ${total} venues`
                      : 'No venues found'}
                  </div>
                  <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={total || 0}
                    showSizeChanger
                    showQuickJumper
                    showTotal={(total, range) =>
                      `${range[0]}-${range[1]} of ${total}`
                    }
                    onChange={handlePageChange}
                    onShowSizeChange={(current, size) => {
                      setPageSize(size);
                      setCurrentPage(1);
                    }}
                  />
                </div>
              </Card>

              {/* Statistics Cards */}
              {/* <Row gutter={16} className="mb-6">
                <Col span={6}>
                  <Card>
                    <Statistic
                      title="Total Venues"
                      value={total || 0}
                      prefix={<HomeOutlined />}
                      valueStyle={{ color: '#3f8600' }}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card>
                    <Statistic
                      title="Active Venues"
                      value={activeVenues || 0}
                      valueStyle={{ color: '#1890ff' }}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card>
                    <Statistic
                      title="Inactive Venues"
                      value={inactiveVenues || 0}
                      valueStyle={{ color: '#722ed1' }}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card>
                    <Statistic
                      title="Campuses"
                      value={new Set(venues.map((v) => v.campus_id)).size}
                      valueStyle={{ color: '#52c41a' }}
                    />
                  </Card>
                </Col>
              </Row> */}

          

              {/* Add/Edit Venue Modal */}
              <Modal
                className="add-vendor-modal"
                open={modalVisible}
                onCancel={handleModalCancel}
                footer={   <div className="modal-custom-footer">
                      <Button className="fill-grey-btn" onClick={handleModalCancel}>Cancel</Button>
                      <Button  className="fill-dark-btn" type="primary" htmlType="submit">
                        {editingVenue ? 'Update' : 'Create'}
                      </Button>
                    </div>}
                title={
                  <div className="text-left">
                    <h2 className="mb-2 text-xl font-semibold">
                      {editingVenue ? 'Edit Venue' : 'Add New Venue'}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {editingVenue
                        ? 'Update venue information'
                        : 'Enter venue details'}
                    </p>
                  </div>
                }
                width={600}
                centered
              >
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleModalSubmit}
                >
                  <Row gutter={16}>
                    <Col span={24} md={12}>
                      <Form.Item
                         className="input-field-main"
                        name="code"
                        label="Venue Code"
                        rules={[
                          {
                            required: true,
                            message: 'Please enter venue code',
                          },
                        ]}
                      >
                        <Input  className="input-field-inn" placeholder="e.g., A101, B201" />
                      </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                      <Form.Item
                          className="input-field-main"
                        name="name"
                        label="Venue Name"
                        rules={[
                          {
                            required: true,
                            message: 'Please enter venue name',
                          },
                        ]}
                      >
                        <Input  className="input-field-inn" placeholder="e.g., Room A101, Auditorium B" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                     className="input-field-main"
                    name="campus_id"
                    label="Campus"
                    rules={[
                      { required: true, message: 'Please select a campus' },
                    ]}
                  >
                    <Select  className="input-field-inn-select" placeholder="Select campus">
                      {campuses.map((campus) => (
                        <Select.Option key={campus.id} value={campus.id}>
                          {campus.name} ({campus.code})
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>

                  {/* <Form.Item
                        name="is_active"
                        label="Status"
                        rules={[
                            { required: true, message: 'Please select status' }
                        ]}
                    >
                        <Select placeholder="Select status">
                            <Select.Option value={true}>Active</Select.Option>
                            <Select.Option value={false}>Inactive</Select.Option>
                        </Select>
                    </Form.Item> */}
 
                </Form>
              </Modal>
            </div>
          </TabPane>

          <TabPane tab="Buildings" key="buildings">
            <div className="p-6">
              <CampusManagementPage />
            </div>
          </TabPane>
        </Tabs>
      </div>
    );
} 