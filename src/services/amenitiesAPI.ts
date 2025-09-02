import { IAnemities } from '../types/accomodations';

const API_BASE_URL = 'http://localhost:8080/api/v1';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

// Main Amenities API
export const amenitiesAPI = {
  // Upload image to S3 bucket first
  uploadImageToS3: async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${API_BASE_URL}/admin/upload/image`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      return data.imageUrl; // Return the S3 image URL
    } catch (error) {
      console.error('Error uploading image to S3:', error);
      throw new Error('Failed to upload image to S3');
    }
  },

  // Create a new amenity with name and imageUrl
  createAmenity: async (amenityData: IAnemities): Promise<any> => {
    try {
      let response = await fetch(`${API_BASE_URL}/admin/amenities`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(amenityData),
      });

      if (!response.ok) {
        throw new Error('Failed to create amenity');
      }

      const data = await response.json();
      console.log('Data data here-->', data);
      return data;
    } catch (error) {
      console.error('Error creating amenity:', error);
      throw new Error('Failed to create amenity');
    }
  },

  // Get all amenities with pagination
  getAmenities: async (page: number, pageSize: number): Promise<any> => {
    try {
      // Add pagination query parameters
      const queryParams = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });

      const response = await fetch(
        `${API_BASE_URL}/admin/amenities?${queryParams}`,
        {
          method: 'GET',
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch amenities');
      }

      const data = await response.json();

      return data;
    } catch (error) {
      console.error('Error fetching amenities:', error);
      // Return empty data when there's an error
      return {
        success: false,
        data: [],
        total: 0,
        page: page,
        pageSize: pageSize,
        totalPages: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },

  // Get amenity by ID
  getAmenityById: async (id: string): Promise<any> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/amenities/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch amenity');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching amenity:', error);
      throw new Error('Failed to fetch amenity');
    }
  },

  // Update amenity
  updateAmenity: async (
    id: string,
    amenityData: Partial<IAnemities>
  ): Promise<any> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/amenities/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(amenityData),
      });

      if (!response.ok) {
        throw new Error('Failed to update amenity');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating amenity:', error);
      throw new Error('Failed to update amenity');
    }
  },

  // Delete amenity
  deleteAmenity: async (id: string): Promise<any> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/amenities/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to delete amenity');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting amenity:', error);
      throw new Error('Failed to delete amenity');
    }
  },

  // Toggle amenity status
  toggleAmenityStatus: async (id: string): Promise<any> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/amenities/${id}/toggle-status`,
        {
          method: 'PATCH',
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to toggle amenity status');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error toggling amenity status:', error);
      throw new Error('Failed to toggle amenity status');
    }
  },
};
