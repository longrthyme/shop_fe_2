import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById } from '../../../service/admin/ApiWebProduct';

function A() {
    const { id } = useParams(); // Lấy ID từ URL
    const [product, setProduct] = useState(null); // Lưu thông tin sản phẩm
    const [activeCategory, setActiveCategory] = useState('THÔNG TIN SẢN PHẨM'); // Theo dõi tab đang được chọn
    const [expanded, setExpanded] = useState(false); // Theo dõi trạng thái "Xem thêm"
    const [expandedFaq, setExpandedFaq] = useState(null); // Theo dõi câu hỏi nào đang được mở trong FAQ

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const productData = await getProductById(id); // Gọi API lấy chi tiết sản phẩm
                setProduct(productData); // Lưu dữ liệu vào state
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu sản phẩm:', error);
            }
        };

        fetchProduct();
    }, [id]);

    const faqData = [
        {
            question: 'Làm thế nào để tôi đặt hàng online?',
            answer: (
                <>

                </>
            ),
        },
        {
            question: 'Đặt hàng trên web tôi muốn đổi mẫu thì làm thế nào?',
            answer: 'Để đổi mẫu sản phẩm đã đặt hàng trên web, bạn có thể liên hệ với bộ phận hỗ trợ khách hàng của chúng tôi.',
        },
        {
            question: 'Tôi có được xem hàng và thử không?',
            answer: 'Bạn có thể xem hàng và thử tại các cửa hàng của QuickBy trên toàn quốc.',
        },
        {
            question: 'Tôi muốn đổi màu (size) thì cần làm gì?',
            answer: 'Vui lòng liên hệ với bộ phận hỗ trợ khách hàng để được hướng dẫn đổi màu hoặc size sản phẩm.',
        },
    ];

    const categories = [
        {
            name: 'THÔNG TIN SẢN PHẨM',
            content: product ? (
                <>
                    📍<b>Tên sản phẩm:</b> {product.name}<br />
                    📍<b>Chất liệu:</b> {product.material?.name || 'Đang cập nhật'}<br />
                    📍<b>Thương hiệu:</b> {product.brand?.name || 'Đang cập nhật'}<br />
                    📍<b>Size:</b> {[
                    ...new Set(product.productDetails.map(detail => detail.size.name))
                ].join(', ')}<br />
                    📍<b>Mô tả:</b> {product.description}<br />
                </>
            ) : (
                'Đang tải thông tin sản phẩm...'
            ),
        },
        {
            // name: 'Câu Hỏi Thường Gặp',
            content: (
                <div className="faq-section">
                    {faqData.map((faq, index) => (
                        <div key={index} className="faq-item">
                            <button
                                className="faq-question btn btn-link"
                                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                                style={{ textAlign: 'left', color: '#333', fontWeight: 'bold', textDecoration: 'none' }}
                            >
                                {faq.question}
                            </button>
                            {expandedFaq === index && (
                                <div className="faq-answer" style={{ paddingLeft: '20px', color: '#555' }}>
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ),
        },
    ];

    const handleCategoryClick = (category) => {
        setActiveCategory(category.name);
        setExpanded(false); // Reset trạng thái "Xem thêm"
        setExpandedFaq(null); // Reset trạng thái câu hỏi mở trong FAQ
    };

    const toggleExpanded = () => {
        setExpanded(!expanded);
    };

    return (
        <div className="App">
            {/* Danh sách các tab */}
            <div className="d-flex">
                {categories.map((category, index) => (
                    <button
                        key={index}
                        className={`btn ${activeCategory === category.name ? 'btn-dark' : 'btn-light'}`}
                        onClick={() => handleCategoryClick(category)}
                    >
                        {category.name}
                    </button>
                ))}
            </div>

            {/* Nội dung hiển thị */}
            <div className="content mt-4" style={{ lineHeight: '1.8', fontSize: '16px', textAlign: 'left' }}>
                {activeCategory !== 'THÔNG TIN SẢN PHẨM' && <h5>{activeCategory}</h5>}

                <p>
                    {expanded
                        ? categories.find(cat => cat.name === activeCategory)?.expandedContent
                        : categories.find(cat => cat.name === activeCategory)?.content}
                </p>
                {activeCategory === 'THÔNG TIN SẢN PHẨM' && product && (
                    <button className="btn btn-dark mt-3" onClick={toggleExpanded}>
                        {expanded ? 'RÚT GỌN NỘI DUNG' : 'XEM THÊM NỘI DUNG'}
                    </button>
                )}
            </div>
        </div>
    );
}

export default A;
