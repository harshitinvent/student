import type {
  Vendor,
  CreateVendorRequest,
  UpdateVendorRequest,
  VendorFilter,
  VendorResponse,
  PaginatedVendorResponse
} from '../types/vendor';

// API Base URL - configure this based on your environment
const API_BASE = 'http://localhost:8080/api/vendors';

// Helper function to get authentication headers
function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Get all vendors with filters
export async function getAllVendors(filters?: VendorFilter): Promise<Vendor[]> {
  try {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });
    }

    const endpoint = `${API_BASE}?${params.toString()}`;
    const res = await fetch(endpoint, {
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      console.error('API Error:', res.status, res.statusText);
      throw new Error(`Failed to fetch vendors: ${res.status} ${res.statusText}`);
    }

    const response = await res.json();
    console.log('API Response:', response);

    // Handle both direct array and wrapped response
    if (Array.isArray(response)) {
      return response;
    } else if (response && response.data && Array.isArray(response.data)) {
      return response.data;
    } else if (response && response.data && response.data.vendors) {
      return response.data.vendors;
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    console.error('API call failed:', error);
    // Fallback to mock data for development
    console.log('Using mock data for development');
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return [
      {
        id: '1',
        vendor_name: 'Office Supplies Plus',
        contact_person: 'Sarah Johnson',
        email: 'sarah@officesupplies.com',
        phone: '(555) 123-4567',
        address: '123 Business Ave, Suite 100, City, State 12345',
        tax_id: 'TAX123456789',
        payment_terms: 'Net 30',
        status: 'ACTIVE',
        category: 'Office Supplies',
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z',
      },
      {
        id: '2',
        vendor_name: 'Tech Solutions LLC',
        contact_person: 'Mike Chen',
        email: 'mike@techsolutions.com',
        phone: '(555) 987-6543',
        address: '456 Tech Street, Building B, City, State 12345',
        tax_id: 'TAX987654321',
        payment_terms: 'Net 15',
        status: 'ACTIVE',
        category: 'Technology',
        created_at: '2024-01-20T14:30:00Z',
        updated_at: '2024-01-20T14:30:00Z',
      },
      {
        id: '3',
        vendor_name: 'Facilities Maintenance Co.',
        contact_person: 'David Rodriguez',
        email: 'david@facilities.com',
        phone: '(555) 555-0123',
        address: '789 Maintenance Blvd, City, State 12345',
        tax_id: 'TAX456789123',
        payment_terms: 'Net 45',
        status: 'ACTIVE',
        category: 'Facilities',
        created_at: '2024-02-01T09:15:00Z',
        updated_at: '2024-02-01T09:15:00Z',
      },
      {
        id: '4',
        vendor_name: 'Printing Services Pro',
        contact_person: 'Lisa Thompson',
        email: 'lisa@printingservices.com',
        phone: '(555) 321-6540',
        address: '321 Print Lane, City, State 12345',
        tax_id: 'TAX321654987',
        payment_terms: 'Net 30',
        status: 'ACTIVE',
        category: 'Printing',
        created_at: '2024-02-10T11:45:00Z',
        updated_at: '2024-02-10T11:45:00Z',
      },
      {
        id: '5',
        vendor_name: 'Security Systems Inc.',
        contact_person: 'Robert Wilson',
        email: 'robert@securitysystems.com',
        phone: '(555) 789-0123',
        address: '654 Security Drive, City, State 12345',
        tax_id: 'TAX789012345',
        payment_terms: 'Net 60',
        status: 'PENDING',
        category: 'Security',
        created_at: '2024-02-15T16:20:00Z',
        updated_at: '2024-02-15T16:20:00Z',
      },
    ];
  }
}

// Get vendor by ID
export async function getVendorById(vendorId: string): Promise<Vendor> {
  try {
    const res = await fetch(`${API_BASE}/${vendorId}`, {
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      throw new Error('Failed to fetch vendor');
    }

    const response = await res.json();
    return response.data || response;
  } catch (error) {
    console.error('Failed to fetch vendor:', error);
    throw error;
  }
}

// Create new vendor
export async function createVendor(vendorData: CreateVendorRequest): Promise<Vendor> {
  try {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(vendorData),
    });

    if (!res.ok) {
      throw new Error('Failed to create vendor');
    }

    const response = await res.json();
    return response.data || response;
  } catch (error) {
    console.error('Failed to create vendor:', error);
    throw error;
  }
}

// Update vendor
export async function updateVendor(vendorId: string, updates: UpdateVendorRequest): Promise<Vendor> {
  try {
    const res = await fetch(`${API_BASE}/${vendorId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(updates),
    });

    if (!res.ok) {
      throw new Error('Failed to update vendor');
    }

    const response = await res.json();
    return response.data || response;
  } catch (error) {
    console.error('Failed to update vendor:', error);
    throw error;
  }
}

// Delete vendor
export async function deleteVendor(vendorId: string): Promise<void> {
  try {
    const res = await fetch(`${API_BASE}/${vendorId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      throw new Error('Failed to delete vendor');
    }
  } catch (error) {
    console.error('Failed to delete vendor:', error);
    throw error;
  }
}

// Get vendor categories
export async function getVendorCategories(): Promise<string[]> {
  try {
    const res = await fetch(`${API_BASE}/categories`, {
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      throw new Error('Failed to fetch vendor categories');
    }

    const response = await res.json();
    return response.data || response;
  } catch (error) {
    console.error('Failed to fetch vendor categories:', error);
    // Return default categories
    return [
      'Office Supplies',
      'Technology',
      'Facilities',
      'Printing',
      'Security',
      'Cleaning',
      'Food Services',
      'Transportation',
      'Other'
    ];
  }
}

// Bulk operations
export async function bulkUpdateVendors(updates: {
  vendor_ids: string[];
  updates: UpdateVendorRequest;
}): Promise<void> {
  try {
    const res = await fetch(`${API_BASE}/bulk`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(updates),
    });

    if (!res.ok) {
      throw new Error('Failed to bulk update vendors');
    }
  } catch (error) {
    console.error('Failed to bulk update vendors:', error);
    throw error;
  }
}

// Export vendors
export async function exportVendors(format: 'pdf' | 'excel', filters?: VendorFilter): Promise<{ download_url: string }> {
  try {
    const params = new URLSearchParams();
    params.append('format', format);
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });
    }

    const endpoint = `${API_BASE}/export?${params.toString()}`;
    const res = await fetch(endpoint, {
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      throw new Error('Failed to export vendors');
    }

    const response = await res.json();
    return response.data || response;
  } catch (error) {
    console.error('Failed to export vendors:', error);
    throw error;
  }
}

// Error handling helper
export const handleVendorAPIError = (error: any): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
};

// Legacy API object for backward compatibility
export const vendorAPI = {
  getAllVendors,
  getVendorById,
  createVendor,
  updateVendor,
  deleteVendor,
  getVendorCategories,
  bulkUpdateVendors,
  exportVendors,
}; 