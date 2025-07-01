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
            setError('Consigner Name is required');
            return false;
        }
        setLoading(true);
        try {
            const data: Consigner = {
                contact: {
                    name: newOptionValue,
                    contact_person: formData.contactPerson || '',
                    contact_number: formData.contactNumber || '',
                },
                address: formData.address || '',
                city: formData.city || '',
                gst_in: formData.gstin || '',
                state: formData.state || '',
            };
            const response = await createConsigner(data);
            if (response && response.contact && response.contact.name) {
                alert('New Consigner saved');
                onSave(type, { name: response.contact.name });
                resetForm();
                return true;
            } else {
                setError('Error saving consigner');
                return false;
            }
        } catch (err) {
            setError('Error saving consigner');
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