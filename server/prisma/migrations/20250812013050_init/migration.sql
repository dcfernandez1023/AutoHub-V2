/*
  Warnings:

  - Added the required column `filename` to the `VehicleAttachment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VehicleAttachment" ADD COLUMN     "filename" TEXT NOT NULL;
