import React, { useState, useEffect } from 'react';
import {
    AppstoreOutlined,
    PieChartOutlined,
    CreditCardOutlined,
    TeamOutlined,
    AppstoreAddOutlined,
    FontSizeOutlined,
    StarOutlined,
    BgColorsOutlined,
    LineChartOutlined,
    FileTextOutlined,
    ProductOutlined,
    FrownOutlined
} from '@ant-design/icons';
import { Button, Menu } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import '../styles/home.css';

const items = [
    { key: '2', icon: <LineChartOutlined />, label: 'Thống Kê' },
    { key: '3', icon: <CreditCardOutlined />, label: 'Quản lý Voucher' },
    { key: '4', icon: <TeamOutlined />, label: 'Quản lý Nhân Viên' },
    { key: '20', icon: <TeamOutlined />, label: 'Quản lý Khách Hàng' },
    {
        key: 'sub1', label: 'Quản lý', icon: <AppstoreOutlined />, children: [
            { key: '7', icon: <StarOutlined />, label: 'Thương Hiệu' },
            { key: '8', icon: <BgColorsOutlined />, label: 'Màu Sắc' },
            { key: '9', icon: <FontSizeOutlined />, label: 'Kích Thước' },
            { key: '10', icon: <AppstoreAddOutlined />, label: 'Thể Loại' },
            { key: '13', icon: <ProductOutlined />, label: 'Chất Liệu' },
            { key: '11', icon: <ProductOutlined />, label: 'Sản Phẩm' },
        ]
    },
    { key: '6', icon: <FileTextOutlined />, label: 'Quản lý Đơn Hàng' },
    { key: '14', icon: <TeamOutlined />, label: 'Quay về trang chủ' },
    { key: '15', icon: <FrownOutlined />, label: 'Bán Hàng' }
];

const Home = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [isSalesMode, setIsSalesMode] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedKeys, setSelectedKeys] = useState(['2']);

    const toggleCollapsed = () => setCollapsed(!collapsed);

    useEffect(() => {
        if (location.pathname === '/admin') {
            navigate('/admin/dashboard');
        }
        if (location.pathname === '/admin/sales') {
            setIsSalesMode(true);
            setCollapsed(true);
        } else {
            setIsSalesMode(false);
            setCollapsed(false);
        }
    }, [location, navigate]);

    const onMenuClick = (e) => {
        const routes = {
            '1': '/admin/accounts',
            '2': '/admin/dashboard',
            '3':'/admin/voucher',
            '4':'/admin/employee',
            '6':'/admin/order',
            '8': '/admin/color',
            '10': '/admin/category',
            '7': '/admin/brand',
            '9': '/admin/size',
            '11': '/admin/product',
            '13': '/admin/material',
            '14': '/wed/trangchu',
            '15': '/admin/sales',
            '20':'/admin/user',
        };

        const path = routes[e.key];
        if (path) navigate(path);

        if (e.key === '15') setIsSalesMode(true);
        else setIsSalesMode(false);
    };

    return (
        <div style={{ display: 'flex' }}>
            {/* Sidebar cố định */}
            {!isSalesMode && (
                <div
                    style={{
                        position: 'fixed',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: collapsed ? 80 : 256,
                        transition: 'width 0.3s',
                        overflow: 'hidden',
                        background: '#001529',
                        padding: '16px 0',
                        zIndex: 1000,
                    }}
                >
                    <Button
                        type="primary"
                        onClick={toggleCollapsed}
                        style={{ marginBottom: 16, marginLeft: collapsed ? 8 : 16 }}
                    >
                        {collapsed ? '>' : '<'}
                    </Button>

                    <Menu
                        defaultSelectedKeys={['2']}
                        defaultOpenKeys={['sub1']}
                        mode="inline"
                        theme="dark"
                        inlineCollapsed={collapsed}
                        items={items}
                        onClick={onMenuClick}
                        style={{ borderRight: 0 }}
                    />
                </div>
            )}

            {/* Main Content */}
            <div
                style={{
                    flex: 1,
                    padding: '20px',
                    marginLeft: isSalesMode ? 0 : collapsed ? 80 : 256,
                    transition: 'margin-left 0.3s',
                }}
            >
                <Outlet />
            </div>
        </div>
    );
};

export default Home;
