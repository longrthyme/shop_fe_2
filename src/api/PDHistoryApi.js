import {handleApiRequest,handleApiRequestV2} from "./HandleRequest";

export const getPDHistoryList = async (page, limit, sortBy) => {
    try {
        const token = localStorage.getItem('access_token'); // Lấy token từ localStorage
        // Xây dựng URL với các tham số page, limit, sortBy
        const url = new URL(`http://localhost:8022/api/v2/product-detail-history/get-all`);

        // Thêm các tham số vào URL
        url.searchParams.append('page', page);
        url.searchParams.append('limit', limit);
        if (sortBy) {
            url.searchParams.append('sortby', sortBy); // Nếu có giá trị sortBy, thêm vào URL
        }
        console.log("đây là url trong api",url);

        return handleApiRequestV2(url, {
            method: 'GET',
        });
    } catch (error) {
        throw error;
    }
};

export const updateQuantityPD = async (id, productDetailHistoryRequest) => {
    try {
        console.log("Data to update ProductDetailHistory", productDetailHistoryRequest);
        const url = new URL(`http://localhost:8022/api/v2/product-detail-history/${id}`);
        return handleApiRequest(url, {
            method: 'PUT',
            body: JSON.stringify({
                quantityAdded:productDetailHistoryRequest.quantityAdded,
                purchasePrice:productDetailHistoryRequest.purchasePrice,
                salePrice:productDetailHistoryRequest.salePrice,
                importDate:productDetailHistoryRequest.importDate,
            }),
        });
    } catch (error) {
        throw new Error(`Cập nhật thất bại: ${error.message}`);
    }
};

export const getPDHistoryListByPDID = async (PDid,page, limit, sortBy ) => {
    try {
        const url = new URL(`http://localhost:8022/api/v2/product-detail-history/get-by-id/${PDid}`);

        // Thêm các tham số vào URLn
        url.searchParams.append('page', page);
        url.searchParams.append('limit', limit);
        if (sortBy) {
            url.searchParams.append('sortby', sortBy); // Nếu có giá trị sortBy, thêm vào URL
        }
        console.log("đây là url trong api",url);

        return handleApiRequestV2(url, {
            method: 'GET',
        });
    } catch (error) {
        throw error;
    }
};
