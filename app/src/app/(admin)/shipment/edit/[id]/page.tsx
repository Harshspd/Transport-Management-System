'use client';

import EditShipment from '@/components/shipment/EditShipment';
import React, { useEffect } from 'react';

import { toast } from 'react-toastify';
import { useParams, useRouter } from "next/navigation";
const ShipmentEditPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const shipmentId = typeof params?.id === 'string' ? params.id : undefined;
  

  useEffect(() => {
    if (!shipmentId) {
      toast.error('Shipment ID is required to edit a shipment.');
      router.push('/shipment');
    }
  }, [shipmentId, router]);

  return (
    <div>
      {shipmentId && (
        <EditShipment
          shipmentId={shipmentId}
          onCancel={() => router.push('/shipment')}
          onSave={(updatedShipment) => {
            // handle save and redirect or toast
            toast.success('Shipment updated successfully');
            router.push('/shipment');
          }}
        />
      )}
    </div>
  );
};

export default ShipmentEditPage;
