const API_BASE = 'http://103.189.173.7:8080/api/streams';

export type Stream = {
  ID: number;
  CreatedAt?: string;
  UpdatedAt?: string;
  DeletedAt?: string | null;
  name: string;
  description?: string;
  is_active?: boolean;
};

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('token');
  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
}

export const streamsAPI = {
  async getStreams(limit: number = 1000, page: number = 1): Promise<Stream[]> {
    const url = `${API_BASE}?limit=${encodeURIComponent(limit)}&page=${encodeURIComponent(page)}`;
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        ...getAuthHeaders(),
      },
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(text || 'Failed to fetch streams');
    }

    const data = await res.json().catch(() => ({}));
    // Expected shape: { streams: Stream[], limit, page, total }
    if (Array.isArray(data)) return data as Stream[];
    if (data && Array.isArray(data.streams)) return data.streams as Stream[];
    if (data && data.data && Array.isArray(data.data)) return data.data as Stream[];
    // Fallback: try common properties
    return [];
  },
};


