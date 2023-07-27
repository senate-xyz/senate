-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `_userTovoter` (
	`A` varchar(191) NOT NULL,
	`B` varchar(191) NOT NULL,
	CONSTRAINT `_userTovoter_AB_unique` UNIQUE(`A`,`B`)
);
--> statement-breakpoint
CREATE TABLE `config` (
	`key` varchar(191) NOT NULL,
	`value` int NOT NULL,
	CONSTRAINT `config_key` PRIMARY KEY(`key`)
);
--> statement-breakpoint
CREATE TABLE `dao` (
	`id` varchar(191) NOT NULL,
	`name` varchar(191) NOT NULL,
	`picture` varchar(191) NOT NULL,
	`createdat` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updatedat` datetime(3) NOT NULL,
	`quorumwarningemailsupport` tinyint NOT NULL DEFAULT 0,
	CONSTRAINT `dao_id` PRIMARY KEY(`id`),
	CONSTRAINT `dao_name_key` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `daohandler` (
	`id` varchar(191) NOT NULL,
	`type` enum('AAVE_CHAIN','COMPOUND_CHAIN','UNISWAP_CHAIN','ENS_CHAIN','GITCOIN_CHAIN','HOP_CHAIN','DYDX_CHAIN','MAKER_EXECUTIVE','MAKER_POLL','MAKER_POLL_ARBITRUM','INTEREST_PROTOCOL_CHAIN','ZEROX_PROTOCOL_CHAIN','SNAPSHOT') NOT NULL,
	`decoder` json NOT NULL,
	`chainindex` bigint DEFAULT 0,
	`snapshotindex` datetime(3) DEFAULT '2000-01-01 00:00:00.000',
	`uptodate` tinyint NOT NULL DEFAULT 0,
	`daoid` varchar(191) NOT NULL,
	`createdat` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updatedat` datetime(3) NOT NULL,
	CONSTRAINT `daohandler_id` PRIMARY KEY(`id`),
	CONSTRAINT `daohandler_daoid_type_key` UNIQUE(`daoid`,`type`)
);
--> statement-breakpoint
CREATE TABLE `notification` (
	`id` varchar(191) NOT NULL,
	`userid` varchar(191) NOT NULL,
	`proposalid` varchar(191),
	`type` enum('QUORUM_NOT_REACHED_EMAIL','BULLETIN_EMAIL','NEW_PROPOSAL_DISCORD','FIRST_REMINDER_DISCORD','SECOND_REMINDER_DISCORD','THIRD_REMINDER_DISCORD','ENDED_PROPOSAL_DISCORD','NEW_PROPOSAL_TELEGRAM','FIRST_REMINDER_TELEGRAM','SECOND_REMINDER_TELEGRAM','THIRD_REMINDER_TELEGRAM','ENDED_PROPOSAL_TELEGRAM') NOT NULL,
	`dispatchstatus` enum('NOT_DISPATCHED','FIRST_RETRY','SECOND_RETRY','THIRD_RETRY','DISPATCHED','DELETED','FAILED') NOT NULL DEFAULT 'NOT_DISPATCHED',
	`emailmessageid` varchar(191),
	`discordmessagelink` varchar(191),
	`discordmessageid` varchar(191),
	`telegramchatid` varchar(191),
	`telegrammessageid` varchar(191),
	`createdat` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updatedat` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`emailtemplate` varchar(191),
	CONSTRAINT `notification_id` PRIMARY KEY(`id`),
	CONSTRAINT `notification_userid_proposalid_type_key` UNIQUE(`userid`,`proposalid`,`type`)
);
--> statement-breakpoint
CREATE TABLE `proposal` (
	`id` varchar(191) NOT NULL,
	`name` varchar(2048) NOT NULL,
	`externalid` varchar(191) NOT NULL,
	`choices` json NOT NULL,
	`scores` json NOT NULL,
	`scorestotal` json NOT NULL,
	`quorum` json NOT NULL,
	`state` enum('PENDING','ACTIVE','CANCELED','DEFEATED','SUCCEEDED','QUEUED','EXPIRED','EXECUTED','HIDDEN','UNKNOWN') NOT NULL,
	`blockcreated` bigint DEFAULT 0,
	`timecreated` datetime(3) NOT NULL,
	`timestart` datetime(3) NOT NULL,
	`timeend` datetime(3) NOT NULL,
	`url` varchar(1024) NOT NULL,
	`daohandlerid` varchar(191) NOT NULL,
	`daoid` varchar(191) NOT NULL,
	`createdat` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updatedat` datetime(3) NOT NULL,
	`visible` tinyint NOT NULL DEFAULT 1,
	CONSTRAINT `proposal_id` PRIMARY KEY(`id`),
	CONSTRAINT `proposal_externalid_daoid_key` UNIQUE(`externalid`,`daoid`)
);
--> statement-breakpoint
CREATE TABLE `subscription` (
	`id` varchar(191) NOT NULL,
	`userid` varchar(191) NOT NULL,
	`daoid` varchar(191) NOT NULL,
	`createdat` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updatedat` datetime(3) NOT NULL,
	CONSTRAINT `subscription_id` PRIMARY KEY(`id`),
	CONSTRAINT `subscription_userid_daoid_key` UNIQUE(`userid`,`daoid`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` varchar(191) NOT NULL,
	`address` varchar(191),
	`email` varchar(191),
	`verifiedaddress` tinyint NOT NULL DEFAULT 0,
	`verifiedemail` tinyint NOT NULL DEFAULT 0,
	`isuniswapuser` enum('DISABLED','VERIFICATION','ENABLED') NOT NULL DEFAULT 'DISABLED',
	`isaaveuser` enum('DISABLED','VERIFICATION','ENABLED') NOT NULL DEFAULT 'DISABLED',
	`challengecode` varchar(191),
	`emaildailybulletin` tinyint NOT NULL DEFAULT 0,
	`emptydailybulletin` tinyint NOT NULL DEFAULT 0,
	`emailquorumwarning` tinyint NOT NULL DEFAULT 1,
	`discordnotifications` tinyint NOT NULL DEFAULT 0,
	`discordreminders` tinyint NOT NULL DEFAULT 1,
	`discordincludevotes` tinyint NOT NULL DEFAULT 1,
	`discordwebhook` varchar(191) NOT NULL DEFAULT '',
	`telegramnotifications` tinyint NOT NULL DEFAULT 0,
	`telegramreminders` tinyint NOT NULL DEFAULT 1,
	`telegramincludevotes` tinyint NOT NULL DEFAULT 1,
	`telegramchatid` varchar(191) NOT NULL DEFAULT '',
	`acceptedterms` tinyint NOT NULL DEFAULT 0,
	`acceptedtermstimestamp` datetime(3),
	`firstactive` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`lastactive` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`sessioncount` int NOT NULL DEFAULT 0,
	`createdat` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updatedat` datetime(3) NOT NULL,
	CONSTRAINT `user_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_address_key` UNIQUE(`address`),
	CONSTRAINT `user_email_key` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `vote` (
	`id` varchar(191) NOT NULL,
	`choice` json NOT NULL,
	`votingpower` json NOT NULL,
	`reason` varchar(2048) NOT NULL,
	`voteraddress` varchar(191) NOT NULL,
	`proposalid` varchar(191) NOT NULL,
	`daoid` varchar(191) NOT NULL,
	`daohandlerid` varchar(191) NOT NULL,
	`blockcreated` bigint DEFAULT 0,
	`timecreated` datetime(3),
	`createdat` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updatedat` datetime(3) NOT NULL,
	CONSTRAINT `vote_id` PRIMARY KEY(`id`),
	CONSTRAINT `vote_voteraddress_daoid_proposalid_key` UNIQUE(`voteraddress`,`daoid`,`proposalid`)
);
--> statement-breakpoint
CREATE TABLE `voter` (
	`id` varchar(191) NOT NULL,
	`address` varchar(191) NOT NULL,
	`createdat` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updatedat` datetime(3) NOT NULL,
	CONSTRAINT `voter_id` PRIMARY KEY(`id`),
	CONSTRAINT `voter_address_key` UNIQUE(`address`)
);
--> statement-breakpoint
CREATE TABLE `voterhandler` (
	`id` varchar(191) NOT NULL,
	`chainindex` bigint DEFAULT 0,
	`snapshotindex` datetime(3) DEFAULT '2000-01-01 00:00:00.000',
	`uptodate` tinyint NOT NULL DEFAULT 0,
	`daohandlerid` varchar(191) NOT NULL,
	`voterid` varchar(191) NOT NULL,
	`createdat` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updatedat` datetime(3) NOT NULL,
	CONSTRAINT `voterhandler_id` PRIMARY KEY(`id`),
	CONSTRAINT `voterhandler_voterid_daohandlerid_key` UNIQUE(`voterid`,`daohandlerid`)
);
--> statement-breakpoint
CREATE INDEX `_userTovoter_B_index` ON `_userTovoter` (`B`);--> statement-breakpoint
CREATE INDEX `config_key_idx` ON `config` (`key`);--> statement-breakpoint
CREATE INDEX `dao_name_idx` ON `dao` (`name`);--> statement-breakpoint
CREATE INDEX `daohandler_daoid_idx` ON `daohandler` (`daoid`);--> statement-breakpoint
CREATE INDEX `notification_userid_idx` ON `notification` (`userid`);--> statement-breakpoint
CREATE INDEX `notification_type_idx` ON `notification` (`type`);--> statement-breakpoint
CREATE INDEX `notification_proposalid_idx` ON `notification` (`proposalid`);--> statement-breakpoint
CREATE INDEX `notification_dispatchstatus_idx` ON `notification` (`dispatchstatus`);--> statement-breakpoint
CREATE INDEX `proposal_daoid_idx` ON `proposal` (`daoid`);--> statement-breakpoint
CREATE INDEX `proposal_daohandlerid_idx` ON `proposal` (`daohandlerid`);--> statement-breakpoint
CREATE INDEX `subscription_daoid_idx` ON `subscription` (`daoid`);--> statement-breakpoint
CREATE INDEX `subscription_userid_idx` ON `subscription` (`userid`);--> statement-breakpoint
CREATE INDEX `user_email_idx` ON `user` (`email`);--> statement-breakpoint
CREATE INDEX `user_address_idx` ON `user` (`address`);--> statement-breakpoint
CREATE INDEX `vote_proposalid_idx` ON `vote` (`proposalid`);--> statement-breakpoint
CREATE INDEX `vote_daoid_idx` ON `vote` (`daoid`);--> statement-breakpoint
CREATE INDEX `vote_voteraddress_idx` ON `vote` (`voteraddress`);--> statement-breakpoint
CREATE INDEX `vote_daohandlerid_idx` ON `vote` (`daohandlerid`);--> statement-breakpoint
CREATE INDEX `voter_address_idx` ON `voter` (`address`);--> statement-breakpoint
CREATE INDEX `voterhandler_daohandlerid_idx` ON `voterhandler` (`daohandlerid`);--> statement-breakpoint
CREATE INDEX `voterhandler_voterid_idx` ON `voterhandler` (`voterid`);
*/