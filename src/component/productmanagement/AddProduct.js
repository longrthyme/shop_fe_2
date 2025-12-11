import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, message, Row, Col, Divider, InputNumber, Upload, Table } from 'antd';
import { getAllBrands } from '../../service/admin/ApiBrands';
import { getCategoryList } from '../../api/CategoryApi';
import { addProductWapper } from '../../service/admin/ApiProduct';
import { getAllSize } from '../../service/admin/ApiSize';
import { getColorList } from '../../api/ColorApi';
import { getTagList } from '../../api/TagApi';
import { getMaterialList } from '../../api/MaterialApi';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

function AddProduct({ onCancel }) {
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [categoryType, setCategoryType] = useState('');
    const [colors, setColors] = useState([]);
    const [tags, setTags] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [hoveredKey, setHoveredKey] = useState(null);
    const [tableErrors, setTableErrors] = useState({}); // Thêm state để quản lý lỗi

    const [form] = Form.useForm();
    const API_KEY = '25d25c1c0ab2bf795c35b58ecaa1b96f';

    // Fetch dữ liệu từ API
    useEffect(() => {
        const fetchBrands = async () => {
            const brandData = await getAllBrands(1, 100, 'name');
            setBrands(brandData || []);
        };
        fetchBrands();
    }, []);



    useEffect(() => {
        const fetchColors = async () => {
            try {
                const colorData = await getColorList(1, 100, 'name');


                const activeColors = (colorData.data || colorData).filter(
                    (color) => Number(color.status) === 1
                );

                setColors(activeColors);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách màu sắc:', error);
            }
        };
        fetchColors();
    }, []);


    useEffect(() => {
        const fetchSizes = async () => {
            try {
                const sizeData = await getAllSize(1, 100, 'name');
                const activeSizes = (sizeData.data || sizeData).filter(
                    (size) => Number(size.status) === 1
                );

                setSizes(activeSizes);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách kích cỡ:', error);
            }
        };
        fetchSizes();
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            const categoryData = await getCategoryList(1, 100, 'name');

            setCategories(categoryData || []);
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const tagData = await getTagList(1, 100, 'name');
                setTags(tagData);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách tags:', error);
            }
        };
        fetchTags();
    }, []);

    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                const materialData = await getMaterialList(1, 100, 'name');

                setMaterials(materialData);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách chất liệu:', error);
            }
        };
        fetchMaterials();
    }, []);

    // const handleCategoryTypeChange = (value) => {
    //     setCategoryType(value);
    //     const filtered = categories.filter(category => category.type === value);
    //     setFilteredCategories(filtered);
    // };

    const handleColorsChange = (value) => {
        setSelectedColors(value);
        updateTableData(value, selectedSizes);
    };

    const handleSizesChange = (value) => {
        setSelectedSizes(value);
        updateTableData(selectedColors, value);
    };

    const updateTableData = (colors, sizes) => {
        const newData = [];
        if (colors.length && sizes.length) {
            colors.forEach((color) => {
                sizes.forEach((size) => {
                    newData.push({
                        key: `${color}-${size}`,
                        color,
                        size,
                        quantity: null,
                        inputPrice: null, // Khởi tạo giá nhập
                        price: null,       // Khởi tạo giá bán
                        image: null,
                    });
                });
            });
        }
        setTableData(newData);
        setTableErrors({}); // Reset lỗi khi cập nhật dữ liệu bảng
    };

    const handleQuantityChange = (value, key) => {
        const updatedData = tableData.map((item) => {
            if (item.key === key) {
                return { ...item, quantity: value };
            }
            return item;
        });
        setTableData(updatedData);
    };

    const handleApplyQuantity = (key) => {
        // Tìm item được chọn theo key
        const selectedItem = tableData.find(item => item.key === key);

        if (selectedItem) {
            const updatedData = tableData.map((item) => {
                // Áp dụng số lượng cho tất cả các item
                return { ...item, quantity: selectedItem.quantity }; // Cập nhật số lượng cho tất cả các item
            });

            // Cập nhật lại dữ liệu của bảng
            setTableData(updatedData);

            // Thông báo thành công
            message.success('Số lượng đã được áp dụng cho tất cả các sản phẩm!');
        }
    };

    const handleInputPriceChange = (value, key) => {
        const updatedData = tableData.map((item) => {
            if (item.key === key) {
                return { ...item, inputPrice: value };
            }
            return item;
        });
        setTableData(updatedData);

        // Sau khi thay đổi giá nhập, kiểm tra xem giá bán có hợp lệ không
        const item = tableData.find(item => item.key === key);
        if (item) {
            if (item.price < value) {
                setTableErrors(prev => ({ ...prev, [key]: 'Giá bán không được nhỏ hơn giá nhập!' }));
            } else {
                setTableErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors[key];
                    return newErrors;
                });
            }
        }
    };

    const handleApplyInputPrice = (key) => {
        // Tìm item được chọn theo key
        const selectedItem = tableData.find(item => item.key === key);

        if (selectedItem) {
            const updatedData = tableData.map((item) => {
                // Áp dụng giá nhập cho tất cả các item
                return { ...item, inputPrice: selectedItem.inputPrice }; // Cập nhật giá nhập cho tất cả các item
            });

            // Cập nhật lại dữ liệu của bảng
            setTableData(updatedData);
            setTableErrors({}); // Reset lỗi khi áp dụng giá nhập

            // Thông báo thành công
            message.success('Giá nhập đã được áp dụng cho tất cả các sản phẩm!');
        }
    };

    const handlePriceChange = (value, key) => {
        const updatedData = tableData.map((item) => {
            if (item.key === key) {
                return { ...item, price: value };
            }
            return item;
        });
        setTableData(updatedData);

        // Tìm item hiện tại để lấy giá nhập
        const item = tableData.find(item => item.key === key);
        if (item) {
            if (value < item.inputPrice) {
                setTableErrors(prev => ({ ...prev, [key]: 'Giá bán không được nhỏ hơn giá nhập!' }));
            } else {
                setTableErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors[key];
                    return newErrors;
                });
            }
        }
    };

    const handleApplyPrice = (key) => {
        // Tìm item được chọn theo key
        const selectedItem = tableData.find(item => item.key === key);

        if (selectedItem) {
            const updatedData = tableData.map((item) => {
                // Áp dụng giá bán cho tất cả các item
                return { ...item, price: selectedItem.price }; // Cập nhật giá bán cho tất cả các item
            });

            // Cập nhật lại dữ liệu của bảng
            setTableData(updatedData);

            // Kiểm tra lại lỗi sau khi áp dụng
            const hasError = updatedData.some(item => item.price < item.inputPrice);
            if (hasError) {
                const newErrors = {};
                updatedData.forEach(item => {
                    if (item.price < item.inputPrice) {
                        newErrors[item.key] = 'Giá bán không được nhỏ hơn giá nhập!';
                    }
                });
                setTableErrors(newErrors);
                message.error('Có một số sản phẩm có giá bán nhỏ hơn giá nhập!');
            } else {
                setTableErrors({});
                message.success('Giá bán đã được áp dụng cho tất cả các sản phẩm!');
            }
        }
    };

    // Hàm để lưu ảnh tạm vào tableData khi chọn ảnh
    const handleImageUpload = (info, record) => {
        const file = info.file;

        if (file instanceof File) {  // Kiểm tra xem đối tượng có là instance của File không
            const reader = new FileReader();

            reader.onload = () => {
                const updatedData = tableData.map((item) => {
                    if (item.key === record.key) {
                        return { ...item, image: reader.result, imageFile: file };  // Gán đối tượng file trực tiếp
                    }
                    return item;
                });
                setTableData(updatedData);
            };

            reader.readAsDataURL(file);
        } else {
            console.error("Ảnh không hợp lệ hoặc không phải là đối tượng File.");
            message.error("Ảnh không hợp lệ. Vui lòng chọn lại.");
        }
    };

    const uploadImageToImgBB = async (imageFile) => {
        const formData = new FormData();
        formData.append('image', imageFile);

        try {
            const response = await axios.post(`https://api.imgbb.com/1/upload?key=${API_KEY}`, formData);
            return response.data.data.url;
        } catch (error) {
            console.error('Lỗi khi tải ảnh lên ImgBB:', error);
            return null;
        }
    };

    const resetForm = () => {
        form.resetFields();  // Đặt lại tất cả các trường trong form
        setTableData([]);  // Đặt lại dữ liệu bảng
        setSelectedColors([]);  // Đặt lại màu sắc đã chọn
        setSelectedSizes([]);   // Đặt lại kích cỡ đã chọn
        setSelectedTags([]);    // Đặt lại tags đã chọn (nếu bạn theo dõi trong state)
        setTableErrors({});     // Đặt lại lỗi bảng
    };

    const onFinish = async (values) => {
        console.log("Form values:", values);

        // Xác thực trước khi gửi form
        let hasError = false;
        const newErrors = {};

        tableData.forEach(detail => {
            if (detail.price < detail.inputPrice) {
                hasError = true;
                newErrors[detail.key] = 'Giá bán không được nhỏ hơn giá nhập!';
            }
        });

        if (hasError) {
            setTableErrors(newErrors);
            message.error('Vui lòng kiểm tra lại giá bán và giá nhập của các sản phẩm!');
            return;
        }

        try {
            const updatedTableData = await Promise.all(
                tableData.map(async (detail) => {
                    if (detail.imageFile) {  // Kiểm tra xem `imageFile` có tồn tại không
                        const imageUrl = await uploadImageToImgBB(detail.imageFile);
                        return { ...detail, image: imageUrl };
                    }
                    return detail;
                })
            );

            const productWrapperRequest = {
                productRequets: {
                    name: values.name,
                    description: values.description,
                    status: 'ACTIVE',
                    categoryId: values.categoryId,
                    brandId: values.brandId,
                    tagIds: values.tagIds && values.tagIds.length > 0 ? values.tagIds : [],
                    materialId: values.materialId || null,
                },
                productDetailRequetsList: updatedTableData.map(detail => ({
                    price: detail.price,
                    inputPrice: detail.inputPrice,
                    sizeId: sizes.find(size => size.name === detail.size)?.id || null,
                    colorId: colors.find(color => color.name === detail.color)?.id || null,
                    quantity: detail.quantity,
                    image: detail.image, // Đường dẫn ảnh từ ImgBB
                })),
            };
            await addProductWapper(productWrapperRequest);
            message.success('Sản phẩm đã được thêm thành công!');
            resetForm();
        } catch (error) {
            console.error('Lỗi khi thêm sản phẩm:', error);
            message.error('Có lỗi khi thêm sản phẩm.');
        }
    };

    const handleMouseEnter = (key, column) => {
        setHoveredKey({ key, column }); // Lưu lại key và cột đang hover
    };

    const handleMouseLeave = () => {
        setHoveredKey(null);  // Khi con trỏ chuột ra khỏi ô, ẩn nút "Áp dụng"
    };

    const columns = [
        {
            title: 'Màu Sắc',
            dataIndex: 'color',
            key: 'color',
        },
        {
            title: 'Kích Cỡ',
            dataIndex: 'size',
            key: 'size',
        },
        {
            title: 'Số Lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (text, record) => (
                <div
                    style={{ display: 'flex', alignItems: 'center', width: '100%' }}
                    onMouseEnter={() => handleMouseEnter(record.key, 'quantity')}
                    onMouseLeave={handleMouseLeave}
                >
                    <InputNumber
                        min={0}
                        value={record.quantity}
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={(value) => value.replace(/(,*)/g, '')}
                        onChange={(value) => handleQuantityChange(value, record.key)}
                        style={{ marginRight: '10px', width: '100%' }}
                    />
                    {hoveredKey?.key === record.key && hoveredKey?.column === 'quantity' && (
                        <Button
                            onClick={() => handleApplyQuantity(record.key)}
                            size="small"
                            type="primary"
                            style={{
                                position: 'absolute',
                                right: 0,
                                bottom: 0,
                                fontSize: '12px',
                                padding: '4px 8px',
                            }}
                        >
                            Áp dụng cho tất cả
                        </Button>
                    )}
                </div>
            ),
        },
        // {
        //     title: 'Giá nhập',
        //     dataIndex: 'inputPrice',
        //     key: 'inputPrice',
        //     render: (text, record) => (
        //         <div
        //             style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', width: '100%' }}
        //             onMouseEnter={() => handleMouseEnter(record.key, 'inputPrice')}
        //             onMouseLeave={handleMouseLeave}
        //         >
        //             <InputNumber
        //                 min={0}
        //                 value={record.inputPrice}
        //                 formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        //                 parser={(value) => value.replace(/(,*)/g, '')}
        //                 onChange={(value) => handleInputPriceChange(value, record.key)}
        //                 style={{ marginRight: '10px', width: '100%' }}
        //             />
        //             {hoveredKey?.key === record.key && hoveredKey?.column === 'inputPrice' && (
        //                 <Button
        //                     onClick={() => handleApplyInputPrice(record.key)}
        //                     size="small"
        //                     type="primary"
        //                     style={{
        //                         position: 'absolute',
        //                         right: 0,
        //                         bottom: 0,
        //                         fontSize: '12px',
        //                         padding: '4px 8px',
        //                     }}
        //                 >
        //                     Áp dụng cho tất cả
        //                 </Button>
        //             )}
        //             {tableErrors[record.key] && (
        //                 <div style={{ color: 'red', fontSize: '12px', marginTop: '4px', width: '100%' }}>
        //                     {tableErrors[record.key]}
        //                 </div>
        //             )}
        //         </div>
        //     ),
        // },
        {
            title: 'Giá bán',
            dataIndex: 'price',
            key: 'price',
            render: (text, record) => (
                <div
                    style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', width: '100%' }}
                    onMouseEnter={() => handleMouseEnter(record.key, 'price')}
                    onMouseLeave={handleMouseLeave}
                >
                    <InputNumber
                        min={0}
                        value={record.price}
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={(value) => value.replace(/(,*)/g, '')}
                        onChange={(value) => handlePriceChange(value, record.key)}
                        style={{ marginRight: '10px', width: '100%' }}
                    />
                    {hoveredKey?.key === record.key && hoveredKey?.column === 'price' && (
                        <Button
                            onClick={() => handleApplyPrice(record.key)}
                            size="small"
                            type="primary"
                            style={{
                                position: 'absolute',
                                right: 0,
                                bottom: 0,
                                fontSize: '12px',
                                padding: '4px 8px',
                            }}
                        >
                            Áp dụng cho tất cả
                        </Button>
                    )}
                    {tableErrors[record.key] && (
                        <div style={{ color: 'red', fontSize: '12px', marginTop: '4px', width: '100%' }}>
                            {tableErrors[record.key]}
                        </div>
                    )}
                </div>
            ),
        },
        {
            title: 'Ảnh',
            dataIndex: 'image',
            key: 'image',
            render: (text, record) => (
                <>
                    <Upload
                        beforeUpload={() => false}
                        onChange={(info) => handleImageUpload(info, record)}
                        showUploadList={false}   // Ẩn danh sách file
                        maxCount={1}             // Chỉ cho chọn 1 ảnh duy nhất
                    >
                        <Button icon={<PlusOutlined />}>Tải Ảnh</Button>
                    </Upload>
                    {record.image && (
                        <img
                            src={record.image}
                            alt="Ảnh sản phẩm"
                            style={{ width: '50px', marginTop: '10px' }}
                        />
                    )}
                </>
            ),
        }

    ];

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '30px', fontWeight: 'bold', fontSize: '24px' }}>Thêm Sản Phẩm</h2>
            <Row gutter={16}>
                <Col span={16}>
                    <div style={{
                        padding: '16px',
                        marginBottom: '20px',
                        border: '1px solid',
                        borderRadius: '8px',
                        backgroundColor: '#fff'
                    }}>
                        <Form layout="vertical" onFinish={onFinish} form={form}>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Tên sản phẩm"
                                        name="name"
                                        rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
                                    >
                                        <Input placeholder="Nhập tên sản phẩm" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Thương hiệu"
                                        name="brandId"
                                        rules={[{ required: true, message: 'Vui lòng chọn thương hiệu' }]}
                                    >
                                        <Select placeholder="Chọn thương hiệu">
                                            {brands.map(brand => (
                                                <Option key={brand.id} value={brand.id}>{brand.name}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Thể Loại"
                                        name="categoryId"
                                        rules={[{ required: true, message: 'Vui lòng chọn thể loại' }]}
                                    >
                                        <Select placeholder="Chọn thể loại">
                                            {categories.map(category => (
                                                <Option key={category.id} value={category.id}>{category.name}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>

                                <Col span={12}>
                                    <Form.Item
                                        label="Chất Liệu"
                                        name="materialId"
                                        rules={[{ required: true, message: 'Vui lòng chọn chất liệu' }]}
                                    >
                                        <Select placeholder="Chọn chất liệu">
                                            {materials.map(material => (
                                                <Option key={material.id} value={material.id}>{material.name}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>

                            {/*<Row gutter={16}>*/}
                            {/*    <Col span={12}>*/}
                            {/*        <Form.Item*/}
                            {/*            label="Thể Loại"*/}
                            {/*            name="categoryId"*/}
                            {/*            rules={[{ required: true, message: 'Vui lòng chọn thể loại' }]}*/}
                            {/*        >*/}
                            {/*            <Select placeholder="Chọn thể loại">*/}
                            {/*                {filteredCategories.map(category => (*/}
                            {/*                    <Option key={category.id} value={category.id}>{category.name}</Option>*/}
                            {/*                ))}*/}
                            {/*            </Select>*/}
                            {/*        </Form.Item>*/}
                            {/*    </Col>*/}
                            {/*</Row>*/}

                            <Row gutter={16}>
                                <Col span={24}>
                                    <Form.Item
                                        label="Mô Tả Sản Phẩm"
                                        name="description"
                                    >
                                        <Input.TextArea placeholder="Nhập mô tả sản phẩm" autoSize={{ minRows: 5, maxRows: 10 }} />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Divider />
                            <h3>Thông tin chi tiết sản phẩm</h3>
                            <Table columns={columns} dataSource={tableData} pagination={false} />

                            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                                <Button type="primary" htmlType="submit" style={{ marginRight: '10px' }}>
                                    Thêm Sản Phẩm
                                </Button>
                                <Button type="link" onClick={onCancel}>
                                    Quay lại danh sách sản phẩm
                                </Button>
                            </div>
                        </Form>
                    </div>
                </Col>

                <Col span={8}>
                    <div style={{
                        padding: '16px',
                        marginBottom: '20px',
                        border: '1px solid',
                        borderRadius: '8px',
                        backgroundColor: '#fff'
                    }}>
                        <Divider orientation="left">Phiên Bản</Divider>
                        <Form.Item label="Màu Sắc">
                            <Select
                                mode="multiple"
                                placeholder="Chọn màu sắc"
                                allowClear
                                value={selectedColors}
                                onChange={handleColorsChange}
                            >
                                {colors.map(color => (
                                    <Option key={color.id} value={color.name}>{color.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item label="Kích Cỡ">
                            <Select
                                mode="multiple"
                                placeholder="Chọn kích cỡ"
                                allowClear
                                value={selectedSizes}
                                onChange={handleSizesChange}
                            >
                                {sizes.map(size => (
                                    <Option key={size.id} value={size.name}>{size.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>

                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default AddProduct;
