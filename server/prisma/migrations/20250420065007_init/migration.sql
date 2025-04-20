/*
  Warnings:

  - Added the required column `filePath` to the `VehicleAttachment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VehicleAttachment" ADD COLUMN     "filePath" TEXT NOT NULL;
