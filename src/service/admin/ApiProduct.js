import {handleApiRequest,handleApiRequestV2} from "../../api/HandleRequest";
import axios from "axios";

const API_URL = 'http://localhost:8022/api/v2/product';  // Đường dẫn API cho sản phẩm
const API_DETAIL_URL = 'http://localhost:8022/api/v2/product-detail/findByProductId'; // Đường dẫn API cho chi tiết sản phẩm

export const getAllProducts = async (
    page,
    limit,
    sortBy,
    brandId,
    categoryId,
    materialId,
    minPrice,
    maxPrice,
    priceType,
    name
) => {
    try {
        const url = new URL(`${API_URL}/findAll`);

        // Thêm các tham số vào URL
        url.searchParams.append('page', page);
        url.searchParams.append('limit', limit);
        if (sortBy) url.searchParams.append('sortby', sortBy);
        if (brandId) url.searchParams.append('brandId', brandId);
        if (categoryId) url.searchParams.append('categoryId', categoryId);
        if (materialId) url.searchParams.append('materialId', materialId);
        if (minPrice !== null && minPrice !== undefined) url.searchParams.append('minPrice', minPrice);
        if (maxPrice !== null && maxPrice !== undefined) url.searchParams.append('maxPrice', maxPrice);
        if (priceType) url.searchParams.append('priceType', priceType);
        if (name) url.searchParams.append('name', name);

        return handleApiRequestV2(url, { method: 'GET' });
    } catch (error) {
        throw error;
    }
};


export const getProductById = async (productId) => {
    try {
        console.log("productid:"+productId)
        // Gọi API để lấy sản phẩm theo ID
        const url = new URL(`${API_URL}/findbyid/${productId}`)
        return handleApiRequest(url,{ method: 'GET'})
    } catch (error) {
        console.error("Error when fetching product by ID:", error.message);
        throw error;
    }
};

export const getProductDetailByProductId = async (productId,page,limit) => {
    try {
        const url = new URL(`${API_DETAIL_URL}/${productId}`)
        url.searchParams.append('page', page);
        url.searchParams.append('limit', limit);
        console.log("url "+url);
        return handleApiRequest(url,{ method: 'GET'})
    } catch (error) {
        console.error("Error when fetching product-detail by ID:", error.message);
        throw error;
    }
};

// Gọi API để thêm sản phẩm mới (POST)
export const addProductWapper = async (productWrapperRequest) => {
    try {
        const url = new URL(`http://localhost:8022/api/v2/product-wrapper/add`);
        return handleApiRequest(url, {
            method: 'POST',
            body: JSON.stringify({
                productRequets: {
                    name: productWrapperRequest.productRequets.name,
                    description: productWrapperRequest.productRequets.description,
                    status: productWrapperRequest.productRequets.status,
                    categoryId: productWrapperRequest.productRequets.categoryId,
                    brandId: productWrapperRequest.productRequets.brandId,
                    materialId: productWrapperRequest.productRequets.materialId,
                    tagIds: productWrapperRequest.productRequets.tagIds || []
                },
                productDetailRequetsList: productWrapperRequest.productDetailRequetsList.map(detail => ({
                    inputPrice: detail.inputPrice,
                    price: detail.price,
                    sizeId: detail.sizeId,
                    colorId: detail.colorId,
                    quantity: detail.quantity,
                    image: detail.image,
                }))
            })
        });
    } catch (error) {
        throw new Error(`Thêm mới thất bại: ${error.message}`);
    }
};

export const updateProduct = async (productId, updatedProductData) => {
    try {
        const url = new URL(`${API_URL}/update/${productId}`);
        return handleApiRequest(url,{
            method: 'PUT',
            body: JSON.stringify({
                name: updatedProductData.name,
                description: updatedProductData.description,
                price: updatedProductData.price,
                status: updatedProductData.status,
                categoryId: updatedProductData.categoryId,
                brandId: updatedProductData.brandId,
                materialId: updatedProductData.materialId,
                tagIds: updatedProductData.tagIds || []
            })
        })
    }catch (error) {
        throw new Error(`Thêm mới thất bại: ${error.message}`);
    }
};

export const deactivateProduct = async (productId) => {
    try {
        const url = new URL(`${API_URL}/deactivate/${productId}`);
        return handleApiRequest(url,{
            method: 'PUT'
        })
    }catch (error) {
        throw new Error(`Xoá thất bại: ${error.message}`);
    }
};
export const list = () => axios.get("http://localhost:8022/api/v1/user/product/all");



