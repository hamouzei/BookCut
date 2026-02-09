'use client';

import { useState } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  isBefore,
  startOfDay
} from 'date-fns';
import { Button } from '@/components/ui';

interface DateCalendarProps {
  selectedDate: Date | null;
  onSelect: (date: Date) => void;
}

export function DateCalendar({ selectedDate, onSelect }: DateCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = startOfDay(new Date());

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center mb-4">
        <Button variant="ghost" size="sm" onClick={prevMonth} disabled={isBefore(endOfMonth(subMonths(currentMonth, 0)), today)}>
          &lt;
        </Button>
        <span className="font-bold text-lg text-slate-700">
          {format(currentMonth, 'MMMM yyyy')}
        </span>
        <Button variant="ghost" size="sm" onClick={nextMonth}>
          &gt;
        </Button>
      </div>
    );
  };

  const renderDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="grid grid-cols-7 mb-2">
        {days.map(day => (
          <div key={day} className="text-center text-xs font-bold text-slate-500 py-1">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, 'd');
        const cloneDay = day;
        const isDisabled = isBefore(day, today);
        const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
        const isCurrentMonth = isSameMonth(day, monthStart);

        days.push(
          <div
            key={day.toString()}
            className={`
              p-2 text-center relative cursor-pointer m-1 rounded-full transition-all
              ${!isCurrentMonth ? 'text-slate-300' : isDisabled ? 'text-slate-300 cursor-not-allowed' : 'text-slate-700 hover:bg-slate-100'}
              ${isSelected ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-md transform scale-105' : ''}
            `}
            onClick={() => !isDisabled && onSelect(cloneDay)}
          >
            <span className="text-sm font-medium">{formattedDate}</span>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
}
