-- CreateTable
CREATE TABLE "VehicleShare" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "VehicleShare_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VehicleShare_userId_idx" ON "VehicleShare"("userId");

-- CreateIndex
CREATE INDEX "VehicleShare_vehicleId_idx" ON "VehicleShare"("vehicleId");

-- CreateIndex
CREATE UNIQUE INDEX "VehicleShare_vehicleId_userId_key" ON "VehicleShare"("vehicleId", "userId");

-- AddForeignKey
ALTER TABLE "VehicleShare" ADD CONSTRAINT "VehicleShare_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleShare" ADD CONSTRAINT "VehicleShare_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
