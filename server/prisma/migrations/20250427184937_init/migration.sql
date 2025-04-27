-- CreateEnum
CREATE TYPE "TimeUnits" AS ENUM ('DAY', 'WEEK', 'MONTH', 'YEAR');

-- CreateTable
CREATE TABLE "ScheduledServiceType" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ScheduledServiceType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduledServiceInstance" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "scheduledServiceTypeId" TEXT NOT NULL,
    "mileInterval" INTEGER NOT NULL,
    "timeInterval" INTEGER NOT NULL,
    "timeUnits" "TimeUnits" NOT NULL,

    CONSTRAINT "ScheduledServiceInstance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ScheduledServiceType_userId_idx" ON "ScheduledServiceType"("userId");

-- CreateIndex
CREATE INDEX "ScheduledServiceInstance_userId_idx" ON "ScheduledServiceInstance"("userId");

-- CreateIndex
CREATE INDEX "ScheduledServiceInstance_vehicleId_idx" ON "ScheduledServiceInstance"("vehicleId");

-- CreateIndex
CREATE INDEX "ScheduledServiceInstance_scheduledServiceTypeId_idx" ON "ScheduledServiceInstance"("scheduledServiceTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "ScheduledServiceInstance_vehicleId_scheduledServiceTypeId_key" ON "ScheduledServiceInstance"("vehicleId", "scheduledServiceTypeId");

-- AddForeignKey
ALTER TABLE "ScheduledServiceType" ADD CONSTRAINT "ScheduledServiceType_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduledServiceInstance" ADD CONSTRAINT "ScheduledServiceInstance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduledServiceInstance" ADD CONSTRAINT "ScheduledServiceInstance_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduledServiceInstance" ADD CONSTRAINT "ScheduledServiceInstance_scheduledServiceTypeId_fkey" FOREIGN KEY ("scheduledServiceTypeId") REFERENCES "ScheduledServiceType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
