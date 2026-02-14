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
        <Button variant="ghost" size="sm" onClick={prevMonth} disabled={isBefore(endOfMonth(subMonths(currentMonth, 0)), today)} className="text-[#94A3B8] hover:text-[#F5B700]">
          &lt;
        </Button>
        <span className="font-bold text-lg text-[#F8FAFC]">
          {format(currentMonth, 'MMMM yyyy')}
        </span>
        <Button variant="ghost" size="sm" onClick={nextMonth} className="text-[#94A3B8] hover:text-[#F5B700]">
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
          <div key={day} className="text-center text-xs font-bold text-[#64748B] py-1">
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
              ${!isCurrentMonth ? 'text-[#334155]' : isDisabled ? 'text-[#334155] cursor-not-allowed' : 'text-[#94A3B8] hover:bg-[#1E293B] hover:text-[#F8FAFC]'}
              ${isSelected ? 'bg-[#F5B700] text-[#0F172A] hover:bg-[#FFC933] shadow-md shadow-[#F5B700]/20 transform scale-105 font-bold' : ''}
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
    <div className="bg-[#0F172A] p-4 rounded-xl border border-[#1E293B]">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
}
