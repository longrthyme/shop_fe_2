import React, { useState, useEffect } from 'react';
import { Button, Col, Form, Input, message, Modal, Row, Typography } from 'antd';
import { findUserById, updateUser, createUser, findUserByPhone, getAllUser } from '../../../api/UserCtrlApi';

const { Title, Text } = Typography;

const CustomerInfo = ({ customerInfo, setCustomerInfo, resetTrigger }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [userInfo, setUserInfo] = useState(customerInfo);
    const [userList, setUserList] = useState([]);
    const [phone, setPhone] = useState("");
    const [form] = Form.useForm();

    useEffect(() => {
        setUserInfo(customerInfo);
    }, [customerInfo]);

    useEffect(() => {
        setUserInfo(null);
    }, [resetTrigger]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getAllUser();
                const usersWithRole2 = data.filter(user => user.role.id === 2);
                setUserList(usersWithRole2);
            } catch (error) {
                message.error("Cannot load customer list.");
            }
        };
        fetchUsers();
    }, []);

    const showAddModal = () => {
        setUserInfo(null);
        setIsModalVisible(true);
    };

    const handlePhoneChange = async (e) => {
        const phoneInput = e.target.value;
        setPhone(phoneInput);

        if (phoneInput.length >= 10) {
            try {
                // Gọi API kiểm tra sự tồn tại của số điện thoại
                const existingUser = await findUserByPhone(phoneInput);

                if (existingUser) {
                    // Nếu tìm thấy người dùng, hiển thị thông tin và mở modal
                    message.success("Số điện thoại đã tồn tại, hiển thị thông tin khách hàng.");
                    setUserInfo(existingUser);
                    setCustomerInfo(existingUser);

                }
                setPhone("");
            } catch (error) {
                // Nếu có lỗi (nghĩa là không tìm thấy user), mở modal để thêm user mới
                console.error("Error checking phone number:", error);
                message.info("Không tìm thấy số điện thoại. Mở form để thêm khách hàng mới.");

                setUserInfo(null);
                form.resetFields();
                form.setFieldsValue({ phone: phoneInput });
                setIsModalVisible(true); // Mở modal để thêm khách hàng mới
            }
        } else {
            // Reset lại nếu số điện thoại chưa đủ 10 chữ số
            setUserInfo(null);
            form.resetFields();
        }
    };




    const handleUpdate = async () => {
        try {
            const values = await form.validateFields();
            let updatedUser;
            if (userInfo?.id) {
                await updateUser(values, userInfo.id);
                updatedUser = await findUserById(userInfo.id);
            } else {
                await createUser(values);
                updatedUser = await findUserByPhone(values.phone);
            }
            setUserInfo(updatedUser);
            setCustomerInfo(updatedUser);
            setIsModalVisible(false);
            message.success(userInfo ? 'Updated successfully!' : 'Added successfully!');
        } catch (error) {
            message.error('Error occurred while updating/creating user.');
        }
    };

    return (
        <div className="customer-info">
            <div>
                <Input
                    placeholder=""
                    value={phone}
                    onChange={handlePhoneChange}
                    style={{ width: '80%', marginBottom: '10px' }}
                />
                <Button onClick={showAddModal}>+</Button>
            </div>

            {/* Display selected customer information */}
            {userInfo && (
                <div className="khach-hang">
                    <label>Họ Tên: {userInfo.fullName || ""}</label> <br />
                    <label>SDT: {userInfo.phone || ""}</label> <br />
                    <label>Email: {userInfo.email || ""}</label> <br />
                    <label>Mã KH: {userInfo.phone || ""}</label> <br />
                </div>
            )}

            <Modal
                title={<Title level={3} style={{ color: '#52c41a' }}>{userInfo ? 'Update User Information' : 'Thêm khách hàng'}</Title>}
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsModalVisible(false)}>
                        Hủy
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleUpdate}>
                        {userInfo ? 'Update' : 'Thêm'}
                    </Button>
                ]}
                centered
                width={600}
            >
                <Form form={form} layout="vertical" initialValues={userInfo || { phone }}>
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <Form.Item
                                label={<Text strong>Tên</Text>}
                                name="fullName"
                                rules={[{ required: true, message: 'Please enter the user name!' }]}
                            >
                                <Input placeholder="" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label={<Text strong>Địa chỉ</Text>}
                                name="address"
                            >
                                <Input placeholder="" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label={<Text strong>SDT</Text>}
                                name="phone"
                                rules={[{ required: true, message: 'Please enter phone number!' }]}
                            >
                                <Input placeholder="" value={phone} onChange={handlePhoneChange} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label={<Text strong>Email</Text>}
                                name="email"
                                rules={[{ type: 'email', message: 'Please enter a valid email!' }]}
                            >
                                <Input placeholder="" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
};

export default CustomerInfo;
