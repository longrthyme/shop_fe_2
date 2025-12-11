import React, { useState } from 'react';
import { Form, Input, Button, message, Typography, Steps } from 'antd';
import { useNavigate } from 'react-router-dom';
import ApiAuth from '../service/ApiAuth';
import '../styles/ForgotPasswordPage.css';

const { Title } = Typography;
const { Step } = Steps;

const ForgotPasswordPage = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const navigate = useNavigate();

    // Step 1: Send OTP to email
    const handleSendOTP = async (values) => {
        setLoading(true);
        try {
            await ApiAuth.sendOtp(values.email);
            setEmail(values.email);
            message.success('Mã OTP đã được gửi tới email của bạn!');
            setCurrentStep(1);
            form.resetFields();
        } catch (error) {
            message.error(error.message || 'Gửi OTP thất bại, vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOTP = async (values) => {
        setLoading(true);
        try {
            const response = await ApiAuth.verifyOtp(email, values.otp);
            if (response.valid) {
                setOtp(values.otp);
                message.success('Xác thực OTP thành công!');
                setCurrentStep(2);
                form.resetFields();
            } else {
                message.error('Mã OTP không hợp lệ hoặc đã hết hạn!');
            }
        } catch (error) {
            message.error(error.message || 'Xác thực OTP thất bại!');
        } finally {
            setLoading(false);
        }
    };

    // Step 3: Reset Password
    const handleResetPassword = async (values) => {
        setLoading(true);
        try {
            await ApiAuth.resetPassword(email, otp, values.newPassword);
            message.success('Đặt lại mật khẩu thành công!');
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } catch (error) {
            message.error(error.message || 'Đặt lại mật khẩu thất bại!');
        } finally {
            setLoading(false);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
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
                            <Input placeholder="Nhập email của bạn" size="large" />
                        </Form.Item>

                        <Button type="primary" htmlType="submit" loading={loading} block size="large">
                            Gửi mã OTP
                        </Button>
                    </Form>
                );

            case 1:
                return (
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleVerifyOTP}
                    >
                        <div style={{ marginBottom: '16px', color: '#666' }}>
                            Mã OTP đã được gửi tới: <strong>{email}</strong>
                        </div>

                        <Form.Item
                            name="otp"
                            label="Mã OTP"
                            rules={[
                                { required: true, message: 'Vui lòng nhập mã OTP!' },
                                { len: 6, message: 'Mã OTP phải có 6 ký tự!' }
                            ]}
                        >
                            <Input
                                placeholder="Nhập mã OTP (6 ký tự)"
                                maxLength={6}
                                size="large"
                            />
                        </Form.Item>

                        <Button type="primary" htmlType="submit" loading={loading} block size="large">
                            Xác thực OTP
                        </Button>

                        <Button
                            onClick={() => setCurrentStep(0)}
                            block
                            style={{ marginTop: '12px' }}
                            size="large"
                        >
                            Quay lại
                        </Button>
                    </Form>
                );

            case 2:
                return (
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleResetPassword}
                    >
                        <Form.Item
                            name="newPassword"
                            label="Mật khẩu mới"
                            rules={[
                                { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                            ]}
                        >
                            <Input.Password placeholder="Nhập mật khẩu mới" size="large" />
                        </Form.Item>

                        <Form.Item
                            name="confirmPassword"
                            label="Xác nhận mật khẩu"
                            dependencies={['newPassword']}
                            rules={[
                                { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('newPassword') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password placeholder="Xác nhận mật khẩu mới" size="large" />
                        </Form.Item>

                        <Button type="primary" htmlType="submit" loading={loading} block size="large">
                            Đặt lại mật khẩu
                        </Button>
                    </Form>
                );

            default:
                return null;
        }
    };

    return (
        <div className="forgot-password-page">
            <div className="forgot-password-container">
                <Title level={2}>Quên mật khẩu</Title>

                <Steps current={currentStep} style={{ marginBottom: '32px' }}>
                    <Step title="Nhập Email" />
                    <Step title="Xác thực OTP" />
                    <Step title="Đặt lại mật khẩu" />
                </Steps>

                {renderStepContent()}

                {currentStep === 0 && (
                    <Button
                        onClick={() => navigate('/login')}
                        block
                        style={{ marginTop: '16px' }}
                        size="large"
                    >
                        Quay lại đăng nhập
                    </Button>
                )}
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
