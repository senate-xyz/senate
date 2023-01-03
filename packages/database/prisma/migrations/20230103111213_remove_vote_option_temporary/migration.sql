/*
  Warnings:

  - You are about to drop the `VoteOption` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `VoteOption` DROP FOREIGN KEY `VoteOption_voterAddress_voteDaoId_voteProposalId_fkey`;

-- AlterTable
ALTER TABLE `Vote` ADD COLUMN `choice` VARCHAR(191) NOT NULL DEFAULT 'None',
    ADD COLUMN `choiceId` VARCHAR(191) NOT NULL DEFAULT '0';

-- DropTable
DROP TABLE `VoteOption`;
