import axiosInstance from '@/lib/axios'; // Adjust the import path if necessary
import { Consignee } from '@/types/consignee';

const API_ENDPOINT = '/consignees'; // Define the endpoint

export const getConsignees = async () => {
    try {
        const response = await axiosInstance.get(API_ENDPOINT);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching consignees:', error);
        throw error;
    }
};

export const createConsignee = async (data: Consignee) => {
    try {
        const response = await axiosInstance.post(API_ENDPOINT, data);
        return response.data;
    } catch (error) {
        console.error('Error fetching contact lists:', error);
        throw error;
    }
};

export const updateConsignee = async (data: Consignee) => {
    try {
        const response = await axiosInstance.put(API_ENDPOINT, data);
        return response.data;
    } catch (error) {
        console.error('Error fetching contact lists:', error);
        throw error;
    }
};

export const getConsigneeById = async (id: string) => {
    try {
        const response = await axiosInstance.get(API_ENDPOINT + `/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching contact lists:', error);
        throw error;
    }
};
