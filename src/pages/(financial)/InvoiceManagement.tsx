import { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Select, DatePicker, InputNumber, message, Table, Tag, Card, Space, Tooltip, Row, Col, Statistic } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined, CheckCircleOutlined, SearchOutlined, FilterOutlined, DollarOutlined, ClockCircleOutlined, ExclamationCircleOutlined, FileTextOutlined, DownloadOutlined, LeftOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type {
  Invoice,
  CreateInvoiceRequest,
  UpdateInvoiceRequest,
  InvoiceFilter,
  InvoiceStatus,
  InvoiceStats,
  InvoiceHistory
} from '../../types/invoice';
import type { Vendor } from '../../types/vendor';
import {
  getAllInvoices,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  updateInvoiceStatus,
  getInvoiceStats,
  getInvoiceHistory,
  handleInvoiceAPIError
} from '../../services/invoiceAPI';
import { getAllVendors } from '../../services/vendorAPI';
import ViewIcon from "../../assets/view-icon.svg";
import EditIcon from "../../assets/edit.svg";
import UploadImage from "../../assets/upload-icon.svg";
import Upload from '../../components/shared/form-elements/Upload';

// Department API helpers
const DEPARTMENT_API_BASE = 'http://103.189.173.7:8080/api/departments';
const { TextArea } = Input;

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function fetchDepartments(): Promise<any[]> {
  try {
    const res = await fetch(`${DEPARTMENT_API_BASE}?page=1&pageSize=100`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch departments');
    const data = await res.json();
    return data.departments || [];
  } catch (error) {
    console.error('Failed to fetch departments:', error);
    return [];
  }
}

export default function InvoiceManagementPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [stats, setStats] = useState<InvoiceStats | null>(null);
  const [tableLoading, setTableLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [vendorFilter, setVendorFilter] = useState('ALL');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');

  // Modal states
  const [addInvoiceModalOpen, setAddInvoiceModalOpen] = useState(false);
  const [editInvoiceModalOpen, setEditInvoiceModalOpen] = useState(false);
  const [viewInvoiceModalOpen, setViewInvoiceModalOpen] = useState(false);
  const [approveInvoiceModalOpen, setApproveInvoiceModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | null>(null);

  // History states
  const [invoiceHistory, setInvoiceHistory] = useState<InvoiceHistory[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Form instances
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  useEffect(() => {
    loadInvoices();
    loadVendors();
    loadDepartments();
    loadStats();
  }, []);

  const loadInvoices = async () => {
    try {
      setTableLoading(true);
      const filters: InvoiceFilter = {};
      if (searchTerm) filters.search = searchTerm;
      if (statusFilter !== 'ALL') filters.status = statusFilter as InvoiceStatus;
      if (vendorFilter !== 'ALL') filters.vendor_id = vendorFilter;
      if (departmentFilter !== 'ALL') filters.department = departmentFilter;

      const data = await getAllInvoices(filters);
      setInvoices(data);
    } catch (error) {
      console.error('Failed to load invoices:', error);
      setInvoices([]);
      message.error(handleInvoiceAPIError(error));
    } finally {
      setTableLoading(false);
    }
  };

  const loadVendors = async () => {
    try {
      const data = await getAllVendors();
      setVendors(data);
    } catch (error) {
      console.error('Failed to load vendors:', error);
      setVendors([]);
    }
  };

  const loadDepartments = async () => {
    try {
      const data = await fetchDepartments();
      setDepartments(data);
    } catch (error) {
      console.error('Failed to load departments:', error);
      setDepartments([]);
    }
  };

  const loadStats = async () => {
    try {
      const data = await getInvoiceStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
      setStats(null);
    }
  };

  const handleAddInvoice = async (values: any) => {
    try {
      const invoiceData = {
        ...values,
        invoice_date: values.invoice_date ? values.invoice_date.format('YYYY-MM-DD') : null,
        due_date: values.due_date ? values.due_date.format('YYYY-MM-DD') : null,
      };
      await createInvoice(invoiceData);
      setAddInvoiceModalOpen(false);
      addForm.resetFields();
      await loadInvoices();
      await loadStats();
      message.success('Invoice created successfully!');
    } catch (error) {
      console.error('Failed to create invoice:', error);
      message.error(handleInvoiceAPIError(error));
    }
  };

  const handleEditInvoice = async (values: any) => {
    if (!selectedInvoice) return;

    try {
      const invoiceData = {
        ...values,
        invoice_date: values.invoice_date.format('YYYY-MM-DD'),
        due_date: values.due_date.format('YYYY-MM-DD'),
      };
      await updateInvoice(selectedInvoice.id, invoiceData);
      setEditInvoiceModalOpen(false);
      editForm.resetFields();
      setSelectedInvoice(null);
      await loadInvoices();
      message.success('Invoice updated successfully!');
    } catch (error) {
      console.error('Failed to update invoice:', error);
      message.error(handleInvoiceAPIError(error));
    }
  };

  const handleDeleteInvoice = async () => {
    if (!invoiceToDelete) return;

    try {
      await deleteInvoice(invoiceToDelete.id);
      setDeleteConfirmOpen(false);
      setInvoiceToDelete(null);
      await loadInvoices();
      await loadStats();
      message.success('Invoice deleted successfully!');
    } catch (error) {
      console.error('Failed to delete invoice:', error);
      message.error(handleInvoiceAPIError(error));
    }
  };

  const handleApproveInvoice = async () => {
    if (!selectedInvoice) return;

    try {
      await updateInvoiceStatus(selectedInvoice.ID, 'APPROVED_FOR_PAYMENT');
      setApproveInvoiceModalOpen(false);
      setSelectedInvoice(null);
      await loadInvoices();
      await loadStats();
      // Refresh history if view modal is open
      if (viewInvoiceModalOpen && selectedInvoice) {
        await loadInvoiceHistory(selectedInvoice.ID);
      }
      message.success('Invoice approved successfully!');
    } catch (error) {
      console.error('Failed to approve invoice:', error);
      message.error(handleInvoiceAPIError(error));
    }
  };

  const handleRejectInvoice = async () => {
    if (!selectedInvoice) return;
    try {
      await updateInvoiceStatus(selectedInvoice.ID, 'REJECTED');
      setApproveInvoiceModalOpen(false);
      setSelectedInvoice(null);
      await loadInvoices();
      await loadStats();
      // Refresh history if view modal is open
      if (viewInvoiceModalOpen && selectedInvoice) {
        await loadInvoiceHistory(selectedInvoice.ID);
      }
      message.success('Invoice rejected successfully!');
    } catch (error) {
      console.error('Failed to reject invoice:', error);
      message.error(handleInvoiceAPIError(error));
    }
  };

  const openEditModal = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    editForm.setFieldsValue({
      invoice_number: invoice.invoice_number,
      vendor_id: invoice.vendor_id,
      department_id: invoice.department_id,
      amount: invoice.amount,
      invoice_date: dayjs(invoice.invoice_date),
      due_date: dayjs(invoice.due_date),
      description: invoice.description,
    });
    setEditInvoiceModalOpen(true);
  };

  const openViewModal = async (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setViewInvoiceModalOpen(true);
    await loadInvoiceHistory(invoice.ID);
  };

  const loadInvoiceHistory = async (invoiceId: string) => {
    try {
      setHistoryLoading(true);
      const history = await getInvoiceHistory(invoiceId);
      // console.log(history);
      setInvoiceHistory(history);
    } catch (error) {
      console.error('Failed to load invoice history:', error);
      setInvoiceHistory([]);
      message.error(handleInvoiceAPIError(error));
    } finally {
      setHistoryLoading(false);
    }
  };

  const openApproveModal = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setApproveInvoiceModalOpen(true);
  };

  const openDeleteConfirm = (invoice: Invoice) => {
    setInvoiceToDelete(invoice);
    setDeleteConfirmOpen(true);
  };

  const getStatusColor = (status: InvoiceStatus) => {
    switch (status) {
      case 'DRAFT': return 'default';
      case 'PENDING_APPROVAL': return 'processing';
      case 'APPROVED_FOR_PAYMENT': return 'success';
      case 'PAID': return 'success';
      case 'REJECTED': return 'error';
      case 'OVERDUE': return 'error';
      default: return 'default';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    try {
      return dayjs(dateString).format('MM/DD/YYYY');
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch =
      invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice?.vendor?.vendor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice?.department?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || invoice.status === statusFilter;
    const matchesVendor = vendorFilter === 'ALL' || invoice.vendor_id === vendorFilter;
    const matchesDepartment = departmentFilter === 'ALL' || invoice.department_id === departmentFilter;

    return matchesSearch && matchesStatus && matchesVendor && matchesDepartment;
  });

  const columns = [
    {
      title: 'Invoice Number',
      dataIndex: 'invoice_number',
      key: 'invoice_number',
      render: (text: string, record: Invoice) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-gray-500 text-sm">{formatDate(record.invoice_date)}</div>
        </div>
      ),
    },
    {
      title: 'Vendor',
      dataIndex: 'vendor',
      key: 'vendor',
      render: (vendor: any) => (
        <span className="">
          {vendor ? vendor.vendor_name : ''}
        </span>
      ),
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      render: (department: any) => (
        <span className="">
          {department ? department.name : ''}
        </span>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => (
        <span className="">
          {formatCurrency(amount)}
        </span>
      ),
    },
    {
      title: 'Due Date',
      dataIndex: 'due_date',
      key: 'due_date',
      render: (date: string) => (
        <span className={dayjs(date).isBefore(dayjs()) ? 'text-red-600' : ''}>
          {formatDate(date)}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: InvoiceStatus) => (
        <Tag color={getStatusColor(status)}>
          {status.replace('_', ' ')}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Invoice) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              className='table-action-button'
              type="text"
              onClick={() => openViewModal(record)}
            >  <img src={ViewIcon} alt="view" /></Button>
          </Tooltip>
          <Tooltip title="Edit Invoice">
            <Button
              className='table-action-button'
              type="text"
              onClick={() => openEditModal(record)}
            >  <img src={EditIcon} alt="Edit" /></Button>
          </Tooltip>
          {/* {record.status === 'PENDING_APPROVAL' && (
                        <Tooltip title="Approve Invoice">
                            <Button
                                type="text"
                                icon={<CheckCircleOutlined />}
                                onClick={() => openApproveModal(record)}
                            />
                        </Tooltip>
                    )} */}
          {/* <Tooltip title="Delete Invoice">
                        <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => openDeleteConfirm(record)}
                        />
                    </Tooltip> */}
        </Space>
      ),
    },
  ];



  return (
    <div className="venue-management-page">


      {/* Filters */}
      <Card
        className="vanue-management-card mb-6"
        title={
          <div className="card-header-main">
            <div className="card-header">
              <h3 className="card-title">Invoice Management</h3>
              {/* <p className="card-subtitle">
                  Manage approved vendors and their payment information
                </p> */}
            </div>
            <Button
              type="primary"
              onClick={() => setAddInvoiceModalOpen(true)}
              style={{
                backgroundColor: '#000000',
                borderColor: '#000000',
                fontWeight: 500,
                color: '#ffffff',
                borderRadius: '6px',
              }}
            >
              Log New Invoice
            </Button>
          </div>
        }
      >
        <div className="filters-bar">
          <Input
            placeholder="Search invoices..."
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onPressEnter={loadInvoices}
            className="filter-input"
          />

          <Select
            placeholder="Vendor"
            size="large"
            value={vendorFilter}
            onChange={setVendorFilter}
            className="filter-select"
          >
            <Select.Option value="ALL">All Vendors</Select.Option>
            {vendors.map((vendor) => (
              <Select.Option key={vendor.id} value={vendor.id}>
                {vendor.vendor_name}
              </Select.Option>
            ))}
          </Select>
          <Select
            placeholder="Department"
            size="large"
            value={departmentFilter}
            onChange={setDepartmentFilter}
            className="filter-select"
          >
            <Select.Option value="ALL">All Departments</Select.Option>
            {departments.map((department) => (
              <Select.Option key={department.ID} value={department.ID}>
                {department.name}
              </Select.Option>
            ))}
          </Select>
          {/* <Button icon={<FilterOutlined />} onClick={loadInvoices}>
                                Apply Filters
                            </Button> */}
          <Button
            className="filter-button"
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('ALL');
              setVendorFilter('ALL');
              setDepartmentFilter('ALL');
              loadInvoices();
            }}
          >
            Clear
          </Button>
        </div>
        <div className="teble-responsive">
          <Table
            className="vanue-table"
            columns={columns}
            dataSource={filteredInvoices}
            rowKey={(record) => record.id || record.invoice_number}
            loading={tableLoading}
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} items`,
            }}
          />
        </div>
      </Card>

      {/* Add Invoice Modal */}
      <Modal
        className="add-vendor-modal"
        title="Log New Invoice"
        open={addInvoiceModalOpen}
        onCancel={() => {
          setAddInvoiceModalOpen(false);
          addForm.resetFields();
        }}
        footer={
          <div className="modal-custom-footer">
            <Button
              className="fill-grey-btn"
              onClick={() => {
                setAddInvoiceModalOpen(false);
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
              Log Invoice
            </Button>
          </div>
        }
        width={500}
      >
        <Form form={addForm} layout="vertical" onFinish={handleAddInvoice}>
          <Row gutter={16}>
            <Col span={24} md={12}>
              <Form.Item
                className="input-field-main"
                name="invoice_number"
                label="Invoice Number"
                rules={[
                  { required: true, message: 'Please enter invoice number' },
                ]}
              >
                <Input
                  className="input-field-inn"
                  placeholder="Enter invoice number"
                />
              </Form.Item>
            </Col>
            <Col span={24} md={12}>
              <Form.Item
                className="input-field-main"
                name="vendor_id"
                label="Vendor"
                rules={[{ required: true, message: 'Please select vendor' }]}
              >
                <Select
                  className="input-field-inn-select"
                  placeholder="Select vendor"
                >
                  {vendors.map((vendor) => (
                    <Select.Option key={vendor.id} value={vendor.id}>
                      {vendor.vendor_name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24} md={12}>
              <Form.Item
                className="input-field-main"
                name="department_id"
                label="Department"
                rules={[
                  { required: true, message: 'Please select department' },
                ]}
              >
                <Select
                  className="input-field-inn-select"
                  placeholder="Select department"
                >
                  {departments.map((department) => (
                    <Select.Option key={department.ID} value={department.ID}>
                      {department.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={24} md={12}>
              <Form.Item
                className="input-field-main"
                name="amount"
                label="Amount"
                rules={[{ required: true, message: 'Please enter amount' }]}
              >
                <InputNumber
                  className="input-field-inn-number"
                  placeholder="Enter amount"
                  min={0}
                  step={0.01}
                  style={{ width: '100%' }}
                  formatter={(value) =>
                    `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                  parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24} md={12}>
              <Form.Item
                className="input-field-main"
                name="invoice_date"
                label="Invoice Date"
                rules={[
                  { required: true, message: 'Please select invoice date' },
                ]}
              >
                <DatePicker
                  className="input-field-inn-datepicker"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={24} md={12}>
              <Form.Item
                className="input-field-main"
                name="due_date"
                label="Due Date"
                rules={[
                  { required: true, message: 'Please select due date' },
                ]}
              >
                <DatePicker
                  className="input-field-inn-datepicker"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Description"
            className="input-field-main input-field-main-textarea"
            rules={[
              {
                required: true,
                message: 'Brief description of service/goods',
              },
            ]}
          >
            <TextArea
              className="input-field-inn-textarea"
              rows={3}
              placeholder="Brief description of service/goods"
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Invoice Modal */}
      <Modal
        className="add-vendor-modal"
        title="Edit Invoice"
        open={editInvoiceModalOpen}
        onCancel={() => {
          setEditInvoiceModalOpen(false);
          editForm.resetFields();
          setSelectedInvoice(null);
        }}
        footer={<div className="modal-custom-footer">
          <Button
            className="fill-grey-btn"
            onClick={() => {
              setEditInvoiceModalOpen(false);
              editForm.resetFields();
              setSelectedInvoice(null);
            }}
          >
            Cancel
          </Button>
          <Button className="fill-dark-btn" type="primary" htmlType="submit">
            Update Invoice
          </Button>

        </div>}
        width={600}
      >
        <Form form={editForm} layout="vertical" onFinish={handleEditInvoice}>
          <Row gutter={16}>
            <Col span={24} md={12}>
              <Form.Item
                className="input-field-main"
                name="invoice_number"
                label="Invoice Number"
                rules={[
                  { required: true, message: 'Please enter invoice number' },
                ]}
              >
                <Input className="input-field-inn" placeholder="Enter invoice number" />
              </Form.Item>
            </Col>
            <Col span={24} md={12}>
              <Form.Item
                className="input-field-main"
                name="vendor_id"
                label="Vendor"
                rules={[{ required: true, message: 'Please select vendor' }]}
              >
                <Select className="input-field-inn-select" placeholder="Select vendor">
                  {vendors.map((vendor) => (
                    <Select.Option key={vendor.id} value={vendor.id}>
                      {vendor.vendor_name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24} md={12}>
              <Form.Item
                className="input-field-main"
                name="department_id"
                label="Department"
                rules={[
                  { required: true, message: 'Please select department' },
                ]}
              >
                <Select className="input-field-inn-select" placeholder="Select department">
                  {departments.map((department) => (
                    <Select.Option key={department.ID} value={department.ID}>
                      {department.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={24} md={12}>
              <Form.Item
                className="input-field-main"
                name="amount"
                label="Amount"
                rules={[{ required: true, message: 'Please enter amount' }]}
              >
                <InputNumber
                  className="input-field-inn-number"
                  placeholder="Enter amount"
                  min={0}
                  step={0.01}
                  style={{ width: '100%' }}
                  formatter={(value) =>
                    `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                  parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24} md={12}>
              <Form.Item
                className="input-field-main"
                name="invoice_date"
                label="Invoice Date"
                rules={[
                  { required: true, message: 'Please select invoice date' },
                ]}
              >
                <DatePicker className="input-field-inn-datepicker" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={24} md={12}>
              <Form.Item
                className="input-field-main"
                name="due_date"
                label="Due Date"
                rules={[
                  { required: true, message: 'Please select due date' },
                ]}
              >
                <DatePicker className="input-field-inn-datepicker" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            className="input-field-main input-field-main-textarea"
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <Input.TextArea className="input-field-inn-textarea" rows={3} placeholder="Enter description" />
          </Form.Item>


        </Form>
      </Modal>

      {/* View Invoice Modal */}
      <Modal
        className="add-vendor-modal"
        title={
          <div className="text-left">
            <div className="">
              Invoice Details - {selectedInvoice?.invoice_number}
            </div>
          </div>
        }
        open={viewInvoiceModalOpen}
        onCancel={() => setViewInvoiceModalOpen(false)}
        footer={[
          <div className="modal-custom-footer">
            <Button
              className="fill-grey-btn"
              key="close"
              onClick={() => setViewInvoiceModalOpen(false)}
            >
              Close
            </Button>
            <Button
              className="fill-dark-btn"
              key="edit"
              type="primary"
              onClick={() => {
                setViewInvoiceModalOpen(false);
                openEditModal(selectedInvoice!);
              }}
            >
              Edit Invoice
            </Button>
          </div>,
        ]}
        width={986}
        style={{ top: 20 }}
      >
        {selectedInvoice && (
          <div className="text-left">
            {/* Header with vendor and amount */}
            <div className="mb-6">
              <div className="text-sm text-gray-600">
                {selectedInvoice?.vendor?.vendor_name} •{' '}
                {formatCurrency(selectedInvoice.amount)}
              </div>
            </div>

            {/* Main content - Two columns */}
            <Row gutter={[24, 24]} className="mb-6">
              {/* Left Column */}
              <Col span={24}>
                {/* Vendor Information */}
                <div className="view-vendor-detail-maincard mb-6">
                  <h4>Vendor Information</h4>
                  <div className="view-vendor-detail-main">
                    <h6 className="view-vendor-head">
                      {selectedInvoice.vendor?.vendor_name}
                    </h6>
                    <div className="view-vendor-detail">
                      Invoice #{selectedInvoice.invoice_number}
                    </div>
                  </div>
                </div>

                {/* Invoice Details */}
                <div className="view-vendor-detail-maincard pt-6">
                  <h4>Invoice Details</h4>
                  <div className="view-vendor-detail-multipale">
                    <div className="date-multipale-box">
                      <div className="view-vendor-detail-main">
                        <h6 className="view-vendor-head">Date:</h6>
                        <div className="view-vendor-detail">
                          {formatDate(selectedInvoice.invoice_date)}
                        </div>
                      </div>
                      <div className="view-vendor-detail-main">
                        <h6 className="view-vendor-head">Due Date:</h6>
                        <div className="view-vendor-detail">
                          {formatDate(selectedInvoice.due_date)}
                        </div>
                      </div>
                    </div>
                    <div className="view-vendor-detail-main">
                      <h6 className="view-vendor-head">Department:</h6>
                      <div className="view-vendor-detail">
                        {selectedInvoice?.department?.name}
                      </div>
                    </div>
                    <div className="view-vendor-detail-main">
                      <h6 className="view-vendor-head">Total Amount:</h6>
                      <div className="view-vendor-detail">
                        {formatCurrency(selectedInvoice.amount)}
                      </div>
                    </div>
                  </div>
                </div>
              </Col>

              {/* Right Column */}
              <Col span={24}>
                {/* Current Status */}
                <div className="view-vendor-detail-main approved-status-box">
                  <h6 className="view-vendor-head">Current Status</h6>
                  <div className="view-vendor-detail approved-status">
                    <CheckCircleOutlined className="mr-2 text-green-600" />
                    <Tag
                      color={getStatusColor(selectedInvoice.status)}  >
                      {selectedInvoice.status.replace('_', ' ')}
                    </Tag>
                  </div>
                </div>
              </Col>
              <Col span={24}>
                {/* Description */}
                <div className="view-vendor-detail-main description-boxouter">
                  <p>Description</p>
                  <div className="view-vendor-detail">
                    {selectedInvoice.description}
                  </div>
                </div>
              </Col>
            </Row>

            {/* Invoice Document Section */}
            <div className="dawnload-box-main view-vendor-detail-maincard">
              <h4 className="view-vendor-headdawnload">Invoice Document</h4>
              <div className="custom-dawnload-box">
                <img src={UploadImage} alt="Upload" className="mb-4" />
                <div className="dawnload-box-text">
                  Invoice document would be displayed here
                </div>
                <Button className="grey-fill-btn" type="default">
                  Download Document
                </Button>
              </div>
            </div>

            {/* Invoice History Section */}
            <div className="view-vendor-detail-maincard pt-6">
              <h4>
                Invoice History
              </h4>

              {/* History List */}
              {historyLoading ? (
                <div className="py-8 text-center">
                  <div className="text-gray-500">Loading history...</div>
                </div>
              ) : invoiceHistory.length > 0 ? (
                <div className="space-y-3">
                  {invoiceHistory.map((history, index) => (
                    <div
                      key={history.id}
                      className={`rounded-lg border p-4 ${history.action === 'APPROVED'
                          ? 'border-green-200 bg-green-50'
                          : history.action === 'REJECTED'
                            ? 'border-red-200 bg-red-50'
                            : 'border-gray-200 bg-gray-50'
                        }`}
                    >
                      <div className="flex items-center gap-3 justify-between">
                        <div className="flex-1">
                          <div className="mb-2 flex items-center gap-2">
                            <span className="font-medium text-gray-900">
                              {history.message}
                            </span>
                          </div>
                          <div className="mb-1 text-sm text-gray-600">
                            <div className="text-xs text-gray-500">
                              {formatDate(history.action_date)}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-5">
                          {/* Approve/Reject buttons for pending invoices */}
                          {selectedInvoice.status === 'PENDING' && (
                            <div className="flex gap-5">
                              <Button
                                type="primary"
                                icon={<CheckCircleOutlined />}
                                onClick={() => {
                                  setViewInvoiceModalOpen(false);
                                  openApproveModal(selectedInvoice);
                                }}
                                style={{
                                  backgroundColor: '#52c41a',
                                  borderColor: '#52c41a',
                                  fontSize: '13px',
                                  height: '24px',
                                  padding: '0 8px',
                                }}
                              >
                                Approve
                              </Button>
                              <Button
                                danger
                                icon={<ExclamationCircleOutlined />}
                                onClick={() => {
                                  setViewInvoiceModalOpen(false);
                                  openApproveModal(selectedInvoice);
                                }}
                                style={{
                                  fontSize: '13px',
                                  height: '24px',
                                  padding: '0 8px',
                                }}
                              >
                                Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border bg-gray-50 py-8 text-center">
                  <ClockCircleOutlined
                    style={{
                      fontSize: '32px',
                      color: '#9ca3af',
                      marginBottom: '8px',
                    }}
                  />
                  <div className="text-gray-500">No history available</div>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Approve/Reject Invoice Modal */}
      <Modal
        className="add-vendor-modal"
        title="Invoice Action"
        open={approveInvoiceModalOpen}
        onCancel={() => setApproveInvoiceModalOpen(false)}
        footer={[
          <div className="modal-custom-footer" >
            <Button
              key="cancel"
              className='fill-grey-btn'
              onClick={() => setApproveInvoiceModalOpen(false)}
            >
              Cancel
            </Button>
            <Button className='fill-red-btn' key="reject" danger onClick={handleRejectInvoice}>
              Reject
            </Button>
            <Button className='fill-green-btn' key="approve" type="primary" onClick={handleApproveInvoice}>
              Approve
            </Button>
          </div>
        ]}
      >
        {selectedInvoice && (
          <div className="text-center">
            <CheckCircleOutlined
              style={{
                fontSize: '48px',
                color: '#52c41a',
                marginBottom: '16px',
              }}
            />
            <h4>Invoice Action</h4>
            <div className="mt-4">
              <p>
                <strong>Vendor:</strong> {selectedInvoice.vendor?.vendor_name}
              </p>
              <p>
                <strong>Amount:</strong>{' '}
                {formatCurrency(selectedInvoice.amount)}
              </p>
              <p>
                <strong>Description:</strong> {selectedInvoice.description}
              </p>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              Choose to approve or reject this invoice
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Delete Invoice"
        open={deleteConfirmOpen}
        onCancel={() => setDeleteConfirmOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setDeleteConfirmOpen(false)}>
            Cancel
          </Button>,
          <Button key="delete" danger onClick={handleDeleteInvoice}>
            Delete
          </Button>,
        ]}
      >
        {invoiceToDelete && (
          <div className="text-center">
            <DeleteOutlined
              style={{
                fontSize: '48px',
                color: '#ff4d4f',
                marginBottom: '16px',
              }}
            />
            <h4>Delete Invoice</h4>
            <p>
              Are you sure you want to delete{' '}
              <strong>{invoiceToDelete.invoice_number}</strong>? This action
              cannot be undone.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
} 