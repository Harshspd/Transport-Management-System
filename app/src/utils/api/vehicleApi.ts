import axiosInstance from '@/lib/axios'; // Adjust the import path if necessary


const API_ENDPOINT = '/vehicles'; // Define the endpoint

export const getVehicles = async () => {
    try {
        const response = await axiosInstance.get(API_ENDPOINT);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching vehicles:', error);
        throw error;
    }
};

export const createVehicle = async (data: FormData) => {
    try {
        const response = await axiosInstance.post(API_ENDPOINT, data);
        return response.data;
    } catch (error) {
        console.error('Error creating vehicle:', error);
        throw error;
    }
};