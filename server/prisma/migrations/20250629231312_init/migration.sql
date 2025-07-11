/*
  Warnings:

  - You are about to drop the column `base64Image` on the `Vehicle` table. All the data in the column will be lost.
  - Added the required column `image` to the `Vehicle` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vehicle" DROP COLUMN "base64Image",
ADD COLUMN     "image" TEXT NOT NULL;
