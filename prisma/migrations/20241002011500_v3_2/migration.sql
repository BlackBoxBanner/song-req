/*
  Warnings:

  - You are about to drop the column `delete` on the `Song` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Song` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[route]` on the table `LiveSession` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `route` to the `LiveSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `liveSessionId` to the `Song` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Song` DROP FOREIGN KEY `Song_userId_fkey`;

-- AlterTable
ALTER TABLE `LiveSession` ADD COLUMN `route` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Song` DROP COLUMN `delete`,
    DROP COLUMN `userId`,
    ADD COLUMN `liveSessionId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `LiveSession_route_key` ON `LiveSession`(`route`);

-- AddForeignKey
ALTER TABLE `Song` ADD CONSTRAINT `Song_liveSessionId_fkey` FOREIGN KEY (`liveSessionId`) REFERENCES `LiveSession`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
