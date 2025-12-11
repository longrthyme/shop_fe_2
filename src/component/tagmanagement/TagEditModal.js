import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, Row, Col, Typography } from 'antd';

const { Title, Text } = Typography;

const TagEditModal = ({ visible, onCancel, item, onUpdate }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (visible) {
            if (item) {
                form.setFieldsValue({
                    name: item.name,
                    tagContent: item.tagContent,
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
            title={<Title level={3} style={{ color: '#52c41a' }}>{item ? 'Edit Tag' : 'Add New Tag'}</Title>}
            visible={visible}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Cancel
                </Button>,
                <Button key="update" type="primary" onClick={handleUpdate}>
                    {item ? 'Update' : 'Add'}
                </Button>,
            ]}
            centered
            width={600}
        >
            <Form form={form} layout="vertical" style={{ padding: '10px' }}>
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Form.Item
                            label={<Text strong>Name</Text>}
                            name="name"
                            rules={[{ required: true, message: 'Please input tag name!' }]}
                        >
                            <Input placeholder="Tag Name" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label={<Text strong>Tag Content</Text>}
                            name="tagContent"
                            rules={[{ required: true, message: 'Please input tag content!' }]}
                        >
                            <Input.TextArea placeholder="Tag Content" rows={4} />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default TagEditModal;
