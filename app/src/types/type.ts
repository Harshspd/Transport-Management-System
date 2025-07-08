export interface ContactInfo {
  person?: string;
  phone?: string;
}
export interface Address {
  adddress_line_1?: string;
  street?: string;
  state?: string;
  postal_code?: string;
  city?: string;
  country?: string;
}


export interface FieldConfig {
    label: string;
    name: string;
    type: string;
}

export interface OptionType {
    value: string;
    label: string;
    city: string
}