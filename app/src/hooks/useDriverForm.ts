import { useState } from 'react';
import { createDriver } from '@/utils/api/driverApi';
import { Driver } from '@/types/driver';

const useDriverForm = (type: string, onSave: any) => {
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
        console.log('Form data updated:', { ...formData, [name]: value });
    };

    const handleNameChange = (e: any) => {
        const value = e.target.value;
        setNewOptionValue(value);
        console.log('Name field updated:', value);
    };

    const handleSave = async () => {
        setError('');
        if (!newOptionValue) {
            setError('Driver Name is required');
            return;
        }
        setLoading(true);
        try {
            // Create FormData to match backend expectation
            const formDataToSend = new FormData();
            formDataToSend.append('contact[name]', newOptionValue);
            formDataToSend.append('contact[contact_number]', formData.contactNumber || '');
            formDataToSend.append('license_number', formData.licenseNumber || '');
            formDataToSend.append('address', formData.address || '');
            formDataToSend.append('city', formData.city || '');
            if (formData.licenseFile) {
                formDataToSend.append('licenseFile', formData.licenseFile);
            }

            console.log('Driver FormData payload:', formDataToSend);
            const response = await createDriver(formDataToSend);
            if (response && response.contact && response.contact.name) {
                alert('New Driver saved');
                onSave('Driver', { name: response.contact.name });
                resetForm();
            } else {
                setError('Error saving Driver');
            }
        } catch (err) {
            setError('Error saving driver');
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

export default useDriverForm; 