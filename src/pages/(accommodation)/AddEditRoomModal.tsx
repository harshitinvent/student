import { useEffect, useState } from 'react';
import ModalWrapper from '../../components/shared/wrappers/ModalWrapper';
import PopUpWrapper from '../../components/shared/wrappers/PopUpWrapper';
import Button from '../../components/shared/Button';
import AmenitiesManager, {
  type Amenity,
} from '../../components/features/AmenitiesManager';
import { roomsAPI, type CreateRoomRequest } from '../../services/roomsAPI';
import Dropdown from '../../components/shared/Dropdown';
import { IAmenityResponse } from '../../types/accomodations';
import { amenitiesAPI } from '../../services/amenitiesAPI';

export type RoomFormValues = {
  building: string;
  room: string;
  type: 'Single' | 'Double';
  capacity: number;
  price: number;
  amenities?: Amenity[];
};

export default function AddEditRoomModal({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: RoomFormValues) => void;
  initialValues?: Partial<RoomFormValues>;
}) {
  const [values, setValues] = useState<RoomFormValues>({
    building: initialValues?.building || '',
    room: initialValues?.room || '',
    type: (initialValues?.type as 'Single' | 'Double') || 'Single',
    capacity: initialValues?.capacity || 1,
    price: initialValues?.price || 0,
    amenities: initialValues?.amenities || [],
  });
  //---------- constants ------------
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableAmenities, setAvailableAmenities] = useState<any[]>([]);
  const [buildings, setBuildings] = useState<any[]>([]);

  const fetchAmenities = async () => {
    const response = await amenitiesAPI.getAmenities(0, 0);
    const formattedResponse = response.data.map(
      (amenity: IAmenityResponse) => ({
        id: amenity.id,
        title: amenity.name,
        iconUrl: amenity.url,
        selected: false, // Initialize as not selected
      })
    );
    setAvailableAmenities(formattedResponse);
  };

  const fetchBuildings = async () => {
    const response = await roomsAPI.getBuildings();
    const campuses = response.campuses.map((building: any) => building.name);
    setBuildings(campuses);
  };

  //---------- useEffect ------------
  useEffect(() => {
    fetchAmenities();
    fetchBuildings();
  }, []);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      setError(null);

      // Extract only the IDs of selected amenities
      const amenitiesIds = values.amenities?.map((amenity) => amenity.id) || [];

      const payload: CreateRoomRequest = {
        building: values.building,
        roomId: values.room,
        type: values.type,
        capacity: values.capacity,
        price: values.price,
        amenities: amenitiesIds, // Send only the IDs array
      };

      const result = await roomsAPI.createRoom(payload);
      onSubmit(values);
      onClose();
    } catch (e: any) {
      setError(e?.message || 'Failed to create room');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAmenitiesChange = (updatedAmenities: Amenity[]) => {
    // Extract only the selected amenities for the form values
    const selectedAmenities = updatedAmenities.filter((a) => a.selected);
    setValues({ ...values, amenities: selectedAmenities });
  };

  return (
    <ModalWrapper>
      <PopUpWrapper
        className={'max-h-[80vh] w-full max-w-560 overflow-y-auto p-20'}
      >
        <div
          className={
            'bg-bgPr sticky top-0 flex items-center justify-between pb-12'
          }
        >
          <h3 className={'text-textHeadline text-18 font-semibold'}>
            {initialValues ? 'Edit Room' : 'Add Room'}
          </h3>
          <button
            className={'rounded-10 hover:bg-bgNavigate size-32'}
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {error && (
          <div
            className={
              'rounded-12 mb-12 border border-[#ffd6d6] bg-[#fff1f1] p-12 text-[#a30000]'
            }
          >
            {error}
          </div>
        )}

        <div className={'mt-16 grid gap-12'}>
          <label className={'grid gap-6'}>
            <span className={'text-textDescription text-12'}>Building</span>
            <Dropdown
              list={buildings}
              direction="down"
              value={values.building}
              onChange={(val) => setValues({ ...values, building: val || '' })}
            ></Dropdown>
          </label>
          <label className={'grid gap-6'}>
            <span className={'text-textDescription text-12'}>Room ID</span>
            <input
              className={
                'rounded-12 bg-bgSec border-linePr h-40 border px-12 outline-none'
              }
              value={values.room}
              onChange={(e) => setValues({ ...values, room: e.target.value })}
              placeholder={'101A'}
            />
          </label>
          <label className={'grid gap-6'}>
            <span className={'text-textDescription text-12'}>Type</span>
            <select
              className={
                'rounded-12 bg-bgSec border-linePr h-40 border px-12 outline-none'
              }
              value={values.type}
              onChange={(e) =>
                setValues({
                  ...values,
                  type: e.target.value as 'Single' | 'Double',
                })
              }
            >
              <option value={'Single'}>Single</option>
              <option value={'Double'}>Double</option>
            </select>
          </label>
          <label className={'grid gap-6'}>
            <span className={'text-textDescription text-12'}>Capacity</span>
            <input
              type={'number'}
              min={1}
              className={
                'rounded-12 bg-bgSec border-linePr h-40 border px-12 outline-none'
              }
              value={values.capacity}
              onChange={(e) =>
                setValues({ ...values, capacity: Number(e.target.value) })
              }
            />
          </label>
          <label className={'grid gap-6'}>
            <span className={'text-textDescription text-12'}>
              Price (per month)
            </span>
            <input
              type={'number'}
              min={0}
              className={
                'rounded-12 bg-bgSec border-linePr h-40 border px-12 outline-none'
              }
              value={values.price}
              onChange={(e) =>
                setValues({ ...values, price: Number(e.target.value) })
              }
            />
          </label>
        </div>

        <div className={'mt-16'}>
          <h4 className={'text-textHeadline text-16 mb-8 font-semibold'}>
            What this place offers
          </h4>
          <AmenitiesManager
            amenities={availableAmenities || []}
            onChange={handleAmenitiesChange}
          />
        </div>

        <div
          className={
            'bg-bgPr sticky bottom-0 mt-20 flex items-center justify-end gap-8 pt-12'
          }
        >
          <Button
            style={'gray-border'}
            onClick={() => {
              if (!isSubmitting) onClose();
            }}
            className={isSubmitting ? 'pointer-events-none opacity-60' : ''}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className={isSubmitting ? 'pointer-events-none opacity-60' : ''}
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </PopUpWrapper>
    </ModalWrapper>
  );
}
