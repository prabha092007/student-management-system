import { Users, Building2, GraduationCap, TrendingUp, TrendingDown, Award } from 'lucide-react';
import type { StudentStats } from '@/types/student';

interface StatsCardsProps {
  stats: StudentStats;
  dark: boolean;
}

export function StatsCards({ stats, dark }: StatsCardsProps) {
  const cards = [
    {
      label: 'Total Students',
      value: stats.totalStudents,
      icon: <Users className="w-6 h-6" />,
      bg: dark ? 'bg-blue-900/40' : 'bg-blue-50',
      text: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Departments',
      value: stats.totalDepartments,
      icon: <Building2 className="w-6 h-6" />,
      bg: dark ? 'bg-emerald-900/40' : 'bg-emerald-50',
      text: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      label: 'Average CGPA',
      value: stats.averageCgpa.toFixed(2),
      icon: <GraduationCap className="w-6 h-6" />,
      bg: dark ? 'bg-amber-900/40' : 'bg-amber-50',
      text: 'text-amber-600 dark:text-amber-400',
    },
    {
      label: 'Highest CGPA',
      value: stats.highestCgpa.toFixed(2),
      icon: <TrendingUp className="w-6 h-6" />,
      bg: dark ? 'bg-teal-900/40' : 'bg-teal-50',
      text: 'text-teal-600 dark:text-teal-400',
    },
    {
      label: 'Lowest CGPA',
      value: stats.lowestCgpa.toFixed(2),
      icon: <TrendingDown className="w-6 h-6" />,
      bg: dark ? 'bg-rose-900/40' : 'bg-rose-50',
      text: 'text-rose-600 dark:text-rose-400',
    },
    {
      label: 'Top Department',
      value: stats.topDepartment,
      icon: <Award className="w-6 h-6" />,
      bg: dark ? 'bg-indigo-900/40' : 'bg-indigo-50',
      text: 'text-indigo-600 dark:text-indigo-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`rounded-2xl border shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow ${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}
        >
          <div
            className={`${card.bg} ${card.text} w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0`}
          >
            {card.icon}
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium truncate">{card.label}</p>
            <p className={`text-2xl font-bold mt-0.5 truncate ${dark ? 'text-gray-100' : 'text-gray-900'}`}>{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
