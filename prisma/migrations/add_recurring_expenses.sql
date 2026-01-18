-- Add RecurringExpense table to Supabase
-- Run this in Supabase SQL Editor

-- Create RecurringExpense table
CREATE TABLE IF NOT EXISTS "RecurringExpense" (
  "id" SERIAL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "amountCents" INTEGER NOT NULL,
  "category" TEXT NOT NULL,
  "note" TEXT,
  "frequency" TEXT NOT NULL,
  "dayOfWeek" INTEGER,
  "dayOfMonth" INTEGER,
  "monthOfYear" INTEGER,
  "nextDate" TEXT NOT NULL,
  "endDate" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "RecurringExpense_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create indexes for RecurringExpense
CREATE INDEX IF NOT EXISTS "RecurringExpense_userId_idx" ON "RecurringExpense"("userId");
CREATE INDEX IF NOT EXISTS "RecurringExpense_userId_nextDate_idx" ON "RecurringExpense"("userId", "nextDate");

-- Create trigger for auto-updating updatedAt on RecurringExpense
DROP TRIGGER IF EXISTS update_recurring_expense_updated_at ON "RecurringExpense";
CREATE TRIGGER update_recurring_expense_updated_at
  BEFORE UPDATE ON "RecurringExpense"
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
