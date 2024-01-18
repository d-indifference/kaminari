-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'MODERATOR');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" VARCHAR(256) NOT NULL,
    "encryptedPassword" VARCHAR(256) NOT NULL,
    "role" "UserRole" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Board" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "url" VARCHAR(64) NOT NULL,
    "name" VARCHAR(256) NOT NULL,

    CONSTRAINT "Board_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BoardSettings" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "boardId" UUID NOT NULL,
    "enablePosting" BOOLEAN NOT NULL,
    "enableFilesOnThread" BOOLEAN NOT NULL,
    "enableFilesOnReply" BOOLEAN NOT NULL,
    "strictFileOnThread" BOOLEAN NOT NULL,
    "strictFileOnReply" BOOLEAN NOT NULL,
    "enableTripcode" BOOLEAN NOT NULL,
    "enableMarkdown" BOOLEAN NOT NULL,
    "delayBetweenThreads" INTEGER NOT NULL,
    "delayBetweenReplies" INTEGER NOT NULL,
    "threadKeepAliveTime" INTEGER NOT NULL,
    "bumpLimit" INTEGER NOT NULL,
    "strictAnonymousPosting" BOOLEAN NOT NULL,
    "maxThreadCount" INTEGER NOT NULL,
    "additionalRules" TEXT,
    "maxFileSize" INTEGER NOT NULL,
    "maxCommentLength" INTEGER NOT NULL,

    CONSTRAINT "BoardSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Board_url_key" ON "Board"("url");

-- CreateIndex
CREATE UNIQUE INDEX "BoardSettings_boardId_key" ON "BoardSettings"("boardId");

-- AddForeignKey
ALTER TABLE "BoardSettings" ADD CONSTRAINT "BoardSettings_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
