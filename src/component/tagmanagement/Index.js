import React, { useState, useEffect } from 'react';
import { Table, Button, Tooltip, message, Modal, Row, Col, Select } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getTagList, findTagById, updateTag, deleteTag, createTag } from '../../api/TagApi';
import TagDetailModal from './TagDetailModal';
import TagEditModal from './TagEditModal';
import moment from 'moment';

const { Option } = Select;

const Tag = () => {
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
        loadTags(currentPage, sortBy);
    }, [currentPage, sortBy]);

    const loadTags = async (page, sortBy) => {
        try {
            setLoading(true);
            const data = await getTagList(page, 10, sortBy);
            setData(data);
            setTotalItems(data.totalItem);
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
        setIsAddVisible(true);
    };

    const showDetailModal = (item) => {
        setSelectedItem(item);
        setIsDetailVisible(true);
    };

    const showEditModal = async (itemId) => {
        try {
            const data = await findTagById(itemId);
            setSelectedItem(data);
            setIsEditVisible(true);
        } catch (error) {
            message.error(`Error: ${error.message}`);
        }
    };

    const handleUpdate = async (values, tagId) => {
        if (tagId) {
            try {
                await updateTag(values, tagId);
                message.success('Tag updated successfully!');
                loadTags(currentPage, sortBy);
            } catch (error) {
                message.error(`Error: ${error.message}`);
            }
        } else {
            try {
                await createTag(values);
                message.success('Tag created successfully!');
                loadTags(currentPage, sortBy);
            } catch (error) {
                message.error(`Error: ${error.message}`);
            }
        }
    };

    const confirmDelete = (tagId) => {
        Modal.confirm({
            title: 'Are you sure you want to delete?',
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: () => handleDelete(tagId),
        });
    };

    const handleDelete = async (tagId) => {
        try {
            await deleteTag(tagId);
            message.success('Tag deleted successfully!');
            loadTags(currentPage, sortBy);
        } catch (error) {
            message.error(`Error: ${error.message}`);
        }
    };

    const columns = [

        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Tag Content',
            dataIndex: 'tagContent',
        },
        {
            title: 'Created At',
            dataIndex: 'createAt',
            render: (createAt) => moment(createAt).format('DD/MM/YYYY HH:mm'),
        },
        {
            title: 'Updated At',
            dataIndex: 'updateAt',
            render: (updateAt) => moment(updateAt).format('DD/MM/YYYY HH:mm'),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <div>
                    <Tooltip title="View Detail">
                        <Button icon={<EyeOutlined />} onClick={() => showDetailModal(record)} />
                    </Tooltip>
                    <Tooltip title="Edit">
                        <Button icon={<EditOutlined />} onClick={() => showEditModal(record.id)} />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Button danger icon={<DeleteOutlined />} onClick={() => confirmDelete(record.id)} />
                    </Tooltip>
                </div>
            ),
        },
    ];

    return (
        <div>
            <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
                <Col span={4}>
                    <Button type="primary" onClick={showAddModal}>Add New Tag</Button>
                </Col>
                <Col span={4}>
                    <Select
                        defaultValue="Sort"
                        style={{ width: '100%' }}
                        onChange={handleSortChange}
                    >
                        <Option value="NAME_ASC">Name A-Z</Option>
                        <Option value="NAME_DESC">Name Z-A</Option>
                        <Option value="CREATED_AT_DESC">Newest</Option>
                        <Option value="CREATED_AT_ASC">Oldest</Option>
                    </Select>
                </Col>
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
            />

            {/* Detail Modal */}
            <TagDetailModal
                visible={isDetailVisible}
                onCancel={() => setIsDetailVisible(false)}
                item={selectedItem}
            />

            {/* Edit Modal */}
            <TagEditModal
                visible={isEditVisible}
                onCancel={() => setIsEditVisible(false)}
                item={selectedItem}
                onUpdate={handleUpdate}
            />

            {/* Add Modal */}
            <TagEditModal
                visible={isAddVisible}
                onCancel={() => setIsAddVisible(false)}
                item={null}
                onUpdate={handleUpdate}
            />
        </div>
    );
};

export default Tag;
