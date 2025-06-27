import axiosInstance from '@/lib/axios'; // Adjust the import path if necessary
import { Consigner } from '@/types/consigner';

const API_ENDPOINT = 'http://localhost:5000/api/consigners'; // Define the endpoint

export const getConsigners = async () => {
    try {
        const response = await axiosInstance.get(API_ENDPOINT);
        return response.data;
    } catch (error) {
        console.error('Error fetching contact lists:', error);
        throw error;
    }
};

export const createConsigner = async (data:Consigner) => {
    const token = localStorage.getItem('token'); // Get JWT token from localStorage
    try {
        const response = await axiosInstance.post(
            API_ENDPOINT,
            data,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching contact lists:', error);
        throw error;
    }
};