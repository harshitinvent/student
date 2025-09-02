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
    Tooltip
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    SearchOutlined,
    FilterOutlined,
    EnvironmentOutlined,
    PhoneOutlined,
    MailOutlined
} from '@ant-design/icons';
import {
    Campus,
    CreateCampusRequest,
    UpdateCampusRequest,
    CampusSearchFilters
} from '../../types/scheduling';
import { campusAPI } from '../../services/schedulingAPI';
import PageTitleArea from '../../components/shared/PageTitleArea';

import PinIcon from "../../assets/pin-icon.svg"; 
import EditIcon from "../../assets/edit.svg";
import DeleteIcon from "../../assets/trash-delete.svg";
import BulddingIcon from "../../assets/building.svg";

const { Search } = Input;
const { TextArea } = Input;

export default function CampusManagementPage() {
    const [campuses, setCampuses] = useState<Campus[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingCampus, setEditingCampus] = useState<Campus | null>(null);
    const [searchText, setSearchText] = useState('');
    const [filters, setFilters] = useState<CampusSearchFilters>({
        page: 1,
        page_size: 10
    });
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [form] = Form.useForm();

    // Debug logging for initialization
    console.log('CampusManagementPage initialized with campuses:', campuses, 'Type:', typeof campuses, 'IsArray:', Array.isArray(campuses));

    // Helper function to ensure campuses is always an array
    const getSafeCampuses = (): Campus[] => {
        // Multiple safety checks
        if (campuses === null || campuses === undefined) {
            console.warn('Campuses is null/undefined, returning empty array');
            return [];
        }

        if (!Array.isArray(campuses)) {
            console.warn('Campuses is not an array:', campuses, 'Type:', typeof campuses);
            // Force reset to empty array if something went wrong
            setTimeout(() => setSafeCampuses([]), 0);
            return [];
        }

        // Additional check to ensure all items are valid Campus objects
        const validCampuses = campuses.filter(campus =>
            campus &&
            typeof campus === 'object' &&
            'id' in campus &&
            'name' in campus
        );

        if (validCampuses.length !== campuses.length) {
            console.warn('Some campus items are invalid, filtering out:', campuses.length - validCampuses.length, 'invalid items');
        }

        return validCampuses;
    };

    // Safe setter for campuses - only allows arrays
    const setSafeCampuses = (data: any) => {
        if (Array.isArray(data)) {
            setCampuses(data);
        } else {
            console.warn('Attempted to set campuses to non-array:', data);
            setCampuses([]);
        }
    };

    // Debug logging
    useEffect(() => {
        console.log('Campuses state changed:', campuses, 'Type:', typeof campuses, 'IsArray:', Array.isArray(campuses));

        // Safety check - ensure campuses is always an array
        if (campuses && !Array.isArray(campuses)) {
            console.warn('Campuses is not an array, resetting to empty array');
            setSafeCampuses([]);
        }
    }, [campuses]);

    useEffect(() => {
        loadCampuses();
    }, [filters, currentPage, pageSize]);

    const loadCampuses = async () => {
        setLoading(true);
        try {
            const searchFilters: CampusSearchFilters = {
                ...filters,
                search: searchText || undefined,
                page: currentPage,
                page_size: pageSize
            };

            const response = await campusAPI.getAllCampuses(searchFilters);
            console.log('Full API Response:', response);
            console.log('Response data:', response.data);
            console.log('Campuses array:', response.data?.campuses);
            console.log('Pagination:', response.data?.pagination);

            // Ensure we always set an array
            const campusesData = response.data.campuses;
            console.log('Campuses data to set:', campusesData, 'Type:', typeof campusesData, 'IsArray:', Array.isArray(campusesData));

            if (Array.isArray(campusesData)) {
                setSafeCampuses(campusesData);
            } else {
                console.warn('API returned non-array data:', campusesData);
                setSafeCampuses([]);
            }

            setTotal(response.data.pagination.total || 0);
        } catch (error) {
            message.error('Failed to load campuses');
            console.error('Error loading campuses:', error);
            setSafeCampuses([]); // Ensure we always have an array
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingCampus(null);
        form.resetFields();
        setModalVisible(true);
    };

    const handleEdit = (campus: Campus) => {
        setEditingCampus(campus);
        form.setFieldsValue({
            name: campus.name,
            code: campus.code,
            description: campus.description,
            address: campus.address,
            city: campus.city,
            state: campus.state,
            country: campus.country,
            phone: campus.phone,
            email: campus.email,
            is_active: campus.is_active
        });
        setModalVisible(true);
    };

    const handleDelete = async (id: string | number) => {
        try {
            await campusAPI.deleteCampus(id.toString());
            message.success('Campus deleted successfully');
            loadCampuses();
        } catch (error) {
            message.error('Failed to delete campus');
            console.error('Error deleting campus:', error);
        }
    };

    const handleModalSubmit = async () => {
        try {
            const values = await form.validateFields();
            console.log('Form values to submit:', values);

            if (editingCampus) {
                console.log('Updating campus:', editingCampus.id, 'with data:', values);
                await campusAPI.updateCampus(editingCampus.id, values);
                message.success('Campus updated successfully');
            } else {
                console.log('Creating new campus with data:', values);
                await campusAPI.createCampus(values);
                message.success('Campus created successfully');
            }

            setModalVisible(false);
            loadCampuses();
        } catch (error) {
            message.error('Failed to save campus');
            console.error('Error saving campus:', error);
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
            title: 'Building',
            key: 'campus_info',
            render: (record: Campus) => (
                <div>
                    {/* <div className="font-medium text-gray-900">{record.name}</div>
                    <div className="text-sm text-gray-500">Code: {record.code}</div> */}
                     <div className="capacity-column flex items-center gap-3">
                    <img src={BulddingIcon} alt="pin" />
                    45
                </div>
                </div>
            ),
        },
          {
            title: "Adress & Type",
            key: "adress",
            render: () => (
              <div className="building-column"> 
                <p>123 University Ave</p>
                <div className="building-type text-blue-500">Academic</div>
              </div>
            ),
          },
        // {
        //     title: 'Location',
        //     key: 'location',
        //     render: (record: Campus) => (
        //         <div className="text-sm">
        //             <div className="flex items-center gap-1 text-gray-600">
        //                 <EnvironmentOutlined />
        //                 {record.city}, {record.state}, {record.country}
        //             </div>
        //             {record.address && (
        //                 <div className="text-gray-500 text-xs mt-1">{record.address}</div>
        //             )}
        //         </div>
        //     ),
        // },
        // {
        //     title: 'Contact',
        //     key: 'contact',
        //     render: (record: Campus) => (
        //         <div className="text-sm">
        //             {record.phone && (
        //                 <div className="flex items-center gap-1 text-gray-600">
        //                     <PhoneOutlined />
        //                     {record.phone}
        //                 </div>
        //             )}
        //             {record.email && (
        //                 <div className="flex items-center gap-1 text-gray-600 mt-1">
        //                     <MailOutlined />
        //                     {record.email}
        //                 </div>
        //             )}
        //         </div>
        //     ),
        // },
        // {
        //     title: 'Status',
        //     dataIndex: 'is_active',
        //     key: 'is_active',
        //     render: (isActive: any) => (
        //         <Tag color={getStatusColor(Boolean(isActive))}>
        //             {getStatusText(Boolean(isActive))}
        //         </Tag>
        //     ),
        //     filters: [
        //         { text: 'Active', value: true },
        //         { text: 'Inactive', value: false },
        //     ],
        //     onFilter: (value: boolean | React.Key, record: Campus) => Boolean(record.is_active) === value,
        // },
         {
    title: "Venues",
    key: "venues",
    render: () => (
      <div className="capacity-column flex items-center gap-3">
          <img src={PinIcon} alt="pin" />
        45
      </div>
    ),
  },
   {
    title: "Created",
    key: "created",
    render: () => (
      <div className="capacity-column flex items-center gap-1">
       15/01/2020
      </div>
    ),
  },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Campus) => (
                <Space>
                    <Button
                        type="link" 
                         className='table-action-button'
                        onClick={() => handleEdit(record)}
                    >
                       <img src={EditIcon} alt="Edit" />
                    </Button>
                    <Popconfirm
                        title="Are you sure you want to delete this campus?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            type="link"
                          className='table-action-button'
                        >
                             <img src={DeleteIcon} alt="Delete" />
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    // Ensure we have valid data before rendering
    const safeCampuses = getSafeCampuses();
    console.log('Safe campuses for rendering:', safeCampuses, 'Length:', safeCampuses.length);

    // Show loading state while initializing
    if (loading && safeCampuses.length === 0) {
        return (
            <div className="p-6">
                <div className="text-center">
                    <h2 className="text-xl font-semibold">Loading Campuses...</h2>
                    <p className="text-gray-600">Please wait while we fetch campus data.</p>
                </div>
            </div>
        );
    }

    // If we don't have valid data, show loading or error state
    if (!Array.isArray(safeCampuses)) {
        console.error('Critical error: campuses is still not an array after safety checks');
        return (
            <div className="p-6">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-red-600">Error Loading Campuses</h2>
                    <p className="text-gray-600">Please refresh the page to try again.</p>
                </div>
            </div>
        );
    }

    const activeCampuses = safeCampuses.filter(campus => campus.is_active === true).length;
    const inactiveCampuses = safeCampuses.filter(campus => campus.is_active === false).length;

    return (
      <div className="p-0">
        {/* Safety check - if something goes wrong, show error */}
        {!Array.isArray(safeCampuses) && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-600">
              ⚠️ Data integrity issue detected. Showing safe fallback.
            </p>
          </div>
        )}

        {/* <PageTitleArea
          title="Campus Management"
          subtitle="Manage university campuses with locations, contact information, and status"
          action={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreate}
            >
              Add Campus
            </Button>
          }
        /> */}

        {/* Search and Filters */}
        <Card
          className="vanue-management-card mb-6"
          title={
            <div className="card-header">
              <h3 className="card-title">Buildings (4)</h3>
              <p className="card-subtitle">
                Campus building inventory and management
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
              Add Buildings
            </Button>
          }
        >
          <div className="filters-bar">
            {/* Search */}
            <Input
              placeholder="Search venues..."
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
              <Select.Option value="conference">Conference Hall</Select.Option>
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
              <Select.Option value="science">Science Building</Select.Option>
              <Select.Option value="arts">Arts Building</Select.Option>
              <Select.Option value="commerce">Commerce Building</Select.Option>
            </Select>

            {/* Action Button */}
            <Button className="filter-button">Features</Button>
          </div>
          <div className='table-responsive'>
          <Table
            columns={columns}
            dataSource={safeCampuses}
            rowKey="id"
            loading={loading}
            pagination={false}
          />
          </div>

          {/* Custom Pagination */}
          <div className="mt-6 flex items-center justify-between">
            <div className="text-gray-600">
              {total > 0
                ? `Showing ${Math.max(1, (currentPage - 1) * pageSize + 1)} to ${Math.min(currentPage * pageSize, total)} of ${total} campuses`
                : 'No campuses found'}
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
                            title="Total Campuses"
                            value={total || 0}
                            prefix={<EnvironmentOutlined />}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Active Campuses"
                            value={activeCampuses || 0}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Inactive Campuses"
                            value={inactiveCampuses || 0}
                            valueStyle={{ color: '#722ed1' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Countries"
                            value={new Set(safeCampuses.map(c => c.country)).size}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
            </Row> */}

        {/* Add/Edit Campus Modal */}
        <Modal
           className="add-vendor-modal"
          open={modalVisible}
          onCancel={handleModalCancel}
          footer={ <div className="modal-custom-footer">
                <Button className="fill-grey-btn" onClick={handleModalCancel}>Cancel</Button>
                <Button  className="fill-dark-btn" type="primary" htmlType="submit">
                  {editingCampus ? 'Update' : 'Create'}
                </Button>
              </div>}
          title={
            <div className="text-left">
              <h2 className="mb-2 text-xl font-semibold">
                {editingCampus ? 'Edit Buildings' : 'Add New Buildings'}
              </h2>
              <p className="text-sm text-gray-600">
                {editingCampus
                  ? 'Update Buildings information'
                  : 'Enter Buildings details'}
              </p>
            </div>
          }
          width={700}
          centered
        >
          <Form form={form} layout="vertical" onFinish={handleModalSubmit}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                   className="input-field-main"
                  name="name"
                  label="Campus Name"
                  rules={[
                    { required: true, message: 'Please enter campus name' },
                  ]}
                >
                  <Input  className="input-field-inn" placeholder="e.g., Main Campus, North Campus" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                className="input-field-main"
                  name="code"
                  label="Campus Code"
                  rules={[
                    { required: true, message: 'Please enter campus code' },
                  ]}
                >
                  <Input className="input-field-inn" placeholder="e.g., MAIN, NORTH, SOUTH" />
                </Form.Item>
              </Col>
            </Row>

            {/* <Form.Item
                        name="address"
                        label="Address"
                    >
                        <TextArea rows={2} placeholder="Full address of the campus" />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item
                                name="city"
                                label="City"
                                rules={[
                                    { required: true, message: 'Please enter city' }
                                ]}
                            >
                                <Input placeholder="City name" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="state"
                                label="State/Province"
                                rules={[
                                    { required: true, message: 'Please enter state' }
                                ]}
                            >
                                <Input placeholder="State or province" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="country"
                                label="Country"
                                rules={[
                                    { required: true, message: 'Please enter country' }
                                ]}
                            >
                                <Input placeholder="Country name" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="phone"
                                label="Phone Number"
                            >
                                <Input placeholder="+1-555-0123" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[
                                    { type: 'email', message: 'Please enter a valid email' }
                                ]}
                            >
                                <Input placeholder="campus@university.edu" />
                            </Form.Item>
                        </Col>
                    </Row> */}

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
    );
} 