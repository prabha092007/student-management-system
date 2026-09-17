import type { StudentInput } from '@/types/student';

export interface ValidationErrors {
  name?: string;
  email?: string;
  phone?: string;
  department?: string;
  year?: string;
  cgpa?: string;
}

export function validateStudent(values: StudentInput): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!values.name.trim()) {
    errors.name = 'Name is required';
  } else if (values.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  if (!values.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Please enter a valid email address';
  }

  if (!values.phone.trim()) {
    errors.phone = 'Phone number is required';
  } else if (!/^[0-9+\-\s()]{7,15}$/.test(values.phone.trim())) {
    errors.phone = 'Please enter a valid phone number (7-15 digits)';
  }

  if (!values.department.trim()) {
    errors.department = 'Department is required';
  }

  if (!values.year) {
    errors.year = 'Year is required';
  } else if (values.year < 1 || values.year > 5) {
    errors.year = 'Year must be between 1 and 5';
  }

  if (values.cgpa === undefined || values.cgpa === null || Number.isNaN(values.cgpa)) {
    errors.cgpa = 'CGPA is required';
  } else if (values.cgpa < 0 || values.cgpa > 10) {
    errors.cgpa = 'CGPA must be between 0 and 10';
  }

  return errors;
}
