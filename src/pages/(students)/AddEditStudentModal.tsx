import { useEffect } from 'react';
import { Modal, Form, Input, Select, Button, message, Col, Row } from 'antd';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const { Option } = Select;

interface StudentData {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    program: string;
    year_of_study: number;
}

interface AddEditStudentModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: StudentData) => void;
    initialData?: any;
}

const PROGRAMS = [
    'Computer Science',
    'Information Technology',
    'Software Engineering',
    'Data Science',
    'Cybersecurity',
    'Business Administration',
    'Economics',
    'Psychology',
    'Engineering',
    'Medicine',
    'Law',
    'Arts',
    'Education'
];

const YEARS_OF_STUDY = [1, 2, 3, 4, 5];

export default function AddEditStudentModal({ open, onClose, onSubmit, initialData }: AddEditStudentModalProps) {
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
                    program: initialData.program,
                    year_of_study: initialData.year_of_study,
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
              className="fill-dark-btn"
              type="primary"
              onClick={handleSubmit}
            >
              {isEditing ? 'Update Student' : 'Add Student'}
            </Button>
          </div>
        }
        title={
          <div className="text-left">
            <h2 className="mb-2 text-xl font-semibold">
              {isEditing ? 'Edit Student' : 'Add New Student'}
            </h2>
            <p className="text-sm text-gray-600">
              {isEditing
                ? 'Update student information'
                : 'Enter student details'}
            </p>
          </div>
        }
        width={500}
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
                    paddingLeft: '50px',
                    backgroundColor: '#f8f7f7',
                  }}
                  buttonStyle={{
                    border: '1px solid #f8f7f7',
                    borderRadius: '6px 0 0 6px',
                    backgroundColor: '#f8f7f7',
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
            <Col span={24} md={12}>
              <Form.Item
                  className="input-field-main"
                name="program"
                label="Program/Course"
                rules={[{ required: true, message: 'Please select a program' }]}
              >
                <Select className="input-field-inn-select" placeholder="Select program">
                  {PROGRAMS.map((program) => (
                    <Option key={program} value={program}>
                      {program}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={24} md={12}>
              <Form.Item
                  className="input-field-main"
                name="year_of_study"
                label="Year of Study"
                rules={[
                  { required: true, message: 'Please select year of study' },
                ]}
              >
                <Select className="input-field-inn-select" placeholder="Select year">
                  {YEARS_OF_STUDY.map((year) => (
                    <Option key={year} value={year}>
                      Year {year}
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