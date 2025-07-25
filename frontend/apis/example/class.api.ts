// @/apis/class/class.api.ts
import { ClassPayload, ClassResponse, ClassFilterResponse, SingleClassResponse, UpdateClassResponse, DeleteClassResponse } from './class.types';
import api from "@/apis/index";

export const createClass = async (payload: ClassPayload): Promise<ClassResponse> => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await api.post(`/class`, payload, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('Failed to create class:', error);
    if (error.response) {
      return {
        success: false,
        message: error.response.data.message || 'Unable to create class',
        statusCode: error.response.status,
      };
    }
    throw error;
  }
};

export const getClassById = async (id: string): Promise<SingleClassResponse> => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await api.get(`/class/${id}`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch class:', error);
    if (error.response) {
      return {
        success: false,
        message: error.response.data.message || 'Unable to fetch class',
        statusCode: error.response.status,
      };
    }
    throw error;
  }
};

export const updateClass = async (id: string, payload: ClassPayload): Promise<UpdateClassResponse> => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await api.put(`/class/${id}`, payload, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('Failed to update class:', error);
    if (error.response) {
      return {
        success: false,
        message: error.response.data.message || 'Unable to update class',
        statusCode: error.response.status,
      };
    }
    throw error;
  }
};

export const deleteClass = async (id: string): Promise<DeleteClassResponse> => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await api.delete(`/class/${id}`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('Failed to delete class:', error);
    if (error.response) {
      return {
        success: false,
        message: error.response.data.message || 'Unable to delete class',
        statusCode: error.response.status,
      };
    }
    throw error;
  }
};

export const filterClassesBySchool = async (
  schoolId: string,
  name?: string,
  page: number = 1,
  pageSize: number = 10
): Promise<ClassFilterResponse> => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const queryParams = new URLSearchParams();
    if (name) queryParams.append('name', name);
    queryParams.append('page', page.toString());
    queryParams.append('pageSize', pageSize.toString());

    const response = await api.get(`/class/filter/school/${schoolId}?${queryParams.toString()}`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('Failed to filter classes:', error);
    if (error.response) {
      return {
        success: false,
        data: {
          classes: [],
          totalCount: 0,
          totalPages: 0,
          currentPage: page,
        },
        message: error.response.data.message || 'Unable to fetch classes',
        statusCode: error.response.status,
      };
    }
    throw error;
  }
};