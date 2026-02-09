-- Add role column to user table
ALTER TABLE "user" ADD COLUMN "role" TEXT DEFAULT 'user';

-- Create an admin user (optional, for testing)
-- UPDATE "user" SET "role" = 'admin' WHERE "email" = 'your-email@example.com';
