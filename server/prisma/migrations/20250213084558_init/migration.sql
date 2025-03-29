/*
  Warnings:

  - You are about to alter the column `mileage` on the `Vehicle` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Vehicle" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mileage" BIGINT NOT NULL,
    "year" INTEGER NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "licensePlate" TEXT NOT NULL,
    "vin" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "dateCreated" BIGINT NOT NULL,
    "sharedWith" TEXT NOT NULL,
    "base64Image" TEXT,
    CONSTRAINT "Vehicle_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Vehicle" ("base64Image", "dateCreated", "id", "licensePlate", "make", "mileage", "model", "name", "notes", "sharedWith", "userId", "vin", "year") SELECT "base64Image", "dateCreated", "id", "licensePlate", "make", "mileage", "model", "name", "notes", "sharedWith", "userId", "vin", "year" FROM "Vehicle";
DROP TABLE "Vehicle";
ALTER TABLE "new_Vehicle" RENAME TO "Vehicle";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
