import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, Row, Col, Typography, Select } from 'antd';

const { Title, Text } = Typography;
const { Option } = Select;

// Danh sách các màu cơ bản với tên tiếng Việt
const basicColors = [
    { code: '#FF0000', name: 'Đỏ' },
    { code: '#FF9900', name: 'Cam' },
    { code: '#FFFF00', name: 'Vàng' },
    { code: '#00FF00', name: 'Xanh lá cây' },
    { code: '#00FFFF', name: 'Xanh da trời nhạt' },
    { code: '#0000FF', name: 'Xanh dương' },
    { code: '#9900FF', name: 'Tím' },
    { code: '#FF00FF', name: 'Hồng' },
    { code: '#C0C0C0', name: 'Bạc' },
    { code: '#808080', name: 'Xám' },
    { code: '#000000', name: 'Đen' },
    { code: '#FFFFFF', name: 'Trắng' },
    { code: '#800000', name: 'Đỏ nâu' },
    { code: '#808000', name: 'Vàng đất' },
    { code: '#008000', name: 'Xanh lá đậm' },
    { code: '#008080', name: 'Xanh biển đậm' },
    { code: '#000080', name: 'Xanh navy' },
    { code: '#800080', name: 'Tím đậm' },
    { code: '#FF8080', name: 'Đỏ nhạt' },
    { code: '#FFCC80', name: 'Cam nhạt' },
    { code: '#FFFF99', name: 'Vàng nhạt' },
    { code: '#CCFFCC', name: 'Xanh lá nhạt' },
    { code: '#CCFFFF', name: 'Xanh biển nhạt' },
    { code: '#9999FF', name: 'Xanh dương nhạt' },
    { code: '#CC99FF', name: 'Tím nhạt' },
    { code: '#FFCCFF', name: 'Hồng nhạt' },
    { code: '#F5F5DC', name: 'Be' },
    { code: '#A52A2A', name: 'Nâu' }

];

const ColorEditModal = ({ visible, onCancel, item, onUpdate }) => {
    const [form] = Form.useForm();
    const [selectedColor, setSelectedColor] = useState('#FFFFFF'); // Màu mặc định

    // Khi modal mở, gọi API lấy dữ liệu từ DB theo id và gán vào form
    useEffect(() => {
        if (visible) {
            if (item) {
                form.setFieldsValue({
                    name: item.name,
                    code: item.code,
                    status: item.status, // Sửa ở đây
                });
                setSelectedColor(item.code);
            } else {
                form.resetFields();
                setSelectedColor('#FFFFFF');
                form.setFieldsValue({ status: 0 }); // Mặc định "Đang hoạt động"
            }
        }
    }, [visible, item, form]);



    // Xử lý khi chọn màu
    const handleColorSelect = (color) => {
        setSelectedColor(color);
        const selected = basicColors.find(c => c.code.toLowerCase() === color.toLowerCase());

        form.setFieldsValue({
            code: color,
            name: selected ? selected.name : 'Màu tùy chỉnh', // Nếu không tìm thấy tên màu, đặt thành 'Màu tùy chỉnh'
        });
    };

    // Xử lý thay đổi (add or update)
    const handleUpdate = () => {
        form
            .validateFields()
            .then((values) => {
                onUpdate(values, item ? item.id : null);
                onCancel();
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };


    return (
        <Modal
            title={<Title level={3} style={{ color: '#52c41a' }}>{item ? 'Cập nhật thông tin' : 'Thêm Màu Mới'}</Title>}
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
                            label={<Text strong>Tên</Text>}
                            name="name"
                            rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                        >
                            <Input placeholder="Tên màu tự động cập nhật theo mã màu" readOnly />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={<Text strong>Mã màu</Text>}
                            name="code"
                        >
                            <Input placeholder="Mã màu sẽ tự động được cập nhật" value={selectedColor} readOnly />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '10px' }}>
                            {basicColors.map(({ code }) => (
                                <div
                                    key={code}
                                    onClick={() => handleColorSelect(code)}
                                    style={{
                                        backgroundColor: code,
                                        width: '40px',
                                        height: '40px',
                                        cursor: 'pointer',
                                        border: code === selectedColor ? '3px solid #000' : '1px solid #ccc',
                                    }}
                                />
                            ))}
                        </div>
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

                </Row>
            </Form>
        </Modal>
    );
};

export default ColorEditModal;
