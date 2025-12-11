import React, { useEffect, useState } from 'react';
import { Modal, Table, Button, message, Space, Tooltip } from 'antd';
import {getPDHistoryListByPDID} from "../../api/PDHistoryApi";
const PDHistoryModal = ({ visible, PDId ,onCancel }) => {
    const [selectedItem, setSelectedItem] = useState(null); // Mục đang được chọn
    const [historyData, setHistoryData] = useState([]); // Dữ liệu hóa đơn nhập hàng
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại của bảng hóa đơn
    const [pageSize, setPageSize] = useState(5); // Kích thước trang mặc định là 5
    const [totalItems, setTotalItems] = useState(0); // Tổng số mục

    useEffect(() => {
        if (visible && PDId) {
            loadPDHistory(currentPage); // Gọi hàm tải dữ liệu khi mở modal
        }
    }, [visible, PDId, currentPage]);

    const loadPDHistory = async (page) => {
        try {
            const response = await getPDHistoryListByPDID(PDId,page, 5); // Gọi API lấy hóa đơn nhập hàng
            console.log(response);
            const formattedData = response.result.map((item) => ({
                key: item.id,
                id: item.id,
                productName: item.productName,
                productDetailImage: item.productDetailImage,
                purchasePrice: item.purchasePrice,
                categoryName: item.categoryName,
                colorName: item.colorName,
                brandName: item.brandName,
                sizeName: item.sizeName,
                materialName: item.materialName,
                quantityAdded: item.quantityAdded,
                createdBy: item.createdBy,
                importDate: item.importDate,
            }));
            console.log('slhn: '+response.totalItem);
            setTotalItems(response.totalItem);
            setHistoryData(formattedData);
        } catch (error) {
            message.error("Lỗi tải lịch sử nhập hàng: " + error.message);
        }
    };

    const historyColumns = [
        { title: "Mã HD", dataIndex: "id"},
        { title: "Tên sp", dataIndex: "productName" },
        {
            title: "Ảnh sp",
            dataIndex: "productDetailImage",
            render: (image) => <img src={image} alt="product" style={{ width: 50 }} />,
        },
        { title: "Giá nhập", dataIndex: "purchasePrice" },
        { title: "Tên DM", dataIndex: "categoryName" },
        { title: "Màu sắc", dataIndex: "colorName" },
        { title: "Thương hiệu", dataIndex: "brandName" },
        { title: "Kích cỡ", dataIndex: "sizeName" },
        { title: "Chất liệu", dataIndex: "materialName" },
        { title: "SL nhập", dataIndex: "quantityAdded" },
        { title: "Người nhập", dataIndex: "createdBy" },
        {
            title: "Ngày nhập",
            dataIndex: "importDate",
            render: (importDate) => {
                if (Array.isArray(importDate) && importDate.length >= 5) {
                    const [year, month, day, hour, minute] = importDate;
                    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
                }
                return "Invalid Date";
            },
        },
    ];

    return (
        <Modal
            title="Chi tiết nhập hàng"
            visible={visible}
            onCancel={onCancel} // Sử dụng hàm onCancel để đóng modal
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Đóng
                </Button>,
            ]}
            centered
            width={1200}
        >
            <Table
                columns={historyColumns}
                dataSource={historyData}
                pagination={{
                    current: currentPage,
                    pageSize: 5,
                    total: totalItems,
                    onChange: (page) => setCurrentPage(page),
                }}
                locale={{ emptyText: "Không có dữ liệu" }}
            />
        </Modal>
    );
};

export default PDHistoryModal;
