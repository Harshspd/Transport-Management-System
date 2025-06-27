import { useState } from 'react';
import { saveModalEntry } from '@/utils/api.js';
import { createVehicle } from '@/utils/api/vehicle';
import { Vehicle } from '@/types/vehicle';

const useVehicleForm = (onSave:any, onCancel:any) => {
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

    const handleChange = (e: any) => {
        const { name, value, files, type: inputType } = e.target;
        if (inputType === 'file') {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
        console.log('Form data updated:', { ...formData, [name]: value });
    };

    const handleNameChange = (e: any ) => {
        const value = e.target.value;
        setNewOptionValue(value);
        console.log('Name field updated:', value);
    };

    const handleSave = async () => {
        // Create entry with name from newOptionValue and other data from formData
        const entry = { name: newOptionValue, ...formData };
        console.log('Saving entry:', entry);
        const data:Vehicle ={
                        contact: {
                            name: "Kanika hard coding to be implemneted",
                            contact_person: "Kanika hard coding to be implemneted",
                            contact_number: "9987671378",
                        },
                        address: '',
                        city: '',
                        gst_in: '',
                        };

        const response = await createVehicle(data);
        if (response.success) {
            onSave("Vehicle", response);
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

export default useVehicleForm; 