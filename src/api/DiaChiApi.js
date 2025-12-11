import {handleApiRequest} from "./HandleRequest";

export const getTinhThanh = async () => {
    try {
        const url = new URL(`http://localhost:8022/api/all/dia-chi/get-tinh-thanh`);
        return handleApiRequest(url, {
            method: 'GET',
        });
    } catch (error) {
        throw error;
    }
};

export const getQuanHuyen = async (idThanhPho) => {
    try {
        const url = new URL(`http://localhost:8022/api/all/dia-chi/get-quan-huyen/${idThanhPho}`);
        return handleApiRequest(url, {
            method: 'GET',
        });
    } catch (error) {
        throw error;
    }
};
export const getPhuongXa = async (idQuanHuyen) => {
    try {
        const url = new URL(`http://localhost:8022/api/all/dia-chi/get-phuong-xa/${idQuanHuyen}`);
        return handleApiRequest(url, {
            method: 'GET',
        });
    } catch (error) {
        throw error;
    }
};

export const getShip= async (shipRequest) => {
    console.log("đây là ship request",shipRequest)
    try {
        const url = new URL(`http://localhost:8022/api/all/dia-chi/tinh-phi-van-chuyen`);
        return handleApiRequest(url, {
            method: 'POST',
            body: JSON.stringify({
                idQuanHuyen: shipRequest.idQuanHuyen,
                idPhuongXa: shipRequest.idPhuongXa,
                soLuongSanPham:shipRequest.soLuongSanPham
            })
        });
    } catch (error) {
        throw error;
    }
};