import React, { useState } from "react";
import {Modal, Form, Input, Button, Select, DatePicker, Row, Col, InputNumber, message} from "antd";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const { Option } = Select;

const VoucherAddModal = ({ visible, onCancel, onCreate }) => {
    const [form] = Form.useForm();
    const [discountUnit, setDiscountUnit] = useState("VND");
    const [loading, setLoading] = useState(false);
    const [selectedType, setSelectedType] = useState(null);
    const { confirm } = Modal;

    const handleConfirmCheckout = (onConfirm) => {
        confirm({
            title: 'Xác nhận tạo voucher',
            content: 'Bạn có chắc chắn muốn tạo voucher này?',
            okText: 'Xác nhận',
            cancelText: 'Hủy',
            onOk: () => {
                onConfirm(); // Gọi hàm `handleCheckout`
            },
            onCancel: () => {
                message.info('Hành động đã bị hủy.');
            },
        });
    };
    const handleOk = () => {
        setLoading(true); // Hiển thị trạng thái chờ
        form
            .validateFields()
            .then((values) => {
                onCreate(values);
                form.resetFields();
                onCancel();
            })
            .catch((info) => {
                console.log("Validate Failed:", info);
            })
            .finally(() => setLoading(false)); // Tắt trạng thái chờ
    };

    const validateStartDate = (_, value) => {
        if (!value) {
            return Promise.reject(new Error("Vui lòng chọn ngày bắt đầu!"));
        }

        // So sánh ngày được chọn với ngày hiện tại
        if (dayjs(value).isSameOrAfter(dayjs(), "day")) {
            return Promise.resolve(); // Giá trị hợp lệ nếu ngày bắt đầu là hôm nay hoặc tương lai
        }

        return Promise.reject(new Error("Ngày bắt đầu không được là ngày đã qua!"));
    };

    const validateEndDate = (_, value) => {
        const startDate = form.getFieldValue("startDate");

        if (!startDate) {
            return Promise.reject(new Error("Vui lòng chọn ngày bắt đầu trước!"));
        }

        if (!value) {
            return Promise.reject(new Error("Vui lòng chọn ngày kết thúc!"));
        }

        // Chỉ kiểm tra ngày (không so sánh giờ phút)
        if (dayjs(value).isSameOrAfter(dayjs(startDate), "day")) {
            return Promise.resolve(); // Hợp lệ
        }

        return Promise.reject(new Error("Ngày kết thúc phải sau hoặc bằng ngày bắt đầu!"));
    };

    const handleTypeChange = (value) => {
        const unit = value === "percent" ? "%" : "VND";
        setSelectedType(value);
        setDiscountUnit(unit);
        form.setFieldsValue({ discount: null }); // Reset giá trị giảm khi thay đổi kiểu
    };

    return (
        <Modal
            open={visible}
            title="Thêm Phiếu Giảm Giá"
            onCancel={() => Promise.resolve(onCancel())}
            footer={[
                <Button key="back" onClick={() => Promise.resolve(onCancel())}>
                    Hủy
                </Button>,
                <Button key="submit" type="primary"  onClick={() => handleConfirmCheckout(handleOk)} loading={loading}>
                    Thêm mới
                </Button>,
            ]}
        >
            <Form form={form} layout="vertical">
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="name"
                            label="Tên Phiếu"
                            rules={[{ required: true, message: "Vui lòng nhập tên voucher!" }]}
                        >
                            <Input type="text" placeholder="Nhập tên voucher" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="type"
                            label="Loại giảm giá"
                            rules={[{ required: true, message: "Vui lòng chọn kiểu!" }]}
                        >
                            <Select placeholder="Chọn loại phiếu" onChange={handleTypeChange}>
                                <Option value="money">Giảm giá theo số tiền</Option>
                                <Option value="percent">Giảm giá theo phần trăm</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="minTotal"
                            label="Điều kiện áp dụng"
                            rules={[
                                { required: true, message: "Vui lòng nhập điều kiện áp dụng!" },
                                {
                                    validator(_, value) {
                                        if (!value || value < 0) {
                                            return Promise.reject(
                                                new Error("Điều kiện áp dụng phải trên 0!")
                                            );
                                        }
                                        return Promise.resolve();
                                    },
                                },
                            ]}
                        >
                            {/*<Input type="number" placeholder="Nhập số tiền tối thiểu" />*/}
                            <InputNumber min={0} formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                         parser={(value) => value.replace(/(,*)/g, '')}
                                         placeholder="Nhập số tiền tối thiểu" style={{ marginRight: '10px', width: '100%' }} />
                        </Form.Item>
                    </Col>

                    {
                        selectedType !== "money" &&
                        <Col span={12}>
                            <Form.Item
                                name="maxDiscount"
                                label="Giảm Tối Đa"
                                rules={[
                                    { required: true, message: "Vui lòng nhập số tiền giảm tối đa!" },
                                    {
                                        validator(_, value) {
                                            if (!value || value < 1000) {
                                                return Promise.reject(
                                                    new Error("Giảm tối đa phải lớn hơn hoặc bằng 1.000!")
                                                );
                                            }
                                            return Promise.resolve();
                                        },
                                    },
                                ]}
                            >
                                {/*<Input type="number" placeholder="Số tiền giảm tối đa" />*/}
                                <InputNumber min={0} formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                             parser={(value) => value.replace(/(,*)/g, '')}
                                             placeholder="Số tiền giảm tối đa" style={{ marginRight: '10px', width: '100%' }} />
                            </Form.Item>
                        </Col>

                    }
                  </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="discount"
                            label={`Giá trị giảm (${discountUnit})`}
                            rules={[
                                { required: true, message: `Vui lòng nhập giá trị giảm bằng ${discountUnit}!` },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        const type = getFieldValue("type");
                                        const minTotal = parseFloat(getFieldValue("minTotal"));
                                        const discountValue = parseFloat(value);
                                        const maxDiscount = parseFloat(getFieldValue("maxDiscount"));

                                        if (discountValue < 0) {
                                            return Promise.reject(
                                                new Error("Giá trị giảm không được là số âm!")
                                            );
                                        }


                                        if (type === "money" && discountValue > minTotal) {
                                            return Promise.reject(
                                                new Error("Số tiền giảm phải nhỏ hơn số tiền tối thiểu của đơn hàng!")
                                            );
                                        }

                                        if (discountValue > maxDiscount) {
                                            return Promise.reject(
                                                new Error("Số tiền giảm không được lớn hơn giá trị giảm tối đa!")
                                            );
                                        }

                                        if (type === "percent" && discountValue < 1) {
                                            return Promise.reject(
                                                new Error("Giá trị giảm phần trăm tối thiểu là 1%")
                                            );
                                        }

                                        if (type === "percent" && discountValue > 100) {
                                            return Promise.reject(
                                                new Error("Giá trị giảm phần trăm không được lớn hơn 100%")
                                            );
                                        }

                                        if (type === "money" && discountValue < 1000) {
                                            return Promise.reject(
                                                new Error("Giá trị giảm tối thiểu là 1000 VND")
                                            );
                                        }

                                        return Promise.resolve();
                                    },
                                }),
                            ]}
                        >
                            {/*<Input type="number" placeholder={`Nhập giá trị giảm (${discountUnit})`} />*/}
                            <InputNumber min={0} formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                         parser={(value) => value.replace(/(,*)/g, '')}
                                         placeholder={`Nhập giá trị giảm (${discountUnit})`}
                                         style={{ marginRight: '10px', width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="maxUsage"
                            label="Số Lượng Phiếu"
                            rules={[
                                { required: true, message: "Vui lòng nhập số lần sử dụng tối đa!" },
                                {
                                    validator(_, value) {
                                        if (!value || value < 1) {
                                            return Promise.reject(
                                                new Error("Số lượng tối thiểu là 1!")
                                            );
                                        }
                                        return Promise.resolve();
                                    },
                                },
                            ]}
                        >
                            <Input type="number" placeholder="Nhập số lần sử dụng tối đa" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="startDate"
                            label="Ngày Giờ Bắt Đầu"
                            rules={[
                                { required: true, message: "Vui lòng chọn ngày giờ bắt đầu!" },
                                { validator: validateStartDate },
                            ]}
                        >
                            <DatePicker
                                showTime={{ format: "HH:mm" }}
                                format="YYYY-MM-DD HH:mm"
                                placeholder="Chọn ngày giờ bắt đầu"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="endDate"
                            label="Ngày Giờ Kết Thúc"
                            rules={[
                                { required: true, message: "Vui lòng chọn ngày giờ kết thúc!" },
                                { validator: validateEndDate },
                            ]}
                        >
                            <DatePicker
                                showTime={{ format: "HH:mm" }}
                                format="YYYY-MM-DD HH:mm"
                                placeholder="Chọn ngày giờ kết thúc"
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    name="description"
                    label="Mô Tả"
                    rules={[{ max: 225, message: "Mô tả không được vượt quá 225 ký tự!" }]}
                >
                    <Input.TextArea placeholder="Nhập mô tả" rows={3} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default VoucherAddModal;
