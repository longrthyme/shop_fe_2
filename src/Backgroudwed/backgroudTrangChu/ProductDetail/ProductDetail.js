    // import React, { useEffect, useState } from 'react';
    // import { useParams } from 'react-router-dom';
    // import {addWishListItem} from '../../../api/CartItemsApi'
    // import {notification} from "antd";
    // import { getTotalQuantityByProductId,getProductPriceBySizeColor} from '../../../service/admin/ApiWebProduct';
    //
    //
    // function ProductDetail() {
    //     const { id } = useParams();
    //     const [product, setProduct] = useState(null);
    //     const [selectedColor, setSelectedColor] = useState(null);
    //     const [selectedSize, setSelectedSize] = useState(null);
    //     const [selectedProductId, setSelectedProductId] = useState(null); // Store matched product ID
    //     const [quantity, setQuantity] = useState(1);
    //     const [price, setPrice] = useState(null);
    //     const [mainImage, setMainImage] = useState('');
    // // Hàm xử lý giảm số lượng
    //     const handleDecrease = () => {
    //         if (quantity > 1) {
    //             setQuantity(quantity - 1);
    //         }
    //     };
    //
    //     const handleIncrease = async () => {
    //         if (!selectedProductId) {
    //             notification.error({
    //                 description: 'Vui lòng chọn kích thước và màu sắc trước khi tăng số lượng.',
    //             });
    //             return;
    //         }
    //             const totalQuantity = await getTotalQuantityByProductId(selectedProductId);
    //
    //             if (quantity < totalQuantity) {
    //                 setQuantity(quantity + 1);
    //             } else {
    //                 notification.warning({
    //                     description: 'Bạn không thể thêm quá số lượng sản phẩm có trong kho.',
    //                 });
    //             }
    //     };
    //
    //
    //     useEffect(() => {
    //         window.scrollTo(0, 0); // Cuộn lên đầu trang khi component được hiển thị
    //     }, []);
    //     const handleColorSelect = (color) => {
    //         setSelectedColor(color);
    //         // Cập nhật ảnh sản phẩm khi chọn màu
    //         if (product && selectedSize) {
    //             const matchingProduct = product.productDetails.find(
    //                 (detail) => detail.size.name === selectedSize && detail.color.name === color
    //             );
    //             if (matchingProduct) {
    //                 setMainImage(matchingProduct.image); // Cập nhật ảnh
    //                 setSelectedProductId(matchingProduct.id); // Cập nhật ID sản phẩm
    //                 setPrice(matchingProduct.price); // Cập nhật giá
    //             }
    //         }
    //     };
    //
    //     const handleSizeSelect = (size) => {
    //         setSelectedSize(size);
    //         // Cập nhật ảnh sản phẩm khi chọn kích thước
    //         if (product && selectedColor) {
    //             const matchingProduct = product.productDetails.find(
    //                 (detail) => detail.size.name === size && detail.color.name === selectedColor
    //             );
    //             if (matchingProduct) {
    //                 setMainImage(matchingProduct.image); // Cập nhật ảnh
    //                 setSelectedProductId(matchingProduct.id); // Cập nhật ID sản phẩm
    //                 setPrice(matchingProduct.price); // Cập nhật giá
    //             }
    //         }
    //     };
    //
    //
    //     useEffect(() => {
    //         if (selectedSize && selectedColor && product) {
    //             const matchingProduct = product.productDetails.find(detail =>
    //                 detail.size.name === selectedSize && detail.color.name === selectedColor
    //             );
    //             if (matchingProduct) {
    //                 setSelectedProductId(matchingProduct.id); // Cập nhật ID sản phẩm
    //                 getProductPriceBySizeColor(id, matchingProduct.size.id, matchingProduct.color.id)
    //                     .then((priceData) => {
    //                         if (priceData && !isNaN(priceData.price)) {
    //                             setPrice(priceData.price); // Cập nhật giá hợp lệ
    //                         } else {
    //                             setPrice(matchingProduct.price); // Nếu không có giá cụ thể, dùng giá mặc định
    //                         }
    //                     })
    //                     .catch((error) => {
    //                         console.error("Lỗi khi lấy giá:", error);
    //
    //                     });
    //             } else {
    //                 setSelectedProductId(null);
    //                 setPrice(null); // Không có sản phẩm tương ứng, xóa giá
    //             }
    //         }
    //     }, [selectedSize, selectedColor, product, id]);
    //
    //
    //     useEffect(() => {
    //         // Fetch dữ liệu sản phẩm từ API
    //         fetch(`http://localhost:8022/api/v1/user/product/${id}`)
    //             .then((response) => response.json())
    //             .then((data) => {
    //                 setProduct(data);
    //                 if (data.productDetails && data.productDetails.length > 0) {
    //                     // Đặt ảnh đầu tiên làm ảnh hiển thị chính
    //                     setMainImage(data.productDetails[0].image);
    //                     setPrice(data.productDetails[0].price);
    //                 }
    //             })
    //             .catch((error) => console.error("Error fetching product data:", error));
    //     }, [id]);
    //     const handleAddToCart = async () => {
    //         if (!selectedSize || !selectedColor || !selectedProductId) {
    //             // Display success notification
    //             notification.success({
    //                 description: 'Vui lòng chọn kích thước và màu sắc để thêm sản phẩm vào giỏ hàng',
    //             });
    //             return;
    //         }
    //
    //         const request = {
    //             productDetailId: selectedProductId,
    //             quantity: quantity
    //         };
    //
    //         try {
    //             await addWishListItem(request);
    //             notification.success({
    //                 description: 'Thêm sản phẩm vào giỏ hàng thành công',
    //             });
    //         } catch (error) {
    //             console.error('Them gio hang that bai', error);
    //             notification.error({
    //                 message: 'Thêm sản phẩm vào giỏ hàng thất bại',
    //                 description: `${error}`,
    //             });
    //         }
    //     };
    //
    //     if (!product) return <div>Loading...</div>;
    //
    //
    //     return (
    //         <div className="container d-flex justify-content-between" style={{ marginBottom: '80px' }}>
    //             <div className="content_left" style={{ width: '512px', height: '548px', backgroundColor: '#fff', borderRadius: '6px', marginRight: '10px' }}>
    //                 <div className="main-image text-center" style={{ padding: '28px' }}>
    //                     <img src={mainImage} style={{ width: '72%',height:'400px' }} alt="product" />
    //                 </div>
    //                 <div className="thumbnail-images d-flex justify-content-center mt-3">
    //                     {product.productDetails && product.productDetails.map((detail, index) => (
    //                         <img
    //                             key={index}
    //                             src={detail.image}
    //                             alt={`Thumbnail ${index}`}
    //                             onClick={() => setMainImage(detail.image)}
    //                             style={{
    //                                 width: '50px',
    //                                 height: '60px',
    //                                 margin: '5px',
    //                                 cursor: 'pointer',
    //                                 border: mainImage === detail.image ? '2px solid black' : '1px solid #ddd',
    //                                 borderRadius: '4px'
    //                             }}
    //                         />
    //                     ))}
    //                 </div>
    //             </div>
    //
    //             <div className="content_right"
    //                  style={{width: '512px', height: '548px', marginRight: '200px', textAlign: 'left'}}>
    //                 <h3>{product.name}</h3>
    //                 <p>Mã sản phẩm: {product.code} </p>
    //                 <p style={{
    //                     fontSize: "14px",
    //                     fontWeight: "bold",
    //                     color: "black",
    //                     lineHeight: "22px",
    //                     letterSpacing: "0.6px",
    //                     marginTop: '10px',
    //                     marginBottom: '1px',
    //                     display: "inline"
    //                 }}>
    //                     Giá :
    //                 </p>
    //                 {/*<h4 style={{marginBottom: '12px', display: "inline", marginLeft: "100px", color: 'black'}}>*/}
    //                 {/*    {price ? (*/}
    //                 {/*        price.minPrice && price.maxPrice ? (*/}
    //                 {/*            `Giá: ${price.minPrice.toLocaleString()} - ${price.maxPrice.toLocaleString()} VNĐ`*/}
    //                 {/*        ) : (*/}
    //                 {/*            `${price.toLocaleString()} VNĐ`*/}
    //                 {/*        )*/}
    //                 {/*    ) : (*/}
    //                 {/*        'Chưa chọn kích thước và màu sắc'*/}
    //                 {/*    )}*/}
    //                 {/*</h4>*/}
    //
    //
    //                 <h4 style={{marginBottom: '12px', display: "inline", marginLeft: "100px", color: 'black'}}>
    //                     {price ? price.toLocaleString() : 'sảm phẩm chưa có màu hoặc size'} VNĐ
    //                 </h4>
    //
    //
    //                 {/* Màu sắc */}
    //                 <div style={{display: "flex", alignItems: "center", gap: "10px", marginTop: '10px'}}>
    //                     <p style={{
    //                         fontSize: "14px",
    //                         color: "black",
    //                         fontWeight: 'bold',
    //                         lineHeight: "24px",
    //                         letterSpacing: "0.6px",
    //                         margin: 0
    //                     }}>
    //                         Màu Sắc
    //                     </p>
    //                     <div className="color-options"
    //                          style={{display: "flex", flexWrap: "wrap", gap: "5px", marginLeft: '60px'}}>
    //                         {product.productDetails &&
    //                             Array.from(new Set(product.productDetails.map((detail) => detail.color.name)))
    //                                 .map((color, index) => (
    //                                     <button
    //                                         key={index}
    //                                         className={`btn btn-outline-secondary m-1 ${selectedColor === color ? 'selected' : ''}`}
    //                                         onClick={() => handleColorSelect(color)}
    //                                         style={{
    //                                             textAlign: 'center',
    //                                             background: selectedColor === color ? '#666' : '#fff',
    //                                             color: "black",
    //                                             width: '93px', // đặt chiều rộng cố định
    //                                             height: '35px',
    //                                             fontSize: "12px"
    //                                         }}
    //                                     >
    //                                         {color}
    //                                     </button>
    //                                 ))
    //                         }
    //                     </div>
    //                 </div>
    //
    //
    //                 <div style={{display: "flex", alignItems: "center", gap: "10px", marginTop: '10px'}}>
    //                     <p style={{
    //                         fontSize: "14px",
    //                         color: "black",
    //
    //                         lineHeight: "24px",
    //                         letterSpacing: "0.6px",
    //                         fontWeight: 'bold',
    //                         margin: 0
    //                     }}>
    //                         Kích Thước
    //                     </p>
    //
    //                     <div className="size-options"
    //                          style={{display: "flex", flexWrap: "wrap", gap: "5px", marginLeft: '40px'}}>
    //                         {product.productDetails &&
    //                             Array.from(new Set(product.productDetails.map((detail) => detail.size.name)))
    //                                 .map((size, index) => (
    //                                     <button
    //                                         key={index}
    //                                         className={`btn btn-outline-secondary m-1 ${selectedSize === size ? 'selected' : ''}`}
    //                                         onClick={() => handleSizeSelect(size)}
    //                                         style={{
    //                                             background: selectedSize === size ? '#666' : '#fff',
    //                                             textAlign: 'center',
    //                                             color: "black",
    //                                             width: '93px', // đặt chiều rộng cố định
    //                                             height: '35px',
    //                                             fontSize: "12px"
    //                                         }}
    //                                     >
    //                                         {size}
    //                                     </button>
    //                                 ))
    //                         }
    //                     </div>
    //                 </div>
    //
    //
    //                 <div className="d-flex align-items-center my-3">
    //                     <h5>Số lượng:</h5>
    //                     <div className="d-flex align-items-center">
    //                         <button className="btn btn-light mx-2" onClick={handleDecrease}>-</button>
    //                         <span>{quantity}</span>
    //                         <button className="btn btn-light mx-2" onClick={handleIncrease}>+</button>
    //                     </div>
    //                 </div>
    //
    //                 <div className="d-flex my-3">
    //                     <button className="btn btn-danger me-2" onClick={handleAddToCart}>THÊM VÀO GIỎ</button>
    //                 </div>
    //
    //                 {/*<div>*/}
    //                 {/*    <h5>Chia sẻ:</h5>*/}
    //                 {/*    <div className="social-icons">*/}
    //                 {/*        <i className="fab fa-facebook-square fa-lg m-1"></i>*/}
    //                 {/*        <i className="fab fa-twitter-square fa-lg m-1"></i>*/}
    //                 {/*        <i className="fab fa-instagram-square fa-lg m-1"></i>*/}
    //                 {/*    </div>*/}
    //                 {/*</div>*/}
    //             </div>
    //         </div>
    //     );
    // }
    //
    // export default ProductDetail;
    import React, { useEffect, useState } from 'react';
    import { useParams } from 'react-router-dom';
    import { addWishListItem, addWishListItemBuyNow } from '../../../api/CartItemsApi';
    import { notification, Button, Image, Spin,InputNumber  } from 'antd';
    import { getTotalQuantityByProductId, getProductPriceBySizeColor, getAvailableQuantityByProductDetailId} from '../../../service/admin/ApiWebProduct';
    import { EditOutlined } from '@ant-design/icons';
    import { useNavigate } from 'react-router-dom';

    function ProductDetail() {
        const { id } = useParams();
        const [product, setProduct] = useState(null);
        const [selectedColor, setSelectedColor] = useState(null);
        const [selectedSize, setSelectedSize] = useState(null);
        const [selectedProductId, setSelectedProductId] = useState(null); // Store matched product ID
        const [quantity, setQuantity] = useState(1);
        const [price, setPrice] = useState(null);
        const [mainImage, setMainImage] = useState('');
        const [availableQuantity, setAvailableQuantity] = useState(0);
        const [loading, setLoading] = useState(false);
        const [priceLoading, setPriceLoading] = useState(false);
        const navigate = useNavigate();

        // Hàm xử lý giảm số lượng
        const handleDecrease = () => {
            if (quantity > 1) {
                setQuantity(quantity - 1);
            }
        };

        // Hàm xử lý tăng số lượng
        const handleIncrease = async () => {
            if (!selectedProductId) {
                notification.error({
                    description: 'Vui lòng chọn kích thước và màu sắc trước khi tăng số lượng.',
                });
                return;
            }
            try {
                const currentAvailableQuantity = await getAvailableQuantityByProductDetailId(selectedProductId);
                setAvailableQuantity(currentAvailableQuantity); // Cập nhật lại số lượng khả dụng

                if (quantity < currentAvailableQuantity) {
                    setQuantity(quantity + 1);
                } else {
                    notification.warning({
                        description: 'Bạn không thể thêm quá số lượng sản phẩm có trong kho.',
                    });
                }
            } catch (error) {
                console.error('Error fetching total quantity:', error);
                notification.error({
                    message: 'Lỗi hệ thống',
                    description: 'Không thể kiểm tra số lượng sản phẩm hiện tại. Vui lòng thử lại sau.',
                });
            }
        };

        // Hàm chọn màu sắc
        const handleColorSelect = (color) => {
            setSelectedColor(color);
            // Cập nhật ảnh sản phẩm khi chọn màu
            if (product && selectedSize) {
                const matchingProduct = product.productDetails.find(
                    (detail) => detail.size.name === selectedSize && detail.color.name === color
                );
                if (matchingProduct) {
                    setMainImage(matchingProduct.image); // Cập nhật ảnh
                    setSelectedProductId(matchingProduct.id); // Cập nhật ID sản phẩm
                    setPrice(matchingProduct.price); // Cập nhật giá
                    setAvailableQuantity(matchingProduct.quantity || 0); // Cập nhật số lượng
                }
            }
        };

        // Hàm chọn kích thước
        const handleSizeSelect = (size) => {
            setSelectedSize(size);
            // Cập nhật ảnh sản phẩm khi chọn kích thước
            if (product && selectedColor) {
                const matchingProduct = product.productDetails.find(
                    (detail) => detail.size.name === size && detail.color.name === selectedColor
                );
                if (matchingProduct) {
                    setMainImage(matchingProduct.image); // Cập nhật ảnh
                    setSelectedProductId(matchingProduct.id); // Cập nhật ID sản phẩm
                    setPrice(matchingProduct.price); // Cập nhật giá
                    setAvailableQuantity(matchingProduct.quantity || 0); // Cập nhật số lượng
                }
            }
        };

        // Fetch giá khi chọn size và color
        useEffect(() => {
            const fetchPriceAndQuantity = async () => {
                if (selectedSize && selectedColor && product) {
                    const matchingProduct = product.productDetails.find(detail =>
                        detail.size.name === selectedSize && detail.color.name === selectedColor
                    );
                    if (matchingProduct) {
                        setSelectedProductId(matchingProduct.id); // Cập nhật ID sản phẩm
                        setMainImage(matchingProduct.image); // Cập nhật ảnh
                        setAvailableQuantity(matchingProduct.quantity || 0); // Cập nhật số lượng

                        setPriceLoading(true);
                        try {
                            const priceData = await getProductPriceBySizeColor(id, matchingProduct.size.id, matchingProduct.color.id);
                            if (priceData && !isNaN(priceData.price)) {
                                setPrice(priceData.price); // Cập nhật giá hợp lệ
                            } else {
                                setPrice(matchingProduct.price); // Nếu không có giá cụ thể, dùng giá mặc định
                            }
                        } catch (error) {
                            console.error("Lỗi khi lấy giá:", error);
                            setPrice(matchingProduct.price); // Dùng giá mặc định nếu có lỗi
                        } finally {
                            setPriceLoading(false);
                        }
                    } else {
                        setSelectedProductId(null);
                        setPrice(null); // Không có sản phẩm tương ứng, xóa giá
                        setAvailableQuantity(0);
                    }
                }
            };

            fetchPriceAndQuantity();
        }, [selectedSize, selectedColor, product, id]);

        // Fetch dữ liệu sản phẩm từ API
        useEffect(() => {
            const fetchProduct = async () => {
                setLoading(true);
                try {
                    const response = await fetch(`http://localhost:8022/api/v1/user/product/${id}`);
                    const data = await response.json();
                    setProduct(data);
                    if (data.productDetails && data.productDetails.length > 0) {
                        // Đặt ảnh đầu tiên làm ảnh hiển thị chính
                        setMainImage(data.productDetails[0].image);
                        setPrice(data.productDetails[0].price);
                        setAvailableQuantity(data.productDetails[0].quantity || 0);
                    }
                } catch (error) {
                    console.error("Error fetching product data:", error);
                    notification.error({
                        message: 'Lỗi hệ thống',
                        description: 'Không thể tải dữ liệu sản phẩm. Vui lòng thử lại sau.',
                    });
                } finally {
                    setLoading(false);
                }
            };

            fetchProduct();
        }, [id]);

        // Hàm thêm vào giỏ hàng
        const handleAddToCart = async () => {
            if (!selectedSize || !selectedColor || !selectedProductId) {
                notification.error({
                    description: 'Vui lòng chọn kích thước và màu sắc để thêm sản phẩm vào giỏ hàng.',
                });
                return;
            }

            if (quantity > availableQuantity) {
                notification.warning({
                    description: 'Số lượng bạn chọn vượt quá số lượng có trong kho.',
                });
                return;
            }

            const request = {
                productDetailId: selectedProductId,
                quantity: quantity
            };

            try {
                await addWishListItem(request);
                notification.success({
                    description: 'Thêm sản phẩm vào giỏ hàng thành công.',
                    duration: 1,
                });
                const oldQty = Number(localStorage.getItem("cartQuantity")) || 0;
                localStorage.setItem("cartQuantity", oldQty + 1);

                window.dispatchEvent(new Event("cartQuantityChange"));

            } catch (error) {
                console.error('Thêm vào giỏ hàng thất bại', error);
                notification.error({
                    message: 'Thêm sản phẩm vào giỏ hàng thất bại.',
                    description: `${error.message || error}`,
                });
            }
        };


        const handleBuyNow = async () => {
            if (!selectedSize || !selectedColor || !selectedProductId) {
                notification.error({
                    description: 'Vui lòng chọn kích thước và màu sắc để thêm sản phẩm vào giỏ hàng.',
                });
                return;
            }

            if (quantity > availableQuantity) {
                notification.warning({
                    description: 'Số lượng bạn chọn vượt quá số lượng có trong kho.',
                });
                return;
            }

            const request = {
                productDetailId: selectedProductId,
                quantity: quantity
            };

            try {
                var list = await addWishListItemBuyNow(request);
                notification.success({
                    description: 'Thêm sản phẩm vào giỏ hàng thành công.',
                    duration: 1, // Thời gian hiển thị (tính bằng giây)
                });
                // console.log("list buto: "+JSON.stringify(list));
                const formattedItems = list.map(item => ({
                    id: item.wishListId,
                    name: item.productName,
                    size: item.sizeName,
                    color: item.colorName,
                    quantity: item.quantity,
                    price: item.price || 0,
                    imageUrl: item.urlImg,
                }));
                navigate('/user/checkout', { state: { items: formattedItems } });
            } catch (error) {
                console.error('Thêm vào giỏ hàng thất bại', error);
                notification.error({
                    message: 'Thêm sản phẩm vào giỏ hàng thất bại.',
                    description: `${error.message || error}`,
                });
            }
        };

        if (loading) return <div className="d-flex justify-content-center my-5"><Spin size="large" /></div>;
        if (!product) return <div>Không tìm thấy sản phẩm.</div>;

        // Lấy danh sách màu sắc và kích thước duy nhất
        const colors = product.productDetails
            ? Array.from(new Set(product.productDetails.map(detail => detail.color.name)))
            : [];
        const sizes = product.productDetails
            ? Array.from(new Set(product.productDetails.map(detail => detail.size.name)))
            : [];

        return (
            <div className="container d-flex flex-column flex-md-row justify-content-between my-5">
                {/* Content Left */}
                <div className="content_left" style={{ flex: 1, marginRight: '20px', backgroundColor: '#fff', borderRadius: '6px', padding: '20px' }}>
                    <div className="main-image text-center">
                        <Image
                            src={mainImage}
                            alt="product"
                            width={'100%'}
                            height={400}
                            style={{ objectFit: 'cover', borderRadius: '8px' }}
                            placeholder={<Spin />}
                        />
                    </div>
                    <div className="thumbnail-images d-flex justify-content-center mt-3">
                        {product.productDetails && product.productDetails.map((detail, index) => (
                            <Image
                                key={index}
                                src={detail.image}
                                alt={`Thumbnail ${index}`}
                                onClick={() => {
                                    setMainImage(detail.image);
                                    setSelectedProductId(detail.id);
                                    setPrice(detail.price);
                                    setAvailableQuantity(detail.quantity || 0);
                                }}
                                width={50}
                                height={60}
                                style={{
                                    margin: '5px',
                                    cursor: 'pointer',
                                    border: mainImage === detail.image ? '2px solid #1890ff' : '1px solid #ddd',
                                    borderRadius: '4px'
                                }}
                                preview={false}
                            />
                        ))}
                    </div>
                </div>

                {/* Content Right */}
                <div className="content_right"
                     style={{flex: 1, backgroundColor: '#fff', borderRadius: '6px', padding: '20px'}}>
                    <h3>{product.name}</h3>
                    {/* Số lượng */}
                    <div style={{ marginTop: '10px', marginBottom: '20px' }}>
                        <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#000' }}>
                            Số lượng còn lại:{' '}
                            {selectedProductId ? (
                                availableQuantity
                            ) : (
                                <span style={{ color: 'red' }}>Vui lòng chọn màu và kích thước</span>
                            )}

                        </p>
                    </div>

                    {/* Giá */}
                    <div style={{marginTop: '10px', marginBottom: '20px'}}>
                    <span style={{
                        fontSize: "16px",
                        fontWeight: "bold",
                        color: "#000",
                        marginRight: '10px'
                    }}>
                        Giá:
                    </span>
                        {priceLoading ? (
                            <Spin size="small"/>
                        ) : (
                            <span style={{fontSize: "16px", color: '#1890ff'}}>
                            {price ? `${price.toLocaleString()} VNĐ` : 'Sản phẩm chưa có màu hoặc size'}
                        </span>
                        )}
                    </div>

                    {/* Màu sắc */}
                    <div style={{marginBottom: '20px'}}>
                        <p style={{
                            fontSize: "14px",
                            color: "#000",
                            fontWeight: 'bold',
                            marginBottom: '8px'
                        }}>
                            Màu Sắc
                        </p>
                        <div className="color-options d-flex flex-wrap">
                            {colors.map((color, index) => (
                                <Button
                                    key={index}
                                    type={selectedColor === color ? 'primary' : 'default'}
                                    onClick={() => handleColorSelect(color)}
                                    style={{
                                        marginRight: '8px',
                                        marginBottom: '8px',
                                        backgroundColor: selectedColor === color ? '#1890ff' : '#fff',
                                        color: selectedColor === color ? '#fff' : '#000',
                                        borderColor: selectedColor === color ? '#1890ff' : '#d9d9d9',
                                        width: '93px',
                                        height: '35px',
                                        fontSize: "12px",
                                        textAlign: 'center'
                                    }}
                                >
                                    {color}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Kích thước */}
                    <div style={{marginBottom: '20px'}}>
                        <p style={{
                            fontSize: "14px",
                            color: "#000",
                            fontWeight: 'bold',
                            marginBottom: '8px'
                        }}>
                            Kích Thước
                        </p>
                        <div className="size-options d-flex flex-wrap">
                            {sizes.map((size, index) => (
                                <Button
                                    key={index}
                                    type={selectedSize === size ? 'primary' : 'default'}
                                    onClick={() => handleSizeSelect(size)}
                                    style={{
                                        marginRight: '8px',
                                        marginBottom: '8px',
                                        backgroundColor: selectedSize === size ? '#1890ff' : '#fff',
                                        color: selectedSize === size ? '#fff' : '#000',
                                        borderColor: selectedSize === size ? '#1890ff' : '#d9d9d9',
                                        width: '93px',
                                        height: '35px',
                                        fontSize: "12px",
                                        textAlign: 'center'
                                    }}
                                >
                                    {size}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Số lượng */}
                    <div className="d-flex align-items-center mb-3">
    <span style={{
        fontSize: "14px",
        color: "#000",
        fontWeight: 'bold',
        marginRight: '10px'
    }}>
        Số lượng:
    </span>
                        <div className="d-flex align-items-center">
                            {/* Nút giảm */}
                            <Button
                                onClick={handleDecrease}
                                disabled={quantity <= 1}
                                style={{width: '30px', height: '30px', marginRight: '10px'}}
                            >
                                -
                            </Button>

                            {/* InputNumber để nhập trực tiếp số lượng */}
                            <InputNumber
                                min={1}
                                value={quantity}
                                onKeyDown={(e) => {
                                    const allowedKeys = [
                                        "Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"
                                    ];

                                    // Không cho nhập chữ/ký tự đặc biệt
                                    if (!/^[0-9]$/.test(e.key) && !allowedKeys.includes(e.key)) {
                                        e.preventDefault();
                                        return;
                                    }


                                }}

                                parser={(value) => value.replace(/[^\d]/g, "")}

                                onChange={(value) => {
                                    if (value === null) return setQuantity(null);

                                    let num = Number(value);

                                    if (num < 1) num = 1;

                                    setQuantity(num);
                                }}


                                style={{ width: "100px", marginRight: "10px" }}
                            />


                            {/* Nút tăng */}
                            <Button
                                onClick={handleIncrease}
                                disabled={quantity >= availableQuantity}
                                style={{width: '30px', height: '30px', marginRight: '10px'}}
                            >
                                +
                            </Button>

            {/*                {availableQuantity > 0 && (*/}
            {/*                    <span style={{fontSize: '14px', color: '#888'}}>*/}
            {/*    (Còn {availableQuantity} sản phẩm)*/}
            {/*</span>*/}
            {/*                )}*/}
                        </div>
                    </div>

                    {/* Thêm vào giỏ hàng */}
                    <div className="d-flex my-3">
                        <Button
                            type="primary"
                            danger
                            onClick={handleAddToCart}
                            style={{ width: '100%' }}
                            disabled={!selectedProductId || !quantity || quantity < 1 ||quantity> availableQuantity}
                            //                                disabled={isAddDisabled}
                        >
                            THÊM VÀO GIỎ
                        </Button>
                        <Button type="primary" primary onClick={handleBuyNow} style={{width: '100%'}}
                                disabled={!selectedProductId || !quantity || quantity < 1 ||quantity> availableQuantity}
                        >
                            MUA NGAY
                        </Button>
                    </div>

                    {/* Thông báo */}
                    {availableQuantity === 0 && (
                        <div style={{color: 'red', marginTop: '10px'}}>
                            Sản phẩm này hiện không còn hàng.
                        </div>
                    )}
                </div>
            </div>
        );
    }

    export default ProductDetail;
