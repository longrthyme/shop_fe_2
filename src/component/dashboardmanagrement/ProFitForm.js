import React, { useEffect, useState } from 'react';
import { Modal, Table, Button, message, Pagination } from 'antd';
import { getProfitProduct } from "../../api/ApiDashBoard";  // API để lấy dữ liệu lợi nhuận

const ProfitModal = ({ visible, onCancel }) => {
    const [profitData, setProfitData] = useState([]); // Dữ liệu lợi nhuận
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại của bảng lợi nhuận
    const [pageSize, setPageSize] = useState(3); // Số lượng mục mỗi trang
    const [totalItems, setTotalItems] = useState(0); // Tổng số mục

    useEffect(() => {
        if (visible) {
            loadProfitData(currentPage); // Tải dữ liệu khi modal hiển thị
        }
    }, [visible, currentPage]);

    const loadProfitData = async (page) => {
        try {
            const response = await getProfitProduct(page, pageSize); // Gọi API lấy lợi nhuận
            const formattedData = response.result.map((item) => ({
                key: item.productId, // Tạo key cho mỗi dòng
                productId: item.productId,
                productName: item.productName,
                profit: item.profit,
            }));
            console.log("sl: "+response.totalItem)
            setTotalItems(response.totalItem); // Cập nhật tổng số mục
            setProfitData(formattedData); // Cập nhật dữ liệu lợi nhuận
        } catch (error) {
            message.error("Lỗi tải dữ liệu lợi nhuận: " + error.message);
        }
    };

    const columns = [
        { title: "ID Sản phẩm", dataIndex: "productId", key: "productId" },
        { title: "Tên sản phẩm", dataIndex: "productName", key: "productName" },
        {
            title: "Lợi nhuận",
            dataIndex: "profit",
            key: "profit",
            //render: (value) => value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 }),
        },

    ];


    return (
        <Modal
            title="Lợi nhuận Sản phẩm"
            visible={visible}
            onCancel={onCancel} // Đóng modal khi nhấn "Đóng"
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Đóng
                </Button>,
            ]}
            centered
            width={1200}
        >
            <Table
                columns={columns}
                dataSource={profitData}
                pagination={{
                    current: currentPage,
                    pageSize: 3,
                    total: totalItems,
                    onChange: (page) => setCurrentPage(page),
                }}
                locale={{ emptyText: "Không có dữ liệu lợi nhuận" }}
            />
        </Modal>
    );
};

export default ProfitModal;
