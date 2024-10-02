/*
  Warnings:

  - You are about to drop the column `limit` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `live` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `Domain` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Domain` DROP FOREIGN KEY `Domain_userId_fkey`;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `limit`,
    DROP COLUMN `live`;

-- DropTable
DROP TABLE `Domain`;

-- CreateTable
CREATE TABLE `LiveSession` (
    `id` VARCHAR(191) NOT NULL,
    `limit` INTEGER NOT NULL DEFAULT 10,
    `live` BOOLEAN NOT NULL DEFAULT false,
    `allowRequest` BOOLEAN NOT NULL DEFAULT false,
    `createBy` VARCHAR(191) NOT NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `default` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LiveParticipant` (
    `id` VARCHAR(191) NOT NULL,
    `liveSessionId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `LiveSession` ADD CONSTRAINT `LiveSession_createBy_fkey` FOREIGN KEY (`createBy`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LiveParticipant` ADD CONSTRAINT `LiveParticipant_liveSessionId_fkey` FOREIGN KEY (`liveSessionId`) REFERENCES `LiveSession`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LiveParticipant` ADD CONSTRAINT `LiveParticipant_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
