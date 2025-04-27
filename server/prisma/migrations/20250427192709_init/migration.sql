/*
  Warnings:

  - A unique constraint covering the columns `[userId,name]` on the table `ScheduledServiceType` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ScheduledServiceType_userId_name_key" ON "ScheduledServiceType"("userId", "name");
