const API_BASE_URL_V1 = 'http://103.189.173.7:8080/api/v1';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  } as Record<string, string>;
};

export type CreateRoomRequest = {
  building: string;
  roomId: string;
  type: 'Single' | 'Double';
  capacity: number;
  price: number;
  amenities?: string[]; // Changed from Array<{...}> to string[] to send only IDs
};

export type CreateRoomResponse = {
  id: string;
};

export const roomsAPI = {
  createRoom: async (
    payload: CreateRoomRequest
  ): Promise<CreateRoomResponse> => {
    const response = await fetch(`${API_BASE_URL_V1}/admin/rooms/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || 'Failed to create room');
    }

    // Assuming API returns JSON with created room id or object
    const data = await response.json().catch(() => ({}));
    return data as CreateRoomResponse;
  },

  getRoomById: async (id: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL_V1}/admin/rooms/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || 'Failed to fetch room');
    }

    const data = await response.json().catch(() => ({}));
    return data;
  },

  getBuildings: async (): Promise<any> => {
    const response = await fetch(`${API_BASE_URL_V1}/admin/campuses`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || 'Failed to fetch campuses');
    }

    const data = await response.json().catch(() => ({}));
    return data.data;
  },

  reserveRoom: async (
    roomId: string,
    payload: {
      checkIn: string; // ISO date
      checkOut: string; // ISO date
      guests: number;
      studentId?: string;
      studentEmail?: string;
      roomId?: string;
    }
  ): Promise<{ id: string } | any> => {
    const response = await fetch(
      `${API_BASE_URL_V1}/student/rooms/reserve`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || 'Failed to reserve room');
    }

    const data = await response.json().catch(() => ({}));
    return data;
  },
};
