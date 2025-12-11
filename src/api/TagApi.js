import {handleApiRequest} from "./HandleRequest";

export const getTagList = async (page, limit, sortBy) => {
    try {
        const token = localStorage.getItem('access_token'); // Lấy token từ localStorage
        // Xây dựng URL với các tham số page, limit, sortBy
        const url = new URL(`http://localhost:8022/api/v2/tag/findAll`);

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

export const findTagById = async (id) => {
    try {
        const url = new URL(`http://localhost:8022/api/v2/tag/${id}`)
        return handleApiRequest(url,{ method: 'GET'})
    } catch (error) {
        console.error("Error when fetching category by ID:", error.message);
        throw error;
    }
};

export const updateTag = async (tag,tagId) => {
    try {
        const url = new URL(`http://localhost:8022/api/v2/tag/update/${tagId}`);
        console.log("data tag", tag);
        return handleApiRequest(url, {
            method: 'PUT',
            body: JSON.stringify({
                name: tag.name,
                tagContent: tag.tagContent,
                isDeleted: tag.isDeleted,
            })
        });
    } catch (error) {
        throw new Error(`Cập nhật thất bại: ${error.message}`);
    }
};

export const deleteTag = async (tagId) => {
    try {
        const url = new URL(`http://localhost:8022/api/v2/tag/Delete/${tagId}`);
        return handleApiRequest(url,{
            method: 'DELETE'
        })
    }catch (error) {
        throw new Error(`Xoá thất bại: ${error.message}`);
    }
};

export const createTag = async (tag) => {
    try {
        const url = new URL(`http://localhost:8022/api/v2/tag/add`);
        return handleApiRequest(url,{
            method: 'POST',
            body: JSON.stringify({
                name: tag.name,
                tagContent: tag.tagContent,
                isDeleted: tag.isDeleted,
            })
        })
    }catch (error) {
        throw new Error(`Thêm mới thất bại: ${error.message}`);
    }
};

