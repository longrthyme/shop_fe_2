import React, { useState, useEffect } from 'react';
import { getCategoryList, changeQuantity, removeWishListItem } from "../api/CartItemsApi";
import "../styles/CartItem.css";
import { useNavigate } from 'react-router-dom';
import Header from '../Backgroudwed/backgroudTrangChu/ProductDetail/Header';
import Footer from '../Backgroudwed/backgroudTrangChu/ProductDetail/Footer';
import Concat from '../Backgroudwed/backgroudTrangChu/ProductDetail/Concat';
import {notification} from "antd";

const CartItem = () => {
    const [cartItems, setCartItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const data = await getCategoryList();
                const formattedItems = data.map(item => ({
                    id: item.wishListId,
                    name: item.productName,
                    size: item.sizeName,
                    color: item.colorName,
                    quantity: item.quantity,
                    price: item.price || 0,
                    imageUrl: item.urlImg,
                }));
                setCartItems(formattedItems);

                localStorage.setItem("cartQuantity", formattedItems.length);
            } catch (error) {
                console.error("Error fetching wishlist:", error);
            }
        };

        fetchWishlist();
    }, []);
    const handleTrackOrder = () => {
        // Điều hướng tới trang theo dõi đơn hàng
        navigate('/user/order-details'); // Đảm bảo bạn có route này trong Router
    };

    const updateQuantity = async (id, delta) => {
        const updatedItems = cartItems.map(item =>
            item.id === id ? { ...item, quantity: Math.max(item.quantity + delta, 1) } : item
        );
        setCartItems(updatedItems);

        const updatedItem = updatedItems.find(item => item.id === id);
        if (updatedItem) {
            try {
                await changeQuantity({ wishListId: updatedItem.id, quantity: updatedItem.quantity });
                notification.success({
                    message: 'Cập nhật số lượng thành công',
                });
            } catch (error) {
                console.error("Error updating quantity:", error);
            }
        }
    };

    const removeItem = async (id) => {
        try {
            await removeWishListItem(id);
            const newItems = cartItems.filter(item => item.id !== id);
            setCartItems(newItems);
            localStorage.setItem("cartQuantity", newItems.length);
            window.dispatchEvent(new Event("cartQuantityChange"));
            notification.success({
                message: 'Đã xoá sản phẩm khỏi giỏ hàng',
                duration: 1,
            });
        } catch (error) {
            console.error("Error removing item:", error);
        }
    };

    const handleCheckboxChange = (id) => {
        setSelectedItems(prevSelected => ({
            ...prevSelected,
            [id]: !prevSelected[id]
        }));
    };

    const handleCheckout = () => {
        const itemsToCheckout = cartItems.filter(item => selectedItems[item.id]);
        if (itemsToCheckout.length === 0) {
            alert("Vui lòng chọn sản phẩm để thanh toán.");
        } else {
            navigate('/user/checkout', { state: { items: itemsToCheckout } });
        }
    };

    const totalAmount = cartItems.reduce((sum, item) => {
        return selectedItems[item.id] ? sum + item.price * item.quantity : sum;
    }, 0);

    const handleContinueShopping = () => {
        navigate('/wed/collections');
    };

// In the JSX

    return (
        <>
            <Header />
            <div className="cart">
                <h2>Giỏ hàng của bạn</h2>
                <div className="cart-container">
                    <div className="cart-items">
                        <p className="cart-item-count">Có {cartItems.length} sản phẩm trong giỏ hàng</p>
                        {cartItems.map(item => (
                            <div key={item.id} className="cart-item">
                                <input
                                    type="checkbox"
                                    checked={!!selectedItems[item.id]}
                                    onChange={() => handleCheckboxChange(item.id)}
                                />
                                <img src={item.imageUrl} alt={item.name} className="product-image-cartitem" />
                                <div className="item-info">
                                    <h3>{item.name} - {item.color}</h3>
                                    <p>{item.price.toLocaleString()}₫</p>
                                    <p>Size: {item.size}</p>
                                    <div className="quantity-controls">
                                        {/*<button*/}
                                        {/*    onClick={() => updateQuantity(item.id, -1)}*/}
                                        {/*    disabled={item.quantity === 1}*/}
                                        {/*>-*/}
                                        {/*</button>*/}
                                        <span>Số Lượng:  {item.quantity}</span>
                                        {/*<button onClick={() => updateQuantity(item.id, 1)}>+</button>*/}

                                    </div>
                                </div>
                                <p className="item-total">{(item.price * item.quantity).toLocaleString()}₫</p>
                                <button onClick={() => removeItem(item.id)} className="remove-item">X</button>
                            </div>
                        ))}
                        <textarea placeholder="Ghi chú đơn hàng" className="order-note"></textarea>
                    </div>
                    <div className="order-summary">
                        <h3>Thông tin đơn hàng</h3>
                        <p className="total-amount">Tổng tiền: <span>{totalAmount.toLocaleString()}₫</span></p>
                        <button onClick={handleCheckout} className="checkout-btn">THANH TOÁN</button>
                        <p className="continue-shopping" onClick={handleContinueShopping}>Tiếp tục mua hàng</p>
                        <button onClick={handleTrackOrder} className="track-order-btn">Lịch sử đặt hàng</button>
                    </div>
                </div>
            </div>
            <Concat/>
            <Footer/>
        </>
    );
};

export default CartItem;
