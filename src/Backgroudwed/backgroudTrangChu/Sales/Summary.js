import React, { useEffect,useState } from 'react';
import {Button, Modal, Input, Checkbox, Row, Col, message,Radio} from 'antd';
import { QRCode } from 'antd';
import axios from "axios";



import productDetail from "../ProductDetail/ProductDetail";
import { json } from 'react-router-dom';

const Summary = ({  total, discount, activeTab,productsData, voucherId ,shippingMethod ,customerInfo ,resetFormData}) => {

    const [shippingFee, setShippingFee] = useState(shippingMethod === "store" ? 0 : 20000);
    const [cashGiven, setCashGiven] = useState(0);
    const [change, setChange] = useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { confirm } = Modal;
    useEffect(() => {
        console.log("Current shipping method in Summary:", shippingMethod); // Kiểm tra giá trị của shippingMethod
        setShippingFee(shippingMethod === "store" ? 0 : 20000); // Cập nhật phí ship
    }, [shippingMethod]);
    const handleCashGivenChange = (e) => {
        const value = parseFloat(e.target.value) || 0;
        setCashGiven(value);
        setChange(value - finalTotal); // Calculate change
    };
    const handleConfirmCheckout = (onConfirm) => {
        confirm({
            title: 'Xác nhận hoàn thành',
            content: 'Bạn có chắc chắn muốn hoàn thành đơn hàng này?',
            okText: 'Xác nhận',
            cancelText: 'Hủy',
            onOk: () => {
                onConfirm(); // Gọi hàm `handleCheckout`
            },
            onCancel: () => {
                message.info('Hành động đã bị hủy.');
            },
        });
    };


    async function urlVnpay() {
        const products = productsData[activeTab] || [];
        if (!products.length) {
            message.error("Giỏ hàng trống. Vui lòng chọn sản phẩm.");
            return;
        }
        const orderDetails = (productsData[activeTab] || []).map(product => ({
            productDetailId: product.productDetailId,
            price: product.price,
            quantity: product.quantity,
            total: product.price * product.quantity
        }));
        const payload = {
            userId: customerInfo?.id || null,
            discount: discount,
            finalTotal: finalTotal,
            status: 'COMPLETED',
            shippingFee: shippingFee,
            paymentMethod: 2,
            voucherId: voucherId, 
            orderDetails: orderDetails
        };
        const token = localStorage.getItem("access_token");
        const response = await axios.post("http://localhost:8022/api/v1/user/vnpay/urlpayment-admin?totalAmount="+finalTotal, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        var url = await response.data;
        window.localStorage.setItem("orderDtoAdmin", JSON.stringify(payload))
        window.open(url, '_blank');
    }

    const handleCheckout = async () => {

        const paymentMethod = paymentMethods.cash ? 1 : paymentMethods.transfer ? 2 : null;
        const status = 'COMPLETED';

        if (!paymentMethod) {
            message.error("Vui lòng chọn phương thức thanh toán.");
            return;
        }
        const products = productsData[activeTab] || [];
        if (!products.length) {
            message.error("Giỏ hàng trống. Vui lòng chọn sản phẩm.");
            return;
        }
        const orderDetails = (productsData[activeTab] || []).map(product => ({
            productDetailId: product.productDetailId,
            price: product.price,
            quantity: product.quantity,
            total: product.price * product.quantity
        }));

        const payload = {

            userId: customerInfo?.id || null,
            discount: discount,
            finalTotal: finalTotal,
            status: status,
            shippingFee: shippingFee,
            paymentMethod: paymentMethod,
            voucherId: voucherId, // Truyền voucherId vào payload
            orderDetails: orderDetails
        };

        try {
            const token = localStorage.getItem("access_token");
            const response = await axios.post("http://localhost:8022/api/v1/sell/order", payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("Order created successfully:", response.data);
            message.success("Thanh toán thành công!");
            setIsModalVisible(false);
            resetFormData();
            // printReceipt(); // Gọi hàm in hóa đơn
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            console.error("Failed to create order:", error);
            message.error("Thanh toán thất bại. Vui lòng thử lại.");
        }
    };


    const [paymentMethods, setPaymentMethods] = useState({
        cash: true,
        transfer: false,
    });



    const [finalTotal, setFinalTotal] = useState(total - discount);

    useEffect(() => {
        setFinalTotal(total - discount + shippingFee);
    }, [total, discount, shippingFee]);




    const printReceipt = () => {
        const printWindow = window.open('', '_blank', 'width=1000,height=800');

        // Ensure productsData[activeTab] is an array
        const products = Array.isArray(productsData[activeTab]) ? productsData[activeTab] : [];

        const content = `
    <html>
    <head>
        <title>In Hóa Đơn</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body, html {
                width: 100%;
                height: 100%;
                font-family: Arial, sans-serif;
                color: #000;
                background-color: #fff;
              
                padding: 40px 40px 400px 40px;
            }
            .flex-container {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 5px;
            }
            .flex-container > div {
                flex: 1;
                padding: 0 10px;
            }
            .flex-container .left {
                max-width: 15%;
            }
            .flex-container .center {
                max-width: 60%;
                text-align: center;
            }
            .flex-container .right {
                max-width: 25%;
                text-align: left;
            }
            hr {
                margin: 10px 0;
                border: none;
                border-top: 1px solid #000;
            }
            .details {
                font-size: 16px;
                margin-bottom: 20px;
            }
            .table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
            }
            .table th, .table td {
                border: 1px solid #000;
                padding: 8px;
                text-align: center;
            }
            .total-section {
               padding-left: 50%;
                margin-top: 10px;
                text-align: left;
            }
            .footer {
                font-size: 12px;
                text-align: center;
                margin-top: 20px;
                color: #555;
            }
        </style>
    </head>
    <body>
        <div class="flex-container">
            <div class="left">
                <img src="/Images/image/black_tees.png" alt="Logo" style="max-width: 60%;">
            </div>
            <div class="center">
                <h2>Hóa Đơn Giá Trị Gia Tăng</h2>
                <span style="{{color: pink}}">( Invoice )</span>
                <p><strong>Ngày xuất hóa đơn:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            <div class="right" >
                <p>Mẫu Số: 07812</p>
                <p>Ký Hiệu: TS/20E</p>
                <p>Số     : 008923</p>
            </div>
        </div>
        <hr />
        <div class="flex-container">
            <div class="right" style="{{text-align: right}}">
                <p>Đơn vị bán hàng:</p>
                <p>Mã số thuế:</p>
                <p>Địa chỉ:</p>
                <p>Điện thoại:</p>
                <p>Số tài khoản:</p>
            </div>
            <div style="{{text-align: left}}">
                <p>CÔNG TY TNHH SHOP OWENN </p>
                <p>0302827</p>
                <p>286 Nguyễn Xiển phường Hạ Đình, Hà Nội</p>
                <p>0797989999</p>
                <p>0232378126731 tại Ngân Hàng TMCP Ngoại Thương</p>
            </div>
        </div>
        <hr />
        <div class="details">
            <p><strong>Khách Hàng:</strong> ${customerInfo?.fullName || 'Khách Lẻ'}</p>
            <p>Địa Chỉ: ${customerInfo?.address || ''}</p>
            <p>Điện Thoại: ${customerInfo?.phone || ''}</p>
            <p>Phương thức thanh toán: ${paymentMethods.cash ? "Tien Mat":"Chuyen Khoan"}</p>
        </div>
        <table class="table">
            <thead>
                <tr>
                    <th>STT</th>
                    <th>SẢN PHẨM</th>
                    <th>SỐ LƯỢNG</th>
                    <th>THÀNH TIỀN</th>
                </tr>
            </thead>
            <tbody>
                ${products.map((product, index) => `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${product.name}</td>
                        <td>${product.quantity}</td>
                        <td>${(product.price * product.quantity).toLocaleString()} VND</td>
                    </tr>
                `).join('') || '<tr><td colspan="4">Không có sản phẩm</td></tr>'}
            </tbody>
        </table>
        <div class="total-section">
            <p>Cộng tiền hàng (Total): ${total.toLocaleString()} VND</p>
            <p>Giảm Giá (Discount): ${discount.toLocaleString()} VND</p>
            <p><strong>Tổng cộng tiền thanh toán: ${finalTotal.toLocaleString()} VND</strong></p>
        </div>
        <div class="footer">
            <p><strong>Cảm Ơn!</strong></p>
           
        </div>
    </body>
    </html>
    `;

        printWindow.document.open();
        printWindow.document.write(content);
        printWindow.document.close();
       printWindow.print();

    };

    const showModal = () => {
       const products = productsData[activeTab] || [];
        if (!products.length) {
            message.error("Giỏ hàng trống. Vui lòng chọn sản phẩm.");
            return;
        }
        setIsModalVisible(true);
    };



    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handlePaymentMethodChange = (method) => {
        setPaymentMethods({
            cash: method === "cash",
            transfer: method === "transfer",
        });
    };

    return (
        <div>
            <div className={"Money"}>
                <div className={"MoneyFrom"}>
                    <span>Tổng tiền:</span>
                    <span>{total.toLocaleString()} VND</span>
                </div>
                <div className="MoneyFrom">
                    <span>Phí Ship:</span>
                    <span>{shippingFee.toLocaleString()} VND</span>
                </div>
                <hr style={{margin: '10px 0', border: 'none', borderTop: '1px solid #ccc'}}/>
                <div className={"MoneyFrom"}>
                    <span>Giảm giá:</span>
                    <span>{discount.toLocaleString()} VND</span>
                </div>
                <hr style={{margin: '10px 0', border: 'none', borderTop: '1px solid #ccc'}}/>

                <div className={"MoneyFrom"}>
                <span>Thực thu:</span>
                    <span>{finalTotal.toLocaleString()} VND</span>
                </div>
            </div>
            <hr/>
            <div>
                <Button style={{width: '100%', backgroundColor: "blue", color: '#fff'}} onClick={showModal} >
                Thanh Toán tièn mặt
                </Button>
                <Button style={{width: '100%', backgroundColor: "blue", color: '#fff'}} onClick={urlVnpay} >
                Thanh Toán vnpay
                </Button>
            </div>

            {/* Modal Thanh Toán */}
            <Modal
                title="Thanh Toán"
                visible={isModalVisible}
                onOk={handleCheckout}
                onCancel={handleCancel}
                width={850}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Đóng
                    </Button>,
                    <Button key="submit" type="primary"   onClick={() => handleConfirmCheckout(handleCheckout)} disabled={paymentMethods.cash && cashGiven < finalTotal}>
                        Hoàn Thành
                    </Button>,
                ]}
            >
                <Row gutter={24}>
                    <Col span={8}>
                        <h4>Loại Thanh Toán</h4>
                        <Radio.Group>
                            <Radio
                                value="cash"
                                onChange={() => handlePaymentMethodChange("cash")}
                                checked={paymentMethods.cash}
                            >
                                Tiền Mặt
                            </Radio>
                            {/* <br />
                            <Radio
                                value="transfer"
                               onChange={() => handlePaymentMethodChange("transfer")}
                                checked={paymentMethods.transfer}
                            >
                                Chuyển Khoản
                            </Radio> */}
                        </Radio.Group>

                    </Col>
                    {/*<Col span={8}>*/}
                    {/*    <h4>Loại Thanh Toán</h4>*/}
                    {/*    <Checkbox*/}
                    {/*        checked={paymentMethods.cash}*/}
                    {/*        onChange={() => handlePaymentMethodChange("cash")}*/}
                    {/*    >*/}
                    {/*        Tiền Mặt*/}
                    {/*    </Checkbox>*/}
                    {/*    <br/>*/}
                    {/*    <Checkbox*/}
                    {/*        checked={paymentMethods.transfer}*/}
                    {/*        onChange={() => handlePaymentMethodChange("transfer")}*/}
                    {/*    >*/}
                    {/*        Chuyển Khoản*/}
                    {/*    </Checkbox>*/}
                    {/*</Col>*/}

                    <Col span={10}>
                        <h4>Tính Tiền</h4>
                        <div style={{marginBottom: '10px'}}>
                            <span>Tổng Tiền</span>
                            <Input disabled value={finalTotal.toLocaleString()} suffix="VND"/>
                        </div>

                        {paymentMethods.cash && (
                            <div style={{marginBottom: '10px'}}>
                                <span>Tiền Mặt Khách Đưa</span>
                                <Input
                                    placeholder="Nhập số tiền mặt"
                                    suffix="VND"
                                    value={cashGiven || ''}
                                    onChange={handleCashGivenChange} // Update state on input change
                                />

                                <div style={{marginBottom: '10px'}}>
                                    <span>Tiền Thừa</span>
                                    <Input
                                        disabled
                                        value={change > 0 ? change.toLocaleString() : '0'} // Display positive change only
                                        suffix="VND"
                                    />
                                </div>
                                {/*<div style={{marginBottom: '10px'}}>*/}
                                {/*    <span>Tiền Thiếu</span>*/}
                                {/*    <Input*/}
                                {/*        disabled*/}
                                {/*        value={change < 0 ? Math.abs(change).toLocaleString() : '0'} // Display absolute value if change is negative*/}
                                {/*        suffix="VND"*/}
                                {/*    />*/}
                                {/*</div>*/}
                            </div>
                        )}

                        {paymentMethods.transfer && (
                            <>
                                <div style={{marginBottom: '10px'}}>
                                    <span>Tiền Chuyển Khoản</span>
                                    <Input placeholder="Nhập số tiền chuyển khoản" suffix="VND"/>
                                </div>
                                {/*<div style={{marginBottom: '10px'}}>*/}
                                {/*    <span>Mã Giao Dịch</span>*/}
                                {/*    <Input placeholder="Nhập mã giao dịch"/>*/}
                                {/*</div>*/}
                            </>
                        )}

                        {/*<div style={{marginBottom: '10px'}}>*/}
                        {/*    <span>Tiền Thừa</span>*/}
                        {/*    <Input*/}
                        {/*        disabled*/}
                        {/*        value={change > 0 ? change.toLocaleString() : '0'} // Display positive change only*/}
                        {/*        suffix="VND"*/}
                        {/*    />*/}
                        {/*</div>*/}
                        {/*<div style={{marginBottom: '10px'}}>*/}
                        {/*    <span>Tiền Thiếu</span>*/}
                        {/*    <Input*/}
                        {/*        disabled*/}
                        {/*        value={change < 0 ? Math.abs(change).toLocaleString() : '0'} // Display absolute value if change is negative*/}
                        {/*        suffix="VND"*/}
                        {/*    />*/}
                        {/*</div>*/}
                    </Col>

                    <Col span={6} style={{textAlign: 'center'}}>
                        {paymentMethods.transfer && (
                            <div style={{marginTop: '90px'}}>
                                <h4 style={{fontSize: '12px'}}>Quét QR chuyển khoản</h4>
                                <QRCode
                                    value="https://example.com/payment"
                                    size={130}
                                    icon="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
                                    style={{marginLeft: '28px'}}
                                />
                                <p style={{fontSize: '14px', fontWeight: 'bold'}}>Shop QuickBuy</p>

                            </div>
                        )}
                    </Col>

                </Row>
            </Modal>

        </div>
    );
};

export default Summary;
