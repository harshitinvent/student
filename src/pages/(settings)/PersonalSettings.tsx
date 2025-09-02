import { useEffect, useState } from 'react';
import SettingValue from '../../components/shared/SettingsValue';
import SettingsWrapper from '../../components/shared/wrappers/SettingsWrapper';
import Button from '../../components/shared/Button';
import { UserType } from '../../types/user';
import ChangePasswordModal from '../../components/shared/modals/ChangePasswordModal';

const API_BASE = 'http://103.189.173.7:8080/api/profile';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function fetchProfile(): Promise<UserType> {
  const res = await fetch(API_BASE, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch profile');
  const data = await res.json();
  // If your API returns { data: { ...user } }, adjust accordingly:
  return data.data || data;
}

async function updateProfile(data: Partial<UserType>) {
  const res = await fetch(API_BASE, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update profile');
  return res.json();
}

export default function PersonalSettings() {
  const [profile, setProfile] = useState(null);
  const [editProfile, setEditProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchProfile()
      .then((data) => {
        setProfile(data);
        setEditProfile({});
        setError(null);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleFieldChange = (field: keyof UserType, value: any) => {
    setEditProfile((prev) => ({ ...prev, [field]: value }));
    setSuccess(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const updated = await updateProfile(editProfile);
      setProfile((prev) => ({ ...prev!, ...editProfile }));
      setEditProfile({});
      setSuccess('Profile updated successfully!');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-red-500 text-center">{error}</div>;
  if (!profile) return null;

  return (
    <div className={'flex flex-col items-center'}>
      <SettingsWrapper
        title={'Personal Info'}
        subtitle={'Manage your account information.'}
      >
        <div className={'w-full overflow-hidden'}>
          <div className={'border-linePr flex min-h-50 items-center border-b py-8 max-md:px-8'}>
            <SettingValue
              type={'input'}
              value={editProfile.name ?? profile.name}
              onChange={(value) => handleFieldChange('name', value)}
              label={'First name'}
              changeable={true}
            />
          </div>
          {/* <div className={'border-linePr flex min-h-50 items-center border-b py-8 max-md:px-8'}>
            <SettingValue
              type={'input'}
              value={editProfile.last_name ?? profile.last_name}
              onChange={(value) => handleFieldChange('last_name', value)}
              label={'Last name'}
              changeable={true}
            />
          </div> */}
          <div className={'border-linePr flex min-h-50 items-center border-b py-8 max-md:px-8'}>
            <SettingValue
              type={'input'}
              value={profile.email}
              label={'Email'}
              disabled
            />
          </div>

          <div className={'border-linePr flex min-h-50 items-center border-b py-8 max-md:px-8'}>
            <SettingValue
              label={'Change Password'}
              description={'Update your account password.'}
            >
              <Button
                style={'gray'}
                onClick={() => setChangePasswordModalOpen(true)}
              >
                Change Password
              </Button>
            </SettingValue>
          </div>

          {/* Add more fields as needed, e.g. phone, avatar, etc. */}
          {success && <div className="text-green-600 px-8 py-2">{success}</div>}
          {Object.keys(editProfile).length > 0 && (
            <div className="flex justify-end px-8 py-4">
              <button
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>
      </SettingsWrapper>

      <ChangePasswordModal
        open={changePasswordModalOpen}
        onClose={() => setChangePasswordModalOpen(false)}
      />
    </div>
  );
}
