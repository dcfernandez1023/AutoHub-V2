import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const environment = process.argv[2];

const envFile = environment === 'dev' ? '.env.dev' : '.env.prod';
dotenv.config({ path: envFile });

const provider = 'postgresql';
const providerUrl = process.env.DATABASE_URL;
const directUrl = process.env.DIRECT_URL;

// Define the schema file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const schemaPath = path.join(__dirname, '../prisma/schema.prisma');

const schema = `
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "${provider}"
  url       = "${providerUrl}"
  directUrl = "${directUrl}"
}

model User {
  id         String @id @default(uuid())
  username   String @unique
  email      String @unique
  password   String
  role       Role   @default(USER)
  registered Int @default(0)

  Vehicle      Vehicle[]
  attachments  VehicleAttachment[]
  VehicleShare VehicleShare[]
  VehicleChangelog VehicleChangelog[]
  ScheduledServiceType ScheduledServiceType[]

  ScheduledServiceInstance ScheduledServiceInstance[]

  ScheduledLog ScheduledLog[]

  RepairLog RepairLog[]
}

model Vehicle {
  id            String   @id @default(uuid())
  userId        String
  name          String
  mileage       Int
  year          Int
  make          String
  model         String
  licensePlate  String
  vin           String
  notes         String
  dateCreated   BigInt
  base64Image   String?

  // Relation with User
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  attachments   VehicleAttachment[]

  @@index([userId])
  VehicleShare VehicleShare[]
  VehicleChangelog VehicleChangelog[]
  ScheduledServiceInstance ScheduledServiceInstance[]
  ScheduledLog ScheduledLog[]
  RepairLog RepairLog[]
}

model VehicleAttachment {
  id        String   @id @default(uuid())
  vehicleId String
  userId    String
  url       String
  filePath  String

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  vehicle   Vehicle  @relation(fields: [vehicleId], references: [id], onDelete: Cascade)

  @@index([vehicleId])
  @@index([userId])
}

model VehicleShare {
  id        String   @id @default(uuid())
  vehicleId String
  userId    String

  vehicle   Vehicle  @relation(fields: [vehicleId], references: [id], onDelete: Cascade)
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([vehicleId, userId]) // Prevent duplicate shares
  @@index([userId])
  @@index([vehicleId])
}

model VehicleChangelog {
  id          String   @id @default(uuid())
  vehicleId   String
  userId      String
  description String
  dateCreated DateTime @default(now())

  vehicle     Vehicle  @relation(fields: [vehicleId], references: [id], onDelete: Cascade)
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([vehicleId])
}

model ScheduledServiceType {
  id     String @id @default(uuid())
  userId String
  name   String

  user   User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  ScheduledServiceInstance ScheduledServiceInstance[]

  @@unique([userId, name]) // Prevents duplicate names for a user's scheduled service types
  @@index([userId])
}

model ScheduledServiceInstance {
  id                     String @id @default(uuid())
  userId                 String
  vehicleId              String
  scheduledServiceTypeId String
  mileInterval           Int
  timeInterval           Int
  timeUnits              TimeUnits

  user                   User                     @relation(fields: [userId], references: [id], onDelete: Cascade)
  vehicle                Vehicle                  @relation(fields: [vehicleId], references: [id], onDelete: Cascade)
  scheduledServiceType   ScheduledServiceType     @relation(fields: [scheduledServiceTypeId], references: [id], onDelete: Cascade)

  @@unique([vehicleId, scheduledServiceTypeId]) // Only one ScheduledServiceInstance can be created for a single Vehicle and ScheduledServiceType
  @@index([userId])
  @@index([vehicleId])
  @@index([scheduledServiceTypeId])
  ScheduledLog ScheduledLog[]
}

model ScheduledLog {
  id                         String @id @default(uuid())
  userId                     String
  vehicleId                  String
  scheduledServiceInstanceId String
  datePerformed              DateTime @default(now())
  mileage                    Int
  partsCost                  Int
  laborCost                  Int
  totalCost                  Int
  notes                      String

  user                       User                     @relation(fields: [userId], references: [id], onDelete: Cascade)
  vehicle                    Vehicle                  @relation(fields: [vehicleId], references: [id], onDelete: Cascade)
  scheduledServiceInstance   ScheduledServiceInstance @relation(fields: [scheduledServiceInstanceId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([vehicleId])
  @@index([scheduledServiceInstanceId])
}

model RepairLog {
  id                         String @id @default(uuid())
  userId                     String
  vehicleId                  String
  datePerformed              DateTime @default(now())
  mileage                    Int
  partsCost                  Int
  laborCost                  Int
  totalCost                  Int
  notes                      String

  user                       User                     @relation(fields: [userId], references: [id], onDelete: Cascade)
  vehicle                    Vehicle                  @relation(fields: [vehicleId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([vehicleId])
}

enum Role {
  USER
  ADMIN
}

enum TimeUnits {
  DAY
  WEEK
  MONTH
  YEAR
}
`;

// Write the updated schema back to the file
fs.writeFileSync(schemaPath, schema);

console.log(`✅ Prisma schema updated: Using ${provider}`);
