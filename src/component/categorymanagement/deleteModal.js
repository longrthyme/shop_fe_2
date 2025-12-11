// CategoryDeleteModal.js
import React from 'react';
import { Modal, Button, Typography, Alert } from 'antd';

const { Text } = Typography;

const CategoryDeleteModal = ({ visible, onCancel, onDelete }) => {

    return (
        <Modal
            visible={visible}
            title="Xác nhận xóa thể loại"
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Hủy
                </Button>,
                <Button key="delete" type="primary" danger onClick={onDelete}>
                    Xóa
                </Button>,
            ]}
        >
            <Alert
                message="Lưu ý quan trọng"
                description="Nếu thể loại chưa được gán cho bất kì sản phẩm nào sẽ thực hiện xoá. Nếu đã được gán, thể loại sẽ thực hiện thay đổi trạng thái."
                type="warning"
                showIcon
                style={{ marginBottom: '16px' }}
            />

            <strong>Bạn có chắc chắn muốn xóa thể loại này không? Hành động này không thể hoàn tác.</strong>
        </Modal>
    );
};

export default CategoryDeleteModal;
