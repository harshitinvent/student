import { Link, useParams } from 'react-router';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft02Icon } from '@hugeicons/core-free-icons';
import { useState, useEffect, useMemo } from 'react';

import PageTitleArea from '../../components/shared/PageTitleArea';
import Button from '../../components/shared/Button';
import CustomIcon from '../../components/shared/icons/CustomIcon';
import Dropdown from '../../components/shared/Dropdown';
import Date from '../../components/shared/form-elements/Date';
import { BgColorsOutlined, EditOutlined } from '@ant-design/icons';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { roomsAPI } from '../../services/roomsAPI';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import AccordionDetails from '@mui/material/AccordionDetails';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// Calendar data
const weekDays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const weekDaysLong = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Mini calendar data
const miniCalendarDays = [
  ...Array.from({ length: 31 }, (_, i) => ({
    day: i + 1,
    currentMonth: true,
  })),
  ...Array.from({ length: 11 }, (_, i) => ({
    day: i + 1,
    currentMonth: false,
  })),
];

// Days with events in mini calendar
const daysWithEvents = [4, 17, 18];

export default function AccommodationPage() {
  const { id } = useParams<{ id: string }>();
  const [roomData, setRoomData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [guestLabel, setGuestLabel] = useState<string | null>('1 guest');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reservationStatusLocal, setReservationStatusLocal] =
    useState<string>('');
  const guests = useMemo(() => {
    if (!guestLabel) return 0;
    const match = guestLabel.match(/^(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }, [guestLabel]);

  const isValid = useMemo(() => {
    if (!checkIn || !checkOut) return false;
    if (!guests || guests < 1) return false;
    if (checkOut <= checkIn) return false;
    if (roomData && roomData.capacity && guests > roomData.capacity)
      return false;
    return true;
  }, [checkIn, checkOut, guests, roomData]);

  const effectiveReservationStatus = (
    reservationStatusLocal ||
    roomData?.reservation_status ||
    ''
  ).trim();
  const hasReservationStatus = effectiveReservationStatus.length > 0;
  const statusTextMap: Record<string, string> = {
    PENDING: 'Pending',
    APPROVED: 'Approved',
    REJECTED: 'Rejected',
  };
  const isReserveDisabled = !isValid || isSubmitting || hasReservationStatus;

  const handleReserve = async () => {
    if (!id || !isValid || !checkIn || !checkOut) return;
    try {
      setIsSubmitting(true);
      const payload = {
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
        guests,
        roomId: id,
      };

      const reservation = await roomsAPI.reserveRoom(id, payload as any);
      const statusRaw =
        (reservation &&
          reservation.data &&
          (reservation.data.reservation_status ?? reservation.data.status)) ??
        reservation?.reservation_status ??
        reservation?.status ??
        '';
      const normalizedStatus =
        typeof statusRaw === 'string' ? statusRaw.trim() : '';
      if (normalizedStatus) {
        setReservationStatusLocal(normalizedStatus);
      }
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };
  useEffect(() => {
    const fetchRoomData = async () => {
      if (id) {
        try {
          setLoading(true);
          const room = await roomsAPI.getRoomById(id);
          setRoomData(room.data || []);
        } catch (error) {
          console.error('Error fetching room data:', error);
          // Fallback to mock data if API fails
          setRoomData({
            id,
            building: 'Campus 1',
            roomId: '101A',
            type: 'Single',
            capacity: 1,
            price: 500,
            amenities: [
              { id: '1', title: 'Wifi', iconUrl: '/pic/services/wifi.png' },
              {
                id: '2',
                title: 'Kitchen',
                iconUrl: '/pic/services/kitchen.png',
              },
              { id: '3', title: 'TV', iconUrl: '/pic/services/tv.png' },
            ],
          });
        } finally {
          setLoading(false);
        }
      }
    };

    fetchRoomData();
  }, [id]);

  if (loading) {
    return <div className="p-48">Loading room details...</div>;
  }

  if (!roomData) {
    return <div className="p-48">Room not found</div>;
  }

  return (
    <div>
      <PageTitleArea>
        <div className={'flex items-center gap-6'}>
          <Link
            to={'/accommodations'}
            className={
              'rounded-10 bg-bgNavigate text-iconSec hover:bg-bgSec hover:shadow-s1 flex size-40 cursor-pointer items-center justify-center duration-300'
            }
          >
            <HugeiconsIcon className={'size-20'} icon={ArrowLeft02Icon} />
          </Link>
          <h1 className={'text-textHeadline text-h5 font-medium'}>
            {roomData.building} - Room {roomData.room_id}
          </h1>
        </div>
      </PageTitleArea>

      {/* Input Fields Section */}
      <div className="px-48 pt-16 max-md:px-16">
        <div className="flex gap-16 max-md:flex-col max-md:gap-12">
          {/* First Field - Lecture Name with person icon */}
          <div className="flex-1">
            <div className="relative">
              <div className="rounded-12 flex cursor-pointer items-center gap-8 border border-gray-200 bg-gray-100 px-16 py-12 transition-colors hover:bg-gray-50">
                <svg
                  className="h-20 w-20 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="text-14 font-medium text-gray-700">
                  Lecture Name
                </span>
                <svg
                  className="ml-auto h-16 w-16 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Second Field - Course ID without person icon */}
          <div className="flex-1">
            <div className="relative">
              <div className="rounded-12 flex cursor-pointer items-center gap-8 border border-gray-200 bg-gray-100 px-16 py-12 transition-colors hover:bg-gray-50">
                <span className="text-14 font-medium text-gray-700">
                  Course ID
                </span>
                <svg
                  className="ml-auto h-16 w-16 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Third Field - Lecture Name with person icon */}
          <div className="flex-1">
            <div className="relative">
              <div className="rounded-12 flex cursor-pointer items-center gap-8 border border-gray-200 bg-gray-100 px-16 py-12 transition-colors hover:bg-gray-50">
                <svg
                  className="h-20 w-20 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="text-14 font-medium text-gray-700">
                  Lecture Name
                </span>
                <svg
                  className="ml-auto h-16 w-16 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Fourth Field - Lecture Name with person icon */}
          <div className="flex-1">
            <div className="relative">
              <div className="rounded-12 flex cursor-pointer items-center gap-8 border border-gray-200 bg-gray-100 px-16 py-12 transition-colors hover:bg-gray-50">
                <svg
                  className="h-20 w-20 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="text-14 font-medium text-gray-700">
                  Lecture Name
                </span>
                <svg
                  className="ml-auto h-16 w-16 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course announcements section and pols section */}
      <div className="px-48 pt-16 max-md:px-16">
        <div className="flex gap-16 max-md:flex-col max-md:gap-12">
          {/* Course Announcements Card */}
          <div className="flex-1">
            <div className="rounded-12 cursor-pointer border border-gray-200 bg-gray-100 px-16 py-12 transition-colors hover:bg-gray-50">
              <div className="flex items-center gap-12">
                <div className="relative">
                  <svg
                    className="h-20 w-20 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                  <div className="absolute inset-0 rounded-full bg-green-100 opacity-30"></div>
                </div>
                <span className="text-14 font-medium text-gray-900">
                  Course announcements
                </span>
              </div>
            </div>
          </div>

          {/* Pols Card */}
          <div className="flex-1">
            <div className="rounded-12 cursor-pointer border border-gray-200 bg-gray-100 px-16 py-12 transition-colors hover:bg-gray-50">
              <div className="flex items-center gap-12">
                <div className="relative">
                  <svg
                    className="h-20 w-20 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  <div className="absolute inset-0 rounded-full bg-green-100 opacity-30"></div>
                </div>
                <span className="text-14 font-medium text-gray-900">Pols</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Current Resident */}
      <div className="mx-48 mt-16">
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
            className="bg-transparent"
          >
            <Typography>Current Resident</Typography>
          </AccordionSummary>
          <AccordionDetails>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas est
            temporibus deleniti consequuntur laborum possimus laboriosam ex hic,
            nulla magni eveniet reiciendis ratione esse beatae.
          </AccordionDetails>
        </Accordion>
      </div>
      {/* Resident history */}
      <div className="mx-48 mt-16">
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
            className="bg-transparent"
          >
            <Typography>Resident History</Typography>
          </AccordionSummary>
          <AccordionDetails>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas est
            temporibus deleniti consequuntur laborum possimus laboriosam ex hic,
            nulla magni eveniet reiciendis ratione esse beatae.
          </AccordionDetails>
        </Accordion>
      </div>
      {/* Room Information Section */}
      <div className="mx-48 mt-16">
        <Accordion defaultExpanded sx={{ backgroundColor: 'bg-gray-100' }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
            className="bg-transparent"
          >
            <Typography component="span">Description</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className={'px-48 pt-16 pb-32 max-md:px-16 max-md:pb-24'}>
              <div>
                <h2
                  className={
                    'text-h6 text-textHeadline max-md:text-18 font-medium max-md:font-semibold'
                  }
                >
                  {roomData.type} Room in {roomData.building}
                </h2>
                <p className={'text-16 text-textHeadline mt-8'}>
                  {roomData.capacity} guest{roomData.capacity > 1 ? 's' : ''} ·{' '}
                  {roomData.type} room · ${roomData.price}/month
                </p>
              </div>

              <div
                className={'mt-32 items-start justify-between gap-48 md:flex'}
              >
                <div className={'w-full max-w-662'}>
                  <h3 className={'text-18 font-semibold'}>
                    What this place offers
                  </h3>

                  {roomData.amenities && roomData.amenities.length > 0 ? (
                    <ul className={'mt-24 grid gap-12 md:grid-cols-2'}>
                      {roomData.amenities.map((amenity: any) => (
                        <li key={amenity.id}>
                          <div className="rounded-12 bg-bgSec border-linePr flex items-center gap-8 border p-12">
                            {amenity.imageUrl && (
                              <img
                                src={amenity.imageUrl}
                                alt={amenity.name}
                                className="size-20 object-contain"
                              />
                            )}
                            <span className="text-14 text-textHeadline">
                              {amenity.name}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-14 text-textDescription mt-24">
                      No amenities selected for this room.
                    </p>
                  )}
                </div>

                <div
                  className={
                    'bg-bgSec rounded-20 border-linePr shrink-0 border max-md:mt-24 md:w-293'
                  }
                >
                  <div className={'p-20'}>
                    <p className={'flex items-center gap-8'}>
                      {/* <small
                        className={'text-textDescription text-18 line-through'}
                      >
                        $132
                      </small> */}
                      <strong
                        className={'text-textHeadline text-h6 font-medium'}
                      >
                        ${roomData.price}
                      </strong>
                      <span className={'text-textDescription text-body-l'}>
                        /
                      </span>
                      <span className={'text-textDescription text-body-l'}>
                        Month
                      </span>
                    </p>
                  </div>

                  <div className={'border-linePr border-t p-20'}>
                    <div className={'flex flex-col gap-8'}>
                      {/* <Date label={'Check-in'} value={'8/15/2025'} />
                      <Date label={'Checkout'} value={'9/15/2025'} /> */}
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          label="Check-in"
                          value={checkIn}
                          onChange={(newValue: Date | null) => {
                            setCheckIn(newValue);
                            if (newValue && checkOut && newValue > checkOut) {
                              setCheckOut(newValue);
                            }
                          }}
                          disablePast
                          // views={['day']}
                          format="dd-MM-yyyy"
                          slotProps={{ textField: { fullWidth: true } as any }}
                        />
                      </LocalizationProvider>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          label="Checkout"
                          value={checkOut}
                          onChange={(newValue: Date | null) =>
                            setCheckOut(newValue)
                          }
                          disablePast
                          minDate={checkIn ?? undefined}
                          // views={['day']}
                          format="dd-MM-yyyy"
                          slotProps={{ textField: { fullWidth: true } as any }}
                        />
                      </LocalizationProvider>
                    </div>
                    <div className={'mt-12'}>
                      <p
                        className={
                          'text-body-m text-textHeadline mb-8 font-medium'
                        }
                      >
                        Guest
                      </p>
                      <Dropdown
                        size={'md'}
                        list={['1 guest', '2 guest', '3 guests', '4 guests']}
                        isFullWidthList
                        direction={'down'}
                        value={guestLabel}
                        onChange={setGuestLabel}
                      />
                    </div>

                    <Button
                      className={
                        'mt-25 w-full ' +
                        (isReserveDisabled
                          ? 'cursor-not-allowed opacity-50'
                          : '')
                      }
                      disabled={isReserveDisabled}
                      onClick={handleReserve}
                    >
                      {isSubmitting
                        ? 'Submitting...'
                        : hasReservationStatus
                          ? statusTextMap[
                              effectiveReservationStatus.toUpperCase()
                            ] || effectiveReservationStatus
                          : 'Reserve'}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex gap-12">
                <Button className={'mt-25 w-250'}>
                  {roomData?.amenities?.length} amenities
                </Button>
                {/* <Button
                  style="transparent"
                  className={
                    'text-black-300 mt-25 w-150 border border-black text-black'
                  }
                >
                  <span className="text-black">Add New</span>
                </Button> */}
              </div>
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  );
}
