import React, { useEffect, useState } from "react";
import { findUserById, updateUser } from "../../api/UserApiForUser";
import { Form, Input, Button, message, Spin, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

const API_KEY = "25d25c1c0ab2bf795c35b58ecaa1b96f"; // API key của ImgBB

const UserAccountForm = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({});
    const [error, setError] = useState(null);
    const [avatarUrl, setAvatarUrl] = useState(""); // State lưu URL ảnh đại diện
    const [avatarFile, setAvatarFile] = useState(null);

    // Hàm lấy thông tin người dùng
    const loadUserDetails = async () => {
        try {
            setLoading(true);
            const response = await findUserById(); // Gọi API lấy thông tin người dùng
            const formattedData = {
                key: response.id, // Có thể dùng id làm key
                id: response.id,
                username: response.username,
                email: response.email,
                fullName: response.fullName,
                address: response.address,
                phone: response.phone,
                avatarUrl: response.avatarUrl || "", // Nếu không có avatar, để trống
            };
            setUser(formattedData); // Lưu thông tin vào state user
            form.setFieldsValue(formattedData); // Đặt giá trị vào các trường form
            setAvatarUrl(response.avatarUrl || ""); // Hiển thị avatar hiện tại
        } catch (error) {
            setError("Không thể tải thông tin người dùng");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUserDetails(); // Gọi API khi component được mount
    }, []); // Đảm bảo gọi chỉ một lần

    const handleAvatarUpload = (info) => {
        const file = info.file;
        const reader = new FileReader();
        reader.onload = () => {
            setAvatarUrl(reader.result); // Hiển thị ảnh mới
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

    const handleSubmit = async () => {
        const values = await form.validateFields();

        // Kiểm tra nếu không có ảnh mới, giữ lại ảnh cũ
        if (avatarFile) {
            values.avatarUrl = await uploadImageToImgBB(avatarFile);
        } else if (user.avatarUrl) {
            values.avatarUrl = user.avatarUrl;
        }

        try {
            await updateUser(values);
            message.success("Cập nhật thông tin thành công!");
        } catch (err) {
            message.error(`Cập nhật thất bại: ${err.message}`);
        }
    };

    if (loading) {
        return <Spin size="large" style={{ display: "block", margin: "50px auto" }} />;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div style={{ maxWidth: 600, margin: "0 auto", padding: "20px", background: "#fff", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            <h2 style={{ textAlign: "center" }}>Thông tin tài khoản</h2>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={user} // Set giá trị ban đầu cho form từ user state
            >
                {/* Ảnh đại diện - Căn giữa */}
                <Form.Item label="Ảnh đại diện">
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "column",
                            cursor: "pointer",
                        }}
                        onClick={() => document.getElementById("avatarUpload").click()} // Mở hộp thoại chọn file khi nhấp vào ảnh
                    >
                        <img
                            src={avatarUrl || "/default-avatar.png"} // Hiển thị ảnh đại diện nếu có, nếu không có ảnh thì hiển thị mặc định
                            alt="Avatar"
                            style={{
                                width: "100px",
                                height: "100px",
                                borderRadius: "50%",
                                marginBottom: "10px",
                                objectFit: "cover",
                            }}
                        />
                        <Upload
                            id="avatarUpload"
                            beforeUpload={() => false} // Ngăn Ant Design tự động tải ảnh
                            onChange={handleAvatarUpload}
                            showUploadList={false}
                        >
                            <input
                                type="file"
                                style={{ display: "none" }} // Ẩn input file
                            />
                        </Upload>
                    </div>
                </Form.Item>

                <Form.Item
                    label="Tên đăng nhập"
                    name="username"
                    rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}
                >
                    <Input placeholder="Tên đăng nhập" />
                </Form.Item>

                {/* Mật khẩu mới */}
                <Form.Item
                    label="Mật khẩu mới"
                    name="password"
                    hasFeedback
                >
                    <Input.Password placeholder="Mật khẩu mới" />
                </Form.Item>

                {/* Xác nhận mật khẩu */}
                <Form.Item
                    label="Xác nhận mật khẩu"
                    name="confirmPassword"
                    dependencies={['password']}
                    rules={[({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject('Mật khẩu và xác nhận mật khẩu không khớp!');
                        },
                    })]}
                    hasFeedback
                >
                    <Input.Password placeholder="Xác nhận mật khẩu" />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: "Vui lòng nhập email!" },
                        { type: "email", message: "Định dạng email không hợp lệ!" },
                    ]}
                >
                    <Input placeholder="Email" />
                </Form.Item>

                <Form.Item label="Họ và tên" name="fullName">
                    <Input placeholder="Họ và tên" />
                </Form.Item>

                <Form.Item label="Địa chỉ" name="address">
                    <Input placeholder="Địa chỉ" />
                </Form.Item>

                <Form.Item
                    label="Số điện thoại"
                    name="phone"
                    rules={[{ pattern: /^[0-9]+$/, message: "Số điện thoại không hợp lệ!" }]}
                >
                    <Input placeholder="Số điện thoại" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        Cập nhật thông tin
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default UserAccountForm;
