-- CreateEnum
CREATE TYPE "SenderStatus" AS ENUM ('paired', 'unpaired');

-- CreateTable
CREATE TABLE "WhatsappSender" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "status" "SenderStatus" NOT NULL DEFAULT 'unpaired',
    "aiAgentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WhatsappSender_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WhatsappSender_phone_key" ON "WhatsappSender"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "WhatsappSender_aiAgentId_key" ON "WhatsappSender"("aiAgentId");
