import { Modal } from 'antd';
import React from 'react';

interface ConfirmActionModalProps {
    open: boolean;
    action: 'delete' | 'activate' | 'deactivate';
    departmentName?: string;
    onConfirm: () => void;
    onCancel: () => void;
    loading?: boolean;
}

const getTitle = (action: string) => {
    if (action === 'delete') return 'Delete ';
    if (action === 'activate') return 'Activate ';
    return 'Deactivate';
};

const getContent = (action: string, name?: string) => {
    if (action === 'delete') return `Are you sure you want to delete${name ? ` "${name}"` : ''} ?`;
    if (action === 'activate') return `Activate${name ? ` "${name}"` : ''} ?`;
    return `Deactivate${name ? ` "${name}"` : ''} ?`;
};

const ConfirmActionModal: React.FC<ConfirmActionModalProps> = ({
    open,
    action,
    departmentName,
    onConfirm,
    onCancel,
    loading,
}) => (

   <Modal
  className="confirm-action-modal"
  open={open}
  title={getTitle(action)}
  onOk={onConfirm}
  onCancel={onCancel}
  okText="Yes"
  okType={action === 'delete' ? 'danger' : 'primary'}
  cancelText="Cancel"
  confirmLoading={loading}
  destroyOnClose
  width={400}
  okButtonProps={{ className: 'fill-dark-btn' }}
  cancelButtonProps={{ className: 'fill-grey-btn' }}
>
  {getContent(action, departmentName)}
</Modal>

);

export default ConfirmActionModal; 