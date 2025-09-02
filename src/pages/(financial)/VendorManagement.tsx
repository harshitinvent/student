import { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Select, message, Table, Tag, Card, Space, Tooltip, Row, Col, Statistic, Typography, Divider } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined, SearchOutlined, FilterOutlined, UserOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined, BankOutlined, ShopOutlined, HomeOutlined, LeftOutlined } from '@ant-design/icons';
import type {
    Vendor,
    CreateVendorRequest,
    UpdateVendorRequest,
    VendorFilter
} from '../../types/vendor';
import {
    getAllVendors,
    createVendor,
    updateVendor,
    deleteVendor,
    getVendorCategories,
    handleVendorAPIError
} from '../../services/vendorAPI';

const { Title, Text } = Typography;
import CalendarIcon from "../../assets/calendar.svg"; 
import EditIcon from "../../assets/edit.svg";
import ViewIcon from "../../assets/view-icon.svg";
import BulddingIcon from "../../assets/building.svg";
import MailIcon from "../../assets/mail-icon.svg";
import PhoneIcon from "../../assets/phone-icon.svg";

export default function VendorManagementPage() {
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [tableLoading, setTableLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [categoryFilter, setCategoryFilter] = useState('ALL');
    const [categories, setCategories] = useState<string[]>([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    // Modal states
    const [addVendorModalOpen, setAddVendorModalOpen] = useState(false);
    const [editVendorModalOpen, setEditVendorModalOpen] = useState(false);
    const [viewVendorModalOpen, setViewVendorModalOpen] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [vendorToDelete, setVendorToDelete] = useState<Vendor | null>(null);

    // Form instances
    const [addForm] = Form.useForm();
    const [editForm] = Form.useForm();

    useEffect(() => {
        loadVendors();
    }, [searchTerm]);

    const loadVendors = async (page = 1, pageSize = 10) => {
        try {
            setTableLoading(true);
            const filters: VendorFilter = {};
            if (searchTerm) filters.search = searchTerm;
            if (statusFilter !== 'ALL') filters.status = statusFilter;
            if (categoryFilter !== 'ALL') filters.category = categoryFilter;

            const data = await getAllVendors(filters);
            setVendors(data);
            setPagination(prev => ({
                ...prev,
                current: page,
                pageSize,
                total: data.length, // Adjust based on your API response
            }));
        } catch (error) {
            console.error('Failed to load vendors:', error);
            setVendors([]);
            message.error(handleVendorAPIError(error));
        } finally {
            setTableLoading(false);
        }
    };

    const loadCategories = async () => {
        try {
            const data = await getVendorCategories();
            setCategories(data);
        } catch (error) {
            console.error('Failed to load categories:', error);
            setCategories([]);
        }
    };

    const handleAddVendor = async (values: any) => {
        try {
            await createVendor(values);
            setAddVendorModalOpen(false);
            addForm.resetFields();
            await loadVendors();
            message.success('Vendor created successfully!');
        } catch (error) {
            console.error('Failed to create vendor:', error);
            message.error(handleVendorAPIError(error));
        }
    };

    const handleEditVendor = async (values: any) => {
        if (!selectedVendor) return;

        try {
            await updateVendor(selectedVendor.id, values);
            setEditVendorModalOpen(false);
            editForm.resetFields();
            setSelectedVendor(null);
            await loadVendors();
            message.success('Vendor updated successfully!');
        } catch (error) {
            console.error('Failed to update vendor:', error);
            message.error(handleVendorAPIError(error));
        }
    };

    const handleDeleteVendor = async () => {
        if (!vendorToDelete) return;

        try {
            await deleteVendor(vendorToDelete.id);
            setDeleteConfirmOpen(false);
            setVendorToDelete(null);
            await loadVendors();
            message.success('Vendor deleted successfully!');
        } catch (error) {
            console.error('Failed to delete vendor:', error);
            message.error(handleVendorAPIError(error));
        }
    };

    const openEditModal = (vendor: Vendor) => {
        setSelectedVendor(vendor);
        editForm.setFieldsValue({
            vendor_name: vendor.vendor_name,
            contact_person: vendor.contact_person,
            email: vendor.email,
            phone: vendor.phone,
            address: vendor.address,
            tax_id: vendor.tax_id,
            payment_terms: vendor.payment_terms,
            category: vendor.category,
        });
        setEditVendorModalOpen(true);
    };

    const openViewModal = (vendor: Vendor) => {
        setSelectedVendor(vendor);
        setViewVendorModalOpen(true);
    };

    const openDeleteConfirm = (vendor: Vendor) => {
        setVendorToDelete(vendor);
        setDeleteConfirmOpen(true);
    };

    // const getStatusColor = (is_approved: boolean) => {
    //     switch (is_approved) {
    //         case is_approved: return 'success';
    //         case 'INACTIVE': return 'error';
    //         case 'PENDING': return 'processing';
    //         default: return 'default';
    //     }
    // };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'ACTIVE': return 'Active';
            case 'INACTIVE': return 'Inactive';
            case 'PENDING': return 'Pending';
            default: return status;
        }
    };

    const columns = [
      {
        title: (
          <div className="table-head-tital">
            <img src={BulddingIcon} alt="icon" />
            <span>Vendor Name</span>
          </div>
        ),
        dataIndex: 'vendor_name',
        key: 'vendor_name',
        render: (text: string, record: Vendor) => (
          <div className="flex items-center">
            <span
              style={{ fontSize: '14px', fontWeight: 500, color: '#1f2937' }}
            >
              {text}
            </span>
          </div>
        ),
        // sorter: (a: Vendor, b: Vendor) => a.vendor_name.localeCompare(b.vendor_name),
      },
      {
        title: (
          <div className="table-head-tital">
            <img src={CalendarIcon} alt="icon" />
            <span>Contact Person</span>
          </div>
        ),
        dataIndex: 'contact_person',
        key: 'contact_person',
        sorter: (a: Vendor, b: Vendor) =>
          a.contact_person.localeCompare(b.contact_person),
        render: (text: string) => (
          <span style={{ fontSize: '14px', color: '#1f2937' }}>{text}</span>
        ),
      },
      {
        title: (
          <div className="table-head-tital">
            <img src={MailIcon} alt="icon" />
            <span>Email</span>
          </div>
        ),
        dataIndex: 'email',
        key: 'email',
        sorter: (a: Vendor, b: Vendor) => a.email.localeCompare(b.email),
        render: (text: string) => (
          <div className="flex items-center">
            <span style={{ fontSize: '14px', color: '#6b7280' }}>{text}</span>
          </div>
        ),
      },
      {
        title: (
          <div className="table-head-tital">
            <img src={PhoneIcon} alt="icon" />
            <span>Phone</span>
          </div>
        ),
        dataIndex: 'phone',
        key: 'phone',
        sorter: (a: Vendor, b: Vendor) => a.phone.localeCompare(b.phone),
        render: (text: string) => (
          <div className="flex items-center">
            <span style={{ fontSize: '14px', color: '#6b7280' }}>{text}</span>
          </div>
        ),
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (_: any, record: Vendor) => (
          <Space size="small">
            <Tooltip title="Edit">
              <Button
                type="text"
                onClick={() => openEditModal(record)}
                className="table-action-button"
              >
                
                <img src={EditIcon} alt="Edit" />
              </Button>
            </Tooltip>
            <Tooltip title="View">
              <Button
                type="text"
                onClick={() => openViewModal(record)}
                className="table-action-button"
              > 
                <img src={ViewIcon} alt="Delete" />
              </Button>
            </Tooltip>
          </Space>
        ),
      },
    ];





    return (
      <div className="venue-management-page">
        {/* Module Navigation Tabs */}

        <div className="page-headding-line">
          <Button className="back-button">
            <LeftOutlined />
          </Button>
          <h6>Vendor Management</h6>
        </div>

        {/* Main Content Card */}
        <Card
          className="vanue-management-card mb-6"
          title={
            <div className="card-header-main">
              <div className="card-header">
                <h3 className="card-title"> Vendor Directory</h3>
                <p className="card-subtitle">
                  Manage approved vendors and their payment information
                </p>
              </div>
              <Button
                type="primary"
                onClick={() => setAddVendorModalOpen(true)}
                style={{
                  backgroundColor: '#000000',
                  borderColor: '#000000',
                  fontWeight: 500,
                  color: '#ffffff',
                  borderRadius: '6px',
                }}
              >
                Add New Vendor
              </Button>
            </div>
          }
        >
          {/* Search Bar */}
          <div className="filters-bar">
            <Input
              placeholder="Search vendors..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onPressEnter={() => loadVendors()}
              allowClear
              className="filter-input"
            />
          </div>

          {/* Vendors Table */}
          <div className="table-responsive">
            <Table
              columns={columns}
              dataSource={vendors}
              rowKey="id"
              loading={tableLoading}
              pagination={{
                ...pagination,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} vendors`,
                onChange: (page, pageSize) => loadVendors(page, pageSize),
              }}
              scroll={{ x: 1200 }}
              style={{
                fontSize: '14px',
              }}
            />
          </div>
        </Card>

        {/* Add Vendor Modal */}
        <Modal
          title="Add New Vendor"
          open={addVendorModalOpen}
          onCancel={() => {
            setAddVendorModalOpen(false);
            addForm.resetFields();
          }}
          footer={
            <div className="modal-custom-footer">
              <Button
                className="fill-grey-btn"
                onClick={() => {
                  setAddVendorModalOpen(false);
                  addForm.resetFields();
                }}
              >
                Cancel
              </Button>
              <Button
                className="fill-dark-btn"
                type="primary"
                htmlType="submit"
              >
                Add Vendor
              </Button>
            </div>
          }
          width={500}
          className="add-vendor-modal"
        >
          <Form form={addForm} layout="vertical" onFinish={handleAddVendor}>
            <Row gutter={16}>
              <Col span={24} md={12}>
                <Form.Item
                  className="input-field-main"
                  name="vendor_name"
                  label="Vendor Name"
                  rules={[
                    { required: true, message: 'Please enter vendor name' },
                    {
                      min: 2,
                      message: 'Vendor name must be at least 2 characters',
                    },
                  ]}
                >
                  <Input
                    className="input-field-inn"
                    placeholder="Enter vendor name"
                  />
                </Form.Item>
              </Col>
              <Col span={24} md={12}>
                <Form.Item
                  className="input-field-main"
                  name="contact_person"
                  label="Contact Person"
                  rules={[
                    { required: true, message: 'Please enter contact person' },
                  ]}
                >
                  <Input
                    className="input-field-inn"
                    placeholder="Enter contact person name"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24} md={12}>
                <Form.Item
                  className="input-field-main"
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: 'Please enter email' },
                    { type: 'email', message: 'Please enter a valid email' },
                  ]}
                >
                  <Input
                    className="input-field-inn"
                    placeholder="Enter email address"
                  />
                </Form.Item>
              </Col>
              <Col span={24} md={12}>
                <Form.Item
                  className="input-field-main"
                  name="phone"
                  label="Phone"
                  rules={[
                    { required: true, message: 'Please enter phone number' },
                  ]}
                >
                  <Input
                    className="input-field-inn"
                    placeholder="Enter phone number"
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* <Row gutter={16}>
                        <Col span={24} md={12}>
                            <Form.Item
                                name="category"
                                label="Category"
                                rules={[
                                    { required: true, message: 'Please select category' }
                                ]}
                            >
                                <Select placeholder="Select category">
                                    {categories.map(category => (
                                        <Select.Option key={category} value={category}>
                                            {category}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={24} md={12}>
                            <Form.Item
                                name="payment_terms"
                                label="Payment Terms"
                            >
                                <Select placeholder="Select payment terms" allowClear>
                                    <Select.Option value="Net 15">Net 15</Select.Option>
                                    <Select.Option value="Net 30">Net 30</Select.Option>
                                    <Select.Option value="Net 45">Net 45</Select.Option>
                                    <Select.Option value="Net 60">Net 60</Select.Option>
                                    <Select.Option value="Due on Receipt">Due on Receipt</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={24} md={12}>
                            <Form.Item
                                name="tax_id"
                                label="Tax ID"
                            >
                                <Input placeholder="Enter tax ID" />
                            </Form.Item>
                        </Col>
                        <Col span={24} md={12}>
                            <Form.Item
                                name="status"
                                label="Status"
                                initialValue="ACTIVE"
                            >
                                <Select>
                                    <Select.Option value="ACTIVE">Active</Select.Option>
                                    <Select.Option value="INACTIVE">Inactive</Select.Option>
                                    <Select.Option value="PENDING">Pending</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="address"
                        label="Address"
                    >
                        <Input.TextArea rows={3} placeholder="Enter address" />
                    </Form.Item> */}
          </Form>
        </Modal>

        {/* Edit Vendor Modal */}
        <Modal
          title="Edit Vendor"
          open={editVendorModalOpen}
          onCancel={() => {
            setEditVendorModalOpen(false);
            editForm.resetFields();
            setSelectedVendor(null);
          }}
          footer={
            <div className="modal-custom-footer">
              <Button
                className="fill-grey-btn"
                onClick={() => {
                  setEditVendorModalOpen(false);
                  editForm.resetFields();
                  setSelectedVendor(null);
                }}
              >
                Cancel
              </Button>
              <Button
                className="fill-dark-btn"
                type="primary"
                htmlType="submit"
              >
                Update Vendor
              </Button>
            </div>
          }
          width={700}
          className="add-vendor-modal"
        >
          <Form form={editForm} layout="vertical" onFinish={handleEditVendor}>
            <Row gutter={16}>
              <Col span={24} md={12}>
                <Form.Item
                  className="input-field-main"
                  name="vendor_name"
                  label="Vendor Name"
                  rules={[
                    { required: true, message: 'Please enter vendor name' },
                    {
                      min: 2,
                      message: 'Vendor name must be at least 2 characters',
                    },
                  ]}
                >
                  <Input
                    className="input-field-inn"
                    placeholder="Enter vendor name"
                  />
                </Form.Item>
              </Col>
              <Col span={24} md={12}>
                <Form.Item
                  className="input-field-main"
                  name="contact_person"
                  label="Contact Person"
                  rules={[
                    { required: true, message: 'Please enter contact person' },
                  ]}
                >
                  <Input
                    className="input-field-inn"
                    placeholder="Enter contact person name"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24} md={12}>
                <Form.Item
                  name="email"
                  className="input-field-main"
                  label="Email"
                  rules={[
                    { required: true, message: 'Please enter email' },
                    { type: 'email', message: 'Please enter a valid email' },
                  ]}
                >
                  <Input
                    className="input-field-inn"
                    placeholder="Enter email address"
                  />
                </Form.Item>
              </Col>
              <Col span={24} md={12}>
                <Form.Item
                  name="phone"
                  label="Phone"
                  className="input-field-main"
                  rules={[
                    { required: true, message: 'Please enter phone number' },
                  ]}
                >
                  <Input
                    className="input-field-inn"
                    placeholder="Enter phone number"
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* <Row gutter={16}>
                        <Col span={24} md={12}>
                            <Form.Item
                                name="category"
                                label="Category"
                                rules={[
                                    { required: true, message: 'Please select category' }
                                ]}
                            >
                                <Select placeholder="Select category">
                                    {categories.map(category => (
                                        <Select.Option key={category} value={category}>
                                            {category}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={24} md={12}>
                            <Form.Item
                                name="payment_terms"
                                label="Payment Terms"
                            >
                                <Select placeholder="Select payment terms" allowClear>
                                    <Select.Option value="Net 15">Net 15</Select.Option>
                                    <Select.Option value="Net 30">Net 30</Select.Option>
                                    <Select.Option value="Net 45">Net 45</Select.Option>
                                    <Select.Option value="Net 60">Net 60</Select.Option>
                                    <Select.Option value="Due on Receipt">Due on Receipt</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={24} md={12}>
                            <Form.Item
                                name="tax_id"
                                label="Tax ID"
                            >
                                <Input placeholder="Enter tax ID" />
                            </Form.Item>
                        </Col>
                        <Col span={24} md={12}>
                            <Form.Item
                                name="status"
                                label="Status"
                            >
                                <Select>
                                    <Select.Option value="ACTIVE">Active</Select.Option>
                                    <Select.Option value="INACTIVE">Inactive</Select.Option>
                                    <Select.Option value="PENDING">Pending</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="address"
                        label="Address"
                    >
                        <Input.TextArea rows={3} placeholder="Enter address" />
                    </Form.Item> */}
          </Form>
        </Modal>

        {/* View Vendor Modal */}
        <Modal
          className="add-vendor-modal"
          title={`Vendor Details - ${selectedVendor?.vendor_name}`}
          open={viewVendorModalOpen}
          onCancel={() => setViewVendorModalOpen(false)}
          footer={[
            <div className="modal-custom-footer">
              <Button
                className="fill-grey-btn"
                key="close"
                onClick={() => setViewVendorModalOpen(false)}
              >
                Close
              </Button>
              <Button
                className="fill-dark-btn"
                key="edit"
                type="primary"
                onClick={() => {
                  setViewVendorModalOpen(false);
                  openEditModal(selectedVendor!);
                }}
              >
                Edit Vendor
              </Button>
            </div>,
          ]}
          width={986}
        >
          {selectedVendor && (
            <div>
              <Row gutter={[16, 20]}>
                <Col span={24}>
                  <div className='view-vendor-detail-maincard'>
                    <h4>Basic Information</h4>
                    <div className='view-detail-maincard'>
                      <div className='view-vendor-detail-main'>
                        <h6 className='view-vendor-head'>Vendor Name:</h6>
                        <div className="view-vendor-detail">
                          {selectedVendor.vendor_name}
                        </div>
                      </div>
                      <div className='view-vendor-detail-main'>
                        <h6 className='view-vendor-head'>Contact Person:</h6>
                        <div className="view-vendor-detail">
                          {selectedVendor.contact_person}
                        </div>
                      </div>

                      <div  className='view-vendor-detail-main'>
                        <h6 className='view-vendor-head'>Status:</h6>
                        <div className="view-vendor-detail-status">
                          <Tag
                            color={
                              selectedVendor.is_approved ? 'success' : 'error'
                            }
                          >
                            {selectedVendor.is_approved
                              ? 'Approved'
                              : 'Pending'}
                          </Tag>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col span={24}>
                  <div className='view-vendor-detail-maincard'>
                    <h4>Contact Information</h4>
                    <div className='view-detail-maincard'>
                     <div  className='view-vendor-detail-main'>
                        <h6 className='view-vendor-head'>Email:</h6>
                        <div className="view-vendor-detail">
                          {selectedVendor.email}
                        </div>
                      </div>
                      <div  className='view-vendor-detail-main'>
                        <h6 className='view-vendor-head'>Phone:</h6>
                        <div className="view-vendor-detail">
                          {selectedVendor.phone}
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>

              <Divider />
            </div>
          )}
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          title="Delete Vendor"
          open={deleteConfirmOpen}
          onCancel={() => setDeleteConfirmOpen(false)}
          footer={[
            <Button key="cancel" onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>,
            <Button key="delete" danger onClick={handleDeleteVendor}>
              Delete
            </Button>,
          ]}
        >
          {vendorToDelete && (
            <div className="text-center">
              <DeleteOutlined
                style={{
                  fontSize: '48px',
                  color: '#ff4d4f',
                  marginBottom: '16px',
                }}
              />
              <h4>Delete Vendor</h4>
              <p>
                Are you sure you want to delete{' '}
                <strong>{vendorToDelete.vendor_name}</strong>? This action
                cannot be undone.
              </p>
            </div>
          )}
        </Modal>
      </div>
    );
} 