import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, Select, TimePicker, message } from 'antd';
import { CreateMeetingTimeRequest, Class } from '../../../types/scheduling';
import dayjs from 'dayjs';

interface AddMeetingTimeModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: CreateMeetingTimeRequest) => void;
    classData: Class | null;
    venues: any[];
}

export default function AddMeetingTimeModal({
    open,
    onClose,
    onSubmit,
    classData,
    venues
}: AddMeetingTimeModalProps) {
    const [form] = Form.useForm();

    useEffect(() => {
        if (open) {
            form.resetFields();
        }
    }, [open, form]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const { time_range, ...otherValues } = values;

            const meetingData: CreateMeetingTimeRequest = {
                ...otherValues,
                class_id: classData!.id,
                start_time: time_range[0].format('HH:mm'),
                end_time: time_range[1].format('HH:mm'),
            };

            onSubmit(meetingData);
        } catch (error) {
            message.error('Please fill all required fields correctly');
        }
    };

    const handleClose = () => {
        form.resetFields();
        onClose();
    };

    const dayOptions = [
        { value: 'MONDAY', label: 'Monday' },
        { value: 'TUESDAY', label: 'Tuesday' },
        { value: 'WEDNESDAY', label: 'Wednesday' },
        { value: 'THURSDAY', label: 'Thursday' },
        { value: 'FRIDAY', label: 'Friday' },
        { value: 'SATURDAY', label: 'Saturday' },
        { value: 'SUNDAY', label: 'Sunday' },
    ];

    if (!classData) return null;

    return (
        <Modal
            open={open}
            onCancel={handleClose}
            footer={null}
            title={
                <div className="text-center">
                    <h2 className="text-xl font-semibold mb-2">
                        Add Meeting Time
                    </h2>
                    <p className="text-gray-600 text-sm">
                        Schedule meeting times for {classData.course?.course_code} - Section {classData.section_code}
                    </p>
                </div>
            }
            width={600}
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
                        name="day_of_week"
                        label="Day of Week"
                        rules={[
                            { required: true, message: 'Please select a day' }
                        ]}
                    >
                        <Select
                            placeholder="Select day"
                            className="text-base"
                        >
                            {dayOptions.map(day => (
                                <Select.Option key={day.value} value={day.value}>
                                    {day.label}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="venue_id"
                        label="Venue/Room"
                        rules={[
                            { required: true, message: 'Please select a venue' }
                        ]}
                    >
                        <Select
                            placeholder="Select venue"
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
                            }
                        >
                            {venues.map(venue => (
                                <Select.Option key={venue.id} value={venue.id}>
                                    {venue.building} - {venue.room_number} ({venue.capacity} seats)
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </div>

                <Form.Item
                    name="time_range"
                    label="Time Range"
                    rules={[
                        { required: true, message: 'Please select time range' }
                    ]}
                >
                    <TimePicker.RangePicker
                        format="HH:mm"
                        minuteStep={15}
                        className="w-full"
                        style={{ height: '40px' }}
                        placeholder={['Start Time', 'End Time']}
                    />
                </Form.Item>

                {/* Class Information Display */}
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Class Information</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-gray-600">Course:</span>
                            <span className="ml-2 font-medium">{classData.course?.course_code} - {classData.course?.title}</span>
                        </div>
                        <div>
                            <span className="text-gray-600">Section:</span>
                            <span className="ml-2 font-medium">{classData.section_code}</span>
                        </div>
                        <div>
                            <span className="text-gray-600">Instructor:</span>
                            <span className="ml-2 font-medium">{classData.instructor?.first_name} {classData.instructor?.last_name}</span>
                        </div>
                        <div>
                            <span className="text-gray-600">Delivery Mode:</span>
                            <span className="ml-2 font-medium">{classData.delivery_mode}</span>
                        </div>
                    </div>
                </div>

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
                        Add Meeting Time
                    </Button>
                </div>
            </Form>
        </Modal>
    );
} 