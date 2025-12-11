export const handleApiRequest = async (url, options) => {
    try {
        const token = localStorage.getItem('access_token');
        const defaultHeaders = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        // Kết hợp headers từ options (nếu có) và headers mặc định
        const finalOptions = {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers,
            },
        };

        // Gọi API
        const response = await fetch(url, finalOptions);
        console.log("day la responsesss",response)
        // Nếu status code là 401, điều hướng đến trang đăng nhập
        if (response.status === 401) {
            console.log("url: ",url)
            const errorData = await response.json();
            alert(errorData.message||'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
            // Điều hướng về trang đăng nhập
            window.location.href = '/login';
            return;
        }

        // Nếu phản hồi không ok (không thành công), ném lỗi
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Unknown error occurred');
        }

        // Kiểm tra xem phản hồi có dữ liệu không trước khi gọi response.json()
        // cần kiểm tra vì các api như create/ update sẽ không tra ra response
        // mà bên dưới ta đang chuyển reponse từ json sang object để sử dụng
        const text = await response.text(); // Đọc response dưới dạng chuỗi

        if (text) {
            // Nếu có dữ liệu trong response body, parse thành JSON
            const data = JSON.parse(text);
            console.log("day la response",data)
            return data.result; // Trả về kết quả
        } else {
            // Nếu không có dữ liệu, chỉ cần trả về undefined hoặc thông báo thành công
            console.log("Không có dữ liệu trong phản hồi");
            return; // Có thể trả về giá trị undefined hoặc thông báo khác tùy vào logic của bạn
        }

    } catch (error) {
        console.error("API error:", error.message);
        throw error;
    }
};

export const handleApiRequestV2 = async (url, options) => {
    try {
        const token = localStorage.getItem('access_token');
        const defaultHeaders = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        // Kết hợp headers từ options (nếu có) và headers mặc định
        const finalOptions = {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers,
            },
        };

        // Gọi API
        const response = await fetch(url, finalOptions);
        console.log("day la response",response)
        // Nếu status code là 401, điều hướng đến trang đăng nhập
        if (response.status === 401) {
            const errorData = await response.json();
            alert(errorData.message||'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
            // Điều hướng về trang đăng nhập
            window.location.href = '/login';
            return;
        }

        // Nếu phản hồi không ok (không thành công), ném lỗi
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Unknown error occurred');
        }

        // Kiểm tra xem phản hồi có dữ liệu không trước khi gọi response.json()
        // cần kiểm tra vì các api như create/ update sẽ không tra ra response
        // mà bên dưới ta đang chuyển reponse từ json sang object để sử dụng
        const text = await response.text(); // Đọc response dưới dạng chuỗi

        if (text) {
            // Nếu có dữ liệu trong response body, parse thành JSON
            const data = JSON.parse(text);
            console.log("day la response",data)
            return data; // Trả về kết quả
        } else {
            // Nếu không có dữ liệu, chỉ cần trả về undefined hoặc thông báo thành công
            console.log("Không có dữ liệu trong phản hồi");
            return; // Có thể trả về giá trị undefined hoặc thông báo khác tùy vào logic của bạn
        }

    } catch (error) {
        console.error("API error:", error.message);
        throw error;
    }
};

