-- CreateTable
CREATE TABLE `Ctf` (
    `id` VARCHAR(191) NOT NULL,
    `position` ENUM('FIRST', 'SECOND', 'THIRD', 'FOURTH') NOT NULL,
    `contact` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Ctf_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
