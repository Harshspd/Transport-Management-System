import React from 'react'

export default function ShipmentForm() {
    return (
        <div>
            <h1 className="text-xl font-semibold pb-2">Shipment Booking</h1>

            <div className='grid grid-cols-[66%_34%] w-full gap-4'>                
                <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-6 flex gap-6 ">

                    {/* Left Form Section */}
                    <div className="flex-[3] space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Consigner Details</label>
                            <select className="w-full border rounded-lg p-2 h-10.5">
                                <option className='text-gray-300'>Select</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Consigner Details</label>
                            <select
                                className="w-full border text-gray-500 rounded-lg p-2 h-10.5"
                                style={{ color: '#ABABAB' }}>
                                <option value="">Select</option>
                            </select>
                        </div>


                        {/* First Row */}
                        <div className="grid grid-cols-3 gap-4">

                            <div>
                                <label className="block text-sm font-medium mb-1">Consignee Details</label>
                                <select className="w-full border rounded-lg p-2 h-10.5">
                                    <option>Select</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Delivery Location</label>
                                <input type="text" className="w-full border rounded-lg p-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Date/Time</label>
                                <input type="datetime-local" className="w-full border rounded-lg p-2" />
                            </div>
                        </div>

                        {/* Second Row */}
                        <div className="grid grid-cols-3 gap-4">

                        </div>

                        {/* Goods Details Title */}
                        <h2 className="text-lg font-medium">Goods Details</h2>

                        {/* Goods Details Form */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="row-span-3">
                                <label className="block text-sm font-medium mb-1 ">Descriptions :</label>
                                <textarea className="w-full border rounded-lg p-2 h-55" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Quantity :</label>
                                <input className="w-full border rounded-lg p-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Bill No :</label>
                                <input className="w-full border rounded-lg p-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Value :</label>
                                <input className="w-full border rounded-lg p-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Mode :</label>
                                <select className="w-full border rounded-lg p-2 h-10.5">
                                    <option>Select Mode</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Actual Dimensions :</label>
                                <input className="w-full border rounded-lg p-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Charged Dimensions :</label>
                                <input className="w-full border rounded-lg p-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Unit of Weight :</label>
                                <select className="w-full border rounded-lg p-2 h-10.5">
                                    <option>Select Unit</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Actual Weight :</label>
                                <input className="w-full border rounded-lg p-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Charged Weight :</label>
                                <input className="w-full border rounded-lg p-2" />
                            </div>
                            <div className="row-span-3">
                                <label className="block text-sm font-medium mb-1">Special Instructions :</label>
                                <textarea className="w-full border rounded-lg p-2 h-55" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Driver :</label>
                                <select className="w-full border rounded-lg p-2 h-10.5">
                                    <option>Select</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Vehicle :</label>
                                <input className="w-full border rounded-lg p-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Service Type :</label>
                                <select className="w-full border rounded-lg p-2 h-10.5">
                                    <option>Select Service Type</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Provider :</label>
                                <select className="w-full border rounded-lg p-2 h-10.5">
                                    <option>Select Provider Type</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Eway Bill Number :</label>
                                <input className="w-full border rounded-lg p-2" />
                            </div>
                        </div>
                        <div className='flex justify-end'>
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                                Book Shipment
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Preview Section */}
                <div className="w-full bg-white rounded-lg shadow-md p-6">
                    <h2 className="flex justify-center font-semibold text-lg mb-4">Preview</h2>
                    <div className="grid grid-cols-2 gap-2 space-y-2 bg-gray-100 p-6 rounded-lg">
                        {/* Replace below lines with dynamic values */}
                        <p className='block text-sm font-medium'>Consigner Details : <strong>Balaji</strong></p>
                        <p>Consigner Address : 36, 1st cross Anna Nagar, Mumbai</p>
                        <p>Consignee Details : HP Pvt Lmt</p>
                        <p>Delivery Location : 1st Block IT Park, Mumbai</p>
                        <p>Date/Time : 21 Jan 2025 / 02:00 PM</p>
                        <p>Description : Pellentesque elementum tortor pellentesque dignissim.</p>
                        <p>Unit of Weight : 100 kg</p>
                        <p>Quantity : 5 Piece</p>
                        <p>Bill No : SH-001</p>
                        <p>Value : 5 Piece</p>
                        <p>Mode : Transport</p>
                        <p>Actual Dimensions : 5 Piece</p>
                        <p>Charged Dimensions : 5 Piece</p>
                        <p>Actual Weight : 5 Piece</p>
                        <p>Charged Weight : 5 Piece</p>
                        <p>Driver : 5 Piece</p>
                        <p>Special Instructions : </p>
                        <p>Vehicle : 5 Piece</p>
                        <p>Service Type : 5 Piece</p>
                        <p>Provider : 5 Piece</p>
                        <p>Eway Bill Number : 5 Piece</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
