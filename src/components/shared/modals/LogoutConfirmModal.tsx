import { Modal, Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';

interface LogoutConfirmModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading?: boolean;
}

export default function LogoutConfirmModal({
    open,
    onClose,
    onConfirm,
    loading = false
}: LogoutConfirmModalProps) {
    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            title={
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                        <LogoutOutlined className="text-2xl text-red-500" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">Confirm Logout</h2>
                    <p className="text-gray-600 text-sm">
                        Are you sure you want to logout?
                    </p>
                </div>
            }
            width={400}
            centered
        >
            <div className="flex gap-3 mt-6">
                <Button
                    size="large"
                    block
                    onClick={onClose}
                    disabled={loading}
                >
                    Cancel
                </Button>
                <Button
                    type="primary"
                    danger
                    size="large"
                    block
                    onClick={onConfirm}
                    loading={loading}
                    icon={<LogoutOutlined />}
                >
                    Logout
                </Button>
            </div>
        </Modal>
    );
} 