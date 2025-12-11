import React, { useState, useEffect } from 'react';
import { Table, Button, Tooltip, message, Modal, Row, Col, Select, Form, Input } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getMaterialList, findMaterialById, updateMaterial, deleteMaterial, createMaterial,searchMaterial } from '../../api/MaterialApi';
import MaterialDetailModal from './MaterialDetailModal';
import moment from 'moment';

const { Option } = Select;

const Material = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState("");
    const [selectedItem, setSelectedItem] = useState(null);
    const [isDetailVisible, setIsDetailVisible] = useState(false);
    const [isEditVisible, setIsEditVisible] = useState(false);
    const [isAddVisible, setIsAddVisible] = useState(false);

    const [form] = Form.useForm();

    useEffect(() => {
        loadMaterials(currentPage, sortBy);
    }, [currentPage, sortBy]);

    const loadMaterials = async (page, sortBy) => {
        try {
            setLoading(true);
            const res = await getMaterialList(page, 10, sortBy);
            console.log("Material API response:", res);

            const list = res.content ?? res.data ?? res;
            const total = res.totalElements ?? res.totalItem ?? list.length;

            setData(list);
            setTotalItems(total);
        } catch (error) {
            message.error(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const searchData = async (event) => {
        const inputValue = event.target.value;
        try {
            setLoading(true);
            const res = await searchMaterial(0, 10, sortBy,inputValue);
            console.log("Material API response:", res);

            const list = res.content ?? res.data ?? res;
            const total = res.totalElements ?? res.totalItem ?? list.length;

            setData(list);
            setTotalItems(total);
        } catch (error) {
            message.error(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleTableChange = (pagination) => {
        setCurrentPage(pagination.current);
    };

    const handleSortChange = (value) => {
        setSortBy(value);
    };

    const showAddModal = () => {
        setSelectedItem(null);
        form.resetFields();
        form.setFieldsValue({ status: 1 }); // mặc định đang hoạt động
        setIsAddVisible(true);
    };

    const showDetailModal = (item) => {
        setSelectedItem(item);
        setIsDetailVisible(true);
    };

    const showEditModal = async (itemId) => {
        try {
            const data = await findMaterialById(itemId);
            setSelectedItem(data);
            form.setFieldsValue(data);
            setIsEditVisible(true);
        } catch (error) {
            message.error(`Error: ${error.message}`);
        }
    };

    const handleUpdate = async () => {
        try {
            const values = await form.validateFields();
            if (selectedItem?.id) {
                await updateMaterial(values, selectedItem.id);
                message.success('Cập nhập chất liệu thành công');
            } else {
                await createMaterial(values);
                message.success('Cập nhập không thành công');
            }
            loadMaterials(currentPage, sortBy);
            setIsAddVisible(false);
            setIsEditVisible(false);
        } catch (error) {
            message.error(`Error: ${error.message}`);
        }
    };

    const confirmDelete = (materialId) => {
        Modal.confirm({
            title: 'Bạn muốn xóa?',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: () => handleDelete(materialId),
        });
    };

    const handleDelete = async (materialId) => {
        try {
            await deleteMaterial(materialId);
            message.success('Xóa thành công');
            loadMaterials(currentPage, sortBy);
        } catch (error) {
            message.error(`Error: ${error.message}`);
        }
    };

    const columns = [
        {
            title: 'STT',
            dataIndex: 'stt',
            render: (_, __, index) => index + 1,
        },
        {
            title: 'Tên',
            dataIndex: 'name',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (status) => status === 0 ? 'Đang hoạt động' : 'Ngưng hoạt động'
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <div style={{ display: 'flex', gap: 8 }}>
                    <Tooltip title="Xem chi tiết">
                        <Button icon={<EyeOutlined />} onClick={() => showDetailModal(record)} />
                    </Tooltip>
                    <Tooltip title="Sửa">
                        <Button icon={<EditOutlined />} onClick={() => showEditModal(record.id)} />
                    </Tooltip>
                    {/*<Tooltip title="Xóa">*/}
                    {/*    <Button danger icon={<DeleteOutlined />} onClick={() => confirmDelete(record.id)} />*/}
                    {/*</Tooltip>*/}
                </div>
            ),
        },
    ];

    return (
        <div>
            <Col span={4}>
                <Button type="primary" onClick={showAddModal}>+</Button>
            </Col>
            <div className='col-sm-6'>
                <input className='form-control' placeholder='Tìm kiếm' onKeyUp={searchData}/>
            </div>
            <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
                {/*<Col span={4}>*/}
                {/*    <Select*/}
                {/*        defaultValue="Sắp xếp"*/}
                {/*        style={{ width: '100%' }}*/}
                {/*        onChange={handleSortChange}*/}
                {/*    >*/}
                {/*        <Option value="NAME_ASC">Name A-Z</Option>*/}
                {/*        <Option value="NAME_DESC">Name Z-A</Option>*/}
                {/*        <Option value="CREATED_AT_DESC">Chất liệu mới nhất</Option>*/}
                {/*        <Option value="CREATED_AT_ASC">Chất liệu cũ nhất</Option>*/}
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
                }}
                onChange={handleTableChange}
                rowKey="id"
            />

            {/* Detail Modal */}
            <MaterialDetailModal
                visible={isDetailVisible}
                onCancel={() => setIsDetailVisible(false)}
                item={selectedItem}
            />

            {/* Add / Edit Modal */}
            <Modal
                title={selectedItem ? "Sửa chất liệu" : "Thêm chất liệu mới"}
                visible={isEditVisible || isAddVisible}
                onCancel={() => {
                    setIsEditVisible(false);
                    setIsAddVisible(false);
                }}
                onOk={handleUpdate}
                okText={selectedItem ? "Cập nhật" : "Thêm"}
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Tên chất liệu"
                        rules={[{ required: true, message: 'Vui lòng nhập tên chất liệu' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Mô tả"
                    >
                        <Input.TextArea rows={3} />
                    </Form.Item>

                    <Form.Item
                        name="status"
                        label="Trạng thái"
                        rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
                    >
                        <Select placeholder="Chọn trạng thái">
                            <Option value={0}>Đang hoạt động</Option>
                            <Option value={1}>Ngưng hoạt động</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Material;
