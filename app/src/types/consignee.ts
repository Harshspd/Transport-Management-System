import { Address, ContactInfo } from "./type";


export interface Consignee {
  name: string;
  _id?: string; // If fetched from DB
  contact: ContactInfo;
  address?: Address;
  gstin?: string;
  created_by?: string; // User ID (ObjectId as string)
  updated_by?: string; // User ID (optional)
  organization_id?: string; // Account ID
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
}
