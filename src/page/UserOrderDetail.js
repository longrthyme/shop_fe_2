import React, {useEffect, useState} from 'react';
import {
    Timeline,
    Spin,
    Row,
    Col,
    Typography,
    Divider,
    Button,
    Space,
    notification,
    Modal,
    Tag,
    Table,
    Form,
    Select,
    Input,
    Card,
    Descriptions,
    List, Avatar
} from 'antd';
import {getOrderById, updateStatusOrder, history, updateShipping, updateStatusOrderForUser} from '../api/OrderApi'; // Đảm bảo đúng đường dẫn import API
import {useParams} from 'react-router-dom';
import {getTinhThanh, getQuanHuyen, getPhuongXa, getShip} from '../api/DiaChiApi';
import {CheckOutlined, CloseOutlined, HistoryOutlined} from "@ant-design/icons";
import Header from "../Backgroudwed/backgroudTrangChu/ProductDetail/Header"
import Footer from "../Backgroudwed/backgroudTrangChu/ProductDetail/Footer"

const UserOrderDetail = () => {
    const [loading, setLoading] = useState(true);
    const [orderData, setOrderData] = useState(null);
    const [timelineData, setTimelineData] = useState([]);
    const [shippingAddress, setShippingAddress] = useState({});
    const [orderDetailProductReponses, setOrderDetailProductReponses] = useState([]);
    const {id} = useParams();
    const {Title, Text} = Typography;
    const [cities, setCities] = useState({});
    const [districts, setDistricts] = useState({});
    const [wards, setWards] = useState({});
    const [districtsForUpdate, setDistrictsForUpdate] = useState({});
    const [wardsForUpDate, setWardsForUpDate] = useState({});
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [historyData, setHistoryData] = useState([]);

    const statusMap = {
        PENDING: { label: "Tạo đơn hàng", color: "blue" },
        PROCESSING: { label: "Chờ giao", color: "orange" },
        SHIPPING: { label: "Đang giao", color: "cyan" },
        COMPLETED: { label: "Hoàn thành", color: "green" },
        CANCELED: { label: "Huỷ", color: "red" },
    };

    const showHistory = async () => {
        await fetchHistory()
        setIsModalVisible(true);
    };

    const handleModalClose = () => {
        setIsModalVisible(false);

    };

    // Load cities when component mounts
    const loadCities = async () => {
        try {
            const response = await getTinhThanh();
            setCities(response);

        } catch (error) {
            console.error("Failed to load cities:", error);
        }
    };


    const loadDistricts = async () => {
        try {
            const response = await getQuanHuyen(shippingAddress.idTinhThanh);
            console.log("QH", response)
            setDistricts(response);
        } catch (error) {
            console.error('Failed to load districts:', error);
        }
    };

    const loadWards = async () => {
        try {
            console.log("iiiiii",shippingAddress.idQuanHuyen)
            console.log("iiiiii",shippingAddress)
            const response = await getPhuongXa(shippingAddress.idQuanHuyen);
            setWards(response);
        } catch (error) {
            console.error('Failed to load wards:', error);
        }
    };

    const fetchOrderDetail = async () => {
        try {
            setLoading(true);
            const response = await getOrderById(id);
            const order = response?.result || {};
            const timeLines = order?.timeLines || [];
            const shippingAddress = order?.shippingAddress || {};
            const orderDetailProductReponses = order?.orderDetailProductReponses || {};
            console.log("aaa",orderDetailProductReponses)
            // Định dạng dữ liệu timeline
            const formattedTimeline = timeLines.map(item => ({
                status: item.status,
                time: new Date(item.createAt).toLocaleString(),
                note: item.note,
                createdBy: item.createdBy,
            }));
            setOrderData(order);
            setTimelineData(formattedTimeline);
            setShippingAddress(shippingAddress)
            setOrderDetailProductReponses(orderDetailProductReponses)

        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrderDetail();

    }, [id]);

    useEffect(() => {
        if (shippingAddress.idTinhThanh) {
            loadDistricts(); // Gọi khi idTinhThanh thay đổi
        }

        if (shippingAddress.idQuanHuyen) {
            loadWards(); // Gọi khi idQuanHuyen thay đổi
        }

        loadCities(); // Gọi bất kể khi nào shippingAddress thay đổi
    }, [shippingAddress]);
    const handleConfirm = async (newStatus) => {
        try {
            // Gửi API cập nhật trạng thái đơn hàng
           try {
               await updateStatusOrderForUser(id, newStatus);
               notification.success({
                   message: 'Cập nhật trạng thái thành công ',

               });
               await fetchOrderDetail();
               console.log(`Đơn hàng được chuyển sang trạng thái: ${newStatus}`);
           }catch (e) {
               notification.error({
                   message: `${e.message}`,
               });
           }
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
        }
    };

    const columns = [
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (text) => {
                const statusMap = {
                    Pending: {label: "Tạo đơn hàng", color: "blue"},
                    Processing: {label: "Chờ giao", color: "orange"},
                    Shipping: {label: "Đang giao", color: "cyan"},
                    Completed: {label: "Hoàn thành", color: "green"},
                    CANCELED: {label: "Huỷ", color: "green"},
                };
                const status = statusMap[text] || {label: text, color: "default"};
                return <Tag color={status.color}>{status.label}</Tag>;
            },
        },
        {
            title: "Thời gian",
            dataIndex: "createAt",
            key: "createAt",
            render: (text) => new Date(text).toLocaleString("vi-VN"),
        },
        {
            title: "Người thao tác",
            dataIndex: "createdBy",
            key: "createdBy",
        },
        {
            title: "Ghi chú",
            dataIndex: "note",
            key: "note",
        },
    ];
    const fetchHistory = async () => {
        try {
            setLoadingHistory(true);
            const response = await history(id);
            console.log("kkk", response)
            setHistoryData(response);
        } catch (error) {
            console.error("Lỗi khi tải lịch sử:", error);
        } finally {
            setLoadingHistory(false);
        }
    };

    /////////////////////////////////////////////////// THay doi dia chi
    const [isEditAddressVisible, setIsEditAddressVisible] = useState(false);
    const [newShippingAddress, setNewShippingAddress] = useState({});
    const [autoSet, setAutoSet] = useState(false); // Kiểm soát việc gọi useEffect
    const [form] = Form.useForm();

// Load cities on mount
    useEffect(() => {
        const loadCities = async () => {
            try {
                const response = await getTinhThanh();
                setCities(response);
            } catch (error) {
                console.error("Failed to load cities:", error);
            }
        };
        loadCities();
    }, []);

// Load districts when city changes
    useEffect(() => {
        if (autoSet && newShippingAddress.idTinhThanh) {
            const loadDistrictsForUpdate = async () => {
                try {
                    const response = await getQuanHuyen(newShippingAddress.idTinhThanh);
                    setDistrictsForUpdate(response);

                    setNewShippingAddress((prev) => ({...prev, idQuanHuyen: null, idPhuongXa: null,ship:null}));
                    setWardsForUpDate({})
                } catch (error) {
                    console.error("Failed to load districts:", error);
                }
            };
            loadDistrictsForUpdate();
        }
    }, [newShippingAddress.idTinhThanh]);

// Load wards when district changes
    useEffect(() => {
        if (autoSet && newShippingAddress.idQuanHuyen) {
            const loadWardsForUpdate = async () => {
                try {
                    const response = await getPhuongXa(newShippingAddress.idQuanHuyen);
                    setWardsForUpDate(response);
                    setNewShippingAddress((prev) => ({...prev, idPhuongXa: null,ship:null}));
                } catch (error) {
                    console.error("Failed to load wards:", error);
                }
            };
            loadWardsForUpdate();
        }
    }, [newShippingAddress.idQuanHuyen]);

    const handleAddressChange = async (field, value) => {
        setAutoSet(true);
        console.log("ahen",value)
        await setNewShippingAddress((prev) => ({
            ...prev,
            [field]: value,
        }));

        if (
            field === "idPhuongXa" &&
            newShippingAddress.idTinhThanh &&
            newShippingAddress.idQuanHuyen &&
            value
        ) {
            await calculateShippingFee(value);
        }
    };

    const calculateShippingFee = async (value) => {
        const shipRequest = {
            idQuanHuyen: newShippingAddress.idQuanHuyen,
            idPhuongXa: value,
            soLuongSanPham: 1,
        };
        try {
            const response = await getShip(shipRequest);
            console.log("ship",response)
            setNewShippingAddress((prev) => ({
                ...prev,
                ship: response, // Cập nhật phí ship
            }));

        } catch (error) {
            console.error('Failed to get shipping fee:', error);
            setNewShippingAddress((prev) => ({
                ...prev,
                ship: 0 // Cập nhật phí ship
            }));
        }
    };

    const handleSaveAddress = async () => {
        try {
            if(newShippingAddress.ship === null){
                notification.error({
                    message: "Vui Long Nhập đủ thông tin giao hàng",
                });
            }else {
                await updateShipping(id, newShippingAddress);
                notification.success({
                    message: "Cập nhật địa chỉ giao hàng thành công!",
                });
                console.log("jqk",newShippingAddress)
                console.log("jqk",orderData.orderId)
                setIsEditAddressVisible(false);
                await fetchOrderDetail(); // Load lại chi tiết đơn hàng
            }
        } catch (error) {
            notification.error({
                message: "Cập nhật địa chỉ giao hàng thất bại!",
            });
        }
    };


    ////////////////////////////////////Thong tin sang pham//////////////////////////////////////////////////////////////////////////////////////



    return (
        <>
            <Header />
            <div style={{padding: '20px'}}>
                <h2>Chi Tiết Đơn Hàng</h2>
                {loading ? (
                    <Spin size="large"/>
                ) : (
                    <>
                        <Modal
                            title="Thay đổi địa chỉ giao hàng"
                            visible={isEditAddressVisible}
                            onCancel={() => setIsEditAddressVisible(false)}
                            onOk={handleSaveAddress}
                            okText="Lưu"
                            cancelText="Hủy"
                        >
                            <button onClick={() => {
                                console.log('d', districtsForUpdate)
                                console.log('w', wardsForUpDate)
                                console.log(newShippingAddress)
                            }}>aaaaa
                            </button>
                            <Form form={form} layout="vertical">
                                <Row gutter={[16, 16]}>
                                    <Col span={24}>
                                        <Form.Item label="Người nhận">
                                            <Input
                                                value={newShippingAddress.nguoiNhan}
                                                onChange={(e) => handleAddressChange("nguoiNhan", e.target.value)}
                                                placeholder="Nhập tên người nhận"
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label="Số điện thoại">
                                            <Input
                                                value={newShippingAddress.phone}
                                                onChange={(e) => handleAddressChange("phone", e.target.value)}
                                                placeholder="Nhập số điện thoại"
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label="Địa chỉ chi tiết">
                                            <Input
                                                value={newShippingAddress.address}
                                                onChange={(e) => handleAddressChange("address", e.target.value)}
                                                placeholder="Nhập địa chỉ chi tiết"
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label="Tỉnh/Thành">
                                            <Select
                                                value={newShippingAddress.idTinhThanh}
                                                onChange={(value) => {
                                                    handleAddressChange("idTinhThanh", value);
                                                    setAutoSet(true)
                                                    setDistrictsForUpdate([]);
                                                    setWardsForUpDate([]);
                                                }}
                                                placeholder="Chọn tỉnh/thành"
                                            >
                                                {Object.entries(cities).map(([id, name]) => (
                                                    <Select.Option key={id} value={id}>
                                                        {name}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label="Quận/Huyện"
                                                   rules={[{required: true, message: 'Vui lòng chọn Qun!'}]}>
                                            <Select
                                                value={newShippingAddress.idQuanHuyen}
                                                onChange={(value) => {
                                                    handleAddressChange("idQuanHuyen", value);
                                                    setWardsForUpDate([]);
                                                }}
                                                placeholder="Chọn quận/huyện"
                                            >
                                                {Object.entries(districtsForUpdate).map(([id, name]) => (
                                                    <Select.Option key={id} value={id}>
                                                        {name}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label="Phường/Xã">
                                            <Select

                                                value={newShippingAddress.idPhuongXa}
                                                onChange={(value) => {
                                                    handleAddressChange("idPhuongXa", value)
                                                    console.log(value)
                                                }}
                                                placeholder="Chọn phường/xã"
                                            >
                                                {Object.entries(wardsForUpDate).map(([id, name]) => (
                                                    <Select.Option key={id} value={id}>
                                                        {name}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label="Phí Giao Hàng">
                                            <Input
                                                disabled={true}
                                                value={newShippingAddress.ship}
                                                onChange={(e) => handleAddressChange("address", e.target.value)}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form>
                        </Modal>

                        {loading ? (
                            <p>Đang tải lịch sử...</p>
                        ) : (<Modal
                            title="Lịch sử thao tác"
                            visible={isModalVisible}
                            onCancel={handleModalClose}
                            footer={[
                                <Button key="close" onClick={handleModalClose}>
                                    Đóng
                                </Button>,
                            ]}
                            width={800}
                        >
                            <Table
                                columns={columns}
                                dataSource={historyData || []}
                                rowKey={(record) => record.createAt}
                                loading={loadingHistory}
                                pagination={false}
                            />
                        </Modal>)}

                        {/* Timeline */}
                        <div>
                            <div style={{
                                display: 'flex',
                                overflowX: 'auto',
                                whiteSpace: 'nowrap',
                                padding: '10px',
                                backgroundColor: '#f5f5f5',
                                borderRadius: '8px',
                            }}>
                                <Timeline mode="bottom" style={{display: 'flex'}}>
                                    {timelineData.map((step, index) => (
                                        <Timeline.Item
                                            key={index}
                                            color={step.status === 'SHIPPING' ? 'green' : 'blue'}
                                            style={{flex: '0 0 auto', minWidth: '200px', textAlign: 'center'}}
                                        >

                                            <span>{step.time}</span>
                                            <p>{step.note}</p>

                                        </Timeline.Item>
                                    ))}
                                </Timeline>
                            </div>
                        </div>
                        <div style={{marginBottom: "20px"}}>
                            <Space>
                                {orderData?.status === "PENDING" && (
                                    <>
                                        <Button
                                            type="default"
                                            size="large"
                                            danger
                                            icon={<CloseOutlined/>}
                                            onClick={() => handleConfirm("CANCELED")}
                                        >
                                            Huỷ đơn hàng
                                        </Button>
                                    </>
                                )}

                            </Space>
                            <Space style={{float: "right"}}>
                                <Button
                                    type="default"
                                    size="large"
                                    icon={<HistoryOutlined/>}
                                    onClick={() => {
                                        showHistory()
                                    }}
                                >
                                    Lịch sử thao tác
                                </Button>

                            </Space>

                        </div>
                        {/* Thông tin đơn hàng */}
                        <div style={{marginBottom: "20px"}}>
                            <Title level={4}>Thông Tin Đơn Hàng</Title>
                            <Row gutter={[16, 16]}>
                                <Col span={12}>
                                    <Text strong>Trạng thái:</Text>{" "}
                                    <Text type="secondary">
                                        {statusMap[orderData?.status?.toUpperCase()]?.label || "N/A"}
                                    </Text>


                                </Col>

                                <Col span={12}>
                                    <Text strong>Phí vận chuyển:</Text>{" "}
                                    <Text type="secondary">
                                        {orderData?.shippingFee?.toLocaleString("vi-VN")} đ
                                    </Text>
                                </Col>
                                <Col span={12}>
                                    <Text strong>Mã đơn hàng:</Text>{" "}
                                    <Text type="secondary">{orderData?.code || "N/A"}</Text>
                                </Col>


                                <Col span={12}>
                                    <Text strong>Tổng tiền:</Text>{" "}
                                    <Text type="secondary">
                                        {orderData?.total?.toLocaleString("vi-VN")} đ
                                    </Text>
                                </Col>
                                <Col span={12}>
                                    <Text strong>Loại đơn hàng:</Text>{" "}
                                    <Text type="secondary">{orderData?.type || "N/A"}</Text>
                                </Col>
                                <Col span={12}>
                                    <Text strong>Phải thanh toán:</Text>{" "}
                                    <Text type="secondary">
                                        {orderData?.finalTotal?.toLocaleString("vi-VN")} đ
                                    </Text>
                                </Col>
                            </Row>
                        </div>
                        <Divider/>
                        {/* Thông tin khách hàng */}
                        <div style={{marginBottom: "20px"}}>
                            <Title level={4}>Thông Tin Khách Hàng</Title>
                            <Row gutter={[16, 16]}>
                                <Col span={12}>
                                    <Text strong>Tên khách hàng:</Text>{" "}
                                    <Text type="secondary">
                                        {orderData?.user?.fullName || "N/A"}
                                    </Text>
                                </Col>
                                <Col span={12}>
                                    <Text strong>Email:</Text>{" "}
                                    <Text type="secondary">{orderData?.user?.email || "N/A"}</Text>
                                </Col>
                                <Col span={12}>
                                    <Text strong>Số điện thoại:</Text>{" "}
                                    <Text type="secondary">
                                        {orderData?.user?.phone || "N/A"}
                                    </Text>
                                </Col>
                                <Col span={12}>
                                    <Text strong>Địa chỉ:</Text>{" "}
                                    <Text type="secondary">
                                        {orderData?.user?.address || "N/A"}
                                    </Text>
                                </Col>
                            </Row>
                        </div>

                        <Divider/>
                        {/* Địa chỉ giao hàng */}

                        <div style={{marginBottom: "20px"}}>
                            <Row justify="space-between" align="middle">
                                <Col>
                                    <Title level={4} style={{margin: 0}}>Địa chỉ giao hàng</Title>
                                </Col>
                                <Col>
                                    {orderData?.status === "PENDING" && (
                                        <Button
                                            type="primary"
                                            size="large"
                                            onClick={() => {
                                                console.log('a', wards);
                                                console.log('b', districts);
                                                setWardsForUpDate(wards);
                                                setDistrictsForUpdate(districts)
                                                setNewShippingAddress({
                                                    id: shippingAddress.id,
                                                    nguoiNhan: shippingAddress.nguoiNhan || "-",
                                                    phone: shippingAddress.phone || "-",
                                                    address: shippingAddress.address || "-",
                                                    idTinhThanh: shippingAddress.idTinhThanh || "-",
                                                    idQuanHuyen: shippingAddress.idQuanHuyen || "-",
                                                    idPhuongXa: shippingAddress.idPhuongXa || "-",
                                                    ship: orderData?.shippingFee || "-"
                                                })
                                                setAutoSet(false);
                                                setIsEditAddressVisible(true)
                                            }}

                                        >
                                            Thay đổi địa chỉ giao hàng
                                        </Button>
                                    )}
                                </Col>
                            </Row>
                            <Row gutter={[16, 16]} style={{marginTop: "10px"}}>
                                <Col span={12}>
                                    <Text strong>Người Nhận:</Text>{" "}
                                    <Text type="secondary">
                                        {orderData?.shippingAddress?.nguoiNhan || "N/A"}
                                    </Text>
                                </Col>
                                <Col span={12}>
                                    <Text strong>Số điện thoại:</Text>{" "}
                                    <Text type="secondary">
                                        {orderData?.shippingAddress?.phone || "N/A"}
                                    </Text>
                                </Col>
                                <Col span={24}>
                                    <Text strong>Địa chỉ:</Text>{" "}
                                    <Text type="secondary">
                                        {orderData?.shippingAddress
                                            ? [
                                                orderData?.shippingAddress?.address || "-",
                                                cities?.[shippingAddress?.idTinhThanh] || "-",
                                                districts?.[shippingAddress?.idQuanHuyen] || "-",
                                                wards?.[shippingAddress?.idPhuongXa] || "-"
                                            ].join(", ")
                                            : "N/A"}
                                    </Text>


                                </Col>
                            </Row>
                        </div>

                        <Divider></Divider>
                        {/* Thông tin san phẩm*/}
                        {/*<div style={{marginTop: "20px"}}>*/}
                        {/*    <Title level={4}>Chi Tiết Sản Phẩm</Title>*/}
                        {/*    {orderDetailProductReponses?.length > 0 ? (*/}
                        {/*        orderData.orderDetailProductReponses.map((product, index) => (*/}
                        {/*            <div key={index} style={{*/}
                        {/*                marginBottom: "20px",*/}
                        {/*                padding: "10px",*/}
                        {/*            }}>*/}
                        {/*                <Row gutter={[16, 16]} align="middle">*/}
                        {/*                    /!* Cột chứa thông tin sản phẩm *!/*/}
                        {/*                    <Col span={12}>*/}
                        {/*                        <div style={{ paddingRight: "20px" }}>*/}
                        {/*                            <Row gutter={[8, 8]}>*/}
                        {/*                                <Col span={24}>*/}
                        {/*                                    <Text strong>Tên sản phẩm:</Text>{" "}*/}
                        {/*                                    <Text type="secondary">{product.productName || "N/A"}</Text>*/}
                        {/*                                </Col>*/}
                        {/*                                <Col span={24}>*/}
                        {/*                                    <Text strong>Size:</Text>{" "}*/}
                        {/*                                    <Text type="secondary">{product.sizeName || "N/A"}</Text>*/}
                        {/*                                </Col>*/}
                        {/*                                <Col span={24}>*/}
                        {/*                                    <Text strong>Màu sắc:</Text>{" "}*/}
                        {/*                                    <Text type="secondary">{product.colorName || "N/A"}</Text>*/}
                        {/*                                </Col>*/}
                        {/*                                <Col span={24}>*/}
                        {/*                                    <Text strong>Số lượng:</Text>{" "}*/}
                        {/*                                    <Text type="secondary">{product.quantity || "N/A"}</Text>*/}
                        {/*                                </Col>*/}
                        {/*                                <Col span={24}>*/}
                        {/*                                    <Text strong>Giá:</Text>{" "}*/}
                        {/*                                    <Text type="secondary">*/}
                        {/*                                        {product.price ? `${product.price} VND` : "N/A"}*/}
                        {/*                                    </Text>*/}
                        {/*                                </Col>*/}
                        {/*                            </Row>*/}
                        {/*                        </div>*/}
                        {/*                    </Col>*/}

                        {/*                    /!* Cột chứa hình ảnh sản phẩm *!/*/}
                        {/*                    <Col span={12}>*/}
                        {/*                        <div style={{ }}>*/}
                        {/*                            <img*/}
                        {/*                                src={product.urlImg || ""}*/}
                        {/*                                alt="Product"*/}
                        {/*                                style={{*/}
                        {/*                                    width: "150px",*/}
                        {/*                                    height: "150px",*/}
                        {/*                                    marginTop: "10px",*/}
                        {/*                                    objectFit: "cover",*/}
                        {/*                                    border: "1px solid #ddd",*/}
                        {/*                                }}*/}
                        {/*                            />*/}
                        {/*                        </div>*/}
                        {/*                    </Col>*/}
                        {/*                </Row>*/}
                        {/*            </div>*/}
                        {/*        ))*/}
                        {/*    ) : (*/}
                        {/*        <Text type="secondary">Không có sản phẩm nào.</Text>*/}
                        {/*    )}*/}
                        {/*</div>*/}
                        <Card title="Chi Tiết Sản Phẩm" bordered={false} style={{ marginBottom: 20 }}>
                            <List
                                itemLayout="horizontal"
                                dataSource={orderDetailProductReponses}
                                renderItem={product => (
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={<Avatar shape="square" size={64} src={product.urlImg} />}
                                            title={product.productName}
                                            description={
                                                <>
                                                    <Text strong>Size:</Text> {product.sizeName || "N/A"} <br />
                                                    <Text strong>Màu sắc:</Text> {product.colorName || "N/A"} <br />
                                                    <Text strong>Số lượng:</Text> {product.quantity || "N/A"} <br />
                                                    <Text strong>Giá:</Text> {product.price ? `${product.price.toLocaleString('vi-VN')} đ` : "N/A"}
                                                </>
                                            }
                                        />
                                    </List.Item>
                                )}
                            />
                        </Card>
                        <Divider/>
                    </>
                )}
            </div>
            <Footer />
        </>
    );
};

export default UserOrderDetail;
