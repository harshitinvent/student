// API Base URL - configure this based on your environment
const API_BASE = 'http://localhost:8080/api/canvas';

// Helper function to get authentication headers
function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('token');
  return token 
    ? { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      } 
    : { 'Content-Type': 'application/json' };
}

// Types
export interface Project {
  id: number;
  owner_id: number;
  title: string;
  metadata: ProjectMetadata;
  created_at: string;
  updated_at: string;
  assets?: CanvasAsset[];
  permissions?: ProjectPermission[];
}

export interface ProjectMetadata {
  subject?: string;
  course?: string;
  goal?: string; // UNDERSTAND_CONCEPT, TEST_PREP, ASSIGNMENT
  deadline?: string;
  description?: string;
}

export interface CanvasAsset {
  id: number;
  project_id: number;
  owner_id: number;
  title: string;
  asset_type: 'TEXT_DOC' | 'FLASHCARDS' | 'WALKTHROUGH' | 'QUIZ';
  content: any; // JSONB - flexible content based on asset type
  source_asset_id?: number;
  created_at: string;
  updated_at: string;
  project?: Project;
}

export interface CreateProjectRequest {
  title: string;
  metadata: ProjectMetadata;
}

export interface UpdateProjectRequest {
  title?: string;
  metadata?: ProjectMetadata;
}

export interface CreateAssetRequest {
  project_id: number;
  title: string;
  asset_type: 'TEXT_DOC' | 'FLASHCARDS' | 'WALKTHROUGH' | 'QUIZ';
  content: any;
  source_asset_id?: number;
}

export interface UpdateAssetRequest {
  title?: string;
  content?: any;
}

export interface ProjectPermission {
  id: number;
  project_id: number;
  user_id: number;
  permission_level: 'EDITOR' | 'VIEWER';
  created_at: string;
  updated_at: string;
}

export interface ShareProjectRequest {
  user_id: number;
  permission_level: 'EDITOR' | 'VIEWER';
}

// API Response wrapper
interface APIResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

// Project API calls
export const createProject = async (request: CreateProjectRequest): Promise<Project> => {
  try {
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(request),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to create project: ${res.status} ${errorText}`);
    }

    const response: APIResponse<Project> = await res.json();
    return response.data;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

export const getProjects = async (page = 1, limit = 10, search = ''): Promise<{
  projects: Project[];
  total: number;
  page: number;
  limit: number;
}> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (search) {
      params.append('search', search);
    }

    const res = await fetch(`${API_BASE}/projects?${params.toString()}`, {
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to fetch projects: ${res.status} ${errorText}`);
    }

    const response: APIResponse<{
      projects: Project[];
      total: number;
      page: number;
      limit: number;
    }> = await res.json();
    return response.data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

export const getProject = async (id: number): Promise<Project> => {
  try {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to fetch project: ${res.status} ${errorText}`);
    }

    const response: APIResponse<Project> = await res.json();
    return response.data;
  } catch (error) {
    console.error('Error fetching project:', error);
    throw error;
  }
};

export const updateProject = async (id: number, request: UpdateProjectRequest): Promise<Project> => {
  try {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(request),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to update project: ${res.status} ${errorText}`);
    }

    const response: APIResponse<Project> = await res.json();
    return response.data;
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

export const deleteProject = async (id: number): Promise<void> => {
  try {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to delete project: ${res.status} ${errorText}`);
    }
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};

// Asset API calls
export const createAsset = async (request: CreateAssetRequest): Promise<CanvasAsset> => {
  try {
    const res = await fetch(`${API_BASE}/assets`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(request),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to create asset: ${res.status} ${errorText}`);
    }

    const response: APIResponse<CanvasAsset> = await res.json();
    return response.data;
  } catch (error) {
    console.error('Error creating asset:', error);
    throw error;
  }
};

export const getAsset = async (id: number): Promise<CanvasAsset> => {
  try {
    const res = await fetch(`${API_BASE}/assets/${id}`, {
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to fetch asset: ${res.status} ${errorText}`);
    }

    const response: APIResponse<CanvasAsset> = await res.json();
    return response.data;
  } catch (error) {
    console.error('Error fetching asset:', error);
    throw error;
  }
};

export const getAssetsByProject = async (projectId: number): Promise<CanvasAsset[]> => {
  try {
    const res = await fetch(`${API_BASE}/projects/${projectId}/assets`, {
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to fetch assets: ${res.status} ${errorText}`);
    }

    const response: APIResponse<CanvasAsset[]> = await res.json();
    return response.data;
  } catch (error) {
    console.error('Error fetching assets:', error);
    throw error;
  }
};

export const updateAsset = async (id: number, request: UpdateAssetRequest): Promise<CanvasAsset> => {
  try {
    const res = await fetch(`${API_BASE}/assets/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(request),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to update asset: ${res.status} ${errorText}`);
    }

    const response: APIResponse<CanvasAsset> = await res.json();
    return response.data;
  } catch (error) {
    console.error('Error updating asset:', error);
    throw error;
  }
};

export const deleteAsset = async (id: number): Promise<void> => {
  try {
    const res = await fetch(`${API_BASE}/assets/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to delete asset: ${res.status} ${errorText}`);
    }
  } catch (error) {
    console.error('Error deleting asset:', error);
    throw error;
  }
};

// Permission/Sharing API calls
export const shareProject = async (projectId: number, request: ShareProjectRequest): Promise<ProjectPermission> => {
  try {
    const res = await fetch(`${API_BASE}/projects/${projectId}/share`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(request),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to share project: ${res.status} ${errorText}`);
    }

    const response: APIResponse<ProjectPermission> = await res.json();
    return response.data;
  } catch (error) {
    console.error('Error sharing project:', error);
    throw error;
  }
};

export const getProjectPermissions = async (projectId: number): Promise<ProjectPermission[]> => {
  try {
    const res = await fetch(`${API_BASE}/projects/${projectId}/permissions`, {
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to fetch permissions: ${res.status} ${errorText}`);
    }

    const response: APIResponse<ProjectPermission[]> = await res.json();
    return response.data;
  } catch (error) {
    console.error('Error fetching permissions:', error);
    throw error;
  }
};

export const removeProjectPermission = async (projectId: number, userId: number): Promise<void> => {
  try {
    const res = await fetch(`${API_BASE}/projects/${projectId}/permissions`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      body: JSON.stringify({ user_id: userId }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to remove permission: ${res.status} ${errorText}`);
    }
  } catch (error) {
    console.error('Error removing permission:', error);
    throw error;
  }
};

