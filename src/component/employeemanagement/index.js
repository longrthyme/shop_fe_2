import React, { useState, useEffect } from 'react';
import { Space, Table, Button, Tooltip, message, Select, Row, Col, Modal } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getAllEmployee, findEmployeeById, updateEmployee, deleteEmployee, createEmployee } from '../../api/EmployeeApi';
import EmployeeDetailModal from './EmployeeDetailModal';
import EmployeeEditModal from './EmployeeEditModal';

const { Option } = Select;

const Employee = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState("");
    const [selectedItem, setSelectedItem] = useState(null);
    const [isDetailVisible, setIsDetailVisible] = useState(false);
    const [isEditVisible, setIsEditVisible] = useState(false);

    useEffect(() => {
        loadEmployee(currentPage, sortBy);
    }, [currentPage, sortBy]);

    const loadEmployee = async (page, sortBy) => {
        try {
            setLoading(true);
            const data = await getAllEmployee(page, 10, sortBy, 4);
            setData(data.map((item, index) => ({ ...item, stt: (page - 1) * 10 + index + 1, key: item.id })));
            setTotalItems(data.totalItem);
        } catch (error) {
            message.error(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleTableChange = (pagination) => {
        setCurrentPage(pagination.current);
    };

    const handleSortChange = (value) => {
        setSortBy(value);
    };

    const showAddModal = () => {
        setSelectedItem(null);
        setIsEditVisible(true);
    };

    const showDetailModal = (item) => {
        setSelectedItem(item);
        setIsDetailVisible(true);
    };

    const showEditModal = async (itemId) => {
        try {
            const data = await findEmployeeById(itemId);
            setSelectedItem(data);
            setIsEditVisible(true);
        } catch (error) {
            message.error(`Error: ${error.message}`);
        }
    };

    const handleUpdate = async (values, employeeId) => {
        try {
            if (employeeId) {
                await updateEmployee(values, employeeId);
                message.success('Cập nhật thành công!');
            } else {
                await createEmployee(values);
                message.success('Thêm mới nhân viên thành công!');
            }
            loadEmployee(currentPage, sortBy); // Tải lại danh sách nhân viên
            setIsEditVisible(false); // Đóng modal sau khi thêm mới hoặc cập nhật thành công
        } catch (error) {
            message.error(error.response?.data?.message || 'Có lỗi xảy ra.');
        }
    };


    const confirmDelete = (employeeId) => {
        Modal.confirm({
            title: 'Bạn có chắc chắn muốn xóa?',
            content: 'Hành động này không thể hoàn tác.',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: () => handleDelete(employeeId),
        });
    };

    const handleDelete = async (employeeId) => {
        try {
            await deleteEmployee(employeeId);
            message.success('Xóa nhân viên thành công!');
            loadEmployee(currentPage, sortBy);
        } catch (error) {
            message.error(error.response?.data?.message || 'Có lỗi xảy ra.');
        }
    };

    const columns = [
        { title: 'STT', dataIndex: 'stt' },
        { title: 'Tên nhân viên', dataIndex: 'fullName' },
        { title: 'Tên người dùng', dataIndex: 'username' },
        {
            title: 'Ảnh',
            dataIndex: 'avatarUrl',
            render: (avatarUrl) => (
                <img
                    src={avatarUrl}
                    alt="avatar"
                    style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                />
            ),
        },
        { title: 'Email', dataIndex: 'email' },
        { title: 'SĐT', dataIndex: 'phone' },
        { title: 'Địa chỉ', dataIndex: 'address' },
        {
            title: 'Trạng thái',
            dataIndex: 'isDeleted',
            render: (isDeleted) => (isDeleted ? 'Không hoạt động' : 'Đang hoạt động'),
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="Xem chi tiết">
                        <Button icon={<EyeOutlined />} onClick={() => showDetailModal(record)} />
                    </Tooltip>
                    <Tooltip title="Sửa">
                        <Button icon={<EditOutlined />} onClick={() => showEditModal(record.id)} />
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
            <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
                <Col span={4}>
                    <Button type="primary" onClick={showAddModal}>Thêm mới</Button>
                </Col>
                <Col span={4}>
                    <Select defaultValue="Sắp xếp" style={{ width: '100%' }} onChange={handleSortChange}>
                        <Option value="NAME_ASC">Tên từ A-Z</Option>
                        <Option value="NAME_DESC">Tên từ Z-A</Option>
                        <Option value="CREATED_AT_DESC">Mới nhất</Option>
                        <Option value="CREATED_AT_ASC">Cũ nhất</Option>
                    </Select>
                </Col>
            </Row>
            <Table
                columns={columns}
                dataSource={data}
                loading={loading}
                pagination={{ current: currentPage, pageSize: 10, total: totalItems }}
                onChange={handleTableChange}
            />
            <EmployeeDetailModal visible={isDetailVisible} onCancel={() => setIsDetailVisible(false)} item={selectedItem} />
            <EmployeeEditModal visible={isEditVisible} onCancel={() => setIsEditVisible(false)} item={selectedItem} onUpdate={handleUpdate} />
        </div>
    );
}

export default Employee;
