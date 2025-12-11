import {handleApiRequest, handleApiRequestV2} from "./HandleRequest";
import { useNavigate } from 'react-router-dom';

export const getCartByUserId = async (userId) => {
    try {
        const url = new URL(`http://localhost:8022/api/v1/wishlist/user/${userId}`);
        return handleApiRequest(url, {
            method: 'GET',
        });
    } catch (error) {
        throw error;
    }
};


export const getCategoryList = async () => {
    try {
        const url = new URL(`http://localhost:8022/api/v1/wishlist`);

        return handleApiRequest(url, {
            method: 'GET',
        });
    } catch (error) {
        throw error;
    }
};
export const changeQuantity = async (request) => {
    try {
        const url = new URL(`http://localhost:8022/api/v1/wishlist/changeQuantity`);
        console.log('day la request add',request)
        return handleApiRequest(url, {
            method: 'Post',
            body: JSON.stringify({
                wishListId: request.wishListId,
                quantity: request.quantity,
            })
        });
    } catch (error) {
        throw error;
    }
};

export const removeWishListItem = async (id) => {
    try {
        const url = new URL(`http://localhost:8022/api/v1/wishlist/remove/${id}`);

        return handleApiRequest(url, {
            method: 'Delete',
        });
    } catch (error) {
        throw error;
    }
};


export const addWishListItem = async (request) => {
    try {
        const url = new URL(`http://localhost:8022/api/v1/wishlist/add`);

        return handleApiRequest(url, {
            method: 'Post',
            body: JSON.stringify({
                productDetailId: request.productDetailId,
                quantity: request.quantity,
            })
        });
    } catch (error) {
        throw error;
    }
};


export const addWishListItemBuyNow = async (request) => {
    try {
        const url = new URL(`http://localhost:8022/api/v1/wishlist/add`);

        var result = await handleApiRequestV2(url, {
            method: 'Post',
            body: JSON.stringify({
                productDetailId: request.productDetailId,
                quantity: request.quantity,
            })
        });
        var list = result.data;
        return list;
    } catch (error) {
        throw error;
    }
};