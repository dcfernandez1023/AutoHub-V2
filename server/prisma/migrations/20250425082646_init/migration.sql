-- CreateTable
CREATE TABLE "VehicleChangelog" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "VehicleChangelog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VehicleChangelog_userId_idx" ON "VehicleChangelog"("userId");

-- CreateIndex
CREATE INDEX "VehicleChangelog_vehicleId_idx" ON "VehicleChangelog"("vehicleId");

-- AddForeignKey
ALTER TABLE "VehicleChangelog" ADD CONSTRAINT "VehicleChangelog_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleChangelog" ADD CONSTRAINT "VehicleChangelog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
