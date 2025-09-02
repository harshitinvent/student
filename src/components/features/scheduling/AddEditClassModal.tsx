import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, Select, InputNumber, message } from 'antd';
import {
    Class,
    CreateClassRequest,
    UpdateClassRequest,
    Semester
} from '../../../types/scheduling';

interface AddEditClassModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: CreateClassRequest | UpdateClassRequest) => void;
    initialData?: Class | null;
    semesters: Semester[];
    venues: any[];
}

export default function AddEditClassModal({
    open,
    onClose,
    onSubmit,
    initialData,
    semesters,
    venues
}: AddEditClassModalProps) {
    const [form] = Form.useForm();
    const [courses, setCourses] = useState<any[]>([]);
    const [instructors, setInstructors] = useState<any[]>([]);
    const isEditing = !!initialData;

    useEffect(() => {
        if (open) {
            if (initialData) {
                form.setFieldsValue({
                    course_id: initialData.course_id,
                    semester_id: initialData.semester_id,
                    section_code: initialData.section_code,
                    instructor_id: initialData.instructor_id,
                    max_capacity: initialData.max_capacity,
                    delivery_mode: initialData.delivery_mode,
                    status: initialData.status,
                });
            } else {
                form.resetFields();
            }
        }
    }, [open, initialData, form]);

    // Mock data for development - replace with API calls
    useEffect(() => {
        // Mock courses
        setCourses([
            { id: '1', course_code: 'BIO-101', title: 'Introduction to Biology', credit_hours: 3 },
            { id: '2', course_code: 'CHEM-101', title: 'General Chemistry', credit_hours: 4 },
            { id: '3', course_code: 'MATH-101', title: 'Calculus I', credit_hours: 4 },
            { id: '4', course_code: 'ENG-101', title: 'English Composition', credit_hours: 3 },
        ]);

        // Mock instructors
        setInstructors([
            { id: '1', first_name: 'Dr. John', last_name: 'Smith', email: 'john.smith@university.edu' },
            { id: '2', first_name: 'Dr. Sarah', last_name: 'Johnson', email: 'sarah.johnson@university.edu' },
            { id: '3', first_name: 'Prof. Michael', last_name: 'Brown', email: 'michael.brown@university.edu' },
            { id: '4', first_name: 'Dr. Emily', last_name: 'Davis', email: 'emily.davis@university.edu' },
        ]);
    }, []);

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
            open={open}
            onCancel={handleClose}
            footer={null}
            title={
                <div className="text-center">
                    <h2 className="text-xl font-semibold mb-2">
                        {isEditing ? 'Edit Class Section' : 'Add New Class Section'}
                    </h2>
                    <p className="text-gray-600 text-sm">
                        {isEditing ? 'Update class section information' : 'Enter class section details'}
                    </p>
                </div>
            }
            width={700}
            centered
        >
            <Form
                form={form}
                layout="vertical"
                className="mt-6"
                onFinish={handleSubmit}
            >
                <div className="grid grid-cols-2 gap-4">
                    <Form.Item
                        name="course_id"
                        label="Course"
                        rules={[
                            { required: true, message: 'Please select a course' }
                        ]}
                    >
                        <Select
                            placeholder="Select course"
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
                            }
                        >
                            {courses.map(course => (
                                <Select.Option key={course.id} value={course.id}>
                                    {course.course_code} - {course.title}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="semester_id"
                        label="Semester"
                        rules={[
                            { required: true, message: 'Please select a semester' }
                        ]}
                    >
                        <Select
                            placeholder="Select term"
                            showSearch
                            optionFilterProp="children"
                        >
                            {semesters.map(semester => (
                                <Select.Option key={semester.id} value={semester.id}>
                                    {semester.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Form.Item
                        name="section_code"
                        label="Section Code"
                        rules={[
                            { required: true, message: 'Please enter section code' },
                            { pattern: /^[A-Z0-9]+$/, message: 'Section code must contain only uppercase letters and numbers' },
                            { min: 1, max: 10, message: 'Section code must be between 1 and 10 characters' }
                        ]}
                    >
                        <Input
                            placeholder="e.g., 01, 02A, H1"
                            className="text-base"
                        />
                    </Form.Item>

                    <Form.Item
                        name="instructor_id"
                        label="Instructor"
                        rules={[
                            { required: true, message: 'Please select an instructor' }
                        ]}
                    >
                        <Select
                            placeholder="Select instructor"
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
                            }
                        >
                            {instructors.map(instructor => (
                                <Select.Option key={instructor.id} value={instructor.id}>
                                    {instructor.first_name} {instructor.last_name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Form.Item
                        name="max_capacity"
                        label="Maximum Capacity"
                        rules={[
                            { required: true, message: 'Please enter maximum capacity' },
                            { type: 'number', min: 1, max: 500, message: 'Capacity must be between 1 and 500' }
                        ]}
                    >
                        <InputNumber
                            placeholder="e.g., 30"
                            min={1}
                            max={500}
                            className="w-full"
                            style={{ height: '40px' }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="delivery_mode"
                        label="Delivery Mode"
                        rules={[
                            { required: true, message: 'Please select delivery mode' }
                        ]}
                    >
                        <Select
                            placeholder="Select delivery mode"
                            className="text-base"
                        >
                            <Select.Option value="IN_PERSON">In-Person</Select.Option>
                            <Select.Option value="ONLINE_SYNC">Online Synchronous</Select.Option>
                            <Select.Option value="ONLINE_ASYNC">Online Asynchronous</Select.Option>
                            <Select.Option value="HYBRID">Hybrid</Select.Option>
                        </Select>
                    </Form.Item>
                </div>

                <Form.Item
                    name="status"
                    label="Status"
                    rules={[
                        { required: true, message: 'Please select status' }
                    ]}
                >
                    <Select
                        placeholder="Select status"
                        className="text-base"
                    >
                        <Select.Option value="PLANNED">Planned</Select.Option>
                        <Select.Option value="ACTIVE">Active</Select.Option>
                        <Select.Option value="CANCELLED">Cancelled</Select.Option>
                        <Select.Option value="COMPLETED">Completed</Select.Option>
                    </Select>
                </Form.Item>

                <div className="flex gap-3 mt-6">
                    <Button
                        size="large"
                        block
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="primary"
                        size="large"
                        block
                        htmlType="submit"
                    >
                        {isEditing ? 'Update Class Section' : 'Create Class Section'}
                    </Button>
                </div>
            </Form>
        </Modal>
    );
} 