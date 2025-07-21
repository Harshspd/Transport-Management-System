'use client';

import EditShipment from '@/components/shipment/EditShipment';
import React, { useEffect } from 'react';
import { useParams, useRouter } from "next/navigation";



const ShipmentAdd: React.FC = () => {
    const router = useRouter();

    return (
        <div>
            <EditShipment onCancel={() => { }} onSave={() => router.push('/shipment/tracking')}></EditShipment>
        </div>
    );
};

export default ShipmentAdd;
