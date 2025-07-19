import axiosInstance from '@/lib/axios';

const API_ENDPOINT = '/rates';

export const getRates = async () => {
    try {
        const response = await axiosInstance.get(API_ENDPOINT);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching rates:', error);
        throw error;
    }
}; 

export const updateRates = async (data: any) => {
    try {
        const response = await axiosInstance.post(API_ENDPOINT, data);
        return response.data;
    } catch (error) {
        console.error('Error updateing rates:', error);
        throw error;
    }
};