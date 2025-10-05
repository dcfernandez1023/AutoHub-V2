-- CreateEnum
CREATE TYPE "AppLogLevel" AS ENUM ('INFO', 'DEBUG', 'WARNING', 'ERROR');

-- CreateTable
CREATE TABLE "AppLog" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "level" "AppLogLevel" NOT NULL,
    "data" TEXT NOT NULL,

    CONSTRAINT "AppLog_pkey" PRIMARY KEY ("id")
);
