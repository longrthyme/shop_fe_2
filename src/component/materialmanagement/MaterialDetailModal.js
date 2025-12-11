import React from 'react';
import { Modal, Row, Col, Typography } from 'antd';

const { Title, Text } = Typography;

const MaterialDetailModal = ({ visible, onCancel, item }) => {
    return (
        <Modal
            title={<Title level={3} style={{ color: '#1890ff' }}>Xem chi tiết</Title>}
            visible={visible}
            onCancel={onCancel}
            footer={null}
            centered
            width={600}
        >
            {item && (
                <div style={{ padding: '10px' }}>
                    <Row gutter={[16, 16]}>
                        <Col span={10}>
                            <Text strong>ID:</Text>
                            <span style={{ display: 'inline-block', marginLeft: '8px' }}>{item.id}</span>
                        </Col>
                        <Col span={14}>
                            <Text strong>Vải:</Text>
                            <span style={{ display: 'inline-block', marginLeft: '8px' }}>{item.name}</span>
                        </Col>
                        <Col span={24}>
                            <Text strong>Mô tả:</Text>
                            <span style={{ display: 'inline-block', marginLeft: '8px' }}>{item.description}</span>
                        </Col>
                        {/*<Col span={10}>*/}
                        {/*    <Text strong>Created At:</Text>*/}
                        {/*    <span style={{ display: 'inline-block', marginLeft: '8px' }}>{new Date(item.createAt).toLocaleString()}</span>*/}
                        {/*</Col>*/}
                        {/*<Col span={14}>*/}
                        {/*    <Text strong>Updated At:</Text>*/}
                        {/*    <span style={{ display: 'inline-block', marginLeft: '8px' }}>{new Date(item.updateAt).toLocaleString()}</span>*/}
                        {/*</Col>*/}
                    </Row>
                </div>
            )}
        </Modal>
    );
};

export default MaterialDetailModal;
