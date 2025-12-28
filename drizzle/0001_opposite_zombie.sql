CREATE TABLE `booking_users` (
	`mobile_number` varchar(20) NOT NULL,
	`access_slug` varchar(100) NOT NULL,
	`nickname` varchar(100) NOT NULL,
	`bulk_credits` int NOT NULL DEFAULT 0,
	`unlimited_expiry` bigint,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `booking_users_mobile_number` PRIMARY KEY(`mobile_number`),
	CONSTRAINT `booking_users_access_slug_unique` UNIQUE(`access_slug`)
);
--> statement-breakpoint
CREATE TABLE `bookings` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(20) NOT NULL,
	`start_time` bigint NOT NULL,
	`end_time` bigint NOT NULL,
	`status` enum('active','cancelled') NOT NULL DEFAULT 'active',
	`credit_type_used` enum('bulk','unlimited') NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bookings_id` PRIMARY KEY(`id`)
);
