import { useEffect, useState } from 'react';
import { createConsignee, getConsigneeById, updateConsignee } from '@/utils/api/consigneeApi';
import { Consignee } from '@/types/consignee';

const useConsigneeForm = (onSave,selectedId) => {
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
                    adddress_line_1: formData.adddress_line_1 || '',
                    city: formData.city || '',
                    state: formData.state || '',
                },
                gstin: formData.gstin || '',
            };
            let response ;
            if(formData._id) {
                response = await updateConsignee(data);
            }else{
                response = await createConsignee(data);
            }
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
    const populateFormData= async(data:Consignee) => {
        console.log('Populating form data with:', data);
        if (!data) {
            return
        }
        const _data = {
            name: data.name || '',
            contactPerson: data.contact?.person || '',
            adddress_line_1: data.address?.adddress_line_1 || '',
            city: data.address?.city || '',
            state: data.address?.state || '',
            contactNumber: data.contact?.phone || '',
            gstin: data.gstin || '',
        };
        console.log('Populated form data:', _data);
        setFormData(_data);
        setNewOptionValue(_data.name);

    };
    useEffect(() => {
        if (selectedId) {
            // Fetch existing consignee data and populate formData
            // This is a placeholder, replace with actual fetch logic
            const fetchConsignee = async (selectedId: string) => {
                try {
                    const response = await getConsigneeById(selectedId); // Implement this API call
                    await populateFormData(response.data);    
                    
                } catch (err) {
                    console.error('Error fetching consignee:', err);
                }
            };
            fetchConsignee(selectedId);
        } else {
            resetForm();
        }
    },[selectedId]);
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