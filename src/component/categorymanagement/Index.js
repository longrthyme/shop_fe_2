import React, { useState, useEffect } from 'react';
import { Space, Table, Button, Tooltip, message, Select, Row, Col } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined  } from '@ant-design/icons';
import CategoryDetailModal from './detailModal';
import CategoryEditModal from './editModal';
import CategoryAddModal from "./addModal";
import CategoryDeleteModal from "./deleteModal";
import moment from 'moment';
import { getCategoryList, findCategoryById, updateCategory, createCategory, deleteCategory,searchCategory } from '../../api/CategoryApi'; // Import API

const { Option } = Select;


const Category = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState(""); // State for sorting
  const [selectedItem, setSelectedItem] = useState(null); // Mục đang được chọn
  const [isAddVisible, setIsAddVisible] = useState(false); // State for "Thêm Mới" modal
  const [isDetailVisible, setIsDetailVisible] = useState(false); // Modal xem chi tiết
  const [isEditVisible, setIsEditVisible] = useState(false); // Modal cập nhật
  const [isDeleteVisible, setIsDeleteVisible] = useState(false); // State cho modal xóa

  useEffect(() => {
    loadCategories(currentPage, sortBy); // Load categories on initial render
  }, [currentPage, sortBy]); // Rerun effect on page or sort change

  const loadCategories = async (page, sortBy) => {
    try {
      setLoading(true);
      const data = await getCategoryList(page, 10, sortBy); // Pass sorting to API
      console.log("đây là data",data)
      const formattedData = data.map((item, index) => ({
        ...item,
        stt: (page - 1) * 10 + index + 1, // Tính STT dựa trên trang hiện tại và index
        key: item.id,
      }));
      setData(formattedData);
      setTotalItems(data.totalItem);
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
      const data = await searchCategory(0, 10, sortBy,inputValue); // Pass sorting to API
      console.log("đây là data",data)
      const formattedData = data.map((item, index) => ({
        ...item,
        stt: (currentPage - 1) * 10 + index + 1, // Tính STT dựa trên trang hiện tại và index
        key: item.id,
      }));
      setData(formattedData);
      setTotalItems(data.totalItem);
    } catch (error) {
      message.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current); // cập nhập currentPage
  };

  const handleSortChange = (value) => {
    setSortBy(value); // cập nhật sorting state
  };

  const showAddModal = async (itemId) => {
    setIsAddVisible(true)
  };

  const handleCreate = async (newCategory) => {
    try {
      await createCategory(newCategory);
      message.success('Thêm mới thành công!');
      setCurrentPage(1);
      await loadCategories(currentPage, sortBy); // Reload list
    } catch (error) {

    }
  };

  const showDetailModal = (item) => {
    setSelectedItem(item);
    setIsDetailVisible(true);
  };

  const showEditModal = async (itemId) => {
    try {
      const data = await findCategoryById(itemId); // Gọi API để lấy dữ liệu
      console.log("Dữ liệu từ API:", data);
      setSelectedItem(data); // Lưu dữ liệu sau khi API thành công
      setIsEditVisible(true); // Chỉ mở modal khi API thành công
      console.log(data);
    } catch (error) {
      // Hiển thị thông báo lỗi nếu API thất bại

    }
  };

  const handleUpdate = async (updatedValues) => {
    try {
      await updateCategory(selectedItem.id, updatedValues);
      setCurrentPage(1);
      setIsEditVisible(false)
      message.success('Cập nhật thành công!');
      await loadCategories(currentPage, sortBy); // Tải lại danh sách sau khi cập nhật
    } catch (error) {

    }
  };

  const showDeleteModal = (itemId) => {
    setSelectedItem(itemId); // Lưu mục cần xóa
    setIsDeleteVisible(true); // Mở modal xóa
  };

  const handleDelete = async () => {
    try {
      await deleteCategory(selectedItem.id); // Gọi API xóa
      message.success('Xóa thành công!');
      // Sau khi xóa thành công, kiểm tra số lượng phần tử còn lại trên trang hiện tại
      const updatedData = data.filter(item => item.id !== selectedItem.id); // Cập nhật data sau khi xóa phần tử
      const isLastItemOnPage = updatedData.length === 0 && currentPage > 1; // Kiểm tra xem có phải phần tử cuối cùng trên trang không

      // Nếu xóa phần tử cuối cùng trên trang hiện tại, chuyển về trang trước
      if (isLastItemOnPage) {
        setCurrentPage(currentPage - 1); // Chuyển về trang trước
        await loadCategories(currentPage - 1, sortBy); // Tải lại data của trang trước
      } else {
        // Tải lại data của trang hiện tại nếu còn phần tử trên trang
        await loadCategories(currentPage, sortBy);
      }

      setIsDeleteVisible(false); // Đóng modal sau khi xóa

    } catch (error) {

    }
  };

  const columns = [
    {
      title: 'STT',
      dataIndex: 'stt',
    },
    {
      title: 'Tên',
      dataIndex: 'name',
    },
    {
      title: 'Thể loại',
      dataIndex: 'type',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) =>
          Number(status) === 1 ? "Đang hoạt động" : "Ngưng hoạt động",
    },

    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
          <Space size="middle">
            <Tooltip title="Xem chi tiết">
              <Button icon={<EyeOutlined />} onClick={() => showDetailModal(record)} />
            </Tooltip>
            <Tooltip title="Sửa">
              <Button icon={<EditOutlined />} onClick={() => { showEditModal(record.id) }} />
            </Tooltip>
            {/*<Tooltip title="Xoá">*/}
            {/*  <Button danger icon={<DeleteOutlined />} onClick={() => { showDeleteModal(record) }}  />*/}
            {/*</Tooltip>*/}
          </Space>
      ),
    }
  ]

  return (
      <div>
        <Button type="primary" onClick={showAddModal}>
          +
        </Button>
        <div className='col-sm-6'>
          <input className='form-control' placeholder='Tìm kiếm' onKeyUp={searchData}/>
        </div>
        <Row gutter={[16, 16]} style={{ marginBottom: '16px' }} justify="space-between">
          <Col span={6}>
            {/*<Button*/}
            {/*    type="primary"*/}
            {/*    style={{ width: '100%' }}*/}
            {/*    icon={<PlusOutlined />}*/}
            {/*    onClick={() => showAddModal()}*/}
            {/*>*/}
            {/*  */}
            {/*</Button>*/}
          </Col>
          {/*<Col span={6}>*/}
          {/*  <Select*/}
          {/*      defaultValue="Sắp xếp"*/}
          {/*      style={{ width: '100%' }}*/}
          {/*      onChange={handleSortChange}*/}
          {/*  >*/}
          {/*    <Option value="NAME_ASC">Tên từ A-Z</Option>*/}
          {/*    <Option value="NAME_DESC">Tên từ Z-A</Option>*/}
          {/*    <Option value="CREATED_AT_DESC">Mới nhất</Option>*/}
          {/*    <Option value="CREATED_AT_ASC">Cũ nhất</Option>*/}
          {/*  </Select>*/}
          {/*</Col>*/}
        </Row>
        <Table
            columns={columns}
            dataSource={data}
            loading={loading}
            pagination={{
              current: currentPage, // Trang hiện tại
              pageSize: 10, // Kích thước trang
              total: totalItems, // Tổng số mục
            }}
            onChange={handleTableChange}
        />
        {/* Modal xem chi tiết */}
        <CategoryDetailModal
            visible={isDetailVisible}
            onCancel={() => setIsDetailVisible(false)}
            item={selectedItem}
        />

        {/* Modal cập nhật */}
        <CategoryEditModal
            visible={isEditVisible}
            onCancel={() => setIsEditVisible(false)}
            item={selectedItem}
            onUpdate={handleUpdate}
        />

        {/* Modal thêm mới */}
        <CategoryAddModal
            visible={isAddVisible}
            onCancel={() => setIsAddVisible(false)}
            onCreate={handleCreate} // Pass the function to create a new category
        />

        {/* Modal xóa */}
        <CategoryDeleteModal
            visible={isDeleteVisible}
            onCancel={() => setIsDeleteVisible(false)}
            onDelete={handleDelete} // Thực hiện xóa khi xác nhận
        />
      </div>
  )
}
export default Category;