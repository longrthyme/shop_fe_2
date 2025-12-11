
import React from 'react';
import { Modal, Button, Typography, Alert } from 'antd';

const { Text } = Typography;

const VoucherDeleteModal = ({ visible, onCancel, onDelete  }) => {

    return (
        <Modal
            visible={visible}
            title="Xác nhận xóa thể loại"
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Hủy
                </Button>,
                <Button key="delete" type="primary" danger onClick={onDelete} >
                    Kết thúc
                </Button>,
            ]}
        >
            <Alert
                message="Lưu ý quan trọng"
                description="Bạn có chắc chắn muốn kết thúc voucher không?"
                type="warning"
                showIcon
                style={{ marginBottom: '16px' }}
            />

            <strong>Bạn có chắc chắn muốn xóa  này không? Hành động này không thể hoàn tác.</strong>
        </Modal>
    );
};

export default VoucherDeleteModal;
