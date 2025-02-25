import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({

    user: null,
    isAuthenticated: false,
    error: null,
    isLoading: false,
    isCheckingAuthentication: true,
    message: null,

    userSignup: async (name, email, password) => {

        set({
            isLoading: true,
            error: null,
        });

        try {
            const response = await axios.post(`${API_URL}/userSignup`, { name, email, password });
            set({
                user: response.data.user,
                isAuthenticated: true,
                error: null,
                isLoading: false
            });

        } catch (error) {
            set({
                error: error.response.data.message || "Error signing up.",
                isLoading: false
            });
            throw error;
        }
    },

    userVerification: async (verificationToken) => {

        set({
            isLoading: true,
            error: null,
        });

        try {
            const response = await axios.post(`${API_URL}/userEmailVerification`, { verificationToken });
            set({ user: response.data.user, isAuthenticated: true, error: null, isLoading: false });
        } catch (error) {
            set({
                error: error.response.data.message || "Error verifying email.",
                isLoading: false
            });
            throw error;
        }
    },

    checkUserAuthentication: async () => {

        set({
            isCheckingAuthentication: true,
            error: null,
        });

        try {
            const response = await axios.get(`${API_URL}/checkUserAuth`);
            set({
                user: response.data.user,
                isAuthenticated: true,
                isCheckingAuthentication: false
            });

        } catch (error) {
            set({
                isAuthenticated: false,
                isCheckingAuthentication: false,
                error: null
            });

            throw error;
        }
    },

    userLogin: async (email, password) => {

        set({
            isLoading: true,
            error: null,
        });

        try {
            const response = await axios.post(`${API_URL}/userLogin`, { email, password });
            set({
                user: response.data.user,
                isAuthenticated: true,
                error: null,
                isLoading: false
            });

        } catch (error) {
            set({
                error: error.response.data.message || "Error logging in.",
                isLoading: false,
                isAuthenticated: false
            });
            throw error;
        }
    },

    userLogout: async () => {

        set({
            isLoading: true,
            error: null,
        });

        try {
            await axios.post(`${API_URL}/userLogout`);
            set({
                user: null,
                isAuthenticated: false,
                error: null,
                isLoading: false
            });

        } catch (error) {
            set({
                error: error.response.data.message || "Error logging out.",
                isLoading: false,
                isAuthenticated: false
            });
            throw error;
        }
    },

    userForgotPassword: async (email) => {

        set({
            isLoading: true,
            error: null,
            message: null
        });

        try {
            const response = await axios.post(`${API_URL}/userForgotPassword`, { email });
            set({
                message: response.data.message,
                isLoading: false
            });

        } catch (error) {
            set({
                isLoading: false,
                error: error.response.data.message || "Error sending reset password email"
            });
            throw error;
        }
    },

    resetUserPassword: async (token, password) => {

        set({
            isLoading: true,
            error: null,
            message: null
        });

        try {
            const response = await axios.post(`${API_URL}/userResetPassword/${token}`, { password });
            set({
                message: response.data.message,
                isLoading: false
            });

        } catch (error) {
            set({
                isLoading: false,
                error: error.response.da.message || "Error resetting user password"
            });
            throw error;
        }
    },

    userDeleteAccount: async (password) => {

        set({
            isLoading: true,
            error: null
        });

        try {
            const response = await axios.post(`${API_URL}/userDeleteAccount`, { password });
            set({
                user: null,
                isAuthenticated: false,
                error: null,
                isLoading: false
            });

        } catch (error) {
            set({
                isLoading: false,
                error: error.response.da.message || "Error deleting user account.",
                isAuthenticated: false
            });
            throw error;
        }
    }
}))