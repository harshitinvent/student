import { useState, useEffect } from 'react';
import Button from '../shared/Button';
import CheckmarkIcon from '../shared/icons/CheckmarkIcon';

export type Amenity = {
  id: string;
  title: string;
  iconUrl?: string;
  canceled?: boolean;
  selected?: boolean;
};

export default function AmenitiesManager({
  amenities,
  onChange,
  className = '',
}: {
  amenities: Amenity[];
  onChange: (next: Amenity[]) => void;
  className?: string;
}) {
  const [localAmenities, setLocalAmenities] = useState<Amenity[]>(amenities);

  // Initialize local amenities when amenities prop changes
  useEffect(() => {
    setLocalAmenities(amenities);
  }, [amenities]);

  const addAmenity = () => {
    const id = crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
    const newAmenity = { id, title: 'New amenity' };
    const updatedAmenities = [...localAmenities, newAmenity];
    setLocalAmenities(updatedAmenities);
    onChange(updatedAmenities);
  };

  const updateAmenity = (id: string, patch: Partial<Amenity>) => {
    const updatedAmenities = localAmenities.map((a) =>
      a.id === id ? { ...a, ...patch } : a
    );
    setLocalAmenities(updatedAmenities);
    onChange(updatedAmenities);
  };

  const removeAmenity = (id: string) => {
    const updatedAmenities = localAmenities.filter((a) => a.id !== id);
    setLocalAmenities(updatedAmenities);
    onChange(updatedAmenities);
  };

  const chooseAmenity = (id: string) => {
    const updatedAmenities = localAmenities.map((a) =>
      a.id === id ? { ...a, selected: !a.selected } : a
    );

    // Update local state
    setLocalAmenities(updatedAmenities);

    // Pass all amenities to parent (with updated selection state)
    onChange(updatedAmenities);
  };

  // Get selected amenities count for display
  const selectedCount = localAmenities.filter((a) => a.selected).length;

  return (
    <div className={className}>
      <div className={'grid gap-12 md:grid-cols-2'}>
        {localAmenities.map((a) => (
          <div
            key={a.id}
            className={
              'rounded-12 bg-bgSec border-linePr flex items-center justify-between gap-12 border p-8'
            }
          >
            <div className={'flex flex-1 items-center gap-8'}>
              {a.iconUrl && (
                <img
                  src={a.iconUrl}
                  alt="icon"
                  className={'size-20 object-contain'}
                />
              )}

              <p>{a.title}</p>
            </div>
            <CheckmarkIcon
              active={!!a.selected}
              onClick={() => chooseAmenity(a.id)}
            />
          </div>
        ))}
      </div>

      <div className={'mt-16 flex items-center gap-12'}>
        <Button onClick={addAmenity}>Add New</Button>
      </div>

      {/* Show selected amenities count */}
      {selectedCount > 0 && (
        <div className="rounded-8 mt-12 border border-blue-200 bg-blue-50 p-8">
          <p className="text-12 text-blue-700">
            Selected: {selectedCount} amenit
            {selectedCount === 1 ? 'y' : 'ies'}
          </p>
        </div>
      )}
    </div>
  );
}
