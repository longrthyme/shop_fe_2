import {handleApiRequest} from "./HandleRequest";

export const getUser = async (page, limit, sortBy, id) => {
    try {
        const token = localStorage.getItem('access_token'); // Lấy token từ localStorage
        // Xây dựng URL với các tham số page, limit, sortBy
        const url = new URL(`http://localhost:8022/api/v2/user/findAll`);

        // Thêm các tham số vào URL
        url.searchParams.append('page', page);
        url.searchParams.append('limit', limit);
        if (sortBy) {
            url.searchParams.append('sortby', sortBy); // Nếu có giá trị sortBy, thêm vào URL
        }
        url.searchParams.append('id', id);
        console.log("đây là url trong api",url);

        return handleApiRequest(url, {
            method: 'GET',
        });
    } catch (error) {
        throw error;
    }
};
export const getAllUser = async () => {
    try {
        const token = localStorage.getItem('access_token');
        const url = 'http://localhost:8022/api/v2/user/getAll';

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch data");
        }

        const data = await response.json(); // Parse JSON data here
        console.log("Data inside getAllUser:", data); // Log to verify
        return data; // Make sure to return the parsed data
    } catch (error) {
        console.error("Error in getAllUser:", error);
        throw error;
    }
};

export const findUserById = async (id) => {
    try {
        const url = new URL(`http://localhost:8022/api/v2/user/${id}`)
        return handleApiRequest(url,{ method: 'GET'})
    } catch (error) {
        console.error("Error when fetching user by ID:", error.message);
        throw error;
    }
};

export const findUserByPhone = async (phone) => {
    try {
        const url = new URL(`http://localhost:8022/api/v2/user/User/${phone}`)
        return handleApiRequest(url,{ method: 'GET'})
    } catch (error) {
        console.error("Error when fetching user by phone:", error.message);
        throw error;
    }
};

export const updateUser = async (user,userId) => {
    try {
        const url = new URL(`http://localhost:8022/api/v2/user/update/${userId}`);
        console.log("data user", user);
        return handleApiRequest(url, {
            method: 'PUT',
            body: JSON.stringify({
                email: user.email,
                fullName: user.fullName,
                address: user.address,
                phone: user.phone,
                avatarUrl: user.avatarUrl,
                isDeleted: user.isDeleted
            })
        });
    } catch (error) {
        throw new Error(`Cập nhật thất bại: ${error.message}`);
    }
};

export const deleteUser = async (userId) => {
    try {
        const url = new URL(`http://localhost:8022/api/v2/user/delete/${userId}`);
        return handleApiRequest(url,{
            method: 'DELETE'
        })
    }catch (error) {
        throw new Error(`Xoá thất bại: ${error.message}`);
    }
};

export const createUser = async (user) => {
    try {
        const url = new URL(`http://localhost:8022/api/v2/user/add`);
        return handleApiRequest(url,{
            method: 'POST',
            body: JSON.stringify({
                fullName: user.fullName,
                address: user.address,
                phone: user.phone
            })
        })
    }catch (error) {
        throw new Error(`Thêm mới thất bại: ${error.message}`);
    }
};
