CREATE TABLE `repositories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`namespace` text NOT NULL,
	`owner_id` integer NOT NULL,
	`source_repo_id` integer,
	`parent_workspace_id` integer,
	`remote` text,
	`default_branch` text NOT NULL,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`source_repo_id`) REFERENCES `repositories`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`parent_workspace_id`) REFERENCES `repositories`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE UNIQUE INDEX `repositories_namespace_name_unique` ON `repositories` (`namespace`,`name`);