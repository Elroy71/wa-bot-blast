/*
  Warnings:

  - You are about to drop the column `aiAgentId` on the `WhatsappSender` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "WhatsappSender_aiAgentId_key";

-- AlterTable
ALTER TABLE "WhatsappSender" DROP COLUMN "aiAgentId";
