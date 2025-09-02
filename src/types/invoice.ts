export interface Invoice {
  id: string;
  invoice_number: string;
  vendor_id: string;
  vendor?: {
    id: string;
  vendor_name: string;
  };
  department_id: string;
  department?: {
    ID: string;
    name: string;
  };
  amount: number;
  invoice_date: string;
  due_date: string;
  description: string;
  status: InvoiceStatus;
  document_url?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  approved_by?: string;
  approved_at?: string;
  approval_history?: ApprovalHistory[];
}

export interface CreateInvoiceRequest {
  invoice_number: string;
  vendor_id: string;
  department_id: string;
  amount: number;
  invoice_date: string;
  due_date: string;
  description: string;
  document?: File;
}

export interface UpdateInvoiceRequest extends Partial<CreateInvoiceRequest> {
  status?: InvoiceStatus;
}

export interface InvoiceFilter {
  search?: string;
  status?: InvoiceStatus;
  vendor_id?: string;
  department?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
  limit?: number;
}

export type InvoiceStatus = 
  | 'DRAFT' 
  | 'PENDING_APPROVAL' 
  | 'APPROVED_FOR_PAYMENT' 
  | 'PAID' 
  | 'REJECTED' 
  | 'OVERDUE';

export interface ApprovalHistory {
  id: string;
  action: 'LOGGED' | 'APPROVED' | 'REJECTED' | 'PAID';
  user_name: string;
  user_role: string;
  timestamp: string;
  comments?: string;
}

export interface InvoiceHistory {
    id: string;
    invoice_id: string;
    status: InvoiceStatus;
    action: 'APPROVED' | 'REJECTED' | 'PENDING' | 'SUBMITTED';
    comment?: string;
    action_by: string;
    action_date: string;
    previous_status?: InvoiceStatus;
}

export interface InvoiceResponse {
  success: boolean;
  data: Invoice | Invoice[];
  message?: string;
  errors?: string[];
}

export interface PaginatedInvoiceResponse {
  success: boolean;
  data: {
    invoices: Invoice[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      total_pages: number;
    };
  };
  message?: string;
}

export interface InvoiceStats {
  total_invoices: number;
  total_amount: number;
  pending_approval: number;
  approved_for_payment: number;
  paid: number;
  overdue: number;
  overdue_amount: number;
} 