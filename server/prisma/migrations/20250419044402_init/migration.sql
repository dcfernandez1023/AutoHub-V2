-- DropForeignKey
ALTER TABLE "Vehicle" DROP CONSTRAINT "Vehicle_userId_fkey";

-- DropForeignKey
ALTER TABLE "VehicleAttachment" DROP CONSTRAINT "VehicleAttachment_userId_fkey";

-- DropForeignKey
ALTER TABLE "VehicleAttachment" DROP CONSTRAINT "VehicleAttachment_vehicleId_fkey";

-- DropForeignKey
ALTER TABLE "VehicleShare" DROP CONSTRAINT "VehicleShare_userId_fkey";

-- DropForeignKey
ALTER TABLE "VehicleShare" DROP CONSTRAINT "VehicleShare_vehicleId_fkey";

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleAttachment" ADD CONSTRAINT "VehicleAttachment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleAttachment" ADD CONSTRAINT "VehicleAttachment_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleShare" ADD CONSTRAINT "VehicleShare_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleShare" ADD CONSTRAINT "VehicleShare_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
