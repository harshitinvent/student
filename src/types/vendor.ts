export interface Vendor {
  id: string;
  vendor_name: string;
  contact_person: string;
  email: string;
  phone: string;
  address?: string;
  tax_id?: string;
  payment_terms?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  category?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateVendorRequest {
  vendor_name: string;
  contact_person: string;
  email: string;
  phone: string;
  address?: string;
  tax_id?: string;
  payment_terms?: string;
  category?: string;
}

export interface UpdateVendorRequest extends Partial<CreateVendorRequest> {
  status?: 'ACTIVE' | 'INACTIVE' | 'PENDING';
}

export interface VendorFilter {
  search?: string;
  status?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export interface VendorResponse {
  success: boolean;
  data: Vendor | Vendor[];
  message?: string;
  errors?: string[];
}

export interface PaginatedVendorResponse {
  success: boolean;
  data: {
    vendors: Vendor[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      total_pages: number;
    };
  };
  message?: string;
} 