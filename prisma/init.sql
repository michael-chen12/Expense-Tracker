-- Create tables for Expense Tracker
-- Run this in Supabase SQL Editor

-- Create User table
CREATE TABLE IF NOT EXISTS "User" (
  "id" TEXT PRIMARY KEY,
  "email" TEXT UNIQUE NOT NULL,
  "githubId" TEXT UNIQUE,
  "name" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Expense table
CREATE TABLE IF NOT EXISTS "Expense" (
  "id" SERIAL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "amountCents" INTEGER NOT NULL,
  "category" TEXT NOT NULL,
  "date" TEXT NOT NULL,
  "note" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Expense_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create FixedCost table
CREATE TABLE IF NOT EXISTS "FixedCost" (
  "id" SERIAL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "amountCents" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FixedCost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create Allowance table
CREATE TABLE IF NOT EXISTS "Allowance" (
  "id" SERIAL PRIMARY KEY,
  "userId" TEXT UNIQUE NOT NULL,
  "amountCents" INTEGER NOT NULL,
  "cadence" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Allowance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "Expense_userId_date_idx" ON "Expense"("userId", "date");
CREATE INDEX IF NOT EXISTS "Expense_userId_category_idx" ON "Expense"("userId", "category");
CREATE INDEX IF NOT EXISTS "FixedCost_userId_idx" ON "FixedCost"("userId");

-- Create trigger function to auto-update updatedAt
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for auto-updating updatedAt
DROP TRIGGER IF EXISTS update_user_updated_at ON "User";
CREATE TRIGGER update_user_updated_at BEFORE UPDATE ON "User" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_expense_updated_at ON "Expense";
CREATE TRIGGER update_expense_updated_at BEFORE UPDATE ON "Expense" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_fixedcost_updated_at ON "FixedCost";
CREATE TRIGGER update_fixedcost_updated_at BEFORE UPDATE ON "FixedCost" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_allowance_updated_at ON "Allowance";
CREATE TRIGGER update_allowance_updated_at BEFORE UPDATE ON "Allowance" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
