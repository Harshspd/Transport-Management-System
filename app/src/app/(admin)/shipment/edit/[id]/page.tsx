'use client';

import EditShipment from '@/components/shipment/EditShipment';
import React, { useEffect } from 'react';
import { useRouter } from 'next/router'; // use `useRouter`, not `Router` directly
import { toast } from 'react-toastify';

const ShipmentEditPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const shipmentId = typeof id === 'string' ? id : undefined;

  useEffect(() => {
    if (!shipmentId) {
      toast.error('Shipment ID is required to edit a shipment.');
      router.push('/admin/shipment');
    }
  }, [shipmentId, router]);

  return (
    <div>
      {shipmentId && (
        <EditShipment
          shipmentId={shipmentId}
          onCancel={() => router.push('/admin/shipment')}
          onSave={(updatedShipment) => {
            // handle save and redirect or toast
            toast.success('Shipment updated successfully');
            router.push('/admin/shipment');
          }}
        />
      )}
    </div>
  );
};

export default ShipmentEditPage;
