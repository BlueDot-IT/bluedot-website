CREATE TABLE `WeeklyBlogRun` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sourcePacketId` VARCHAR(191) NOT NULL,
    `sourceSha256` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `canonicalUrl` VARCHAR(191) NOT NULL,
    `status` ENUM('STAGED', 'PUBLISHED', 'FAILED_CLOSED') NOT NULL,
    `postId` INTEGER NULL,
    `receipt` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    UNIQUE INDEX `WeeklyBlogRun_sourcePacketId_key`(`sourcePacketId`),
    INDEX `WeeklyBlogRun_slug_idx`(`slug`),
    PRIMARY KEY (`id`),
    CONSTRAINT `WeeklyBlogRun_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
