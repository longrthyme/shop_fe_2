import axios from 'axios';

const API_URL = 'http://localhost:8022/api/v1/user/product';

const BASE_URL = 'http://localhost:8022/api/v2';

// // API lấy danh sách danh mục (category)
// export const getCategoryList = async (page = 1, limit = 20, sortBy = null) => {
//     try {
//         const params = { page, limit, sortBy }; // Thêm các tham số vào request
//         const response = await axios.get(`${BASE_URL}/category/findAll`, { params });
//         return response.data; // Trả về dữ liệu từ API
//     } catch (error) {
//         console.error("Lỗi khi gọi API getCategoryList:", error);
//         throw error; // Ném lỗi để xử lý ở nơi gọi
//     }
// };
//
// // API lấy danh sách màu sắc (color)
// export const getColorList = async (page = 1, limit = 20) => {
//     try {
//         const params = { page, limit }; // Thêm các tham số vào request
//         const response = await axios.get(`http://localhost:8022/api/v2/color/findAll`, { params });
//         return response.data; // Trả về dữ liệu từ AP
//     } catch (error) {
//         console.error("Lỗi khi gọi API getColorList:", error);
//         throw error; // Ném lỗi để xử lý ở nơi gọi
//     }
// };

export const getAllProducts = async (page = 1, limit, sortBy = null, brandId = null, categoryId = null, materialId = null, minPrice = null, maxPrice = null, name = null, sizeIds = [], colorIds = []) => {
    try {
        const params = {page, limit, sortBy, brandId, categoryId, materialId, minPrice, maxPrice, name};
        if (sizeIds && sizeIds.length > 0) {
            params.sizeIds = sizeIds.join(',');
        } else {
            delete params.sizeIds;
        }

        if (colorIds && colorIds.length > 0) {
            params.colorIds = colorIds.join(',');
        } else {
            delete params.colorIds;
        }


        const response = await axios.get(`${API_URL}/findAll`, {params});
        return response.data;
    } catch (error) {
        console.error("Lỗi khi gọi API getAllProducts:", error);
        throw error;
    }
};


export const getLatestProducts = async (limit = 10) => {
    try {
        const response = await axios.get(`${API_URL}/productnew`, {
            params: {limit}
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi gọi API getLatestProducts:", error);
        throw error;
    }
};

export const getTotalQuantityByProductId = async (productId) => {
    const response = await axios.get(`${API_URL}/getTotalQuantity/${productId}`);
    return response.data;
};
export const getAvailableQuantityByProductDetailId = async (productDetailId) => {
    try {
        const response = await axios.get(`${API_URL}/getAvailableQuantity/${productDetailId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching available quantity:', error);
        throw error;
    }
};

export const getProductById = async (id) => {
    try {
        const response = await axios.get(`http://localhost:8022/api/v1/user/product/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Lỗi khi gọi API getProductById với id=${id}:`, error);
        throw error;
    }
};

export const list = () => axios.get("http://localhost:8022/api/v1/user/product/all");

export const getProductPrice = async (productId) => {
        const response = await axios.get(`${API_URL}/${productId}/price`);
        return response.data; // Trả về dải giá

};
export const getProductPriceBySizeColor = async (productId, size, color) => {
    try {
        const response = await axios.get(`${API_URL}/${productId}/price/size-color?sizeId=${size}&colorId=${color}`);
        return response.data; // Trả về giá chi tiết theo size và color
    } catch (error) {
        console.error(`Lỗi khi lấy giá sản phẩm theo size và color:`, error);
        throw error;
    }
};