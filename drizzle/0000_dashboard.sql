CREATE TABLE `brands` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name_ar` varchar(160) NOT NULL,
	`name_en` varchar(160) NOT NULL,
	`logo` varchar(255),
	`logo_width` int,
	`logo_height` int,
	`alt_text_ar` varchar(255) NOT NULL DEFAULT '',
	`alt_text_en` varchar(255) NOT NULL DEFAULT '',
	`website_url` varchar(255),
	`is_active` boolean NOT NULL DEFAULT true,
	`show_on_homepage` boolean NOT NULL DEFAULT true,
	`sort_order` int NOT NULL DEFAULT 0,
	`homepage_sort_order` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `brands_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `clients` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name_ar` varchar(160) NOT NULL,
	`name_en` varchar(160) NOT NULL,
	`logo` varchar(255),
	`logo_width` int,
	`logo_height` int,
	`alt_text_ar` varchar(255) NOT NULL DEFAULT '',
	`alt_text_en` varchar(255) NOT NULL DEFAULT '',
	`website_url` varchar(255),
	`is_active` boolean NOT NULL DEFAULT true,
	`show_on_homepage` boolean NOT NULL DEFAULT true,
	`sort_order` int NOT NULL DEFAULT 0,
	`homepage_sort_order` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `clients_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `documents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`kind` varchar(40) NOT NULL DEFAULT 'company-profile',
	`title_ar` varchar(200) NOT NULL,
	`title_en` varchar(200) NOT NULL,
	`file_url` varchar(255) NOT NULL,
	`original_file_name` varchar(255) NOT NULL,
	`file_size` int NOT NULL,
	`is_active` boolean NOT NULL DEFAULT false,
	`show_download_button` boolean NOT NULL DEFAULT true,
	`uploaded_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `documents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `homepage_sections` (
	`section_key` varchar(40) NOT NULL,
	`is_visible` boolean NOT NULL DEFAULT true,
	`sort_order` int NOT NULL DEFAULT 0,
	CONSTRAINT `homepage_sections_section_key` PRIMARY KEY(`section_key`)
);
--> statement-breakpoint
CREATE TABLE `partners` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name_ar` varchar(160) NOT NULL,
	`name_en` varchar(160) NOT NULL,
	`logo` varchar(255),
	`logo_width` int,
	`logo_height` int,
	`alt_text_ar` varchar(255) NOT NULL DEFAULT '',
	`alt_text_en` varchar(255) NOT NULL DEFAULT '',
	`website_url` varchar(255),
	`is_active` boolean NOT NULL DEFAULT true,
	`show_on_homepage` boolean NOT NULL DEFAULT true,
	`sort_order` int NOT NULL DEFAULT 0,
	`homepage_sort_order` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `partners_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`client_id` int,
	`project_name_ar` varchar(200) NOT NULL,
	`project_name_en` varchar(200) NOT NULL,
	`description_ar` text,
	`description_en` text,
	`location_ar` varchar(200) NOT NULL,
	`location_en` varchar(200) NOT NULL,
	`scope_of_work_ar` varchar(255) NOT NULL,
	`scope_of_work_en` varchar(255) NOT NULL,
	`sector_ar` varchar(120) NOT NULL DEFAULT '',
	`sector_en` varchar(120) NOT NULL DEFAULT '',
	`image` varchar(255),
	`image_alt_ar` varchar(255) NOT NULL DEFAULT '',
	`image_alt_en` varchar(255) NOT NULL DEFAULT '',
	`is_active` boolean NOT NULL DEFAULT true,
	`show_on_homepage` boolean NOT NULL DEFAULT false,
	`sort_order` int NOT NULL DEFAULT 0,
	`homepage_sort_order` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `projects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `projects` ADD CONSTRAINT `projects_client_id_clients_id_fk` FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX `brands_sort_idx` ON `brands` (`sort_order`);--> statement-breakpoint
CREATE INDEX `clients_sort_idx` ON `clients` (`sort_order`);--> statement-breakpoint
CREATE INDEX `partners_sort_idx` ON `partners` (`sort_order`);--> statement-breakpoint
CREATE INDEX `projects_client_idx` ON `projects` (`client_id`);--> statement-breakpoint
CREATE INDEX `projects_sort_idx` ON `projects` (`sort_order`);