/*
  Warnings:

  - You are about to drop the column `filePath` on the `VehicleAttachment` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `VehicleAttachment` table. All the data in the column will be lost.
  - Added the required column `contentType` to the `VehicleAttachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `path` to the `VehicleAttachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `VehicleAttachment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VehicleAttachment" DROP COLUMN "filePath",
DROP COLUMN "url",
ADD COLUMN     "contentType" TEXT NOT NULL,
ADD COLUMN     "path" TEXT NOT NULL,
ADD COLUMN     "size" BIGINT NOT NULL;
