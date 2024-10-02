-- DropForeignKey
ALTER TABLE `LiveParticipant` DROP FOREIGN KEY `LiveParticipant_liveSessionId_fkey`;

-- DropForeignKey
ALTER TABLE `LiveParticipant` DROP FOREIGN KEY `LiveParticipant_userId_fkey`;

-- DropForeignKey
ALTER TABLE `LiveSession` DROP FOREIGN KEY `LiveSession_createBy_fkey`;

-- AddForeignKey
ALTER TABLE `LiveSession` ADD CONSTRAINT `LiveSession_createBy_fkey` FOREIGN KEY (`createBy`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LiveParticipant` ADD CONSTRAINT `LiveParticipant_liveSessionId_fkey` FOREIGN KEY (`liveSessionId`) REFERENCES `LiveSession`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LiveParticipant` ADD CONSTRAINT `LiveParticipant_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
