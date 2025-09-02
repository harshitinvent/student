import { useEffect } from 'react';
import { Modal, Form, Input, Button } from 'antd';

interface AddEditDepartmentModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: { name: string }) => void;
    initialData?: { name: string } | null;
    errorMessage?: string;
}

export default function AddEditDepartmentModal({ open, onClose, onSubmit, initialData, errorMessage }: AddEditDepartmentModalProps) {
    const [form] = Form.useForm();

    useEffect(() => {
        if (initialData) {
            form.setFieldsValue({ name: initialData.name });
        } else {
            form.resetFields();
        }
    }, [initialData, open, form]);

    return (
        <Modal
            open={open}
            onCancel={onClose}
            title={initialData ? 'Edit Department' : 'Add Department'}
            footer={null}
            destroyOnClose
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onSubmit}
                initialValues={initialData || { name: '' }}
            >
                {/* Error Message Display */}
                {errorMessage && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-4 w-4 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-2">
                                <p className="text-sm text-red-800">
                                    {errorMessage}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <Form.Item
                    label="Department Name"
                    name="name"
                    rules={[{ required: true, message: 'Please enter department name' }]}
                >
                    <Input placeholder="e.g. Design, Engineering" />
                </Form.Item>
                <div className="flex justify-end gap-2">
                    <Button onClick={onClose} style={{ marginRight: 8 }}>
                        Cancel
                    </Button>
                    <Button type="primary" htmlType="submit">
                        {initialData ? 'Update' : 'Add'}
                    </Button>
                </div>
            </Form>
        </Modal>
    );
} 