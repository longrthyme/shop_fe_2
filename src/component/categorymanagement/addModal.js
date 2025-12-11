// CategoryAddModal.js
import React from 'react';
import { Modal, Form, Input, Button, Select } from 'antd';

const { Option } = Select;

const CategoryAddModal = ({ visible, onCancel, onCreate }) => {
    const [form] = Form.useForm();

    const handleOk = () => {
        form
            .validateFields()
            .then((values) => {
                onCreate(values); // Gọi hàm onCreate từ component cha để thêm mới
                form.resetFields(); // Reset form sau khi submit thành công
                onCancel(); // Đóng modal sau khi cập nhật
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    return (
        <Modal
            open={visible}
            title="Thêm Mới Thể Loại"
            onCancel={onCancel}
            footer={[
                <Button key="back" onClick={onCancel}>
                    Hủy
                </Button>,
                <Button key="submit" type="primary" onClick={handleOk}>
                    Thêm mới
                </Button>,
            ]}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="name"
                    label="Tên"
                    rules={[{ required: true, message: 'Vui lòng nhập tên thể loại!' }]}
                >
                    <Input placeholder="Nhập tên thể loại" />
                </Form.Item>

                <Form.Item
                    name="type"
                    label="Thể loại"
                    rules={[{ required: true, message: 'Vui lòng chọn kiểu!' }]}
                >
                    <Select placeholder="Chọn kiểu">
                        <Option value="QUAN">QUAN</Option>
                        <Option value="AO">AO</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Mô tả"
                    rules={[
                        { max: 225, message: 'Mô tả không được vượt quá 225 ký tự!' }
                    ]}
                >
                    <Input.TextArea placeholder="Nhập mô tả" />
                </Form.Item>

                <Form.Item
                    name="status"
                    label="Trạng thái"
                    initialValue={1}
                    rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                >
                    <Select placeholder="Chọn trạng thái">
                        <Option value={1}>Đang Hoạt động</Option>
                        <Option value={0}>Ngừng hoạt động</Option>
                    </Select>
                </Form.Item>

            </Form>
        </Modal>
    );
};

export default CategoryAddModal;
