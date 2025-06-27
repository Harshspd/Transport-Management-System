import { useState } from 'react';
import { createConsigner } from '@/utils/api/consignerApi';
import { Consigner } from '@/types/consigner';

const useConsignerForm = (type: string, onSave: any) => {
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
            setError('Consigner Name is required');
            return;
        }
        setLoading(true);
        try {
            // Build Consigner payload from form fields
            const data: Consigner = {
                contact: {
                    name: newOptionValue,
                    contact_person: formData.contactPerson || '',
                    contact_number: formData.contactNumber || '',
                },
                address: formData.address || '',
                city: formData.city || '',
                gst_in: formData.gstin || '',
                // Optionally add state if your backend supports it
                // state: formData.state || '',
            };
            const response = await createConsigner(data);
            if (response && response.contact && response.contact.name) {
                onSave(type, { name: response.contact.name });
                resetForm();
            } else {
                setError('Error saving consigner');
            }
        } catch (err) {
            setError('Error saving consigner');
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