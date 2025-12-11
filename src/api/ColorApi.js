import { handleApiRequest } from "./HandleRequest";

export const getColorList = async (page = 0, limit = 10, sortBy = "id") => {
    try {
        const url = new URL(`http://localhost:8022/api/v2/color/findAll`);

        if (page !== undefined && page !== null) {
            url.searchParams.append("page", page);
        }
        if (limit !== undefined && limit !== null) {
            url.searchParams.append("limit", limit);
        }
        if (sortBy) {
            url.searchParams.append("sortby", sortBy);
        }

        console.log("URL API getColorList:", url.toString());

        return handleApiRequest(url, { method: "GET" });
    } catch (error) {
        throw error;
    }
};

export const searchList = async (page = 0, limit = 10, sortBy = "id", search) => {
    try {
        const url = new URL(`http://localhost:8022/api/v2/color/search`);

        if (page !== undefined && page !== null) {
            url.searchParams.append("page", page);
        }
        if (limit !== undefined && limit !== null) {
            url.searchParams.append("size", limit);
        }
        if (sortBy) {
            url.searchParams.append("sortby", sortBy);
        }
        if (search) {
            url.searchParams.append("search", search);
        }

        console.log("URL API getColorList:", url.toString());

        return handleApiRequest(url, { method: "GET" });
    } catch (error) {
        throw error;
    }
};


export const findColorById = async (id) => {
    try {
        const url = new URL(`http://localhost:8022/api/v2/color/${id}`);
        return handleApiRequest(url, { method: 'GET' });
    } catch (error) {
        console.error("Error when fetching color by ID:", error.message);
        throw error;
    }
};

export const updateColor = async (color, colorId) => {
    try {
        const url = new URL(`http://localhost:8022/api/v2/color/update/${colorId}`);
        console.log("data color update:", color);
        return handleApiRequest(url, {
            method: 'PUT',
            body: JSON.stringify({
                name: color.name,
                code: color.code,
                status: Number(color.status), // thêm status
                isDeleted: color.isDeleted ?? false,
            })
        });
    } catch (error) {
        throw new Error(`Cập nhật thất bại: ${error.message}`);
    }
};

export const deleteColor = async (colorId) => {
    try {
        const url = new URL(`http://localhost:8022/api/v2/color/delete/${colorId}`);
        return handleApiRequest(url, {
            method: 'DELETE'
        });
    } catch (error) {
        throw new Error(`Xoá thất bại: ${error.message}`);
    }
};

export const createColor = async (color) => {
    try {
        const url = new URL(`http://localhost:8022/api/v2/color/add`);
        console.log("data color create:", color);
        return handleApiRequest(url, {
            method: 'POST',
            body: JSON.stringify({
                name: color.name,
                code: color.code,
                status: Number(color.status) || 1, // mặc định 1 nếu không truyền
                isDeleted: color.isDeleted ?? false,
            })
        });
    } catch (error) {
        throw new Error(`Thêm mới thất bại: ${error.message}`);
    }
};
