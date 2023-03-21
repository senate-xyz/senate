-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `newUser` BOOLEAN NOT NULL DEFAULT true,
    `acceptedTerms` BOOLEAN NOT NULL DEFAULT false,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL DEFAULT '',
    `lastActive` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `sessionCount` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `User_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserSettings` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `dailyBulletinEmail` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `UserSettings_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Voter` (
    `id` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Voter_address_key`(`address`),
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
    `type` ENUM('AAVE_CHAIN', 'COMPOUND_CHAIN', 'UNISWAP_CHAIN', 'MAKER_EXECUTIVE', 'MAKER_POLL', 'SNAPSHOT') NOT NULL,
    `decoder` JSON NOT NULL,
    `lastChainProposalCreatedBlock` BIGINT NULL DEFAULT 0,
    `lastSnapshotProposalCreatedDate` DATETIME(3) NULL DEFAULT (from_unixtime(0)),
    `lastRefreshDate` DATETIME(3) NOT NULL DEFAULT (from_unixtime(0)),
    `refreshStatus` ENUM('NEW', 'PENDING', 'DONE') NOT NULL DEFAULT 'NEW',
    `daoId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `DAOHandler_daoId_type_key`(`daoId`, `type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Proposal` (
    `id` VARCHAR(191) NOT NULL,
    `externalId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(2048) NOT NULL,
    `daoId` VARCHAR(191) NOT NULL,
    `daoHandlerId` VARCHAR(191) NOT NULL,
    `data` JSON NOT NULL,
    `timeCreated` DATETIME(3) NOT NULL,
    `timeStart` DATETIME(3) NOT NULL,
    `timeEnd` DATETIME(3) NOT NULL,
    `url` VARCHAR(1024) NOT NULL,

    INDEX `Proposal_daoId_idx`(`daoId`),
    INDEX `Proposal_daoHandlerId_idx`(`daoHandlerId`),
    UNIQUE INDEX `Proposal_externalId_daoId_key`(`externalId`, `daoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notification` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `proposalId` VARCHAR(191) NOT NULL,
    `daoId` VARCHAR(191) NOT NULL,
    `type` ENUM('NEW', 'ENDING_SOON', 'PAST') NOT NULL,

    INDEX `Notification_userId_idx`(`userId`),
    INDEX `Notification_proposalId_idx`(`proposalId`),
    UNIQUE INDEX `Notification_proposalId_userId_type_key`(`proposalId`, `userId`, `type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Vote` (
    `id` VARCHAR(191) NOT NULL,
    `voterAddress` VARCHAR(191) NOT NULL,
    `proposalId` VARCHAR(191) NOT NULL,
    `daoId` VARCHAR(191) NOT NULL,
    `daoHandlerId` VARCHAR(191) NOT NULL,
    `choiceId` VARCHAR(191) NOT NULL DEFAULT '0',
    `choice` VARCHAR(191) NOT NULL DEFAULT 'None',

    INDEX `Vote_proposalId_idx`(`proposalId`),
    INDEX `Vote_daoId_idx`(`daoId`),
    UNIQUE INDEX `Vote_voterAddress_daoId_proposalId_key`(`voterAddress`, `daoId`, `proposalId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VoterHandler` (
    `id` VARCHAR(191) NOT NULL,
    `voterId` VARCHAR(191) NOT NULL,
    `daoHandlerId` VARCHAR(191) NOT NULL,
    `refreshStatus` ENUM('NEW', 'PENDING', 'DONE') NOT NULL DEFAULT 'NEW',
    `lastRefreshDate` DATETIME(3) NOT NULL DEFAULT (from_unixtime(0)),
    `lastChainVoteCreatedBlock` BIGINT NULL DEFAULT 0,
    `lastSnapshotVoteCreatedDate` DATETIME(3) NULL DEFAULT (from_unixtime(0)),

    INDEX `VoterHandler_daoHandlerId_idx`(`daoHandlerId`),
    UNIQUE INDEX `VoterHandler_voterId_daoHandlerId_key`(`voterId`, `daoHandlerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Subscription` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `daoId` VARCHAR(191) NOT NULL,
    `notificationsEnabled` BOOLEAN NOT NULL DEFAULT true,

    INDEX `Subscription_daoId_idx`(`daoId`),
    UNIQUE INDEX `Subscription_userId_daoId_key`(`userId`, `daoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RefreshQueue` (
    `id` VARCHAR(191) NOT NULL,
    `refreshType` ENUM('DAOCHAINPROPOSALS', 'DAOSNAPSHOTPROPOSALS', 'DAOCHAINVOTES', 'DAOSNAPSHOTVOTES', 'VOTERCHAINVOTES', 'VOTERSNAPSHOTVOTES') NOT NULL,
    `clientId` VARCHAR(191) NOT NULL,
    `priority` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Config` (
    `param` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Config_param_key`(`param`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_UserToVoter` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_UserToVoter_AB_unique`(`A`, `B`),
    INDEX `_UserToVoter_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserSettings` ADD CONSTRAINT `UserSettings_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DAOHandler` ADD CONSTRAINT `DAOHandler_daoId_fkey` FOREIGN KEY (`daoId`) REFERENCES `DAO`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Proposal` ADD CONSTRAINT `Proposal_daoHandlerId_fkey` FOREIGN KEY (`daoHandlerId`) REFERENCES `DAOHandler`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Proposal` ADD CONSTRAINT `Proposal_daoId_fkey` FOREIGN KEY (`daoId`) REFERENCES `DAO`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_proposalId_fkey` FOREIGN KEY (`proposalId`) REFERENCES `Proposal`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vote` ADD CONSTRAINT `Vote_daoId_fkey` FOREIGN KEY (`daoId`) REFERENCES `DAO`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vote` ADD CONSTRAINT `Vote_proposalId_fkey` FOREIGN KEY (`proposalId`) REFERENCES `Proposal`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vote` ADD CONSTRAINT `Vote_voterAddress_fkey` FOREIGN KEY (`voterAddress`) REFERENCES `Voter`(`address`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VoterHandler` ADD CONSTRAINT `VoterHandler_daoHandlerId_fkey` FOREIGN KEY (`daoHandlerId`) REFERENCES `DAOHandler`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VoterHandler` ADD CONSTRAINT `VoterHandler_voterId_fkey` FOREIGN KEY (`voterId`) REFERENCES `Voter`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subscription` ADD CONSTRAINT `Subscription_daoId_fkey` FOREIGN KEY (`daoId`) REFERENCES `DAO`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subscription` ADD CONSTRAINT `Subscription_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UserToVoter` ADD CONSTRAINT `_UserToVoter_A_fkey` FOREIGN KEY (`A`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UserToVoter` ADD CONSTRAINT `_UserToVoter_B_fkey` FOREIGN KEY (`B`) REFERENCES `Voter`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
