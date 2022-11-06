/*
  Warnings:

  - You are about to drop the column `userId` on the `Vote` table. All the data in the column will be lost.
  - You are about to drop the column `voteUserId` on the `VoteOption` table. All the data in the column will be lost.
  - You are about to drop the `UserLatestVoteBlock` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[voterAddress,daoId,proposalId]` on the table `Vote` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `voterAddress` to the `Vote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `voterAddress` to the `VoteOption` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Vote` DROP FOREIGN KEY `Vote_userId_fkey`;

-- DropForeignKey
ALTER TABLE `VoteOption` DROP FOREIGN KEY `VoteOption_voteUserId_voteDaoId_voteProposalId_fkey`;

-- DropIndex
DROP INDEX `Vote_userId_daoId_proposalId_key` ON `Vote`;

-- AlterTable
ALTER TABLE `Vote` DROP COLUMN `userId`,
    ADD COLUMN `voterAddress` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `VoteOption` DROP COLUMN `voteUserId`,
    ADD COLUMN `voterAddress` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `UserLatestVoteBlock`;

-- CreateTable
CREATE TABLE `VoterLatestVoteBlock` (
    `id` VARCHAR(191) NOT NULL,
    `voterAddress` VARCHAR(191) NOT NULL,
    `daoHandlerId` VARCHAR(191) NOT NULL,
    `latestVoteBlock` INTEGER NOT NULL,

    UNIQUE INDEX `VoterLatestVoteBlock_voterAddress_daoHandlerId_key`(`voterAddress`, `daoHandlerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DAORefreshQueue` (
    `id` VARCHAR(191) NOT NULL,
    `daoId` VARCHAR(191) NOT NULL,
    `status` ENUM('NEW', 'PENDING', 'DONE') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UsersRefreshQueue` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `status` ENUM('NEW', 'PENDING', 'DONE') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Vote_voterAddress_daoId_proposalId_key` ON `Vote`(`voterAddress`, `daoId`, `proposalId`);

-- AddForeignKey
ALTER TABLE `VoteOption` ADD CONSTRAINT `VoteOption_voterAddress_voteDaoId_voteProposalId_fkey` FOREIGN KEY (`voterAddress`, `voteDaoId`, `voteProposalId`) REFERENCES `Vote`(`voterAddress`, `daoId`, `proposalId`) ON DELETE CASCADE ON UPDATE CASCADE;
