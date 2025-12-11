import {handleApiRequest} from "../../api/HandleRequest";

const API_URL = 'http://localhost:8022/api/v2/brand';

export const getAllBrands = async (page, limit, sortBy) => {
    try {
        const token = localStorage.getItem('access_token'); // Lấy token từ localStorage
        // Xây dựng URL với các tham số page, limit, sortBy
        const url = new URL(`${API_URL}/getall`);

        // Thêm các tham số vào URL
        url.searchParams.append('page', page);
        url.searchParams.append('limit', limit);
        if (sortBy) {
            url.searchParams.append('sortby', sortBy);
        }
        console.log("đây là url trong api",url);

        return handleApiRequest(url, {
            method: 'GET',
        });
    } catch (error) {
        throw error;
    }
};

export const searchBrands = async (page, limit, sortBy, search) => {
    try {
        const token = localStorage.getItem('access_token'); // Lấy token từ localStorage
        // Xây dựng URL với các tham số page, limit, sortBy
        const url = new URL(`${API_URL}/search`);

        // Thêm các tham số vào URL
        url.searchParams.append('page', page);
        url.searchParams.append('size', limit);
        url.searchParams.append('search', search);
        if (sortBy) {
            url.searchParams.append('sortby', sortBy);
        }
        console.log("đây là url trong api",url);

        return handleApiRequest(url, {
            method: 'GET',
        });
    } catch (error) {
        throw error;
    }
};

export const createBrand = async (brand) => {
    try {
        const url = new URL(`${API_URL}/addBrand`);
        return handleApiRequest(url,{
            method: 'POST',
            body: JSON.stringify({
                name: brand.name,
                description: brand.description,
                isDeleted: brand.isDeleted,
            })
        })
    }catch (error) {
        throw new Error(`Thêm mới thất bại: ${error.message}`);
    }
};


export const updateBrand = async (brandId, brand) => {
    try {
        const url = new URL(`${API_URL}/update/${brandId}`);
        console.log("data brand", brand);
        return handleApiRequest(url, {
            method: 'PUT',
            body: JSON.stringify({
                name: brand.name,
                description: brand.description,
                isDeleted: brand.isDeleted,
            })
        });
    } catch (error) {
        throw new Error(`Cập nhật thất bại: ${error.message}`);
    }
};



export const deleteBrand = async (brandId) => {
    try {
        const url = new URL(`${API_URL}/deleteBrand/${brandId}`);
        return handleApiRequest(url,{
            method: 'DELETE'
        })
    }catch (error) {
        throw new Error(`Xoá thất bại: ${error.message}`);
    }
};
