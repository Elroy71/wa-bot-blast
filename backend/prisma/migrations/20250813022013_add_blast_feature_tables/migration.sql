-- CreateEnum
CREATE TYPE "BlastStatus" AS ENUM ('SCHEDULED', 'SENDING', 'COMPLETED', 'FAILED', 'PAUSED');

-- CreateEnum
CREATE TYPE "MessageStatus" AS ENUM ('PENDING', 'SENT', 'DELIVERED', 'READ', 'FAILED');

-- CreateTable
CREATE TABLE "Blast" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" "BlastStatus" NOT NULL DEFAULT 'SCHEDULED',
    "whatsappSenderId" INTEGER NOT NULL,
    "scheduledAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Blast_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlastGroup" (
    "blastId" INTEGER NOT NULL,
    "groupId" INTEGER NOT NULL,

    CONSTRAINT "BlastGroup_pkey" PRIMARY KEY ("blastId","groupId")
);

-- CreateTable
CREATE TABLE "BlastAttachment" (
    "id" SERIAL NOT NULL,
    "blastId" INTEGER NOT NULL,
    "filePath" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlastAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlastRecipientLog" (
    "id" SERIAL NOT NULL,
    "blastId" INTEGER NOT NULL,
    "contactId" INTEGER NOT NULL,
    "status" "MessageStatus" NOT NULL DEFAULT 'PENDING',
    "sentAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "readAt" TIMESTAMP(3),
    "failedReason" TEXT,

    CONSTRAINT "BlastRecipientLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BlastRecipientLog_blastId_contactId_key" ON "BlastRecipientLog"("blastId", "contactId");

-- AddForeignKey
ALTER TABLE "Blast" ADD CONSTRAINT "Blast_whatsappSenderId_fkey" FOREIGN KEY ("whatsappSenderId") REFERENCES "WhatsappSender"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlastGroup" ADD CONSTRAINT "BlastGroup_blastId_fkey" FOREIGN KEY ("blastId") REFERENCES "Blast"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlastGroup" ADD CONSTRAINT "BlastGroup_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlastAttachment" ADD CONSTRAINT "BlastAttachment_blastId_fkey" FOREIGN KEY ("blastId") REFERENCES "Blast"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlastRecipientLog" ADD CONSTRAINT "BlastRecipientLog_blastId_fkey" FOREIGN KEY ("blastId") REFERENCES "Blast"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlastRecipientLog" ADD CONSTRAINT "BlastRecipientLog_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;
