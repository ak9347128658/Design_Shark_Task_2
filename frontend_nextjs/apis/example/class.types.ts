// @/apis/class/class.types.ts
export interface ClassPayload {
  name: string;
  schoolId: string;
  teacherId: string;
}

export interface ClassResponse {
  success: boolean;
  data?: {
    id: string;
    name: string;
    schoolId: string;
    teacherId: string;
    createdAt: string;
    updatedAt: string;
  };
  message?: string;
  statusCode: number;
}

export interface SingleClassResponse {
  success: boolean;
  data?: {
    id: string;
    name: string;
    schoolId: string;
    teacherId: string;
    createdAt: string;
    updatedAt: string;
    school: {
      id: string;
      name: string;
      address: string;
      city: string;
      state: string;
      zipCode: string;
      logoUrl: string;
      website: string;
      description: string;
      isApproved: boolean;
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
    };
    teacher: {
      id: string;
      userId: string;
      schoolId: string;
      isClassTeacher: boolean;
      profilePictureUrl: string | null;
      createdAt: string;
      updatedAt: string;
    };
    students: Array<any>;
    classwork: Array<any>;
    homework: Array<any>;
    timetable: Array<any>;
    examTimetable: Array<any>;
    classResources: Array<any>;
  };
  message?: string;
  statusCode: number;
}

export interface UpdateClassResponse {
  success: boolean;
  data?: {
    message: string;
    class: {
      id: string;
      name: string;
      schoolId: string;
      teacherId: string;
      createdAt: string;
      updatedAt: string;
    };
  };
  message?: string;
  statusCode: number;
}

export interface DeleteClassResponse {
  success: boolean;
  data?: {
    message: string;
  };
  message?: string;
  statusCode: number;
}

export interface ClassFilterResponse {
  success: boolean;
  data: {
    classes: Array<{
      id: string;
      name: string;
      schoolId: string;
      teacherId: string;
      createdAt: string;
      updatedAt: string;
      teacher: {
        id: string;
        userId: string;
        schoolId: string;
        isClassTeacher: boolean;
        profilePictureUrl: string | null;
        createdAt: string;
        updatedAt: string;
        user: {
          id: string;
          firstName: string;
          lastName: string;
          email: string;
          mobile: string;
          isActive: boolean;
          password: string;
          roleId: string;
          roleName: string;
          schoolId: string;
          createdAt: string;
          updatedAt: string;
        };
      };
    }>;
    totalCount: number;
    totalPages: number;
    currentPage: number;
  };
  statusCode: number;
  message?: string;
}