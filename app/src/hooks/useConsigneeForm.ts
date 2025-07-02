import { useState } from 'react';
import { createConsignee } from '@/utils/api/consigneeApi';
import { Consignee } from '@/types/consignee';

const useConsigneeForm = (onSave) => {
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
            setError('Consignee Name is required');
            return false;
        }
        setLoading(true);
        try {
            const data: Consignee = {
                name: newOptionValue,
                contact: {
                    person: formData.contactPerson || '',
                    phone: formData.contactNumber || '',
                },
                address: {
                    adddress_line_1: formData.address || '',
                    city: formData.city || '',
                    state: formData.state || '',
                },
                gstin: formData.gstin || '',
            };
            const response = await createConsignee(data);
            if (response) {
                onSave(response.data);
                resetForm();
                return true;
            } else {
                setError('Error saving consignee');
                return false;
            }
        } catch (err) {
            setError('Error saving consignee');
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

export default useConsigneeForm; 