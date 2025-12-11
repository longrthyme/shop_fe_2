import axios from "axios";
import {handleApiRequest} from "./HandleRequest";

// Lấy danh sách materials
export const getMaterialList = async (page, limit, sortBy) => {
    try {
        const token = localStorage.getItem('access_token'); // Lấy token từ localStorage
        // Xây dựng URL với các tham số page, limit, sortBy
        const url = new URL(`http://localhost:8022/api/v2/material/findAll`);

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

export const searchMaterial = async (page, limit, sortBy, search) => {
    try {
        const token = localStorage.getItem('access_token'); // Lấy token từ localStorage
        // Xây dựng URL với các tham số page, limit, sortBy
        const url = new URL(`http://localhost:8022/api/v2/material/search`);

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
// Lấy chi tiết Material theo ID
export const findMaterialById = async (id) => {
    try {
        const url = new URL(`http://localhost:8022/api/v2/material/${id}`)
        return handleApiRequest(url,{ method: 'GET'})
    } catch (error) {
        console.error("Error when fetching category by ID:", error.message);
        throw error;
    }
};

// Cập nhật Material
export const updateMaterial = async (material, materialId) => {
    try {
        const url = new URL(`http://localhost:8022/api/v2/material/update/${materialId}`);
        console.log("data material", material);
        return handleApiRequest(url, {
            method: 'PUT',
            body: JSON.stringify({
                name: material.name,
                description: material.description,
                status :material.status,
                isDeleted: material.isDeleted,
            })
        });
    } catch (error) {
        throw new Error(`Cập nhật thất bại: ${error.message}`);
    }
};

// Xóa Material
export const deleteMaterial = async (materialId) => {
    try {
        const url = new URL(`http://localhost:8022/api/v2/material/delete/${materialId}`);
        return handleApiRequest(url,{
            method: 'DELETE'
        })
    }catch (error) {
        throw new Error(`Xoá thất bại: ${error.message}`);
    }
};

// Tạo mới Material
export const createMaterial = async (material) => {
    try {
        const url = new URL(`http://localhost:8022/api/v2/material/add`);
        return handleApiRequest(url,{
            method: 'POST',
            body: JSON.stringify({
                name: material.name,
                description: material.description,
                status: material.status ?? 0,
            })
        })
    }catch (error) {
        throw new Error(`Thêm mới thất bại: ${error.message}`);
    }
};
