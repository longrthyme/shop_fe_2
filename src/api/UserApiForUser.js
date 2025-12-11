import {handleApiRequest} from "./HandleRequest";

export const findUserById = async () => {
    try {
        const url = new URL(`http://localhost:8022/api/v1/user/id`)
        return handleApiRequest(url,{ method: 'GET'})
    } catch (error) {
        console.error("Error when fetching user by ID:", error.message);
        throw error;
    }
};

export const updateUser = async (user) => {
    try {
        const url = new URL(`http://localhost:8022/api/v1/user/update`);
        console.log("data user", user);

        // Tạo payload chỉ chứa các trường cần thiết
        const payload = {
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            address: user.address,
            phone: user.phone,
            avatarUrl: user.avatarUrl,
        };

        // Chỉ thêm mật khẩu nếu người dùng nhập mật khẩu mới
        if (user.password && user.password.trim() !== "") {
            payload.password = user.password;
        }

        // Gọi API để cập nhật thông tin người dùng
        return handleApiRequest(url, {
            method: 'PUT',
            body: JSON.stringify(payload),
        });
    } catch (error) {
        throw new Error(`Cập nhật thất bại: ${error.message}`);
    }
};

