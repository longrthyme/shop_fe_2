import React, { useState } from 'react';
import { Form, Input, Button, message, Typography } from 'antd';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../styles/ForgotPasswordPage.css'; // Optional: CSS for custom styles

const { Title } = Typography;

const ForgotPasswordPage = ({ onSendOTP }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng

    const handleSendOTP = (values) => {
        setLoading(true);
        onSendOTP(values.email)
            .then(() => {
                message.success('Mã OTP đã được gửi tới email của bạn!');
                form.resetFields();
            })
            .catch((error) => {
                message.error('Gửi OTP thất bại, vui lòng thử lại!');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="forgot-password-page">
            <div className="forgot-password-container">
                <Title level={2}>Quên mật khẩu</Title>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSendOTP}
                >
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
                        Gửi mã OTP
                    </Button>
                </Form>

                <Button onClick={() => navigate('/login')} block style={{ marginTop: '16px' }}>
                    Quay lại đăng nhập
                </Button>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
