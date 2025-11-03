import { useState } from 'react';
import Button from '../Button';

interface CreateProjectModalProps {
    onClose: () => void;
    onCreate: (data: {
        title: string;
        metadata: {
            subject?: string;
            course?: string;
            goal?: string;
            deadline?: string;
            description?: string;
        };
    }) => Promise<void>;
}

export default function CreateProjectModal({ onClose, onCreate }: CreateProjectModalProps) {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        subject: '',
        course: '',
        goal: 'UNDERSTAND_CONCEPT',
        deadline: '',
        description: '',
    });

    const goals = [
        { value: 'UNDERSTAND_CONCEPT', label: 'Understand a difficult concept' },
        { value: 'TEST_PREP', label: 'Prepare for a test' },
        { value: 'ASSIGNMENT', label: 'Complete an assignment' },
    ];

    const handleNext = () => {
        if (step === 1 && !formData.title.trim()) {
            alert('Please enter a project title');
            return;
        }
        if (step < 3) {
            setStep(step + 1);
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const handleSubmit = async () => {
        if (!formData.title.trim()) {
            alert('Please enter a project title');
            return;
        }

        try {
            setLoading(true);
            await onCreate({
                title: formData.title.trim(),
                metadata: {
                    subject: formData.subject || undefined,
                    course: formData.course || undefined,
                    goal: formData.goal,
                    deadline: formData.deadline || undefined,
                    description: formData.description || undefined,
                },
            });
            onClose();
        } catch (error) {
            console.error('Error creating project:', error);
            alert('Failed to create project. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-20 p-24 max-w-2xl w-full max-h-[90vh] overflow-y-auto mx-16">
                <div className="flex items-center justify-between mb-24">
                    <h2 className="text-h3 font-semibold">Create New Learning Project</h2>
                    <button
                        onClick={onClose}
                        className="text-textSecondary hover:text-textHeadline text-24"
                    >
                        ×
                    </button>
                </div>

                {/* Progress indicator */}
                <div className="flex items-center gap-8 mb-24">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center">
                            <div
                                className={`w-32 h-32 rounded-full flex items-center justify-center text-14 font-medium ${step >= s
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-500'
                                    }`}
                            >
                                {s}
                            </div>
                            {s < 3 && (
                                <div
                                    className={`w-48 h-2 ${step > s ? 'bg-blue-500' : 'bg-gray-200'
                                        }`}
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* Step 1: Project Title */}
                {step === 1 && (
                    <div>
                        <label className="block text-body-m font-medium mb-12">
                            Project Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g., Learning Integrals, Q3 History Paper"
                            className="w-full px-16 py-12 border border-gray-300 rounded-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                        />
                        <p className="text-textSecondary text-14 mt-8">
                            Give your learning project a clear, descriptive name
                        </p>
                    </div>
                )}

                {/* Step 2: Subject & Course */}
                {step === 2 && (
                    <div className="space-y-16">
                        <div>
                            <label className="block text-body-m font-medium mb-12">
                                Subject/Course (Optional)
                            </label>
                            <input
                                type="text"
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                placeholder="e.g., Math - CS401"
                                className="w-full px-16 py-12 border border-gray-300 rounded-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-body-m font-medium mb-12">
                                Learning Objective <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.goal}
                                onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                                className="w-full px-16 py-12 border border-gray-300 rounded-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {goals.map((goal) => (
                                    <option key={goal.value} value={goal.value}>
                                        {goal.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}

                {/* Step 3: Timeline & Description */}
                {step === 3 && (
                    <div className="space-y-16">
                        <div>
                            <label className="block text-body-m font-medium mb-12">
                                Deadline (Optional)
                            </label>
                            <input
                                type="date"
                                value={formData.deadline}
                                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                className="w-full px-16 py-12 border border-gray-300 rounded-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-textSecondary text-14 mt-8">
                                e.g., I need to learn this by next Friday
                            </p>
                        </div>
                        <div>
                            <label className="block text-body-m font-medium mb-12">
                                Description (Optional)
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Additional context about your learning goals..."
                                rows={4}
                                className="w-full px-16 py-12 border border-gray-300 rounded-12 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            />
                        </div>
                    </div>
                )}

                {/* Buttons */}
                <div className="flex items-center justify-between mt-32 pt-24 border-t">
                    <Button
                        style="gray"
                        onClick={step === 1 ? onClose : handleBack}
                        disabled={loading}
                    >
                        {step === 1 ? 'Cancel' : 'Back'}
                    </Button>
                    <Button
                        onClick={step === 3 ? handleSubmit : handleNext}
                        disabled={loading}
                    >
                        {loading ? 'Creating...' : step === 3 ? 'Create Project' : 'Next'}
                    </Button>
                </div>
            </div>
        </div>
    );
}

