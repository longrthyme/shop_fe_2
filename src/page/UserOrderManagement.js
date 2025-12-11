import React, { useState, useEffect } from "react";
import { Table, Tabs, Badge, Spin, Input, DatePicker } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import {getOrder, getOrderByUserID} from "../api/OrderApi";
import moment from 'moment';
import { EyeOutlined, EditOutlined } from "@ant-design/icons";
import Header from '../Backgroudwed/backgroudTrangChu//ProductDetail/Header';
import Footer from '../Backgroudwed/backgroudTrangChu/ProductDetail/Footer';

import { useNavigate } from 'react-router-dom'; // Import useNavigate
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const OrderManagement = () => {
    const navigate = useNavigate(); // Khởi tạo navigate
    const [data, setData] = useState([]);
    const [totalItem, setTotalItem] = useState();
    const [loading, setLoading] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10); // Đã khớp với Table

    // Hàm fetch data dựa trên trạng thái
    const fetchData = async (page = 1, size = 10) => {
        try {
            setLoading(true);
            const response = await getOrderByUserID(page, size); 
            setData(response.result || []);
            setTotalItem(response.totalItem)
            setCurrentPage(page);
            setPageSize(size);
        } catch (error) {
            // ...
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        // Lấy dữ liệu mặc định khi component mount
        fetchData(1, 10);
    }, []);

    const columns = [
        {
            title: "STT",
            key: "index",
            align: "center",
            render: (text, record, index) => index + 1, // Dùng render để hiển thị index + 1
        },
        { title: "Mã Đơn", dataIndex: "code", key: "code" },
        { title: "Khách hàng", dataIndex: "fullName", key: "customer" },
        { title: "SĐT đặt hàng", dataIndex: "sdt", key: "phone" },
        { title: "Tổng tiền", dataIndex: "total", key: "total", align: "right" },
        {
            title: "Loại đơn hàng",
            dataIndex: "type",
            key: "orderType",
            render: (type) =>
                type === "ONLINE" ? (
                    <Badge color="blue" text="Giao hàng" />
                ) : (
                    <Badge color="green" text="Tại quầy" />
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
            title: "Hành động",
            key: "actions",
            render: (record) => (
                <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                    <EyeOutlined
                        style={{
                            fontSize: "18px",
                            color: "#1890ff",
                            cursor: "pointer",
                        }}
                        onClick={() => {
                            console.log("day la record",record)
                            navigate(`/user/order-details/${record.orderId}`)}} // Điều hướng
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
        <>
        <Header />
        <div style={{ padding: "20px" }}>
            <h2>Lịch sử đặt hàng</h2>
            {loading ? (
                <Spin tip="Đang tải dữ liệu..." style={{ width: "100%", marginTop: "50px" }} />
            ) : (
                <Table
                    dataSource={data}
                    columns={columns}
                    pagination={{
                        pageSize: pageSize,
                        total: totalItem,
                        current: currentPage,
                        // Hàm này được gọi khi người dùng click vào số trang hoặc thay đổi pageSize
                        onChange: (page, size) => {
                            // currentStatus đã được định nghĩa ở ngoài, có thể truy cập
                            fetchData(page, size); 
                        },
                    }}
                    rowKey={(record) => record.id}
                />
            )}
        </div>
            <Footer />
        </>
    );
};

export default OrderManagement;
