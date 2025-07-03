import { Address, ContactInfo } from "./type";

export interface Driver {
  _id?: string; // If fetched from DB
  contact: ContactInfo;
  address?: Address;
  license_number?: string;
  license_file?: string;
  created_by?: string; // User ID (ObjectId as string)
  updated_by?: string; // User ID (optional)
  organization_id?: string; // Account ID
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
}
