import axios from 'axios';

const API_BASE_URL = 'http://localhost:8022/api/v1';

/**
 * Authentication API Service
 */
const ApiAuth = {
    /**
     * Send OTP to user's email
     * @param {string} email - User's email address
     * @returns {Promise} API response
     */
    sendOtp: async (email) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/forgot-password`, {
                email: email
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    /**
     * Verify OTP code
     * @param {string} email - User's email address
     * @param {string} otp - OTP code entered by user
     * @returns {Promise} API response
     */
    verifyOtp: async (email, otp) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/verify-otp`, {
                email: email,
                otp: otp
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    /**
     * Reset password with OTP verification
     * @param {string} email - User's email address
     * @param {string} otp - OTP code
     * @param {string} newPassword - New password
     * @returns {Promise} API response
     */
    resetPassword: async (email, otp, newPassword) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/reset-password`, {
                email: email,
                otp: otp,
                newPassword: newPassword
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }
};

export default ApiAuth;
