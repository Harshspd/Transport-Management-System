import { useState, useEffect } from 'react';


const useShipmentForm = (onAddNewTrigger?: (type: string) => void) => {
    const [formData, setFormData] = useState({
        Consigner: '',
        Consignee: '',
        DeliveryLocation: '',
        DateTime: '',
        Description: '',
        Quantity: '',
        BillNo: '',
        Value: '',
        Mode: '',
        ActualDimensions: '',
        ChargedDimensions: '',
        UnitWeight: '',
        ActualWeight: '',
        ChargedWeight: '',
        Instructions: '',
        Driver: '',
        Vehicle: '',
        ServiceType: '',
        Provider: '',
        EwayBill: '',
    });

    //const [showConsignerModal, setShowConsignerModal] = useState(false);
    //const [showConsigneeModal, setShowConsigneeModal] = useState(false);
    //const [showDriverModal, setShowDriverModal] = useState(false);
    //const [showVehicleModal, setShowVehicleModal] = useState(false);
    const [errors, setErrors] = useState({});
    
    const [options, setOptions] = useState({
        Consigner: ['Reliance Industry', 'Tata New'],
        Consignee: ['Dell India', 'HP Pvt Lmt'],
        Mode: ['Transport', 'Door Delivery'],
        ServiceType: ['Standard', 'Express'],
        Driver: ['Balaji', 'Punith'],
        Vehicle: ['KA 23 V 6272', 'MH 20 U 5485'],
        Provider: ['Owner', 'Agency'],
        UnitWeight: ['Per Kg', 'LPT (Less than Truckload)', 'FTL (Turbo)', 'Turbo']
    });

    // Load options from localStorage on mount
    useEffect(() => {
        const storedOptions = localStorage.getItem("shipmentOptions");
        if (storedOptions) {
            setOptions(JSON.parse(storedOptions));
        }
    }, []);

    // Save options to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem("shipmentOptions", JSON.stringify(options));
    }, [options]);

    const handleChange = (e, selectedValue) => {
        let name, value;

        // Handle Select component (which passes name and selected value directly)
        if (typeof e === 'string' && selectedValue !== undefined) {
            name = e;
            value = selectedValue?.value || selectedValue;
        } else {
            // Handle regular form inputs (event object)
            name = e.target.name;
            value = e.target.value;
        }

        if (value === '+Add new') {
            onAddNewTrigger(name);
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.Consigner) newErrors.Consigner = 'Consigner is required';
        if (!formData.Consignee) newErrors.Consignee = 'Consignee is required';
        if (!formData.DeliveryLocation) newErrors.DeliveryLocation = 'Delivery Location is required';
        if (!formData.DateTime) newErrors.DateTime = 'Date/Time is required';
        if (!formData.Description) newErrors.Description = 'Description is required';
        if (!formData.Quantity) newErrors.Quantity = 'Quantity is required';
        if (!formData.BillNo) newErrors.BillNo = 'Bill No is required';
        if (!formData.Value) newErrors.Value = 'Value is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const allShipments = JSON.parse(localStorage.getItem('shipments')) || [];
        allShipments.push(formData);
        localStorage.setItem('shipments', JSON.stringify(allShipments));

        console.log('Shipment saved:', formData);
        alert("Shipment booked successfully!");

        // Reset form
        setFormData({
            Consigner: '', Consignee: '', DeliveryLocation: '', DateTime: '',
            Description: '', Quantity: '', BillNo: '', Value: '', Mode: '',
            ActualDimensions: '', ChargedDimensions: '', UnitWeight: '',
            ActualWeight: '', ChargedWeight: '', Instructions: '', Driver: '',
            Vehicle: '', ServiceType: '', Provider: '', EwayBill: '',
        });
    };

    /*const openModal = (type) => {
        console.log('Opening modal for type:', type);
        switch (type) {
            case 'Consigner':
                setShowConsignerModal(true);
                break;
            case 'Consignee':
                setShowConsigneeModal(true);
                break;
            case 'Driver':
                setShowDriverModal(true);
                break;
            case 'Vehicle':
                setShowVehicleModal(true);
                break;
            default:
                console.log('Unknown modal type:', type);
        }
    };*/

    /*const closeModal = (type) => {
        switch (type) {
            case 'Consigner':
                setShowConsignerModal(false);
                break;
            case 'Consignee':
                setShowConsigneeModal(false);
                break;
            case 'Driver':
                setShowDriverModal(false);
                break;
            case 'Vehicle':
                setShowVehicleModal(false);
                break;
            default:
                console.log('Unknown modal type:', type);
        }
    };*/

    const handleAddNew = async (type, newEntry) => {
        console.log('handleAddNew called with:', { type, newEntry });

        if (newEntry?.name?.trim()) {
            try {
                // Add the new entry to the options
                setOptions((prev) => ({
                    ...prev,
                    [type]: [...(prev[type] || []), newEntry.name.trim()]
                }));

                // Set the form data to the newly added entry
                setFormData((prev) => ({ ...prev, [type]: newEntry.name.trim() }));

                // Close the modal
                closeModal(type);

                console.log(`Successfully added new ${type}:`, newEntry.name.trim());
            } catch (error) {
                console.error('Error adding new entry:', error);
                alert('Error adding new entry. Please try again.');
            }
        } else {
            alert("Please fill all required fields");
        }
    };

    const renderOptions = (items, fieldName) => {
        const baseOptions = items.map((item) => ({ value: item, label: item }));
        const noAddNewFields = ['Mode', 'UnitWeight', 'ServiceType', 'Provider'];

        return noAddNewFields.includes(fieldName)
            ? baseOptions
            : [...baseOptions, { value: '+Add new', label: '+Add new' }];
    };

    const formatValue = (value) => {
        if (!value) return "";

        const date = new Date(value);
        if (isNaN(date)) return "";

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const ampm = hours >= 12 ? "PM" : "AM";

        hours = hours % 12;
        hours = hours === 0 ? 12 : hours;
        const formattedHours = String(hours).padStart(2, "0");

        return `${day}/${month}/${year}, ${formattedHours}:${minutes} ${ampm}`;
    };

    const isFormValid = Object.values(formData).some(value => value);

    return {
        // State
        formData,
        //showConsignerModal,
        //showConsigneeModal,
        //showDriverModal,
        //showVehicleModal,
        errors,
        options,
        isFormValid,

        // Actions
        handleChange,
        handleSubmit,
        //openModal,
        //closeModal,
        handleAddNew,
        renderOptions,
        formatValue,
    };
};

export default useShipmentForm; 