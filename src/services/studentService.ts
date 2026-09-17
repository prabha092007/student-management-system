import { supabase } from '@/lib/supabase';
import type { Student, StudentInput, StudentStats } from '@/types/student';

function mapError(error: { message?: string; code?: string }, fallback: string): Error {
  if (error?.code === '23505') {
    return new Error('A student with this email already exists');
  }
  return new Error(error?.message || fallback);
}

export async function fetchStudents(): Promise<Student[]> {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw mapError(error, 'Failed to load students');
  return data as Student[];
}

export async function fetchStudent(id: number): Promise<Student> {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw mapError(error, 'Failed to load student');
  if (!data) throw new Error('Student not found');
  return data as Student;
}

export async function createStudent(input: StudentInput): Promise<Student> {
  const { data, error } = await supabase
    .from('students')
    .insert({
      name: input.name.trim(),
      email: input.email.trim(),
      phone: input.phone.trim(),
      department: input.department.trim(),
      year: input.year,
      cgpa: input.cgpa,
    })
    .select()
    .single();

  if (error) throw mapError(error, 'Failed to create student');
  return data as Student;
}

export async function updateStudent(id: number, input: StudentInput): Promise<Student> {
  const { data, error } = await supabase
    .from('students')
    .update({
      name: input.name.trim(),
      email: input.email.trim(),
      phone: input.phone.trim(),
      department: input.department.trim(),
      year: input.year,
      cgpa: input.cgpa,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw mapError(error, 'Failed to update student');
  return data as Student;
}

export async function deleteStudent(id: number): Promise<void> {
  const { error } = await supabase.from('students').delete().eq('id', id);
  if (error) throw mapError(error, 'Failed to delete student');
}

export async function deleteStudents(ids: number[]): Promise<void> {
  const { error } = await supabase.from('students').delete().in('id', ids);
  if (error) throw mapError(error, 'Failed to delete students');
}

export function computeStats(students: Student[]): StudentStats {
  const totalStudents = students.length;
  const departments = new Set(students.map((s) => s.department.toLowerCase()));
  const averageCgpa =
    totalStudents > 0
      ? students.reduce((sum, s) => sum + s.cgpa, 0) / totalStudents
      : 0;
  const highestCgpa = totalStudents > 0 ? Math.max(...students.map((s) => s.cgpa)) : 0;
  const lowestCgpa = totalStudents > 0 ? Math.min(...students.map((s) => s.cgpa)) : 0;

  const deptCounts = new Map<string, number>();
  students.forEach((s) => {
    deptCounts.set(s.department, (deptCounts.get(s.department) || 0) + 1);
  });
  const topDepartment =
    totalStudents > 0
      ? Array.from(deptCounts.entries()).sort((a, b) => b[1] - a[1])[0][0]
      : '—';

  return {
    totalStudents,
    totalDepartments: departments.size,
    averageCgpa: Math.round(averageCgpa * 100) / 100,
    highestCgpa: Math.round(highestCgpa * 100) / 100,
    lowestCgpa: Math.round(lowestCgpa * 100) / 100,
    topDepartment,
  };
}

export function exportToCsv(students: Student[]): void {
  const headers = ['ID', 'Name', 'Email', 'Phone', 'Department', 'Year', 'CGPA', 'Created At'];
  const rows = students.map((s) => [
    s.id,
    s.name,
    s.email,
    s.phone,
    s.department,
    s.year,
    s.cgpa.toFixed(2),
    new Date(s.created_at).toLocaleString(),
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `students_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
