import React, {useEffect, useState} from 'react';
import {Layout, Menu, Row, Select, Col, Card, Badge, Button, InputNumber, Input, message, Form} from 'antd';
import {useNavigate, useLocation} from 'react-router-dom';
import {SearchOutlined, FilterOutlined, ReloadOutlined} from '@ant-design/icons';
import {getAllProducts, getLatestProducts,getTotalQuantityByProductId, getProductPrice} from '../../service/admin/ApiWebProduct';
import {getCategoryList} from '../../api/CategoryApi';
import {getAllBrands} from '../../service/admin/ApiBrands';
import {getMaterialList} from '../../api/MaterialApi';
import {getColorList} from '../../api/ColorApi';
import {getAllSize} from '../../service/admin/ApiSize';
import Header from '../backgroudTrangChu/ProductDetail/Header';
import Footer from '../backgroudTrangChu/ProductDetail/Footer';

const {Content, Sider} = Layout;
const {Option} = Select;


const Collections = () => {
    const [products, setProducts] = useState([]);
    const [productPrices, setProductPrices] = useState({});
    const [aoCategories, setAoCategories] = useState([]);
    const [quanCategories, setQuanCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [colors, setColors] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [totalProducts, setTotalProducts] = useState(0); // Tổng số sản phẩm
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const [pageSize, setPageSize] = useState(30); // Số sản phẩm mỗi trang


    const [filteredCount, setFilteredCount] = useState(0);//lưu kết quả sau khi lọc
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [minPrice, setMinPrice] = useState(null);
    const [maxPrice, setMaxPrice] = useState(null);
    const [sortOrder, setSortOrder] = useState(null);
    const [productQuantities, setProductQuantities] = useState({});
    const {Search} = Input;
    const [searchKeyword, setSearchKeyword] = useState('');
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialCategoryId = queryParams.get('categoryId');
    const [selectedCategory, setSelectedCategory] = useState(initialCategoryId);


    const navigate = useNavigate();

    const handleProductClick = (product) => {
        navigate(`/product/${product.id}`);
    };
    const fetchProductPrice = async (productId) => {
        try {
            const price = await getProductPrice(productId);
            setProductPrices((prevPrices) => ({
                ...prevPrices,
                [productId]: price,
            }));
        } catch (error) {
            console.error('Lỗi khi lấy giá sản phẩm:', error);
        }
    };


    useEffect(() => {
        if (initialCategoryId) {
            setSelectedCategory(initialCategoryId);
            fetchProducts(null, initialCategoryId, null); // Gọi API với categoryId
        }
    }, [initialCategoryId]);

    const fetchColors = async () => {
        try {
            const data = await getColorList(1, 20); // API lấy danh sách màu
            console.log("Danh sách màu:", data);
            setColors(data.filter(color => !color.isDeleted)); // Lưu danh sách màu
        } catch (error) {
            console.error("Lỗi khi lấy danh sách màu:", error);
        }
    };

    useEffect(() => {
        fetchColors(); // Gọi API lấy danh sách màu khi component mount
    }, []);

    const fetchLatestProducts = async () => {
        const data = await getLatestProducts(10);
        setProducts(data || []);
    };

    const fetchProducts = async (brand = null, category = null, material = null, sizeIds = selectedSizes, colorIds = selectedColors) => {
        try {
            const data = await getAllProducts(1, 20, null, brand, category, material, sizeIds, colorIds);
            setProducts(data.result || []);

            // Gọi API để lấy giá cho từng sản phẩm và lưu vào state
            data.result.forEach((product) => {
                fetchProductPrice(product.id);  // Lấy giá cho mỗi sản phẩm
            });
            setTotalProducts(data.totalElements || 0);
        } catch (error) {
            console.error("Lỗi khi lấy sản phẩm:", error);
        }
    };

    const fetchFilteredProducts = async () => {
        try {
            const data = await getAllProducts(1, 20, sortOrder, selectedBrand, selectedCategory, selectedMaterial, minPrice, maxPrice, searchKeyword, selectedSizes, selectedColors);
            setProducts(data.result || []);
        } catch (error) {
            console.error("Lỗi khi lấy sản phẩm:", error);
        }
    };

    const handleSortChange = (value) => {
        setSortOrder(value);
        fetchFilteredProducts();
    };


    const fetchCategoriesAndBrands = async () => {
        try {
            const categoryData = await getCategoryList(1, 20);
            setAoCategories(categoryData.filter(category => category.type === "AO" && !category.isDeleted));
            setQuanCategories(categoryData.filter(category => category.type === "QUAN" && !category.isDeleted));

            const brandData = await getAllBrands(1, 20);
            setBrands(brandData.filter(brand => !brand.isDeleted));

            const sizeData = await getAllSize(1, 20); // Gọi API lấy danh sách kích cỡ
            setSizes(sizeData.filter(size => !size.isDeleted)); // Lưu danh sách kích cỡ

            const materialData = await getMaterialList(1, 20);
            setMaterials(materialData.filter(material => !material.isDeleted));
        } catch (error) {
            console.error("Lỗi", error);
        }
    };

    useEffect(() => {
        fetchCategoriesAndBrands();
        fetchProducts();
    }, []);


    useEffect(() => {
        fetchFilteredProducts(); // Gọi API mỗi khi bộ lọc thay đổi
    }, [selectedBrand, selectedCategory, selectedMaterial, minPrice, maxPrice, sortOrder, searchKeyword, selectedSizes]);
    const handleMenuClick = (type, id) => {
        setSelectedCategory(type === 'category' ? id : null);
        setSelectedBrand(type === 'brand' ? id : null);
        setSelectedMaterial(type === 'material' ? id : null);
        if (type === 'brand') {
            fetchProducts(id, null, null);
        } else if (type === 'category') {
            fetchProducts(null, id, null);
        } else if (type === 'material') {
            fetchProducts(null, null, id);
        } else {
            fetchProducts();
        }
    };
    const applySelectFilters = () => {
        let filteredProducts = products.filter((product) =>
            (!selectedBrand || product.brand?.id === selectedBrand) &&
            (!selectedCategory || product.category?.id === selectedCategory) &&
            (!selectedMaterial || product.material?.id === selectedMaterial)
        );

        if (selectedSizes.length > 0) {
            filteredProducts = filteredProducts.filter((product) =>
                product.productDetails?.some((detail) =>
                    selectedSizes.includes(detail.size.id)
                )
            );
        }
        if (selectedColors.length > 0) {
            filteredProducts = filteredProducts.filter((product) =>
                product.productDetails?.some((detail) =>
                    selectedColors.includes(detail.color.id)
                )
            );
        }

        if (sortOrder === "price_asc") {
            filteredProducts.sort((a, b) => a.price - b.price);
        } else if (sortOrder === "price_desc") {
            filteredProducts.sort((a, b) => b.price - a.price);
        }

        return filteredProducts;
    };
    useEffect(() => {
        const filteredProducts = applySelectFilters();
        if (filteredCount !== filteredProducts.length) {
            setFilteredCount(filteredProducts.length);
        }
    }, [products, selectedBrand, selectedCategory, selectedMaterial, selectedSizes, selectedColors, sortOrder]);


    const fetchProductQuantities = async (products) => {
        const quantities = {};
        await Promise.all(products.map(async (product) => {
            const quantity = await getTotalQuantityByProductId(product.id);
            quantities[product.id] = quantity;
        }));
        return quantities;
    };
    useEffect(() => {
        const updateQuantities = async () => {
            const quantities = await fetchProductQuantities(products);
            setProductQuantities(quantities);
        };
        if (products.length > 0) {
            updateQuantities();
        }
    }, [products]);

    const toggleSizeFilter = (sizeId) => {
        const updatedSizes = selectedSizes.includes(sizeId)
            ? selectedSizes.filter((id) => id !== sizeId) // Nếu đã chọn thì bỏ chọn
            : [...selectedSizes, sizeId]; // Nếu chưa chọn thì thêm vào danh sách

        setSelectedSizes(updatedSizes);

        fetchFilteredProducts(updatedSizes);
    };
    const toggleColorFilter = (colorId) => {
        const updatedColors = selectedColors.includes(colorId)
            ? selectedColors.filter((id) => id !== colorId) // Nếu đã chọn thì bỏ chọn
            : [...selectedColors, colorId];

        setSelectedColors(updatedColors);

    };


    const menuItems = [
        {
            key: 'ALL',
            label: <span style={{ color: 'black',fontWeight: 'bold' }}>Tất cả sản phẩm</span>,
            onClick: () => handleMenuClick('ALL'),
        },
        {
            key: 'LATEST',
            label: <span style={{color: 'black',fontWeight: 'bold'}}>Sản phẩm mới nhất</span>,
            onClick: () => fetchLatestProducts(),
        },
        {
            key: 'AO',
            label: <span style={{ color: '#000', fontWeight: 'bold' }}>Áo nam</span>, // Màu đậm và in đậm hơn
            children: aoCategories.map(category => ({
                key: `CATEGORY_${category.id}`,
                label: (
                    <span style={{ color: '#555', fontSize: '14px' }}> {/* Màu chữ cho danh mục con */}
                        {category.name}
                </span>
                ),
                onClick: () => handleMenuClick('category', category.id),
            })),
        },
        {
            key: 'QUAN',
            label: <span style={{ color: '#000', fontWeight: 'bold' }}>Quần nam</span>, // Màu đậm
            children: quanCategories.map(category => ({
                key: `CATEGORY_${category.id}`,
                label: (
                    <span style={{ color: '#555', fontSize: '14px' }}> {/* Màu chữ xám đậm */}
                        {category.name}
                </span>
                ),
                onClick: () => handleMenuClick('category', category.id),
            })),
        },


        // {
        //     key: 'BRANDS',
        //     label: <span style={{fontWeight: 900}}>Thương hiệu</span>,
        //     children: brands.map(brand => ({
        //         key: `BRAND_${brand.id}`,
        //         label: <span>{brand.name}</span>,
        //         onClick: () => handleMenuClick('brand', brand.id),
        //     })),
        // },
        // {
        //     key: 'MATERIALS',
        //     label: <span style={{fontWeight: 900}}>Chất liệu</span>,
        //     children: materials.map(material => ({
        //         key: `MATERIAL_${material.id}`,
        //         label: <span>{material.name}</span>,
        //         onClick: () => handleMenuClick('material', material.id),
        //     })),
        // },

    ];

    return (
        <>
            <Header/>
            <Content style={{padding: '20px 40px', backgroundColor: '#f0f2f5'}}>
                <Layout style={{padding: '20px', background: '#fff', borderRadius: '8px'}}>
                    <Sider
                        width={260}
                        style={{
                            background: '#fff',
                            borderRight: '1px solid #f0f0f0',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                            padding: '16px',
                            borderRadius: '8px',
                        }}
                    >
                        {/* Tiêu đề Bộ Lọc */}
                        <h3 style={{
                            padding: '16px 0',
                            fontWeight: 700,
                            fontSize: '20px',
                            color: '#1890ff',
                            textAlign: 'center',
                            borderBottom: '2px solid #1890ff',
                            marginBottom: '16px'
                        }}>
                                Bộ lọc sản phẩm
                        </h3>

                        {/* Menu */}
                        <Menu
                            mode="inline"
                            style={{
                                background: '#fff',
                                borderRight: 0,
                                marginBottom: '24px',
                                boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
                                borderRadius: '8px',
                                overflow: 'hidden',
                            }}
                            selectedKeys={[]}
                            items={menuItems}
                        />

                        {/* Kích cỡ */}
                        <div style={{marginBottom: '24px'}}>
                            <h4 style={{
                                fontWeight: 600,
                                color: '#1890ff',
                                borderBottom: '1px solid #f0f0f0',
                                paddingBottom: '8px',
                                marginBottom: '16px'
                            }}>
                                Kích cỡ
                            </h4>
                            <Row gutter={[8, 8]}>
                                {sizes.map((size) => (
                                    <Col key={size.id} span={8}>
                                        <Button
                                            block
                                            type="default"
                                            style={{
                                                borderColor: selectedSizes.includes(size.id) ? '#1890ff' : '#ddd',
                                                color: selectedSizes.includes(size.id) ? '#1890ff' : '#000',
                                                fontWeight: selectedSizes.includes(size.id) ? 600 : 400,
                                                borderRadius: '8px',
                                                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                                boxShadow: selectedSizes.includes(size.id)
                                                    ? '0 0 5px rgba(24, 144, 255, 0.5)'
                                                    : 'none',
                                            }}
                                            onClick={() => toggleSizeFilter(size.id)}
                                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                        >
                                            {size.name}
                                        </Button>
                                    </Col>
                                ))}
                            </Row>
                        </div>

                        {/* Màu sắc */}
                        <div style={{marginBottom: '24px'}}>
                            <h4 style={{
                                fontWeight: 600,
                                color: '#1890ff',
                                borderBottom: '1px solid #f0f0f0',
                                paddingBottom: '8px',
                                marginBottom: '16px'
                            }}>
                                Màu sắc
                            </h4>
                            <div style={{maxHeight: '200px', overflowY: 'auto', paddingRight: '8px'}}>
                                <Row gutter={[8, 8]}>
                                    {colors.map((color) => (
                                        <Col key={color.id} span={6}>
                                            <Button
                                                style={{
                                                    width: "50px",
                                                    height: "50px",
                                                    borderRadius: "50%",
                                                    backgroundColor: color.code,
                                                    border: selectedColors.includes(color.id)
                                                        ? "3px solid #1890ff"
                                                        : "1px solid #ddd",
                                                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Bóng mờ nhẹ
                                                }}
                                                onClick={() => toggleColorFilter(color.id)}
                                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                            />
                                            <p style={{
                                                textAlign: "center",
                                                marginTop: "8px",
                                                fontSize: "12px"
                                            }}>{color.name}</p>
                                        </Col>
                                    ))}
                                </Row>
                            </div>
                        </div>
                    </Sider>

                    <Content style={{padding: '0 24px', minHeight: 280}}>
                        <Form layout="vertical">
                            <Row gutter={[16, 16]}>
                                {/* Tìm kiếm sản phẩm */}
                                <Col xs={24} sm={12} lg={8}>
                                    <Form.Item label="Tìm kiếm sản phẩm">
                                        <Input
                                            placeholder="Nhập tên sản phẩm"
                                            value={searchKeyword}
                                            onChange={(e) => setSearchKeyword(e.target.value)}
                                            onPressEnter={fetchFilteredProducts}
                                            prefix={<SearchOutlined/>}
                                            allowClear
                                            style={{width: '100%'}}
                                        />
                                    </Form.Item>
                                </Col>

                                {/* Sắp xếp theo */}
                                <Col xs={24} sm={12} lg={8}>
                                    <Form.Item label="Sắp xếp theo">
                                        <Select
                                            placeholder="Sắp xếp theo"
                                            value={sortOrder}
                                            onChange={handleSortChange}
                                            style={{width: '100%'}}
                                        >
                                            <Option value="price_asc">Giá: Tăng dần</Option>
                                            <Option value="price_desc">Giá: Giảm dần</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>

                                {/* Giá tối thiểu */}
                                <Col xs={24} sm={12} lg={8}>
                                    <Form.Item label="Giá tối thiểu">
                                        <InputNumber
                                            placeholder="Nhập giá"
                                            value={minPrice}
                                            onChange={(value) => setMinPrice(value)}
                                            onBlur={fetchFilteredProducts}
                                            style={{width: '100%'}}
                                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            parser={(value) => value.replace(/(,*)/g, '')}
                                        />
                                    </Form.Item>
                                </Col>

                                {/* Giá tối đa */}
                                <Col xs={24} sm={12} lg={8}>
                                    <Form.Item label="Giá tối đa">
                                        <InputNumber
                                            placeholder="Nhập giá"
                                            value={maxPrice}
                                            onChange={(value) => setMaxPrice(value)}
                                            onBlur={fetchFilteredProducts}
                                            style={{width: '100%'}}
                                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            parser={(value) => value.replace(/(,*)/g, '')}
                                        />
                                    </Form.Item>
                                </Col>

                                {/* Thương hiệu */}
                                <Col xs={24} sm={12} lg={8}>
                                    <Form.Item label="Thương hiệu">
                                        <Select
                                            placeholder="Chọn thương hiệu"
                                            value={selectedBrand}
                                            onChange={(value) => setSelectedBrand(value)}
                                            allowClear
                                            style={{width: '100%'}}
                                        >
                                            {brands.map((brand) => (
                                                <Option key={brand.id} value={brand.id}>
                                                    {brand.name}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>

                                {/* Thể loại */}
                                <Col xs={24} sm={12} lg={8}>
                                    <Form.Item label="Thể loại">
                                        <Select
                                            placeholder="Chọn thể loại"
                                            value={selectedCategory}
                                            onChange={(value) => setSelectedCategory(value)}
                                            allowClear
                                            style={{width: '100%'}}
                                        >
                                            {[...aoCategories, ...quanCategories].map((category) => (
                                                <Option key={category.id} value={category.id}>
                                                    {category.name}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                {/* Chất liệu */}
                                <Col xs={24} sm={12} lg={8}>
                                    <Form.Item label="Chất liệu">
                                        <Select
                                            placeholder="Chọn chất liệu"
                                            value={selectedMaterial}
                                            onChange={(value) => setSelectedMaterial(value)}
                                            allowClear
                                            style={{width: '100%'}}
                                        >
                                            {materials.map((material) => (
                                                <Option key={material.id} value={material.id}>
                                                    {material.name}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                {/* Nút Reset */}
                                <Col xs={24} sm={12} lg={8}>
                                    <Form.Item label="&nbsp;">
                                        <Button
                                            icon={<ReloadOutlined/>}
                                            onClick={() => {
                                                setSelectedBrand(null);
                                                setSelectedCategory(null);
                                                setSelectedMaterial(null);
                                                setMinPrice(null);
                                                setMaxPrice(null);
                                                setSearchKeyword('');
                                                setSelectedColors([]);
                                                setSelectedSizes([]);
                                                setSortOrder('Sắp xếp theo');
                                                fetchProducts();
                                            }}
                                            style={{width: '100%'}}
                                        >
                                            Quay lại
                                        </Button>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                        <div style={{marginBottom: '16px', fontWeight: 600}}>
                            {filteredCount} kết quả
                        </div>
                        <Row gutter={[16, 16]}>
                            {applySelectFilters().length === 0 ? (
                                <p style={{textAlign: 'center', width: '100%'}}>
                                    Không có sản phẩm nào phù hợp với tiêu chí lọc.
                                </p>
                            ) : (
                                applySelectFilters().map((product) => {
                                    // Tính số lượng màu sắc và kích thước duy nhất
                                    const uniqueColors = new Set(product.productDetails.map((detail) => detail.color?.name || ''));
                                    const uniqueSizes = new Set(product.productDetails.map((detail) => detail.size?.name || ''));

                                    return (
                                        <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
                                            <Card
                                                hoverable={productQuantities[product.id] > 0} // Hover chỉ hoạt động khi còn hàng
                                                onClick={() => handleProductClick(product)} // Gọi hàm xử lý khi click vào sản phẩm
                                                cover={
                                                    <Badge.Ribbon
                                                        color={
                                                            productQuantities[product.id] === 0
                                                                ? 'red'
                                                                : productQuantities[product.id] < 5
                                                                    ? 'orange'
                                                                    : null
                                                        }
                                                        text={
                                                            productQuantities[product.id] === 0
                                                                ? 'Hết Hàng'
                                                                : productQuantities[product.id] < 5
                                                                    ? 'Sắp hết hàng'
                                                                    : null
                                                        }
                                                    >
                                                        <img
                                                            alt={product.name}
                                                            src={
                                                                (product.productDetails.length > 0 &&
                                                                    product.productDetails[0].image) ||
                                                                '/Images/default-image.jpg'
                                                            }
                                                            style={{
                                                                width: '100%',
                                                                height: '250px',
                                                                objectFit: 'cover',
                                                            }}
                                                        />
                                                    </Badge.Ribbon>
                                                }
                                            >
                                                <Card.Meta
                                                    title={
                                                        <p
                                                            style={{
                                                                color: '#333',
                                                                fontWeight: 'bold',
                                                                fontSize: '16px',
                                                                marginBottom: '8px',
                                                                textAlign: 'center',
                                                            }}
                                                        >
                                                            {product.name}
                                                        </p>
                                                    }
                                                    description={
                                                        <div style={{textAlign: 'center'}}>
                                                            {/* Giá sản phẩm */}
                                                            <p
                                                                style={{
                                                                    color: '#1890ff',
                                                                    fontWeight: 'bold',
                                                                    fontSize: '14px',
                                                                    margin: '8px 0',
                                                                }}
                                                            >
                                                                {productPrices[product.id]
                                                                    ? `${productPrices[product.id].toLocaleString()} VNĐ`
                                                                    : 'Đang tải...'}
                                                            </p>

                                                            {/* Giá gốc nếu có */}
                                                            {product.originalPrice && (
                                                                <p
                                                                    style={{
                                                                        textDecoration: 'line-through',
                                                                        color: '#888',
                                                                        fontSize: '12px',
                                                                        marginBottom: '8px',
                                                                    }}
                                                                >
                                                                    {product.originalPrice.toLocaleString()}đ
                                                                </p>
                                                            )}

                                                            {/* Hiển thị số lượng màu sắc và kích thước */}
                                                            <p
                                                                style={{
                                                                    marginTop: '8px',
                                                                    color: '#666',
                                                                    fontSize: '11px',
                                                                }}
                                                            >
                {/*<span style={{fontWeight: 'bold', color: '#333'}}>*/}
                {/*    +{uniqueColors.size}*/}
                {/*</span>{' '}*/}
                {/*                                                Màu sắc |{' '}*/}
                {/*                                                <span style={{fontWeight: 'bold', color: '#333'}}>*/}
                {/*    +{uniqueSizes.size}*/}
                {/*</span>{' '}*/}
                {/*                                                Kích thước*/}
                                                            </p>
                                                        </div>
                                                    }
                                                />

                                            </Card>
                                        </Col>
                                    );
                                })
                            )}
                        </Row>
                    </Content>
                </Layout>
            </Content>
            <Footer/>
        </>
    );

};

export default Collections;
