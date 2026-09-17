import { Search, Pencil, Trash2, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Download, Eye } from 'lucide-react';
import type { Student, SortField, SortDirection } from '@/types/student';

interface StudentTableProps {
  students: Student[];
  allStudents: Student[];
  searchQuery: string;
  departmentFilter: string;
  yearFilter: string;
  sortField: SortField;
  sortDirection: SortDirection;
  page: number;
  pageSize: number;
  selectedIds: Set<number>;
  onSearchChange: (value: string) => void;
  onDepartmentChange: (value: string) => void;
  onYearChange: (value: string) => void;
  onSort: (field: SortField) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onToggleSelect: (id: number) => void;
  onToggleSelectAll: (ids: number[]) => void;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
  onView: (student: Student) => void;
  onExport: () => void;
  onBulkDelete: () => void;
  loading: boolean;
  dark: boolean;
}

function CgpaBadge({ cgpa }: { cgpa: number }) {
  let bg = 'bg-red-50 text-red-700';
  let dot = 'bg-red-500';
  if (cgpa >= 8) {
    bg = 'bg-emerald-50 text-emerald-700';
    dot = 'bg-emerald-500';
  } else if (cgpa >= 6) {
    bg = 'bg-amber-50 text-amber-700';
    dot = 'bg-amber-500';
  } else if (cgpa >= 4) {
    bg = 'bg-orange-50 text-orange-700';
    dot = 'bg-orange-500';
  }
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {cgpa.toFixed(2)}
    </span>
  );
}

export function StudentTable({
  students,
  allStudents,
  searchQuery,
  departmentFilter,
  yearFilter,
  sortField,
  sortDirection,
  page,
  pageSize,
  selectedIds,
  onSearchChange,
  onDepartmentChange,
  onYearChange,
  onSort,
  onPageChange,
  onPageSizeChange,
  onToggleSelect,
  onToggleSelectAll,
  onEdit,
  onDelete,
  onView,
  onExport,
  onBulkDelete,
  loading,
  dark,
}: StudentTableProps) {
  const departments = Array.from(
    new Set(allStudents.map((s) => s.department).filter(Boolean))
  ).sort();

  const totalPages = Math.max(1, Math.ceil(students.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIdx = (currentPage - 1) * pageSize;
  const pageStudents = students.slice(startIdx, startIdx + pageSize);
  const pageIds = pageStudents.map((s) => s.id);
  const allPageSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id));

  const sortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />;
    return sortDirection === 'asc'
      ? <ArrowUp className="w-3.5 h-3.5 text-blue-500" />
      : <ArrowDown className="w-3.5 h-3.5 text-blue-500" />;
  };

  const th = `px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`;
  const td = `px-5 py-4 text-sm`;
  const inputCls = dark
    ? 'w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-600 bg-gray-700 text-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
    : 'w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all';
  const selectCls = dark
    ? 'w-full appearance-none pl-4 pr-10 py-2.5 rounded-xl border border-gray-600 bg-gray-700 text-sm text-gray-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
    : 'w-full appearance-none pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all';

  return (
    <div className={`rounded-2xl border shadow-sm overflow-hidden ${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
      {/* Search and filter bar */}
      <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, or department..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className={inputCls}
            />
          </div>
          <div className="relative sm:w-48">
            <select
              value={departmentFilter}
              onChange={(e) => onDepartmentChange(e.target.value)}
              className={selectCls}
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <ArrowUpDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <div className="relative sm:w-36">
            <select
              value={yearFilter}
              onChange={(e) => onYearChange(e.target.value)}
              className={selectCls}
            >
              <option value="">All Years</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
              <option value="5">5th Year</option>
            </select>
            <ArrowUpDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Bulk actions bar */}
        {selectedIds.size > 0 && (
          <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/30 rounded-xl px-4 py-2.5 animate-fade-in">
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              {selectedIds.size} student{selectedIds.size > 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={onBulkDelete}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete Selected
              </button>
            </div>
          </div>
        )}

        {/* Export button */}
        {students.length > 0 && (
          <div className="flex justify-end">
            <button
              onClick={onExport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : students.length === 0 ? (
          <div className={`flex flex-col items-center justify-center py-20 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
            <p className="text-lg font-medium">No students found</p>
            <p className="text-sm mt-1">
              {searchQuery || departmentFilter || yearFilter
                ? 'Try adjusting your search or filters'
                : 'Click "Add Student" to get started'}
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className={`border-b ${dark ? 'bg-gray-700/50 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
                <th className="px-5 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={allPageSelected}
                    onChange={() => onToggleSelectAll(pageIds)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </th>
                <th className={th} onClick={() => onSort('id')}>
                  <span className="inline-flex items-center gap-1.5">ID {sortIcon('id')}</span>
                </th>
                <th className={th} onClick={() => onSort('name')}>
                  <span className="inline-flex items-center gap-1.5">Name {sortIcon('name')}</span>
                </th>
                <th className={th} onClick={() => onSort('email')}>
                  <span className="inline-flex items-center gap-1.5">Email {sortIcon('email')}</span>
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider">Phone</th>
                <th className={th} onClick={() => onSort('department')}>
                  <span className="inline-flex items-center gap-1.5">Department {sortIcon('department')}</span>
                </th>
                <th className={th} onClick={() => onSort('year')}>
                  <span className="inline-flex items-center gap-1.5">Year {sortIcon('year')}</span>
                </th>
                <th className={th} onClick={() => onSort('cgpa')}>
                  <span className="inline-flex items-center gap-1.5">CGPA {sortIcon('cgpa')}</span>
                </th>
                <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${dark ? 'divide-gray-700' : 'divide-gray-50'}`}>
              {pageStudents.map((student) => (
                <tr
                  key={student.id}
                  className={`transition-colors ${dark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'} ${selectedIds.has(student.id) ? (dark ? 'bg-blue-900/20' : 'bg-blue-50/50') : ''}`}
                >
                  <td className="px-5 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(student.id)}
                      onChange={() => onToggleSelect(student.id)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </td>
                  <td className={`${td} ${dark ? 'text-gray-400' : 'text-gray-500'} font-medium`}>{student.id}</td>
                  <td className={`${td} font-semibold ${dark ? 'text-gray-100' : 'text-gray-900'}`}>{student.name}</td>
                  <td className={`${td} ${dark ? 'text-gray-300' : 'text-gray-600'}`}>{student.email}</td>
                  <td className={`${td} ${dark ? 'text-gray-300' : 'text-gray-600'}`}>{student.phone}</td>
                  <td className={`${td} ${dark ? 'text-gray-300' : 'text-gray-600'}`}>{student.department}</td>
                  <td className={`${td} ${dark ? 'text-gray-300' : 'text-gray-600'}`}>{student.year}</td>
                  <td className={td}><CgpaBadge cgpa={student.cgpa} /></td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onView(student)}
                        className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(student)}
                        className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(student)}
                        className="p-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {!loading && students.length > 0 && (
        <div className={`px-5 py-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 ${dark ? 'border-gray-700' : 'border-gray-100'}`}>
          <div className="flex items-center gap-3">
            <span className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
              {students.length} result{students.length !== 1 ? 's' : ''}
            </span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className={selectCls + ' w-auto py-1.5 text-xs'}
            >
              <option value={5}>5 / page</option>
              <option value={10}>10 / page</option>
              <option value={25}>25 / page</option>
              <option value={50}>50 / page</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className={`text-sm font-medium ${dark ? 'text-gray-200' : 'text-gray-700'}`}>
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
