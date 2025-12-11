import React, { useState } from 'react';


import Header from './Header';
import ProductDetail from './ProductDetail';
import Footer from './Footer';
import Concat from './Concat';
import A from './KK';

function IndexProductDetail() {

    return (
        <div className="App">
            {/*<div className="container-fluid p-0">*/}
            {/*    <div className="noti_bar" style={{ backgroundColor: 'black', display: 'flex', justifyContent: 'left', alignItems: 'center', padding: '10px', paddingLeft: '40px' }}>*/}
            {/*        <p className="text-left" style={{ color: 'white', lineHeight: '20px', margin: 0 }}>*/}
            {/*            Hotline mua hàng: 0977488888 (8:30-21:30, Tất cả các ngày trong tuần) |*/}
            {/*            <a href="mailto:support@example.com" style={{ color: '#007bff', textDecoration: 'none', marginLeft: '5px' }}>Liên hệ</a>*/}
            {/*        </p>*/}
            {/*    </div>*/}
            {/*</div>*/}
            <Header />
            {/*<div className="breadcrumb-container container" style={{ padding: '18px' }}>*/}
            {/*    <nav aria-label="breadcrumb">*/}
            {/*        <ol className="breadcrumb">*/}
            {/*            <li className="breadcrumb-item"><a href="/items">Home</a></li>*/}
            {/*            <li className="breadcrumb-item active" aria-current="page">Product Detail</li>*/}
            {/*        </ol>*/}
            {/*    </nav>*/}
            {/*</div>*/}
            <ProductDetail />
            <A/>
            {/*<h1>Các sản phẩm liên quan</h1>*/}
            <Footer />
            <Concat />
        </div>
    );
}

export default IndexProductDetail;


// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';

// function Appp() {
//   const { id } = useParams();
//   const [product, setProduct] = useState(null);

//   useEffect(() => {
//     // Thay thế {{id}} bằng giá trị thực của id
//     fetch(`http://localhost:8022/api/v2/product/findbyid/${id}`)
//       .then((response) => response.json())
//       .then((data) => setProduct(data))
//       .catch((error) => console.error("Error fetching product data:", error));
//   }, [id]);

//   if (!product) return <div>Loading...</div>;

//   return (
//     <div className="container d-flex justify-content-between" style={{ marginBottom: '80px' }}>
//       <div className="content_left" style={{ width: '512px', height: '548px', backgroundColor: '#F6F6F6', borderRadius: '6px', marginRight: '10px' }}>
//         <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
//           <div className="carousel-inner" style={{ padding: '28px' }}>
//             {product.productDetails && product.productDetails.map((detail, index) => (
//               <div className={`carousel-item ${index === 0 ? 'active' : ''} text-center`} key={index}>
//                 <img src={detail.image} style={{ width: '80%' }} alt="product" />
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//       <div className="content_right" style={{ width: '512px', height: '548px', marginRight: '108px' }}>
//         <h3>{product.name}</h3>
//         <h4>{product.price}₫</h4>
//       </div>
//     </div>
//   );
// }

// export default Appp;
