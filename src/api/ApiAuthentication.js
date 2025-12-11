import {handleApiRequest} from "./HandleRequest";

export const loginApi = async (credentials) => {
    try {
        const response = await fetch('http://localhost:8022/api/v1/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            // Nếu có lỗi, đọc thông báo lỗi từ response body
            const errorData = await response.json();
            console.log("Đây là response lỗi từ AuthenAPI:", errorData);
            throw new Error(errorData.message || 'Unknown error occurred');
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const logoutApi = async (credentials) => {
    try {
        const url = new URL(`http://localhost:8022/api/v1/logout`)
        return handleApiRequest(url,{ method: 'GET'})
    } catch (error) {
        throw error;
    }
};

export const registerUser = async (credentials) => {
    try {
        console.log("thong tin register",credentials)
        const url = new URL(`http://localhost:8022/api/v1/register`);
        const response = await fetch('http://localhost:8022/api/v1/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            // Nếu có lỗi, đọc thông báo lỗi từ response body
            const errorData = await response.json();
            console.log("Đây là response lỗi từ AuthenAPI:", errorData);
            throw new Error(errorData.message || 'Unknown error occurred');
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
};
