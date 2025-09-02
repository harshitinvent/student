import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import PageTitleArea from '../../components/shared/PageTitleArea';
import Button from '../../components/shared/Button';
import StatusTag from '../../components/shared/StatusTag';
import IconButton from '../../components/shared/IconButton';
import CatalogCard from '../../components/shared/CatalogCard';
import { GridViewIcon, Menu01Icon } from '@hugeicons/core-free-icons';
import AddEditRoomModal, { type RoomFormValues } from './AddEditRoomModal';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';

type StudentAssignment = {
  id: string;
  name: string;
  studentId: string;
  preference: string;
};

type HousingOffer = {
  id: string;
  name: string;
  studentId: string;
  room: string;
  type: string;
  due: string;
  status: 'Pending Response' | 'Accepted' | 'Declined';
};

type RoomInventoryItem = {
  id: number;
  building: string;
  room_id: string;
  type: 'Single' | 'Double';
  capacity: number;
  occupied: string;
  status: 'AVAILABLE' | 'NOT AVAILABLE';
  price: number;
  imgUrl: string;
  occupiedBy?: string | null;
  amenities: any[];
};

const pendingAssignments: StudentAssignment[] = [
  {
    id: 'a1',
    name: 'John Doe',
    studentId: '20250001',
    preference: 'Prefers: Maple Hall / Double',
  },
  {
    id: 'a2',
    name: 'John Doe',
    studentId: '20250001',
    preference: 'Prefers: Maple Hall / Double',
  },
];

const activeOffers: HousingOffer[] = [
  {
    id: 'o1',
    name: 'Sarah Wilson',
    studentId: '20250001',
    room: 'Oak Residence 301B',
    type: 'Double',
    due: '15/08/2025',
    status: 'Pending Response',
  },
];

export default function AccommodationsPage() {
  // --------------- constants --------------
  const [inventoryView, setInventoryView] = useState<'grid' | 'table'>('grid');
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<RoomInventoryItem[]>([]);

  // ----------------- Handlers -----------------
  const getRooms = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/rooms`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setRooms(response.data.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      throw error;
    }
  };

  useEffect(() => {
    getRooms();
  }, []);
  return (
    <div className={'relative pb-32'}>
      <div className={'px-24 max-md:px-16'}>
        {/* Room Inventory Section */}
        <div className={'rounded-20 border-linePr bg-bgSec mt-16 border p-16'}>
          <div className={'flex items-center justify-between'}>
            <div>
              <h3 className={'text-textHeadline text-16 font-semibold'}>
                Room Inventory
              </h3>
              <p className={'text-textDescription text-14'}>
                View and manage room availability
              </p>
            </div>
            <div className={'flex items-center gap-8'}>
              <IconButton
                active={inventoryView === 'grid'}
                icon={GridViewIcon}
                onClick={() => setInventoryView('grid')}
              />
              <IconButton
                active={inventoryView === 'table'}
                icon={Menu01Icon}
                onClick={() => setInventoryView('table')}
              />
            </div>
          </div>

          {inventoryView === 'table' ? (
            <div className={'mt-12 overflow-auto'}>
              <table className={'w-full min-w-[720px] border-collapse'}>
                <thead>
                  <tr className={'text-textDescription text-12 text-left'}>
                    <th className={'px-12 py-8'}>Building</th>
                    <th className={'px-12 py-8'}>Room</th>
                    <th className={'px-12 py-8'}>Type</th>
                    <th className={'px-12 py-8'}>Capacity</th>
                    <th className={'px-12 py-8'}>Occupied</th>
                    <th className={'px-12 py-8'}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms?.map((r) => (
                    <tr
                      key={`room-${r.id}`}
                      className={
                        'border-linePr hover:bg-bgNavigate cursor-pointer border-t'
                      }
                      onClick={() => navigate(`/accommodation/${r.id}`)}
                    >
                      <td className={'text-textHeadline text-14 px-12 py-10'}>
                        {r.building}
                      </td>
                      <td className={'text-textHeadline text-14 px-12 py-10'}>
                        {r.room_id}
                      </td>
                      <td className={'text-textHeadline text-14 px-12 py-10'}>
                        {r.type}
                      </td>
                      <td className={'text-textHeadline text-14 px-12 py-10'}>
                        {r.capacity}
                      </td>
                      <td className={'text-textHeadline text-14 px-12 py-10'}>
                        {r.occupied}
                      </td>
                      <td className={'px-12 py-10'}>
                        {r.status === 'AVAILABLE' ? (
                          <StatusTag status={'success'}>Available</StatusTag>
                        ) : (
                          <StatusTag status={'error'}>Not Available</StatusTag>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className={'mt-12 grid gap-12 md:grid-cols-4'}>
              {rooms?.map((r) => (
                <CatalogCard
                  key={`card-${r.id}`}
                  to={`/accommodation/${r.id}`}
                  imgUrl={r.imgUrl}
                  title={`ID ${r.room_id}`}
                  subtitle={'Room Type:'}
                  info={r.type}
                  forSaving={false}
                  isListType={false}
                  // status={r.status === 'Available' ? 'success' : 'error'}
                >
                  <div
                    className={'mt-12 flex items-center justify-between gap-12'}
                  >
                    <StatusTag
                      icon={true}
                      status={r.status === 'AVAILABLE' ? 'success' : 'error'}
                    >
                      {r.status === 'AVAILABLE' ? 'Available' : 'Occupied'}
                    </StatusTag>
                    <p className={'text-textHeadline text-body-l font-medium'}>
                      {r.occupiedBy ? r.occupiedBy : '-'}
                    </p>
                  </div>
                  <p className={'mt-12 flex items-center justify-start gap-8'}>
                    <strong className={'text-h6 text-textHeadline font-medium'}>
                      ${r.price}
                    </strong>
                    <span className={'text-body-l text-textDescription'}>
                      {' / '}
                    </span>
                    <span className={'text-body-l text-textDescription'}>
                      Month
                    </span>
                  </p>
                </CatalogCard>
              ))}
            </div>
          )}
        </div>
      </div>

      <AddEditRoomModal
        isOpen={isRoomModalOpen}
        onClose={() => setIsRoomModalOpen(false)}
        onSubmit={(values: RoomFormValues) => {
          // TODO: integrate API. For now, just log.
          // eslint-disable-next-line no-console
        }}
      />
    </div>
  );
}

function SummaryCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: number;
  subtitle: string;
}) {
  return (
    <div className={'rounded-20 border-linePr bg-bgSec border p-16'}>
      <p className={'text-textDescription text-12'}>{title}</p>
      <div className={'mt-8 flex items-end gap-8'}>
        <span className={'text-textHeadline text-h5 font-semibold'}>
          {value}
        </span>
      </div>
      <p className={'text-textDescription text-12 mt-8'}>{subtitle}</p>
    </div>
  );
}
