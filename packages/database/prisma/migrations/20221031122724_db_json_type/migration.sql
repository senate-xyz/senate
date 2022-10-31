-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `User_address_key`(`address`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserProxy` (
    `id` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DAO` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `picture` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `DAO_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DAOHandler` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('BRAVO1', 'BRAVO2', 'MAKER_EXECUTIVE', 'MAKER_POLL_CREATE', 'MAKER_POLL_VOTE', 'SNAPSHOT') NOT NULL,
    `decoder` JSON NOT NULL,
    `daoId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `DAOHandler_daoId_type_key`(`daoId`, `type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Proposal` (
    `id` VARCHAR(191) NOT NULL,
    `externalId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `daoId` VARCHAR(191) NOT NULL,
    `daoHandlerId` VARCHAR(191) NOT NULL,
    `proposalType` ENUM('BRAVO', 'MAKER_EXECUTIVE', 'MAKER_POLL', 'SNAPSHOT') NOT NULL,
    `data` JSON NOT NULL,
    `url` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Proposal_externalId_key`(`externalId`),
    UNIQUE INDEX `Proposal_externalId_daoId_key`(`externalId`, `daoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Vote` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `proposalId` VARCHAR(191) NOT NULL,
    `daoId` VARCHAR(191) NOT NULL,
    `daoHandlerId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Vote_userId_daoId_proposalId_key`(`userId`, `daoId`, `proposalId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VoteOption` (
    `id` VARCHAR(191) NOT NULL,
    `option` VARCHAR(191) NOT NULL,
    `optionName` VARCHAR(191) NOT NULL,
    `voteUserId` VARCHAR(191) NOT NULL,
    `voteDaoId` VARCHAR(191) NOT NULL,
    `voteProposalId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `VoteOption_voteProposalId_option_key`(`voteProposalId`, `option`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserLatestVoteBlock` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `daoHandlerId` VARCHAR(191) NOT NULL,
    `latestVoteBlock` INTEGER NOT NULL,

    UNIQUE INDEX `UserLatestVoteBlock_userId_daoHandlerId_key`(`userId`, `daoHandlerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Subscription` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `daoId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Subscription_userId_daoId_key`(`userId`, `daoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserProxy` ADD CONSTRAINT `UserProxy_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DAOHandler` ADD CONSTRAINT `DAOHandler_daoId_fkey` FOREIGN KEY (`daoId`) REFERENCES `DAO`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Proposal` ADD CONSTRAINT `Proposal_daoId_fkey` FOREIGN KEY (`daoId`) REFERENCES `DAO`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vote` ADD CONSTRAINT `Vote_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vote` ADD CONSTRAINT `Vote_proposalId_fkey` FOREIGN KEY (`proposalId`) REFERENCES `Proposal`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vote` ADD CONSTRAINT `Vote_daoId_fkey` FOREIGN KEY (`daoId`) REFERENCES `DAO`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VoteOption` ADD CONSTRAINT `VoteOption_voteUserId_voteDaoId_voteProposalId_fkey` FOREIGN KEY (`voteUserId`, `voteDaoId`, `voteProposalId`) REFERENCES `Vote`(`userId`, `daoId`, `proposalId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subscription` ADD CONSTRAINT `Subscription_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subscription` ADD CONSTRAINT `Subscription_daoId_fkey` FOREIGN KEY (`daoId`) REFERENCES `DAO`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
