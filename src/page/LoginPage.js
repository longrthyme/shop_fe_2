import React, { useState } from 'react';
import { Form, Input, Button, Typography, Row, Col, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';
import { loginApi } from '../api/ApiAuthentication'; // Import hàm loginApi từ file api
import { useAuth } from '../AuthContext';
import {useWebSocket} from "../WebSocketProvider";
const { Text, Title } = Typography;

const LoginPage = () => {
    const {connectWs} = useWebSocket();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();
    // Gọi hàm đăng nhập từ API
    const onLogin = async (values) => {
        setLoading(true);

        try {
            // Gọi API từ file auth.js
            const data = await loginApi({
                username: values.username,
                password: values.password
            });

            // Lưu token và role
            login(data.access_token, data.role, data.username);
            console.log("day la data login", data.role)
            message.success('Đăng nhập thành công!');

            form.resetFields();

            // Điều hướng tùy thuộc vào role
            if (data.role === 'ADMIN') {
                navigate('/admin/dashboard');
            } else if (data.role === 'EMPLOYEE'){
                console.log("vao")
                navigate('/admin/dashboard');
            } else if (data.role === 'USER'){
                navigate('/wed/trangchu');
            }
            else {
                navigate('/');
            }
            connectWs();
        } catch (error) {
            message.error(`${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <Title level={2} className="login-title">Đăng nhập</Title>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onLogin}
                >
                    <Form.Item
                        name="username"
                        label="Tài khoản"
                        rules={[{ required: true, message: 'Vui lòng nhập tài khoản!' }]}
                    >
                        <Input placeholder="Nhập tài khoản" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Mật khẩu"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                    >
                        <Input.Password placeholder="Nhập mật khẩu" />
                    </Form.Item>

                    <Button type="primary" htmlType="submit" loading={loading} block>
                        Đăng nhập
                    </Button>
                </Form>

                <Row justify="space-between" style={{ marginTop: '16px' }}>
                    <Col>
                        <Text
                            onClick={() => navigate('/forgot-password')}
                            style={{ cursor: 'pointer', color: '#1890ff' }}
                        >
                            Quên mật khẩu?
                        </Text>
                    </Col>
                    <Col>
                        <Text
                            onClick={() => navigate('/register')}
                            style={{ cursor: 'pointer', color: '#1890ff' }}
                        >
                            Đăng ký tài khoản mới
                        </Text>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default LoginPage;
