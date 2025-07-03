import { useState } from 'react';
import { createConsigner } from '@/utils/api/consignerApi';
import { Consigner } from '@/types/consigner';

const useConsignerForm = (onSave: any) => {
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
        console.log('handleSave called with:', { newOptionValue, formData });
        setError('');
        if (!newOptionValue) {
            setError('Consigner Name is required');
            return false;
        }
        setLoading(true);
        try {
            const data: Consigner = {
                name: newOptionValue,
                contact: {
                    person: formData.contactPerson || '',
                    phone: formData.contactNumber || '',
                },
                address:{
                    adddress_line_1: formData.address || '',
                    city: formData.city || '',
                    state: formData.state || '',
                },
                gstin: formData.gstin || '',
            };
            const response = await createConsigner(data);
            if (response) {
                onSave(response.data);
                resetForm();
            }
        } catch (err) {
            console.error('Error saving consigner:', err);
            return false;
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

export default useConsignerForm; 