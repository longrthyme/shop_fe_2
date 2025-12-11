import React, { useEffect, useState } from "react";
import { Table, Form, Input, Button, DatePicker, Row, Col, Typography, message, Select , Space } from "antd";
import { updateQuantityPD, getPDHistoryList } from "../../api/PDHistoryApi";
import { getAllProductDetail ,searchProductDetailsByName} from "../../api/ProductDetailApi";
import {DeleteOutlined, EditOutlined, EyeOutlined, ShoppingCartOutlined} from "@ant-design/icons";
import { getProductDetailById} from '../../api/ProductDetailApi';
import AddProductQuantity from '../productdetailmanagement/AddProductQuantity';
import PDHistoryModal from './PDHistoryForm';
const { Title } = Typography;
const { Option } = Select;

const ProductDetailHistory = () => {
    const [productDetails, setProductDetails] = useState([]); // Dữ liệu SPCT
    const [searchText, setSearchText] = useState(""); // Thanh tìm kiếm chung
    const [selectedPDId, setSelectedPDId] = useState(null);  // Lưu trữ ID của sản phẩm được chọn
    const [loading, setLoading] = useState(false); // Trạng thái tải dữ liệu SPCT
    const [form] = Form.useForm();
    const [totalspct, setTotalspct] = useState(0);// tổng số lượng spct
    const [totallsn, setTotallsn] = useState(0);// tổng số lượng lsn
    const [addQuantityVisible, setAddQuantityVisible] = useState(false);
    const [historyData, setHistoryData] = useState([]); // Dữ liệu hóa đơn nhập hàng
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại của bảng hóa đơn
    const [currentPage1, setCurrentPage1] = useState(1); // Trang hiện tại của bảng hóa đơn
    const [selectedItem, setSelectedItem] = useState(null); // Mục đang được chọn
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Tải danh sách SPCT
    useEffect(() => {
        loadProductDetails(currentPage);
    }, [currentPage]);

    // Tải danh sách hóa đơn nhập hàng
    useEffect(() => {
        loadPDHistory(currentPage1);
    }, [currentPage1]);

    const loadProductDetails = async (page) => {
        try {
            setLoading(true);
            const response = await getAllProductDetail(page, 10); // Gọi API lấy SPCT
            const formattedData = response.result.map((item) => ({
                key: item.id,
                id: item.id,
                productName: item.productName,
                productType: item.productType,
                color: item.color.name,
                materialName: item.materialName,
                brandName: item.brandName,
                size: item.size.name,
                image: item.image,
                quantity: item.quantity,
            }));
            setProductDetails(formattedData);
            setTotalspct(response.totalItem);
        } catch (error) {
            message.error("Lỗi tải danh sách sản phẩm chi tiết: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (page) => {
        try {
            setLoading(true);
            const response = await searchProductDetailsByName(page, 10, searchText.trim());

            if (response.length === 0) {
                message.info("Không tìm thấy sản phẩm nào phù hợp.");
                setProductDetails([]); // Reset bảng sản phẩm
                return;
            }

            const formattedData = response.result.map((item) => ({
                key: item.id,
                id: item.id,
                productName: item.productName,
                productType: item.productType,
                color: item.color.name,
                materialName: item.materialName,
                brandName: item.brandName,
                size: item.size.name,
                image: item.image,
                quantity: item.quantity,
            }));
            setTotalspct(response.totalItem);
            setProductDetails(formattedData);
        } catch (error) {
            message.error("Lỗi khi tìm kiếm: " + error.message);
        } finally {
            setLoading(false);
        }
    };


    const loadPDHistory = async (page) => {
        try {
            setLoading(true);
            const response = await getPDHistoryList(page, 10); // Gọi API lấy hóa đơn nhập hàng
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
            setTotallsn(response.totalItem)
            setHistoryData(formattedData);
        } catch (error) {
            message.error("Lỗi tải lịch sử nhập hàng: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleQuantity = async (productdetailId,formattedRequest) => {
        console.log("id pd: "+productdetailId);
        try {
            await updateQuantityPD(productdetailId,formattedRequest); // Gọi API cập nhật chi tiết sản phẩm
            message.success('Nhập hàng thành công!');
            loadProductDetails();
            loadPDHistory(currentPage1);
        } catch (error) {
            if (error.response && error.response.status === 400 && error.response.data.message) {
                message.error(error.response.data.message);
            } else {
                message.error('Có lỗi xảy ra.');
            }
        }
    };

    // Hiển thị thông tin chi tiết
    const showQuantityUpdate = async (itemId) => {
        try {
            const data = await getProductDetailById(itemId); // Gọi API để lấy dữ liệu chi tiết
            console.log("Dữ liệu từ API:", data);
            setSelectedItem(data); // Cập nhật dữ liệu chi tiết sản phẩm
            setAddQuantityVisible(true); // Mở modal chỉnh sửa
        } catch (error) {
            message.error(`Error: ${error.message}`);
        }
    };

    const handleDetailClick = async (PDId) => {
        setSelectedPDId(PDId);  // Lưu ID vào state
        setIsModalOpen(true);  // Mở modal
    };

    const productColumns = [
        { title: "Mã SPCT", dataIndex: "id" },
        { title: "Tên sản phẩm", dataIndex: "productName" },
        { title: "Loại sản phẩm", dataIndex: "productType" },
        { title: "Màu sắc", dataIndex: "color" },
        { title: "Chất liệu", dataIndex: "materialName" },
        { title: "Thương hiệu", dataIndex: "brandName" },
        { title: "Size", dataIndex: "size" },
        {
            title: "Ảnh",
            dataIndex: "image",
            render: (image) => <img src={image} alt="product" style={{ width: 50 }} />,
        },
        { title: "Số lượng", dataIndex: "quantity" },
        {
            title: "Hành động",
            render: (_, record) => (
                <>
                    <Button type="primary" icon={<ShoppingCartOutlined />} onClick={() => showQuantityUpdate(record.id)}/>
                    <Button type="link" onClick={() => handleDetailClick(record.id)}>{<EyeOutlined/>}</Button>
                </>
            ),
        },
    ];

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
        <div>
            <Space style={{ marginBottom: "20px" }}>
                <Input
                    placeholder="Nhập tên sản phẩm để tìm kiếm"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
                <Button type="primary" onClick={handleSearch} loading={loading}>
                    Tìm kiếm
                </Button>
                <Button
                    onClick={() => {
                        setSearchText(""); // Reset thanh tìm kiếm
                        loadProductDetails(); // Load lại danh sách ban đầu
                    }}
                >
                    Xóa tìm kiếm
                </Button>
            </Space>

            {/* Bảng sản phẩm chi tiết */}
            <Title level={4}>Danh sách sản phẩm chi tiết</Title>
            <Table
                columns={productColumns}
                dataSource={productDetails}
                loading={loading}
                pagination={{
                              current: currentPage,
                              pageSize: 10,
                              total: totalspct,
                              onChange: (page) => setCurrentPage(page), }}
                locale={{ emptyText: "Không có dữ liệu" }}
            />

            {/* Bảng lịch sử nhập hàng */}
            <div style={{ marginTop: "20px" }}>
                <Title level={4}>Lịch sử nhập hàng chung</Title>
                <Table
                    columns={historyColumns}
                    dataSource={historyData}
                    loading={loading}
                    pagination={{
                        current: currentPage1,
                        pageSize: 10,
                        total: totallsn,
                        onChange: (page) => setCurrentPage1(page),
                    }}
                    locale={{ emptyText: "Không có dữ liệu" }}
                />
            </div>

            {/* Modal chỉnh sửa */}
            <AddProductQuantity
                visible={addQuantityVisible}
                onCancel={() => setAddQuantityVisible(false)}
                item={selectedItem}
                onUpdate={handleQuantity}
            />

            <PDHistoryModal
                visible={isModalOpen}
                PDId={selectedPDId}
                onCancel={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default ProductDetailHistory;
