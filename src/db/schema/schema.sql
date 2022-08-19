--exchange table 
CREATE TABLE `market` (
  `market_id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `exchange_id` int(11) NOT NULL,
  `token_1_id` int(11) NOT NULL,
  `token_2_id` int(11) NOT NULL,
  `price` double NOT NULL,
  `price_change` double NOT NULL,
  `price_change_percent` double NOT NULL,
  `weighted_avg_price` double NOT NULL,
  `prev_close_price` double NOT NULL,
  `last_price` double NOT NULL,
  `last_qty` double NOT NULL,
  `ask_price` double NOT NULL,
  `ask_qty` double NOT NULL,
  `open_price` double NOT NULL,
  `high_price` double NOT NULL,
  `low_price` double NOT NULL,
  `volume` int(11) NOT NULL,
  `trading_volume_24h` int(11) NOT NULL,
  `price_change_percentage_24h` double NOT NULL,
  `quote_volume` int(11) NOT NULL,
  `open_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `closed_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_active` tinyint(1) NOT NULL,
  `creation_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `modification_date` timestamp NOT NULL DEFAULT current_timestamp()
  ADD CONSTRAINT `exchange` FOREIGN KEY (`exchange_id`) REFERENCES `exchange` (`exchange_id`) ON DELETE CASCADE ON UPDATE CASCADE;
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;




CREATE TABLE exchange(
  exchange_id           Int AUTO_INCREMENT NOT NULL PRIMARY KEY,
  name                   VARCHAR(120) NOT NULL,
  description           Text NOT NULL,
  exchange_type        VarChar(80) NOT NULL,
  icon_url              VarChar(255) NOT NULL,
  exchange_url          VarChar(255) NOT NULL,
  app_links             Text NOT NULL,
  social_links          Text NOT NULL,
  launch_date           DateTime NOT NULL, 
  visits                Int NOT NULL,
  country               VarChar(250) NOT NULL,
  founder               VarChar(120) NOT NULL,
  trust_score           Float NOT NULL,
  trust_score_rank      Int NOT NULL,
  trade_volume_24h      BigInt NOT NULL,
  has_trading_incentive Boolean NOT NULL,
  is_active             tinyint(1) NOT NULL,
  `creation_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `modification_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp());

  //market table 

  CREATE TABLE `market` (
  `market_id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `exchange_id` int(11) NOT NULL,
  `token_1_id` int(11) NOT NULL,
  `token_2_id` int(11) NOT NULL,
  `price` double NOT NULL,
  `price_change` double NOT NULL,
  `price_change_percent` double NOT NULL,
  `weighted_avg_price` double NOT NULL,
  `prev_close_price` double NOT NULL,
  `last_price` double NOT NULL,
  `last_qty` double NOT NULL,
  `ask_price` double NOT NULL,
  `ask_qty` double NOT NULL,
  `open_price` double NOT NULL,
  `high_price` double NOT NULL,
  `low_price` double NOT NULL,
  `volume` bigint(30) NOT NULL,
  `trading_volume_24h` bigint(30) NOT NULL,
  `price_change_percentage_24h` double NOT NULL,
  `quote_volume` bigint(30) NOT NULL,
  `open_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `closed_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_active` tinyint(1) NOT NULL,
  `creation_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `modification_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


--market history table  

CREATE TABLE `market_history`(
market_history_id int(11) NOT NULL 
AUTO_INCREMENT PRIMARY KEY,`market_id` 
int(11) NOT NULL, `price` double NOT NULL, `price_change` double NOT NULL, 
`price_change_percent` double NOT NULL,
 `weighted_avg_price` double NOT NULL, `prev_close_price` double NOT NULL,
  `last_price` double NOT NULL,
 `last_qty` double NOT NULL, `ask_price` double NOT NULL, `ask_qty` double
  NOT NULL, `open_price` double NOT NULL, 
 `high_price` double NOT NULL, `low_price` double NOT NULL, `volume` 
 bigint(30) NOT NULL, `trading_volume_24h` bigint(30) NOT NULL, 
 `price_change_percentage_24h` double NOT NULL, `quote_volume` 
 bigint(30) NOT NULL, `open_time` timestamp NOT NULL DEFAULT 
 current_timestamp(), `closed_time` timestamp NOT NULL DEFAULT
  current_timestamp(), `is_active` tinyint(1) NOT NULL, 
  `creation_date` timestamp NOT NULL DEFAULT current_timestamp(), 
  `modification_date` timestamp NOT NULL DEFAULT current_timestamp());

  --token type table 

  CREATE TABLE `token_type`(
   token_type_id     Int NOT NULL PRIMARY KEY AUTO_INCREMENT,
  name              VarChar(80) NOT NULL ,
  description       Text NOT NULL ,
  is_active         tinyint(1) NOT NULL,
  `creation_date` timestamp NOT NULL DEFAULT current_timestamp(), 
  `modification_date` timestamp NOT NULL DEFAULT current_timestamp()
);

--token table 

CREATE TABLE token(`token_id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `blockchain_id` int(11) NOT NULL,
  `token_type_id` int(11) NOT NULL ,
  `name` varchar(120) NOT NULL,
  `symbol` varchar(20) NOT NULL,
  `contract_address` varchar(120) NOT NULL,
  `protocol` varchar(80) NOT NULL,
  `decimals` int(11) NOT NULL,
  `logo_url` varchar(255) NOT NULL,
  `slug` varchar(120) NOT NULL,
  `likes` int(11) NOT NULL,
  `market_cap` double NOT NULL,
  `fully_diluted_valuation` double NOT NULL,
  `circulating_supply` double NOT NULL,
  `max_supply` double NOT NULL,
  `total_supply` double NOT NULL,
  `token_url` text NOT NULL,
  `social_links` text NOT NULL,
  `git_url` varchar(255) NOT NULL,
  `tags` text NOT NULL,
  `market_cap_rank` int(11) NOT NULL,
  `ath` double NOT NULL,
  `atl` double NOT NULL,
  `ath_date` datetime NOT NULL,
  `atl_date` datetime NOT NULL,
  `roi` double NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `creation_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `modification_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
 
  FOREIGN KEY (`token_type_id`) REFERENCES `token_type`(`token_type_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`blockchain_id`) REFERENCES `blockchain`(`blockchain_id`) ON DELETE CASCADE ON UPDATE CASCADE
  


) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--block chain table 

CREATE TABLE `blockchain` (
  `blockchain_id` int(11) NOT NULL,
  `name` varchar(120) NOT NULL,
  `icon_url` varchar(255) NOT NULL,
  `blockchain_url` text NOT NULL,
  `description` text NOT NULL,
  `social_links` text NOT NULL,
  `launch_date` datetime NOT NULL,
  `founder` varchar(120) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `creation_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `modification_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


--user table 

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `name` varchar(250) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `refresh_token` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(30) COLLATE utf8mb4_unicode_ci NULL,
  `otp` varchar(5) COLLATE utf8mb4_unicode_ci NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;