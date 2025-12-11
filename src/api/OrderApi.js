import {handleApiRequest, handleApiRequestV2} from "./HandleRequest";

export const createCategory = async (orderRequest) => {
    try {
        const url = new URL(`http://localhost:8022/api/all/order/create`)
        return handleApiRequest(url, {
            method: 'POST',
            body: JSON.stringify({
                nguoiNhan: orderRequest.nguoiNhan,
                email: orderRequest.email,
                phone: orderRequest.phone,
                idTinhThanh: orderRequest.idTinhThanh,
                idQuanHuyen: orderRequest.idQuanHuyen,
                idPhuongXa: orderRequest.idPhuongXa,
                address: orderRequest.address,
                note: orderRequest.note,
                shippingFee: orderRequest.shippingFee,
                voucherCode: orderRequest.voucherCode,
                cartIdList: orderRequest.cartIdList,
                type: orderRequest.type
            })
        })
    } catch (error) {
        throw new Error(`Thêm mới thất bại: ${error.message}`);
    }
};
export const getOrders = async () => {
    console.log("userid api:")
    const url = `http://localhost:8022/api/all/order/user`;
    return await handleApiRequest(url, {method: 'GET'});
};

export const getOrder = async (search, status, type = "all", page = 1, size = 10) => {
    try {
        const url = new URL(
            `http://localhost:8022/api/v2/order?status=${status}&search=${search}&type=${type}&page=${page}&limit=${size}`
        );
        return handleApiRequestV2(url, { method: 'GET' });
    } catch (error) {
        throw new Error(`Lấy thất bại: ${error.message}`);
    }
};
export const getOrderByUserID = async (page, limit) => {
    try {
        const url = new URL(`http://localhost:8022/api/all/order?page=${page}&limit=${limit}`)
        return handleApiRequestV2(url, {
            method: 'GET',
        })
    } catch (error) {
        throw new Error(`Lay thất bại: ${error.message}`);
    }
};

export const getOrderById = async (id) => {
    try {
        const url = new URL(`http://localhost:8022/api/v2/order/${id}`)
        return handleApiRequestV2(url, {
            method: 'GET',
        })
    } catch (error) {
        throw new Error(`Lay thất bại: ${error.message}`);
    }
};
export const updateStatusOrder = async (id, status) => {
    try {
        const url = new URL(`http://localhost:8022/api/v2/order/updateStatus/${id}?status=${status}`)
        return handleApiRequestV2(url, {
            method: 'POST',
        })
    } catch (error) {
        throw new Error(`Lay thất bại: ${error.message}`);
    }
};
export const updateStatusOrderForUser = async (id, status) => {
    try {
        const url = new URL(`http://localhost:8022/api/all/order/updateStatus/${id}?status=${status}`)
        return handleApiRequestV2(url, {
            method: 'POST',
        })
    } catch (error) {
        throw new Error(`Lay thất bại: ${error.message}`);
    }
};
export const history = async (id) => {
    try {
        const url = new URL(`http://localhost:8022/api/v2/order/history/${id}`)
        return handleApiRequest(url, {
            method: 'GET',
        })
    } catch (error) {
        throw new Error(`Lay thất bại: ${error.message}`);
    }
};
export const updateShipping = async (id, shippingUpdate) => {
    try {
        const url = new URL(`http://localhost:8022/api/v2/order/updateShipping/${id}`)
        return handleApiRequest(url, {
            method: 'POST',
            body: JSON.stringify({
                id: shippingUpdate.id,
                nguoiNhan: shippingUpdate.nguoiNhan,
                phone: shippingUpdate.phone,
                idTinhThanh: shippingUpdate.idTinhThanh,
                idQuanHuyen: shippingUpdate.idQuanHuyen,
                idPhuongXa: shippingUpdate.idPhuongXa,
                address: shippingUpdate.address,
                newShipping: shippingUpdate.ship
            })
        })
    } catch (error) {
        throw new Error(`Lay thất bại: ${error.message}`);
    }
};

