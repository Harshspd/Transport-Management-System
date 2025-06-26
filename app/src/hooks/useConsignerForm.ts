import { useState } from 'react';
import { saveModalEntry } from '@/utils/api.js';
import { createConsigner } from '@/utils/api/ConsignerApi';
import { Consigner } from '@/types/consigner';

const useConsignerForm = (onSave:any, onCancel:any) => {
    const [newOptionValue, setNewOptionValue] = useState('');
    const [formData, setFormData] = useState({});

    const resetForm = () => {
        setNewOptionValue('');
        setFormData({});
    };

    const handleCancel = () => {
        resetForm();
        onCancel();
    };

    const handleChange = (e) => {
        const { name, value, files, type: inputType } = e.target;
        if (inputType === 'file') {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
        console.log('Form data updated:', { ...formData, [name]: value });
    };

    const handleNameChange = (e) => {
        const value = e.target.value;
        setNewOptionValue(value);
        console.log('Name field updated:', value);
    };

    const handleSave = async () => {
        // Create entry with name from newOptionValue and other data from formData
        const entry = { name: newOptionValue, ...formData };
        console.log('Saving entry:', entry);
        const data:Consigner ={
                        contact: {
                            name: "Kanika hard coding to be implemneted",
                            contact_person: "Kanika hard coding to be implemneted",
                            contact_number: "9987671378",
                        },
                        address: '',
                        city: '',
                        gst_in: '',
                        };

        const response = await createConsigner(data);
        if (response.success) {
            onSave("Consigner", response);
        } else {
            alert('Error saving entry');
        }
    };

    return {
        // State
        newOptionValue,
        formData,

        // Actions
        handleChange,
        handleNameChange,
        handleSave,
        handleCancel
    };
};

export default useConsignerForm; 