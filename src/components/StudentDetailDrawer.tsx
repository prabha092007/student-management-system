import { X, Mail, Phone, Building2, Calendar, Hash, Award, Clock, Pencil, Trash2 } from 'lucide-react';
import type { Student } from '@/types/student';

interface StudentDetailDrawerProps {
  student: Student | null;
  dark: boolean;
  onClose: () => void;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
}

function CgpaBadge({ cgpa }: { cgpa: number }) {
  let bg = 'bg-red-50 text-red-700';
  let label = 'Below Average';
  if (cgpa >= 8) { bg = 'bg-emerald-50 text-emerald-700'; label = 'Excellent'; }
  else if (cgpa >= 6) { bg = 'bg-amber-50 text-amber-700'; label = 'Good'; }
  else if (cgpa >= 4) { bg = 'bg-orange-50 text-orange-700'; label = 'Average'; }
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-semibold ${bg}`}>
      {cgpa.toFixed(2)} — {label}
    </span>
  );
}

export function StudentDetailDrawer({
  student,
  dark,
  onClose,
  onEdit,
  onDelete,
}: StudentDetailDrawerProps) {
  if (!student) return null;

  const fields = [
    { icon: <Hash className="w-4 h-4" />, label: 'Student ID', value: String(student.id) },
    { icon: <Mail className="w-4 h-4" />, label: 'Email', value: student.email },
    { icon: <Phone className="w-4 h-4" />, label: 'Phone', value: student.phone },
    { icon: <Building2 className="w-4 h-4" />, label: 'Department', value: student.department },
    { icon: <Calendar className="w-4 h-4" />, label: 'Year of Study', value: `${student.year}${student.year === 1 ? 'st' : student.year === 2 ? 'nd' : student.year === 3 ? 'rd' : 'th'} Year` },
    { icon: <Clock className="w-4 h-4" />, label: 'Enrolled On', value: new Date(student.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
  { icon: <Award className="w-4 h-4" />, label: 'CGPA', value: student.cgpa.toFixed(2) },
  { icon: <Award className="w-4 h-4" />, label: 'Performance', value: student.cgpa >= 8 ? 'Excellent' : student.cgpa >= 6 ? 'Good' : student.cgpa >= 4 ? 'Average' : 'Below Average' },
  ];

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className={`relative w-full max-w-md h-full overflow-y-auto shadow-2xl animate-drawer-in ${dark ? 'bg-gray-800' : 'bg-white'}`}>
        {/* Header */}
        <div className={`sticky top-0 z-10 px-6 py-5 border-b ${dark ? 'border-gray-700 bg-gray-800' : 'border-gray-100 bg-white'}`}>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Student Details</h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Avatar + Name */}
        <div className="px-6 py-6 text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl font-bold text-white">
              {student.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <h3 className={`text-xl font-bold ${dark ? 'text-gray-100' : 'text-gray-900'}`}>{student.name}</h3>
          <div className="mt-2 flex justify-center">
            <CgpaBadge cgpa={student.cgpa} />
          </div>
        </div>

        {/* Fields */}
        <div className="px-6 pb-6 space-y-1">
          {fields.map((field, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl ${dark ? 'bg-gray-700/50' : 'bg-gray-50'}`}
            >
              <div className={`p-2 rounded-lg ${dark ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-500'}`}>
                {field.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 font-medium">{field.label}</p>
                <p className={`text-sm font-semibold truncate ${dark ? 'text-gray-100' : 'text-gray-800'}`}>{field.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={() => onEdit(student)}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={() => onDelete(student)}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
