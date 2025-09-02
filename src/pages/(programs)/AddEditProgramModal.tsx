import { useEffect } from 'react';
import { Modal, Form, Input, Button, message, Select, Col, Row } from 'antd';

const { TextArea } = Input;

interface ProgramData {
    name: string;
    degree_type: 'B.S.' | 'B.A.' | 'M.S.' | 'M.A.' | 'Ph.D.' | 'Associate';
    department_id: string;
    total_credits_required: number;
    status: 'Active' | 'Planned' | 'Discontinued';
    description?: string;
}

interface Department {
    ID: string;
    name: string;
    description?: string;
}

interface AddEditProgramModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: ProgramData) => void;
    initialData?: any;
    departments: Department[];
}

export default function AddEditProgramModal({ open, onClose, onSubmit, initialData, departments }: AddEditProgramModalProps) {
    const [form] = Form.useForm();
    const isEditing = !!initialData;

    console.log('AddEditProgramModal - departments prop:', departments);
    console.log('AddEditProgramModal - departments length:', departments?.length);

    useEffect(() => {
        if (open) {
            if (initialData) {
                form.setFieldsValue({
                    name: initialData.name,
                    degree_type: initialData.degree_type,
                    department_id: initialData.department_id,
                    total_credits_required: initialData.total_credits_required,
                    status: initialData.status,
                    description: initialData.description,
                });
            } else {
                form.resetFields();
            }
        }
    }, [open, initialData, form]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            onSubmit(values);
        } catch (error) {
            message.error('Please fill all required fields correctly');
        }
    };

    const handleClose = () => {
        form.resetFields();
        onClose();
    };

    return (
      <Modal
        className="add-vendor-modal"
        open={open}
        onCancel={handleClose}
        footer={
          <div className="modal-custom-footer">
            <Button
              className="fill-grey-btn"
              size="large"
              block
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              className="fill-dark-btn"
              type="primary"
              size="large"
              block
              onClick={handleSubmit}
            >
              {isEditing ? 'Update Program' : 'Add Program'}
            </Button>
          </div>
        }
        title={
          <div className="text-left">
            <h2 className="mb-2 text-xl font-semibold">
              {isEditing ? 'Edit Program' : 'Add New Program'}
            </h2>
            <p className="text-sm text-gray-600">
              {isEditing
                ? 'Update program information'
                : 'Enter program details'}
            </p>
          </div>
        }
        width={600}
        centered
      >
        <Form form={form} layout="vertical" className="mt-6">
          <Row gutter={16}>
            <Col span={24} md={12}>
              <Form.Item
                className="input-field-main"
                name="name"
                label="Program Name"
                rules={[
                  { required: true, message: 'Please enter program name' },
                  {
                    min: 3,
                    message: 'Program name must be at least 3 characters',
                  },
                  {
                    max: 200,
                    message: 'Program name cannot exceed 200 characters',
                  },
                ]}
              >
                <Input
                  placeholder="e.g., Bachelor of Science in Biology" 
                  className="input-field-inn"
                />
              </Form.Item>
            </Col>
            <Col span={24} md={12}>
              <Form.Item
                className="input-field-main"
                name="degree_type"
                label="Degree Type"
                rules={[
                  { required: true, message: 'Please select degree type' },
                ]}
              >
                <Select
                className="input-field-inn-select"
                  placeholder="Select degree type" 
                >
                  <Select.Option value="Bachelor">Bachelor</Select.Option>
                  <Select.Option value="Master">Master</Select.Option>
                  <Select.Option value="PHD">PHD</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={24} md={12}>
              <Form.Item
                className="input-field-main"
                name="stream_id"
                label="Stream"
                rules={[{ required: true, message: 'Please select stream' }]}
              >
                <Select
                  placeholder="Select stream" 
                   className="input-field-inn-select"
                  loading={departments.length === 0}
                >
                  {departments.map((dept) => (
                    <Select.Option key={dept.ID} value={dept.ID}>
                      {dept.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={24} md={12}>
              <Form.Item
                className="input-field-main"
                name="total_credits_required"
                label="Total Credits Required"
                rules={[
                  {
                    required: true,
                    message: 'Please enter total credits required',
                  },
                  // { type: 'number', min: 60, max: 200, message: 'Credits must be between 60 and 200' }
                ]}
              >
                <Input
                className="input-field-inn"
                  type="number"
                  placeholder="e.g., 120, 180"  
                />
              </Form.Item>
            </Col>
            <Col span={24} md={12}>
              <Form.Item
                className="input-field-main"
                name="status"
                label="Program Status"
                rules={[
                  { required: true, message: 'Please select program status' },
                ]}
              >
                <Select
                  placeholder="Select program status"
                  className="input-field-inn-select"
                >
                  <Select.Option value="Active">Active</Select.Option>
                  <Select.Option value="Planned">Planned</Select.Option>
                  <Select.Option value="Discontinued">
                    Discontinued
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={24} >
              <Form.Item
                className="input-field-main input-field-main-textarea"
                name="description"
                label="Program Description"
                rules={[
                  {
                    required: true,
                    max: 1000,
                    message: 'Description cannot exceed 1000 characters',
                  },
                ]}
              >
                <TextArea
                   className="input-field-inn-textarea"
                  placeholder="Enter program description, objectives, and learning outcomes..."
                  rows={4}
                  showCount
                  maxLength={1000} 
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
} 