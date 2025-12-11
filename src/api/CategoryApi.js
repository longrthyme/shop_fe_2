import { handleApiRequest } from "./HandleRequest";

export const getCategoryList = async (page, limit, sortBy, status) => {
    try {
        const url = new URL(`http://localhost:8022/api/v2/category/findAll`);
        url.searchParams.append('page', page);
        url.searchParams.append('limit', limit);
        if (sortBy) {
            url.searchParams.append('sortby', sortBy);
        }
        if (status !== undefined && status !== null) {
            url.searchParams.append('status', status); // ✅ Lọc theo trạng thái int
        }
        console.log("đây là url trong api", url);

        return handleApiRequest(url, { method: 'GET' });
    } catch (error) {
        throw error;
    }
};

export const searchCategory = async (page, limit, sortBy, search) => {
    try {
        const url = new URL(`http://localhost:8022/api/v2/category/search`);
        url.searchParams.append('page', page);
        url.searchParams.append('size', limit);
        if (sortBy) {
            url.searchParams.append('sortby', sortBy);
        }
        if (search) {
            url.searchParams.append('search', search);
        }
        console.log("đây là url trong api", url);

        return handleApiRequest(url, { method: 'GET' });
    } catch (error) {
        throw error;
    }
};
export const findCategoryById = async (id) => {
    try {
        const url = new URL(`http://localhost:8022/api/v2/category/${id}`);
        return handleApiRequest(url, { method: 'GET' });
    } catch (error) {
        console.error("Error when fetching category by ID:", error.message);
        throw error;
    }
};

export const updateCategory = async (id, updatedValues) => {
    try {
        const url = new URL(`http://localhost:8022/api/v2/category/update/${id}`);
        console.log("data CategoryUpdate", updatedValues);
        const statusInt = Number(updatedValues.status);
        return handleApiRequest(url, {
            method: 'PUT',
            body: JSON.stringify({
                name: updatedValues.name,
                type: updatedValues.type,
                description: updatedValues.description,
                status: statusInt,   // ✅ trạng thái int
            })
        });
    } catch (error) {
        throw new Error(`Cập nhật thất bại: ${error.message}`);
    }
};

export const createCategory = async (categoryData) => {
    try {
        const url = new URL(`http://localhost:8022/api/v2/category/add`);
        return handleApiRequest(url, {
            method: 'POST',
            body: JSON.stringify({
                name: categoryData.name,
                type: categoryData.type,
                description: categoryData.description,
                status: categoryData.status // ✅ trạng thái int
            })
        });
    } catch (error) {
        throw new Error(`Thêm mới thất bại: ${error.message}`);
    }
};

export const deleteCategory = async (id) => {
    try {
        const url = new URL(`http://localhost:8022/api/v2/category/delete/${id}`);
        return handleApiRequest(url, {
            method: 'DELETE'
        });
    } catch (error) {
        throw new Error(`Xoá thất bại: ${error.message}`);
    }
};
