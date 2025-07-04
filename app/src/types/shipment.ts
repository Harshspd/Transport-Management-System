export interface GoodsDetails {
    description: string;
    quantity: number;
    bill_no: string;
    bill_date: Date;
    bill_value: number;
    mode: string;
    actual_dimensions: number;
    charged_dimensions: number;
    unit_of_weight: string;
    actual_weight: number;
    charged_weight: number;
    special_instructions: string;
}

export interface Shipment {
    consigner: string;
    consignee: string;
    driver: string;
    vehicle: string;
    delivery_location: string;
    expected_delivery_date_and_time: Date;
    goods_details: GoodsDetails;
    service_type: string;
    provider: string;
    eway_bill_number: string;
    status: string;
}
