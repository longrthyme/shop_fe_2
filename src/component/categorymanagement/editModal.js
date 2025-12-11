import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, Row, Col, Typography, Select } from 'antd';

const { Title, Text } = Typography;
const { Option } = Select;

const CategoryEditModal = ({ visible, onCancel, item, onUpdate }) => {
    const [form] = Form.useForm();
    console.log("day la item trong modal EditCategory", item);

    // Khi modal mở, set dữ liệu vào form
    useEffect(() => {
        if (visible && item) {
            form.setFieldsValue({
                name: item.name,
                type: item.type,
                status: item.status, // ✅ dùng status int
                description: item.description,
            });
        }
    }, [visible, item, form]);

    const handleUpdate = () => {
        form
            .validateFields()
            .then((values) => {
                onUpdate(values); // Gửi dữ liệu cập nhật
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    return (
        <Modal
            title={<Title level={3} style={{ color: '#c4281a' }}>Cập nhật thông tin</Title>}
            open={visible} // ✅ đổi từ visible -> open (AntD v5)
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Hủy
                </Button>,
                <Button key="update" type="primary" onClick={handleUpdate}>
                    Cập nhật
                </Button>,
            ]}
            centered
            width={600}
        >
            <Form form={form} layout="vertical" style={{ padding: '10px' }}>
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Form.Item
                            label={<Text strong>Tên</Text>}
                            name="name"
                            rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                        >
                            <Input placeholder="Nhập tên" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={<Text strong>Kiểu:</Text>}
                            name="type"
                            rules={[{ required: true, message: 'Vui lòng chọn thể loại!' }]}
                        >
                            <Select placeholder="Chọn kiểu">
                                <Option value="QUAN">Quần</Option>
                                <Option value="AO">Áo</Option>
                                <Option value="AO">Bộ quần áo</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label={<Text strong>Trạng thái</Text>}
                            name="status"
                            rules={[{ required: true, message: 'Vui lòng chọn Trạng thái!' }]}
                        >
                            <Select placeholder="Chọn trạng thái">
                                <Option value={1}>Đang hoạt động</Option>
                                <Option value={0}>Ngưng hoạt động</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label={<Text strong>Mô tả</Text>}
                            name="description"
                        >
                            <Input.TextArea rows={3} placeholder="Nhập mô tả" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default CategoryEditModal;
