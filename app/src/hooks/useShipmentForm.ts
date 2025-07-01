import { useState, useEffect } from 'react';
import { getConsigners } from '@/utils/api/consignerApi';
import { getConsignees } from '@/utils/api/consigneeApi';
import { getDrivers } from '@/utils/api/driverApi';
import { getVehicles } from '@/utils/api/vehicle';

interface ShipmentFormData {
    Consigner: string;
    Consignee: string;
    DeliveryLocation: string;
    DateTime: string;
    Description: string;
    Quantity: string;
    BillNo: string;
    Value: string;
    Mode: string;
    ActualDimensions: string;
    ChargedDimensions: string;
    UnitWeight: string;
    ActualWeight: string;
    ChargedWeight: string;
    Instructions: string;
    Driver: string;
    Vehicle: string;
    ServiceType: string;
    Provider: string;
    EwayBill: string;
}

interface ShipmentFormErrors {
    [key: string]: string;
}

interface ShipmentFormOptions {
    Consigner: string[];
    Consignee: string[];
    Mode: string[];
    ServiceType: string[];
    Driver: string[];
    Vehicle: string[];
    Provider: string[];
    UnitWeight: string[];
}

const useShipmentForm = (onAddNewTrigger?: (type: string) => void) => {
    const [formData, setFormData] = useState<ShipmentFormData>({
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

    const [errors, setErrors] = useState<ShipmentFormErrors>({});

    const [options, setOptions] = useState<ShipmentFormOptions>({
        Consigner: [],
        Consignee: [],
        Mode: ['Transport', 'Door Delivery'],
        ServiceType: ['Standard', 'Express'],
        Driver: [],
        Vehicle: [],
        Provider: ['Owner', 'Agency'],
        UnitWeight: ['Per Kg', 'LPT (Less than Truckload)', 'FTL (Turbo)', 'Turbo']
    });

    // Fetch dropdown options from backend on mount
    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const [consigners, consignees, drivers, vehicles] = await Promise.all([
                    getConsigners(),
                    getConsignees(),
                    getDrivers(),
                    getVehicles()
                ]);
                console.log('consigners:', consigners);
                console.log('consignees:', consignees);
                console.log('drivers:', drivers);
                console.log('vehicles:', vehicles);
                setOptions((prev) => ({
                    ...prev,
                    Consigner: consigners.map((c: any) => c.contact?.name || c.name),
                    Consignee: consignees.map((c: any) => c.contact?.name || c.name),
                    Driver: drivers.map((d: any) => d.contact?.name || d.name),
                    Vehicle: vehicles.map((v: any) => v.vehicle_number || v.name),
                }));
            } catch (error) {
                console.error('Error fetching dropdown options:', error);
            }
        };
        fetchOptions();
    }, []);

    const handleChange = (e: any, selectedValue?: any) => {
        let name: string, value: string;
        if (typeof e === 'string' && selectedValue !== undefined) {
            name = e;
            value = selectedValue?.value || selectedValue;
        } else {
            name = e.target.name;
            value = e.target.value;
        }
        if (value === '+Add new') {
            onAddNewTrigger && onAddNewTrigger(name);
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const validateForm = () => {
        const newErrors: ShipmentFormErrors = {};
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        const allShipments = JSON.parse(localStorage.getItem('shipments') ?? '[]');
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

    const handleAddNew = async (type: keyof ShipmentFormOptions, newEntry: any) => {
        console.log('handleAddNew called with:', { type, newEntry });
        if (newEntry?.name?.trim()) {
            try {
                // After adding, re-fetch the relevant list from backend
                let updatedList: string[] = [];
                if (type === 'Consigner') {
                    updatedList = (await getConsigners()).map((c: any) => c.contact?.name || c.name);
                } else if (type === 'Consignee') {
                    updatedList = (await getConsignees()).map((c: any) => c.contact?.name || c.name);
                } else if (type === 'Driver') {
                    updatedList = (await getDrivers()).map((d: any) => d.contact?.name || d.name);
                } else if (type === 'Vehicle') {
                    updatedList = (await getVehicles()).map((v: any) => v.vehicle_number || v.name);
                }
                setOptions((prev) => ({ ...prev, [type]: updatedList }));
                setFormData((prev) => ({ ...prev, [type]: newEntry.name.trim() }));
                console.log(`Successfully added new ${type}:`, newEntry.name.trim());
                return true;
            } catch (error) {
                console.error('Error adding new entry:', error);
                alert('Error adding new entry. Please try again.');
                return false;
            }
        } else {
            alert('Please fill all required fields');
            return false;
        }
    };

    const renderOptions = (items: string[], fieldName: string) => {
        const baseOptions = items.map((item) => ({ value: item, label: item }));
        const noAddNewFields = ['Mode', 'UnitWeight', 'ServiceType', 'Provider'];

        return noAddNewFields.includes(fieldName)
            ? baseOptions
            : [...baseOptions, { value: '+Add new', label: '+Add new' }];
    };

    const formatValue = (value: string) => {
        if (!value) return "";

        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return "";

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
        formData,
        errors,
        options,
        isFormValid,
        handleChange,
        handleSubmit,
        handleAddNew,
        renderOptions,
        formatValue,
    };
};

export default useShipmentForm; 