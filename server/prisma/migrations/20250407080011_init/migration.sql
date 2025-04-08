/*
  Warnings:

  - You are about to drop the column `attachments` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `sharedWith` on the `Vehicle` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Vehicle_id_userId_key";

-- AlterTable
ALTER TABLE "Vehicle" DROP COLUMN "attachments",
DROP COLUMN "sharedWith";

-- CreateTable
CREATE TABLE "VehicleAttachment" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "VehicleAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VehicleAttachment_vehicleId_idx" ON "VehicleAttachment"("vehicleId");

-- CreateIndex
CREATE INDEX "VehicleAttachment_userId_idx" ON "VehicleAttachment"("userId");

-- CreateIndex
CREATE INDEX "Vehicle_userId_idx" ON "Vehicle"("userId");

-- AddForeignKey
ALTER TABLE "VehicleAttachment" ADD CONSTRAINT "VehicleAttachment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleAttachment" ADD CONSTRAINT "VehicleAttachment_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
