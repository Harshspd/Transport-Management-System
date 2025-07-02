import { useState } from 'react';
import { createVehicle } from '@/utils/api/vehicleApi';
import { Vehicle } from '@/types/vehicle';

const useVehicleForm = (onSave: any) => {
    const [newOptionValue, setNewOptionValue] = useState('');
    const [formData, setFormData] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const resetForm = () => {
        setNewOptionValue('');
        setFormData({});
    };

    const handleChange = (e: any) => {
        const { name, value, files, type: inputType } = e.target;
        if (inputType === 'file') {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleNameChange = (e: any) => {
        const value = e.target.value;
        setNewOptionValue(value);
    };

    const handleSave = async () => {
        setError('');
        if (!newOptionValue) {
            setError('Vehicle Number is required');
            return;
        }
        setLoading(true);
        try {
            // Create FormData to match backend expectation
            const formDataToSend = new FormData();
            formDataToSend.append('vehicle_number', newOptionValue);
            formDataToSend.append('vehicle_type', formData.vehicleType || '');
            formDataToSend.append('capacity_weight', formData.capacityWeight || '');
            formDataToSend.append('capacity_volume', formData.capacityVolume || '');
            formDataToSend.append('rc_number', formData.rcNumber || '');
            if (formData.rcFile) {
                formDataToSend.append('rc_file', formData.rcFile);
            }
            formDataToSend.append('address[city]', formData.city || '');
            formDataToSend.append('address[state]', formData.state || '');

            const response = await createVehicle(formDataToSend);
            if (response) {
                onSave(response.data);
                resetForm();
            } else {
                setError('Error saving Vehicle');
            }
        } catch (err) {
            setError('Error saving Vehicle');
        } finally {
            setLoading(false);
        }
    };

    return {
        newOptionValue,
        formData,
        loading,
        error,
        handleChange,
        handleNameChange,
        handleSave,
        resetForm,
    };
};

export default useVehicleForm; 