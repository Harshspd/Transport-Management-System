import { useState } from 'react';
import { saveModalEntry } from '../utils/api.js';

const useModalForm = (modalType, onAdd, onClose) => {
    const [newOptionValue, setNewOptionValue] = useState('');
    const [formData, setFormData] = useState({});

    const resetForm = () => {
        setNewOptionValue('');
        setFormData({});
    };

    const closeModal = () => {
        resetForm();
        onClose();
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

    const handleAddNew = async () => {
        const entry = { name: newOptionValue, ...formData };
        console.log('Saving entry:', entry);

        const response = await saveModalEntry(modalType, entry);
        if (response.success) {
            onAdd(modalType, entry);
            closeModal();
        } else {
            alert('Error saving entry');
        }
    };

    return {
        newOptionValue,
        formData,
        handleChange,
        handleNameChange,
        handleAddNew,
        closeModal,
        resetForm,
    };
};

export default useModalForm; 