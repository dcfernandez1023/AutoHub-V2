-- CreateTable
CREATE TABLE "VehicleAttachmentFile" (
    "attachmentId" TEXT NOT NULL,
    "contents" BYTEA NOT NULL,

    CONSTRAINT "VehicleAttachmentFile_pkey" PRIMARY KEY ("attachmentId")
);

-- AddForeignKey
ALTER TABLE "VehicleAttachmentFile" ADD CONSTRAINT "VehicleAttachmentFile_attachmentId_fkey" FOREIGN KEY ("attachmentId") REFERENCES "VehicleAttachment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
