-- CreateEnum
CREATE TYPE "AgentStatus" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "LanguageStyle" AS ENUM ('Formal', 'Profesional', 'Santai', 'Humoris', 'Percakapan_sehari_hari');

-- CreateEnum
CREATE TYPE "KnowledgeCategory" AS ENUM ('Panduan', 'Layanan', 'Produk', 'Best_Practice', 'Tips_Trik');

-- CreateTable
CREATE TABLE "AiAgent" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "company" TEXT,
    "languageStyle" "LanguageStyle" NOT NULL DEFAULT 'Santai',
    "behavior" TEXT NOT NULL,
    "status" "AgentStatus" NOT NULL DEFAULT 'inactive',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "senderId" INTEGER,

    CONSTRAINT "AiAgent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiKnowledge" (
    "id" SERIAL NOT NULL,
    "aiAgentId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "category" "KnowledgeCategory" NOT NULL DEFAULT 'Panduan',
    "contentText" TEXT NOT NULL,
    "filePdf" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiKnowledge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiTestConversation" (
    "id" SERIAL NOT NULL,
    "aiAgentId" INTEGER NOT NULL,
    "userMessage" TEXT NOT NULL,
    "aiResponse" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiTestConversation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AiAgent_senderId_key" ON "AiAgent"("senderId");

-- AddForeignKey
ALTER TABLE "AiAgent" ADD CONSTRAINT "AiAgent_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "WhatsappSender"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiKnowledge" ADD CONSTRAINT "AiKnowledge_aiAgentId_fkey" FOREIGN KEY ("aiAgentId") REFERENCES "AiAgent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiTestConversation" ADD CONSTRAINT "AiTestConversation_aiAgentId_fkey" FOREIGN KEY ("aiAgentId") REFERENCES "AiAgent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
