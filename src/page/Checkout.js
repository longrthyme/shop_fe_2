import React, { useState, useEffect } from 'react';
import { FaShippingFast, FaMoneyBillWave } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { Form, Input, Select, Button, Typography, Card, Divider, Modal ,notification } from 'antd';
import { getTinhThanh, getQuanHuyen, getPhuongXa, getShip } from '../api/DiaChiApi';
import { findUserById } from "../api/UserApiForUser";
import { createCategory } from '../api/OrderApi';
import '../styles/CheckOut.css';

const { Title, Text } = Typography;
const { Option } = Select;

function Checkout() {
    const location = useLocation();
    const navigate = useNavigate();
    const itemsToCheckout = location.state?.items || [];
    const [formData, setFormData] = useState({});
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [vouchers, setVouchers] = useState([]);
    const [wards, setWards] = useState([]);
    const [discountCode, setDiscountCode] = useState('');
    const [discountValue, setDiscountValue] = useState(0);
    const [shippingFee, setShippingFee] = useState(null);
    const total = itemsToCheckout.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('COD'); // Mặc định là COD

    // Hàm xử lý khi người dùng chọn một phương thức khác
    const handlePaymentChange = (event) => {
        setSelectedPaymentMethod(event.target.value);
    };

    // Load cities when component mounts
    useEffect(() => {
        const loadVoucher = async () => {
            const response = await fetch("http://localhost:8022/api/v1/user/voucher/available?amount="+total, {
                method: 'GET'
            });
            if(response.status < 300){
                var result = await response.json();
                setVouchers(result)
            }
        };
        loadVoucher();
    }, []);

    useEffect(() => {
        const loadCities = async () => {
            try {
                const response = await getTinhThanh();
                setCities(Object.entries(response));
            } catch (error) {
                console.error('Failed to load cities:', error);
            }
        };
        loadCities();
    }, []);

    // Load districts when city changes
    useEffect(() => {
        if (formData.city) {
            const loadDistricts = async () => {
                try {
                    const response = await getQuanHuyen(formData.city);
                    setDistricts(Object.entries(response));
                    setFormData(prevData => ({ ...prevData, district: '', ward: '' })); // Reset district and ward
                    setShippingFee(null); // Reset shipping fee
                } catch (error) {
                    console.error('Failed to load districts:', error);
                }
            };
            loadDistricts();
        } else {

            setDistricts([]);
            setWards([]);
            setShippingFee(null);
        }
    }, [formData.city]);

    // Load wards when district changes
    useEffect(() => {
        if (formData.district) {
            const loadWards = async () => {
                try {
                    const response = await getPhuongXa(formData.district);
                    setWards(Object.entries(response));
                    setFormData(prevData => ({ ...prevData, ward: '' })); // Reset ward
                    setShippingFee(null); // Reset shipping fee
                } catch (error) {
                    console.error('Failed to load wards:', error);
                }
            };
            loadWards();
        } else {
            setWards([]);
            setShippingFee(null);
        }
    }, [formData.district]);

    // Calculate shipping fee when ward changes
    useEffect(() => {
        if (formData.ward) {
            const calculateShippingFee = async () => {
                const shipRequest = {
                    idQuanHuyen: formData.district,
                    idPhuongXa: formData.ward,
                    soLuongSanPham: itemsToCheckout.reduce((sum, item) => sum + item.quantity, 0),
                };
                try {
                    const response = await getShip(shipRequest);
                    setShippingFee(response);
                } catch (error) {
                    console.error('Failed to get shipping fee:', error);
                    setShippingFee(null);
                }
            };
            calculateShippingFee();
        } else {
            setShippingFee(null);
        }
    }, [formData.ward]);

    const handleSubmit = async (values) => {
        const orderRequest = {
            nguoiNhan: values.name,
            email: values.email,
            idTinhThanh: values.city,
            idQuanHuyen: values.district,
            idPhuongXa: values.ward,
            phone:values.phone,
            address: values.address,
            note: "",
            shippingFee: shippingFee || 0,
            voucherCode: discountCode,
            cartIdList: itemsToCheckout.map(item => item.id),
            type:"ONLINE"
        };

        try {
            const response = await createCategory(orderRequest);
            console.log('Order created successfully:', response);

            // Display success notification
            notification.success({
                message: 'Đặt hàng thành công',
                description: 'Đơn hàng của bạn đã được đặt thành công. Bạn sẽ được chuyển về lịch sử đặt hàng.',
                duration: 1,
            });

            // Redirect to the cart page after a short delay
            setTimeout(() => {
                navigate('/user/order-details');
            }, 2000); // Adjust the delay as needed
        } catch (error) {
            console.error('Order creation failed:', error);
            notification.error({
                message: 'Đặt hàng thất bại',
                description: `${error}`,
            });
        }
    };

    const requestPayment = async (values) => {
        const orderRequest = {
            nguoiNhan: values.name,
            email: values.email,
            idTinhThanh: values.city,
            idQuanHuyen: values.district,
            idPhuongXa: values.ward,
            phone:values.phone,
            address: values.address,
            note: "",
            shippingFee: shippingFee || 0,
            voucherCode: discountCode,
            cartIdList: itemsToCheckout.map(item => item.id),
            type:"ONLINE"
        };
        window.localStorage.setItem("orderDto", JSON.stringify(orderRequest))
        const response = await fetch("http://localhost:8022/api/v1/user/vnpay/urlpayment?totalAmount="+(total - discountValue + shippingFee), {
            method: 'POST'
        });
        alert(response.status)
        if(response.status < 300){
            var result = await response.text();
            window.open(result, '_blank');
        }
    };

    const handleVoucherSelect = (code, discount, voucher) => {
        if(voucher == null){
            setDiscountCode(null)
            setDiscountValue(0)
            return;
        }
        setDiscountCode(code);
        if(voucher.type == 'percent'){
            var dis = total * discount / 100
            if(dis > voucher.maxDiscount){
                dis = voucher.maxDiscount;
            }
            setDiscountValue(dis);
        }
        else{
            setDiscountValue(discount);
        }
    };
    // Load user data (fetch information from API)
    useEffect(() => {
        const loadUserData = async () => {
            try {
                const userResponse = await findUserById(); // Gọi API lấy thông tin người dùng
                const userData = {
                    name: userResponse.fullName,
                    email: userResponse.email,
                    phone: userResponse.phone,
                    address: userResponse.address,
                    city: userResponse.city || '', // Ensure city and district are set
                    district: userResponse.district || '',
                    ward: userResponse.ward || ''
                };
                setFormData(prevData => ({
                    ...prevData,
                    ...userData, // Update formData with user info
                }));
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        loadUserData();
    }, []);

    // Only render the form once the user data is loaded
    if (!formData.name) {
        return <div>Loading...</div>; // Hiển thị loading nếu dữ liệu người dùng chưa được tải
    }

    const { confirm } = Modal;

    const showConfirm = (values) => {
        confirm({
            title: "Xác nhận đặt hàng",
            content: `Bạn có chắc chắn muốn đặt đơn hàng với tổng tiền ${(total + (shippingFee || 0) - discountValue).toLocaleString()}₫ không?`,
            okText: "Xác nhận",
            cancelText: "Hủy",
            onOk() {
                if(selectedPaymentMethod == 'COD'){
                    return handleSubmit(values);
                }
                else{
                    return requestPayment(values)
                }
            },
            onCancel() {
                console.log("Hủy đặt hàng");
            },
        });
    };

    return (
        <div className="checkout-container">
            <Title level={2} style={{ textAlign: 'center' }}>Thông tin giao hàng</Title>
            <div className="checkout-content">
                <Form
                    layout="vertical"
                    className="checkout-form"
                    // onFinish={handleSubmit}
                    onFinish={(values) => showConfirm(values)} // gọi confirm thay vì handleSubmit
                    initialValues={formData}
                >
                    <Form.Item label="Tên người nhận" name="name" rules={[{ required: true, message: 'Vui lòng nhập Tên người nhận' }]}>
                        <Input placeholder="Tên người nhận" />
                    </Form.Item>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <Form.Item label="Email" name="email" style={{ flex: 1 }} rules={[{ required: true, message: 'Vui lòng nhập email' }]}>
                            <Input placeholder="Email" type="email" />
                        </Form.Item>
                        <Form.Item label="Số điện thoại" name="phone" style={{ flex: 1 }} rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}>
                            <Input placeholder="Số điện thoại" type="tel" />
                        </Form.Item>
                    </div>

                    <Form.Item label="Địa chỉ chi tiết" name="address" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ chi tiết' }]}>
                        <Input placeholder="Địa chỉ chi tiết" />
                    </Form.Item>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <Form.Item label="Tỉnh / thành" name="city" style={{ flex: 1 }} rules={[{ required: true, message: 'Vui lòng chọn tỉnh/thành' }]}>
                            <Select
                                placeholder="Chọn Tỉnh / thành"
                                onChange={value => {
                                    setFormData({ ...formData, city: value, district: '', ward: '' });
                                    setDistricts([]);
                                    setWards([]);
                                }}
                            >
                                {cities.map(([id, name]) => (
                                    <Option key={id} value={id}>{name}</Option>
                                ))}
                            </Select>

                        </Form.Item>
                        <Form.Item label="Quận / huyện" name="district" style={{ flex: 1 }} rules={[{ required: true, message: 'Vui lòng chọn quận/huyện' }]}>
                            <Select
                                placeholder="Chọn Quận / huyện"
                                onChange={value => {
                                    setFormData({ ...formData, district: value, ward: '' });
                                    setWards([]);
                                }}
                            >
                                {districts.map(([id, name]) => (
                                    <Option key={id} value={id}>{name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item label="Phường / xã" name="ward" style={{ flex: 1 }} rules={[{ required: true, message: 'Vui lòng chọn phường/xã' }]}>
                            <Select
                                placeholder="Phường / xã"
                                onChange={value => setFormData({ ...formData, ward: value })}
                            >
                                {wards.map(([id, name]) => (
                                    <Option key={id} value={id}>{name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>

                    <Title level={3}>Phương thức vận chuyển</Title>
                    <Card className="shipping-method" style={{ textAlign: 'center' }}>
                        <FaShippingFast size={40} />
                        <Text style={{ marginLeft: '10px' }}>
                            {shippingFee !== null ? `Phí vận chuyển: ${shippingFee.toLocaleString()}₫` : 'Vui lòng chọn địa chỉ để xác định phí vận chuyển'}
                        </Text>
                    </Card>

                    <div>
                    <h3>💳 Phương thức thanh toán</h3>
                    
                    {/* Thanh toán khi nhận hàng (COD) */}
                    <div className="payment-method-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                        <input 
                        type="radio"
                        id="cod-payment"
                        name="paymentMethod" // Quan trọng: Tên phải giống nhau để chỉ chọn được 1
                        value="COD"
                        checked={selectedPaymentMethod === 'COD'}
                        onChange={handlePaymentChange}
                        style={{ transform: 'scale(1.5)' }} // Phóng to input radio cho dễ nhìn
                        />
                        <label htmlFor="cod-payment" style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                        <FaMoneyBillWave size={20} style={{ color: selectedPaymentMethod === 'COD' ? 'green' : 'gray' }} />
                        <span>**Thanh toán khi nhận hàng (COD)**</span>
                        </label>
                    </div>

                    {/* Thanh toán qua VNPAY */}
                    <div className="payment-method-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input
                        type="radio"
                        id="vnpay-payment"
                        name="paymentMethod" // Quan trọng: Tên phải giống nhau
                        value="VNPAY"
                        checked={selectedPaymentMethod === 'VNPAY'}
                        onChange={handlePaymentChange}
                        style={{ transform: 'scale(1.5)' }}
                        />
                        <label htmlFor="vnpay-payment" style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                        <FaMoneyBillWave size={20} style={{ color: selectedPaymentMethod === 'VNPAY' ? 'green' : 'gray' }} /> 
                        <span>**Thanh toán qua VNPAY**</span>
                        </label>
                    </div>

                    {/* Thông tin hiển thị để kiểm tra */}
                    <p style={{ marginTop: '20px', fontWeight: 'bold' }}>
                        Phương thức đã chọn: {selectedPaymentMethod}
                    </p>
                    </div>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="btn-submit" style={{ width: '100%', marginTop: '20px' }}>
                            Hoàn tất đơn hàng
                        </Button>
                    </Form.Item>
                </Form>

                <Card className="cart-summary">
                    <Title level={3}>Danh sách sản phẩm</Title>
                    {itemsToCheckout.map((item) => (
                        <div key={item.id} className="cart-item" style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                            <div className="product-image-container">
                                <img src={item.imageUrl || 'https://via.placeholder.com/60'} alt={item.name} className="product-image" />
                                <span className="quantity-badge">{item.quantity}</span>
                            </div>
                            <div className="item-details">
                                <Text>{item.name}</Text><br></br>
                                <strong className='d-block'>Màu: {item.color} - size: {item.size}</strong>
                                <Text>{item.price.toLocaleString()}₫</Text>
                            </div>
                        </div>
                    ))}

                    {/*<div className="discount-section" style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>*/}
                    {/*    <Input placeholder="Mã giảm giá" value={discountCode} onChange={(e) => setDiscountCode(e.target.value)} />*/}
                    {/*    <Button>Sử dụng</Button>*/}
                    {/*</div>*/}

                    <Divider />
                    
                    <div className="summary-total">
                        <Text>Tạm tính: <span>{total.toLocaleString()}₫</span></Text><br></br>
                        <Text>Phí vận chuyển: <span>{shippingFee !== null ? shippingFee.toLocaleString() : 'Chưa xác định'}₫</span></Text><br></br>
                        <div>
                            <div className="card mb-3 shadow-sm">
                                <div className="card-header bg-primary text-white">
                                    <h5 className="mb-0">🎁 Chọn Voucher Khuyến Mãi</h5>
                                </div>
                                <div className="card-body p-0">
                                    <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                                        {vouchers.length === 0 ? (
                                            <div className="p-3 text-muted text-center">
                                                Không có voucher nào khả dụng.
                                            </div>
                                        ) : (
                                            <ul className="list-group list-group-flush">
                                                {vouchers.map((item) => {
                                                    const isSelected = item.code === discountCode;
                                                    return (
                                                        <li 
                                                            key={item.id} 
                                                            className={`list-group-item d-flex justify-content-between align-items-center voucher-item ${isSelected ? 'active bg-info bg-opacity-10 border-info border-start border-5' : ''}`}
                                                            onClick={() => handleVoucherSelect(item.code, item.discount, item)}
                                                            style={{ cursor: 'pointer' }}
                                                        >
                                                            <div className="d-flex align-items-center">
                                                                {/* Icon Check/Uncheck */}
                                                                {isSelected ? (
                                                                    <i className="bi bi-check-circle-fill text-success me-2 fs-5"></i>
                                                                ) : (
                                                                    <i className="bi bi-circle text-muted me-2 fs-5"></i>
                                                                )}
                                                                {/* Nội dung Voucher */}
                                                                <div className="text-start">
                                                                    <p className="mb-0 fw-bold">Voucher: {item.code}</p>
                                                                    {item.type == 'money' && (
                                                                        <small className={`text-muted ${isSelected ? 'fw-bold' : ''}`}>
                                                                            Giảm: **{(item.discount).toLocaleString()} VNĐ**
                                                                        </small>
                                                                    )}
                                                                    {item.type == 'percent' && (
                                                                        <small className={`text-muted ${isSelected ? 'fw-bold' : ''}`}>
                                                                            Giảm: **{item.discount} % - tối đa {(item.maxDiscount).toLocaleString()} VNĐ**
                                                                        </small>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            {/* Badge hiển thị đã chọn */}
                                                            {isSelected && (
                                                                <span className="badge bg-success rounded-pill">Đã chọn</span>
                                                            )}
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        )}
                                    </div>
                                </div>

                                {/* Nút Hủy chọn (Chỉ hiện khi có voucher đang được chọn) */}
                                {discountCode && (
                                    <div className="card-footer text-end">
                                        <button 
                                            className="btn btn-sm btn-outline-secondary"
                                            onClick={() => handleVoucherSelect('', 0, null)}
                                        >
                                            Hủy chọn Voucher
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <Title level={4}>Tổng cộng: <span>{(total + (shippingFee || 0) - discountValue).toLocaleString()}₫</span></Title>
                    </div>
                </Card>
            </div>
        </div>
    );
}

export default Checkout;
