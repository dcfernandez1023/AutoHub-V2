import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const environment = process.argv[2];

const envFile = environment === 'dev' ? '.env.dev' : '.env.prod';
dotenv.config({ path: envFile });

const provider = 'postgresql';
const providerUrl = process.env.DATABASE_URL;

// Define the schema file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const schemaPath = path.join(__dirname, '../prisma/schema.prisma');

const schema = `
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "${provider}"
  url      = "${providerUrl}"
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

  vehicle   Vehicle  @relation(fields: [vehicleId], references: [id], onDelete: Cascade)
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([vehicleId])
}

enum Role {
  USER
  ADMIN
}
`;

// Write the updated schema back to the file
fs.writeFileSync(schemaPath, schema);

console.log(`✅ Prisma schema updated: Using ${provider}`);
