import React, {useEffect, useState} from 'react';
import {Modal, Form, Input, Button, Row, Col, Typography, message, DatePicker, InputNumber} from 'antd';

const {Title, Text} = Typography;

const AddQuantityModal = ({visible, onCancel, item, onUpdate}) => {
    const [form] = Form.useForm();
    // const [purchasePrice, setPurchasePrice] = useState(0); // State để lưu giá nhập
    // const [salePrice, setSalePrice] = useState(0); // State để lưu giá bán


    useEffect(() => {
        if (visible && item) {

            form.setFieldsValue({
                quantity: item.quantity,
                quantityAdd: null,
                purchasePrice: null,
                salePrice: null,
                importDate: null,
            });
        }
    }, [visible, item, form]);

    const handleUpdateQuantity = async () => {
        try {
            const values = await form.validateFields();
            const {quantityAdd, purchasePrice, salePrice, importDate} = values;

            if (isNaN(quantityAdd) || quantityAdd <= 0) {
                message.error("Số lượng nhập phải lớn hơn 0!");
                return;
            }

            const formattedRequest = {
                quantityAdded: parseInt(quantityAdd, 10),
                purchasePrice: parseInt(purchasePrice, 10),
                salePrice: parseInt(salePrice, 10),
                importDate: importDate ? importDate.toISOString() : null,
            };

            await onUpdate(item.id, formattedRequest); // Gọi hàm cập nhật
            onCancel(); // Đóng modal sau khi cập nhật thành công
        } catch (error) {
            console.error("Lỗi khi cập nhật sản phẩm:", error);
            message.error("Cập nhật thất bại!");
        }
    };
    // // Hàm kiểm tra giá nhập không lớn hơn giá bán
    // const handlePriceChange = (value, type) => {
    //     if (type === 'purchasePrice') {
    //         setPurchasePrice(value);
    //         if (value > salePrice) {
    //             message.error('Giá nhập không được lớn hơn giá bán!');
    //         }
    //     } else if (type === 'salePrice') {
    //         setSalePrice(value);
    //         if (purchasePrice > value) {
    //             message.error('Giá nhập không được lớn hơn giá bán!');
    //         }
    //     }
    // };

    // const handleSalePriceChange = (value) => {
    //     if (value < purchasePrice) {
    //         message.error('Giá bán không được nhỏ hơn giá nhập!');
    //     }
    //     setSalePrice(value);
    // };
    return (
        <Modal
            title={
                <div>
                    <Title level={3} style={{color: '#52c41a'}}>Nhập sản phẩm</Title>
                </div>
            }
            visible={visible}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Hủy
                </Button>,
                <Button key="update" type="primary" onClick={handleUpdateQuantity}>
                    Cập nhật
                </Button>,
            ]}
            centered
            width={700}
        >
            <Form form={form} layout="vertical" style={{padding: '10px'}}>
                <Row gutter={[16, 16]}>
                    {/* Số lượng đang có */}
                    <Col span={12}>
                        <Form.Item
                            label={<Text strong>Số lượng đang có</Text>}
                            name="quantity"
                        >
                            {/* Chỉ đọc trường này */}
                            <InputNumber readOnly placeholder="Số lượng hiện tại"/>
                        </Form.Item>
                    </Col>

                    {/* Số lượng nhập */}
                    <Col span={12}>
                        <Form.Item
                            label={<Text strong>Số lượng nhập</Text>}
                            name="quantityAdd"
                            rules={[{required: true, message: "Vui lòng nhập số lượng!"}]}
                        >
                            <InputNumber
                                min={1}
                                style={{width: '100%'}}
                                placeholder="Nhập số lượng"
                                formatter={value => value ? new Intl.NumberFormat('de-DE').format(value) : ''}
                                parser={value => value.replace(/\./g, '')}  // Loại bỏ dấu chấm khi nhập
                            />
                        </Form.Item>
                    </Col>

                    {/* Giá nhập */}
                    <Col span={12}>
                        <Form.Item
                            label={<Text strong>Giá nhập</Text>}
                            name="purchasePrice"
                            rules={[{required: true, message: "Vui lòng nhập giá nhập!"}]}
                        >
                            <InputNumber
                                min={0}
                                style={{width: '100%'}}
                                placeholder="Nhập giá nhập"
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                            />
                        </Form.Item>
                    </Col>

                    {/* Giá bán */}
                    <Col span={12}>
                        <Form.Item
                            label={<Text strong>Giá bán</Text>}
                            name="salePrice"
                            dependencies={['purchasePrice']} // Đảm bảo trường này phụ thuộc vào purchasePrice
                            rules={[
                                { required: true, message: "Vui lòng nhập giá bán!" },
                                { type: 'number', min: 0, message: "Giá bán không được âm!" },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        const purchasePrice = getFieldValue('purchasePrice');
                                        if (value === undefined || purchasePrice === undefined) {
                                            return Promise.resolve();
                                        }
                                        if (value < purchasePrice) {
                                            return Promise.reject(new Error('Giá bán không được nhỏ hơn giá nhập!'));
                                        }
                                        return Promise.resolve();
                                    },
                                }),
                            ]}
                        >
                            <InputNumber
                                min={0}
                                style={{ width: '100%' }}
                                placeholder="Nhập giá bán"
                                formatter={value => value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}
                                parser={value => value.replace(/(,*)/g, '')}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label={<Text strong>Ngày nhập</Text>}
                            name="importDate"
                            rules={[{ required: true, message: "Vui lòng chọn ngày nhập!" }]}
                        >
                            <DatePicker
                                showTime
                                placeholder="Chọn ngày nhập"
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default AddQuantityModal;
