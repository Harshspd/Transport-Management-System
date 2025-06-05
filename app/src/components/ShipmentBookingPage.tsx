'use client';
import React, { useState } from 'react';
import ShipmentForm from '@/components/ShipmentForm';
import AddConsigner from '@/components/modals/AddConsigner';
import AddConsignee from '@/components/modals/AddConsignee';
import AddDriver from '@/components/modals/AddDriver';
import AddVehicle from '@/components/modals/AddVehicle';

export default function ShipmentBookingPage() {
    const [modalType, setModalType] = useState<string | null>(null);
    const openModal = (type: string) => setModalType(type);
    const closeModal = () => setModalType(null);

    return (
        <div>
            <div className="col-span-12 space-y-6 xl:col-span-7">
                <ShipmentForm onOpenModal={openModal} />
                {modalType === 'consigner' && <AddConsigner onClose={closeModal} />}
                {modalType === 'consignee' && <AddConsignee onClose={closeModal} />}
                {modalType === 'driver' && <AddDriver onClose={closeModal} />}
                {modalType === 'vehicle' && <AddVehicle onClose={closeModal} />}
            </div>
        </div>
    );
}
