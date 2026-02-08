-- Barbershop Booking System Database Schema
-- For Neon PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- USERS TABLE
-- =============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(20) DEFAULT 'client' CHECK (role IN ('client', 'barber', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for email lookups
CREATE INDEX idx_users_email ON users(email);

-- =============================================
-- SERVICES TABLE
-- =============================================
CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  duration INTEGER NOT NULL, -- in minutes
  price DECIMAL(10,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- BARBERS TABLE
-- =============================================
CREATE TABLE barbers (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  bio TEXT,
  avatar_url VARCHAR(500),
  working_hours JSONB NOT NULL DEFAULT '{
    "monday": {"start": "09:00", "end": "18:00", "isWorking": true},
    "tuesday": {"start": "09:00", "end": "18:00", "isWorking": true},
    "wednesday": {"start": "09:00", "end": "18:00", "isWorking": true},
    "thursday": {"start": "09:00", "end": "18:00", "isWorking": true},
    "friday": {"start": "09:00", "end": "18:00", "isWorking": true},
    "saturday": {"start": "09:00", "end": "17:00", "isWorking": true},
    "sunday": {"start": "00:00", "end": "00:00", "isWorking": false}
  }',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for active barbers
CREATE INDEX idx_barbers_active ON barbers(is_active);

-- =============================================
-- BOOKINGS TABLE
-- =============================================
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  barber_id INTEGER REFERENCES barbers(id) ON DELETE CASCADE,
  service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
  customer_name VARCHAR(100) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20),
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for booking queries
CREATE INDEX idx_bookings_date ON bookings(date);
CREATE INDEX idx_bookings_barber_date ON bookings(barber_id, date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_user ON bookings(user_id);

-- Prevent overlapping bookings for the same barber
CREATE UNIQUE INDEX idx_no_overlap_bookings ON bookings (barber_id, date, start_time)
  WHERE status NOT IN ('cancelled');

-- =============================================
-- BLOCKED TIMES TABLE
-- =============================================
CREATE TABLE blocked_times (
  id SERIAL PRIMARY KEY,
  barber_id INTEGER REFERENCES barbers(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  reason VARCHAR(255),
  is_all_day BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for blocked times lookup
CREATE INDEX idx_blocked_times_barber_date ON blocked_times(barber_id, date);

-- =============================================
-- OTP TOKENS TABLE (for email authentication)
-- =============================================
CREATE TABLE otp_tokens (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  token VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for OTP lookup
CREATE INDEX idx_otp_email ON otp_tokens(email, used);

-- =============================================
-- SEED DATA (Optional - for testing)
-- =============================================

-- Insert default services
INSERT INTO services (name, description, duration, price) VALUES
  ('Classic Haircut', 'Traditional haircut with clippers and scissors', 30, 150.00),
  ('Beard Trim', 'Professional beard shaping and grooming', 20, 80.00),
  ('Haircut + Beard', 'Complete haircut and beard grooming package', 45, 200.00),
  ('Kids Haircut', 'Haircut for children under 12', 25, 100.00),
  ('Hot Towel Shave', 'Traditional straight razor shave with hot towel', 30, 120.00),
  ('Hair Styling', 'Styling and finishing for special occasions', 20, 60.00);

-- Insert sample barber
INSERT INTO barbers (name, email, phone, bio) VALUES
  ('Ahmed Hassan', 'ahmed@barbershop.com', '+251911234567', 'Master barber with 10+ years experience');
