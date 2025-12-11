import React, { useEffect, useState } from 'react';
import { Modal, Table, Button, message, Space, Tooltip, Form, InputNumber , Input,Select,Upload,Typography } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined ,ShoppingCartOutlined,PlusOutlined} from '@ant-design/icons';
import { getProductDetailByProductId } from '../../service/admin/ApiProduct';
import { updateQuantityPD } from '../../api/PDHistoryApi';
import { getProductDetailById, updateProductDetail,deleteProductDetail,addProductDetail } from '../../api/ProductDetailApi';
import ProductDetailDetailModal from "../productdetailmanagement/ProductDetailDetailModal";
import EditProductDetailModal from "../productdetailmanagement/EditProductDetailModal";
import AddProductQuantity from '../productdetailmanagement/AddProductQuantity';
import { getColorList } from "../../api/ColorApi";
import { getAllSize } from "../../service/admin/ApiSize";
import axios from "axios";
const { Option } = Select;

const ProductDetailModal = ({ visible, onCancel, productId }) => {
    const [productDetails, setProductDetails] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isDetailVisible, setIsDetailVisible] = useState(false); // Modal xem chi tiết
    const [isEditVisible, setIsEditVisible] = useState(false); // Modal cập nhật
    const [currentPage, setCurrentPage] = useState(1);
    const [tableData, setTableData] = useState([]);

    const [pageSize, setPageSize] = useState(5); // Kích thước trang mặc định là 5
    const [totalItems, setTotalItems] = useState(0); // Tổng số mục
    const [addQuantityVisible, setAddQuantityVisible] = useState(false);
    const [selectedProductDetail, setSelectedProductDetail] = useState(null);
    const [isAddCTSPVisible, setIsAddCTSPVisible] = useState(false);
    const [addForm] = Form.useForm();
    const [sizes, setSizes] = useState([]);
    const [colors, setColors] = useState([]);
    const { Text } = Typography;
    const [previewImage, setPreviewImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const API_KEY = '25d25c1c0ab2bf795c35b58ecaa1b96f';
    useEffect(() => {
        const fetchData = async (page = 0, size = 10) => {
            if (page < 0) page = 0;
            try {
                const response = await getAllSize(page + 1, size, 'name');
                const activeSizes = (response.data || response).filter(
                    (item) => Number(item.status) === 1
                );

                setSizes(activeSizes);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchColors = async (page = 0, size = 10) => {
            if (page < 0) page = 0;
            try {
                const response = await getColorList(page + 1, size, 'name');
                const activeColors = (response.data || response).filter(
                    (item) => Number(item.status) === 1
                );
                setColors(activeColors);
            } catch (error) {
                console.error(error);
            }
        };

        fetchColors();
    }, []);



    useEffect(() => {
        if (visible && productId) {
            loadProductDetails(currentPage, pageSize);
        }
    }, [visible, productId, currentPage, pageSize]);

    const loadProductDetails = async (page, limit) => {
        try {
            const response = await getProductDetailByProductId(productId, page, limit);
            console.log("response:", response);
            setProductDetails(response);
            setTotalItems(response.totalItem);
        } catch (error) {
            message.error('Lỗi khi lấy chi tiết sản phẩm.');
            console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
        }
    };



    const showDetailModal = (item) => {
        const fullItem = {
            ...item,
            color: colors.find(c => c.id === item.colorId),
            size: sizes.find(s => s.id === item.sizeId)
        };
        setSelectedItem(item);
        setIsDetailVisible(true);
    };

    // Hiển thị thông tin chi tiết
    const showEditModal = async (itemId) => {
        try {
            const data = await getProductDetailById(itemId); // Gọi API để lấy dữ liệu chi tiết
            console.log("Dữ liệu từ API:", data);
            setSelectedItem(data); // Cập nhật dữ liệu chi tiết sản phẩm
            setIsEditVisible(true); // Mở modal chỉnh sửa
        } catch (error) {
            message.error(`Error: ${error.message}`);
        }
    };
    //mới
    const handleAddProductDetail = async (values) => {
        let imageUrl = null;
        if (imageFile) {
            imageUrl = await uploadImageToImgBB(imageFile);
        }

        const newProductDetail = {
            ...values,
            sizeId: Number(values.sizeId),
            colorId: Number(values.colorId),
            productId: Number(productId),
            quantity: Number(values.quantity),
            image: imageUrl, // url thật từ ImgBB
        };

        try {
            await addProductDetail(newProductDetail);
            message.success("Thêm chi tiết sản phẩm thành công");
            setIsAddCTSPVisible(false);
            loadProductDetails(currentPage, pageSize);
            addForm.resetFields();
            setPreviewImage(null);
            setImageFile(null);
        } catch (err) {
            message.error("Thêm chi tiết sản phẩm thất bại: " + err.message);
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

    const handleUpdate = async (productdetailId,values) => {
        console.log(productdetailId);
        try {
            await updateProductDetail(productdetailId,values); // Gọi API cập nhật chi tiết sản phẩm
            message.success('Cập nhật thành công!');
            loadProductDetails(currentPage, pageSize); // Gọi hàm tải dữ liệu khi mở modal
        } catch (error) {
            if (error.response && error.response.status === 400 && error.response.data.message) {
                message.error(error.response.data.message);
            } else {
                message.error('Có lỗi xảy ra.');
            }
        }
    };

    const handleQuantity = async (productdetailId,formattedRequest) => {
        console.log("id pd: "+productdetailId);
        try {
            await updateQuantityPD(productdetailId,formattedRequest); // Gọi API cập nhật chi tiết sản phẩm
            message.success('Nhập hàng thành công!');
            loadProductDetails(currentPage, pageSize); // Gọi hàm tải dữ liệu khi mở modal
        } catch (error) {
            if (error.response && error.response.status === 400 && error.response.data.message) {
                message.error(error.response.data.message);
            } else {
                message.error('Có lỗi xảy ra.');
            }
        }
    };


    const handleImageUpload = (info) => {
        const file = info.file;

        if (file instanceof File) {
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewImage(reader.result);
                setImageFile(file);
            };
            reader.readAsDataURL(file);
        } else {
            message.error("Ảnh không hợp lệ. Vui lòng chọn lại.");
        }
    };
    const uploadImageToImgBB = async (file) => {
        const formData = new FormData();
        formData.append("image", file);
        try {
            const res = await axios.post(`https://api.imgbb.com/1/upload?key=${API_KEY}`, formData);
            return res.data.data.url;
        } catch (err) {
            console.error("Upload ảnh thất bại:", err);
            return null;
        }
    };
    const confirmDelete = (productDetailId) => {
        Modal.confirm({
            title: 'Bạn có chắc chắn muốn xóa?',
            content: 'Hành động này không thể hoàn tác.',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: () => handleDelete(productDetailId),
        });
    };

    const handleDelete = async (productDetailId) => {
        console.log(productDetailId)
        try {
            await deleteProductDetail(productDetailId);
            message.success('Xóa product-detail thành công!');
            loadProductDetails(currentPage, pageSize);
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
            title: 'Mã SPCT', // Đổi tên cột từ "Mã sản phẩm chi tiết" thành "Mã SPCT"
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        // {
        //     title: 'Giá nhập',
        //     dataIndex: 'inputPrice',  // Lấy tên màu sắc từ đối tượng color
        //     key: 'inputPrice',
        // },
        {
            title: 'Gía bán',
            dataIndex: 'price',  // Lấy tên màu sắc từ đối tượng color
            key: 'price',
        },
        {
            title: 'Màu sắc',
            dataIndex: ['color', 'name'],  // Lấy tên màu sắc từ đối tượng color
            key: 'color',
        },
        {
            title: 'Kích cỡ',
            dataIndex: ['size', 'name'],  // Lấy tên kích cỡ từ đối tượng size
            key: 'size',
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'image',
            key: 'image',
            render: (image) => (
                <img
                    src={image}  // Link ảnh từ cơ sở dữ liệu
                    alt="Sản phẩm"  // Văn bản thay thế nếu không tải được ảnh
                    style={{ width: '100px', height: 'auto' }}  // Điều chỉnh kích thước ảnh
                />
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isDeleted',
            key: 'isDeleted',
            render: (isDeleted) => (isDeleted ? 'Không hoạt động' : 'Đang Hoạt động'),
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
                    <Tooltip title="Xoá">
                        <Button danger icon={<DeleteOutlined />} onClick={() => confirmDelete(record.id)} />
                    </Tooltip>
                    <Tooltip title="Nhập hàng">
                        <Button type="primary" icon={<ShoppingCartOutlined />} onClick={() => showQuantityUpdate(record.id)}/>
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <>
            <Modal
                title="Chi tiết sản phẩm"
                visible={visible}
                onCancel={onCancel} // Sử dụng hàm onCancel để đóng modal
                footer={[
                    <Button
                        key="add"
                        type="primary"
                        onClick={() => setIsAddCTSPVisible(true)}
                    >
                        + Thêm
                    </Button>,
                    <Button key="cancel" onClick={onCancel}>
                        Đóng
                    </Button>,
                ]}


                centered
                width={1000}
            >
                {/* Hiển thị bảng chi tiết sản phẩm */}
                <Table
                    dataSource={productDetails}
                    columns={columns}
                    rowKey="id" // thêm key cho table
                    pagination={{
                        current: currentPage,
                        pageSize: pageSize,
                        total: totalItems,
                        onChange: (page) => setCurrentPage(page),
                    }}
                />



                {/* Modal xem chi tiết */}
                <ProductDetailDetailModal
                    visible={isDetailVisible}
                    onCancel={() => setIsDetailVisible(false)}
                    item={selectedItem}
                />

                {/* Modal chỉnh sửa */}
                <EditProductDetailModal
                    visible={isEditVisible}
                    onCancel={() => setIsEditVisible(false)}
                    item={selectedItem}
                    onUpdate={handleUpdate}
                />

                {/* Modal chỉnh sửa */}
                <AddProductQuantity
                    visible={addQuantityVisible}
                    onCancel={() => setAddQuantityVisible(false)}
                    item={selectedItem}
                    onUpdate={handleQuantity}
                />
            </Modal>

            <Modal
                title="Thêm chi tiết sản phẩm"
                open={isAddCTSPVisible}
                onCancel={() => setIsAddCTSPVisible(false)}
                footer={null} // bỏ footer, dùng nút trong form
                destroyOnClose
            >
                <Form
                    form={addForm}
                    layout="vertical"
                    onFinish={handleAddProductDetail}
                    initialValues={{ quantity: 0, inputPrice: 0, price: 0 }}
                >
                    <Form.Item
                        name="quantity"
                        label="Số lượng"
                        rules={[{ required: true, message: "Nhập số lượng" }]}
                    >
                        <InputNumber min={0} style={{ width: "100%" }} />
                    </Form.Item>

                    {/*<Form.Item*/}
                    {/*    name="inputPrice"*/}
                    {/*    label="Giá nhập"*/}
                    {/*    rules={[{ required: true, message: "Nhập giá nhập" }]}*/}
                    {/*>*/}
                    {/*    <InputNumber min={0} style={{ width: "100%" }} />*/}
                    {/*</Form.Item>*/}

                    <Form.Item
                        name="price"
                        label="Giá bán"
                        rules={[
                            { required: true, message: "Nhập giá bán" },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || value >= getFieldValue("inputPrice")) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(
                                        new Error("Giá bán phải lớn hơn hoặc bằng giá nhập!")
                                    );
                                },
                            }),
                        ]}
                    >
                        <InputNumber min={0} style={{ width: "100%" }} />
                    </Form.Item>


                    <Form.Item
                        label={<Text strong>Màu sắc</Text>}
                        name="colorId"
                        rules={[{ required: true, message: 'Vui lòng chọn màu sắc!' }]}
                    >
                        <Select placeholder="Chọn màu sắc">
                            {colors && colors.map(color => (
                                <Option key={color.id} value={color.id}>{color.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="sizeId"
                        label="Kích cỡ"
                        rules={[{ required: true, message: "Chọn kích cỡ" }]}
                    >
                        <Select placeholder="Chọn size">
                            {sizes.map(s => (
                                <Option key={s.id} value={s.id}>{s.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item label="Hình ảnh" required>
                        <Upload
                            beforeUpload={() => false}
                            onChange={handleImageUpload}
                            showUploadList={false}
                            maxCount={1}
                        >
                            <Button icon={<PlusOutlined />}>Tải Ảnh</Button>
                        </Upload>
                        {previewImage && (
                            <img
                                src={previewImage}
                                alt="Ảnh sản phẩm"
                                style={{ width: "100px", marginTop: "10px" }}
                            />
                        )}
                    </Form.Item>



                    <Form.Item style={{ textAlign: "right" }}>
                        <Space>
                            <Button onClick={() => setIsAddCTSPVisible(false)}>Hủy</Button>
                            <Button type="primary" htmlType="submit">Thêm</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>


        </>

    );
};

export default ProductDetailModal;
