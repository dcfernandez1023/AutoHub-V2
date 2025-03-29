/*
  Warnings:

  - A unique constraint covering the columns `[id,userId]` on the table `Vehicle` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_id_userId_key" ON "Vehicle"("id", "userId");
