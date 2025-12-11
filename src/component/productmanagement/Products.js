import React, {useState, useEffect} from 'react';
import {Button, Form, Select, Table, message, Input, Row, Col, Card, Space, Tooltip, Popconfirm} from 'antd';
import { SearchOutlined, FilterOutlined, ReloadOutlined,SignatureOutlined } from '@ant-design/icons';
import {useNavigate} from 'react-router-dom';  // Import useNavigate
import {getAllBrands} from '../../service/admin/ApiBrands';
import {getCategoryList} from '../../api/CategoryApi';
import {getProductById, getAllProducts,updateProduct,deactivateProduct} from '../../service/admin/ApiProduct';
import ProductDetailModal from './ProductDetailForm';
import UpdateProduct from './UpdateProduct';
import {getMaterialList} from '../../api/MaterialApi'; // Thêm API lấy chất liệu
import { getTagList } from '../../api/TagApi';
import {EditOutlined, EyeOutlined,DeleteOutlined} from "@ant-design/icons";


const {Option} = Select;

const Product = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [updateModalVisible, setUpdateModalVisible] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [productDetail, setProductDetail] = useState(null);
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [minPrice, setMinPrice] = useState(null);
    const [maxPrice, setMaxPrice] = useState(null);
    const [priceType, setPriceType] = useState('price');
    const [sortBy, setSortBy] = useState("");
    const [searchName, setSearchName] = useState('');



    // Fetch dữ liệu Brands và Categories
    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const brandData = await getAllBrands(1, 100, 'name');
                setBrands(brandData);
                const categoryData = await getCategoryList(1, 100, 'name');
                setCategories(categoryData);
                const materialData = await getMaterialList(1, 100, 'name'); // Gọi API lấy danh sách chất liệu
                setMaterials(materialData);
                const tagData = await getTagList(1, 100, 'name');
                setTags(tagData)
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu bộ lọc:', error);
            }
        };
        fetchFilters();
    }, []);


    // Hàm điều hướng sang trang AddProduct
    const goToAddProductPage = () => {
        navigate('/admin/addproduct');  // Điều hướng đến trang thêm sản phẩm
    };

    const handleDetailClick = (productId) => {
        setSelectedProductId(productId);  // Cập nhật ID của sản phẩm
        setDetailModalVisible(true);  // Mở modal
    };

    const handleUpdateProductClick = async (productId) => {
        try {
            console.log("Product id:", productId);  //
            const productData = await getProductById(productId);  // Gọi API lấy chi tiết sản phẩm
            console.log("Product data loaded into modal:", productData);  // Log để kiểm tra dữ liệu
            setSelectedProduct(productData);  // Cập nhật sản phẩm được chọn
            setUpdateModalVisible(true);  // Hiển thị modal cập nhật
        } catch (error) {
            message.error('Không thể tải dữ liệu sản phẩm');
            console.error("Error loading product data:", error);
        }
    };



// Hàm để xử lý khi đóng modal cập nhật
    const handleUpdateCancel = () => {
        setUpdateModalVisible(false);  // Đóng modal
        setSelectedProduct(null);  // Xóa sản phẩm đã chọn
    };

    const handleProductUpdate = async (updatedProduct) => {
        try {
            if (!updatedProduct.id) {
                throw new Error("Product ID không tồn tại");
            }

            // Tạo dữ liệu cập nhật với brandId và categoryId
            const updatedData = {
                ...updatedProduct,
                brandId: updatedProduct.brand || selectedProduct.brand?.id,  // Giữ lại brand ID cũ
                categoryId: updatedProduct.category || selectedProduct.category?.id,  // Giữ lại category ID cũ
            };

            console.log("Dữ liệu cập nhật gửi đi: ", updatedData);

            // Gọi API để cập nhật sản phẩm
            await updateProduct(updatedProduct.id, updatedData);
            message.success('Cập nhật sản phẩm thành công');

            // Sau khi cập nhật thành công, gọi lại API để lấy danh sách sản phẩm mới nhất
            await fetchProducts(pagination.current, pagination.pageSize, 'name');  // Gọi lại API để load danh sách mới nhất

            setUpdateModalVisible(false);  // Đóng modal sau khi cập nhật thành công
        } catch (error) {
            console.error("Chi tiết lỗi:", error);
            message.error(error.message); // Hiển thị lỗi từ backend
        }
    };
    //
    // const fetchProducts = async (
    //     page = 1,
    //     limit = pagination.pageSize,
    //     sortBy = 'name',
    //     selectedBrand,
    //     selectedCategory,
    //     selectedMaterial,
    //     minPrice,
    //     maxPrice,
    //     priceType,
    //     name = ''
    // ) => {
    //     setLoading(true); // Bật trạng thái loading
    //     try {
    //         const response = await getAllProducts(
    //             page,
    //             limit,
    //             sortBy,
    //             selectedBrand,
    //             selectedCategory,
    //             selectedMaterial,
    //             minPrice,
    //             maxPrice,
    //             priceType,
    //             name
    //         );
    //         setProducts(response.result); // Cập nhật danh sách sản phẩm
    //         console.log(products.length);
    //         setPagination({
    //             ...pagination,
    //             current: page,
    //             pageSize: limit,
    //             total: response.totalItem, // Tổng số sản phẩm
    //         });
    //     } catch (error) {
    //         message.error('Lỗi khi tải danh sách sản phẩm.');
    //     } finally {
    //         setLoading(false); // Tắt trạng thái loading
    //     }
    // };
    const fetchProducts = async () => {
        setLoading(true); // Bật trạng thái loading
        try {
            const response = await getAllProducts(
                pagination.current,
                pagination.pageSize,
                sortBy,
                selectedBrand,
                selectedCategory,
                selectedMaterial,
                minPrice,
                maxPrice,
                priceType,
                searchName
            );
            // Kiểm tra xem backend đã trả về price và inputPrice chưa
            if (response.result && Array.isArray(response.result)) {
                // Tính trung bình giá và giá nhập từ ProductDetails
                const productsWithAverages = response.result.map(product => {
                    const totalPrice = product.productDetails.reduce((sum, detail) => sum + (detail.price || 0), 0);
                    const totalInputPrice = product.productDetails.reduce((sum, detail) => sum + (detail.inputPrice || 0), 0);
                    const count = product.productDetails.length;
                    return {
                        ...product,
                        price: count > 0 ? Math.round(totalPrice / count) : null,
                        inputPrice: count > 0 ? Math.round(totalInputPrice / count) : null,
                    };
                });
                setProducts(productsWithAverages); // Cập nhật danh sách sản phẩm với các giá trung bình
                setPagination(prev => ({
                    ...prev,
                    total: response.totalItem, // Cập nhật tổng số sản phẩm
                }));
                console.log("Products fetched with price and inputPrice:", productsWithAverages); // Log để kiểm tra
            } else {
                message.error('Dữ liệu sản phẩm không hợp lệ.');
            }
        } catch (error) {
            message.error('Lỗi khi tải danh sách sản phẩm.');
        } finally {
            setLoading(false); // Tắt trạng thái loading
        }
    };



    useEffect(() => {
        fetchProducts(1,pagination.pageSize, sortBy, selectedBrand, selectedCategory, selectedMaterial, minPrice, maxPrice, priceType, searchName);
    }, [sortBy, selectedBrand, selectedCategory, selectedMaterial, minPrice, maxPrice, priceType, searchName]);

    const [pagination, setPagination] = useState({
        current: 1,  // Trang hiện tại
        pageSize: 10,  // Số mục trên mỗi trang
        total: 0,  // Tổng số sản phẩm
    });

    const handleFilterChange = (filterType, value) => {
        if (filterType === 'priceType') {
            setPriceType(value);
        } else {
            switch (filterType) {
                case 'brand':
                    setSelectedBrand(value);
                    break;
                case 'category':
                    setSelectedCategory(value);
                    break;
                case 'material':
                    setSelectedMaterial(value);
                    break;
                case 'minPrice':
                    setMinPrice(value);
                    break;
                case 'maxPrice':
                    setMaxPrice(value);
                    break;
                default:
                    break;
            }
        }
        setPagination({ ...pagination, current: 1 });
        fetchProducts(
            1,
            pagination.pageSize,
            sortBy,
            selectedBrand,
            selectedCategory,
            selectedMaterial,
            minPrice,
            maxPrice,
            filterType === 'priceType' ? value : priceType
        );
    };


    const resetFilters = () => {
        setSelectedBrand(null); // Xóa bộ lọc thương hiệu
        setSelectedCategory(null); // Xóa bộ lọc danh mục
        setSelectedMaterial(null); // Xóa bộ lọc chất liệu
        setMinPrice(null); // Xóa bộ lọc giá tối thiểu
        setMaxPrice(null); // Xóa bộ lọc giá tối đa
        setSearchName(null);
        setSortBy(null);
        setPagination({ ...pagination, current: 1 });
        fetchProducts(1, pagination.pageSize, 'name'); // Lấy lại toàn bộ sản phẩm
    };



    const handleDeactivateProduct = async (productId) => {
        try {
            setLoading(true);
            await deactivateProduct(productId);
            message.success("Đã ngừng hoạt động sản phẩm");
            await fetchProducts(1, pagination.pageSize, 'name');  // Tải lại danh sách sản phẩm
        } catch (error) {
            console.error("Error deactivating product:", error);
            message.error("Failed to update product status.");
        } finally {
            setLoading(false);
        }
    };


    const columns = [
        {
            title: 'STT',
            key: 'index',
            render: (text, record, index) => {
                return (pagination.current - 1) * pagination.pageSize + index + 1;
            },
        },

        {
            title: 'Tên Sản Phẩm',
            dataIndex: 'name',  // Tên sản phẩm từ product.name
            key: 'name',
            width: 150,
        },
        {
            title: 'Thể Loại',
            dataIndex: 'category', // Sử dụng 'category' từ dữ liệu trả về
            key: 'categoryName',
            width: 100,
            render: (category) => category?.name || 'Không có loại sản phẩm', // Hiển thị tên hoặc giá trị mặc định
        },
        // {
        //     title: 'Kiểu Loại',
        //     dataIndex: 'category', // Sử dụng 'category'
        //     key: 'categoryType',
        //     render: (category) => category?.type || 'Không có kiểu loại', // Hiển thị kiểu loại hoặc giá trị mặc định
        // },
        {
            title: 'Thương Hiệu',
            dataIndex: 'brand', // Sử dụng 'brand' từ dữ liệu trả về
            key: 'brandName',
            render: (brand) => brand?.name || 'Không có thương hiệu', // Hiển thị tên thương hiệu hoặc giá trị mặc định
        },
        {
            title: 'Chất Liệu',
            dataIndex: ['material', 'name'],  // Thêm trường material.name để hiển thị tên chất liệu
            key: 'materialName',
            render: (material) => material ,  // Kiểm tra nếu material tồn tại, nếu không hiển thị N/A
        },
        // {
        //     title: 'Giá Nhập TB(VNĐ)',
        //     dataIndex: 'inputPrice',
        //     key: 'inputPrice',
        //     render: (inputPrice) => inputPrice ? `${inputPrice.toLocaleString()} ` : 'N/A',
        // },
        // {
        //     title: 'Giá Bán TB(VNĐ)',
        //     dataIndex: 'price',
        //     key: 'price',
        //     render: (price) => price ? `${price.toLocaleString()} ` : 'N/A',
        // },
        {
            title: 'Tổng Số Lượng',
            dataIndex: 'totalQuantity',
            key: 'totalQuantity',
            render: (totalQuantity) => totalQuantity || 0,

        },

        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (status === 'INACTIVE' ? 'Ngừng bán' : 'Đang bán'),
            width: 90,
        },

        {
            title: 'Hành Động',
            key: 'action',
            render: (text, product) => (
                // <>
                //     <Button type="link" onClick={() => handleDetailClick(product.id)}>{<EyeOutlined/>}</Button>
                //     <Button type="link" onClick={() => handleUpdateProductClick (product.id)}>{<EditOutlined />}</Button>
                //     <Button type="link" onClick={()  => handleDeactivateProduct(product.id)} loading={loading}>
                //         <DeleteOutlined />
                //     </Button>
                // </>

                <Space>
                    <Tooltip title="Thông tin sản phẩm" overlayStyle={{ fontSize: '12px' }}>
                        <Button
                            // type="link"
                            icon={<EditOutlined />}
                            onClick={() => handleUpdateProductClick(product.id)}
                        />
                    </Tooltip>
                    <Tooltip title="Chi tiết sản phẩm"  overlayStyle={{ fontSize: '12px' }}>
                        <Button
                            // type="link"
                            icon={<SignatureOutlined  />}
                            onClick={() => handleDetailClick(product.id)}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn ngừng bán sản phẩm này không?"
                        onConfirm={() => handleDeactivateProduct(product.id)}
                        okText="Ngừng"
                        cancelText="Hủy"
                    >
                        {/*<Tooltip title="Ngừng bán" overlayStyle={{ fontSize: '11px' }}>*/}
                        {/*    <Button*/}
                        {/*        danger*/}
                        {/*        type="link"*/}
                        {/*        icon={<DeleteOutlined />}*/}
                        {/*        loading={loading}*/}
                        {/*    />*/}
                        {/*</Tooltip>*/}
                    </Popconfirm>
                </Space>
            ),
        }

    ];
    return (
        <div>
            <Form layout="vertical" style={{ marginBottom: '20px' }}>
                <Card title={<><FilterOutlined /> Bộ lọc sản phẩm</>} bordered={false}>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12} md={8} lg={6}>
                            <Form.Item label="Tìm kiếm">
                                <Input
                                    placeholder="Nhập tên sản phẩm"
                                    value={searchName}
                                    onChange={(e) => setSearchName(e.target.value)}
                                    prefix={<SearchOutlined />}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6}>
                            <Form.Item label="Thương Hiệu">
                                <Select
                                    placeholder="Tất cả thương hiệu"
                                    value={selectedBrand}
                                    onChange={(value) => handleFilterChange('brand', value)}
                                >
                                    {brands.map((brand) => (
                                        <Option key={brand.id} value={brand.id}>
                                            {brand.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6}>
                            <Form.Item label="Thể Loại">
                                <Select
                                    placeholder="Tất cả thể loại"
                                    value={selectedCategory}
                                    onChange={(value) => handleFilterChange('category', value)}
                                >
                                    {categories.map((category) => (
                                        <Option key={category.id} value={category.id}>
                                            {category.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6}>
                            <Form.Item label="Chất Liệu">
                                <Select
                                    placeholder="Tất cả chất liệu"
                                    value={selectedMaterial}
                                    onChange={(value) => handleFilterChange('material', value)}
                                >
                                    {materials.map((material) => (
                                        <Option key={material.id} value={material.id}>
                                            {material.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6}>
                            <Form.Item label="Sắp xếp">
                                <Select
                                    placeholder="Sắp xếp theo"
                                    value={sortBy}
                                    onChange={(value) => setSortBy(value)}
                                >
                                    <Option value="price_asc">Giá: Thấp đến Cao</Option>
                                    <Option value="price_desc">Giá: Cao đến Thấp</Option>
                                    <Option value="quantity_asc">Số lượng: Tăng dần</Option>
                                    <Option value="quantity_desc">Số lượng: Giảm dần</Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={24} md={8} lg={6}>
                            <Button type="default" icon={<ReloadOutlined />} onClick={resetFilters} style={{ marginTop: '30px' }}>
                                Quay lại
                            </Button>
                        </Col>
                    </Row>
                </Card>
            </Form>
            {/* Nút thêm sản phẩm */}
            <Button type="primary" onClick={goToAddProductPage}>Thêm Danh Mục Sản Phẩm</Button>
            {/* Bảng danh sách sản phẩm */}
            <Table
                dataSource={products}
                columns={columns}
                rowKey="id"  // Sử dụng ID sản phẩm làm key duy nhất
                loading={loading}
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: pagination.total,
                    onChange: (page, pageSize) => {
                        setPagination({ ...pagination, current: page, pageSize });
                        fetchProducts(page, pageSize);
                    },
                }}
                size="small"
                scroll={{ x: 1000 }} // Thanh cuộn ngang
                style={{ marginTop: '20px' }}
            />

            {/* Modal hiển thị chi tiết sản phẩm */}
            <ProductDetailModal
                visible={detailModalVisible}  // Trạng thái mở modal
                productId={selectedProductId}  // ID của sản phẩm được chọn
                onCancel={() => { // Đổi từ onClose sang onCancel
                    setDetailModalVisible(false);  // Đóng modal
                    setProductDetail(null);  // Xóa dữ liệu chi tiết sản phẩm (nếu cần)
                }}
            />
            <UpdateProduct
                visible={updateModalVisible}  // Trạng thái mở modal
                onCancel={handleUpdateCancel}  // Hàm đóng modal
                onUpdate={handleProductUpdate}  // Hàm xử lý cập nhật
                productData={selectedProduct}  // Dữ liệu sản phẩm được truyền sang modal
                brands={brands}  // Danh sách thương hiệu
                categories={categories}
                materials={materials}
                tags={tags}  // Danh sách tất cả tags
                selectedTags={selectedTags} // Truyền selectedTags
                setSelectedTags={setSelectedTags} // Truyền setSelectedTags
                fetchProducts={fetchProducts} // Truyền fetchProducts
                pagination={pagination} // Truyền pagination
            />


        </div>
    );
};

export default Product;
