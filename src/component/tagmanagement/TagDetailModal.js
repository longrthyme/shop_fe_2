import React from 'react';
import { Modal, Row, Col, Typography } from 'antd';

const { Title, Text } = Typography;

const TagDetailModal = ({ visible, onCancel, item }) => {
    return (
        <Modal
            title={<Title level={3} style={{ color: '#1890ff' }}>Tag Detail</Title>}
            visible={visible}
            onCancel={onCancel}
            footer={null}
            centered
            width={600}
        >
            {item && (
                <div style={{ padding: '10px'}}>
                    <Row gutter={[16, 16]}>
                        <Col span={10}>
                            <Text strong>ID:</Text>
                            <span style={{ display: 'inline-block', marginLeft: '8px' }}>{item.id}</span>
                        </Col>
                        <Col span={14}>
                            <Text strong>Name:</Text>
                            <span style={{ display: 'inline-block', marginLeft: '8px' }}>{item.name}</span>
                        </Col>
                        <Col span={24}>
                            <Text strong>Tag Content:</Text>
                            <span style={{ display: 'inline-block', marginLeft: '8px' }}>{item.tagContent}</span>
                        </Col>
                        <Col span={10}>
                            <Text strong>Created At:</Text>
                            <span style={{ display: 'inline-block', marginLeft: '8px' }}>{new Date(item.createAt).toLocaleString()}</span>
                        </Col>
                        <Col span={14}>
                            <Text strong>Updated At:</Text>
                            <span style={{ display: 'inline-block', marginLeft: '8px' }}>{new Date(item.updateAt).toLocaleString()}</span>
                        </Col>
                    </Row>
                </div>
            )}
        </Modal>
    );
};

export default TagDetailModal;
