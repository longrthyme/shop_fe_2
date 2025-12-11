import {handleApiRequest} from "./HandleRequest";

export const getAllEmployee = async (page, limit, sortBy, id) => {
    try {
        const token = localStorage.getItem('access_token');

        const url = new URL(`http://localhost:8022/api/v2/employee/findAll`);

        url.searchParams.append('page', page);
        url.searchParams.append('limit', limit);
        if (sortBy) {
            url.searchParams.append('sortby', sortBy);
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

export const findEmployeeById = async (id) => {
    try {
        const url = new URL(`http://localhost:8022/api/v2/employee/${id}`)
        return handleApiRequest(url,{ method: 'GET'})
    } catch (error) {
        console.error("Error when fetching color by ID:", error.message);
        throw error;
    }
};

export const updateEmployee = async (emp,id) => {
    try {
        const url = new URL(`http://localhost:8022/api/v2/employee/update/${id}`);
        console.log("data emp", emp);
        return handleApiRequest(url, {
            method: 'PUT',
            body: JSON.stringify({
                username: emp.username,
                password: emp.password,
                email: emp.email,
                fullName: emp.fullName,
                address: emp.address,
                phone: emp.phone,
                avatarUrl: emp.avatarUrl,
                isDeleted: emp.isDeleted
            })
        });
    } catch (error) {
        throw new Error(`Cập nhật thất bại: ${error.message}`);
    }
};

export const deleteEmployee = async (id) => {
    try {
        const url = new URL(`http://localhost:8022/api/v2/employee/delete/${id}`);
        return handleApiRequest(url,{
            method: 'DELETE'
        })
    }catch (error) {
        throw new Error(`Xoá thất bại: ${error.message}`);
    }
};

export const createEmployee = async (emp) => {
    try {
        const url = new URL(`http://localhost:8022/api/v2/employee/add`);
        return handleApiRequest(url,{
            method: 'POST',
            body: JSON.stringify({
                username: emp.username,
                password: emp.password,
                email: emp.email,
                fullName: emp.fullName,
                address: emp.address,
                phone: emp.phone,
                avatarUrl: emp.avatarUrl,
                isDeleted: emp.isDeleted
            })
        })
    }catch (error) {
        throw new Error(`Thêm mới thất bại: ${error.message}`);
    }
};
