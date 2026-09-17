export interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  department: string;
  year: number;
  cgpa: number;
  created_at: string;
}

export interface StudentInput {
  name: string;
  email: string;
  phone: string;
  department: string;
  year: number;
  cgpa: number;
}

export interface StudentStats {
  totalStudents: number;
  totalDepartments: number;
  averageCgpa: number;
  highestCgpa: number;
  lowestCgpa: number;
  topDepartment: string;
}

export type SortField = 'id' | 'name' | 'email' | 'department' | 'year' | 'cgpa';
export type SortDirection = 'asc' | 'desc';
