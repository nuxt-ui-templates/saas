CREATE TABLE `account_new` (
	`id` text PRIMARY KEY NOT NULL,
	`issuer` text NOT NULL,
	`accountId` text NOT NULL,
	`providerId` text NOT NULL,
	`userId` text NOT NULL,
	`accessToken` text,
	`refreshToken` text,
	`idToken` text,
	`accessTokenExpiresAt` integer,
	`refreshTokenExpiresAt` integer,
	`scope` text,
	`password` text,
	`createdAt` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `account_new` (
	`id`, `issuer`, `accountId`, `providerId`, `userId`, `accessToken`, `refreshToken`,
	`idToken`, `accessTokenExpiresAt`, `refreshTokenExpiresAt`, `scope`, `password`,
	`createdAt`, `updatedAt`
)
SELECT
	`id`,
	CASE
		WHEN `providerId` = 'credential' THEN 'local:credential'
		WHEN `providerId` = 'github' THEN 'local:oauth:github'
		ELSE 'local:oauth:' || `providerId`
	END,
	`accountId`, `providerId`, `userId`, `accessToken`, `refreshToken`, `idToken`,
	`accessTokenExpiresAt`, `refreshTokenExpiresAt`, `scope`, `password`, `createdAt`,
	`updatedAt`
FROM `account`;
--> statement-breakpoint
DROP TABLE `account`;
--> statement-breakpoint
ALTER TABLE `account_new` RENAME TO `account`;
--> statement-breakpoint
CREATE UNIQUE INDEX `account_issuer_accountId_uidx` ON `account` (`issuer`,`accountId`);
--> statement-breakpoint
CREATE INDEX `account_userId_idx` ON `account` (`userId`);
