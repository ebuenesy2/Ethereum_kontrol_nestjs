-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Anamakine: 127.0.0.1
-- Üretim Zamanı: 30 Mar 2026, 07:17:52
-- Sunucu sürümü: 10.4.32-MariaDB
-- PHP Sürümü: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Veritabanı: `ethereum_takip`
--

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `ms_transaction`
--

CREATE TABLE `ms_transaction` (
  `id` int(11) NOT NULL,
  `type` text DEFAULT NULL,
  `type_dbid` int(11) NOT NULL,
  `jobId` text DEFAULT NULL,
  `transactionId_scanner` text DEFAULT NULL,
  `transactionId` text DEFAULT NULL,
  `transactionDate` text DEFAULT NULL,
  `transactionIPAddress` text DEFAULT NULL,
  `transaction_type` text NOT NULL DEFAULT '\'\\\'1\\\'\'',
  `customer_number` text NOT NULL,
  `customer_name` varchar(255) DEFAULT NULL,
  `customer_email` varchar(255) DEFAULT NULL,
  `amount` text DEFAULT NULL,
  `sendAmount` text DEFAULT NULL,
  `receiveAmount` text DEFAULT NULL,
  `fee` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `detail` text DEFAULT NULL,
  `totalScore` int(11) DEFAULT NULL,
  `triggeredAlarm` text DEFAULT NULL,
  `status` varchar(50) NOT NULL,
  `statusJob` varchar(50) NOT NULL,
  `requestedTime` text NOT NULL,
  `requestedAt` text NOT NULL,
  `transaction_adress` text DEFAULT NULL,
  `transaction_adress_control` text DEFAULT NULL,
  `transaction_adress_at` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_byId` int(11) DEFAULT NULL,
  `isUpdated` tinyint(1) NOT NULL DEFAULT 0,
  `updated_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_byId` int(11) DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `isDeleted` tinyint(1) NOT NULL DEFAULT 0,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_byId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `ms_transaction`
--

INSERT INTO `ms_transaction` (`id`, `type`, `type_dbid`, `jobId`, `transactionId_scanner`, `transactionId`, `transactionDate`, `transactionIPAddress`, `transaction_type`, `customer_number`, `customer_name`, `customer_email`, `amount`, `sendAmount`, `receiveAmount`, `fee`, `description`, `detail`, `totalScore`, `triggeredAlarm`, `status`, `statusJob`, `requestedTime`, `requestedAt`, `transaction_adress`, `transaction_adress_control`, `transaction_adress_at`, `created_at`, `created_byId`, `isUpdated`, `updated_at`, `updated_byId`, `isActive`, `isDeleted`, `deleted_at`, `deleted_byId`) VALUES
(1, 'usdt', 11, '622a8679-cdab-467a-aecc-684c0b67e982', NULL, 'blockchain-1774847476246', '2026-03-24T13:12:59Z', '192.168.1.10', 'USDT Transfer', '2', NULL, NULL, '126600', '126600', '126600', '', 'USDT transferi - From: 0x74c25D68a4fEFff31BEef1aD3f93056fb6A27aef, To: 0x3c54A43CFb183714A06a5EDbbD0F18A4a742D654', NULL, NULL, NULL, 'queued', 'add_transaction', '1774847476245', '30.03.2026 08:11:16', NULL, NULL, NULL, '2026-03-30 05:11:16', 2, 0, '2026-03-30 05:11:16', NULL, 1, 0, NULL, NULL),
(2, 'usdt', 11, '5bb4ad55-3f0a-430b-b3b6-3d2a513d84cd', NULL, 'blockchain-1774847476747', '2026-03-24T13:12:59Z', '192.168.1.10', 'USDT Transfer', '2', NULL, NULL, '500000.49735', '500000.49735', '500000.49735', '', 'USDT transferi - From: 0x33660E26683Ad83E71098a772F0c92310757a544, To: 0x926A3551BfC9668129d7E22FD0385a0947ca2Fa1', NULL, NULL, NULL, 'queued', 'add_transaction', '1774847476746', '30.03.2026 08:11:16', NULL, NULL, NULL, '2026-03-30 05:11:16', 2, 0, '2026-03-30 05:11:16', NULL, 1, 0, NULL, NULL),
(3, 'usdt', 11, 'd1678f5c-ab76-4130-8634-2f93a3892663', NULL, 'blockchain-1774847511363', '2026-03-24T13:12:59Z', '192.168.1.10', 'USDT Transfer', '2', NULL, NULL, '346990.373295', '346990.373295', '346990.373295', '', 'USDT transferi - From: 0xd5D4f6572ad884956375566826e4fcBa987aE989, To: 0x000000000004444c5dc75cB358380D2e3dE08A90', NULL, NULL, NULL, 'queued', 'add_transaction', '1774847511362', '30.03.2026 08:11:51', NULL, NULL, NULL, '2026-03-30 05:11:51', 2, 0, '2026-03-30 05:11:51', NULL, 1, 0, NULL, NULL),
(4, 'usdt', 11, '3ce351b5-09c5-4bfb-bc95-9d8ccc748034', NULL, 'blockchain-1774847511348', '2026-03-24T13:12:59Z', '192.168.1.10', 'USDT Transfer', '2', NULL, NULL, '346990.485563', '346990.485563', '346990.485563', '', 'USDT transferi - From: 0x000000000004444c5dc75cB358380D2e3dE08A90, To: 0xd5D4f6572ad884956375566826e4fcBa987aE989', NULL, NULL, NULL, 'queued', 'add_transaction', '1774847511330', '30.03.2026 08:11:51', NULL, NULL, NULL, '2026-03-30 05:11:51', 2, 0, '2026-03-30 05:11:51', NULL, 1, 0, NULL, NULL),
(5, 'tl_yatır', 11, '066843bf-96d7-4137-8ddf-dd52e90d0e1c', NULL, 'tl_yatır-066843bf-96d7-4137-8ddf-dd52e90d0e1c', '2026-03-24T13:12:59Z', '192.168.1.10', 'tl_yatır', '33', NULL, NULL, '1400', '1400', '1400', '0', 'TL Yatırma', NULL, NULL, NULL, 'queued', 'add_transaction', '1774847560768', '30.03.2026 08:12:40', NULL, NULL, NULL, '2026-03-30 05:12:40', 2, 0, '2026-03-30 05:12:40', NULL, 1, 0, NULL, NULL),
(6, 'tl_yatır', 11, '63be2b44-6138-4d36-879e-178b34658d83', NULL, 'tl_yatır-63be2b44-6138-4d36-879e-178b34658d83', '2026-03-24T13:12:59Z', '192.168.1.10', 'tl_yatır', '33', NULL, NULL, '1400', '1400', '1400', '0', 'TL Yatırma', NULL, NULL, NULL, 'queued', 'add_transaction', '1774847587939', '30.03.2026 08:13:07', NULL, NULL, NULL, '2026-03-30 05:13:07', 2, 0, '2026-03-30 05:13:07', NULL, 1, 0, NULL, NULL),
(7, 'tl_yatır', 11, '40c98dd7-6805-4bd9-91f0-13c341426c6c', NULL, 'tl_yatır-40c98dd7-6805-4bd9-91f0-13c341426c6c', '2026-03-24T13:12:59Z', '192.168.1.10', 'tl_yatır', '33', NULL, NULL, '1400', '1400', '1400', '0', 'TL Yatırma', NULL, NULL, NULL, 'queued', 'add_transaction', '1774847603345', '30.03.2026 08:13:23', NULL, NULL, NULL, '2026-03-30 05:13:23', 2, 0, '2026-03-30 05:13:23', NULL, 1, 0, NULL, NULL),
(8, 'usdt', 11, 'cc1124ae-41bc-4bba-bddf-071fe5e2f0a6', NULL, 'blockchain-1774847775090', '2026-03-24T13:12:59Z', '192.168.1.10', 'USDT Transfer', '2', NULL, NULL, '672310.027675', '672310.027675', '672310.027675', '', 'USDT transferi - From: 0x22dA337897F7590D907C9EA3aDf39AA56affA054, To: 0xA9D1e08C7793af67e9d92fe308d5697FB81d3E43', NULL, NULL, NULL, 'queued', 'add_transaction', '1774847775018', '30.03.2026 08:16:15', NULL, NULL, NULL, '2026-03-30 05:16:16', 2, 0, '2026-03-30 05:16:16', NULL, 1, 0, NULL, NULL),
(9, 'usdt', 11, 'dbc5392a-4ad3-45e2-9610-6578be43a84f', NULL, 'blockchain-1774847775157', '2026-03-24T13:12:59Z', '192.168.1.10', 'USDT Transfer', '2', NULL, NULL, '407000', '407000', '407000', '', 'USDT transferi - From: 0xEEc4F9234fC51E93bCdc90bE2540A43D10632695, To: 0xc9F9F694Ae147b1333c4f53266c5ccd5c6E4c04f', NULL, NULL, NULL, 'queued', 'add_transaction', '1774847775156', '30.03.2026 08:16:15', NULL, NULL, NULL, '2026-03-30 05:16:16', 2, 0, '2026-03-30 05:16:16', NULL, 1, 0, NULL, NULL),
(10, 'usdt', 11, '33fb2e83-ba4f-4819-8bbe-2a2d3869166a', NULL, 'blockchain-1774847775447', '2026-03-24T13:12:59Z', '192.168.1.10', 'USDT Transfer', '2', NULL, NULL, '200133.47398', '200133.47398', '200133.47398', '', 'USDT transferi - From: 0x6C96dE32CEa08842dcc4058c14d3aaAD7Fa41dee, To: 0xb2E0a660EA47119BD1f5FfbEd83f5932375d0622', NULL, NULL, NULL, 'queued', 'add_transaction', '1774847775445', '30.03.2026 08:16:15', NULL, NULL, NULL, '2026-03-30 05:16:16', 2, 0, '2026-03-30 05:16:16', NULL, 1, 0, NULL, NULL),
(11, 'usdt', 11, 'a12476ec-784e-4080-833c-616a7663b5cb', NULL, 'blockchain-1774847800590', '2026-03-24T13:12:59Z', '192.168.1.10', 'USDT Transfer', '2', NULL, NULL, '200133.47398', '200133.47398', '200133.47398', '', 'USDT transferi - From: 0xb2E0a660EA47119BD1f5FfbEd83f5932375d0622, To: 0x70bf6634eE8Cb27D04478f184b9b8BB13E5f4710', NULL, NULL, NULL, 'queued', 'add_transaction', '1774847800589', '30.03.2026 08:16:40', NULL, NULL, NULL, '2026-03-30 05:16:41', 2, 0, '2026-03-30 05:16:41', NULL, 1, 0, NULL, NULL),
(12, 'usdt', 11, '71ee85cb-3c18-4560-af37-29d8a82d7f46', NULL, 'blockchain-1774847800592', '2026-03-24T13:12:59Z', '192.168.1.10', 'USDT Transfer', '2', NULL, NULL, '200133.47398', '200133.47398', '200133.47398', '', 'USDT transferi - From: 0x70bf6634eE8Cb27D04478f184b9b8BB13E5f4710, To: 0x63242A4Ea82847b20E506b63B0e2e2eFF0CC6cB0', NULL, NULL, NULL, 'queued', 'add_transaction', '1774847800592', '30.03.2026 08:16:40', NULL, NULL, NULL, '2026-03-30 05:16:41', 2, 0, '2026-03-30 05:16:41', NULL, 1, 0, NULL, NULL),
(13, 'usdt', 11, '264f094f-f2c3-4d53-8ef4-7bcad59b6379', NULL, 'blockchain-1774847800598', '2026-03-24T13:12:59Z', '192.168.1.10', 'USDT Transfer', '2', NULL, NULL, '100066.73699', '100066.73699', '100066.73699', '', 'USDT transferi - From: 0x63242A4Ea82847b20E506b63B0e2e2eFF0CC6cB0, To: 0xe3D41d19564922C9952f692C5Dd0563030f5f2EF', NULL, NULL, NULL, 'queued', 'add_transaction', '1774847800597', '30.03.2026 08:16:40', NULL, NULL, NULL, '2026-03-30 05:16:41', 2, 0, '2026-03-30 05:16:41', NULL, 1, 0, NULL, NULL);

--
-- Dökümü yapılmış tablolar için indeksler
--

--
-- Tablo için indeksler `ms_transaction`
--
ALTER TABLE `ms_transaction`
  ADD PRIMARY KEY (`id`);

--
-- Dökümü yapılmış tablolar için AUTO_INCREMENT değeri
--

--
-- Tablo için AUTO_INCREMENT değeri `ms_transaction`
--
ALTER TABLE `ms_transaction`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
