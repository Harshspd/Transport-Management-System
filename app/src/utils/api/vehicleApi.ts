import axiosInstance from '@/lib/axios'; // Adjust the import path if necessary
import { Vehicle } from '@/types/vehicle';


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

export const updateVehicle = async (id: string, data: any) => {
    try {
        const response = await axiosInstance.put(API_ENDPOINT + `/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error fetching contact lists:', error);
        throw error;
    }
};

export const getVehicleById = async (id: string) => {
    try {
        const response = await axiosInstance.get(API_ENDPOINT + `/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching contact lists:', error);
        throw error;
    }
};
export const deleteById = async (id: string) => {
    try {
        const response = await axiosInstance.delete(API_ENDPOINT + `/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching contact lists:', error);
        throw error;
    }
};

