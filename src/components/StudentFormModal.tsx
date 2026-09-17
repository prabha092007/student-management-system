import { useState, useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';
import type { Student, StudentInput } from '@/types/student';
import { validateStudent, type ValidationErrors } from '@/lib/validation';

interface StudentFormModalProps {
  open: boolean;
  editingStudent: Student | null;
  dark: boolean;
  onClose: () => void;
  onSubmit: (values: StudentInput) => Promise<void>;
}

const emptyForm: StudentInput = {
  name: '',
  email: '',
  phone: '',
  department: '',
  year: 1,
  cgpa: 0,
};

const departments = [
  'Computer Science',
  'Information Technology',
  'Electronics',
  'Mechanical',
  'Civil',
  'Electrical',
  'Chemical',
  'Biotechnology',
  'Aerospace',
  'Other',
];

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}

export function StudentFormModal({
  open,
  editingStudent,
  dark,
  onClose,
  onSubmit,
}: StudentFormModalProps) {
  const [values, setValues] = useState<StudentInput>(emptyForm);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      if (editingStudent) {
        setValues({
          name: editingStudent.name,
          email: editingStudent.email,
          phone: editingStudent.phone,
          department: editingStudent.department,
          year: editingStudent.year,
          cgpa: editingStudent.cgpa,
        });
      } else {
        setValues(emptyForm);
      }
      setErrors({});
    }
  }, [open, editingStudent]);

  if (!open) return null;

  const handleChange = (field: keyof StudentInput, value: string | number) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateStudent(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(values);
      onClose();
    } catch {
      // Error handled by caller via toast
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = dark
    ? 'w-full px-3.5 py-2.5 rounded-xl border text-sm text-gray-100 placeholder-gray-400 bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
    : 'w-full px-3.5 py-2.5 rounded-xl border text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all';

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className={`relative rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-modal-in ${dark ? 'bg-gray-800' : 'bg-white'}`}>
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b sticky top-0 z-10 rounded-t-2xl ${dark ? 'border-gray-700 bg-gray-800' : 'border-gray-100 bg-white'}`}>
          <h2 className={`text-lg font-bold ${dark ? 'text-gray-100' : 'text-gray-900'}`}>
            {editingStudent ? 'Edit Student' : 'Add New Student'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Field label="Full Name" error={errors.name}>
            <input
              type="text"
              value={values.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g. John Doe"
              className={`${inputClass} ${errors.name ? 'border-red-300' : dark ? 'border-gray-600' : 'border-gray-200'}`}
            />
          </Field>

          <Field label="Email Address" error={errors.email}>
            <input
              type="email"
              value={values.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="e.g. john@example.com"
              className={`${inputClass} ${errors.email ? 'border-red-300' : dark ? 'border-gray-600' : 'border-gray-200'}`}
            />
          </Field>

          <Field label="Phone Number" error={errors.phone}>
            <input
              type="tel"
              value={values.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="e.g. 9876543210"
              className={`${inputClass} ${errors.phone ? 'border-red-300' : dark ? 'border-gray-600' : 'border-gray-200'}`}
            />
          </Field>

          <Field label="Department" error={errors.department}>
            <select
              value={values.department}
              onChange={(e) => handleChange('department', e.target.value)}
              className={`${inputClass} ${errors.department ? 'border-red-300' : dark ? 'border-gray-600' : 'border-gray-200'} ${dark ? 'bg-gray-700' : 'bg-white'} cursor-pointer`}
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Year of Study" error={errors.year}>
              <select
                value={values.year}
                onChange={(e) => handleChange('year', Number(e.target.value))}
                className={`${inputClass} ${errors.year ? 'border-red-300' : dark ? 'border-gray-600' : 'border-gray-200'} ${dark ? 'bg-gray-700' : 'bg-white'} cursor-pointer`}
              >
                <option value={1}>1st Year</option>
                <option value={2}>2nd Year</option>
                <option value={3}>3rd Year</option>
                <option value={4}>4th Year</option>
                <option value={5}>5th Year</option>
              </select>
            </Field>

            <Field label="CGPA (0-10)" error={errors.cgpa}>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                value={values.cgpa}
                onChange={(e) => handleChange('cgpa', Number(e.target.value))}
                placeholder="e.g. 8.5"
                className={`${inputClass} ${errors.cgpa ? 'border-red-300' : dark ? 'border-gray-600' : 'border-gray-200'}`}
              />
            </Field>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${dark ? 'border-gray-600 text-gray-200 hover:bg-gray-700' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Saving...' : editingStudent ? 'Update Student' : 'Add Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
