import axiosInstance from '@/lib/axios';
import { Shipment } from '@/types/shipment';

const API_ENDPOINT = '/shipments';

export const createShipment = async (data: any) => {
    try {
        const response = await axiosInstance.post(API_ENDPOINT, data);
        return response.data;
    } catch (error) {
        console.error('Error creating shipment:', error);
        throw error;
    }
};

export const getShipments = async () => {
    try {
        const response = await axiosInstance.get(API_ENDPOINT);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching shipments:', error);
        throw error;
    }
};
export const getShipmentById = async (id:string) => {
    try {
        const response = await axiosInstance.get(API_ENDPOINT + `/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching shipments:', error);
        throw error;
    }
};
export const updateShipmentStatus = async (id: string, status: string) => {
    try {
        const response = await axiosInstance.patch(`${API_ENDPOINT}/${id}/status`, { status });
        return response.data;
    } catch (error) {
        console.error('Error updating shipment status:', error);
        throw error;
    }
};

export const deleteShipment = async (id: string) => {
    try {
        const response = await axiosInstance.delete(`${API_ENDPOINT}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting shipment:', error);
        throw error;
    }
};

export const updateShipment = async (id: string, data: Partial<Shipment>) => {
    try {
        const response = await axiosInstance.put(`${API_ENDPOINT}/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating shipment:', error);
        throw error;
    }
};
