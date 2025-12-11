import React from 'react';
import { Modal, Row, Col, Typography } from 'antd';

const { Title, Text } = Typography;

const ColorDetailModal = ({ visible, onCancel, item }) => {
    return (
        <Modal
            title={<Title level={3} style={{ color: '#1890ff' }}>Chi tiết thông tin</Title>}
            visible={visible}
            onCancel={onCancel}
            footer={null}
            centered
            width={600}
        >
            {item && (
                <div style={{ padding: '10px' }}>
                    <Row gutter={[16, 16]}>
                        <Col span={14}>
                            <Text strong>Tên:</Text>
                            <span style={{ display: 'inline-block', marginLeft: '8px' }}>{item.name}</span>
                        </Col>
                        <Col span={10}>
                            <Text strong>Mã màu:</Text>
                            <span style={{ display: 'inline-block', marginLeft: '8px' }}>{item.code}</span>
                        </Col>
                        <Col span={14}>
                            <Text strong>Ngày tạo:</Text>
                            <span style={{ display: 'inline-block', marginLeft: '8px' }}>
                                {new Date(item.createAt).toLocaleString()}
                            </span>
                        </Col>
                        <Col span={10}>
                            <Text strong>Trạng thái:</Text>
                            <span style={{ display: 'inline-block', marginLeft: '8px' }}>
                                {Number(item.status) === 1 ? 'Đang hoạt động' : 'Ngưng hoạt động'}
                            </span>
                        </Col>
                        <Col span={14}>
                            <Text strong>Ngày cập nhật:</Text>
                            <span style={{ display: 'inline-block', marginLeft: '8px' }}>
                                {new Date(item.updateAt).toLocaleString()}
                            </span>
                        </Col>
                    </Row>
                </div>
            )}
        </Modal>
    );
};

export default ColorDetailModal;
