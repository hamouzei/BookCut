import { getSql } from './index';
import type { BlockedTime } from '@/types';

// Get blocked times for a barber on a specific date
export async function getBlockedTimes(
  barberId: number,
  date: string
): Promise<BlockedTime[]> {
  const sql = getSql();
  const result = await sql`
    SELECT id, barber_id, date, start_time, end_time, reason, is_all_day
    FROM blocked_times
    WHERE barber_id = ${barberId} AND date = ${date}
    ORDER BY start_time
  `;
  return result.map(row => ({
    id: row.id,
    barberId: row.barber_id,
    date: row.date,
    startTime: row.start_time,
    endTime: row.end_time,
    reason: row.reason,
    isAllDay: row.is_all_day,
  })) as BlockedTime[];
}

// Get blocked times for a date range
export async function getBlockedTimesRange(
  barberId: number,
  startDate: string,
  endDate: string
): Promise<BlockedTime[]> {
  const sql = getSql();
  const result = await sql`
    SELECT id, barber_id, date, start_time, end_time, reason, is_all_day
    FROM blocked_times
    WHERE barber_id = ${barberId} 
      AND date >= ${startDate} 
      AND date <= ${endDate}
    ORDER BY date, start_time
  `;
  return result.map(row => ({
    id: row.id,
    barberId: row.barber_id,
    date: row.date,
    startTime: row.start_time,
    endTime: row.end_time,
    reason: row.reason,
    isAllDay: row.is_all_day,
  })) as BlockedTime[];
}

// Create a blocked time
export async function createBlockedTime(data: {
  barberId: number;
  date: string;
  startTime: string;
  endTime: string;
  reason?: string;
  isAllDay?: boolean;
}): Promise<BlockedTime> {
  const sql = getSql();
  const result = await sql`
    INSERT INTO blocked_times (barber_id, date, start_time, end_time, reason, is_all_day)
    VALUES (${data.barberId}, ${data.date}, ${data.startTime}, ${data.endTime}, 
            ${data.reason || null}, ${data.isAllDay || false})
    RETURNING id, barber_id, date, start_time, end_time, reason, is_all_day
  `;
  const row = result[0];
  return {
    id: row.id,
    barberId: row.barber_id,
    date: row.date,
    startTime: row.start_time,
    endTime: row.end_time,
    reason: row.reason,
    isAllDay: row.is_all_day,
  } as BlockedTime;
}

// Delete a blocked time
export async function deleteBlockedTime(id: number): Promise<boolean> {
  const sql = getSql();
  const result = await sql`
    DELETE FROM blocked_times
    WHERE id = ${id}
    RETURNING id
  `;
  return result.length > 0;
}

// Block an entire day
export async function blockEntireDay(
  barberId: number,
  date: string,
  reason?: string
): Promise<BlockedTime> {
  return createBlockedTime({
    barberId,
    date,
    startTime: '00:00',
    endTime: '23:59',
    reason,
    isAllDay: true,
  });
}
