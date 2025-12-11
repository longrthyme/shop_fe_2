import {handleApiRequest} from "../../api/HandleRequest";

const API_URL = 'http://localhost:8022/api/v2/size';

export const getAllSize = async (page, limit, sortBy) => {
    try {
        const token = localStorage.getItem('access_token'); // Lấy token từ localStorage
        // Xây dựng URL với các tham số page, limit, sortBy
        const url = new URL(`${API_URL}/getall`);

        // Thêm các tham số vào URL
        url.searchParams.append('page', page);
        url.searchParams.append('limit', limit);
        if (sortBy) {
            url.searchParams.append('sortby', sortBy); // Nếu có giá trị sortBy, thêm vào URL
        }
        console.log("đây là url trong api",url);

        return handleApiRequest(url, {
            method: 'GET',
        });
    } catch (error) {
        throw error;
    }
};

export const searchSize = async (page, limit, sortBy, search) => {
    try {
        const token = localStorage.getItem('access_token'); // Lấy token từ localStorage
        // Xây dựng URL với các tham số page, limit, sortBy
        const url = new URL(`${API_URL}/search`);

        // Thêm các tham số vào URL
        url.searchParams.append('page', page);
        url.searchParams.append('size', limit);
        url.searchParams.append('search', search);
        if (sortBy) {
            url.searchParams.append('sortby', sortBy); // Nếu có giá trị sortBy, thêm vào URL
        }
        console.log("đây là url trong api",url);

        return handleApiRequest(url, {
            method: 'GET',
        });
    } catch (error) {
        throw error;
    }
};
export const createSize = async (size) => {
    try {
        const url = new URL(`${API_URL}/add`);
        console.log("sending size data", {
            name: size.name,
            description: size.description,
            status: Number(size.status),
            isDeleted: size.isDeleted ?? false
        });

        return handleApiRequest(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: size.name,
                description: size.description,
                status: Number(size.status), // đảm bảo int
                isDeleted: size.isDeleted ?? false // mặc định false
            })
        });
    } catch (error) {
        throw new Error(`Thêm mới thất bại: ${error.message}`);
    }
};

export const updateSize = async (sizeId, size) => {
    try {
        const url = new URL(`${API_URL}/update/${sizeId}`);
        console.log("data size", size);
        return handleApiRequest(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: size.name,
                description: size.description,
                status: Number(size.status), // đảm bảo là int
                isDeleted: size.isDeleted ?? false
            })
        });
    } catch (error) {
        throw new Error(`Cập nhật thất bại: ${error.message}`);
    }
};


export const deleteSize = async (sizeId) => {
    try {
        const url = new URL(`${API_URL}/deleteSize/${sizeId}`);
        return handleApiRequest(url,{
            method: 'DELETE'
        })
    }catch (error) {
        throw new Error(`Xoá thất bại: ${error.message}`);
    }
};
