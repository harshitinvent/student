export type TransactionType = 'CHARGE' | 'PAYMENT' | 'FINANCIAL_AID' | 'REFUND' | 'ADJUSTMENT';

export type TransactionStatus = 'PENDING' | 'POSTED' | 'CANCELLED';

export type AccountStatus = 'ACTIVE' | 'ON_HOLD' | 'CLOSED';

export type SourceSystem = 'LIBRARY' | 'ACCOMMODATION' | 'ACADEMIC_AFFAIRS' | 'MANUAL' | 'SYSTEM';

export type PaymentMode = 'ONLINE' | 'CASH' | 'CHEQUE';

export type TransactionCategory = 'TUITION' | 'HOSTEL' | 'LIBRARY' | 'LAB' | 'EXAM' | 'OTHER';

// API Response structure
export interface APIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

// Student structure from API
export interface Student {
  ID: string;
  student_id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar_url?: string;
  program: string;
  year_of_study: string;
  enrollment_date: string;
  status: AccountStatus;
  total_fees?: number;
  total_paid?: number;
  total_due?: number;
  outstanding_balance?: number;
  last_payment?: {
    amount: number;
    date: string;
    mode: PaymentMode;
  };
  next_due_payment?: {
    amount: number;
    due_date: string;
  };
}

// Transaction structure
export interface Transaction {
  id: string;
  student_id: string;
  transaction_type: TransactionType;
  amount: number;
  description: string;
  status: TransactionStatus;
  transaction_date: string;
  payment_mode?: PaymentMode;
  category?: TransactionCategory;
  attachment_url?: string;
  receipt_number?: string;
  cheque_number?: string;
  created_at: string;
  updated_at: string;
}

// Student with transactions
export interface StudentWithTransactions {
  student: Student;
  transactions: Transaction[];
  total_charges: number;
  total_payments: number;
  outstanding_balance: number;
}

// Student Financial Summary for the main view
export interface StudentFinancialSummary {
  student: Student;
  current_semester: {
    total_fees: number;
    total_paid: number;
    total_due: number;
    last_payment?: {
      amount: number;
      date: string;
      mode: PaymentMode;
    };
    next_due_payment?: {
      amount: number;
      due_date: string;
    };
  };
  recent_transactions: Transaction[];
  total_charges: number;
  total_payments: number;
  total_financial_aid: number;
  outstanding_balance: number;
}

// Legacy types for backward compatibility
export interface StudentAccount {
  id: string;
  student_id: string;
  status: AccountStatus;
  created_at: string;
  updated_at: string;
  current_balance: number;
}

export interface CreateTransactionRequest {
  student_id: string;
  transaction_type: TransactionType;
  amount: number;
  description: string;
  payment_mode?: PaymentMode;
  category?: TransactionCategory;
  attachment?: File;
  receipt_number?: string;
  cheque_number?: string;
  transaction_date?: string;
}

export interface PaymentRequest {
  student_id: string;
  amount: number;
  payment_method: 'CREDIT_CARD' | 'BANK_TRANSFER' | 'CHECK';
  description?: string;
}

export interface PaymentGatewayResponse {
  success: boolean;
  transaction_id?: string;
  gateway_reference?: string;
  error_message?: string;
}

export interface FinancialReport {
  total_revenue: number;
  total_outstanding: number;
  total_students: number;
  students_with_balance: number;
  monthly_summary: {
    month: string;
    revenue: number;
    charges: number;
    payments: number;
  }[];
} 