import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
    UserIcon,
    MortarboardIcon,
    CalendarIcon,
    CoinsIcon,
    PlusSignIcon,
    SearchIcon,
    CancelIcon,
    Tick02Icon,
    AlertIcon,
    EditIcon,
    DownloadIcon,
    UploadIcon,
    ClockIcon,
} from '@hugeicons/core-free-icons';

import PageTitleArea from '../../components/shared/PageTitleArea';
import Button from '../../components/shared/Button';
import Table from '../../components/features/Table';
import { HugeiconsIcon } from '@hugeicons/react';
import ModalWrapper from '../../components/shared/wrappers/ModalWrapper';
import Avatar from '../../components/shared/Avatar';
import SearchInput from '../../components/shared/form-elements/SearchInput';
import type {
    Student,
    Transaction,
    TransactionType,
    PaymentMode,
    TransactionCategory,
    CreateTransactionRequest
} from '../../types/finance';
import { getAllStudents, createTransaction, getStudentTransactions, handleAPIError } from '../../services/financialAPI';

export default function FinancialTransactionsPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [selectedStudentTransactions, setSelectedStudentTransactions] = useState<Transaction[]>([]);
    const [addTransactionModalOpen, setAddTransactionModalOpen] = useState(false);
    const [tableLoading, setTableLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [programFilter, setProgramFilter] = useState('ALL');
    const [yearFilter, setYearFilter] = useState('ALL');
    const [isAddingFromStudentView, setIsAddingFromStudentView] = useState(false);

    // Transaction form state
    const [transactionForm, setTransactionForm] = useState({
        student_id: '',
        transaction_type: 'PAYMENT' as TransactionType,
        amount: '',
        description: '',
        payment_mode: 'ONLINE' as PaymentMode,
        category: 'TUITION' as TransactionCategory,
        receipt_number: '',
        cheque_number: '',
        transaction_date: new Date().toISOString().slice(0, 16),
        attachment: null as File | null
    });

    useEffect(() => {
        loadStudents();
    }, []);

    const loadStudents = async () => {
        try {
            setTableLoading(true);
            const data = await getAllStudents();
            console.log('API Response:', data);

            // Ensure data is an array
            if (Array.isArray(data)) {
                setStudents(data);
            } else if (data && typeof data === 'object' && 'data' in data && Array.isArray((data as any).data)) {
                setStudents((data as any).data);
            } else {
                console.error('API returned non-array data:', data);
                setStudents([]);
                alert('Invalid data format received from server');
            }
        } catch (error) {
            console.error('Failed to load students:', error);
            setStudents([]);
            alert(handleAPIError(error));
        } finally {
            setTableLoading(false);
        }
    };

    const loadStudentTransactions = async (studentId: string) => {
        try {
            const transactions = await getStudentTransactions(studentId);
            setSelectedStudentTransactions(transactions);
        } catch (error) {
            console.error('Failed to load student transactions:', error);
            setSelectedStudentTransactions([]);
        }
    };

    const filteredStudents = Array.isArray(students) ? students.filter(student => {
        console.log('Student:', student);
        const matchesSearch =
            student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesProgram = programFilter === 'ALL' || student.program === programFilter;
        const matchesYear = yearFilter === 'ALL' || student.year_of_study === yearFilter;

        return matchesSearch && matchesProgram && matchesYear;
    }) : [];

    const handleAddTransaction = async () => {
        if (!transactionForm.student_id || !transactionForm.amount || !transactionForm.description) {
            alert('Please fill in all required fields');
            return;
        }

        const amount = parseFloat(transactionForm.amount);
        if (isNaN(amount) || amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        try {
            await createTransaction({
                student_id: transactionForm.student_id.toString(),
                transaction_type: transactionForm.transaction_type,
                amount: amount,
                description: transactionForm.description,
                payment_mode: transactionForm.payment_mode,
                category: transactionForm.category,
                receipt_number: transactionForm.receipt_number || undefined,
                cheque_number: transactionForm.cheque_number || undefined,
                transaction_date: transactionForm.transaction_date,
                attachment: transactionForm.attachment || undefined
            });

            // Reload students data to get updated information
            await loadStudents();

            // If we have a selected student, reload their transactions
            if (selectedStudent) {
                await loadStudentTransactions(selectedStudent.ID);
            }

            setAddTransactionModalOpen(false);
            resetTransactionForm();
            alert('Transaction created successfully!');
        } catch (error) {
            console.error('Failed to create transaction:', error);
            alert(handleAPIError(error));
        }
    };

    const resetTransactionForm = () => {
        setTransactionForm({
            student_id: '',
            transaction_type: 'PAYMENT',
            amount: '',
            description: '',
            payment_mode: 'ONLINE',
            category: 'TUITION',
            receipt_number: '',
            cheque_number: '',
            transaction_date: new Date().toISOString().slice(0, 16),
            attachment: null
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        } catch (error) {
            return 'Invalid Date';
        }
    };

    const formatDateTime = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return 'Invalid Date';
        }
    };

    const getTransactionTypeColor = (type: TransactionType) => {
        switch (type) {
            case 'CHARGE': return 'text-red-600';
            case 'PAYMENT': return 'text-green-600';
            case 'FINANCIAL_AID': return 'text-blue-600';
            case 'REFUND': return 'text-purple-600';
            case 'ADJUSTMENT': return 'text-orange-600';
            default: return 'text-gray-600';
        }
    };

    const getTransactionTypeIcon = (type: TransactionType) => {
        switch (type) {
            case 'CHARGE': return AlertIcon;
            case 'PAYMENT': return Tick02Icon;
            case 'FINANCIAL_AID': return Tick02Icon;
            case 'REFUND': return Tick02Icon;
            case 'ADJUSTMENT': return EditIcon;
            default: return CoinsIcon;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ACTIVE': return 'bg-green-100 text-green-800';
            case 'ON_HOLD': return 'bg-red-100 text-red-800';
            case 'CLOSED': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getUniquePrograms = () => {
        if (!Array.isArray(students)) return ['ALL'];
        const programs = students.map(s => s.program).filter(Boolean);
        return ['ALL', ...Array.from(new Set(programs))];
    };

    const getUniqueYears = () => {
        if (!Array.isArray(students)) return ['ALL'];
        const years = students.map(s => s.year_of_study).filter(Boolean);
        return ['ALL', ...Array.from(new Set(years))];
    };

    const handleStudentClick = async (student: Student) => {
        setSelectedStudent(student);
        await loadStudentTransactions(student.ID);
    };



    return (
        <div className="relative">
            {/* <PageTitleArea title="Financial Transactions">
                <div className="flex items-center gap-12">
                    <Button
                        onClick={() => setAddTransactionModalOpen(true)}
                    >
                        <HugeiconsIcon icon={PlusSignIcon} className="size-16" />
                        Add Transaction
                    </Button>
                </div>
            </PageTitleArea> */}

            <div className="px-24 py-16 max-md:px-16">
                {/* Search and Filter Controls */}
                <div className="mb-24 flex flex-wrap gap-16">
                    <div className="flex-1 min-w-200">
                        <SearchInput
                            placeholder="Search students by name, ID, or email..."
                            value={searchTerm}
                            onChange={(value) => setSearchTerm(value)}
                            onSubmit={() => { }}
                        />
                    </div>
                    <div className="w-200">
                        <select
                            value={programFilter}
                            onChange={(e) => setProgramFilter(e.target.value)}
                            className="bg-bgNavigate border-linePr text-body-m text-textPr w-full border rounded-12 h-48 px-16 font-medium duration-300 outline-none focus:border-[#E2E2E2] focus:bg-[#F1F1F1]"
                        >
                            {getUniquePrograms().map(program => (
                                <option key={program} value={program}>
                                    {program === 'ALL' ? 'All Programs' : program}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="w-200">
                        <select
                            value={yearFilter}
                            onChange={(e) => setYearFilter(e.target.value)}
                            className="bg-bgNavigate border-linePr text-body-m text-textPr w-full border rounded-12 h-48 px-16 font-medium duration-300 outline-none focus:border-[#E2E2E2] focus:bg-[#F1F1F1]"
                        >
                            {getUniqueYears().map(year => (
                                <option key={year} value={year}>
                                    {year === 'ALL' ? 'All Years' : year}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Students Financial Table */}
                <Table
                    titles={[
                        { icon: UserIcon, title: 'Student Name' },
                        { icon: MortarboardIcon, title: 'Program & Year' },
                        { icon: CoinsIcon, title: 'Total Fees & Due' },
                        { icon: CalendarIcon, title: 'Status' },
                        { icon: EditIcon, title: 'Actions' },
                    ]}
                    gridClassName="md:grid-cols-[1.5fr_1.5fr_1fr_1fr_0.5fr]"
                >
                    {filteredStudents.map((student) => (
                        <div
                            key={student.ID}
                            className="max-md:grid max-md:gap-16 max-md:[&>*]:flex max-md:[&>*]:min-h-32 max-md:[&>*]:items-center max-md:[&>*]:justify-between max-md:[&>*]:gap-12"
                        >
                            <div>
                                <p className="text-14 text-textHeadline font-medium md:hidden">
                                    Student Name
                                </p>
                                <div className="flex items-center gap-12">
                                    <Avatar className="size-32" src={student?.avatar_url} />
                                    <div>
                                        <p className="text-textHeadline/80 text-14 font-medium">
                                            {student?.first_name || 'N/A'} {student?.last_name || ''}
                                        </p>
                                        <p className="text-textDescription text-12">
                                            {student?.student_id || 'N/A'} • {student?.email || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <p className="text-14 text-textHeadline font-medium md:hidden">
                                    Program & Year
                                </p>
                                <div>
                                    <p className="text-textHeadline/80 text-14 font-medium">
                                        {student.program || 'N/A'}
                                    </p>
                                    <p className="text-textDescription text-12">
                                        {student.year_of_study || 'N/A'}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <p className="text-14 text-textHeadline font-medium md:hidden">
                                    Total Fees & Due
                                </p>
                                <div>
                                    <p className="text-textHeadline/80 text-14 font-medium">
                                        {formatCurrency(student.total_fees || 0)}
                                    </p>
                                    <p className={`text-12 font-medium ${(student.total_due || 0) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                        Due: {formatCurrency(student.total_due || 0)}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <p className="text-14 text-textHeadline font-medium md:hidden">
                                    Status
                                </p>
                                <div>
                                    <span className={`text-12 font-medium px-8 py-2 rounded-6 ${getStatusColor(student.status || 'ACTIVE')}`}>
                                        {(student.status || 'ACTIVE').replace('_', ' ')}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <p className="text-14 text-textHeadline font-medium md:hidden">
                                    Actions
                                </p>
                                <div className="flex gap-8">
                                    <Button
                                        className="!text-iconBlue"
                                        style="transparent"
                                        onClick={() => handleStudentClick(student)}
                                    >
                                        <HugeiconsIcon icon={EditIcon} className="size-16" />
                                        View
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </Table>
            </div>

            {/* Student Transactions Modal */}
            {selectedStudent &&
                createPortal(
                    <ModalWrapper>
                        <div className="rounded-32 max-md:rounded-24 bg-bgSec relative flex max-h-full w-full max-w-1000 flex-col overflow-hidden">
                            <div className="border-linePr flex items-center justify-between border-b p-24">
                                <div>
                                    <h3 className="text-h5 font-medium text-textHeadline">
                                        {selectedStudent.first_name || 'N/A'} {selectedStudent.last_name || ''}
                                    </h3>
                                    <p className="text-14 text-textDescription">
                                        {selectedStudent.program || 'N/A'} • {selectedStudent.year_of_study || 'N/A'}
                                    </p>
                                </div>
                                <button
                                    className="bg-bgPr hover:shadow-s1 border-linePr rounded-12 text-textHeadline flex size-40 cursor-pointer items-center justify-center border duration-300"
                                    onClick={() => {
                                        setSelectedStudent(null);
                                        setSelectedStudentTransactions([]);
                                    }}
                                >
                                    ×
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-24">
                                {/* Student Summary */}
                                <div className="grid gap-24 mb-32 md:grid-cols-3">
                                    <div className="bg-white rounded-16 border border-linePr p-24">
                                        <h4 className="text-16 font-medium text-textHeadline mb-16">Financial Summary</h4>
                                        <div className="space-y-12">
                                            <div className="flex justify-between">
                                                <span className="text-14 text-textDescription">Total Fees:</span>
                                                <span className="text-14 font-medium">{formatCurrency(selectedStudent.total_fees || 0)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-14 text-textDescription">Total Paid:</span>
                                                <span className="text-14 font-medium text-green-600">{formatCurrency(selectedStudent.total_paid || 0)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-14 text-textDescription">Total Due:</span>
                                                <span className="text-14 font-bold text-red-600">{formatCurrency(selectedStudent.total_due || 0)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-16 border border-linePr p-24">
                                        <h4 className="text-16 font-medium text-textHeadline mb-16">Account Status</h4>
                                        <div className="space-y-12">
                                            <div className="flex justify-between">
                                                <span className="text-14 text-textDescription">Status:</span>
                                                <span className={`text-14 font-medium ${getStatusColor(selectedStudent.status || 'ACTIVE')}`}>
                                                    {(selectedStudent.status || 'ACTIVE').replace('_', ' ')}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-14 text-textDescription">Student ID:</span>
                                                <span className="text-14 font-medium">{selectedStudent.student_id || 'N/A'}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-14 text-textDescription">Enrollment:</span>
                                                <span className="text-14 font-medium">{selectedStudent.enrollment_date ? formatDate(selectedStudent.enrollment_date) : 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-16 border border-linePr p-24">
                                        <h4 className="text-16 font-medium text-textHeadline mb-16">Outstanding Balance</h4>
                                        <div className="space-y-12">
                                            <div className="flex justify-between">
                                                <span className="text-14 text-textDescription">Outstanding:</span>
                                                <span className="text-14 font-bold text-red-600">{formatCurrency(selectedStudent.outstanding_balance || 0)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Transaction History */}
                                <div className="bg-white rounded-16 border border-linePr">
                                    <div className="border-linePr border-b p-24">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-16 font-medium text-textHeadline">Transaction History</h4>
                                            <Button
                                                onClick={() => {
                                                    setTransactionForm({
                                                        ...transactionForm,
                                                        student_id: selectedStudent.ID
                                                    });
                                                    setIsAddingFromStudentView(true);
                                                    setAddTransactionModalOpen(true);
                                                    setSelectedStudent(null);
                                                    setSelectedStudentTransactions([]);
                                                }}
                                            >
                                                <HugeiconsIcon icon={PlusSignIcon} className="size-16" />
                                                Add Transaction
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="p-24">
                                        {selectedStudentTransactions.length === 0 ? (
                                            <div className="text-center py-32">
                                                <HugeiconsIcon icon={CoinsIcon} className="size-48 text-gray-400 mx-auto mb-16" />
                                                <p className="text-textDescription">No transactions found</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-16">
                                                {selectedStudentTransactions.length > 0 && selectedStudentTransactions?.map((transaction) => (
                                                    <div key={transaction.id} className="flex items-center justify-between p-16 rounded-12 bg-bgNavigate">
                                                        <div className="flex items-center gap-16">
                                                            <div className={`p-12 rounded-full ${getTransactionTypeColor(transaction.transaction_type).replace('text-', 'bg-').replace('-600', '-100')}`}>
                                                                <HugeiconsIcon
                                                                    icon={getTransactionTypeIcon(transaction.transaction_type)}
                                                                    className={`size-16 ${getTransactionTypeColor(transaction.transaction_type)}`}
                                                                />
                                                            </div>
                                                            <div>
                                                                <p className="text-14 font-medium text-textHeadline">
                                                                    {transaction.description}
                                                                </p>
                                                                <div className="flex items-center gap-16 mt-4">
                                                                    <p className="text-12 text-textDescription">
                                                                        {formatDateTime(transaction.CreatedAt)}
                                                                    </p>
                                                                    {transaction.category && (
                                                                        <span className="text-12 text-textDescription bg-gray-100 px-8 py-2 rounded-6">
                                                                            {transaction.category}
                                                                        </span>
                                                                    )}
                                                                    {transaction.payment_mode && (
                                                                        <span className="text-12 text-textDescription bg-blue-100 px-8 py-2 rounded-6">
                                                                            {transaction.payment_mode}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                {transaction.receipt_number && (
                                                                    <p className="text-12 text-textDescription mt-2">
                                                                        Receipt: {transaction.receipt_number}
                                                                    </p>
                                                                )}
                                                                {transaction.cheque_number && (
                                                                    <p className="text-12 text-textDescription mt-2">
                                                                        Cheque: {transaction.cheque_number}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="text-right">
                                                            <p className={`text-16 font-bold ${getTransactionTypeColor(transaction.transaction_type)}`}>
                                                                {transaction.transaction_type === 'CHARGE' ? '-' : '+'}{formatCurrency(transaction.amount)}
                                                            </p>
                                                            <p className="text-12 text-textDescription">
                                                                {transaction.transaction_type}
                                                            </p>
                                                            {transaction.attachment_url && (
                                                                <Button
                                                                    style="transparent"
                                                                    className="mt-8"
                                                                    onClick={() => window.open(transaction.attachment_url, '_blank')}
                                                                >
                                                                    <HugeiconsIcon icon={DownloadIcon} className="size-12" />
                                                                    View
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ModalWrapper>,
                    document.querySelector('#root')!
                )}

            {/* Add Transaction Modal */}
            {addTransactionModalOpen &&
                createPortal(
                    <ModalWrapper>
                        <div className="rounded-32 max-md:rounded-24 bg-bgSec relative flex max-h-full w-full max-w-600 flex-col overflow-hidden">
                            <div className="border-linePr flex items-center justify-between border-b p-24">
                                <h3 className="text-h5 font-medium text-textHeadline">Add New Transaction</h3>
                                <button
                                    className="bg-bgPr hover:shadow-s1 border-linePr rounded-12 text-textHeadline flex size-40 cursor-pointer items-center justify-center border duration-300"
                                    onClick={() => {
                                        setAddTransactionModalOpen(false);
                                        setIsAddingFromStudentView(false);
                                    }}
                                >
                                    ×
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-24">
                                <div className="space-y-24">
                                    {/* Student Selection */}
                                    {!isAddingFromStudentView && (
                                        <div>
                                            <label className="text-body-m text-textHeadline mb-8 block">
                                                Select Student *
                                            </label>
                                            <select
                                                value={transactionForm.student_id}
                                                onChange={(e) => setTransactionForm({ ...transactionForm, student_id: e.target.value })}
                                                className="bg-bgNavigate border-linePr text-body-m text-textPr w-full border rounded-12 h-48 px-16 font-medium duration-300 outline-none focus:border-[#E2E2E2] focus:bg-[#F1F1F1]"
                                            >
                                                <option value="">Select a student...</option>
                                                {students.map(student => (
                                                    <option key={student.ID} value={student.ID}>
                                                        {student.first_name} {student.last_name} - {student.student_id}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    {/* Show selected student info when adding from student view */}
                                    {isAddingFromStudentView && transactionForm.student_id && (
                                        <div>
                                            <label className="text-body-m text-textHeadline mb-8 block">
                                                Selected Student
                                            </label>
                                            <div className="bg-bgNavigate border-linePr text-body-m text-textPr w-full border rounded-12 h-48 px-16 font-medium flex items-center">
                                                {(() => {
                                                    const student = students.find(s => s.ID === transactionForm.student_id);
                                                    return student ? `${student.first_name} ${student.last_name} - ${student.student_id}` : 'Student not found';
                                                })()}
                                            </div>
                                        </div>
                                    )}

                                    {/* Transaction Type */}
                                    <div>
                                        <label className="text-body-m text-textHeadline mb-8 block">
                                            Transaction Type *
                                        </label>
                                        <select
                                            value={transactionForm.transaction_type}
                                            onChange={(e) => setTransactionForm({ ...transactionForm, transaction_type: e.target.value as TransactionType })}
                                            className="bg-bgNavigate border-linePr text-body-m text-textPr w-full border rounded-12 h-48 px-16 font-medium duration-300 outline-none focus:border-[#E2E2E2] focus:bg-[#F1F1F1]"
                                        >
                                            <option value="PAYMENT">Payment</option>
                                            <option value="CHARGE">Charge/Due</option>
                                            <option value="FINANCIAL_AID">Financial Aid</option>
                                            <option value="REFUND">Refund</option>
                                            <option value="ADJUSTMENT">Adjustment</option>
                                        </select>
                                    </div>

                                    {/* Amount */}
                                    <div>
                                        <label className="text-body-m text-textHeadline mb-8 block">
                                            Amount *
                                        </label>
                                        <input
                                            type="number"
                                            value={transactionForm.amount}
                                            onChange={(e) => setTransactionForm({ ...transactionForm, amount: e.target.value })}
                                            min="0.01"
                                            step="0.01"
                                            className="bg-bgNavigate border-linePr text-body-m text-textPr placeholder:text-textSecondary w-full border rounded-12 h-48 px-16 font-medium duration-300 outline-none focus:border-[#E2E2E2] focus:bg-[#F1F1F1]"
                                            placeholder="Enter amount"
                                        />
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="text-body-m text-textHeadline mb-8 block">
                                            Description *
                                        </label>
                                        <textarea
                                            value={transactionForm.description}
                                            onChange={(e) => setTransactionForm({ ...transactionForm, description: e.target.value })}
                                            rows={3}
                                            className="bg-bgNavigate border-linePr text-body-m text-textPr placeholder:text-textSecondary w-full border rounded-12 px-16 py-12 font-medium duration-300 outline-none focus:border-[#E2E2E2] focus:bg-[#F1F1F1]"
                                            placeholder="Enter description"
                                        />
                                    </div>

                                    {/* Payment Mode (for payments) */}
                                    {transactionForm.transaction_type === 'PAYMENT' && (
                                        <div>
                                            <label className="text-body-m text-textHeadline mb-8 block">
                                                Mode of Payment *
                                            </label>
                                            <select
                                                value={transactionForm.payment_mode}
                                                onChange={(e) => setTransactionForm({ ...transactionForm, payment_mode: e.target.value as PaymentMode })}
                                                className="bg-bgNavigate border-linePr text-body-m text-textPr w-full border rounded-12 h-48 px-16 font-medium duration-300 outline-none focus:border-[#E2E2E2] focus:bg-[#F1F1F1]"
                                            >
                                                <option value="ONLINE">Online</option>
                                                <option value="CASH">Cash</option>
                                                <option value="CHEQUE">Cheque</option>
                                            </select>
                                        </div>
                                    )}

                                    {/* Category (for charges) */}
                                    {transactionForm.transaction_type === 'CHARGE' && (
                                        <div>
                                            <label className="text-body-m text-textHeadline mb-8 block">
                                                Service Category *
                                            </label>
                                            <select
                                                value={transactionForm.category}
                                                onChange={(e) => setTransactionForm({ ...transactionForm, category: e.target.value as TransactionCategory })}
                                                className="bg-bgNavigate border-linePr text-body-m text-textPr w-full border rounded-12 h-48 px-16 font-medium duration-300 outline-none focus:border-[#E2E2E2] focus:bg-[#F1F1F1]"
                                            >
                                                <option value="TUITION">Tuition</option>
                                                <option value="HOSTEL">Hostel</option>
                                                <option value="LIBRARY">Library</option>
                                                <option value="LAB">Lab</option>
                                                <option value="EXAM">Exam</option>
                                                <option value="OTHER">Other</option>
                                            </select>
                                        </div>
                                    )}

                                    {/* Receipt/Cheque Number */}
                                    <div className="grid gap-16 md:grid-cols-2">
                                        {transactionForm.transaction_type === 'PAYMENT' && transactionForm.payment_mode === 'ONLINE' && (
                                            <div>
                                                <label className="text-body-m text-textHeadline mb-8 block">
                                                    Receipt Number
                                                </label>
                                                <input
                                                    type="text"
                                                    value={transactionForm.receipt_number}
                                                    onChange={(e) => setTransactionForm({ ...transactionForm, receipt_number: e.target.value })}
                                                    className="bg-bgNavigate border-linePr text-body-m text-textPr placeholder:text-textSecondary w-full border rounded-12 h-48 px-16 font-medium duration-300 outline-none focus:border-[#E2E2E2] focus:bg-[#F1F1F1]"
                                                    placeholder="Enter receipt number"
                                                />
                                            </div>
                                        )}
                                        {transactionForm.transaction_type === 'PAYMENT' && transactionForm.payment_mode === 'CHEQUE' && (
                                            <div>
                                                <label className="text-body-m text-textHeadline mb-8 block">
                                                    Cheque Number
                                                </label>
                                                <input
                                                    type="text"
                                                    value={transactionForm.cheque_number}
                                                    onChange={(e) => setTransactionForm({ ...transactionForm, cheque_number: e.target.value })}
                                                    className="bg-bgNavigate border-linePr text-body-m text-textPr placeholder:text-textSecondary w-full border rounded-12 h-48 px-16 font-medium duration-300 outline-none focus:border-[#E2E2E2] focus:bg-[#F1F1F1]"
                                                    placeholder="Enter cheque number"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Date & Time */}
                                    <div>
                                        <label className="text-body-m text-textHeadline mb-8 block">
                                            Date & Time
                                        </label>
                                        <input
                                            type="datetime-local"
                                            value={transactionForm.transaction_date}
                                            onChange={(e) => setTransactionForm({ ...transactionForm, transaction_date: e.target.value })}
                                            className="bg-bgNavigate border-linePr text-body-m text-textPr w-full border rounded-12 h-48 px-16 font-medium duration-300 outline-none focus:border-[#E2E2E2] focus:bg-[#F1F1F1]"
                                        />
                                    </div>

                                    {/* Attachment */}
                                    <div>
                                        <label className="text-body-m text-textHeadline mb-8 block">
                                            Attachment (Receipt/Cheque Image)
                                        </label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-12 p-24 text-center">
                                            <input
                                                type="file"
                                                accept="image/*,.pdf"
                                                onChange={(e) => setTransactionForm({ ...transactionForm, attachment: e.target.files?.[0] || null })}
                                                className="hidden"
                                                id="attachment-upload"
                                            />
                                            <label htmlFor="attachment-upload" className="cursor-pointer">
                                                <HugeiconsIcon icon={UploadIcon} className="size-32 text-gray-400 mx-auto mb-8" />
                                                <p className="text-14 text-textDescription">
                                                    Click to upload receipt or cheque image
                                                </p>
                                                <p className="text-12 text-textDescription mt-4">
                                                    Supported formats: JPG, PNG, PDF
                                                </p>
                                            </label>
                                            {transactionForm.attachment && (
                                                <div className="mt-16">
                                                    <p className="text-14 text-green-600">
                                                        ✓ {transactionForm.attachment.name}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex gap-12 pt-16">
                                        <Button
                                            style="transparent"
                                            onClick={() => {
                                                setAddTransactionModalOpen(false);
                                                setIsAddingFromStudentView(false);
                                            }}
                                            className="flex-1"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleAddTransaction}
                                            className="flex-1"
                                        >
                                            Add Transaction
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ModalWrapper>,
                    document.querySelector('#root')!
                )}
        </div>
    );
} 