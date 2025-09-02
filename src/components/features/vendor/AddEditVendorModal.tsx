import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { CancelIcon } from '@hugeicons/core-free-icons';

import ModalWrapper from '../../shared/wrappers/ModalWrapper';
import Button from '../../shared/Button';
import type { Vendor, CreateVendorRequest } from '../../../types/vendor';
import { getVendorCategories } from '../../../services/vendorAPI';

interface AddEditVendorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateVendorRequest) => void;
    vendor?: Vendor | null;
    mode: 'add' | 'edit';
    loading?: boolean;
}

export default function AddEditVendorModal({
    isOpen,
    onClose,
    onSubmit,
    vendor,
    mode,
    loading = false
}: AddEditVendorModalProps) {
    const [categories, setCategories] = useState<string[]>([]);
    const [formData, setFormData] = useState<CreateVendorRequest>({
        vendor_name: '',
        contact_person: '',
        email: '',
        phone: '',
        address: '',
        tax_id: '',
        payment_terms: '',
        category: ''
    });

    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        if (vendor && mode === 'edit') {
            setFormData({
                vendor_name: vendor.vendor_name,
                contact_person: vendor.contact_person,
                email: vendor.email,
                phone: vendor.phone,
                address: vendor.address || '',
                tax_id: vendor.tax_id || '',
                payment_terms: vendor.payment_terms || '',
                category: vendor.category || ''
            });
        } else {
            resetForm();
        }
    }, [vendor, mode]);

    const loadCategories = async () => {
        try {
            const data = await getVendorCategories();
            setCategories(data);
        } catch (error) {
            console.error('Failed to load categories:', error);
            setCategories([]);
        }
    };

    const resetForm = () => {
        setFormData({
            vendor_name: '',
            contact_person: '',
            email: '',
            phone: '',
            address: '',
            tax_id: '',
            payment_terms: '',
            category: ''
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.vendor_name || !formData.contact_person || !formData.email || !formData.phone) {
            alert('Please fill in all required fields');
            return;
        }
        onSubmit(formData);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    if (!isOpen) return null;

    return createPortal(
        <ModalWrapper>
            <div className="rounded-32 max-md:rounded-24 bg-bgSec relative flex max-h-full w-full max-w-600 flex-col overflow-hidden">
                <div className="border-linePr flex items-center justify-between border-b p-24">
                    <h3 className="text-h5 font-medium text-textHeadline">
                        {mode === 'add' ? 'Add New Vendor' : 'Edit Vendor'}
                    </h3>
                    <button
                        className="bg-bgPr hover:shadow-s1 border-linePr rounded-12 text-textHeadline flex size-40 cursor-pointer items-center justify-center border duration-300"
                        onClick={handleClose}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-24">
                    <div className="space-y-24">
                        {/* Vendor Name */}
                        <div>
                            <label className="text-body-m text-textHeadline mb-8 block">
                                Vendor Name *
                            </label>
                            <input
                                type="text"
                                value={formData.vendor_name}
                                onChange={(e) => setFormData({ ...formData, vendor_name: e.target.value })}
                                className="bg-bgNavigate border-linePr text-body-m text-textPr placeholder:text-textSecondary w-full border rounded-12 h-48 px-16 font-medium duration-300 outline-none focus:border-[#E2E2E2] focus:bg-[#F1F1F1]"
                                placeholder="Enter vendor name"
                                required
                            />
                        </div>

                        {/* Contact Person */}
                        <div>
                            <label className="text-body-m text-textHeadline mb-8 block">
                                Contact Person *
                            </label>
                            <input
                                type="text"
                                value={formData.contact_person}
                                onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                                className="bg-bgNavigate border-linePr text-body-m text-textPr placeholder:text-textSecondary w-full border rounded-12 h-48 px-16 font-medium duration-300 outline-none focus:border-[#E2E2E2] focus:bg-[#F1F1F1]"
                                placeholder="Enter contact person name"
                                required
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="text-body-m text-textHeadline mb-8 block">
                                Email *
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="bg-bgNavigate border-linePr text-body-m text-textPr placeholder:text-textSecondary w-full border rounded-12 h-48 px-16 font-medium duration-300 outline-none focus:border-[#E2E2E2] focus:bg-[#F1F1F1]"
                                placeholder="Enter email address"
                                required
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="text-body-m text-textHeadline mb-8 block">
                                Phone *
                            </label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="bg-bgNavigate border-linePr text-body-m text-textPr placeholder:text-textSecondary w-full border rounded-12 h-48 px-16 font-medium duration-300 outline-none focus:border-[#E2E2E2] focus:bg-[#F1F1F1]"
                                placeholder="Enter phone number"
                                required
                            />
                        </div>

                        {/* Address */}
                        <div>
                            <label className="text-body-m text-textHeadline mb-8 block">
                                Address
                            </label>
                            <textarea
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                rows={3}
                                className="bg-bgNavigate border-linePr text-body-m text-textPr placeholder:text-textSecondary w-full border rounded-12 px-16 py-12 font-medium duration-300 outline-none focus:border-[#E2E2E2] focus:bg-[#F1F1F1]"
                                placeholder="Enter address"
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="text-body-m text-textHeadline mb-8 block">
                                Category
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="bg-bgNavigate border-linePr text-body-m text-textPr w-full border rounded-12 h-48 px-16 font-medium duration-300 outline-none focus:border-[#E2E2E2] focus:bg-[#F1F1F1]"
                            >
                                <option value="">Select category</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Tax ID */}
                        <div>
                            <label className="text-body-m text-textHeadline mb-8 block">
                                Tax ID
                            </label>
                            <input
                                type="text"
                                value={formData.tax_id}
                                onChange={(e) => setFormData({ ...formData, tax_id: e.target.value })}
                                className="bg-bgNavigate border-linePr text-body-m text-textPr placeholder:text-textSecondary w-full border rounded-12 h-48 px-16 font-medium duration-300 outline-none focus:border-[#E2E2E2] focus:bg-[#F1F1F1]"
                                placeholder="Enter tax ID"
                            />
                        </div>

                        {/* Payment Terms */}
                        <div>
                            <label className="text-body-m text-textHeadline mb-8 block">
                                Payment Terms
                            </label>
                            <select
                                value={formData.payment_terms}
                                onChange={(e) => setFormData({ ...formData, payment_terms: e.target.value })}
                                className="bg-bgNavigate border-linePr text-body-m text-textPr w-full border rounded-12 h-48 px-16 font-medium duration-300 outline-none focus:border-[#E2E2E2] focus:bg-[#F1F1F1]"
                            >
                                <option value="">Select payment terms</option>
                                <option value="Net 15">Net 15</option>
                                <option value="Net 30">Net 30</option>
                                <option value="Net 45">Net 45</option>
                                <option value="Net 60">Net 60</option>
                                <option value="Due on Receipt">Due on Receipt</option>
                            </select>
                        </div>

                        <div className="flex gap-12 pt-16">
                            <Button
                                type="button"
                                style="transparent"
                                onClick={handleClose}
                                className="flex-1"
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1"
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : mode === 'add' ? 'Add Vendor' : 'Update Vendor'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </ModalWrapper>,
        document.querySelector('#root')!
    );
} 