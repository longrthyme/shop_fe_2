import React from 'react';
import { Modal, Row, Col, Typography } from 'antd';

const { Title, Text } = Typography;

const VoucherDetailModal = ({ visible, onCancel, item }) => {

    return (
        <Modal
            title={<Title level={3} style={{ color: '#1890ff' }}>Chi tiết thông tin Voucher</Title>}
            visible={visible}
            onCancel={onCancel}
            footer={null}
            centered
            width={605}
        >
            {item && (
                <div style={{ padding: '10px' }}>
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <Text strong>ID:</Text>
                            <span style={{ display: 'inline-block', marginLeft: '8px' }}>{item.id}</span>
                        </Col>
                        <Col span={12}>
                            <Text strong>Tên Voucher:</Text>
                            <span style={{ display: 'inline-block', marginLeft: '8px' }}>{item.name}</span>
                        </Col>
                        <Col span={12}>
                            <Text strong>Mã Voucher:</Text>
                            <span style={{ display: 'inline-block', marginLeft: '8px' }}>{item.code}</span>
                        </Col>
                        <Col span={12}>
                            <Text strong>Phần Trăm Giảm:</Text>
                            <span style={{ display: 'inline-block', marginLeft: '8px' }}>{item.discount}</span>
                        </Col>
                        <Col span={12}>
                            <Text strong>Giá Trị Đơn Hàng:</Text>
                            <span style={{ display: 'inline-block', marginLeft: '8px' }}>{item.minTotal}</span>
                        </Col>
                        <Col span={12}>
                            <Text strong>Số Tiền Giảm: </Text>
                            <span style={{ display: 'inline-block', marginLeft: '8px' }}>{item.maxDiscount}</span>
                        </Col>
                        <Col span={12}>
                            <Text strong>Số Lượng Phiếu: </Text>
                            <span style={{ display: 'inline-block', marginLeft: '8px' }}>{item.maxUsage}</span>
                        </Col>
                        <Col span={12}>
                            <Text strong>Ngày Bắt Đầu:</Text>
                            <span style={{ display: 'inline-block', marginLeft: '8px' }}>{new Date(item.startDate).toLocaleString()}</span>
                        </Col>
                        <Col span={12}>
                            <Text strong>Ngày Kết Thúc:</Text>
                            <span style={{ display: 'inline-block', marginLeft: '8px' }}>{new Date(item.endDate).toLocaleString()}</span>
                        </Col>
                        <Col span={24}>
                            <Text strong>Mô Tả:</Text>
                            <span style={{ display: 'inline-block', marginLeft: '8px' }}>{item.description}</span>
                        </Col>
                        <Col span={12}>
                            <Text strong>Kiểu:</Text>
                            <span style={{ display: 'inline-block', marginLeft: '8px' }}>{item.type}</span>
                        </Col>
                        <Col span={12}>
                            <Text strong>Trạng Thái:</Text>
                            <span style={{ display: 'inline-block', marginLeft: '8px' }}>
    {item.status === 'ACTIVE' ? 'Đang Hoạt Động' :
        item.status === 'INACTIVE' ? 'Ngừng Hoạt Động' :
            item.status === 'Upcoming' ? 'Sắp diễn ra' : 'Đã hủy'}
</span>



                        </Col>
                    </Row>
                </div>
            )}
        </Modal>
    );
};

export default VoucherDetailModal;
