import { handleApiRequest,handleApiRequestV2} from "./HandleRequest";


// User API
export const countAllUsersByRole = async () => {
    try {
        const url = new URL(`http://localhost:8022/api/v2/dashboard/users/count`);
        return handleApiRequest(url, { method: "GET" });
    } catch (error) {
        throw error;
    }
};

// Product APIs
export const getTop5ProductsByTotalQuantity = async () => {
    try {
        const url = new URL(`http://localhost:8022/api/v2/dashboard/top-products`);
        return handleApiRequest(url, { method: "GET" });
    } catch (error) {
        throw error;
    }
};

// Product APIs
export const getProfitProduct = async (page = 1, size = 10) => {
    try {
        const url = new URL(`http://localhost:8022/api/v2/dashboard/profits-product`);
        url.searchParams.append('page', page);   // Thêm tham số page vào URL
        url.searchParams.append('size', size);   // Thêm tham số size vào URL

        return handleApiRequestV2(url, { method: "GET" });
    } catch (error) {
        throw error;
    }
};


export const getTotalQuanNotDeleted = async () => {
    try {
        const url = new URL(`http://localhost:8022/api/v2/dashboard/products/quan/not-deleted`);
        return handleApiRequest(url, { method: "GET" });
    } catch (error) {
        throw error;
    }
};

export const getTotalQuanDeleted = async () => {
    try {
        const url = new URL(`http://localhost:8022/api/v2/dashboard/products/quan/deleted`);
        return handleApiRequest(url, { method: "GET" });
    } catch (error) {
        throw error;
    }
};

export const getTotalAoNotDeleted = async () => {
    try {
        const url = new URL(`http://localhost:8022/api/v2/dashboard/products/ao/not-deleted`);
        return handleApiRequest(url, { method: "GET" });
    } catch (error) {
        throw error;
    }
};

export const getTotalAoDeleted = async () => {
    try {
        const url = new URL(`http://localhost:8022/api/v2/dashboard/products/ao/deleted`);
        return handleApiRequest(url, { method: "GET" });
    } catch (error) {
        throw error;
    }
};

export const getTotalQuan = async () => {
    try {
        const url = new URL(`http://localhost:8022/api/v2/dashboard/products/quan`);
        return handleApiRequest(url, { method: "GET" });
    } catch (error) {
        throw error;
    }
};

export const getTotalAo = async () => {
    try {
        const url = new URL(`http://localhost:8022/api/v2/dashboard/products/ao`);
        return handleApiRequest(url, { method: "GET" });
    } catch (error) {
        throw error;
    }
};

// Order APIs
export const countCompletedOrders = async () => {
    try {
        const url = new URL(`http://localhost:8022/api/v2/dashboard/orders/completed/count`);
        return handleApiRequest(url, { method: "GET" });
    } catch (error) {
        throw error;
    }
};

// Revenue APIs
export const getDailyRevenue = async () => {
    try {
        const url = new URL(`http://localhost:8022/api/v2/dashboard/revenue/daily`);
        return handleApiRequest(url, { method: "GET" });
    } catch (error) {
        throw error;
    }
};

export const getMonthlyRevenue = async () => {
    try {
        const url = new URL(`http://localhost:8022/api/v2/dashboard/revenue/monthly`);
        return handleApiRequest(url, { method: "GET" });
    } catch (error) {
        throw error;
    }
};

export const getYearlyRevenue = async () => {
    try {
        const url = new URL(`http://localhost:8022/api/v2/dashboard/revenue/yearly`);
        return handleApiRequest(url, { method: "GET" });
    } catch (error) {
        throw error;
    }
};

export const getListDailyRevenueByDateRange = async (startDate, endDate) => {
    try {
        const url = new URL(`http://localhost:8022/api/v2/dashboard/list-daily-revenue`);
        console.log("đường dẫn trc khi gửi:" +url);
        url.searchParams.append("startDate", startDate);
        url.searchParams.append("endDate", endDate);
        return handleApiRequest(url, { method: "GET" });
    } catch (error) {
        throw error;
    }

};
// Profit APIs
export const getDailyProfit = async () => {
    try {
        const url = new URL(`http://localhost:8022/api/v2/dashboard/profit/daily`);
        return handleApiRequest(url, { method: "GET" });
    } catch (error) {
        throw error;
    }
};

export const getMonthlyProfit = async () => {
    try {
        const url = new URL(`http://localhost:8022/api/v2/dashboard/profit/monthly`);
        return handleApiRequest(url, { method: "GET" });
    } catch (error) {
        throw error;
    }
};

export const getYearlyProfit = async () => {
    try {
        const url = new URL(`http://localhost:8022/api/v2/dashboard/profit/yearly`);
        return handleApiRequest(url, { method: "GET" });
    } catch (error) {
        throw error;
    }
};


