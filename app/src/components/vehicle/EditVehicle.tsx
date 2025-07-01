import React from 'react';
import useVehicleForm from '@/hooks/useVehicleForm';

interface EditVehicleProps {
    onSave: (type: string, data: any) => void;
}

const EditVehicle: React.FC<EditVehicleProps> = ({ onSave }) => {
    const {
        newOptionValue,
        handleChange,
        handleNameChange,
        handleSave,
        formData,
        error,
    } = useVehicleForm('Vehicle', onSave);

    const fields = [
        { label: 'Vehicle Number', name: 'vehicleNumber', type: 'text' },
        { label: 'Capacity (Weight)', name: 'capacityWeight', type: 'text' },
        { label: 'Capacity (Volume)', name: 'capacityVolume', type: 'text' },
        { label: 'City', name: 'city', type: 'text' },
        { label: 'Vehicle Type', name: 'vehicleType', type: 'text' },
        { label: 'RC Number', name: 'rcNumber', type: 'text' },
        { label: 'Upload RC', name: 'rcFile', type: 'file' },
        { label: 'State', name: 'state', type: 'text' }
    ];

    const renderField = (field: any) => {
        if (field.name === 'vehicleNumber') {
            return (
                <input
                    type="text"
                    name={field.name}
                    value={newOptionValue}
                    onChange={handleNameChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 h-10.5 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-brand-300 dark:focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/10 dark:focus:ring-brand-500/20"
                />
            );
        }
        if (field.type === 'file') {
            return (
                <input
                    type="file"
                    name={field.name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 h-10.5 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-white file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-brand-50 file:text-brand-700 dark:file:bg-brand-900/20 dark:file:text-brand-400 hover:file:bg-brand-100 dark:hover:file:bg-brand-900/30"
                />
            );
        }
        return (
            <input
                type={field.type}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 h-10.5 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-brand-300 dark:focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/10 dark:focus:ring-brand-500/20"
            />
        );
    };

    const getLeftFields = () => [
        { label: 'Vehicle Number', name: 'vehicleNumber', type: 'text' },
        { label: 'Capacity (Weight)', name: 'capacityWeight', type: 'text' },
        { label: 'Capacity (Volume)', name: 'capacityVolume', type: 'text' },
        { label: 'City', name: 'city', type: 'text' }
    ];
    const getRightFields = () => [
        { label: 'Vehicle Type', name: 'vehicleType', type: 'text' },
        { label: 'RC Number', name: 'rcNumber', type: 'text' },
        { label: 'Upload RC', name: 'rcFile', type: 'file' }
    ];

    return (
        <div className='p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'>
            <h2 className="text-lg font-medium pb-4 text-gray-800 dark:text-white">Vehicle Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left Column */}
                <div className="flex flex-col gap-4">
                    {getLeftFields().map((field, idx) => (
                        <div key={idx}>
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">{field.label} :</label>
                            {renderField(field)}
                        </div>
                    ))}
                </div>

                {/* Right Column */}
                <div className="flex flex-col gap-4">
                    {getRightFields().map((field, idx) => (
                        <div key={idx}>
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">{field.label} :</label>
                            {renderField(field)}
                        </div>
                    ))}
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">State :</label>
                        <input
                            type="text"
                            name="state"
                            value={formData.state || ''}
                            onChange={handleChange}
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 h-10.5 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-brand-300 dark:focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/10 dark:focus:ring-brand-500/20"
                        />
                    </div>
                </div>
                <div className="col-span-1 md:col-span-2 mt-4">
                    {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
                    <button
                        onClick={handleSave}
                        className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditVehicle; 