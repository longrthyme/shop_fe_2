import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, Row, Col, Typography, Select, message, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title } = Typography;
const { Option } = Select;

const EmployeeEditModal = ({ visible, onCancel, item, onUpdate }) => {
    const [form] = Form.useForm();
    const [avatarUrl, setAvatarUrl] = useState('');
    const [avatarFile, setAvatarFile] = useState(null);
    const API_KEY = '25d25c1c0ab2bf795c35b58ecaa1b96f';

    useEffect(() => {
        if (visible) {
            if (item) {
                // Nếu đang cập nhật nhân viên hiện có
                form.setFieldsValue({
                    fullName: item.fullName,
                    email: item.email,
                    phone: item.phone,
                    isDeleted: item.isDeleted,
                    username: item.username,
                    address: item.address,
                });
                setAvatarUrl(item.avatarUrl || '');
                setAvatarFile(null);
            } else {
                // Nếu thêm mới
                form.resetFields();
                setAvatarUrl('');
                setAvatarFile(null);
                form.setFieldsValue({
                    password: '', // Mật khẩu không được điền tự động
                    isDeleted: false, // Trạng thái mặc định là "Đang hoạt động"
                });
            }
        }
    }, [visible, item, form]);


    const handleAvatarUpload = (info) => {
        const file = info.file;
        const reader = new FileReader();
        reader.onload = () => {
            setAvatarUrl(reader.result);
            setAvatarFile(file);
        };
        reader.readAsDataURL(file);
    };

    const uploadImageToImgBB = async (imageFile) => {
        const formData = new FormData();
        formData.append('image', imageFile);
        const response = await axios.post(`https://api.imgbb.com/1/upload?key=${API_KEY}`, formData);
        return response.data.data.url;
    };

    const handleUpdate = async () => {
        try {
            const values = await form.validateFields();

            // Nếu có ảnh mới thì upload
            if (avatarFile) {
                values.avatarUrl = await uploadImageToImgBB(avatarFile);
            } else if (item && item.avatarUrl) {
                values.avatarUrl = item.avatarUrl;
            }

            console.log("Dữ liệu nhân viên trước khi cập nhật:", values);

            await onUpdate(values, item ? item.id : null);
            onCancel();

        } catch (error) {
            // Bắt lỗi từ form.validateFields()
            if (error?.errorFields) {
                const firstError = error.errorFields[0]?.errors?.[0];
                message.error(firstError || "Vui lòng điền đầy đủ thông tin!");
            } else {
                message.error("Đã xảy ra lỗi khi xử lý dữ liệu.");
                console.error("Lỗi không xác định:", error);
            }
        }
    };



    return (
        <Modal
            title={<Title level={3} style={{ color: '#52c41a' }}>{item ? 'Cập nhật nhân viên' : 'Thêm nhân viên mới'}</Title>}
            visible={visible}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>Hủy</Button>,
                <Button key="update" type="primary" onClick={handleUpdate}>{item ? 'Cập nhật' : 'Thêm'}</Button>,
            ]}
            centered
            width={600}
        >
            <Form form={form} layout="vertical">
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Form.Item
                            label="Tên nhân viên"
                            name="fullName"
                            rules={[{ required: true, message: 'Vui lòng nhập tên nhân viên!' }]}
                        >
                            <Input placeholder="Tên nhân viên" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Username"
                            name="username"
                            rules={[{ required: true, message: 'Vui lòng nhập username!' }]}
                        >
                            <Input placeholder="Username" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                { required: true, message: 'Vui lòng nhập email!' },
                                { type: 'email', message: 'Email không hợp lệ!' },
                            ]}
                        >
                            <Input placeholder="Email" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        { item && (
                            <Form.Item
                                label="Mật khẩu"
                                name="password"
                                rules={[{ required: !item, message: 'Vui lòng nhập mật khẩu!' }]}
                            >
                                <Input.Password placeholder="Mật khẩu" />
                            </Form.Item>
                        )}
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Số điện thoại"
                            name="phone"
                            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                        >
                            <Input placeholder="Số điện thoại" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Địa chỉ"
                            name="address"
                            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                        >
                            <Input placeholder="Địa chỉ" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label="Ảnh đại diện">
                            <Upload beforeUpload={() => false} onChange={handleAvatarUpload} showUploadList={false}>
                                <Button icon={<PlusOutlined />}>Chọn ảnh</Button>
                            </Upload>
                            {avatarUrl && <img src={avatarUrl} alt="Avatar" style={{ width: '100px', height: 'auto', marginTop: '10px' }} />}
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label="Trạng thái"
                            name="isDeleted"
                            rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                        >
                            <Select placeholder="Chọn trạng thái">
                                <Option value={true}>Không hoạt động</Option>
                                <Option value={false}>Đang hoạt động</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default EmployeeEditModal;
