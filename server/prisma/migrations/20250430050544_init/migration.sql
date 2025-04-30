-- CreateTable
CREATE TABLE "ScheduledLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "scheduledServiceInstanceId" TEXT NOT NULL,
    "datePerformed" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mileage" INTEGER NOT NULL,
    "partsCost" INTEGER NOT NULL,
    "laborCost" INTEGER NOT NULL,
    "totalCost" INTEGER NOT NULL,
    "notes" TEXT NOT NULL,

    CONSTRAINT "ScheduledLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RepairLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "datePerformed" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mileage" INTEGER NOT NULL,
    "partsCost" INTEGER NOT NULL,
    "laborCost" INTEGER NOT NULL,
    "totalCost" INTEGER NOT NULL,
    "notes" TEXT NOT NULL,

    CONSTRAINT "RepairLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ScheduledLog_userId_idx" ON "ScheduledLog"("userId");

-- CreateIndex
CREATE INDEX "ScheduledLog_vehicleId_idx" ON "ScheduledLog"("vehicleId");

-- CreateIndex
CREATE INDEX "ScheduledLog_scheduledServiceInstanceId_idx" ON "ScheduledLog"("scheduledServiceInstanceId");

-- CreateIndex
CREATE INDEX "RepairLog_userId_idx" ON "RepairLog"("userId");

-- CreateIndex
CREATE INDEX "RepairLog_vehicleId_idx" ON "RepairLog"("vehicleId");

-- AddForeignKey
ALTER TABLE "ScheduledLog" ADD CONSTRAINT "ScheduledLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduledLog" ADD CONSTRAINT "ScheduledLog_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduledLog" ADD CONSTRAINT "ScheduledLog_scheduledServiceInstanceId_fkey" FOREIGN KEY ("scheduledServiceInstanceId") REFERENCES "ScheduledServiceInstance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepairLog" ADD CONSTRAINT "RepairLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepairLog" ADD CONSTRAINT "RepairLog_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
