import axios from "axios";
import {handleApiRequest} from "./HandleRequest";

export const getVoucher = async (page, size, sortBy) => {
    try {
        // Lấy token từ localStorage
        const token = localStorage.getItem('access_token');
        if (!token) {
            alert("Bạn cần đăng nhập để tiếp tục.");
            window.location.href = "/login"; // Điều hướng tới trang đăng nhập
            return;
        }


        // Xây dựng URL với các tham số page, size, sortBy
        const url = new URL("http://localhost:8022/api/v2/voucher/findAll");

        // Thêm các tham số vào URL
        url.searchParams.append('page', page);
        url.searchParams.append('size', size);  // Đổi limit thành size
        if (sortBy) {
            url.searchParams.append('sortby', sortBy); // Nếu có giá trị sortBy, thêm vào URL
        }

        console.log("Đây là URL trong API:", url);

        // Gửi request tới API với token trong header
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,  // Thêm token vào header
                'Content-Type': 'application/json',
            },
        });

        // Kiểm tra phản hồi và trả về kết quả
        if (response.ok) {
            const data = await response.json();
            console.log("Dữ liệu trả về từ API:", data);
            return data;
        } else {
            console.error('Lỗi khi gọi API:', response.statusText);
        }
    } catch (error) {
        console.error('Lỗi trong quá trình gọi API:', error);
    }
};



export const findVoucherById = async (id) => {
    try {
        const url = new URL(`http://localhost:8022/api/v2/voucher/find/${id}`)

        return handleApiRequest(url,{ method: 'GET'})
    } catch (error) {
        console.error("Error when fetching voucher by ID:", error.message);
        throw error;
    }
};

export const createVoucher = async (voucher) => {
    try {
        const url = new URL(`http://localhost:8022/api/v2/voucher/add`);
        return handleApiRequest(url,{
            method: 'POST',
            body: JSON.stringify({
                name: voucher.name,
                code: voucher.code,
                discount: voucher.discount,
                minTotal: voucher.minTotal,
                maxDiscount: voucher.maxDiscount,
                maxUsage: voucher.maxUsage,
                startDate: voucher.startDate,
                endDate: voucher.endDate,
                description: voucher.description,
                status: voucher.status,
                type: voucher.type
            })
        })
    }catch (error) {
        throw new Error(`Thêm mới thất bại: ${error.message}`);
    }
};

export const deleteVoucher = async (idVoucher) => {
    try {
        const url = new URL(`http://localhost:8022/api/v2/voucher/delete/${idVoucher}`);
        return handleApiRequest(url,{
            method: 'DELETE'
        })
    }catch (error) {
        throw new Error(`Xoá thất bại: ${error.message}`);
    }
};

export const updateVoucher = async (idVoucher,value)=>{
    try {
        const url = new URL(`http://localhost:8022/api/v2/voucher/update/${idVoucher}`);
        console.log("data value", value);
        return handleApiRequest(url, {
            method: 'PUT',
            body: JSON.stringify({
                name: value.name,
                code: value.code,
                discount: value.discount,
                minTotal: value.minTotal,
                maxDiscount: value.maxDiscount,
                maxUsage: value.maxUsage,
                startDate: value.startDate,
                endDate: value.endDate,
                description: value.description,
                status: value.status,
                type: value.type
            })
        });
    }  catch (error) {
        const errorMessage = error.message;  // Truy cập thuộc tính message (không phải là phương thức)
        throw new Error(errorMessage);  // Ném lại lỗi với thông báo lỗi
    }
};
export const getAllVoucherUser = ()=> axios.get(`http://localhost:8022/api/v1/user/voucher/all`);

