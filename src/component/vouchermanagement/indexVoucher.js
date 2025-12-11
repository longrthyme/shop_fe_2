import React, { useState, useEffect } from 'react';
import {Space, Table, Button, Tooltip, message, Select, Input, Row, Col, Tag, Pagination, Modal} from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined  } from '@ant-design/icons';
import VoucherDetailModal from './detailModal';
import VoucherAddModal from './addModal';
import VoucherUpdate from "./editModal";
import VoucherDeleteModal from "./DeleteModal";
import moment from 'moment';
import { getVoucher, findVoucherById, updateVoucher ,createVoucher, deleteVoucher } from '../../api/VoucherApi';
import {FaTimes} from "react-icons/fa"; // Import API

const { Search } = Input;
const { Option } = Select;

const Voucher = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState("");
    const [selectedItem, setSelectedItem] = useState(null); // Mục đang được chọn
    const [isAddVisible, setIsAddVisible] = useState(false); // State for "Thêm Mới" modal
    const [isDetailVisible, setIsDetailVisible] = useState(false); // Modal xem chi tiết
    const [isEditVisible, setIsEditVisible] = useState(false); // Modal cập nhật
    const [isDeleteVisible, setIsDeleteVisible] = useState(false); // State cho modal xóa
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 10;

    const loadCategories = async (page, sortBy) => {
        try {
            setLoading(true);
            const response = await getVoucher(page, 10, sortBy); // API trả về dữ liệu phân trang

            console.log("Response:", response); // Log toàn bộ response để kiểm tra

            // Truy cập các thuộc tính trực tiếp từ response
            const { result, totalItem, totalPages, size } = response; // Không cần pagination nữa

            // Sắp xếp các voucher có trạng thái "ACTIVE" và "UPCOMING" lên đầu
            const sortedData = result.sort((a, b) => {
                // Kiểm tra trạng thái của mỗi voucher và sắp xếp sao cho ACTIVE và UPCOMING lên đầu
                if (a.status === 'Upcoming' || a.status === 'ACTIVE' && b.status !== 'ACTIVE' || b.status !=='Upcoming') return -1;


                return 0; // Giữ nguyên vị trí nếu cả 2 voucher đều có trạng thái giống nhau
            });

            const formattedData = sortedData.map((item, index) => ({
                ...item,
                stt: (page - 1) * size + index + 1, // Tính STT dựa trên trang hiện tại và index
                key: item.id,
            }));

            setData(formattedData);
            setTotalItems(totalItem); // Sử dụng totalItem từ response
            setTotalPages(totalPages); // Sử dụng totalPages từ response
            setCurrentPage(page);

        } catch (error) {
            message.error(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };



    useEffect(() => {
        // Giả lập API gọi và cập nhật dữ liệu cho trang hiện tại
        const fetchData = async () => {
            const result = await fetch(`/api/data?page=${currentPage}&size=${pageSize}&sortBy=${sortBy}`);
            const data = await result.json();
            setData(data.result);
            setTotalItems(data.totalItem); // Cập nhật tổng số item
        };

        fetchData();
    }, [currentPage]); // Cập nhật dữ liệu khi currentPage thay đổi

    const goToPage = (page) => {
        setCurrentPage(page); // Cập nhật trang khi người dùng chuyển trang
    };
    // Now call goToPage after loadCategories is initialized
    useEffect(() => {
        loadCategories(currentPage, sortBy);
    }, [currentPage, sortBy]);



    // const handleTableChange = (pagination) => {
    //     setCurrentPage(pagination.current); // cập nhật currentPage
    // };
    const handleSortChange = (value) => {
        console.log("Selected sort option:", value); // Kiểm tra giá trị nhận được
        setSortBy(value);
        loadCategories(currentPage, value);
    };


    // const handleSortChange = (value) => {
    //     setSortBy(value); // cập nhật sorting state
    //
    // };

    const showAddModal = async () => {
        setIsAddVisible(true);
    };

    const handleCreate = async (newCategory) => {
        return new Promise(async (resolve, reject) => {
            try {
                await createVoucher(newCategory);
                message.success('Thêm mới thành công!');
                setCurrentPage(1);
                await loadCategories(currentPage, sortBy);
                resolve(); // Hoàn tất
            } catch (error) {
                message.error('Có lỗi xảy ra.');
                reject(error); // Gửi lỗi ra ngoài
            }
        });
    };



    const showEditModal = async (itemId) => {
        try {
            const data = await findVoucherById(itemId); // Gọi API để lấy dữ liệu
            console.log("Dữ liệu từ API:", data);
            setSelectedItem(data);
            setIsEditVisible(true);
        } catch (error) {
            console.log("Error:", error);
        }
    };

    const handleUpdate = async (updatedValues) => {
        try {



            await updateVoucher(selectedItem.id, updatedValues);
            setCurrentPage(1);
            setIsEditVisible(false);
            message.success('Cập nhật thành công!');
            await loadCategories(currentPage, sortBy);
        } catch (error) {
            if (error.response && error.response.status === 400) {
                const errorMessage = error.response.data.message;
                if (errorMessage) {
                    message.error(errorMessage);
                } else {
                    const l = error.message;
                    message.error(l);
                }
            } else {
                const l = error.message;
                message.error(l);
            }
        }
    };

    const showDeleteModal = (itemId) => {
        setSelectedItem(itemId);
        setIsDeleteVisible(true);
    };

    const handleDelete = async () => {
        try {
            await deleteVoucher(selectedItem.id);
            message.success('Kết thúc voucher thành công!');
            setIsDeleteVisible(false);
            await loadCategories(currentPage, sortBy);
        } catch (error) {
            message.error(error);
        }
    };

    const columns = [
        {
            title: 'STT',
            dataIndex: 'stt',
            render: (_, __, index) => index + 1,
        },
        {
            title: 'Tên Phiếu',
            dataIndex: 'name',
        },
        {
            title: 'Mã Phiếu',
            dataIndex: 'code',
        },
        {
            title: 'Giá Trị Giảm',
            dataIndex: 'discount',
        },
        {
            title: 'Số Lượng',
            dataIndex: 'maxUsage',
        },
        // {
        //     title: 'Giá Trị Tối Thiểu',
        //     dataIndex: 'minTotal',
        // },
        {
            title: 'Loại Phiếu',
            dataIndex: 'type',
            render: (type) => {
                return type === 'money' ? 'Tiền Mặt' : 'Phần Trăm';
            }
        },
        // {
        //     title: 'Ngày Bắt Đầu',
        //     dataIndex: 'startDate',
        //     render: (startDate) => moment(startDate).format('DD/MM/YYYY HH:mm'),
        // },
        // {
        //     title: 'Ngày Kết Thúc',
        //     dataIndex: 'endDate',
        //     render: (endDate) => moment(endDate).format('DD/MM/YYYY HH:mm'),
        // },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (status) => {
                let color;
                let text;

                if (status === 'Upcoming') {
                    color = 'geekblue';
                    text = 'Sắp diễn ra';
                } else if (status === 'ACTIVE') {
                    color = 'green';
                    text = 'Đang diễn ra';
                } else if (status === 'INACTIVE') {
                    color = 'red';
                    text = 'Đã kết thúc';
                } else if (status === 'OUT_OF_STOCK') {
                    color = 'yellow';
                    text = 'Đã kết thúc';
                } else {
                    color = 'gray';
                    text = 'Trạng thái không xác định';
                }

                return <Tag color={color}>{text}</Tag>;
            },
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title=" Kết thúc ">
                        <Button danger icon={<FaTimes />} onClick={() => showDeleteModal(record)} />
                    </Tooltip>
                    <Tooltip title=" Cập nhật">
                        <Button danger icon={<EditOutlined />} onClick={() => showEditModal(record.id)} />
                    </Tooltip>
                </Space>
            ),
        }
    ];

    return (
        <div>
            <Row gutter={[16, 16]} style={{marginBottom: '16px'}} justify="space-between">
                <Col span={6}>
                    <Button type="primary" onClick={showAddModal}>
                        +
                    </Button>
                    {/*<Button*/}
                    {/*    type="primary"*/}
                    {/*    style={{width: '100%'}}*/}
                    {/*    icon={<PlusOutlined/>}*/}
                    {/*    onClick={() => showAddModal()}*/}
                    {/*    // onClick={() => handleConfirmCheckout(showAddModal())}*/}
                    {/*>*/}
                    {/*    +*/}
                    {/*</Button>*/}
                </Col>
                {/*<Col span={6}>*/}
                {/*    <Select*/}
                {/*        defaultValue="Sắp xếp"*/}
                {/*        style={{width: '100%'}}*/}
                {/*        onChange={handleSortChange}*/}
                {/*    >*/}
                {/*        <Option value="NAME_ASC">Tên từ A-Z</Option>*/}
                {/*        <Option value="CREATED_AT_DESC">Mới nhất</Option>*/}
                {/*        <Option value="CREATED_AT_ASC">Cũ nhất</Option>*/}
                {/*    </Select>*/}
                {/*</Col>*/}
            </Row>


                <Table
                    columns={columns} // Định nghĩa các cột của bảng
                    dataSource={data} // Dữ liệu cho bảng
                    pagination={false}
                    // Tắt phân trang trong bảng (để sử dụng Pagination bên ngoài)
                />

            <Pagination
                current={currentPage}  // Trang hiện tại
                total={totalItems}  // Tổng số item
                pageSize={pageSize}  // Số lượng item mỗi trang
                onChange={goToPage}  // Gọi goToPage khi người dùng thay đổi trang
                showSizeChanger={false}  // Tắt thay đổi kích thước trang
                hideOnSinglePage={false}  // Hiển thị phân trang dù chỉ có 1 trang
            />



            <VoucherAddModal
                visible={isAddVisible}
                onCancel={() => setIsAddVisible(false)}
                onCreate={handleCreate}
            />

            <VoucherDetailModal
                visible={isDetailVisible}
                onCancel={() => setIsDetailVisible(false)}
                selectedItem={selectedItem}
            />

            <VoucherUpdate
                visible={isEditVisible}
                onCancel={() => setIsEditVisible(false)}
                item={selectedItem}
                onUpdate={handleUpdate}
            />

            <VoucherDeleteModal
                visible={isDeleteVisible}
                onCancel={() => setIsDeleteVisible(false)}
                onDelete={handleDelete}
            />
        </div>
    );
};

export default Voucher;
// import React, { useState, useEffect } from 'react';
// import { Space, Table, Button, Tooltip, message, Select, Row, Col, Tag, Pagination } from 'antd';
// import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
// import VoucherAddModal from './addModal';
// import VoucherDetailModal from './detailModal';
// import VoucherUpdate from './editModal';
// import VoucherDeleteModal from './DeleteModal';
// import moment from 'moment';
// import { getVoucher, findVoucherById, updateVoucher, createVoucher, deleteVoucher } from '../../api/VoucherApi';
// import { FaTimes } from 'react-icons/fa'; // Import API
//
// const { Option } = Select;
//
// const Voucher = () => {
//     const [data, setData] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [totalItems, setTotalItems] = useState(0);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [sortBy, setSortBy] = useState('');
//     const [selectedItem, setSelectedItem] = useState(null);
//     const [isAddVisible, setIsAddVisible] = useState(false);
//     const [isEditVisible, setIsEditVisible] = useState(false);
//     const [isDeleteVisible, setIsDeleteVisible] = useState(false);
//     const pageSize = 10;
//
//     const loadCategories = async (page, sortBy) => {
//         try {
//             setLoading(true);
//             const response = await getVoucher(page, pageSize, sortBy); // Fetch data from API with pagination
//
//             const { result, totalItem, totalPages } = response;
//
//             // Sort vouchers based on status
//
//             const sortedData = result.sort((a, b) => {
//                 if (sortBy === "NAME_ASC") {
//                     return a.name.localeCompare(b.name); // Sắp xếp theo tên
//                 } else if (sortBy === "CREATED_AT_DESC") {
//                     // Sắp xếp theo ngày tạo từ mới nhất đến cũ nhất (giảm dần)
//                     return new Date(b.createdAt) - new Date(a.createdAt);
//                 } else if (sortBy === "CREATED_AT_ASC") {
//                     // Sắp xếp theo ngày tạo từ cũ nhất đến mới nhất (tăng dần)
//                     return new Date(a.createdAt) - new Date(b.createdAt);
//                 }
//                 return 0;
//             });
//             const formattedData = sortedData.map((item, index) => ({
//                 ...item,
//                 stt: (page - 1) * pageSize + index + 1, // Calculate STT based on current page
//                 key: item.id,
//             }));
//
//             setData(formattedData);
//             setTotalItems(totalItem);
//             setCurrentPage(page);
//         } catch (error) {
//             message.error(`Error: ${error.message}`);
//         } finally {
//             setLoading(false);
//         }
//     };
//
//
//
//     useEffect(() => {
//         // Giả lập API gọi và cập nhật dữ liệu cho trang hiện tại
//         const fetchData = async () => {
//             const result = await fetch(`/api/data?page=${currentPage}&size=${pageSize}`);
//             const data = await result.json();
//             setData(data.result);
//             setTotalItems(data.totalItem); // Cập nhật tổng số item
//         };
//
//         fetchData();
//     }, [currentPage]); // Cập nhật dữ liệu khi currentPage thay đổi
//
//     // const goToPage = (page) => {
//     //     setCurrentPage(page); // Cập nhật trang khi người dùng chuyển trang
//     // };
//     // Now call goToPage after loadCategories is initialized
//     useEffect(() => {
//         loadCategories(currentPage, sortBy);
//     }, [currentPage, sortBy]);
//
//     const handleSortChange = (value) => {
//         setSortBy(value);
//         loadCategories(currentPage, value);
//     };
//
//     const handleTableChange = (pagination) => {
//         setCurrentPage(pagination.current); // Update currentPage on page change
//     };
//
//     const goToPage = (page) => {
//         setCurrentPage(page); // Update currentPage when user changes page
//     };
//
//     const showAddModal = () => setIsAddVisible(true);
//
//     const handleCreate = async (newCategory) => {
//         try {
//             await createVoucher(newCategory);
//             message.success('Thêm mới thành công!');
//             setCurrentPage(1); // Reset to first page after adding
//             loadCategories(1, sortBy);
//         } catch (error) {
//             message.error('Có lỗi xảy ra.');
//         }
//     };
//
//     const showEditModal = async (itemId) => {
//         const data = await findVoucherById(itemId);
//         setSelectedItem(data);
//         setIsEditVisible(true);
//     };
//
//     const handleUpdate = async (updatedValues) => {
//         try {
//             await updateVoucher(selectedItem.id, updatedValues);
//             message.success('Cập nhật thành công!');
//             loadCategories(currentPage, sortBy);
//         } catch (error) {
//             message.error('Lỗi khi cập nhật.');
//         }
//     };
//
//     const showDeleteModal = (itemId) => {
//         setSelectedItem(itemId);
//         setIsDeleteVisible(true);
//     };
//
//     const handleDelete = async () => {
//         try {
//             await deleteVoucher(selectedItem.id);
//             message.success('Kết thúc voucher thành công!');
//             loadCategories(currentPage, sortBy);
//             setIsDeleteVisible(false);
//         } catch (error) {
//             message.error('Lỗi khi xóa.');
//         }
//     };
//
//     const columns = [
//         { title: 'Tên Phiếu', dataIndex: 'name' },
//         { title: 'Mã Phiếu', dataIndex: 'code' },
//         { title: 'Giá Trị Giảm', dataIndex: 'discount' },
//         { title: 'Số Lượng', dataIndex: 'maxUsage' },
//         { title: 'Giá Trị Tối Thiểu', dataIndex: 'minTotal' },
//         { title: 'Loại Phiếu', dataIndex: 'type', render: (type) => (type === 'money' ? 'Tiền Mặt' : 'Phần Trăm') },
//         { title: 'Ngày Bắt Đầu', dataIndex: 'startDate', render: (startDate) => moment(startDate).format('DD/MM/YYYY HH:mm') },
//         { title: 'Ngày Kết Thúc', dataIndex: 'endDate', render: (endDate) => moment(endDate).format('DD/MM/YYYY HH:mm') },
//         { title: 'Trạng thái', dataIndex: 'status', render: (status) => {
//                 const colors = { 'Upcoming': 'geekblue', 'ACTIVE': 'green', 'INACTIVE': 'red', 'OUT_OF_STOCK': 'yellow' };
//                 const texts = { 'Upcoming': 'Sắp diễn ra', 'ACTIVE': 'Đang Hoạt Động', 'INACTIVE': 'Đã kết thúc', 'OUT_OF_STOCK': 'Hết Lượt Sử Dụng' };
//                 return <Tag color={colors[status] || 'gray'}>{texts[status] || 'Trạng thái không xác định'}</Tag>;
//             }},
//         {
//             title: 'Action', key: 'action', render: (_, record) => (
//                 <Space size="middle">
//                     <Tooltip title=" Kết thúc ">
//                         <Button danger icon={<FaTimes />} onClick={() => showDeleteModal(record)} />
//                     </Tooltip>
//                     <Tooltip title=" Cập nhật">
//                         <Button danger icon={<EditOutlined />} onClick={() => showEditModal(record.id)} />
//                     </Tooltip>
//                 </Space>
//             ),
//         },
//     ];
//
//     return (
//         <div>
//             <Row gutter={[16, 16]} style={{ marginBottom: '16px' }} justify="space-between">
//                 <Col span={6}>
//                     <Button
//                         type="primary"
//                         style={{ width: '100%' }}
//                         icon={<PlusOutlined />}
//                         onClick={showAddModal}
//                     >
//                         Thêm mới
//                     </Button>
//                 </Col>
//                 <Col span={6}>
//                     <Select
//                         defaultValue="Sắp xếp"
//                         style={{ width: '100%' }}
//                         onChange={handleSortChange}
//                     >
//                         <Option value="NAME_ASC">Tên từ A-Z</Option>
//                         <Option value="CREATED_AT_DESC">Mới nhất</Option>
//                         <Option value="CREATED_AT_ASC">Cũ nhất</Option>
//                     </Select>
//                 </Col>
//             </Row>
//
//             <Table
//                 columns={columns}
//                 dataSource={data}
//                 pagination={false}
//                 onChange={handleTableChange}
//                 loading={loading}
//             />
//
//             <Pagination
//                 current={currentPage}
//                 total={totalItems}
//                 pageSize={pageSize}
//                 onChange={goToPage}
//                 showSizeChanger={false}
//                 hideOnSinglePage={false}
//             />
//
//             <VoucherAddModal
//                 visible={isAddVisible}
//                 onCancel={() => setIsAddVisible(false)}
//                 onCreate={handleCreate}
//             />
//
//             {/*<VoucherDetailModal*/}
//             {/*    visible={isDetailVisible}*/}
//             {/*    onCancel={() => setIsDetailVisible(false)}*/}
//             {/*    selectedItem={selectedItem}*/}
//             {/*/>*/}
//
//             <VoucherUpdate
//                 visible={isEditVisible}
//                 onCancel={() => setIsEditVisible(false)}
//                 item={selectedItem}
//                 onUpdate={handleUpdate}
//             />
//
//             <VoucherDeleteModal
//                 visible={isDeleteVisible}
//                 onCancel={() => setIsDeleteVisible(false)}
//                 onDelete={handleDelete}
//             />
//         </div>
//     );
// };
//
// export default Voucher;
