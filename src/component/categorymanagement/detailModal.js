// DetailModal.js
import React from 'react';
import { Modal, Row, Col, Typography } from 'antd';

const { Title, Text } = Typography;


const CategoryDetailModal = ({ visible, onCancel, item }) => {
    /**
        Cấu trúc {item && ()} là một cách phổ biến trong React để thực hiện render có điều kiện. 
        Nó sử dụng toán tử logic AND (&&) để kiểm tra điều kiện trước khi hiển thị một phần tử hoặc component.
          
        item: Đây là đối tượng (hoặc giá trị) mà bạn muốn kiểm tra xem có tồn tại hay không. Nếu item là một giá trị hợp lệ (không phải null, undefined, false, 0, hoặc ''), 
        thì phần tử sau dấu && sẽ được render.

        && (): Nếu điều kiện bên trái của && là true, React sẽ tiếp tục render phần tử bên phải trong dấu ngoặc. 
        Ngược lại, nếu điều kiện là false, React sẽ không render phần tử đó.
          
    */
    return (
        <Modal
            title={<Title level={3} style={{ color: '#1890ff' }}>Chi tiết thông tin</Title>}
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
                            <Text strong>Thể loại:</Text>
                            <span style={{ display: 'inline-block', marginLeft: '8px' }}>{item.name}</span>
                        </Col>
                        <Col span={12}>
                            <Text strong>Ngày tạo:</Text>
                            <span style={{ display: 'inline-block', marginLeft: '8px' }}>{new Date(item.createAt).toLocaleString()}</span>
                        </Col>
                        <Col span={12}>
                            <Text strong>Người tạo:</Text>
                            <span style={{ display: 'inline-block', marginLeft: '8px' }}>{item.createdBy}</span>
                        </Col>
                        <Col span={12}>
                            <Text strong>Ngày cập nhật:</Text>
                            <span style={{ display: 'inline-block', marginLeft: '8px' }}>{new Date(item.updateAt).toLocaleString()}</span>
                        </Col>
                        <Col span={12}>
                            <Text strong>Người cập nhật:</Text>
                            <span style={{ display: 'inline-block', marginLeft: '8px' }}>{item.updatedBy}</span>
                        </Col>
                        <Col span={12}>
                            <Text strong>Kiểu:</Text>
                            <span style={{ display: 'inline-block', marginLeft: '8px' }}>{item.type}</span>
                        </Col>
                        <Col span={12}>
                            <Text strong>Trạng thái:</Text>
                            <span style={{ display: 'inline-block', marginLeft: '8px' }}>{item.isDeleted ? 'Không hoạt động' : 'Hoạt động'}</span>
                        </Col>
                        <Col span={24}>
                            <Text strong>Mô tả:</Text>
                            <span style={{ display: 'inline-block', marginLeft: '8px' }}>{item.description}</span>
                        </Col>
                    </Row>
                </div>
            )}
        </Modal>
    );
};

export default CategoryDetailModal;
