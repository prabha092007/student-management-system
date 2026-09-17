import { useState, useEffect, useMemo, useCallback } from 'react';
import { GraduationCap, UserPlus, RefreshCw, Moon, Sun } from 'lucide-react';
import type { Student, StudentInput, SortField, SortDirection } from '@/types/student';
import {
  fetchStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  deleteStudents,
  computeStats,
  exportToCsv,
} from '@/services/studentService';
import { ToastProvider, useToast } from '@/components/Toast';
import { StatsCards } from '@/components/StatsCards';
import { StudentTable } from '@/components/StudentTable';
import { StudentFormModal } from '@/components/StudentFormModal';
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal';
import { StudentDetailDrawer } from '@/components/StudentDetailDrawer';

function StudentManagementApp() {
  const toast = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [dark, setDark] = useState(false);

  // Search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');

  // Sorting
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Selection
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // Modals
  const [formOpen, setFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);
  const [bulkDeleteCount, setBulkDeleteCount] = useState(0);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved === 'true') {
      setDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  };

  const loadStudents = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchStudents();
      setStudents(data);
    } catch (err) {
      toast.showError(err instanceof Error ? err.message : 'Failed to load students');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  // Filter
  const filteredStudents = useMemo(() => {
    let result = students;

    if (departmentFilter) {
      result = result.filter((s) => s.department === departmentFilter);
    }

    if (yearFilter) {
      result = result.filter((s) => s.year === Number(yearFilter));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          s.department.toLowerCase().includes(q)
      );
    }

    // Sort
    result = [...result].sort((a, b) => {
      let aVal: string | number = a[sortField];
      let bVal: string | number = b[sortField];
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [students, searchQuery, departmentFilter, yearFilter, sortField, sortDirection]);

  const stats = useMemo(() => computeStats(students), [students]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [searchQuery, departmentFilter, yearFilter, pageSize]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleAdd = () => {
    setEditingStudent(null);
    setFormOpen(true);
  };

  const handleEdit = (student: Student) => {
    setViewingStudent(null);
    setEditingStudent(student);
    setFormOpen(true);
  };

  const handleView = (student: Student) => {
    setViewingStudent(student);
  };

  const handleDelete = (student: Student) => {
    setDeletingStudent(student);
    setBulkDeleteCount(0);
  };

  const handleBulkDelete = () => {
    setDeletingStudent(null);
    setBulkDeleteCount(selectedIds.size);
  };

  const handleSubmit = async (values: StudentInput) => {
    try {
      if (editingStudent) {
        await updateStudent(editingStudent.id, values);
        toast.showSuccess('Student updated successfully');
      } else {
        await createStudent(values);
        toast.showSuccess('Student added successfully');
      }
      await loadStudents();
    } catch (err) {
      toast.showError(err instanceof Error ? err.message : 'Something went wrong');
      throw err;
    }
  };

  const handleConfirmDelete = async () => {
    try {
      if (bulkDeleteCount > 0) {
        await deleteStudents(Array.from(selectedIds));
        toast.showSuccess(`${bulkDeleteCount} students deleted successfully`);
        setSelectedIds(new Set());
        setBulkDeleteCount(0);
      } else if (deletingStudent) {
        await deleteStudent(deletingStudent.id);
        toast.showSuccess('Student deleted successfully');
        setDeletingStudent(null);
      }
      await loadStudents();
    } catch (err) {
      toast.showError(err instanceof Error ? err.message : 'Failed to delete student');
    }
  };

  const handleToggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleToggleSelectAll = (ids: number[]) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      const allSelected = ids.every((id) => next.has(id));
      if (allSelected) {
        ids.forEach((id) => next.delete(id));
      } else {
        ids.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  const handleExport = () => {
    if (filteredStudents.length === 0) return;
    exportToCsv(filteredStudents);
    toast.showInfo('Exported to CSV');
  };

  return (
    <div className={`min-h-screen transition-colors ${dark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`border-b ${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`text-lg font-bold leading-tight ${dark ? 'text-gray-100' : 'text-gray-900'}`}>
                  Student Management System
                </h1>
                <p className={`text-xs hidden sm:block ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Manage student records with ease
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleDark}
                className={`p-2 rounded-lg transition-colors ${dark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`}
                title="Toggle dark mode"
              >
                {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={loadStudents}
                className={`p-2 rounded-lg transition-colors ${dark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`}
                title="Refresh"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Stats */}
        <StatsCards stats={stats} dark={dark} />

        {/* Action bar */}
        <div className="flex items-center justify-between">
          <h2 className={`text-xl font-bold ${dark ? 'text-gray-100' : 'text-gray-900'}`}>Student Records</h2>
          <button
            onClick={handleAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            Add Student
          </button>
        </div>

        {/* Table with search */}
        <StudentTable
          students={filteredStudents}
          allStudents={students}
          searchQuery={searchQuery}
          departmentFilter={departmentFilter}
          yearFilter={yearFilter}
          sortField={sortField}
          sortDirection={sortDirection}
          page={page}
          pageSize={pageSize}
          selectedIds={selectedIds}
          onSearchChange={setSearchQuery}
          onDepartmentChange={setDepartmentFilter}
          onYearChange={setYearFilter}
          onSort={handleSort}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          onToggleSelect={handleToggleSelect}
          onToggleSelectAll={handleToggleSelectAll}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          onExport={handleExport}
          onBulkDelete={handleBulkDelete}
          loading={loading}
          dark={dark}
        />
      </main>

      {/* Modals */}
      <StudentFormModal
        open={formOpen}
        editingStudent={editingStudent}
        dark={dark}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      />

      <DeleteConfirmModal
        student={deletingStudent}
        count={bulkDeleteCount}
        onClose={() => {
          setDeletingStudent(null);
          setBulkDeleteCount(0);
        }}
        onConfirm={handleConfirmDelete}
      />

      <StudentDetailDrawer
        student={viewingStudent}
        dark={dark}
        onClose={() => setViewingStudent(null)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <StudentManagementApp />
    </ToastProvider>
  );
}
