import React, {useEffect, useState} from 'react';  // Thêm useState để quản lý state cho lỗi
import {Modal, Form, Input, Select, Button, InputNumber, Row, Col} from 'antd';

const {Option} = Select;

const ProductDetailAndUpdateModal = ({
                                         visible,
                                         onCancel,
                                         onUpdate,
                                         productData,
                                         categories,
                                         brands,
                                         materials,
                                         selectedTags,
                                         setSelectedTags,
                                         fetchProducts,
                                         pagination,
                                         setErrorMessages
                                     }) => {
    const [form] = Form.useForm();
    const [errorMessage, setErrorMessage] = useState('');  // State để lưu lỗi

    // Khi productData thay đổi, cập nhật giá trị form
    useEffect(() => {
        console.log("Product data:", productData); // Kiểm tra dữ liệu productData
        if (productData) {
            form.setFieldsValue({
                ...productData,
                brand: productData?.brand?.id,  // Gán giá trị ID cho brand
                category: productData?.category?.id,
                material_id: productData?.material?.id, // Gán giá trị ID cho category
                tagIds: productData?.tags?.map(tag => tag.id),
                create_at: productData.createAt ? new Date(productData.createAt).toLocaleString() : '',
                update_at: productData.updateAt ? new Date(productData.updateAt).toLocaleString() : ''
            });
            console.log('Product data loaded into modal:', productData);
            setSelectedTags(productData?.tags?.map(tag => tag.id));
        }
    }, [productData]);

    const handleFinish = async (values) => {
        console.log("Submitted values:", values); // Kiểm tra giá trị gửi đi trong handleFinish
        const updatedProduct = {
            ...values,
            id: productData?.id,  // Gán ID sản phẩm
            brandId: values.brand,  // Sử dụng giá trị brand ID
            categoryId: values.category,
            materialId: values.material_id,
            tagIds: selectedTags
        };
        try {
            await onUpdate(updatedProduct);  // Thực hiện cập nhật sản phẩm
            setErrorMessage('');  // Xóa lỗi nếu cập nhật thành công
        } catch (error) {
            if (error.response && error.response.data) {
                // Kiểm tra nếu lỗi từ backend là đối tượng có các trường cụ thể
                const backendErrors = error.response.data;
                console.error("Chi tiết lỗi từ backend:", backendErrors);

                // Nếu lỗi từ backend chỉ chứa message, gán toàn bộ message vào lỗi chung
                if (typeof backendErrors === 'string') {
                    setErrorMessages({general: backendErrors});
                } else {
                    setErrorMessages(backendErrors);  // Gán lỗi của từng trường
                }
            } else {
                setErrorMessages({general: 'Cập nhật sản phẩm thất bại'});
            }
        }
    };

    return (
        <Modal
            title="Chi tiết và Cập nhật sản phẩm"
            open={visible}
            onCancel={onCancel}
            footer={null}
            width={800} // Đặt chiều rộng hợp lý
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    id: productData?.id,
                    name: productData?.name,
                    category: productData?.category?.id,
                    brand: productData?.brand?.id,
                    discountPercent: productData?.discountPercent,
                    status: productData?.status,
                    description: productData?.description,
                    material_id: productData?.material_id,
                    create_at: productData?.create_at,
                    update_at: productData?.update_at,
                }}
                onFinish={handleFinish}
            >
                {/* Thông tin cơ bản */}
                <div style={{ marginBottom: '16px' }}>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item
                                label="Tên Sản Phẩm"
                                name="name"
                                rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Loại Sản Phẩm"
                                name="category"
                                rules={[{ required: true, message: 'Vui lòng chọn loại sản phẩm' }]}
                            >
                                <Select>
                                    {categories.map((category) => (
                                        <Option key={category.id} value={category.id}>
                                            {category.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item
                                label="Chất Liệu"
                                name="material_id"
                                rules={[{ required: true, message: 'Vui lòng chọn chất liệu' }]}
                            >
                                <Select>
                                    {materials.map((material) => (
                                        <Option key={material.id} value={material.id}>
                                            {material.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Thương Hiệu"
                                name="brand"
                                rules={[{ required: true, message: 'Vui lòng chọn thương hiệu' }]}
                            >
                                <Select>
                                    {brands.map((brand) => (
                                        <Option key={brand.id} value={brand.id}>
                                            {brand.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </div>

                {/* Trạng thái và mô tả */}
                <div style={{ marginBottom: '16px' }}>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item label="Trạng thái" name="status">
                                <Select>
                                    <Option value="ACTIVE">Đang hoạt động</Option>
                                    <Option value="INACTIVE">Ngừng hoạt động</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Mô tả" name="description">
                                <Input.TextArea rows={3} />
                            </Form.Item>
                        </Col>
                    </Row>
                </div>

                {/* Thông tin ngày tạo và ngày cập nhật */}
                <div style={{ marginBottom: '16px' }}>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item label="Ngày tạo" name="create_at">
                                <Input
                                    value={
                                        productData?.createAt
                                            ? new Date(productData.createAt).toLocaleDateString('vi-VN')
                                            : ''
                                    }
                                    readOnly
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Ngày cập nhật" name="update_at">
                                <Input
                                    value={
                                        productData?.updateAt
                                            ? new Date(productData.updateAt).toLocaleDateString('vi-VN')
                                            : ''
                                    }
                                    readOnly
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </div>

                {/* Nút hành động */}
                <div style={{ textAlign: 'right' }}>
                    <Button type="primary" htmlType="submit">
                        Cập nhật sản phẩm
                    </Button>
                </div>
            </Form>
        </Modal>

    );
};

export default ProductDetailAndUpdateModal;
