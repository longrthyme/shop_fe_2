import React from 'react';
import { Modal, Row, Col, Typography } from 'antd';

const { Title, Text } = Typography;

const UserDetailModal = ({ visible, onCancel, item }) => {
    const safe = (v, fallback = 'Chưa cập nhật') =>
        v === null || v === undefined || v === '' ? fallback : v;

    return (
        <Modal
            title={<Title level={3} style={{ color: '#1890ff' }}>Chi tiết thông tin</Title>}
            open={visible}
            onCancel={onCancel}
            footer={null}
            centered
            width={600}
        >
            {item && (
                <div style={{ padding: '10px' }}>
                    <Row gutter={[16, 16]}>
                        <Col span={24} style={{ textAlign: 'center' }}>
                            <img
                                src={safe(item.avatarUrl, 'https://via.placeholder.com/100')}
                                alt="Avatar"
                                style={{ width: '100px', height: '100px', borderRadius: '50%', marginBottom: '10px' }}
                            />
                        </Col>

                        <Col span={10}>
                            <Text strong>ID:</Text>
                            <span style={{ marginLeft: 8 }}>{safe(item.id)}</span>
                        </Col>

                        <Col span={14}>
                            <Text strong>Tên:</Text>
                            <span style={{ marginLeft: 8 }}>{safe(item.fullName)}</span>
                        </Col>

                        <Col span={10}>
                            <Text strong>Username:</Text>
                            <span style={{ marginLeft: 8 }}>{safe(item.username)}</span>
                        </Col>

                        <Col span={10}>
                            <Text strong>Password:</Text>
                            <span style={{ marginLeft: 8 }}>
                {item?.password ? item.password.replace(/./g, '*') : 'Chưa có mật khẩu'}
              </span>
                        </Col>

                        <Col span={10}>
                            <Text strong>Email:</Text>
                            <span style={{ marginLeft: 8 }}>{safe(item.email)}</span>
                        </Col>

                        <Col span={10}>
                            <Text strong>Số điện thoại:</Text>
                            <span style={{ marginLeft: 8 }}>{safe(item.phone)}</span>
                        </Col>

                        <Col span={10}>
                            <Text strong>Địa chỉ:</Text>
                            <span style={{ marginLeft: 8 }}>{safe(item.address)}</span>
                        </Col>

                        <Col span={14}>
                            <Text strong>Ngày tạo:</Text>
                            <span style={{ marginLeft: 8 }}>
                {item?.createAt ? new Date(item.createAt).toLocaleString() : 'N/A'}
              </span>
                        </Col>

                        <Col span={10}>
                            <Text strong>Trạng thái:</Text>
                            <span style={{ marginLeft: 8 }}>
                {item?.isDeleted ? 'Không hoạt động' : 'Hoạt động'}
              </span>
                        </Col>

                        <Col span={14}>
                            <Text strong>Ngày cập nhật:</Text>
                            <span style={{ marginLeft: 8 }}>
                {item?.updateAt ? new Date(item.updateAt).toLocaleString() : 'N/A'}
              </span>
                        </Col>
                    </Row>
                </div>
            )}
        </Modal>
    );
};

export default UserDetailModal;
