import React, {useState, useEffect} from "react";
import {Table, Tabs, Badge, Spin, Input, DatePicker} from "antd";
import {SearchOutlined} from "@ant-design/icons";
import {getOrder} from "../api/OrderApi";
import moment from 'moment';
import {EyeOutlined, EditOutlined} from "@ant-design/icons";
import {useNavigate} from 'react-router-dom'; // Import useNavigate
const {TabPane} = Tabs;
const {RangePicker} = DatePicker;

const OrderManagement = () => {
    const navigate = useNavigate(); // Khởi tạo navigate
    const [data, setData] = useState([]);
    const [totalItem, setTotalItem] = useState();
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [currentStatus, setCurrentStatus] = useState("all");



    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    // Hàm fetch data dựa trên trạng thái
    const fetchData = async (search, status, page = 1, size = 10) => {
        try {
            setLoading(true);
            const response = await getOrder(search, status, "all", page, size);
            setData(response.result || []);
            setTotalItem(response.totalItem || 0);
            setCurrentPage(page); // lưu lại page hiện tại
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu:", error);
        } finally {
            setLoading(false);
        }
    };



    // Khi đổi tab, fetch dữ liệu theo trạng thái
    const handleTabChange = (key) => {
        const statusMap = {
            1: "all",
            2: "pending",
            3: "PROCESSING",
            4: "shipping",
            5: "completed",
            6: "CANCELED",
            7: "partial_refund",
        };
        setCurrentStatus(statusMap[key]);
        fetchData(search,statusMap[key]);
    };

    useEffect(() => {
        // Lấy dữ liệu mặc định khi component mount
        fetchData(search, "all");
    }, []);

    useEffect(() => {
        // Bắt đầu gọi API
        setLoading(true);
        // Lấy dữ liệu mặc định khi component mount
        fetchData(search, currentStatus);
    }, [search]);

    const columns = [
        {
            title: "STT",
            key: "index",
            align: "center",
            render: (text, record, index) => (currentPage - 1) * pageSize + index + 1,
        },
        {
            title: "Mã Đơn",
            dataIndex: "code",
            key: "code",
            render: (_, record) => {
                const padded = String(record.orderId).padStart(8, "0");
                return <span>HD{padded}</span>;
            },
        },
        {title: "Khách hàng", dataIndex: "fullName", key: "customer"},
        {title: "SĐT đặt hàng", dataIndex: "sdt", key: "phone"},
        {title: "Tổng tiền", dataIndex: "total", key: "total", align: "right"},
        {
            title: "Loại đơn hàng",
            dataIndex: "type",
            key: "orderType",
            render: (type) =>
                type === "ONLINE" ? (
                    <Badge color="blue" text="Online"/>
                ) : (
                    <Badge color="green" text="Tại quầy"/>
                ),
        },
        {
            title: "Ngày đặt hàng",
            dataIndex: "createDate",
            key: "createDate",
            render: (dateArray) => {
                // Chuyển đổi mảng thành định dạng ngày
                const date = moment(dateArray).toDate();
                return moment(date).format("DD/MM/YYYY HH:mm:ss");
            },
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status) => {
                let color = "default";
                let text = "";

                switch (status) {
                    case "PENDING":
                        color = "orange";
                        text = "Chờ xác nhận";
                        break;
                    case "PROCESSING":
                        color = "blue";
                        text = "Đang xử lý";
                        break;
                    case "SHIPPING":
                        color = "purple";
                        text = "Đang giao";
                        break;
                    case "COMPLETED":
                        color = "green";
                        text = "Hoàn thành";
                        break;
                    case "CANCELED":
                        color = "red";
                        text = "Đã hủy";
                        break;
                    case "partial_refund":
                        color = "volcano";
                        text = "Hoàn tiền 1 phần";
                        break;
                    default:
                        color = "default";
                        text = status;
                }

                return <Badge color={color} text={text} />;
            },
        },
        {
            title: "Hành động",
            key: "actions",
            render: (record) => (
                <div style={{display: "flex", gap: "10px", justifyContent: "center"}}>
                    <EyeOutlined
                        style={{
                            fontSize: "18px",
                            color: "#1890ff",
                            cursor: "pointer",
                        }}
                        onClick={() => {
                            console.log("day la record", record)
                            navigate(`/admin/order/${record.orderId}`)
                        }} // Điều hướng
                        title="Xem chi tiết"
                    />
                    {/*<EditOutlined*/}
                    {/*    style={{*/}
                    {/*        fontSize: "18px",*/}
                    {/*        color: "#52c41a",*/}
                    {/*        cursor: "pointer",*/}
                    {/*    }}*/}
                    {/*    onClick={() => {*/}
                    {/*        console.log("Cập nhật:", record);*/}
                    {/*        // Thêm logic xử lý "Cập nhật"*/}
                    {/*    }}*/}
                    {/*    title="Cập nhật"*/}
                    {/*/>*/}
                </div>
            ),
        },
    ];

    return (
        <div style={{padding: "20px"}}>
            <h2>Quản lý đơn hàng</h2>
            <Tabs defaultActiveKey="1" onChange={handleTabChange}>
                <TabPane tab={
                    <span>
                  Tất cả
                        {/*<Badge count={totalItem} style={{ backgroundColor: "#52c41a" }} />*/}
                </span>
                }
                         key="1"
                />
                <TabPane
                    tab={
                        <span>
                  Chờ xác nhận
                            {/*<Badge count={5} style={{ backgroundColor: "#faad14" }} />*/}
                </span>
                    }
                    key="2"
                />
                <TabPane
                    tab={
                        <span>
                  Đang xử lí
                            {/*<Badge count={3} style={{ backgroundColor: "#1890ff" }} />*/}
                </span>
                    }
                    key="3"
                />
                <TabPane
                    tab={
                        <span>
                  Đang giao
                            {/*<Badge count={12} style={{ backgroundColor: "#87d068" }} />*/}
                </span>
                    }
                    key="4"
                />
                <TabPane
                    tab={
                        <span>
                    Hoàn thành
                            {/*<Badge count={2} style={{ backgroundColor: "#f5222d" }} />*/}
                </span>
                    }
                    key="5"
                />
                <TabPane
                    tab={
                        <span>
                    Huỷ
                            {/*<Badge count={4} style={{ backgroundColor: "#722ed1" }} />*/}
                </span>
                    }
                    key="6"
                />
            </Tabs>

            <div style={{margin: "20px 0"}}>
                <Input.Search
                    placeholder="Tìm kiếm theo mã đơn, tên khách hàng, hoặc SĐT..."
                    enterButton="Tìm kiếm"
                    onSearch={(value) =>{
                        setSearch(value)
                    }}
                    style={{width: "500px", marginRight: "10px"}}
                />
            </div>

            {loading ? (
                <Spin tip="Đang tải dữ liệu..." style={{width: "100%", marginTop: "50px"}}/>
            ) : (
                <Table
                    dataSource={data}
                    columns={columns}
                    pagination={{
                        current: currentPage,
                        pageSize: 10,
                        total: totalItem,
                        onChange: (page, pageSize) => {
                            fetchData(search, currentStatus, page, pageSize);
                        }
                    }}
                    rowKey={(record) => record.orderId}
                />


            )}
        </div>
    );
};

export default OrderManagement;
