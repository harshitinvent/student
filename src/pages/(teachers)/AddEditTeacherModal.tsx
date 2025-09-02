import { useEffect } from 'react';
import { Modal, Form, Input, Select, Button, message, Row, Col } from 'antd';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const { Option } = Select;

interface TeacherData {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    courses: string[];
}

interface AddEditTeacherModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: TeacherData) => void;
    initialData?: any;
}

const AVAILABLE_COURSES = [
    'Computer Science Fundamentals',
    'Data Structures and Algorithms',
    'Web Development',
    'Database Management',
    'Software Engineering',
    'Machine Learning',
    'Artificial Intelligence',
    'Cybersecurity',
    'Network Administration',
    'Mobile App Development',
    'Cloud Computing',
    'DevOps',
    'UI/UX Design',
    'Project Management',
    'Business Analytics',
    'Digital Marketing',
    'Financial Management',
    'Human Resources',
    'Marketing Strategy',
    'Operations Management'
];

export default function AddEditTeacherModal({ open, onClose, onSubmit, initialData }: AddEditTeacherModalProps) {
    const [form] = Form.useForm();
    const isEditing = !!initialData;

    useEffect(() => {
        if (open) {
            if (initialData) {
                form.setFieldsValue({
                    first_name: initialData.first_name,
                    last_name: initialData.last_name,
                    email: initialData.email,
                    phone: initialData.phone,
                    courses: initialData.courses || [],
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
            <Button className="fill-grey-btn" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="primary"
              className="fill-dark-btn"
              onClick={handleSubmit}
            >
              {isEditing ? 'Update Teacher' : 'Add Teacher'}
            </Button>
          </div>
        }
        title={
          <div className="text-left">
            <h2 className="mb-2 text-xl font-semibold">
              {isEditing ? 'Edit Teacher' : 'Add New Teacher'}
            </h2>
            <p className="text-sm text-gray-600">
              {isEditing
                ? 'Update teacher information'
                : 'Enter teacher details'}
            </p>
          </div>
        }
        width={450}
        centered
      >
        <Form form={form} layout="vertical" className="mt-6">
          <Row gutter={16}>
            <Col span={24} md={12}>
              <Form.Item
               className="input-field-main"
                name="first_name"
                label="First Name"
                rules={[
                  { required: true, message: 'Please enter first name' },
                  {
                    min: 2,
                    message: 'First name must be at least 2 characters',
                  },
                ]}
              >
                <Input className="input-field-inn" placeholder="Enter first name" />
              </Form.Item>
            </Col>
            <Col span={24} md={12}>
              <Form.Item
                 className="input-field-main"
                name="last_name"
                label="Last Name"
                rules={[
                  { required: true, message: 'Please enter last name' },
                  {
                    min: 2,
                    message: 'Last name must be at least 2 characters',
                  },
                ]}
              >
                <Input className="input-field-inn" placeholder="Enter last name" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                 className="input-field-main"
                name="email"
                label="Email Address"
                rules={[
                  { required: true, message: 'Please enter email address' },
                  {
                    type: 'email',
                    message: 'Please enter a valid email address',
                  },
                ]}
              >
                <Input className="input-field-inn" placeholder="Enter email address" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                 className="input-field-main"
                name="phone"
                label="Phone Number"
                rules={[
                  { required: true, message: 'Please enter phone number' },
                  {
                    validator: (_, value) => {
                      if (!value || value.length < 8) {
                        return Promise.reject(
                          new Error('Please enter a valid phone number')
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <PhoneInput
                  country={'us'}
                  value={form.getFieldValue('phone')}
                  onChange={(phone) => form.setFieldsValue({ phone })}
                  inputStyle={{
                    width: '100%',
                    height: '40px',
                    fontSize: '14px',
                    borderRadius: '6px',
                    border: '1px solid #f8f7f7',
                    backgroundColor: '#f8f7f7',
                    paddingLeft: '50px',
                  }}
                  buttonStyle={{
                    border: '1px solid #f8f7f7',
                    borderRadius: '6px 0 0 6px',
                    backgroundColor: '#fafafa',
                  }}
                  containerStyle={{
                    width: '100%',
                  }}
                  placeholder="Enter phone number"
                  enableSearch={true}
                  searchPlaceholder="Search country..."
                  preferredCountries={['us', 'in', 'gb', 'ca', 'au']}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                 className="input-field-main"
                name="courses"
                label="Assigned Courses"
                rules={[
                  {
                    required: true,
                    message: 'Please select at least one course',
                  },
                  {
                    validator: (_, value) => {






                        
                      if (!value || value.length === 0) {
                        return Promise.reject(
                          new Error('Please select at least one course')
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Select
                className="input-field-inn-select"
                  mode="multiple"
                  placeholder="Select courses"
                  optionFilterProp="children"
                  showSearch
                  filterOption={(input, option) =>
                    (option?.children as unknown as string)
                      ?.toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  maxTagCount={3}
                  maxTagTextLength={20}
                >
                  {AVAILABLE_COURSES.map((course) => (
                    <Option key={course} value={course}>
                      {course}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
} 