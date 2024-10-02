/*
  Warnings:

  - You are about to drop the column `liveSessionId` on the `LiveParticipant` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `LiveParticipant` DROP FOREIGN KEY `LiveParticipant_liveSessionId_fkey`;

-- AlterTable
ALTER TABLE `LiveParticipant` DROP COLUMN `liveSessionId`;

-- CreateTable
CREATE TABLE `LiveParticipantOnSessions` (
    `liveSessionId` VARCHAR(191) NOT NULL,
    `liveParticipantId` VARCHAR(191) NOT NULL,
    `assignedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `assignedBy` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`liveSessionId`, `liveParticipantId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `LiveParticipantOnSessions` ADD CONSTRAINT `LiveParticipantOnSessions_liveSessionId_fkey` FOREIGN KEY (`liveSessionId`) REFERENCES `LiveSession`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LiveParticipantOnSessions` ADD CONSTRAINT `LiveParticipantOnSessions_liveParticipantId_fkey` FOREIGN KEY (`liveParticipantId`) REFERENCES `LiveParticipant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
