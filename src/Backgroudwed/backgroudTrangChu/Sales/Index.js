import React, {useEffect, useState} from 'react';
import ProductList from '../Sales/ProductList';
import CustomerInfo from '../Sales/CustomerInfo';
import VoucherSection from '../Sales/VoucherSection';
import Summary from '../Sales/Summary';
import '../../../assets/css/sales.css';
import NhanHang from "../Sales/NhanHang";

function IndexSales() {
    const [productsData, setProductsData] = useState({});
    const [discount, setDiscount] = useState(0);
    const [activeTab, setActiveTab] = useState("1");
    const [voucherId, setVoucherId] = useState(null);
    const [shippingMethod, setShippingMethod] = useState("store");
    const [customerInfo, setCustomerInfo] = useState({}); // Thêm customerInfo
    const [resetTrigger, setResetTrigger] = useState(false);
    const handleProductsDataChange = (newProductsData) => {
        setProductsData(newProductsData);
    };

    useEffect(() => {
        document.title = "Quần áo nam "; // 🏷️ Set the tab title here
    }, []);

    const handleActiveTabChange = (tab) => {
        setActiveTab(tab);
        setDiscount(0); // Reset discount khi chuyển tab
    };

    const calculateTotal = () => {
        return (productsData[activeTab] || []).reduce((total, product) => {
            return total + (product.price * product.quantity);
        }, 0);
    };

    const handleShippingMethodChange = (method) => {
        console.log("Shipping method selected:", method);
        setShippingMethod(method);
    };

    const total = calculateTotal();
    const resetFormData = () => {
        // Reset tất cả các dữ liệu liên quan đến form

        setDiscount(0);
        setResetTrigger(prev => !prev);
        setVoucherId(null);
        setShippingMethod("store");


    };
    return (
        <div className="app-container">
            <div className="product-section">
                <ProductList
                    onProductsDataChange={handleProductsDataChange}
                    onActiveTabChange={handleActiveTabChange}

                />
                <NhanHang onShippingMethodChange={handleShippingMethodChange} />
            </div>
            <div className="sidebar">
                <CustomerInfo setCustomerInfo={setCustomerInfo}  /> {/* Truyền setCustomerInfo vào CustomerInfo */}
                <VoucherSection total={total} setDiscount={setDiscount} setVoucherId={setVoucherId} activeTab={activeTab} />
                <Summary
                    total={total}
                    discount={discount}
                    activeTab={activeTab}
                    voucherId={voucherId}
                    productsData={productsData}
                    shippingMethod={shippingMethod}
                    setProductsData={setProductsData}
                    customerInfo={customerInfo} // Truyền customerInfo vào Summary
                    resetFormData={resetFormData}
                />
            </div>
        </div>
    );
}

export default IndexSales;
