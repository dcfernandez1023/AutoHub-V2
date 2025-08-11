/*
  Warnings:

  - Added the required column `name` to the `RepairLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RepairLog" ADD COLUMN     "name" TEXT NOT NULL;
