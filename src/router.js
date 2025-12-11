import React from 'react';
import {Routes, Route} from 'react-router-dom';
import Home from './component/Home';
import Dashboard from "./component/dashboardmanagrement/Dashboard";
import AddProduct from './component/productmanagement/AddProduct';
import Material from './component/materialmanagement/Index';
import Tag from './component/tagmanagement/Index';
import TrangChu from './Backgroudwed/backgroudTrangChu/HomeTrangchu';
import {Color, Category, Brands, Size, Products, Voucher} from './component';
import {CartItem, Checkout, OrderManagerPage,ThanhCong} from './page/index';
import {LoginPage, RegisterPage, ForgotPasswordPage} from "./page/index";
import IndexProductDetail from './Backgroudwed/backgroudTrangChu/ProductDetail/Index.js';
import Collections from './Backgroudwed/backgroudTrangChu/Collections';
import IndexSales from "./Backgroudwed/backgroudTrangChu/Sales/Index";
import ThanhCongAdmin from "./Backgroudwed/backgroudTrangChu/Sales/Checkpayment.js";
import ProtectedRoute from './ProtectedRoute'; // Import ProtectedRoute
import OrderManagement from './page/UserOrderManagement';
import Employee from './component/employeemanagement/index';
import User from './component/usermanagement/index';
import PDHistoryTable from './component/pdquantityhistorymanagement/index'
import {AdminOrderDetail,UserOrderDetail} from "./page";
import UserAccountForm from "./Backgroudwed/UserForm/userform";
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';


function Router() {

    const location = useLocation();

    useEffect(() => {
        const titleMap = {
            "/": "Trang chủ",
            "/login": "Đăng nhập",
            "/register": "Đăng ký",
            "/forgot-password": "Quên mật khẩu",
            "/wed/collections": "Bộ sưu tập",
            "/wed/trangchu": "Trang chủ",
            "/admin/dashboard": "Bảng điều khiển",
            "/admin/user": "QL Người dùng",
            "/admin/employee": "QL Nhân viên",
            "/admin/addproduct": "Thêm sản phẩm",
            "/admin/product": "QL Sản phẩm",
            "/admin/category": "QL Danh mục",
            "/admin/material": "QL Chất liệu",
            "/admin/tag": "QL Tag",
            "/admin/color": "QL Màu sắc",
            "/admin/size": "QL Kích cỡ",
            "/admin/voucher": "QL Khuyến mãi",
            "/admin/sales": "QL Giảm giá",
            "/admin/history": "Lịch sử sản phẩm",
            "/admin/order": "QL Đơn hàng",
            "/user/cart": "Giỏ hàng",
            "/user/checkout": "Thanh toán",
            "/user/order-details": "Đơn hàng",
            "/user/account": "Tài khoản",
        };

        const basePath = location.pathname.split("/").slice(0, 3).join("/");
        document.title = titleMap[basePath] || "Hệ thống quản lý bán hàng";
    }, [location.pathname]);


    return (
        <Routes>
            <Route path="/" element={<TrangChu/>}/>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/register" element={<RegisterPage/>}/>
            <Route path="/forgot-password" element={<ForgotPasswordPage/>}/>

            {/* Các route không yêu cầu quyền truy cập đặc biệt */}
            <Route path="/product/:id" element={<IndexProductDetail/>}/>
            <Route path="/wed/collections" element={<Collections/>}/>
            <Route path="/wed/trangchu" element={<TrangChu/>}/>
            {/*<Route path="/wed/order-details" element={<OrderUserDetail />} />*/}
            {/*<Route path="/wed/sales" element={<IndexSales />} />*/}

            {/* Route cho người dùng đã đăng nhập */}
            <Route path="/user">
                <Route path="cart" element={
                    <ProtectedRoute role="USER">
                        <CartItem/>
                    </ProtectedRoute>
                }/>
                <Route path="checkout" element={
                    <ProtectedRoute role="USER">
                        <Checkout/>
                    </ProtectedRoute>
                }/>
                <Route path="checkpayment" element={
                    <ProtectedRoute role="USER">
                        <ThanhCong/>
                    </ProtectedRoute>
                }/>
                <Route path="order-details" element={
                    <ProtectedRoute role="USER">
                        <OrderManagement/>
                    </ProtectedRoute>
                }/>
                <Route path="order-details/:id" element={
                    <ProtectedRoute role="USER">
                        <UserOrderDetail/>
                    </ProtectedRoute>
                }/>
                <Route path="account" element={
                    <ProtectedRoute role="USER">
                        <UserAccountForm/>
                    </ProtectedRoute>
                }/>
            </Route>

            {/* Route dành riêng cho admin */}
            <Route path="/admin" element={
                <ProtectedRoute role={["ADMIN", "EMPLOYEE"]}>
                    <Home/>
                </ProtectedRoute>
            }>
                <Route path="dashboard" element={
                    <ProtectedRoute role={["ADMIN", "EMPLOYEE"]}>
                        <Dashboard/>
                    </ProtectedRoute>
                }/>
                <Route path="user" element={
                    <ProtectedRoute role={["ADMIN", "EMPLOYEE"]}>
                        <User/>
                    </ProtectedRoute>
                }/>
                <Route path="employee" element={
                    <ProtectedRoute role="ADMIN">
                        <Employee/>
                    </ProtectedRoute>
                }/>
                <Route path="/admin/order/:id" element={
                    <ProtectedRoute role="ADMIN">
                        <AdminOrderDetail />
                    </ProtectedRoute>
                } />

                <Route path="brand" element={
                    <ProtectedRoute role={["ADMIN", "EMPLOYEE"]}>
                        <Brands/>
                    </ProtectedRoute>
                }/>
                <Route path="addproduct" element={
                    <ProtectedRoute role={["ADMIN", "EMPLOYEE"]}>
                        <AddProduct/>
                    </ProtectedRoute>
                }/>
                <Route path="product" element={
                    <ProtectedRoute role={["ADMIN", "EMPLOYEE"]}>
                        <Products/>
                    </ProtectedRoute>
                }/>
                <Route path="category" element={
                    <ProtectedRoute role={["ADMIN", "EMPLOYEE"]}>
                        <Category/>
                    </ProtectedRoute>
                }/>
                <Route path="material" element={
                    <ProtectedRoute role={["ADMIN", "EMPLOYEE"]}>
                        <Material/>
                    </ProtectedRoute>
                }/>
                <Route path="tag" element={
                    <ProtectedRoute role={["ADMIN", "EMPLOYEE"]}>
                        <Tag/>
                    </ProtectedRoute>
                }/>
                <Route path="color" element={
                    <ProtectedRoute role={["ADMIN", "EMPLOYEE"]}>
                        <Color/>
                    </ProtectedRoute>
                }/>
                <Route path="size" element={
                    <ProtectedRoute role={["ADMIN", "EMPLOYEE"]}>
                        <Size/>
                    </ProtectedRoute>
                }/>
                <Route path="voucher" element={
                    <ProtectedRoute role={["ADMIN", "EMPLOYEE"]}>
                        <Voucher/>
                    </ProtectedRoute>
                }/>

                <Route path="sales" element={
                    <ProtectedRoute role={["ADMIN", "EMPLOYEE"]}>
                        <IndexSales/>
                    </ProtectedRoute>
                }/>
                <Route path="checkpayment" element={
                    <ProtectedRoute role={["ADMIN", "EMPLOYEE"]}>
                        <ThanhCongAdmin/>
                    </ProtectedRoute>
                }/>

                <Route path="history" element={
                    <ProtectedRoute role={["ADMIN", "EMPLOYEE"]}>
                        <PDHistoryTable/>
                    </ProtectedRoute>
                }/>

                <Route path="order" element={
                    <ProtectedRoute role="ADMIN">
                        <OrderManagerPage />
                    </ProtectedRoute>
                } />

            </Route>
        </Routes>
    );
}

export default Router;
