import React from 'react';
import { Modal, Row, Col, Typography } from 'antd';

const { Title, Text } = Typography;

const EmployeeDetailModal = ({ visible, onCancel, item }) => (
    <Modal
        title={<Title level={3} style={{ color: '#1890ff' }}>Chi tiết nhân viên</Title>}
        visible={visible}
        onCancel={onCancel}
        footer={null}
        centered
        width={600}
    >
        {item && (
            <div style={{ padding: '10px' }}>
                <Row gutter={[16, 16]}>
                    <Col span={24} style={{ textAlign: 'center' }}>
                        <img src={item.avatarUrl} alt="Avatar" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
                    </Col>
                    <Col span={10}>
                        <Text strong>ID:</Text> <span>{item.id}</span>
                    </Col>
                    <Col span={14}>
                        <Text strong>Tên:</Text> <span>{item.fullName}</span>
                    </Col>
                    <Col span={10}>
                        <Text strong>Username:</Text> <span>{item.username}</span>
                    </Col>
                    <Col span={14}>
                        <Text strong>Password:</Text>
                        <span>{' '.repeat(item.password?.length || 8).replace(/ /g, '*')}</span>
                    </Col>
                    <Col span={10}>
                        <Text strong>Email:</Text> <span>{item.email}</span>
                    </Col>
                    <Col span={14}>
                        <Text strong>Số điện thoại:</Text> <span>{item.phone}</span>
                    </Col>
                    <Col span={24}>
                        <Text strong>Địa chỉ:</Text> <span>{item.address}</span>
                    </Col>
                    <Col span={14}>
                        <Text strong>Trạng thái:</Text> <span>{item.isDeleted ? 'Không hoạt động' : 'Hoạt động'}</span>
                    </Col>
                </Row>
            </div>
        )}
    </Modal>
);

export default EmployeeDetailModal;
