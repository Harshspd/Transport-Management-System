'use client';

import EditShipment from '@/components/shipment/EditShipment';
import React, { useEffect } from 'react';

const ShipmentAdd: React.FC = () => {

    return (
        <div>
            <EditShipment onCancel={()=>{}} onSave={()=>{}}></EditShipment>
        </div>
    );
};

export default ShipmentAdd;
