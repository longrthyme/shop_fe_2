import React, { useEffect, useState } from "react";
import { Row, Col, Card, List, Statistic, Spin, Typography, message, Button, DatePicker, Table } from "antd";
import {
    getTop5ProductsByTotalQuantity,
    getTotalAo,
    getTotalAoDeleted,
    getTotalAoNotDeleted,
    getTotalQuanDeleted,
    getTotalQuan,
    getTotalQuanNotDeleted,
    countCompletedOrders,
    getDailyRevenue,
    getYearlyRevenue,
    getMonthlyRevenue,
    countAllUsersByRole,
    getListDailyRevenueByDateRange,
} from "../../api/ApiDashBoard";
import moment from "moment";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    //Title,
    Tooltip,
    Legend,
} from "chart.js";
import ProfitModal from "../dashboardmanagrement/ProFitForm";

// Đăng ký các thành phần của Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const { Title } = Typography;

function Dashboard() {
    const [data, setData] = useState({
        userCount: 0,
        top5Products: [],
        completedOrders: 0,
        dailyRevenue: 0,
        monthlyRevenue: 0,
        yearlyRevenue: 0,
        quanNotDeleted: 0,
        quanDeleted: 0,
        aoNotDeleted: 0,
        aoDeleted: 0,
        totalQuan: 0,
        totalAo: 0,
    });
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [dailyRevenueData, setDailyRevenueData] = useState([]);
    const [profitModalVisible, setProfitModalVisible] = useState(false); // Trạng thái modal lợi nhuận



    const fetchDashboardData = async () => {
        try {
            const [
                userCount,
                rawTop5Products,
                completedOrders,
                dailyRevenue,
                monthlyRevenue,
                yearlyRevenue,
                quanNotDeleted,
                quanDeleted,
                aoNotDeleted,
                aoDeleted,
                totalQuan,
                totalAo,
            ] = await Promise.all([
                countAllUsersByRole(),
                getTop5ProductsByTotalQuantity(),
                countCompletedOrders(),
                getDailyRevenue(),
                getMonthlyRevenue(),
                getYearlyRevenue(),
                getTotalQuanNotDeleted(),
                getTotalQuanDeleted(),
                getTotalAoNotDeleted(),
                getTotalAoDeleted(),
                getTotalQuan(),
                getTotalAo(),
            ]);

            const formattedTop5Products = rawTop5Products.map((item, index) => ({
                key: index + 1,
                stt: index + 1,
                productName: item.productName?.name || "N/A", // lấy name từ object
                totalQuantity: item.totalQuantity || 0,
            }));

            setData({
                userCount: userCount || 0,
                top5Products: formattedTop5Products,
                completedOrders: completedOrders || 0,
                dailyRevenue: dailyRevenue || 0,
                monthlyRevenue: monthlyRevenue || 0,
                yearlyRevenue: yearlyRevenue || 0,
                quanNotDeleted: quanNotDeleted || 0,
                quanDeleted: quanDeleted || 0,
                aoNotDeleted: aoNotDeleted || 0,
                aoDeleted: aoDeleted || 0,
                totalQuan: totalQuan || 0,
                totalAo: totalAo || 0,
            });

        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            message.error("Không thể tải dữ liệu Dashboard. Vui lòng thử lại!");
        } finally {
            setLoading(false);
        }
    };

    const fetchDailyRevenue = async (startDate, endDate) => {
        console.log("Fetching revenue for:", startDate, endDate);
        try {
            const data = await getListDailyRevenueByDateRange(startDate, endDate);
            if (data) {
                setDailyRevenueData(data);
            } else {
                message.warning("Không có dữ liệu doanh thu cho khoảng thời gian này.");
            }
        } catch (error) {
            console.error("Error fetching daily revenue:", error);
            message.error("Không thể tải dữ liệu doanh thu. Vui lòng thử lại!");
        }
    };

    const revenueChartData = {
        labels: dailyRevenueData.map((item) => {
            // Chuyển đổi timestamp thành định dạng YYYY-MM-DD
            const date = new Date(item.saleDate); // Nếu item.saleDate là timestamp
            return date.toISOString().split("T")[0]; // Trả về YYYY-MM-DD
        }),
        datasets: [
            {
                label: "Doanh thu (VND)",
                data: dailyRevenueData.map((item) => item.totalRevenue),
                borderColor: "rgba(75,192,192,1)",
                backgroundColor: "rgba(75,192,192,0.2)",
                tension: 0.2,
            },
        ],
    };

    const onDateChange = (key, value) => {
        console.log("onChange - Giá trị ngày được chọn:", value?.format("YYYY-MM-DD")); // Log giá trị ngay tại onChange
        if (key === "startDate") {
            setStartDate((prev) => {
                console.log("Giá trị cũ startDate:", prev?.format("YYYY-MM-DD"));
                console.log("Giá trị mới startDate:", value?.format("YYYY-MM-DD"));
                return value;
            });
        } else if (key === "endDate") {
            setEndDate((prev) => {
                console.log("Giá trị cũ endDate:", prev?.format("YYYY-MM-DD"));
                console.log("Giá trị mới endDate:", value?.format("YYYY-MM-DD"));
                return value;
            });
        }
    };


    const onSearch = () => {
        if (!startDate || !endDate) {
            message.warning("Vui lòng chọn ngày bắt đầu và ngày kết thúc!");
            return;
        }
        console.log("Ngày bắt đầu trước khi gửi:", startDate?.format("YYYY-MM-DD"));
        console.log("Ngày kết thúc trước khi gửi:", endDate?.format("YYYY-MM-DD"));
        fetchDailyRevenue(startDate.format("YYYY-MM-DD"), endDate.format("YYYY-MM-DD"));
    };

    const fetchProfitData = async () => {
        try {
            setProfitModalVisible(true); // Hiển thị modal
        } catch (error) {
            console.error("Error fetching profit data:", error);
            message.error("Không thể tải dữ liệu lợi nhuận. Vui lòng thử lại!");
        }
    };

    useEffect(() => {
        fetchDashboardData(); // Gọi API khi component được mount
    }, []);

    useEffect(() => {
        fetchDashboardData();
        if (startDate) {
            console.log("startDate đã cập nhật:", startDate.format("YYYY-MM-DD"));
        }
        if (endDate) {
            console.log("endDate đã cập nhật:", endDate.format("YYYY-MM-DD"));
        }
    }, [startDate, endDate]);

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <Spin size="large" />
            </div>
        );
    }


    const columns = [
        {
            title: "STT",
            dataIndex: "stt",
            key: "stt",
            align: "center",
            width: 50,
        },
        {
            title: "Tên sản phẩm",
            dataIndex: "productName",
            key: "productName",
            align: "center",
        },
        {
            title: "Số lượng bán ra",
            dataIndex: "totalQuantity",
            key: "totalQuantity",
            align: "center",
        },
    ];

    return (
        <div style={{ padding: "24px" }}>
            <Title level={2} style={{ textAlign: "center", marginBottom: "24px" }}>
                 Thống Kê
            </Title>

            {/* Top 5 sản phẩm theo số lượng */}
            <Row gutter={[16, 16]} style={{ marginTop: "24px", marginBottom: "24px" }}>
                <Col span={24}>
                    <Card title="Top 5 sản phẩm theo số lượng bán">
                        <Table
                            columns={columns}
                            dataSource={data.top5Products}
                            pagination={false}
                            bordered
                            size="middle"
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} >
                <Col span={12}>
                    <Card title="Thông tin tồn kho" hoverable>
                        <List>
                            <List.Item>
                                <Statistic title="Tổng số quần tồn kho" value={data.totalQuan} />
                            </List.Item>
                            <List.Item>
                                <Statistic title="Tổng số áo tồn kho" value={data.totalAo} />
                            </List.Item>
                        </List>
                    </Card>
                </Col>
                <Col span={8} style={{ marginLeft: "24px"}}>
                    <Card hoverable>
                        <Statistic title="Doanh thu ngày" value={data.dailyRevenue} suffix="VND" />
                        <Statistic title="Doanh thu tháng" value={data.monthlyRevenue} suffix="VND" />
                        <Statistic title="Doanh thu năm" value={data.yearlyRevenue} suffix="VND" />
                    </Card>
                    {/*<Button type="primary" onClick={fetchProfitData} style={{ marginTop: "16px" }}>*/}
                    {/*    Xem lợi nhuận*/}
                    {/*</Button>*/}
                </Col>
            </Row>


            <Row gutter={[16, 16]} style={{ marginTop: "24px" }}>
                {/* Phần chọn ngày */}
                <Col span={24}>
                    <Card title="Chọn khoảng thời gian" hoverable>
                        <Row gutter={[16, 16]} align="middle" justify="center">
                            <Col>
                                <DatePicker
                                    placeholder="Chọn ngày bắt đầu"
                                    onChange={(date, dateString) => {
                                        console.log("onChange - Giá trị ngày từ DatePicker:", date, dateString);
                                        if (date) {
                                            onDateChange("startDate", date);
                                        } else {
                                            console.error("DatePicker trả về giá trị không hợp lệ.");
                                        }
                                    }}
                                    style={{ width: "200px" }} // Tăng chiều rộng để nhìn đẹp hơn
                                />
                            </Col>
                            <Col>
                                <DatePicker
                                    placeholder="Chọn ngày kết thúc"
                                    onChange={(date, dateString) => {
                                        console.log("onChange - Giá trị ngày kết thúc:", date, dateString);
                                        if (date) {
                                            onDateChange("endDate", date);
                                        } else {
                                            console.warn("DatePicker trả về giá trị null hoặc không hợp lệ.");
                                        }
                                    }}
                                    style={{ width: "200px" }} // Tăng chiều rộng để nhìn đẹp hơn
                                />
                            </Col>
                            <Col>
                                <Button type="primary" onClick={onSearch}>
                                    Lấy Doanh Thu
                                </Button>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>

            {/* Biểu đồ Doanh thu */}
            <Row gutter={[16, 16]} style={{ marginTop: "24px" }}>
                <Col span={24}>
                    <Card title="Biểu đồ Doanh thu theo ngày">
                        <Line data={revenueChartData} />
                    </Card>
                </Col>
            </Row>



            {/* ProfitModal component */}
            <ProfitModal
                visible={profitModalVisible}
                onCancel={() => setProfitModalVisible(false)} // Đóng modal
            />
        </div>
    );
}

export default Dashboard;