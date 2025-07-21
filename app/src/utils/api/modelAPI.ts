import axiosInstance from '@/lib/axios'; // Adjust the import path if necessary

export const getTransportationReport = async () => {
    try {
        const response = await axiosInstance.get('/dashboard');
        return response.data.data;
    } catch (error) {
        console.error('Error fetching transportation report:', error);
        throw error;
    }
};
