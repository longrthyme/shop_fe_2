import React, { useState, useEffect } from "react";
import {Space,Table,Button,Tooltip,message,Select,Row,Col,Modal,} from "antd";
import {EyeOutlined,EditOutlined,DeleteOutlined} from "@ant-design/icons";
import {getColorList,findColorById,updateColor,deleteColor,createColor,searchList} from "../../api/ColorApi";
import ColorDetailModal from "./ColorDetailModal";
import ColorEditModal from "./ColorEditModal";


const { Option } = Select;


const Color = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState("");
    const [selectedItem, setSelectedItem] = useState(null);
    const [isDetailVisible, setIsDetailVisible] = useState(false);
    const [isEditVisible, setIsEditVisible] = useState(false);
    const [isAddVisible, setIsAddVisible] = useState(false);

    useEffect(() => {
        loadColors(currentPage, sortBy);
    }, [currentPage, sortBy]);

    // Load danh sách màu
    const loadColors = async (page, sortBy) => {
        try {
            setLoading(true);
            const res = await getColorList(page, 10, sortBy);

            if (!res || !Array.isArray(res.data || res)) {
                throw new Error("Dữ liệu trả về không hợp lệ");
            }

            const list = res.data || res;
            const formattedData = list.map((item, index) => ({
                ...item,
                stt: (page - 1) * 10 + index + 1,
                key: item.id,
            }));

            setData(formattedData);
            setTotalItems(res.totalItem || list.length);
        } catch (error) {
            message.error(`Lỗi tải dữ liệu: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };


    const searchColors = async (event) => {
        const inputValue = event.target.value;
        try {
            const res = await searchList(0, 10, sortBy, inputValue);
            if (!res || !Array.isArray(res.data || res)) {
                throw new Error("Dữ liệu trả về không hợp lệ");
            }
            const list = res.data || res;
            const formattedData = list.map((item, index) => ({
                ...item,
                stt: (currentPage - 1) * 10 + index + 1,
                key: item.id,
            }));

            setData(formattedData);
            setTotalItems(res.totalItem || list.length);
        } catch (error) {
            message.error(`Lỗi tải dữ liệu: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleSortChange = (value) => {
        setSortBy(value);
    };

    const showAddModal = () => {
        setSelectedItem(null);
        setIsAddVisible(true);
    };

    const showDetailModal = (item) => {
        setSelectedItem(item);
        setIsDetailVisible(true);
    };

    const showEditModal = async (itemId) => {
        try {
            const data = await findColorById(itemId);
            setSelectedItem(data);
            setIsEditVisible(true);
        } catch (error) {
            message.error(`Lỗi: ${error.message}`);
        }
    };

    const handleUpdate = async (values, colorId) => {
        try {
            if (colorId) {
                await updateColor(values, colorId);
                message.success("Cập nhật thành công!");
            } else {
                await createColor(values);
                message.success("Thêm màu thành công!");
            }
            loadColors(currentPage, sortBy);
        } catch (error) {
            if (
                error.response &&
                error.response.status === 400 &&
                error.response.data.message
            ) {
                message.error(error.response.data.message);
            } else {
                message.error("Có lỗi xảy ra.");
            }
        }
    };

    const confirmDelete = (colorId) => {
        Modal.confirm({
            title: "Bạn có chắc chắn muốn xóa?",
            content: "Hành động này không thể hoàn tác.",
            okText: "Xóa",
            okType: "danger",
            cancelText: "Hủy",
            onOk: () => handleDelete(colorId),
        });
    };

    const handleDelete = async (colorId) => {
        try {
            await deleteColor(colorId);
            message.success("Xóa màu thành công!");

            const remainingItems = totalItems - 1;
            const lastPage = Math.ceil(remainingItems / 10);

            if (currentPage > lastPage) {
                setCurrentPage(lastPage);
            } else {
                loadColors(currentPage, sortBy);
            }
        } catch (error) {
            if (
                error.response &&
                error.response.status === 400 &&
                error.response.data.message
            ) {
                message.error(error.response.data.message);
            } else {
                message.error("Có lỗi xảy ra.");
            }
        }
    };


    const columns = [
        {
            title: "STT",
            dataIndex: "stt",
        },
        {
            title: "Màu sắc",
            dataIndex: "code",
            render: (code) => (
                <div
                    style={{
                        backgroundColor: code,
                        width: "30px",
                        height: "30px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                    }}
                />
            ),
        },
        {
            title: "Tên",
            dataIndex: "name",
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            render: (status) =>
                Number(status) === 1 ? "Đang hoạt động" : "Ngưng hoạt động",
        },
        {
            title: "Hành động",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="Xem chi tiết">
                        <Button
                            icon={<EyeOutlined />}
                            onClick={() => showDetailModal(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Sửa">
                        <Button
                            icon={<EditOutlined />}
                            onClick={() => showEditModal(record.id)}
                        />
                    </Tooltip>
                    {/*<Tooltip title="Xoá">*/}
                    {/*    <Button*/}
                    {/*        danger*/}
                    {/*        icon={<DeleteOutlined />}*/}
                    {/*        onClick={() => confirmDelete(record.id)}*/}
                    {/*    />*/}
                    {/*</Tooltip>*/}
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Button type="primary" onClick={showAddModal}>
                +
            </Button>
            <div className='col-sm-6'>
                <input className='form-control' placeholder='Tìm kiếm' onKeyUp={searchColors}/>
            </div>
            <Row gutter={[16, 16]} style={{ marginBottom: "16px" }}>
                <Col span={4}>
                </Col>
                {/*<Col span={4}>*/}
                {/*    <Select*/}
                {/*        defaultValue="Sắp xếp"*/}
                {/*        style={{ width: "100%" }}*/}
                {/*        onChange={handleSortChange}*/}
                {/*    >*/}
                {/*        <Option value="NAME_ASC">Tên từ A-Z</Option>*/}
                {/*        <Option value="NAME_DESC">Tên từ Z-A</Option>*/}
                {/*        <Option value="CREATED_AT_DESC">Mới nhất</Option>*/}
                {/*        <Option value="CREATED_AT_ASC">Cũ nhất</Option>*/}
                {/*    </Select>*/}
                {/*</Col>*/}
            </Row>

            <Table
                columns={columns}
                dataSource={data}
                loading={loading}
                pagination={{
                    current: currentPage,
                    pageSize: 10,
                    total: totalItems,
                    onChange: (page) => setCurrentPage(page),
                }}
            />

            {/* Modal xem chi tiết */}
            <ColorDetailModal
                visible={isDetailVisible}
                onCancel={() => setIsDetailVisible(false)}
                item={selectedItem}
            />

            {/* Modal cập nhật */}
            <ColorEditModal
                visible={isEditVisible}
                onCancel={() => setIsEditVisible(false)}
                item={selectedItem}
                onUpdate={handleUpdate}
            />

            {/* Modal thêm mới */}
            <ColorEditModal
                visible={isAddVisible}
                onCancel={() => setIsAddVisible(false)}
                item={null}
                onUpdate={handleUpdate}
            />
        </div>
    );
};

export default Color;
