import { useNavigate } from 'react-router';
import Button from '../../shared/Button';

export default function DepartmentsSection() {
    const navigate = useNavigate();
    return (
        <div className="bg-white p-6 rounded shadow mb-4">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-bold">Departments</h2>
                <Button onClick={() => navigate('/departments')}>Manage Departments</Button>
            </div>
            <p className="text-sm text-gray-600">Add, edit, activate/deactivate, or delete departments for your organization.</p>
        </div>
    );
} 