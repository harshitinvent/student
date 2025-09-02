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
} from 'antd';
import type { Key } from 'antd/es/table/interface';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CalendarOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  Year,
  CreateYearRequest,
  UpdateYearRequest,
} from '../../types/scheduling';
import { academicYearAPI } from '../../services/schedulingAPI';
import PageTitleArea from '../../components/shared/PageTitleArea';
import DeleteIcon from '../../assets/trash-delete.svg';
import EditIcon from '../../assets/edit.svg';
const { Search } = Input;

export default function AcademicYearsPage() {
  const [years, setYears] = useState<Year[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingYear, setEditingYear] = useState<Year | null>(null);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  useEffect(() => {
    loadYears();
  }, []);

  const loadYears = async () => {
    setLoading(true);
    try {
      const data = await academicYearAPI.getAllYears();
      setYears(data || []); // Ensure we never set null
    } catch (error) {
      message.error('Failed to load years');
      console.error('Error loading years:', error);
      setYears([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingYear(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (year: Year) => {
    setEditingYear(year);
    form.setFieldsValue({
      name: year.name,
      year_number: year.year_number,
      is_active: year.is_active,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await academicYearAPI.deleteYear(id);
      message.success('Year deleted successfully');
      loadYears();
    } catch (error) {
      message.error('Failed to delete year');
      console.error('Error deleting year:', error);
    }
  };

  const handleModalSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (editingYear) {
        await academicYearAPI.updateYear(editingYear.id, values);
        message.success('Year updated successfully');
      } else {
        await academicYearAPI.createYear(values);
        message.success('Year created successfully');
      }

      setModalVisible(false);
      loadYears();
    } catch (error) {
      message.error('Failed to save year');
      console.error('Error saving year:', error);
    }
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    form.resetFields();
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'green' : 'red';
  };

  const getStatusText = (isActive: boolean) => {
    return isActive ? 'Active' : 'Inactive';
  };

  const getYearNumberColor = (number: number) => {
    switch (number) {
      case 1:
        return 'blue';
      case 2:
        return 'green';
      case 3:
        return 'orange';
      case 4:
        return 'purple';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      title: 'Year Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: Year) => (
        <Space>
          {/* <Tag color={getYearNumberColor(record.year_number)}>
                        {record.year_number}
                    </Tag> */}
          {name}
        </Space>
      ),
    },
    {
      title: 'Year Number',
      dataIndex: 'year_number',
      key: 'year_number',
      sorter: (a: Year, b: Year) => a.year_number - b.year_number,
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (isActive: boolean) => (
        <Tag color={getStatusColor(isActive)}>{getStatusText(isActive)}</Tag>
      ),
      filters: [
        { text: 'Active', value: true },
        { text: 'Inactive', value: false },
      ],
      onFilter: (value: boolean | Key, record: Year) =>
        record.is_active === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Year) => (
        <Space>
          <Button
            className="table-action-button"
            type="link"
            onClick={() => handleEdit(record)}
          >
            <img src={EditIcon} alt="Edit" />
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this year?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button className="table-action-button" type="link">
              <img src={DeleteIcon} alt="delete" />
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const filteredYears = (years || []).filter(
    (year) =>
      year.name.toLowerCase().includes(searchText.toLowerCase()) ||
      year.year_number.toString().includes(searchText)
  );

  const activeYears = (years || []).filter((year) => year.is_active).length;
  const inactiveYears = (years || []).filter((year) => !year.is_active).length;

  return (
    <div className="venue-management-page">
      {/* Search and Filter */}
      <Card
        className="vanue-management-card mb-6"
        title={
          <div className="card-header-main">
            <div className="card-header">
              <h3 className="card-title">Academic Years</h3>
              <p className="card-subtitle">
                Manage student year levels (1st Year, 2nd Year, 3rd Year, 4th
                Year)
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
              Add New Academic
            </Button>
          </div>
        }
      >
        <div className="filters-bar">
          <Input
            placeholder="Search years by name or number..."
            allowClear
            prefix={<SearchOutlined />}
            size="large"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="filter-input"
          />
        </div>
        <div className="table-responsive">
          <Table
            columns={columns}
            className="vanue-table"
            dataSource={filteredYears}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} years`,
            }}
          />
        </div>
      </Card>

      {/* Add/Edit Year Modal */}
      <Modal
        className="add-vendor-modal"
        open={modalVisible}
        onCancel={handleModalCancel}
        footer={
          <div className="modal-custom-footer">
            <Button className="fill-grey-btn" onClick={handleModalCancel}>
              Cancel
            </Button>
            <Button className="fill-dark-btn" type="primary" htmlType="submit">
              {editingYear ? 'Update' : 'Create'}
            </Button>
          </div>
        }
        title={
          <div className="text-left">
            <h2 className="mb-2 text-xl font-semibold">
              {editingYear ? 'Edit Year' : 'Add New Year'}
            </h2>
            <p className="text-sm text-gray-600">
              {editingYear ? 'Update year information' : 'Enter year details'}
            </p>
          </div>
        }
        width={500}
        centered
      >
        <Form form={form} layout="vertical" onFinish={handleModalSubmit}>
          <Form.Item
            className="input-field-main"
            name="name"
            label="Year Name"
            rules={[{ required: true, message: 'Please enter year name' }]}
          >
            <Input
              className="input-field-inn"
              placeholder="e.g., 1st Year, 2nd Year"
            />
          </Form.Item>

          <Form.Item
            className="input-field-main"
            name="year_number"
            label="Year Number"
            rules={[
              { required: true, message: 'Please enter year number' },
              // { type: 'number', min: 1, max: 4, message: 'Year number must be between 1 and 4' }
            ]}
          >
            <Input
              className="input-field-inn"
              type="number"
              min={1}
              max={4}
              placeholder="1, 2, 3, or 4"
            />
          </Form.Item>

          <Form.Item
            className="input-field-main"
            name="is_active"
            label="Status"
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select
              className="input-field-inn-select"
              placeholder="Select status"
            >
              <Select.Option value={true}>Active</Select.Option>
              <Select.Option value={false}>Inactive</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
