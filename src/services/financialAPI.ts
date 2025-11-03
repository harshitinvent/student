import type {
  Student,
  Transaction,
  CreateTransactionRequest,
  StudentWithTransactions,
  StudentFinancialSummary,
} from '../types/finance';

// API Base URL - configure this based on your environment
const API_BASE = 'http://localhost:8080/api/financial';

// Helper function to get authentication headers
function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('token');
  console.log('Token from localStorage:', token ? 'Present' : 'Missing');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Get all students with financial summaries
export async function getAllStudentsWithFinancialData(): Promise<
  StudentFinancialSummary[]
> {
  try {
    const res = await fetch(`${API_BASE}/students/financial-summary`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      console.error('API Error:', res.status, res.statusText);
      const errorText = await res.text();
      console.error('Error response:', errorText);
      throw new Error(
        `Failed to fetch students: ${res.status} ${res.statusText}`
      );
    }
    const response = await res.json();
    console.log('API Response:', response);

    // Handle both direct array and wrapped response
    if (Array.isArray(response)) {
      return response;
    } else if (response && response.data && Array.isArray(response.data)) {
      return response.data;
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
        student: {
          ID: '1',
          student_id: 'STU001',
          first_name: 'John',
          last_name: 'Doe',
          email: 'john.doe@university.edu',
          avatar_url: '/pic/user-avatar.jpg',
          program: 'Bachelor of Computer Science',
          year_of_study: '3rd Year',
          enrollment_date: '2022-09-01',
          status: 'ACTIVE',
          total_fees: 5000.0,
          total_paid: 3750.0,
          total_due: 1250.0,
          outstanding_balance: 1250.0,
          last_payment: {
            amount: 500.0,
            date: '2024-11-15T10:30:00Z',
            mode: 'ONLINE',
          },
          next_due_payment: {
            amount: 1250.0,
            due_date: '2024-12-15T00:00:00Z',
          },
        },
        current_semester: {
          total_fees: 5000.0,
          total_paid: 3750.0,
          total_due: 1250.0,
          last_payment: {
            amount: 500.0,
            date: '2024-11-15T10:30:00Z',
            mode: 'ONLINE',
          },
          next_due_payment: {
            amount: 1250.0,
            due_date: '2024-12-15T00:00:00Z',
          },
        },
        recent_transactions: [
          {
            id: '1',
            student_id: 'STU001',
            transaction_type: 'CHARGE',
            amount: 5000.0,
            description: 'Tuition Fee - 3rd Year',
            status: 'POSTED',
            transaction_date: '2024-09-01T00:00:00Z',
            category: 'TUITION',
            created_at: '2024-09-01T00:00:00Z',
            updated_at: '2024-09-01T00:00:00Z',
          },
          {
            id: '2',
            student_id: 'STU001',
            transaction_type: 'PAYMENT',
            amount: 500.0,
            description: 'Online Payment',
            status: 'POSTED',
            transaction_date: '2024-11-15T10:30:00Z',
            payment_mode: 'ONLINE',
            receipt_number: 'RCP001',
            created_at: '2024-11-15T10:30:00Z',
            updated_at: '2024-11-15T10:30:00Z',
          },
        ],
        total_charges: 5000.0,
        total_payments: 3750.0,
        total_financial_aid: 0.0,
        outstanding_balance: 1250.0,
      },
      {
        student: {
          ID: '2',
          student_id: 'STU002',
          first_name: 'Jane',
          last_name: 'Smith',
          email: 'jane.smith@university.edu',
          avatar_url: '/pic/user-avatar.jpg',
          program: 'Master of Business Administration',
          year_of_study: '2nd Year',
          enrollment_date: '2023-09-01',
          status: 'ACTIVE',
          total_fees: 8000.0,
          total_paid: 8000.0,
          total_due: 0.0,
          outstanding_balance: 0.0,
          last_payment: {
            amount: 2000.0,
            date: '2024-11-20T14:15:00Z',
            mode: 'CHEQUE',
          },
        },
        current_semester: {
          total_fees: 8000.0,
          total_paid: 8000.0,
          total_due: 0.0,
          last_payment: {
            amount: 2000.0,
            date: '2024-11-20T14:15:00Z',
            mode: 'CHEQUE',
          },
        },
        recent_transactions: [
          {
            id: '3',
            student_id: 'STU002',
            transaction_type: 'CHARGE',
            amount: 8000.0,
            description: 'Tuition Fee - 2nd Year MBA',
            status: 'POSTED',
            transaction_date: '2024-09-01T00:00:00Z',
            category: 'TUITION',
            created_at: '2024-09-01T00:00:00Z',
            updated_at: '2024-09-01T00:00:00Z',
          },
          {
            id: '4',
            student_id: 'STU002',
            transaction_type: 'PAYMENT',
            amount: 2000.0,
            description: 'Cheque Payment',
            status: 'POSTED',
            transaction_date: '2024-11-20T14:15:00Z',
            payment_mode: 'CHEQUE',
            cheque_number: 'CHQ001',
            created_at: '2024-11-20T14:15:00Z',
            updated_at: '2024-11-20T14:15:00Z',
          },
        ],
        total_charges: 8000.0,
        total_payments: 8000.0,
        total_financial_aid: 0.0,
        outstanding_balance: 0.0,
      },
    ];
  }
}

// Get all students
export async function getAllStudents(): Promise<Student[]> {
  try {
    const res = await fetch(`${API_BASE}/students`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      console.error('API Error:', res.status, res.statusText);
      const errorText = await res.text();
      console.error('Error response:', errorText);
      throw new Error(
        `Failed to fetch students: ${res.status} ${res.statusText}`
      );
    }
    const response = await res.json();
    console.log('API Response:', response);

    // Handle both direct array and wrapped response
    if (Array.isArray(response)) {
      return response;
    } else if (response && response.data && Array.isArray(response.data)) {
      return response.data;
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
        ID: '1',
        student_id: 'STU001',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@university.edu',
        avatar_url: '/pic/user-avatar.jpg',
        program: 'Bachelor of Computer Science',
        year_of_study: '3rd Year',
        enrollment_date: '2022-09-01',
        status: 'ACTIVE',
        total_fees: 5000.0,
        total_paid: 3750.0,
        total_due: 1250.0,
        outstanding_balance: 1250.0,
        last_payment: {
          amount: 500.0,
          date: '2024-11-15T10:30:00Z',
          mode: 'ONLINE',
        },
        next_due_payment: {
          amount: 1250.0,
          due_date: '2024-12-15T00:00:00Z',
        },
      },
      {
        ID: '2',
        student_id: 'STU002',
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane.smith@university.edu',
        avatar_url: '/pic/user-avatar.jpg',
        program: 'Master of Business Administration',
        year_of_study: '2nd Year',
        enrollment_date: '2023-09-01',
        status: 'ACTIVE',
        total_fees: 8000.0,
        total_paid: 8000.0,
        total_due: 0.0,
        outstanding_balance: 0.0,
        last_payment: {
          amount: 2000.0,
          date: '2024-11-20T14:15:00Z',
          mode: 'CHEQUE',
        },
      },
    ];
  }
}

// Get student by ID
export async function getStudentById(studentId: string): Promise<Student> {
  const res = await fetch(`${API_BASE}/students/${studentId}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch student');
  const response = await res.json();
  return response.data || response;
}

// Get student transactions
export async function getStudentTransactions(
  studentId: string
): Promise<Transaction[]> {
  const res = await fetch(`${API_BASE}/students/${studentId}/transactions`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch student transactions');
  const response = await res.json();
  return response.data || response;
}

// Get student with transactions
export async function getStudentWithTransactions(
  studentId: string
): Promise<StudentWithTransactions> {
  const res = await fetch(`${API_BASE}/students/${studentId}/transactions`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch student with transactions');
  const response = await res.json();
  return response.data || response;
}

// Get all transactions with filters
export async function getTransactions(filters?: {
  student_id?: string;
  transaction_type?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
  limit?: number;
}): Promise<{ data: Transaction[]; total: number }> {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value.toString());
    });
  }

  const endpoint = `${API_BASE}/transactions?${params.toString()}`;
  const res = await fetch(endpoint, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch transactions');
  const response = await res.json();
  return response.data || response;
}

// Create new transaction
export async function createTransaction(
  transactionData: CreateTransactionRequest
): Promise<Transaction> {
  try {
    // Handle file upload if attachment is provided
    let attachmentUrl: string | undefined;
    if (transactionData.attachment) {
      const formData = new FormData();
      formData.append('file', transactionData.attachment);

      const uploadRes = await fetch(`${API_BASE}/upload-attachment`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData,
      });

      if (!uploadRes.ok) throw new Error('Failed to upload attachment');
      const uploadResult = await uploadRes.json();
      attachmentUrl = uploadResult.url;
    }

    // Prepare transaction data without file
    const { attachment, ...transactionWithoutFile } = transactionData;
    const finalTransactionData = {
      ...transactionWithoutFile,
      ...(attachmentUrl && { attachment_url: attachmentUrl }),
    };

    const res = await fetch(`${API_BASE}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(finalTransactionData),
    });

    if (!res.ok) throw new Error('Failed to create transaction');
    const response = await res.json();
    return response.data || response;
  } catch (error) {
    console.error('Failed to create transaction:', error);
    throw error;
  }
}

// Update transaction
export async function updateTransaction(
  transactionId: string,
  updates: Partial<Transaction>
): Promise<Transaction> {
  const res = await fetch(`${API_BASE}/transactions/${transactionId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error('Failed to update transaction');
  const response = await res.json();
  return response.data || response;
}

// Delete transaction
export async function deleteTransaction(transactionId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/transactions/${transactionId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete transaction');
}

// Get financial reports
export async function getFinancialReports(filters?: {
  start_date?: string;
  end_date?: string;
  program?: string;
  year_of_study?: string;
}): Promise<any> {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value.toString());
    });
  }

  const endpoint = `${API_BASE}/reports?${params.toString()}`;
  const res = await fetch(endpoint, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch reports');
  const response = await res.json();
  return response.data || response;
}

// Get dashboard statistics
export async function getDashboardStats(): Promise<any> {
  const res = await fetch(`${API_BASE}/dashboard-stats`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch dashboard stats');
  const response = await res.json();
  return response.data || response;
}

// Get programs list
export async function getPrograms(): Promise<string[]> {
  const res = await fetch(`${API_BASE}/programs`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch programs');
  const response = await res.json();
  return response.data || response;
}

// Get years of study list
export async function getYearsOfStudy(): Promise<string[]> {
  const res = await fetch(`${API_BASE}/years-of-study`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch years of study');
  const response = await res.json();
  return response.data || response;
}

// Export financial data
export async function exportFinancialData(
  format: 'pdf' | 'excel',
  filters?: {
    start_date?: string;
    end_date?: string;
    program?: string;
    year_of_study?: string;
  }
): Promise<{ download_url: string }> {
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
  if (!res.ok) throw new Error('Failed to export data');
  const response = await res.json();
  return response.data || response;
}

// Bulk operations
export async function bulkUpdateTransactions(updates: {
  transaction_ids: string[];
  updates: Partial<Transaction>;
}): Promise<void> {
  const res = await fetch(`${API_BASE}/transactions/bulk`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error('Failed to bulk update transactions');
}

// Payment gateway integration
export async function initiatePayment(paymentData: {
  student_id: string;
  amount: number;
  description: string;
  payment_method: string;
}): Promise<{ payment_url: string; payment_id: string }> {
  const res = await fetch(`${API_BASE}/payments/initiate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(paymentData),
  });
  if (!res.ok) throw new Error('Failed to initiate payment');
  const response = await res.json();
  return response.data || response;
}

// Payment webhook
export async function processPaymentWebhook(webhookData: any): Promise<void> {
  const res = await fetch(`${API_BASE}/payments/webhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(webhookData),
  });
  if (!res.ok) throw new Error('Failed to process payment webhook');
}

// Error handling helper
export const handleAPIError = (error: any): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
};

// Legacy API object for backward compatibility
export const financialAPI = {
  getAllStudents,
  getAllStudentsWithFinancialData,
  getStudentById,
  getStudentTransactions,
  getStudentWithTransactions,
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getFinancialReports,
  getDashboardStats,
  getPrograms,
  getYearsOfStudy,
  exportFinancialData,
  bulkUpdateTransactions,
  initiatePayment,
  processPaymentWebhook,
};

// Type definitions for API responses
export interface APIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}
