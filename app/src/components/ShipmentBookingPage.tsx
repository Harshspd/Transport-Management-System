'use client';
import React from 'react';
import ShipmentForm from '@/components/ShipmentForm';

export default function ShipmentBookingPage() {

    return (
        <div>
            <div className="col-span-12 space-y-6 xl:col-span-7">
                <ShipmentForm/>
            </div>
        </div>
    );
}
