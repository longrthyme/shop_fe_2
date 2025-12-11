import React, { useState, useEffect } from 'react';
import {Space, Table, Button, Tooltip, message, Select, Row, Col, Modal} from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getUser,findUserById,updateUser,deleteUser,createUser} from '../../api/UserCtrlApi'; // Đổi API từ Category sang Color
import UserDetailModal from './UserDetailModal'; // Đổi tên modal
import UserEditModal from './UserEditModal'; // Đổi tên modal
import moment from 'moment';

const { Option } = Select;

const User = () => {
    const [data, setData] = useState([]);// dữ liệu
    const [loading, setLoading] = useState(true); // hiện thị
    const [totalItems, setTotalItems] = useState(0);// tổng số lượng màu
    const [currentPage, setCurrentPage] = useState(1);// trang hiện tại
    const [sortBy, setSortBy] = useState(""); // State for sorting
    const [selectedItem, setSelectedItem] = useState(null); // Mục đang được chọn
    const [isDetailVisible, setIsDetailVisible] = useState(false); // Modal xem chi tiết
    const [isEditVisible, setIsEditVisible] = useState(false); // Modal cập nhật
    const [isAddVisible, setIsAddVisible] = useState(false); // Modal thêm mới

    useEffect(() => {
        loadUser(currentPage, sortBy); // Load colors on initial render
    }, [currentPage, sortBy]); // Rerun effect on page or sort change

    // Load danh sách màu
    const loadUser = async (page, sortBy) => {
        try {
            setLoading(true);
            const data = await getUser(page, 10, sortBy,2); // Lấy danh sách màu từ API
            console.log("đây là data",data)
            const formattedData = data.map((item, index) => ({
                ...item,
                stt: (page - 1) * 10 + index + 1, // Tính STT dựa trên trang hiện tại và index
                key: item.id,
            }));
            setData(formattedData);
            setTotalItems(data.totalItem); // Cập nhật tổng số phần tử
        } catch (error) {
            message.error(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };


    //xử lý khi chuyển trang
    const handleTableChange = (pagination) => {
        setCurrentPage(pagination.current); // cập nhập currentPage
    };

    //xử lý khi thay đổi sắp xếp
    const handleSortChange = (value) => {
        setSortBy(value); // cập nhật sorting state
    };

    //hiển thị form khi add
    const showAddModal = () => {
        setSelectedItem(null); // Không có item nào được chọn khi thêm mới
        setIsAddVisible(true);
    };

    //hiện thị form khi update
    const showDetailModal = (item) => {
        setSelectedItem(item);
        setIsDetailVisible(true);
    };

    //hiển thị thông tin chi tiết
    const showEditModal = async (itemId) => {
         try {
             const data = await findUserById(itemId); // Gọi API để lấy dữ liệu
             setSelectedItem(data); // Lưu dữ liệu sau khi API thành công
             setIsEditVisible(true); // Chỉ mở modal khi API thành công
           } catch (error) {
             // Hiển thị thông báo lỗi nếu API thất bại
             message.error(`Error: ${error.message}`);
           }
    };

    // xử lý add hoặc update
    const handleUpdate = async (values, userId) => {
        //nếu có id => update
        if (userId) {
            // Chỉnh sửa
            try {
                await updateUser(values, userId);
                message.success('Cập nhật thành công!');
                loadUser(currentPage, sortBy);
            } catch (error) {
                if (error.response && error.response.status === 400 && error.response.data.message) {
                    message.error(error.response.data.message);
                } else {
                    message.error('Có lỗi xảy ra.');
                }
            }
            // nếu ko có id => thêm mới
        } else {
            // Thêm mới
            try {
                await createUser(values);
                message.success('Thêm màu thành công!');
                loadUser(currentPage, sortBy);
            } catch (error) {
                if (error.response && error.response.status === 400 && error.response.data.message) {
                    message.error(error.response.data.message);
                } else {
                    message.error('Có lỗi xảy ra.');
                }
            }
        }
    };

    //confirm trc khi xóa
    const confirmDelete = (colorId) => {
        Modal.confirm({
            title: 'Bạn có chắc chắn muốn xóa?',
            content: 'Hành động này không thể hoàn tác.',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: () => handleDelete(colorId),
        });
    };

    // Xử lý xóa màu
    const handleDelete = async (userId) => {
        try {
            await deleteUser(userId);
            message.success('Xóa user thành công!');

            // Tính lại số lượng phần tử còn lại
            const remainingItems = totalItems - 1;
            const lastPage = Math.ceil(remainingItems / 10); // Số trang cuối cùng

            // Kiểm tra nếu không còn dữ liệu ở trang hiện tại và trang hiện tại không phải là trang 1
            if (currentPage > lastPage) {
                setCurrentPage(lastPage); // Chuyển về trang trước đó
            } else {
                loadUser(currentPage, sortBy); // Tải lại danh sách màu nếu trang hiện tại vẫn còn
            }

        } catch (error) {
            if (error.response && error.response.status === 400 && error.response.data.message) {
                message.error(error.response.data.message); // Hiển thị lỗi tên thương hiệu đã tồn tại
            } else {
                message.error('Có lỗi xảy ra.');
            }
        }
    };


    const columns = [
        {
            title: 'STT',
            dataIndex: 'stt',
        },

        {
            title: 'Tên người dùng',
            dataIndex: 'fullName',
        },
        {
            title: 'Username',
            dataIndex: 'username',
        },
        // {
        //     title: 'Password',
        //     dataIndex: 'password',
        //     render: (password) => '*'.repeat(password.length),
        // },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
        },
        {
            title: 'SDT',
            dataIndex: 'phone',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isDeleted',
            key: 'isDeleted',
            render: (isDeleted) => (isDeleted ? 'Không hoạt động' : 'Đang Hoạt động'),
        },
        // {
        //     title: 'Ngày tạo',
        //     dataIndex: 'createAt',
        //     render: (createAt) => moment(createAt).format('DD/MM/YYYY HH:mm'), // Định dạng ngày giờ
        // },
        // {
        //     title: 'Ngày cập nhât',
        //     dataIndex: 'updateAt',
        //     render: (updateAt) => moment(updateAt).format('DD/MM/YYYY HH:mm'), // Định dạng ngày giờ
        //
        // },
        {
            title: 'Hành Động',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="Xem chi tiết">
                        <Button icon={<EyeOutlined />} onClick={() => showDetailModal(record)} />
                    </Tooltip>
                    <Tooltip title="Sửa">
                        <Button icon={<EditOutlined />} onClick={() => { showEditModal(record.id) }} />
                    </Tooltip>
                    {/*<Tooltip title="Xoá">*/}
                    {/*    <Button danger icon={<DeleteOutlined />} onClick={() => confirmDelete(record.id)}/>*/}
                    {/*</Tooltip>*/}
                </Space>
            ),
        }
    ];

    return (
        <div>
            <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
                <Col span={4}>
                    <Button type="primary" onClick={showAddModal}>Thêm mới</Button>
                </Col>
                {/*<Col span={4}>*/}
                {/*    /!*<Select*!/*/}
                {/*    /!*    defaultValue="Sắp xếp"*!/*/}
                {/*    /!*    style={{ width: '100%' }}*!/*/}
                {/*    /!*    onChange={handleSortChange}*!/*/}
                {/*    /!*>*!/*/}
                {/*    /!*    <Option value="NAME_ASC">Tên từ A-Z</Option>*!/*/}
                {/*    /!*    <Option value="NAME_DESC">Tên từ Z-A</Option>*!/*/}
                {/*    /!*    <Option value="CREATED_AT_DESC">Mới nhất</Option>*!/*/}
                {/*    /!*    <Option value="CREATED_AT_ASC">Cũ nhất</Option>*!/*/}
                {/*    /!*</Select>*!/*/}
                {/*</Col>*/}
            </Row>
            <Table
                columns={columns}
                dataSource={data}
                loading={loading}
                pagination={{
                    current: currentPage, // Trang hiện tại
                    pageSize: 10, // Kích thước trang
                    total: totalItems, // Tổng số mục
                }}
                onChange={handleTableChange}
            />


            {/*Modal xem chi tiết */}
            <UserDetailModal
                visible={isDetailVisible}
                onCancel={() => setIsDetailVisible(false)}
                item={selectedItem}
            />

            {/* Modal cập nhật */}
            <UserEditModal
                visible={isEditVisible}
                onCancel={() => setIsEditVisible(false)}
                item={selectedItem}
                onUpdate={handleUpdate}
            />

            {/* Modal thêm mới */}
            <UserEditModal
                visible={isAddVisible}
                onCancel={() => setIsAddVisible(false)}
                item={null}
                onUpdate={handleUpdate}
            />
        </div>
    );
}

export default User;