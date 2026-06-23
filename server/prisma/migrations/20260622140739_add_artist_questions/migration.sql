-- CreateTable
CREATE TABLE `artist_account` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(200) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `name` VARCHAR(100) NULL,
    `avatar` VARCHAR(500) NULL,
    `role` VARCHAR(50) NOT NULL DEFAULT 'artist',
    `emailVerified` BOOLEAN NOT NULL DEFAULT false,
    `status` INTEGER NOT NULL DEFAULT 1,
    `createTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateTime` DATETIME(3) NOT NULL,

    UNIQUE INDEX `artist_account_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `artist_profiles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `accountId` INTEGER NOT NULL,
    `displayName` VARCHAR(200) NULL,
    `title` VARCHAR(100) NULL DEFAULT 'Artiste',
    `nationality` VARCHAR(100) NULL,
    `city` VARCHAR(100) NULL,
    `avatarUrl` VARCHAR(500) NULL,
    `firstName` VARCHAR(100) NULL,
    `lastName` VARCHAR(100) NULL,
    `birthYear` VARCHAR(50) NULL,
    `birthPlace` VARCHAR(200) NULL,
    `residence` VARCHAR(200) NULL,
    `studyAbroad` VARCHAR(500) NULL,
    `education` VARCHAR(500) NULL,
    `website` VARCHAR(500) NULL,
    `instagram` VARCHAR(200) NULL,
    `xiaohongshu` VARCHAR(200) NULL,
    `wechat` VARCHAR(100) NULL,
    `contactEmail` VARCHAR(200) NULL,
    `phone` VARCHAR(50) NULL,
    `quoteParagraphs` JSON NULL,
    `createTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateTime` DATETIME(3) NOT NULL,

    UNIQUE INDEX `artist_profiles_accountId_key`(`accountId`),
    INDEX `artist_profiles_accountId_idx`(`accountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `artist_galleries` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `profileId` INTEGER NOT NULL,
    `name` VARCHAR(200) NULL,
    `location` VARCHAR(200) NULL,
    `logoUrl` VARCHAR(500) NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateTime` DATETIME(3) NOT NULL,

    INDEX `artist_galleries_profileId_idx`(`profileId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `artist_documents` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `profileId` INTEGER NOT NULL,
    `category` VARCHAR(20) NOT NULL,
    `fileName` VARCHAR(255) NOT NULL,
    `fileSize` INTEGER NOT NULL DEFAULT 0,
    `mimeType` VARCHAR(100) NOT NULL,
    `storagePath` VARCHAR(500) NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateTime` DATETIME(3) NOT NULL,

    INDEX `artist_documents_profileId_idx`(`profileId`),
    INDEX `artist_documents_profileId_category_idx`(`profileId`, `category`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `artist_questions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `contentFr` VARCHAR(500) NOT NULL,
    `contentZh` VARCHAR(500) NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `status` INTEGER NOT NULL DEFAULT 1,
    `createTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateTime` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `artist_profiles` ADD CONSTRAINT `artist_profiles_accountId_fkey` FOREIGN KEY (`accountId`) REFERENCES `artist_account`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `artist_galleries` ADD CONSTRAINT `artist_galleries_profileId_fkey` FOREIGN KEY (`profileId`) REFERENCES `artist_profiles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `artist_documents` ADD CONSTRAINT `artist_documents_profileId_fkey` FOREIGN KEY (`profileId`) REFERENCES `artist_profiles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
