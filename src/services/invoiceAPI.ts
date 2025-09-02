import type {
  Invoice,
  CreateInvoiceRequest,
  UpdateInvoiceRequest,
  InvoiceFilter,
  InvoiceResponse,
  PaginatedInvoiceResponse,
  InvoiceStats,
  InvoiceHistory
} from '../types/invoice';

// API Base URL - configure this based on your environment
const API_BASE = 'http://103.189.173.7:8080/api/vendors';

// Helper function to get authentication headers
function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Get all invoices with filters
export async function getAllInvoices(filters?: InvoiceFilter): Promise<Invoice[]> {
  try {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });
    }

    const endpoint = `${API_BASE}/invoices?${params.toString()}`;
    const res = await fetch(endpoint, {
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      console.error('API Error:', res.status, res.statusText);
      throw new Error(`Failed to fetch invoices: ${res.status} ${res.statusText}`);
    }

    const response = await res.json();
    console.log('API Response:', response);

    // Handle both direct array and wrapped response
    if (Array.isArray(response)) {
      return response;
    } else if (response && response.data && Array.isArray(response.data)) {
      return response.data;
    } else if (response && response.data && response.data.invoices) {
      return response.data.invoices;
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
        invoice_number: 'INV-2025-001',
        vendor_id: '1',
        vendor: {
          id: '1',
          vendor_name: 'Office Supplies Plus'
        },
        department_id: '1',
        department: {
          ID: '1',
          name: 'Computer Science'
        },
        amount: 1250.00,
        invoice_date: '2025-07-20',
        due_date: '2025-08-20',
        description: 'Office supplies for Computer Science department including paper, pens, and other stationery items',
        status: 'APPROVED_FOR_PAYMENT',
        document_url: '/documents/invoice-001.pdf',
        created_at: '2025-07-25T10:00:00Z',
        updated_at: '2025-07-30T14:30:00Z',
        created_by: 'Finance Admin',
        approved_by: 'John Doe',
        approved_at: '2025-07-30T14:30:00Z',
        approval_history: [
          {
            id: '1',
            action: 'LOGGED',
            user_name: 'Finance Admin',
            user_role: 'Finance Admin',
            timestamp: '2025-07-25T10:00:00Z'
          },
          {
            id: '2',
            action: 'APPROVED',
            user_name: 'John Doe',
            user_role: 'Department Head',
            timestamp: '2025-07-30T14:30:00Z'
          }
        ]
      },
      {
        id: '2',
        invoice_number: 'INV-2025-002',
        vendor_id: '2',
        vendor: {
          id: '2',
          vendor_name: 'Tech Solutions LLC'
        },
        department_id: '2',
        department: {
          ID: '2',
          name: 'Information Technology'
        },
        amount: 2500.00,
        invoice_date: '2025-07-22',
        due_date: '2025-08-22',
        description: 'Software licenses and technical equipment for IT department',
        status: 'PENDING_APPROVAL',
        document_url: '/documents/invoice-002.pdf',
        created_at: '2025-07-26T11:15:00Z',
        updated_at: '2025-07-26T11:15:00Z',
        created_by: 'Finance Admin',
        approval_history: [
          {
            id: '3',
            action: 'LOGGED',
            user_name: 'Finance Admin',
            user_role: 'Finance Admin',
            timestamp: '2025-07-26T11:15:00Z'
          }
        ]
      },
      {
        id: '3',
        invoice_number: 'INV-2025-003',
        vendor_id: '3',
        vendor: {
          id: '3',
          vendor_name: 'Facilities Maintenance Co.'
        },
        department_id: '3',
        department: {
          ID: '3',
          name: 'Facilities Management'
        },
        amount: 800.00,
        invoice_date: '2025-07-15',
        due_date: '2025-08-15',
        description: 'Maintenance services for campus facilities',
        status: 'OVERDUE',
        document_url: '/documents/invoice-003.pdf',
        created_at: '2025-07-18T09:30:00Z',
        updated_at: '2025-07-18T09:30:00Z',
        created_by: 'Finance Admin',
        approval_history: [
          {
            id: '4',
            action: 'LOGGED',
            user_name: 'Finance Admin',
            user_role: 'Finance Admin',
            timestamp: '2025-07-18T09:30:00Z'
          }
        ]
      },
      {
        id: '4',
        invoice_number: 'INV-2025-004',
        vendor_id: '4',
        vendor: {
          id: '4',
          vendor_name: 'Printing Services Pro'
        },
        department_id: '4',
        department: {
          ID: '4',
          name: 'Marketing'
        },
        amount: 1500.00,
        invoice_date: '2025-07-25',
        due_date: '2025-08-25',
        description: 'Printing services for marketing materials and brochures',
        status: 'PAID',
        document_url: '/documents/invoice-004.pdf',
        created_at: '2025-07-28T16:45:00Z',
        updated_at: '2025-08-01T10:20:00Z',
        created_by: 'Finance Admin',
        approved_by: 'Marketing Manager',
        approved_at: '2025-07-30T15:00:00Z',
        approval_history: [
          {
            id: '5',
            action: 'LOGGED',
            user_name: 'Finance Admin',
            user_role: 'Finance Admin',
            timestamp: '2025-07-28T16:45:00Z'
          },
          {
            id: '6',
            action: 'APPROVED',
            user_name: 'Marketing Manager',
            user_role: 'Marketing Manager',
            timestamp: '2025-07-30T15:00:00Z'
          },
          {
            id: '7',
            action: 'PAID',
            user_name: 'Finance Admin',
            user_role: 'Finance Admin',
            timestamp: '2025-08-01T10:20:00Z'
          }
        ]
      }
    ];
  }
}

// Get invoice by ID
export async function getInvoiceById(invoiceId: string): Promise<Invoice> {
  try {
    const res = await fetch(`${API_BASE}/invoices/${invoiceId}`, {
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      throw new Error('Failed to fetch invoice');
    }

    const response = await res.json();
    return response.data || response;
  } catch (error) {
    console.error('Failed to fetch invoice:', error);
    throw error;
  }
}

// Create new invoice
export async function createInvoice(invoiceData: CreateInvoiceRequest): Promise<Invoice> {
  try {
    // Handle file upload if document is provided
    let documentUrl: string | undefined;
    if (invoiceData.document) {
      const formData = new FormData();
      formData.append('file', invoiceData.document);

      const uploadRes = await fetch(`${API_BASE}/upload-document`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData,
      });

      if (!uploadRes.ok) throw new Error('Failed to upload document');
      const uploadResult = await uploadRes.json();
      documentUrl = uploadResult.url;
    }

    // Prepare invoice data without file
    const { document, ...invoiceWithoutFile } = invoiceData;
    const finalInvoiceData = {
      ...invoiceWithoutFile,
      ...(documentUrl && { document_url: documentUrl }),
    };

    const res = await fetch(`${API_BASE}/invoices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(finalInvoiceData),
    });

    if (!res.ok) {
      throw new Error('Failed to create invoice');
    }

    const response = await res.json();
    return response.data || response;
  } catch (error) {
    console.error('Failed to create invoice:', error);
    throw error;
  }
}

// Update invoice
export async function updateInvoice(invoiceId: string, updates: UpdateInvoiceRequest): Promise<Invoice> {
  try {
    const res = await fetch(`${API_BASE}/invoices/${invoiceId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(updates),
    });

    if (!res.ok) {
      throw new Error('Failed to update invoice');
    }

    const response = await res.json();
    return response.data || response;
  } catch (error) {
    console.error('Failed to update invoice:', error);
    throw error;
  }
}

// Delete invoice
export async function deleteInvoice(invoiceId: string): Promise<void> {
  try {
    const res = await fetch(`${API_BASE}/invoices/${invoiceId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      throw new Error('Failed to delete invoice');
    }
  } catch (error) {
    console.error('Failed to delete invoice:', error);
    throw error;
  }
}

// Update invoice status
export async function updateInvoiceStatus(invoiceId: string, status: string): Promise<Invoice> {
  try {
    const res = await fetch(`${API_BASE}/invoices/${invoiceId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      throw new Error('Failed to update invoice status');
    }

    const response = await res.json();
    return response.data || response;
  } catch (error) {
    console.error('Failed to update invoice status:', error);
    throw error;
  }
}

// Get overdue invoices
export async function getOverdueInvoices(): Promise<Invoice[]> {
  try {
    const res = await fetch(`${API_BASE}/invoices/overdue`, {
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      throw new Error('Failed to fetch overdue invoices');
    }

    const response = await res.json();
    return response.data || response;
  } catch (error) {
    console.error('Failed to fetch overdue invoices:', error);
    throw error;
  }
}

// Get invoices by status
export async function getInvoicesByStatus(status: string): Promise<Invoice[]> {
  try {
    const res = await fetch(`${API_BASE}/invoices/status?status=${status}`, {
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      throw new Error('Failed to fetch invoices by status');
    }

    const response = await res.json();
    return response.data || response;
  } catch (error) {
    console.error('Failed to fetch invoices by status:', error);
    throw error;
  }
}

// Get invoice statistics
export async function getInvoiceStats(): Promise<InvoiceStats> {
  try {
    const res = await fetch(`${API_BASE}/invoices/stats`, {
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      throw new Error('Failed to fetch invoice statistics');
    }

    const response = await res.json();
    return response.data || response;
  } catch (error) {
    console.error('Failed to fetch invoice statistics:', error);
    // Return mock data for development
    return {
      total_invoices: 4,
      total_amount: 6050.00,
      pending_approval: 1,
      approved_for_payment: 1,
      paid: 1,
      overdue: 1,
      overdue_amount: 800.00
    };
  }
}

// Export invoices
export async function exportInvoices(format: 'pdf' | 'excel', filters?: InvoiceFilter): Promise<{ download_url: string }> {
  try {
    const params = new URLSearchParams();
    params.append('format', format);
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });
    }

    const endpoint = `${API_BASE}/invoices/export?${params.toString()}`;
    const res = await fetch(endpoint, {
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      throw new Error('Failed to export invoices');
    }

    const response = await res.json();
    return response.data || response;
  } catch (error) {
    console.error('Failed to export invoices:', error);
    throw error;
  }
}

// Get invoice history
export async function getInvoiceHistory(invoiceId: string): Promise<InvoiceHistory[]> {
    try {
        const response = await fetch(`${API_BASE}/invoices/${invoiceId}/history`, {
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
        }

        const data = await response.json();
        
        // Check if response has error format
        if (data.status === false && data.message) {
            throw new Error(data.message);
        }
        
        return data.data || data.history || [];
    } catch (error) {
        throw new Error(handleInvoiceAPIError(error, 'fetch invoice history'));
    }
}

// Error handling helper
export const handleInvoiceAPIError = (error: any, context: string = 'API call'): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return `An unexpected error occurred during ${context}`;
};

// Legacy API object for backward compatibility
export const invoiceAPI = {
  getAllInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  updateInvoiceStatus,
  getOverdueInvoices,
  getInvoicesByStatus,
  getInvoiceStats,
  exportInvoices,
  getInvoiceHistory,
}; 