import React, {useState, useEffect} from 'react';
import {list} from '../../service/admin/ApiWebProduct';
import '../../assets/css/style.css'; // Import tệp CSS
import {Link, useNavigate} from 'react-router-dom';
import Header from "./ProductDetail/Header";

import {getAll} from '../../service/admin/ApiWebProduct';
import {ShoppingCartOutlined} from "@ant-design/icons";

const TrangChu = () => {
    const [employees, setEmployees] = useState([]);
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState('SẢN PHẨM NỔI BẬT');

    useEffect(() => {
        // Gọi hàm list để lấy dữ liệu nhân viên
        list()
            .then((response) => {
                console.log(response.data);
                setEmployees(response.data || []); // Cập nhật dữ liệu vào state
            })
            .catch(error => {
                console.error(error); // Xử lý lỗi
            });
    }, []);
    const handleViewClick = (employee) => {
        navigate(`/product/${employee.id}`);
    };


    const categories = [
        {name: 'Áo Khoác', image: '/Images/image/Category1.png'},
        {name: 'Bộ Nỉ', image: '/Images/image/Category2.png'},
        {name: 'Quần Jeans', image: '/Images/image/category3.png'},
        {name: 'Quần Âu', image: '/Images/image/category4.png'},
    ];
    const handleCategoryClick = (path) => {
        // Điều hướng đến trang danh mục tương ứng
        navigate(`/${path}`);
    };
    const categorie = [
        'TẤT CẢ SẢN PHẨM'

    ];
    const handleCategoryClic = (category) => {
        setActiveCategory(category);
    };

    return (
        <div className='container-fluit'>
            {/* Header */}
            <Header/>

            {/* Banner */}
            <div id="bannerCarousel" className="carousel slide" data-bs-ride="carousel" data-bs-interval="3000">
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <img src="/Images/image/x11.jpg" className="d-block w-100" alt="Slide 1" style={{ height: "500px", objectFit: "cover" }}/>

                    </div>
                    <div className="carousel-item">
                        <img src="/Images/image/v12.jpg" className="d-block w-100" alt="Slide 2" style={{ height: "500px", objectFit: "cover" }}/>

                    </div>
                    {/*<div className="carousel-item">*/}
                    {/*    <img src="/Images/image/banner2.png" className="d-block w-100" alt="Slide 3"/>*/}

                    {/*</div>*/}
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#bannerCarousel"
                        data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#bannerCarousel"
                        data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>


            {/* Features */}
            <div className="container d-flex align-items-center justify-content-between"
                 style={{padding: '20px', marginBottom: '88px'}}>
            </div>




            {/* BestSeller */}
            <div className="container-fluid">
                <div className="product-categories-filter">
                    {categorie.map((category, index) => (
                        <span
                            key={index}
                            className={`category-item ${activeCategory === category ? 'active' : ''}`}
                            onClick={() => handleCategoryClic(category)}
                        >
                {category}
            </span>
                    ))}
                </div>

                {/* Product Grid */}
                <div className="product-container border ">
                    <div className="row g-2">
                        {employees  .filter(product => product.status === "ACTIVE").slice(0, 10).map((employee) => {
                            const representativeImage = employee.productDetails.length > 0
                                ? employee.productDetails[0].image
                                : '/path/to/default/image.jpg';

                            return (
                                <div key={employee.id} className="col-5ths mb-4">
                                    <div className="card product-card text-left"><div className="product-image-containe">
                                            <img
                                                src={representativeImage}
                                                alt={`Product ${employee.name}`}
                                                className="product-image "
                                            />


                                            {/* Hover Overlay */}
                                            <div className="overlay ">
                                                <button
                                                    className="btn btn-dark"
                                                    onClick={() => handleViewClick(employee)}
                                                >
                                                    <ShoppingCartOutlined /> Thêm vào giỏ
                                                </button>
                                            </div>
                                        </div>
                                        <div className="card-body product-info text-center"  >
                                            {/*<div className="product-options text-muted">*/}
                                            {/*    +{new Set(employee.productDetails.map(detail => detail.color.name)).size} Màu*/}
                                            {/*    sắc |*/}
                                            {/*    +{new Set(employee.productDetails.map(detail => detail.size.name)).size} Kích*/}
                                            {/*    thước*/}
                                            {/*</div>*/}
                                            <h5 className=" product-title">{employee.name}</h5>
                                            <div >
                                                <span className="new-price text-danger">
    {employee.productDetails && employee.productDetails.length > 0 && employee.productDetails[0].price
        ? `${employee.productDetails[0].price.toLocaleString('en-US')}₫`
        : 'Giá không xác định'}
</span>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>


            </div>




            <div className="features-container">

            </div>


            {/* Footer */}
            <footer className="footer">
                <div className="footer-container">

                    <div className="footer-column">
                        <h4>Thời trang nam</h4>
                        <p>Hệ thống thời trang cho phái mạnh hàng đầu Việt Nam, hướng tới phong cách nam tính, lịch lãm
                            và trẻ trung.</p>
                        <div className="social-icons">
                            <i className="fab fa-facebook"></i>
                            <i className="fab fa-twitter"></i>
                            <i className="fab fa-instagram"></i>
                            <i className="fab fa-tiktok"></i>
                        </div>

                    </div>


                    <div className="footer-column">
                        <h4>Thông tin liên hệ</h4>
                        <p><strong>Địa chỉ:</strong> Tòa nhà FPT Polytechnic, phố Trịnh Văn Bô, phường Phương Canh, quận
                            Nam Từ Liêm, TP Hà Nội
                        </p>
                        <p><strong>Điện thoại:</strong> 0923912123</p>
                        {/*<p><strong>Email:</strong> cskh@torano.vn</p>*/}

                    </div>

                    <div className="footer-column">
                        <h4>Nhóm liên kết</h4>
                        <ul>
                            <li><a href="#">Tìm kiếm</a></li>
                            <li><a href="#">Giới thiệu</a></li>
                            {/*<li><a href="#">Chính sách đổi trả</a></li>*/}
                            {/*<li><a href="#">Tuyển dụng</a></li>*/}
                            {/*<li><a href="#">Liên hệ</a></li>*/}
                        </ul>
                    </div>

                    {/* Cột 4: Đăng ký nhận tin */}
                    {/*<div className="footer-column">*/}
                    {/*    <h4>Đăng ký nhận tin</h4>*/}
                    {/*    <p>Để cập nhật những sản phẩm mới, nhận thông tin ưu đãi đặc biệt và thông tin giảm giá*/}
                    {/*        khác.</p>*/}
                    {/*    <div className="newsletter-signup">*/}
                    {/*        <input type="email" placeholder="Nhập email của bạn"/>*/}
                    {/*        <button>ĐĂNG KÝ</button>*/}
                    {/*    </div>*/}

                    {/*</div>*/}
                </div>
            </footer>

        </div>
    );
};

export default TrangChu;
