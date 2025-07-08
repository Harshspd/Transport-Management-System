import axiosInstance from '@/lib/axios'; // Adjust the import path if necessary
import { Agent } from '@/types/agent';

const API_ENDPOINT = '/agents'; // Define the endpoint

export const getAgents = async () => {
    try {
        const response = await axiosInstance.get(API_ENDPOINT);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching contact lists:', error);
        throw error;
    }
};

export const createAgent = async (data: Agent) => {
    try {
        const response = await axiosInstance.post(API_ENDPOINT, data);
        return response.data;
    } catch (error) {
        console.error('Error fetching contact lists:', error);
        throw error;
    }
};

export const updateAgent = async (id:string,data: Agent) => {
    try {
        const response = await axiosInstance.put(API_ENDPOINT + `/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error fetching contact lists:', error);
        throw error;
    }
};

export const getAgentById = async (id: string) => {
    try {
        const response = await axiosInstance.get(API_ENDPOINT + `/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching contact lists:', error);
        throw error;
    }
};
