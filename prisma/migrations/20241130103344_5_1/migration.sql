-- CreateTable
CREATE TABLE `CtfAnswer` (
    `id` VARCHAR(191) NOT NULL,
    `answer` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `CtfAnswer_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
