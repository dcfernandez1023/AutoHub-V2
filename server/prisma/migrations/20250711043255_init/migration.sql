/*
  Warnings:

  - You are about to drop the column `image` on the `Vehicle` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Vehicle" DROP COLUMN "image",
ADD COLUMN     "base64Image" TEXT;
