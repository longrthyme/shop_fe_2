import React, { useState, useEffect } from 'react';
import { createCategory } from '../api/OrderApi'; // Đảm bảo import này đúng
// Import icons cho giao diện (Giả sử dùng react-icons)
import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa'; 

// Hàm xử lý thanh toán (giữ nguyên, nhưng tôi sẽ đưa logic vào useEffect)
// *** Lưu ý: Tên hàm createCategory trong OrderApi có vẻ không phù hợp với việc tạo Order,
//      bạn nên kiểm tra lại tên hàm này ở file OrderApi.js
// ******************************************************************************

function ThanhCong() {
    // State để quản lý trạng thái hiển thị
    // status: 'loading', 'success', 'failure'
    const [paymentStatus, setPaymentStatus] = useState('loading');
    const [message, setMessage] = useState('Đang kiểm tra kết quả thanh toán...');
    const [orderId, setOrderId] = useState(null); // Để lưu ID đơn hàng nếu thành công

    const createPayment = async () => {
        try {
            var uls = new URL(document.URL);
            var vnpOrderInfo = uls.searchParams.get("vnp_OrderInfo");
            var vnpAmount = uls.searchParams.get("vnp_Amount");
            
            const currentUrl = window.location.href;
            const parsedUrl = new URL(currentUrl);
            const queryStringWithoutQuestionMark = parsedUrl.search.substring(1);
            
            var urlVnpay = queryStringWithoutQuestionMark;
            
            var payload = {
                urlPayment: urlVnpay,
                vnpOrderInfo: vnpOrderInfo,
                totalAmount: vnpAmount,
            };

            const response = await fetch("http://localhost:8022/api/v1/user/vnpay/check-payment", {
                method: 'POST',
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                body: JSON.stringify(payload)
            });

            if (response.status < 300) {
                var result = await response.json();
                // --- Xử lý Logic Backend ---
                if (result.isSuccess == true) {
                    // 1. Thanh toán thành công, tiến hành tạo đơn hàng
                    var orderRequest = window.localStorage.getItem("orderDto");
                    
                    if (orderRequest) {
                        orderRequest = JSON.parse(orderRequest);
                        
                        // Gọi API tạo đơn hàng
                        const orderRes = await createCategory(orderRequest); // Tên hàm nên là createOrder
                        setPaymentStatus('success');
                        setMessage("Đơn hàng đã được tạo thành công!");
                        window.localStorage.removeItem("orderDto"); // Xóa dữ liệu đơn hàng tạm
                    } else {
                        // Trường hợp thanh toán thành công nhưng không tìm thấy orderDto
                        setPaymentStatus('success'); 
                        setMessage("Thanh toán thành công");
                    }
                } 
                else {
                    setPaymentStatus('failure');
                    setMessage(result.message);
                }
            } else {
                setPaymentStatus('failure');
                setMessage("Lỗi kết nối đến hệ thống thanh toán. Vui lòng kiểm tra lại sau.");
            }
        } catch (error) {
            console.error("Lỗi trong quá trình xử lý thanh toán:", error);
            setPaymentStatus('failure');
            setMessage("Đã xảy ra lỗi nghiêm trọng. Vui lòng liên hệ hỗ trợ.");
        }
    };

    useEffect(() => {
        createPayment();
    }, []);

    // --- Hàm render giao diện ---
    const renderContent = () => {
        const baseStyle = {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '80vh',
            fontFamily: 'Arial, sans-serif',
            padding: '20px',
            textAlign: 'center',
        };

        const cardStyle = {
            padding: '40px',
            borderRadius: '10px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            maxWidth: '500px',
            width: '100%',
        };

        const linkStyle = {
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px',
            fontWeight: 'bold',
            transition: 'background-color 0.3s',
        };

        if (paymentStatus === 'loading') {
            return (
                <div style={{ ...baseStyle, backgroundColor: '#f4f7f9' }}>
                    <div style={cardStyle}>
                        <FaSpinner size={50} color="#007bff" className="spin-animation" />
                        <h2 style={{ marginTop: '20px', color: '#007bff' }}>Đang xử lý giao dịch...</h2>
                        <p>{message}</p>
                    </div>
                    {/* Thêm CSS cho animation spin nếu cần */}
                    <style>{`
                        .spin-animation {
                            animation: spin 1s linear infinite;
                        }
                        @keyframes spin {
                            to { transform: rotate(360deg); }
                        }
                    `}</style>
                </div>
            );
        }

        if (paymentStatus === 'success') {
            return (
                <div style={{ ...baseStyle, backgroundColor: '#e9f7ef' }}>
                    <div style={{ ...cardStyle, border: '2px solid #28a745', backgroundColor: '#ffffff' }}>
                        <FaCheckCircle size={80} color="#28a745" />
                        <h1 style={{ color: '#28a745', marginTop: '15px' }}>Thanh toán thành công!</h1>
                        <p style={{ fontSize: '1.1em', color: '#333' }}>{message}</p>
                        {orderId && (
                             <p style={{ fontSize: '1em', color: '#666', fontWeight: 'bold' }}>Mã đơn hàng: {orderId}</p>
                        )}
                        <a 
                            href="/user/order-details" // Thay đổi đường dẫn này theo route trang đơn hàng của bạn
                            style={{ ...linkStyle, backgroundColor: '#28a745' }}
                        >
                            Xem chi tiết đơn hàng
                        </a>
                    </div>
                </div>
            );
        }

        if (paymentStatus === 'failure') {
            return (
                <div style={{ ...baseStyle, backgroundColor: '#fef3f4' }}>
                    <div style={{ ...cardStyle, border: '2px solid #dc3545', backgroundColor: '#ffffff' }}>
                        <FaTimesCircle size={80} color="#dc3545" />
                        <h1 style={{ color: '#dc3545', marginTop: '15px' }}>Thanh toán thất bại!</h1>
                        <p style={{ fontSize: '1.1em', color: '#333' }}>{message}</p>
                        <a 
                            href="/" // Thay đổi đường dẫn này nếu bạn muốn về trang giỏ hàng
                            style={{ ...linkStyle, backgroundColor: '#dc3545' }}
                        >
                            Quay về trang chủ
                        </a>
                        <a 
                            href="/user/order-details" // Link dự phòng để kiểm tra đơn hàng (nếu có)
                            style={{ ...linkStyle, backgroundColor: '#6c757d', marginLeft: '10px' }}
                        >
                            Trang đơn hàng
                        </a>
                    </div>
                </div>
            );
        }
    };

    return <>{renderContent()}</>;
}

export default ThanhCong;