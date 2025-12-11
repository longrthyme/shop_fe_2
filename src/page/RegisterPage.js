import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { Form, Input, Button, message, Typography, Row, Col } from 'antd';
import '../styles/RegisterPage.css'; // Optional: CSS for custom styles
import { registerUser } from "../api/ApiAuthentication";
const { Title } = Typography;

const RegisterPage = ({ onRegister, onSendOTP }) => {
    const [form] = Form.useForm();
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);
    const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng

    const handleRegister = (values) => {
        setLoading(true);
        registerUser(values)
            .then((data) => {
                console.log("đây là data: ",data)
                message.success(`${data.result}`);
                form.resetFields();
                navigate('/login'); // Chuyển về trang đăng nhập sau khi đăng ký thành công
            })
            .catch((error) => {
                message.error(error.message || 'Đăng ký thất bại!');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    // Hàm để kiểm tra mật khẩu xác nhận có khớp với mật khẩu chính hay không
    const validateConfirmPassword = ({ getFieldValue }) => ({
        validator(_, value) {
            if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
            }
            return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
        },
    });

    return (
        <div className="register-page">
            <div className="register-container">
                <Title level={2}>Đăng ký tài khoản</Title>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleRegister} // Khi người dùng nhấn nút đăng ký
                >
                    <Form.Item
                        name="fullName"
                        label="Tên"
                        rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                    >
                        <Input placeholder="Nhập tên của bạn" />
                    </Form.Item>
                    <Form.Item
                        name="phone"
                        label="SĐT"
                        rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                    >
                        <Input placeholder="Nhập SĐT của bạn" />
                    </Form.Item>

                    <Form.Item
                        name="username"
                        label="Tên tài khoản"
                        rules={[{ required: true, message: 'Vui lòng nhập tên tài khoản!' }]}
                    >
                        <Input placeholder="Nhập tên tài khoản" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Mật khẩu"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                    >
                        <Input.Password placeholder="Nhập mật khẩu" />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        label="Xác nhận mật khẩu"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: 'Vui lòng nhập lại mật khẩu!' },
                            validateConfirmPassword // Gọi hàm kiểm tra mật khẩu khớp
                        ]}
                    >
                        <Input.Password placeholder="Nhập lại mật khẩu" />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email!' },
                            { type: 'email', message: 'Email không hợp lệ!' }
                        ]}
                    >
                        <Input placeholder="Nhập email của bạn" />
                    </Form.Item>

                    <Button type="primary" htmlType="submit" loading={loading} block>
                        Đăng ký
                    </Button>
                </Form>

                <Button onClick={() => navigate('/login')} block style={{ marginTop: '16px' }}>
                    Quay lại đăng nhập
                </Button>
            </div>
        </div>
    );
};

export default RegisterPage;
