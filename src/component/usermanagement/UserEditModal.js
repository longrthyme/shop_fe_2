import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, Row, Col, Typography, Select, message, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;
const { Option } = Select;

const UserEditModal = ({ visible, onCancel, item, onUpdate }) => {
    const [form] = Form.useForm();
    const [avatarUrl, setAvatarUrl] = useState(''); // Lưu trữ URL ảnh đại diện hiển thị
    const [avatarFile, setAvatarFile] = useState(null); // Lưu trữ file ảnh đại diện
    const API_KEY = '25d25c1c0ab2bf795c35b58ecaa1b96f'; // API Key của ImgBB

    useEffect(() => {
        if (!visible) return;

        if (item && typeof item === 'object') {
            const safeItem = {
                fullName: item.fullName || '',
                username: item.username || '',
                email: item.email || '',
                address: item.address || '',
                phone: item.phone || '',
                isDeleted: item.isDeleted ?? false,
            };

            form.setFieldsValue(safeItem);
            setAvatarUrl(item.avatarUrl || '');
        } else {
            form.resetFields();
            setAvatarUrl('');
        }

        setAvatarFile(null);
    }, [visible, item]);



    const handleAvatarUpload = (info) => {
        const file = info.file;

        if (file && file instanceof Blob) {
            const reader = new FileReader();

            reader.onload = () => {
                setAvatarUrl(reader.result); // Tạm thời hiển thị ảnh mới
                setAvatarFile(file); // Lưu file ảnh để upload khi cập nhật
            };

            reader.readAsDataURL(file);
        } else {
            message.error("File không hợp lệ. Vui lòng chọn một ảnh từ máy tính.");
        }
    };

    const uploadImageToImgBB = async (imageFile) => {
        const formData = new FormData();
        formData.append('image', imageFile);

        try {
            const response = await axios.post(`https://api.imgbb.com/1/upload?key=${API_KEY}`, formData);
            return response.data.data.url;
        } catch (error) {
            console.error('Lỗi khi tải ảnh lên ImgBB:', error);
            return null;
        }
    };

    const handleUpdate = async () => {
        try {
            const values = await form.validateFields();

            let finalAvatarUrl = avatarUrl;

            if (avatarFile) {
                finalAvatarUrl = await uploadImageToImgBB(avatarFile); // Tải ảnh mới lên ImgBB và lấy URL
            }

            const updatedUserDetail = {
                ...values,
                avatarUrl: finalAvatarUrl,
            };
            console.log("Dữ liệu trước khi gửi cập nhật:", JSON.stringify(updatedUserDetail, null, 2));
            onUpdate(updatedUserDetail, item ? item.id : null);
            onCancel();
        } catch (error) {
            console.error('Lỗi khi cập nhật thông tin người dùng:', error);
            message.error('Có lỗi xảy ra khi cập nhật!');
        }
    };

    return (
        <Modal
            title={<Title level={3} style={{ color: '#52c41a' }}>{item ? 'Cập nhật thông tin người dùng' : 'Thêm Người Dùng Mới'}</Title>}
            visible={visible}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Hủy
                </Button>,
                <Button key="update" type="primary" onClick={handleUpdate}>
                    {item ? 'Cập nhật' : 'Thêm'}
                </Button>,
            ]}
            centered
            width={600}
        >
            <Form form={form} layout="vertical" style={{ padding: '10px' }}>
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Form.Item
                            label={<Text strong>Tên người dùng</Text>}
                            name="fullName"
                            rules={[{ required: true, message: 'Vui lòng nhập tên người dùng!' }]}
                        >
                            <Input placeholder="Nhập tên người dùng" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={<Text strong>Địa chỉ</Text>}
                            name="address"
                        >
                            <Input placeholder="Nhập địa chỉ" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={<Text strong>Số điện thoại</Text>}
                            name="phone"
                            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                        >
                            <Input placeholder="Nhập số điện thoại" />
                        </Form.Item>
                    </Col>
                    {item && (
                        <>
                            <Col span={12}>
                                <Form.Item
                                    label={<Text strong>Username</Text>}
                                    name="username"
                                >
                                    <Input placeholder="Username" readOnly />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label={<Text strong>Email</Text>}
                                    name="email"
                                    rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ!' }]}
                                >
                                    <Input placeholder="Nhập email" />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item label={<Text strong>Ảnh đại diện</Text>}>
                                    <Upload
                                        beforeUpload={() => false}
                                        onChange={handleAvatarUpload}
                                        showUploadList={false}
                                    >
                                        <Button icon={<PlusOutlined />}>Chọn ảnh</Button>
                                    </Upload>
                                    {avatarUrl ? (
                                        <img
                                            src={avatarUrl}
                                            alt="Avatar"
                                            style={{ width: '100px', height: 'auto', marginTop: '10px', marginLeft: '30px' }}
                                        />
                                    ) : (
                                        <Text type="secondary" style={{ marginLeft: '30px' }}>Chưa cập nhật</Text>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    label={<Text strong>Trạng thái</Text>}
                                    name="isDeleted"
                                    rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                                >
                                    <Select placeholder="Chọn trạng thái">
                                        <Option value={true}>Không hoạt động</Option>
                                        <Option value={false}>Đang hoạt động</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </>
                    )}
                </Row>
            </Form>
        </Modal>
    );
};

export default UserEditModal;
