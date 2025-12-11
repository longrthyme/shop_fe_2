import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Popconfirm, Col, Space, Tooltip } from 'antd';
import { getAllBrands, createBrand, updateBrand, deleteBrand, searchBrands } from '../../service/admin/ApiBrands';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';

const { Option } = Select;

function Brands() {
    const [brands, setBrands] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentBrand, setCurrentBrand] = useState(null);
    const [selectedBrand, setSelectedBrand] = useState(null); // brand đang xem chi tiết
    const [isDetailOpen, setIsDetailOpen] = useState(false); // modal chi tiết
    const [form] = Form.useForm();
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
    const [sortBy, setSortBy] = useState('');

    useEffect(() => {
            fetchBrands(pagination.page, pagination.limit, sortBy);
        },
        [pagination.page, pagination.limit, sortBy]);

    const fetchBrands = async (page, limit, sortBy) => {
        try {
            const data = await getAllBrands(page, limit, sortBy);
            if (data && Array.isArray(data)) {
                setBrands(data);
                setPagination(prev => ({
                    ...prev,
                    total: data.totalItem || 0,
                }));
            } else {
                console.error('Dữ liệu trả về không phải là mảng', data);
                setBrands([]);
            }
        } catch (error) {
            message.error('Lỗi khi tải danh sách brands.');
        }
    };

    const searchData = async (event) => {
        const inputValue = event.target.value;
        try {
            const data = await searchBrands(0, pagination.limit, sortBy, inputValue);
            if (data && Array.isArray(data)) {
                console.log(data);

                setBrands(data);
                setPagination(prev => ({
                    ...prev,
                    total: data.totalItem || 0,
                }));
            }
            else {
                console.error('Dữ liệu trả về không phải là mảng', data);
                setBrands([]);
            }
        }
        catch (error) {
            message.error('Lỗi khi tải danh sách brands.');
        }
    };

    const handleCreate = () => {
        form.resetFields();
        setCurrentBrand(null);
        setIsModalOpen(true);
    };

    const handleEdit = (brand) => {
        setCurrentBrand(brand);
        form.setFieldsValue(brand);
        setIsModalOpen(true);
    };

    const handleDetail = (brand) => {
        setSelectedBrand(brand);
        setIsDetailOpen(true);
    };

    const handleDelete = async (brandId) => {
        try {
            await deleteBrand(brandId);
            message.success('Xóa brand thành công!');
            fetchBrands(pagination.page, pagination.limit, sortBy);
        } catch (error) {
            message.error('Lỗi khi xóa brand.');
        }
    };

    const handleSortChange = (value) => {
        setSortBy(value);
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const handleTableChange = (pagination, filters, sorter) => {
        setPagination(prev => ({
            ...prev,
            page: pagination.current,
            limit: pagination.pageSize,
        }));

        if (sorter.order) {
            setSortBy(sorter.order === 'ascend' ? 'NAME_ASC' : 'NAME_DESC');
        } else {
            setSortBy('');
        }
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            if (currentBrand) {
                await updateBrand(currentBrand.id, values);
                message.success('Cập nhật thương hiệu thành công!');
            } else {
                await createBrand(values);
                message.success('Thêm mới thương hiệu thành công!');

            }
            fetchBrands(pagination.page, pagination.limit, sortBy);
            setIsModalOpen(false);
        } catch (error) {
            console.log('Error object:', error);
            if (error.message) {
                message.error(error.message);
            } else if (error === 'Tên thương hiệu đã tồn tại.') {
                message.error('Tên thương hiệu đã tồn tại.');
            } else if (error === 'Tên không được chứa ký tự đặc biệt.') {
                message.error('Tên không được chứa ký tự đặc biệt.');
            } else {
                message.error('Vui lòng kiểm tra lại.');
            }
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const columns = [
        {
            title: 'STT',
            key: 'index',
            render: (text, record, index) => (pagination.page - 1) * pagination.limit + index + 1,
        },
        {
            title: 'Tên Thương Hiệu',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isDeleted',
            key: 'isDeleted',
            render: (isDeleted) => (isDeleted ? 'Ngừng hoạt động' : 'Đang hoạt động'),
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (text, record) => (
                <Space>
                    <Tooltip title="Xem chi tiết">
                        <Button
                            // type="text"
                            icon={<EyeOutlined />}
                            onClick={() => handleDetail(record)}
                        />
                    </Tooltip>

                    <Tooltip title="Sửa">
                        <Button
                            // type="text"
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(record)}
                        />
                    </Tooltip>

                    {/*<Popconfirm*/}
                    {/*    title="Bạn có chắc chắn muốn xóa thương hiệu này không?"*/}
                    {/*    onConfirm={() => handleDelete(record.id)}*/}
                    {/*    okText="Xóa"*/}
                    {/*    cancelText="Hủy"*/}
                    {/*>*/}
                    {/*    <Button*/}
                    {/*        type="text"*/}
                    {/*        icon={<DeleteOutlined />}*/}
                    {/*        danger*/}
                    {/*    />*/}
                    {/*</Popconfirm>*/}
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div className='d-flex'>
                <Button type="primary" onClick={handleCreate}>+</Button>
            </div><br/>
            <div className='col-sm-6'>
                <input className='form-control' placeholder='Tìm kiếm' onKeyUp={searchData}/>
            </div>
            {/*<Col span={4}>*/}
            {/*    <Select*/}
            {/*        defaultValue="sortBy"*/}
            {/*        style={{ width: '100%' }}*/}
            {/*        onChange={handleSortChange}*/}
            {/*    >*/}
            {/*        <Option value="NAME_ASC">Name A-Z</Option>*/}
            {/*        <Option value="NAME_DESC">Name Z-A</Option>*/}
            {/*        <Option value="CREATED_AT_DESC">Mới nhất</Option>*/}
            {/*        <Option value="CREATED_AT_ASC">Cũ nhất</Option>*/}
            {/*    </Select>*/}
            {/*</Col>*/}

            <Table
                columns={columns}
                dataSource={brands}
                rowKey="id"
                pagination={{
                    current: pagination.page,
                    pageSize: pagination.limit,
                    total: pagination.total,
                    showSizeChanger: true,
                }}
                onChange={handleTableChange}
            />

            {/* Modal tạo/sửa */}
            <Modal
                title={currentBrand ? "Chỉnh sửa Thương Hiệu" : "Tạo Thương Hiệu Mới"}
                open={isModalOpen}
                onOk={handleSubmit}
                onCancel={handleCancel}
                okText={currentBrand ? "Cập nhật" : "Thêm"}
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical" name="brandForm">
                    <Form.Item
                        name="name"
                        label="Tên Thương Hiệu"
                        rules={[
                            { required: true, message: 'Vui lòng nhập tên Thương Hiệu!' },
                            { pattern: /^[a-zA-Z0-9 ]+$/, message: 'Tên không được chứa ký tự đặc biệt' }
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Mô tả"
                    >
                        <Input />
                    </Form.Item>

                    {currentBrand && (
                        <Form.Item
                            name="isDeleted"
                            label="Trạng thái"
                            rules={[{ required: true, message: 'Vui lòng chọn trạng thái Thương Hiệu!' }]}
                        >
                            <Select>
                                <Option value={false}>Đang hoạt động</Option>
                                <Option value={true}>Ngừng hoạt động</Option>
                            </Select>
                        </Form.Item>
                    )}
                </Form>
            </Modal>

            {/* Modal chi tiết */}
            <Modal
                title="Chi tiết Thương Hiệu"
                open={isDetailOpen}
                footer={null}
                onCancel={() => setIsDetailOpen(false)}
            >
                {selectedBrand && (
                    <div>
                        <p><strong>Tên thương hiệu:</strong> {selectedBrand.name}</p>
                        <p><strong>Mô tả:</strong> {selectedBrand.description || 'Không có'}</p>
                        <p><strong>Trạng thái:</strong> {selectedBrand.isDeleted ? 'Ngừng hoạt động' : 'Đang hoạt động'}</p>
                    </div>
                )}
            </Modal>
        </div>
    );
}

export default Brands;
