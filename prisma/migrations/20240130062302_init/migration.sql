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
    "lastPostNumber" INTEGER NOT NULL DEFAULT 0,

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

-- CreateTable
CREATE TABLE "Comment" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "boardId" UUID NOT NULL,
    "parentId" UUID,
    "posterIp" VARCHAR(256) NOT NULL,
    "numberOnBoard" INTEGER NOT NULL,
    "tripcode" VARCHAR(32),
    "name" VARCHAR(256),
    "email" VARCHAR(256),
    "subject" VARCHAR(256),
    "comment" TEXT,
    "password" VARCHAR(8) NOT NULL,
    "file" VARCHAR(512),
    "fileSize" INTEGER,
    "fileThumb" VARCHAR(512),
    "lastHit" TIMESTAMP(3),
    "isAdminPost" BOOLEAN NOT NULL DEFAULT false,
    "isWipeCandidate" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Board_url_key" ON "Board"("url");

-- CreateIndex
CREATE UNIQUE INDEX "BoardSettings_boardId_key" ON "BoardSettings"("boardId");

-- AddForeignKey
ALTER TABLE "BoardSettings" ADD CONSTRAINT "BoardSettings_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
