-- AlterTable
ALTER TABLE `Song` ADD COLUMN `deleted` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `LiveSessionAccess` (
    `id` VARCHAR(191) NOT NULL,
    `liveSessionId` VARCHAR(191) NOT NULL,
    `accessCount` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `LiveSessionAccess` ADD CONSTRAINT `LiveSessionAccess_liveSessionId_fkey` FOREIGN KEY (`liveSessionId`) REFERENCES `LiveSession`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
