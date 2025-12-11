import axios from "axios";
import {handleApiRequest,handleApiRequestV2} from "./HandleRequest";



export const getProductDetailById = async (id) => {
    try {
        const url = new URL(`http://localhost:8022/api/v2/product-detail/${id}`)
        return handleApiRequest(url,{ method: 'GET'})
    } catch (error) {
        console.error("Error when fetching category by ID:", error.message);
        throw error;
    }
};

export const getAllProductDetail = async (page, limit, sortby) => {
    try {
        const token = localStorage.getItem('access_token');
        const url = new URL(`http://localhost:8022/api/v2/product-detail/getAllProductdetail`)
        url.searchParams.append('page', page);
        url.searchParams.append('limit', limit);
        if (sortby) {
            url.searchParams.append('sortby', sortby); // Nếu có giá trị sortBy, thêm vào URL
        }
        console.log("đây là url trong api",url);

        return handleApiRequestV2(url, {
            method: 'GET',
        });
    } catch (error) {
        throw error;
    }
};

export const updateProductDetail = async (id, updatedProductDetail) => {
    try {
        const url = new URL(`http://localhost:8022/api/v2/product-detail/update/${id}`);
        console.log("data spct dc gửi lên", updatedProductDetail);
        return handleApiRequest(url, {
            method: 'PUT',
            body: JSON.stringify({
                price: updatedProductDetail.price,
                inputPrice: updatedProductDetail.inputPrice,
                sizeId: updatedProductDetail.sizeId,
                colorId: updatedProductDetail.colorId,
                quantity: updatedProductDetail.quantity,
                image: updatedProductDetail.image,
                isDeleted: updatedProductDetail.isDeleted
            })
        });
    } catch (error) {
        throw new Error(`Cập nhật thất bại: ${error.message}`);
    }
};

export const deleteProductDetail = async (id) => {
    try {
        const url = new URL(`http://localhost:8022/api/v2/product-detail/delete/${id}`);
        return handleApiRequest(url,{
            method: 'DELETE'
        })
    }catch (error) {
        throw new Error(`Xoá thất bại: ${error.message}`);
    }
};

export const searchProductDetailsByName = async (page, size, productName) => {
    try {
        const url = new URL(`http://localhost:8022/api/v2/product-detail/search-by-name`);
        url.searchParams.append("page", page);
        url.searchParams.append("size", size);
        url.searchParams.append("name", productName);

        return handleApiRequestV2(url, {
            method: "GET",
        });
    } catch (error) {
        throw new Error(`Error searching product details: ${error.message}`);
    }
};

export const addProductDetail = async (newProductDetail) => {
    try {
        const url = new URL(`http://localhost:8022/api/v2/product-detail/add`);
        console.log("data thêm spct gửi lên", newProductDetail);

        return handleApiRequest(url, {
            method: "POST",
            body: JSON.stringify({
                price: newProductDetail.price,
                inputPrice: newProductDetail.inputPrice,
                sizeId: newProductDetail.sizeId,
                colorId: newProductDetail.colorId,
                quantity: newProductDetail.quantity,
                image: newProductDetail.image,
                isDeleted: newProductDetail.isDeleted ?? false, // mặc định false
                productId: newProductDetail.productId
            }),
        });
    } catch (error) {
        throw new Error(`Thêm mới thất bại: ${error.message}`);
    }
};

