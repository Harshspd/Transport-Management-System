export interface Vehicle {
  _id?: string; // If fetched from DB 
  vehicle_number?: string;
  vehicle_type?: string;
  capacity_weight?: number;
  capacity_volume?: number;
  rc_number?: string;
  rc_file?: string;
  created_by?: string; // User ID (ObjectId as string)
  updated_by?: string; // User ID (optional)
  organization_id?: string; // Account ID
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
}