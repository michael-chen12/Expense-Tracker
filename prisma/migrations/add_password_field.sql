-- Add password field to User table
-- Run this in Supabase SQL Editor if the password column doesn't exist yet

-- Add password column to User table (nullable for OAuth users)
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "password" TEXT;
