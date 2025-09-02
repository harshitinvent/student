// ------------ Amenities interfaces -----------
export interface IAnemities {
  name: string;
  imageUrl: string;
}

export interface IAmenityResponse {
  id: string;
  name: string;
  url: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  success: boolean;
}
