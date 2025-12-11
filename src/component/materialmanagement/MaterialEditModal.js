import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, Row, Col, Typography } from 'antd';

const { Title, Text } = Typography;

const MaterialEditModal = ({ visible, onCancel, item, onUpdate }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (visible) {
            if (item) {
                form.setFieldsValue({
                    name: item.name,
                    description: item.description,
                });
            } else {
                form.resetFields();
            }
        }
    }, [visible, item, form]);

    const handleUpdate = () => {
        form
            .validateFields()
            .then((values) => {
                onUpdate(values, item ? item.id : null);
                onCancel();
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    return (
        <Modal
            title={<Title level={3} style={{ color: '#52c41a' }}>{item ? 'Sửa chất liệu' : 'Thêm chất liệu mới'}</Title>}
            visible={visible}
            onCancel={onCancel}
            footer={[
                <Button key="Hủy" onClick={onCancel}>
                    Hủy
                </Button>,
                <Button key="update" type="primary" onClick={handleUpdate}>
                    {item ? 'Cập nhập' : 'Add'}
                </Button>,
            ]}
            centered
            width={600}
        >
            <Form form={form} layout="vertical" style={{ padding: '10px' }}>
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Form.Item
                            label={<Text strong>Tên</Text>}
                            name="name"
                            rules={[{ required: true, message: 'vui lòng nhập tên!' }]}
                        >
                            <Input placeholder="Tên" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label={<Text strong>Mô tả</Text>}
                            name="description"
                            rules={[{ required: true, message: 'vui lòng nhập mô tả!' }]}
                        >
                            <Input.TextArea placeholder="Mô tả" rows={4} />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default MaterialEditModal;
