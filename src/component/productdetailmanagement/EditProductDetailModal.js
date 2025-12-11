import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, Row, Col, Typography, Select, message, Upload } from 'antd';
import { getColorList } from '../../api/ColorApi'; // API cho color
import { getAllSize } from '../../service/admin/ApiSize'; // API cho size
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;
const { Option } = Select;

const EditProductDetailModal = ({ visible, onCancel, item, onUpdate }) => {
    const [form] = Form.useForm();
    const [imageUrl, setImageUrl] = useState(''); // Lưu trữ URL ảnh hiển thị
    const [imageFile, setImageFile] = useState(null); // Lưu trữ file ảnh được chọn từ máy tính
    const [colors, setColors] = useState([]); // Lưu trữ danh sách màu
    const [sizes, setSizes] = useState([]); // Lưu trữ danh sách kích cỡ

    const API_KEY = '25d25c1c0ab2bf795c35b58ecaa1b96f';

    useEffect(() => {
        if (visible && item) {
            const productDetail = item;
            form.setFieldsValue({
                quantity: productDetail.quantity,
                sizeId: productDetail.size?.id,
                colorId: productDetail.color?.id,
                isDeleted: productDetail.isDeleted,
                price: productDetail.price,
                inputPrice: productDetail.inputPrice,
            });

            setImageUrl(productDetail.image || ''); // Hiển thị ảnh hiện tại
            setImageFile(null); // Xóa ảnh tạm khi mở lại modal
        }
    }, [visible, item, form]);

    useEffect(() => {
        const fetchColors = async () => {
            try {
                const colorData = await getColorList(1, 100, 'name');

                const activeColors = (colorData.data || colorData).filter(
                    (color) => Number(color.status) === 1
                );
                setColors(activeColors);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách màu sắc:', error);
            }
        };
        fetchColors();
    }, []);

    useEffect(() => {
        const fetchSizes = async () => {
            try {
                const sizeData = await getAllSize(1, 100, 'name');
                const activeSizes = (sizeData.data || sizeData).filter(
                    (size) => Number(size.status) === 1
                );

                setSizes(activeSizes);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách kích cỡ:', error);
            }
        };
        fetchSizes();
    }, []);

    const handleImageUpload = (info) => {
        const file = info.file; // Sử dụng trực tiếp info.file

        // Kiểm tra nếu file tồn tại và là một Blob
        if (file && file instanceof Blob) {
            const reader = new FileReader();

            reader.onload = () => {
                setImageUrl(reader.result); // Tạm thời hiển thị ảnh mới
                setImageFile(file); // Lưu file ảnh để upload khi cập nhật
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

            let finalImageUrl = imageUrl;

            if (imageFile) {
                finalImageUrl = await uploadImageToImgBB(imageFile); // Tải ảnh mới lên ImgBB và lấy URL
            }

            const updatedProductDetail = {
                ...values,
                image: finalImageUrl,
            };
            console.log("Dữ liệu trước khi gửi cập nhật:", JSON.stringify(updatedProductDetail, null, 2));
            onUpdate(item.id, updatedProductDetail);
            onCancel();
        } catch (error) {
            console.error('Lỗi khi cập nhật chi tiết sản phẩm:', error);
            message.error('Có lỗi xảy ra khi cập nhật!');
        }
    };

    return (
        <Modal
            title={<Title level={3} style={{ color: '#52c41a' }}>Cập nhật chi tiết sản phẩm</Title>}
            visible={visible}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Hủy
                </Button>,
                <Button key="update" type="primary" onClick={handleUpdate}>
                    Cập nhật
                </Button>,
            ]}
            centered
            width={600}
        >
            <Form form={form} layout="vertical" style={{ padding: '10px' }}>
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Form.Item
                            label={<Text strong>Số lượng</Text>}
                            name="quantity"
                            rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
                        >
                            <Input

                                placeholder="Nhập số lượng" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={<Text strong>Kích cỡ</Text>}
                            name="sizeId"
                            rules={[{ required: true, message: 'Vui lòng chọn kích cỡ!' }]}
                        >
                            <Select placeholder="Chọn kích cỡ">
                                {sizes && sizes.map(size => (
                                    <Option key={size.id} value={size.id}>{size.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={<Text strong>Màu sắc</Text>}
                            name="colorId"
                            rules={[{ required: true, message: 'Vui lòng chọn màu sắc!' }]}
                        >
                            <Select placeholder="Chọn màu sắc">
                                {colors && colors.map(color => (
                                    <Option key={color.id} value={color.id}>{color.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    {/*<Col span={12}>*/}
                    {/*    <Form.Item*/}
                    {/*        label={<Text strong>Giá nhập</Text>}*/}
                    {/*        name="inputPrice"*/}
                    {/*        rules={[{ required: true, message: 'Vui lòng nhập giá nhập!' }]}*/}
                    {/*    >*/}
                    {/*        <Input*/}
                    {/*            placeholder="Nhập giá nhập" />*/}
                    {/*    </Form.Item>*/}
                    {/*</Col>*/}
                    <Col span={12}>
                        <Form.Item
                            label={<Text strong>Giá bán</Text>}
                            name="price"
                            rules={[{ required: true, message: 'Vui lòng nhập giá bán!' }]}
                        >
                            <Input

                                placeholder="Nhập giá bán" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label={<Text strong>Hình ảnh</Text>}>
                            <Upload
                                beforeUpload={() => false}
                                onChange={handleImageUpload}
                                showUploadList={false}
                            >
                                <Button icon={<PlusOutlined />}>Chọn ảnh</Button>
                            </Upload>
                            {imageUrl && (
                                <img
                                    src={imageUrl}
                                    alt="Sản phẩm"
                                    style={{ width: '100px', height: 'auto', marginTop: '10px' ,marginLeft: '30px'}}
                                />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label={<Text strong>Trạng thái</Text>}
                            name="isDeleted"
                            rules={[{ required: true, message: 'Vui lòng chọn Trạng thái!' }]}
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

export default EditProductDetailModal;
