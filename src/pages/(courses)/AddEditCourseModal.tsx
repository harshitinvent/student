import { useEffect } from 'react';
import { Modal, Form, Input, Button, message, Select, Col, Row } from 'antd';

const { TextArea } = Input;

interface CourseData {
    course_code: string;
    title: string;
    description: string;
    credit_hours: number;
    status: 'Active' | 'Retired';
    programs?: string[]; // Array of program IDs
}

interface AddEditCourseModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: CourseData) => void;
    initialData?: any;
    programs?: Array<{
        ID: string;
        name: string;
        degree_type: string;
        department_name?: string;
    }>;
}

export default function AddEditCourseModal({ open, onClose, onSubmit, initialData, programs = [] }: AddEditCourseModalProps) {
    const [form] = Form.useForm();
    const isEditing = !!initialData;

    console.log(initialData);

    useEffect(() => {
        if (open) {
            if (initialData) {
                form.setFieldsValue({
                    course_code: initialData.course_code,
                    title: initialData.title,
                    description: initialData.description,
                    credit_hours: initialData.credit_hours,
                    status: initialData.status,
                    programs: initialData.programs.map(program => program.ID) || [],
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
            <Button className="fill-grey-btn" block onClick={handleClose}>
              Cancel
            </Button>
            <Button
              className="fill-dark-btn"
              size="large"
              block
              onClick={handleSubmit}
            >
              {isEditing ? 'Update Course' : 'Add Course'}
            </Button>
          </div>
        }
        title={
          <div className="text-left">
            <h2 className="mb-2 text-xl font-semibold">
              {isEditing ? 'Edit Course' : 'Add New Course'}
            </h2>
            <p className="text-sm text-gray-600">
              {isEditing ? 'Update course information' : 'Enter course details'}
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
                name="course_code"
                label="Course Code"
                rules={[
                  { required: true, message: 'Please enter course code' },
                  {
                    pattern: /^[A-Z]{2,4}-\d{3}$/,
                    message: 'Course code must be in format like BIO-101',
                  },
                ]}
              >
                <Input
                  className="input-field-inn"
                  placeholder="e.g., BIO-101, CS-201, MATH-301"
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col span={24} md={12}>
              <Form.Item
                className="input-field-main"
                name="title"
                label="Course Title"
                rules={[
                  { required: true, message: 'Please enter course title' },
                  {
                    min: 3,
                    message: 'Course title must be at least 3 characters',
                  },
                  {
                    max: 100,
                    message: 'Course title cannot exceed 100 characters',
                  },
                ]}
              >
                <Input
                  className="input-field-inn"
                  placeholder="e.g., Introduction to Cell Biology"
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                className="input-field-main input-field-main-textarea"
                name="description"
                label="Course Description"
                rules={[
                  {
                    required: true,
                    message: 'Please enter course description',
                  },
                  {
                    min: 10,
                    message:
                      'Course description must be at least 10 characters',
                  },
                  {
                    max: 1000,
                    message: 'Course description cannot exceed 1000 characters',
                  },
                ]}
              >
                <TextArea
                  className="input-field-inn-textarea"
                  placeholder="Enter detailed description of the course, including objectives, topics covered, prerequisites, and learning outcomes..."
                  rows={4}
                  showCount
                  maxLength={1000}
                />
              </Form.Item>
            </Col>
            <Col span={24} md={12}>
              <Form.Item
                className="input-field-main"
                name="credit_hours"
                label="Credit Hours"
                rules={[
                  { required: true, message: 'Please enter credit hours' },
                  // { type: 'number', message: 'Credit hours must be number' }
                ]}
              >
                <Input
                  className="input-field-inn"
                  type="number"
                  placeholder="e.g., 3, 4, 6"
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col span={24} md={12}>
              <Form.Item
                className="input-field-main"
                name="status"
                label="Course Status"
                rules={[
                  { required: true, message: 'Please select course status' },
                ]}
              >
                <Select
                  className="input-field-inn-select"
                  placeholder="Select course status"
                  size="large"
                >
                  <Select.Option value="Active">Active</Select.Option>
                  <Select.Option value="Retired">Retired</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                className="input-field-main"
                name="programs"
                label="Associated Programs"
                rules={[{ required: false, message: 'Please select programs' }]}
              >
                <Select
                  className="input-field-inn-select"
                  mode="multiple"
                  placeholder="Select programs to associate with this course"
                  size="large"
                  showSearch
                  optionFilterProp="children"
                  allowClear
                >
                  {programs?.programs?.map((program) => (
                    <Select.Option key={program.ID} value={program.ID}>
                      {program.name} ({program.degree_type})
                      {program.department_name &&
                        ` - ${program.department_name}`}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
} 