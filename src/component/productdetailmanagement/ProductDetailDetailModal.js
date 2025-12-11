import React from 'react';
import { Modal, Row, Col, Typography } from 'antd';
const { Title, Text } = Typography;

const ProductDetailDetailModal = ({ visible, onCancel, item }) => {

    return (
        <Modal
            title={<Title level={3} style={{ color: '#1890ff' }}>Chi tiết sản phẩm</Title>}
            visible={visible}
            onCancel={onCancel}
            footer={null}
            centered
            width={600}
        >
            {item && (
                <div style={{ padding: '10px'}}>
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <Text strong>ID:</Text>
                            <span style={{ display: 'inline-block', marginLeft: '8px' }}>{item.id}</span>
                        </Col>
                        <Col span={12}>
                            <Text strong>Số lượng:</Text>
                            <span style={{ display: 'inline-block', marginLeft: '8px' }}>{item.quantity}</span>
                        </Col>
                        <Col span={12}>
                            <Text strong>Màu sắc:</Text>
                            <span style={{ display: 'inline-block', marginLeft: '8px' }}>{item.color?.name}</span>
                        </Col>
                        <Col span={12}>
                            <Text strong>Kích cỡ:</Text>
                            <span style={{ display: 'inline-block', marginLeft: '8px' }}>{item.size?.name}</span>
                        </Col>
                        <Col span={12}>
                            <Text strong>Hình ảnh:</Text>
                            <img src={item.image} alt="Ảnh sản phẩm" style={{ width: '100px', height: 'auto', marginLeft: '8px' }} />
                        </Col>
                        <Col span={12}>
                            <Text strong>Ngày tạo:</Text>
                            <span style={{ display: 'inline-block', marginLeft: '8px' }}>{new Date(item.createAt).toLocaleString()}</span>
                        </Col>
                        <Col span={12}>
                            <Text strong>Ngày cập nhật:</Text>
                            <span style={{ display: 'inline-block', marginLeft: '8px' }}>{new Date(item.updateAt).toLocaleString()}</span>
                        </Col>
                        <Col span={12}>
                            <Text strong>Trạng thái:</Text>
                            <span style={{ display: 'inline-block', marginLeft: '8px' }}>
                                {item.isDeleted ? 'Ngừng hoạt động' : 'Đang hoạt động'}
                            </span>
                        </Col>
                    </Row>
                </div>
            )}
        </Modal>
    );
};

export default ProductDetailDetailModal;
