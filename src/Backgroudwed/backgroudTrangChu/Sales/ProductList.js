import React, { useEffect, useState } from 'react';
import {Tabs, Button, Col, Row, AutoComplete, message} from 'antd';
import {DeleteOutlined, SearchOutlined, ShoppingCartOutlined} from "@ant-design/icons";
import { list } from "../../../service/admin/ApiWebProduct";
import {logger} from "redux-logger/src";
import { Modal, InputNumber,Input, Table } from "antd";


const ProductList = ({ onProductsDataChange, onActiveTabChange }) => {
    const [invoices, setInvoices] = useState([{id: 1, name: "Hóa Đơn 1"}]);
    const [activeTab, setActiveTab] = useState("1");
    const [products, setProducts] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [productsData, setProductsData] = useState({});
    //mới
    const [cart, setCart] = useState([]);
    const [quantityInputs, setQuantityInputs] = useState({});
    const [cartItems, setCartItems] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [invoiceItems, setInvoiceItems] = useState([]);
    const [selectedDetail, setSelectedDetail] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);

    const [quantityMap, setQuantityMap] = useState({});
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedProductForModal, setSelectedProductForModal] = useState(null); // dữ liệu sản phẩm cha
    const openSelectProductModal = (product) => {
        setSelectedProductForModal(product);
        setIsModalVisible(true);
    };

    const [productList, setProductList] = useState([]); // danh sách sản phẩm chi tiết


    const handleAddToCart = (spct) => {
        const quantity = quantityMap[spct.id] || 1;

        // Kiểm tra nếu sản phẩm đã có trong giỏ thì tăng số lượng
        setCartItems(prevCart => {
            const existingItem = prevCart.find(item => item.id === spct.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === spct.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                return [...prevCart, { ...spct, quantity }];
            }
        });

        // Trừ tồn kho sau khi thêm
        setProductList(prev =>
            prev.map(item =>
                item.id === spct.id
                    ? { ...item, soLuongTon: item.soLuongTon - quantity }
                    : item
            )
        );
    };
    useEffect(() => {
        const storedProductsData = localStorage.getItem('productsData');
        const storedActiveTab = localStorage.getItem('activeTab');

        if (storedProductsData) {
            setProductsData(JSON.parse(storedProductsData));
        }

        if (storedActiveTab) {
            setActiveTab(storedActiveTab);
        }
    }, []);
    useEffect(() => {
        localStorage.setItem('productsData', JSON.stringify(productsData));
    }, [productsData]);

    useEffect(() => {
        localStorage.setItem('activeTab', activeTab);
    }, [activeTab]);


    //----------------------
    // useEffect(() => {
    //     setProductsData([]);
    // }, [resetTrigger]);
    useEffect(() => {
        onProductsDataChange(productsData);
    }, [productsData]);

    useEffect(() => {
        onActiveTabChange(activeTab);
    }, [activeTab]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await list();
                const filteredProducts = response.data.filter(product =>
                    product.status === "ACTIVE" &&
                    product.productDetails.some(detail => detail.quantity > 0)
                );
                setProducts(filteredProducts);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchProducts();
    }, []);



    const handleSearch = (value) => {
        setSearchText(value);
        if (value) {
            const filteredProducts = products.filter(product =>
                product.name && product.name.toLowerCase().includes(value.toLowerCase())
            );
            setSearchResults(filteredProducts);
        } else {
            setSearchResults([]);
        }
    };


    const handleSearchProduct = (value, option) => {
        const [productName, size, color] = value.split(" - ");
        const price = option.price || 0;

        const selectedProduct = {
            id: Date.now(),
            productDetailId: option.productDetailId,
            name: productName,
            size: size.replace("Size: ", ""),
            color: color.replace("Color: ", ""),
            quantity: 1,
            price,
            image: option.image
        };


        setProductsData(prev => {
            const existing = (prev[activeTab] || []).find(p =>
                p.name === selectedProduct.name &&
                p.size === selectedProduct.size &&
                p.color === selectedProduct.color &&
                p.price === selectedProduct.price
            );

            const updated = existing
                ? prev[activeTab].map(p =>
                    p.name === selectedProduct.name &&
                    p.size === selectedProduct.size &&
                    p.color === selectedProduct.color &&
                    p.price === selectedProduct.price
                        ? { ...p, quantity: p.quantity + 1 }
                        : p
                )
                : [...(prev[activeTab] || []), selectedProduct];

            return { ...prev, [activeTab]: updated };
        });

        setProducts(prevProducts =>
            prevProducts.map(p => {
                if (p.name === productName) {
                    const updatedDetails = p.productDetails.map(detail =>
                        detail.id === option.productDetailId
                            ? { ...detail, quantity: detail.quantity - 1 }
                            : detail
                    );

                    const newTotalQuantity = updatedDetails.reduce((sum, d) => sum + d.quantity, 0);

                    return {
                        ...p,
                        productDetails: updatedDetails,
                        totalQuantity: newTotalQuantity,
                    };
                }
                return p;
            })
        );

        setSearchText("");
    };


    const handleSelectProduct = (product, productDetail) => {
        const quantity = quantityMap[productDetail.id] || 1;

        if (productDetail.quantity < quantity) {
            message.error("Không đủ hàng trong kho!");
            return;
        }

        const selectedProduct = {
            id: Date.now(),
            productDetailId: productDetail.id,
            name: product.name,
            size: productDetail.size?.name || '',
            color: productDetail.color?.name || '',
            quantity,
            price: productDetail.price || 0,
            image: productDetail.image || '',
            productDetails: product.productDetails
        };

        // Cập nhật giỏ hàng: đưa sản phẩm mới lên đầu
        setProductsData(prev => {
            const existing = (prev[activeTab] || []).find(p =>
                p.name === selectedProduct.name &&
                p.size === selectedProduct.size &&
                p.color === selectedProduct.color &&
                p.price === selectedProduct.price
            );

            const updated = existing
                ? prev[activeTab].map(p =>
                    p.name === selectedProduct.name &&
                    p.size === selectedProduct.size &&
                    p.color === selectedProduct.color &&
                    p.price === selectedProduct.price
                        ? { ...p, quantity: p.quantity + quantity }
                        : p
                )
                : [selectedProduct, ...(prev[activeTab] || [])]; // <-- thêm lên đầu

            return { ...prev, [activeTab]: updated };
        });

        // Cập nhật tồn kho trong products: đưa sản phẩm vừa thay đổi lên đầu danh sách nếu muốn
        setProducts(prevProducts =>
            prevProducts.map(p => {
                if (p.id === product.id) {
                    const updatedDetails = p.productDetails.map(detail =>
                        detail.id === productDetail.id
                            ? { ...detail, quantity: detail.quantity - quantity }
                            : detail
                    );

                    const newTotalQuantity = updatedDetails.reduce((sum, d) => sum + d.quantity, 0);

                    return {
                        ...p,
                        productDetails: updatedDetails,
                        totalQuantity: newTotalQuantity
                    };
                }
                return p;
            })
        );

        setIsModalVisible(false); // đóng modal
    };


//mới
    const removeProductFromInvoice = (id) => {
        // Tìm sản phẩm cần xóa trong giỏ hàng hiện tại (productsData[activeTab])
        const productToRemove = productsData[activeTab]?.find(item => item.id === id);
        if (!productToRemove) return;

        // Xóa sản phẩm khỏi productsData
        setProductsData(prev => ({
            ...prev,
            [activeTab]: prev[activeTab].filter(item => item.id !== id)
        }));

        // Trả lại tồn kho trong mảng products
        setProducts(prevProducts =>
            prevProducts.map(product => {
                if (product.name === productToRemove.name) {
                    const updatedDetails = product.productDetails.map(detail =>
                        detail.size.name === productToRemove.size &&
                        detail.color.name === productToRemove.color
                            ? { ...detail, quantity: detail.quantity + productToRemove.quantity }
                            : detail
                    );

                    const newTotalQuantity = updatedDetails.reduce((sum, d) => sum + d.quantity, 0);

                    return {
                        ...product,
                        productDetails: updatedDetails,
                        totalQuantity: newTotalQuantity
                    };
                }
                return product;
            })
        );
    };

    const addInvoice = () => {
        if (invoices.length >= 1) {
            message.error("Hệ thống chỉ hỗ trợ xử lý từng hóa đơn một. Vui lòng hoàn tất thanh toán trước khi tạo hóa đơn mới.");
            return;
        }
        const newId = invoices.length + 1;
        const newInvoice = {id: newId, name: `Hóa Đơn`};
        setInvoices([...invoices, newInvoice]);
        setProductsData(prevData => ({...prevData, [newId]: []})); // Đặt dữ liệu trống cho hóa đơn mới
        setActiveTab(newId.toString()); // Thiết lập tab mới là tab hiện tại
    };

    const removeInvoice = (id) => {
        const updatedInvoices = invoices.filter(invoice => invoice.id !== id);
        const {[id]: _, ...restProductsData} = productsData;
        setInvoices(updatedInvoices);
        setProductsData(restProductsData);
        setActiveTab(updatedInvoices.length > 0 ? updatedInvoices[0].id.toString() : null);
    };
    const refreshProducts = async () => {
        try {
            const response = await list();
            const filteredProducts = response.data.filter(product =>
                product.status === "ACTIVE" &&
                product.productDetails.some(detail => detail.quantity > 0)
            );
            setProducts(filteredProducts);
        } catch (error) {
            console.error("Error refreshing products:", error);
        }
    };

    const checkProductStock = async (productDetailId) => {
        try {
            const response = await fetch(`http://localhost:8022/api/v1/sell/check/${productDetailId}`);
            const data = await response.json();
            console.log(data.stockQuantity);
            return data.stockQuantity || 0;
        } catch (error) {
            console.error("Error checking stock quantity:", error);
            return 0;
        }
    };
    const updateQuantity = async (productId, increment) => {
        const product = productsData[activeTab].find(p => p.id === productId);


        // Kiểm tra tồn kho trước khi tăng số lượng
        const stockQuantity = await checkProductStock(product.productDetailId);
        if (product.quantity + increment > stockQuantity) {

            message.error("Số lượng vượt quá số lượng trong kho !");
            return;
        }

        // Cập nhật số lượng nếu tồn kho còn đủ
        setProductsData(prevState => ({
            ...prevState,
            [activeTab]: prevState[activeTab].map(p =>
                p.id === productId ? {...p, quantity: Math.max(1, p.quantity + increment)} : p
            )
        }));
    };
    const handleQuantityChange = (id, newQuantity) => {
        const quantity = parseInt(newQuantity, 10);
        if (isNaN(quantity) || quantity < 1) return;

        // Lấy sản phẩm cũ trong giỏ hàng
        const oldProduct = productsData[activeTab].find(item => item.id === id);
        if (!oldProduct) return;

        // Tìm sản phẩm trong kho để kiểm tra tồn kho theo size và màu
        const productInList = products.find(product => product.name === oldProduct.name);
        if (!productInList) return;

        const detailInList = productInList.productDetails.find(
            detail =>
                detail.size.name === oldProduct.size &&
                detail.color.name === oldProduct.color
        );
        if (!detailInList) return;

        const currentStock = detailInList.quantity;
        const oldQuantity = oldProduct.quantity;
        const diff = quantity - oldQuantity;

        // Nếu chênh lệch > tồn kho thì không cho vượt quá
        if (diff > currentStock) {
            return; // hoặc hiện cảnh báo: "Không đủ hàng trong kho"
        }

        setProductsData(prev => ({
            ...prev,
            [activeTab]: prev[activeTab].map(item =>
                item.id === id ? { ...item, quantity: quantity } : item
            )
        }));


        setProducts(prevProducts =>
            prevProducts.map(product => {
                if (product.name === oldProduct.name) {
                    const updatedDetails = product.productDetails.map(detail => {
                        if (
                            detail.size.name === oldProduct.size &&
                            detail.color.name === oldProduct.color
                        ) {
                            return {
                                ...detail,
                                quantity: detail.quantity - diff
                            };
                        }
                        return detail;
                    });

                    const newTotalQuantity = updatedDetails.reduce((sum, d) => sum + d.quantity, 0);

                    return {
                        ...product,
                        productDetails: updatedDetails,
                        totalQuantity: newTotalQuantity
                    };
                }
                return product;
            })
        );
    };

    return (

        <div>
            <Modal
                title={`Chọn Chi Tiết Sản Phẩm - ${selectedProductForModal?.name || ''}`}
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={800}
            >
                {selectedProductForModal?.productDetails?.length ? (
                    Object.entries(
                        selectedProductForModal.productDetails.reduce((grouped, detail) => {
                            const sizeName = detail.size?.name || 'Không rõ';
                            if (!grouped[sizeName]) grouped[sizeName] = [];
                            grouped[sizeName].push(detail);
                            return grouped;
                        }, {})
                    ).map(([sizeName, details]) => (
                        <div
                            key={sizeName}
                            style={{
                                marginBottom: 24,
                                borderBottom: '1px solid #eee',
                                paddingBottom: 16,
                            }}
                        >
                            <h4>Size: {sizeName}</h4>
                            <Row gutter={[16, 16]}>
                                {details.map(detail => (
                                    <Col span={12} key={detail.id}>
                                        <div
                                            style={{
                                                border: '1px solid #ccc',
                                                padding: 12,
                                                borderRadius: 6,
                                                display: 'flex',
                                                gap: 12,
                                                alignItems: 'center',
                                            }}
                                        >
                                            <img
                                                src={detail.image || 'https://via.placeholder.com/80'}
                                                alt="Ảnh sản phẩm"
                                                style={{
                                                    width: 80,
                                                    height: 80,
                                                    objectFit: 'cover',
                                                    borderRadius: 4,
                                                }}
                                            />
                                            <div style={{ flex: 1 }}>
                                                <div>
                                                    <strong>Màu:</strong> {detail.color?.name}
                                                </div>
                                                <div>
                                                    <strong>Giá:</strong>{' '}
                                                    {detail.price?.toLocaleString()} VND
                                                </div>
                                                <div>
                                                    <strong>Tồn kho:</strong> {detail.quantity}
                                                </div>
                                                <InputNumber
                                                    min={1}
                                                    max={detail.quantity}
                                                    value={quantityMap[detail.id] || 1}
                                                    onChange={val =>
                                                        setQuantityMap(prev => ({
                                                            ...prev,
                                                            [detail.id]: val,
                                                        }))
                                                    }
                                                    style={{ width: 80, marginTop: 8 }}
                                                />
                                            </div>
                                            <Button
                                                type="primary"
                                                disabled={detail.quantity === 0}
                                                onClick={() =>
                                                    handleSelectProduct(selectedProductForModal, detail)
                                                }
                                            >
                                                Thêm vào giỏ
                                            </Button>
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    ))
                ) : (
                    <p>Không có chi tiết sản phẩm.</p>
                )}
            </Modal>


            <div>

                <div className="product-list">
                    <SearchOutlined/>
                    <AutoComplete
                        onSearch={handleSearch}
                        onSelect={handleSearchProduct}
                        placeholder="Tìm kiếm hàng hóa..."
                        className="search-input"
                        value={searchText}
                        onChange={setSearchText}
                        options={searchResults.flatMap(product =>
                            product.productDetails
                                .filter(detail => detail.quantity > 0) // Chỉ hiển thị các chi tiết sản phẩm còn hàng
                                .map((detail, index) => ({
                                    value: `${product.name} - Size: ${detail.size.name} - Color: ${detail.color.name}`,
                                    label: (
                                        <div style={{display: 'flex', alignItems: 'center'}}
                                             key={`${product.id}-${detail.id}-${index}`}>
                                            <img
                                                src={detail.image || '/placeholder.png'}
                                                alt={`${product.name} - ${detail.size.name} - ${detail.color.name}`}
                                                style={{width: 30, height: 30, marginRight: 10}}
                                            />
                                            <div>
                                                <span style={{fontWeight: 'bold'}}>{product.name}</span>
                                                <div style={{fontSize: '12px', color: '#555'}}>
                                                    Size: {detail.size.name} - Color: {detail.color.name} -
                                                    Price: {detail.price?.toLocaleString() || '0'} VND
                                                </div>
                                            </div>
                                        </div>
                                    ),

                                    image: detail.image || '/placeholder.png',
                                    price: detail.price,
                                    productDetailId: detail.id
                                }))
                        )}
                    />
                </div>
                <div style={{
                    padding: '5px',
                    borderBottom: '1px solid #e0e0e0',
                    marginTop: '20px',
                    marginBottom: '10px'
                }}>
                    {productsData[activeTab] && productsData[activeTab].length > 0 ? (
                        productsData[activeTab].map(product => (

                            <Row key={product.id} align="middle" gutter={[16, 16]}>
                                <Col lg={{span: 3}} style={{display: 'flex', justifyContent: 'center'}}>
                                    <img
                                        src={product.image || '/placeholder.png'}
                                        alt={product.name}
                                        style={{width: 50, height: 50, borderRadius: '4px'}}
                                    />
                                </Col>
                                <Col lg={{span: 8}}>
                                    <div>
                                        <span style={{fontWeight: 'bold'}}>{product.name}</span>
                                        <div>Size: {product.size} - Color: {product.color}</div>
                                    </div>
                                </Col>
                                <Col lg={{span: 4}}
                                     style={{display: 'flex', alignItems: 'center', justifyContent: 'left'}}>
                                    <Button
                                        style={{
                                            border: "none",
                                            fontSize: '16px',
                                            padding: '4px 8px',
                                            height: '32px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                        onClick={() => removeProductFromInvoice(product.id)}
                                    >
                                        <DeleteOutlined />
                                    </Button>
                                    <input
                                        type="number"
                                        value={product.quantity}
                                        min="1"

                                        style={{
                                            width: '40px',
                                            textAlign: 'center',
                                            border: 'none',
                                            height: '32px',
                                            margin: '0 8px',


                                        }}
                                        onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                                    />
                                    <Button
                                        style={{
                                            border: "none",
                                            fontSize: '16px',
                                            padding: '4px 8px',
                                            height: '32px',
                                            display: 'flex',

                                        }}
                                        onClick={() => updateQuantity(product.id, 1)}
                                    >
                                        +
                                    </Button>
                                </Col>

                                <Col lg={{span: 4}} style={{textAlign: 'right'}}>
    <span style={{fontWeight: 'bold', fontSize: '16px'}}>
        {
            (() => {
                // Kiểm tra nếu product và product.productDetails có giá trị hợp lệ
                const selectedDetail = product.productDetails?.find(detail =>
                    detail.size.name === product.size && detail.color.name === product.color
                );

                console.log("Product size:", product);
                console.log("Product color:", product.color);
                console.log("Selected detail:", selectedDetail);

                // Kiểm tra nếu selectedDetail có tồn tại và có giá trị hợp lệ
                const price = product.price; // Nếu không tìm thấy giá trị, sử dụng giá mặc định 12
                const totalPrice = price * product.quantity;

                return totalPrice?.toLocaleString() || '0'; // Tính giá và hiển thị
            })()
        } VND
    </span>
                                </Col>


                                <Col lg={{span: 2}} style={{textAlign: 'center'}}>
                                    <button style={{border: "none", backgroundColor: '#d6d0d0'}}
                                            onClick={() => removeProductFromInvoice(product.id)}>
                                        <DeleteOutlined/>
                                    </button>
                                </Col>
                            </Row>
                        ))
                    ) : (
                        <p>Chưa có dữ liệu.</p>
                    )}
                </div>


                <div className="product-container">
                    <div className="list-group">
                        {products.slice(0, 10).map((employee) => {
                            const representativeImage = employee.productDetails.length > 0
                                ? employee.productDetails[0].image
                                : '/path/to/default/image.jpg';

                            return (
                                <div
                                    key={employee.id}
                                    className="list-group-item d-flex align-items-center gap-3 mb-3"
                                    style={{border: '1px solid #ddd', borderRadius: '8px', padding: '16px'}}
                                >
                                    <div className="flex-shrink-0" style={{width: '120px'}}>
                                        <img
                                            src={representativeImage}
                                            alt={`Product ${employee.name}`}
                                            className="img-fluid"
                                            style={{width: '100%', height: 'auto', objectFit: 'cover'}}
                                        />
                                    </div>


                                    <div className="flex-grow-1">


                                        <h5 className="mb-2">{employee.name}</h5>
                                        <div>
                            <span className="new-price text-danger">
                                {employee.productDetails && employee.productDetails.length > 0 && employee.productDetails[0].price
                                    ? `${employee.productDetails[0].price.toLocaleString('en-US')}₫`
                                    : 'Giá không xác định'}
                            </span>
                                        </div>


                                        <h6 className="mb-2">
                                            Số lượng: {employee.productDetails?.reduce((sum, d) => sum + d.quantity, 0)}
                                        </h6>
                                    </div>

                                    <div className="text-end">
                                        <button
                                            className="btn btn-dark"
                                            onClick={() => openSelectProductModal(employee)}
                                        >
                                            <ShoppingCartOutlined/> Thêm vào giỏ hàng
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>


            </div>
        </div>
    )

};

export default ProductList;
