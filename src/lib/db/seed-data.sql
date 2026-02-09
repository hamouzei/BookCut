-- Seed initial data for Barbershop Booking
-- Run this in your Neon SQL Editor

-- 1. Insert Services
INSERT INTO services (name, description, duration, price, is_active) VALUES
('Standard Haircut', 'Classic precision cut with styling.', 30, 25, true),
('Premium Haircut', 'Wash, cut, hot towel, and styling.', 45, 40, true),
('Beard Trim', 'Sharp line-up and trim with beard oil.', 20, 15, true),
('Full Service', 'Premium haircut + Beard trim.', 60, 50, true);

-- 2. Insert Barbers
-- Note: working_hours is JSON in the format: { "monday": { "start": "09:00", "end": "18:00", "isWorking": true }, ... }
INSERT INTO barbers (name, email, phone, bio, working_hours, is_active) VALUES
('John Doe', 'john@example.com', '123-456-7890', 'Master barber with 10 years experience.', 
 '{
    "monday": {"start": "09:00", "end": "18:00", "isWorking": true},
    "tuesday": {"start": "09:00", "end": "18:00", "isWorking": true},
    "wednesday": {"start": "09:00", "end": "18:00", "isWorking": true},
    "thursday": {"start": "09:00", "end": "18:00", "isWorking": true},
    "friday": {"start": "09:00", "end": "18:00", "isWorking": true},
    "saturday": {"start": "10:00", "end": "16:00", "isWorking": true},
    "sunday": {"start": "00:00", "end": "00:00", "isWorking": false}
 }', true),
('Jane Smith', 'jane@example.com', '098-765-4321', 'Expert in fades and modern styling.', 
 '{
    "monday": {"start": "09:00", "end": "18:00", "isWorking": true},
    "tuesday": {"start": "09:00", "end": "18:00", "isWorking": true},
    "wednesday": {"start": "00:00", "end": "00:00", "isWorking": false},
    "thursday": {"start": "09:00", "end": "18:00", "isWorking": true},
    "friday": {"start": "09:00", "end": "18:00", "isWorking": true},
    "saturday": {"start": "09:00", "end": "18:00", "isWorking": true},
    "sunday": {"start": "00:00", "end": "00:00", "isWorking": false}
 }', true);
