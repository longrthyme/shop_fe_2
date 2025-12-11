import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Space, Tooltip, Select } from 'antd';
import { getAllSize, createSize, updateSize, deleteSize,searchSize } from '../../service/admin/ApiSize';
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

function Size() {
    const [sizes, setSizes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentSize, setCurrentSize] = useState(null);
    const [form] = Form.useForm();
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    useEffect(() => {
        fetchSize(pagination.page, pagination.limit);
    }, [pagination.page, pagination.limit]);
    const handleDetail = (record) => {
        console.log("Chi tiết size:", record);
        setCurrentSize(record); // dùng state currentSize sẵn có
        setIsDetailOpen(true);
    };


    const fetchSize = async (page, limit) => {
        try {
            const data = await getAllSize(page, limit, 'name');
            if (data?.content) {
                setSizes(data.content);
                setPagination(prev => ({ ...prev, total: data.totalElements }));
            } else if (Array.isArray(data)) {
                setSizes(data);
                setPagination(prev => ({ ...prev, total: data.length }));
            } else {
                setSizes([]);
                console.error("Dữ liệu không hợp lệ:", data);
            }
        } catch (error) {
            console.error(error);
            message.error('Lỗi khi tải danh sách sizes.');
        }
    };

    const searchData = async (event) => {
        const inputValue = event.target.value;
        try {
            const data = await searchSize(0, pagination.limit, 'name', inputValue);
            if (data?.content) {
                setSizes(data.content);
                setPagination(prev => ({ ...prev, total: data.totalElements }));
            } else if (Array.isArray(data)) {
                setSizes(data);
                setPagination(prev => ({ ...prev, total: data.length }));
            } else {
                setSizes([]);
                console.error("Dữ liệu không hợp lệ:", data);
            }
        } catch (error) {
            console.error(error);
            message.error('Lỗi khi tải danh sách sizes.');
        }
    };

    const handleCreate = () => {
        form.resetFields();
        form.setFieldsValue({ status: 1 }); // mặc định int = 1
        setCurrentSize(null);
        setIsModalOpen(true);
    };

    const handleEdit = (size) => {
        setCurrentSize(size);
        // Đảm bảo status là int
        form.setFieldsValue({ ...size, status: Number(size.status) });
        setIsModalOpen(true);
    };

    const confirmDelete = (sizeId) => {
        Modal.confirm({
            title: 'Bạn có chắc chắn muốn xóa?',
            content: 'Hành động này không thể hoàn tác.',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: () => handleDelete(sizeId),
        });
    };

    const handleDelete = async (sizeId) => {
        try {
            await deleteSize(sizeId);
            message.success('Xóa size thành công!');
            fetchSize(pagination.page, pagination.limit);
        } catch (error) {
            console.error(error);
            message.error('Lỗi khi xóa size.');
        }
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            values.status = Number(values.status); // ép kiểu int ở đây luôn

            if (currentSize) {
                await updateSize(currentSize.id, values);
                message.success('Cập nhật size thành công!');
            } else {
                await createSize(values);
                message.success('Tạo size mới thành công!');
            }

            fetchSize(pagination.page, pagination.limit);
            setIsModalOpen(false);
        } catch (error) {
            console.error(error);
            message.error('Có lỗi xảy ra.');
        }
    };


    const columns = [
        {
            title: 'STT',
            render: (_, __, index) => (pagination.page - 1) * pagination.limit + index + 1,
        },
        {
            title: 'Tên Kích Thước',
            dataIndex: 'name',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (status) => status === 1 ? 'Đang hoạt động' : 'Ngưng hoạt động'
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="Xem chi tiết">
                        <Button icon={<EyeOutlined />} onClick={() => handleDetail(record)} />
                    </Tooltip>
                    <Tooltip title="Sửa">
                        <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    </Tooltip>
                    {/*<Tooltip title="Xoá">*/}
                    {/*    <Button danger icon={<DeleteOutlined />} onClick={() => confirmDelete(record.id)} />*/}
                    {/*</Tooltip>*/}
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Button type="primary" onClick={handleCreate} style={{ marginBottom: 16 }}>
                +
            </Button>
            <div className='col-sm-6'>
                <input className='form-control' placeholder='Tìm kiếm' onKeyUp={searchData}/>
            </div>
            <Table
                columns={columns}
                dataSource={sizes}
                rowKey="id"
                pagination={{
                    current: pagination.page,
                    pageSize: pagination.limit,
                    total: pagination.total,
                    onChange: (page, pageSize) => {
                        setPagination({ ...pagination, page, limit: pageSize });
                    },
                }}
            />

            {/* Modal tạo/sửa */}
            <Modal
                title={currentSize ? "Chỉnh sửa Kích Thước" : "Tạo Kích Thước Mới"}
                open={isModalOpen}
                onOk={handleOk}

                okText={currentSize ? "Cập nhật" : "Thêm"}
                cancelText="Hủy"
                onCancel={() => setIsModalOpen(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Tên Kích Thước"
                        rules={[{ required: true, message: 'Vui lòng nhập tên Kích Thước!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="status"
                        label="Trạng Thái"
                        rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                    >
                        <Select>
                            <Select.Option value={1}>Đang hoạt động</Select.Option>
                            <Select.Option value={0}>Ngừng hoạt động</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Mô tả"
                        rules={[{ required: true, message: 'Vui lòng nhập mô tả Kích Thước!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal xem chi tiết */}
            <Modal
                title="Chi tiết Kích Thước"
                open={isDetailOpen}
                footer={null}
                onCancel={() => setIsDetailOpen(false)}
            >
                {currentSize && (
                    <div>
                        <p><strong>Tên Kích Thước:</strong> {currentSize.name}</p>
                        <p><strong>Trạng Thái:</strong> {currentSize.status === 1 ? 'Đang hoạt động' : 'Ngưng hoạt động'}</p>
                        <p><strong>Mô tả:</strong> {currentSize.description}</p>
                    </div>
                )}
            </Modal>
        </div>
    );
}

export default Size;
