import { useState, useEffect } from 'react';
import { getConsigners } from '@/utils/api/consignerApi';
import { getConsignees } from '@/utils/api/consigneeApi';
import { getDrivers } from '@/utils/api/driverApi';
import { getVehicles } from '@/utils/api/vehicleApi';
import { createShipment, getShipmentById } from '@/utils/api/shipmentApi';
import { toast } from 'react-toastify';
import { useModal } from '@/hooks/useModal';
import { OptionType } from '@/types/type';



interface ShipmentFormData {
    Consigner: string;
    Consignee: string;
    DeliveryLocation: string;
    ExpectedDeliveryDateTime: string;
    Description: string;
    Quantity: string;
    BillNo: string;
    BillDate: string;
    BillValue: string;
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
    Consigner: OptionType[];
    Consignee: OptionType[];
    Mode: OptionType[] | string[];
    ServiceType: OptionType[] | string[];
    Driver: OptionType[];
    Vehicle: OptionType[];
    Provider: OptionType[] | string[];
    UnitWeight: OptionType[] | string[];
}

type MappedKeys = keyof Pick<ShipmentFormOptions, "Consigner" | "Consignee" | "Driver" | "Vehicle">;


const useShipmentForm = (onSave:any,onCancel:any,shipmentId:any) => {
    const [formData, setFormData] = useState<ShipmentFormData>({
        Consigner: '',
        Consignee: '',
        DeliveryLocation: '',
        ExpectedDeliveryDateTime: '',
        Description: '',
        Quantity: '',
        BillNo: '',
        BillDate: '',
        BillValue: '',
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

    const consignerModal = useModal();
    const consigneeModal = useModal();
    const driverModal = useModal();
    const vehicleModal = useModal();


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
                setOptions((prev) => ({
                    ...prev,
                    Consigner: consigners.map((c: any) => ({ value: c._id, label: c.contact?.name || c.name })),
                    Consignee: consignees.map((c: any) => ({ value: c._id, label: c.contact?.name || c.name })),
                    Driver: drivers.map((d: any) => ({ value: d._id, label: d.contact?.name || d.name })),
                    Vehicle: vehicles.map((v: any) => ({ value: v._id, label: v.vehicle_number || v.name })),
                }));
            } catch (error) {
                console.error('Error fetching dropdown options:', error);
            }
        };
        fetchOptions();
    }, []);
    useEffect(() => {
        // If shipmentId is provided, fetch the existing shipment data
        const fetchShipmentData= async (shipmentId:string) =>{
        if (shipmentId) {
            try {
                const response = await getShipmentById(shipmentId);
                setFormData(response.data);  
            }
            catch (error) {
                console.error('Error fetching shipment data:', error);
                toast.error('Error fetching shipment data. Please try again.');
            }   
        }}
        fetchShipmentData(shipmentId);
    },[shipmentId]);

    const handleChange = (e: any, selectedValue?: any) => {
        let name: string, value: string;
        if (typeof e === 'string' && selectedValue !== undefined) {
            name = e;
            value = selectedValue?.value || selectedValue;
        } else if (e && e.target) {
            name = e.target.name;
            value = e.target.value;
        } else {
            // fallback for direct value
            name = e;
            value = selectedValue;
        }
        if (value === '+Add new') {
            handleAddNewTrigger(name);
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleAddNewTrigger = (name: string) => {
        switch (name) {
            case 'Consigner': return consignerModal.openModal();
            case 'Consignee': return consigneeModal.openModal();
            case 'Driver': return driverModal.openModal();
            case 'Vehicle': return vehicleModal.openModal();
        }
    };

    const validateForm = () => {
        const newErrors: ShipmentFormErrors = {};
        if (!formData.Consigner) newErrors.Consigner = 'Consigner is required';
        if (!formData.Consignee) newErrors.Consignee = 'Consignee is required';
        if (!formData.DeliveryLocation) newErrors.DeliveryLocation = 'Delivery Location is required';
        if (!formData.Quantity) newErrors.Quantity = 'Quantity is required';
        if (!formData.BillNo) newErrors.BillNo = 'Bill No is required';
        if (!formData.BillValue) newErrors.BillValue = 'Bill Value is required';
        console.log('Validating form:', newErrors);
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(validateForm());
        if (!validateForm()) return;

        // Transform formData to match Shipment type
        const shipment = {
            consigner: formData.Consigner,
            consignee: formData.Consignee,
            driver: formData.Driver,
            vehicle: formData.Vehicle,
            delivery_location: formData.DeliveryLocation,
            expected_delivery_date_and_time: new Date(formData.ExpectedDeliveryDateTime),
            goods_details: {
                description: formData.Description,
                quantity: Number(formData.Quantity),
                bill_no: formData.BillNo,
                bill_date: new Date(formData.BillDate),
                bill_value: Number(formData.BillValue),
                mode: formData.Mode,
                actual_dimensions: Number(formData.ActualDimensions),
                charged_dimensions: Number(formData.ChargedDimensions),
                unit_of_weight: formData.UnitWeight,
                actual_weight: Number(formData.ActualWeight),
                charged_weight: Number(formData.ChargedWeight),
                special_instructions: formData.Instructions,
            },
            service_type: formData.ServiceType,
            provider: formData.Provider,
            eway_bill_number: formData.EwayBill,
            status: 'Open',
        };

        try {
            const response = await createShipment(shipment);
            if (response.status == 201) {
                setFormData({
                    Consigner: '', Consignee: '', DeliveryLocation: '', ExpectedDeliveryDateTime: '',
                    Description: '', Quantity: '', BillNo: '', BillDate: '', BillValue: '', Mode: '',
                    ActualDimensions: '', ChargedDimensions: '', UnitWeight: '',
                    ActualWeight: '', ChargedWeight: '', Instructions: '', Driver: '',
                    Vehicle: '', ServiceType: '', Provider: '', EwayBill: '',
                });
            }
        } catch (error) {
            toast.error('Error booking shipment. Please try again.' + (error instanceof Error ? `: ${error.message}` : ''));
        }
    };
    const handleAddNew = async (type: string, newEntry: any) => {
        try {
            // After adding, re-fetch the relevant list from backend
            let updatedList: OptionType[] = [];
            if (type === 'Consigner') {
                updatedList = (await getConsigners()).map((c: any) => ({ value: c._id, label: c.contact?.name || c.name }));
            } else if (type === 'Consignee') {
                updatedList = (await getConsignees()).map((c: any) => ({ value: c._id, label: c.contact?.name || c.name }));
            } else if (type === 'Driver') {
                updatedList = (await getDrivers()).map((d: any) => ({ value: d._id, label: d.contact?.name || d.name }));
            } else if (type === 'Vehicle') {
                updatedList = (await getVehicles()).map((v: any) => ({ value: v._id, label: v.vehicle_number || v.name }));
            }
            setOptions((prev) => ({ ...prev, [type]: updatedList }));
            setFormData((prev) => ({ ...prev, [type]: newEntry._id }));
            switch (type) {
                case 'Consigner': return consignerModal.closeModal();
                case 'Consignee': return consigneeModal.closeModal();
                case 'Driver': return driverModal.closeModal();
                case 'Vehicle': return vehicleModal.closeModal();
            }
            return true;
        } catch (error) {
            console.error('Error adding new entry:', error);
            alert('Error adding new entry. Please try again.');
            return false;
        }
    };

    const renderOptions = (items: OptionType[] | string[], fieldName: string) => {
        // If already in {value, label} format, return as is, else map to that format
        const baseOptions = typeof items[0] === 'object'
            ? (items as OptionType[])
            : (items as string[]).map((item) => ({ value: item, label: item }));
        const noAddNewFields = ['Mode', 'UnitWeight', 'ServiceType', 'Provider'];

        return noAddNewFields.includes(fieldName)
            ? baseOptions
            : [...baseOptions, { value: '+Add new', label: '+Add new' }];
    };

    const getSelectedOptionLabel = (value: string, fieldName: string) => {
        const mappedKey = fieldName as MappedKeys;
        const optionsList = options[mappedKey];
        const selectedOption = optionsList.find((option: OptionType) => option.value === value);
        return selectedOption ? selectedOption.label : '';
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
        consignerModal,
        consigneeModal,
        driverModal,
        vehicleModal,
        getSelectedOptionLabel,
    };
};

export default useShipmentForm; 