// @/apis/class/class.query.ts
import { useQuery } from '@tanstack/react-query';
import { getClassById, filterClassesBySchool } from './class.api';
import { ClassFilterResponse, SingleClassResponse } from './class.types';

export const useGetClassByIdQuery = (classId: string) => {
  return useQuery<SingleClassResponse, Error>({
    queryKey: ['class', classId],
    queryFn: () => getClassById(classId),
    enabled: !!classId,
  });
};

export const useFilterClassesBySchoolQuery = (
  schoolId: string,
  name?: string,
  page: number = 1,
  pageSize: number = 10
) => {
  return useQuery<ClassFilterResponse, Error>({
    queryKey: ['classes', schoolId, name, page, pageSize],
    queryFn: () => filterClassesBySchool(schoolId, name, page, pageSize),
    enabled: !!schoolId,
  });
};