import React, { useEffect } from 'react';
import {Modal, Form, Input, Button, Row, Col, Typography, Select, message, DatePicker} from 'antd';
import moment from "moment";

const { Title, Text } = Typography;
const { Option } = Select;

const CategoryEditModal = ({ visible, onCancel, item, onUpdate }) => {
    const [form] = Form.useForm();

    // Khi modal mở, gọi API lấy dữ liệu từ DB theo id và gán vào form
    useEffect(() => {
        console.log("Dữ liệu item:", item);
        if (visible && item) { // Nếu modal được mở và có dữ liệu
            form.setFieldsValue({
                name: item.name,
                type: item.type, // Gán giá trị cho dropdown thể loại
                description: item.description,
                code : item.code,
                discount: item.discount !== null && item.discount !== undefined
                    ? Number(item.discount)
                    : undefined,
                minTotal: item.minTotal ? Number(item.minTotal) : null,
                maxDiscount: item.maxDiscount !== undefined && item.maxDiscount !== null
                    ? String(item.maxDiscount)
                    : "",
                maxUsage: item.maxUsage ? Number(item.maxUsage) : null,
                startDate: item.startDate ? moment(item.startDate) : null, // Chuyển đổi sang moment
                endDate: item.endDate ? moment(item.endDate) : null,
                status : item.status,

            });
        }
    }, [visible, item, form]);

    const validateStartDate = (_, value) => {
        if (!value || moment(value).isSameOrAfter(moment(), 'day')) {
            return Promise.resolve();
        }
        return Promise.reject(new Error('Ngày bắt đầu không được là ngày đã qua!'));
    };

    // Hàm kiểm tra ngày kết thúc phải sau ngày bắt đầu
    const validateEndDate = (_, value) => {
        const startDate = form.getFieldValue('startDate');
        if (!value || moment(value).isAfter(startDate, 'day')) {
            return Promise.resolve();
        }
        return Promise.reject(new Error('Ngày kết thúc phải sau ngày bắt đầu!'));
    };
    const handleUpdate = () => {
        form
            .validateFields()
            .then((values) => {
                onUpdate({ ...values, id: item.id });
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    return (
        <Modal
            open={visible}
            title="Update Voucher"
            onCancel={onCancel}
            footer={[
                <Button key="back" onClick={onCancel}>
                    Hủy
                </Button>,
                <Button key="submit" type="primary" onClick={handleUpdate}>
                    Cập nhật
                </Button>,
            ]}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="name"
                    label="Tên Voucher"
                    rules={[{ required: true, message: 'Vui lòng nhập tên voucher!' }]} // Validate tên không được để trống
                >
                    <Input placeholder="Nhập tên voucher" />
                </Form.Item>

                <Form.Item
                    name="code"
                    label="Mã Voucher"
                    rules={[{ required: true, message: 'Vui lòng nhập mã voucher!' }]} // Validate mã không được để trống
                >
                    <Input placeholder="Nhập mã voucher" />
                </Form.Item>


                <Form.Item
                    name="minTotal"
                    label="Điều kiện áp dụng"
                    rules={[{ required: true, message: 'Vui lòng nhập số tiền tối thiểu!' }]} // Validate không được để trống
                >
                    <Input type="number" placeholder="Nhập số tiền tối thiểu" />
                </Form.Item>

                <Form.Item
                    name="status"
                    label="Trạng thái"
                    rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                >
                    <Select placeholder="Chọn trạng thái">
                        <Option value="INACTIVE">Ngừng Hoạt Động</Option>
                        <Option value="ACTIVE">Đang Hoạt Động</Option>
                        <Option value="Upcoming" disabled>Sắp Diễn Ra</Option>
                    </Select>
                </Form.Item>



                <Form.Item
                    name="discount"
                    label="Số Tiền Giảm Tối Đa"
                    rules={[
                        {
                            validator(_, value) {
                                if (value === undefined || value === null || value === "") {
                                    return Promise.reject(new Error("Vui lòng nhập số tiền giảm tối đa!"));
                                }
                                if (value < 1000) {
                                    return Promise.reject(new Error("Giảm tối đa phải lớn hơn hoặc bằng 1.000!"));
                                }
                                return Promise.resolve();
                            },
                        },
                    ]}                >
                    <Input type="number" placeholder="Nhập số tiền giảm tối đa" />
                </Form.Item>

                <Form.Item
                    name="maxUsage"
                    label="Số Lần Sử Dụng Tối Đa"
                    rules={[{ required: true, message: 'Vui lòng nhập số lần sử dụng tối đa!' }]} // Validate không được để trống
                >
                    <Input type="number" placeholder="Nhập số lần sử dụng tối đa" />
                </Form.Item>

                <Form.Item
                    name="startDate"
                    label="Ngày Bắt Đầu"
                    rules={[{ required: true, message: 'Vui lòng nhập ngày bắt đầu!' },

                    ]}
                >
                    <DatePicker
                        format="YYYY-MM-DD"
                        placeholder="Chọn ngày bắt đầu"
                    />
                </Form.Item>

                <Form.Item
                    name="endDate"
                    label="Ngày Kết Thúc"
                    rules={[{ required: true, message: 'Vui lòng nhập ngày kết thúc!' },

                    ]}
                >
                    <DatePicker
                        format="YYYY-MM-DD"
                        placeholder="Chọn ngày kết thúc"
                    />
                </Form.Item>


                <Form.Item
                    name="description"
                    label="Mô Tả"
                    rules={[
                        { max: 225, message: 'Mô tả không được vượt quá 225 ký tự!' } // Validate không quá 225 ký tự
                    ]}
                >
                    <Input.TextArea placeholder="Nhập mô tả" />
                </Form.Item>

                <Form.Item
                    name="type"
                    label="Kiểu"
                    rules={[{ required: true, message: 'Vui lòng chọn kiểu!' }]} // Validate kiểu không được để trống
                >
                    <Select placeholder="Chọn kiểu">
                        <Option value="percent">Giảm giá theo phần trăm</Option>
                        <Option value="money">Giảm giá theo số tiền</Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CategoryEditModal;
