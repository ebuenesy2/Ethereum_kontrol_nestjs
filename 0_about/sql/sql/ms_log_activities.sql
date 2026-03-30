-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Anamakine: 127.0.0.1
-- Üretim Zamanı: 30 Mar 2026, 07:18:00
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
-- Tablo için tablo yapısı `ms_log_activities`
--

CREATE TABLE `ms_log_activities` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `category` text NOT NULL,
  `entity` text NOT NULL,
  `action` text NOT NULL,
  `db_id` int(11) NOT NULL,
  `subject` longtext NOT NULL,
  `url` varchar(255) DEFAULT NULL,
  `method` varchar(255) DEFAULT NULL,
  `ip` varchar(255) DEFAULT NULL,
  `agent` varchar(255) DEFAULT NULL,
  `details` longtext DEFAULT NULL,
  `deleted_at` timestamp(6) NULL DEFAULT NULL,
  `created_at` timestamp(6) NULL DEFAULT current_timestamp(6),
  `updated_at` timestamp(6) NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `ms_log_activities`
--

INSERT INTO `ms_log_activities` (`id`, `user_id`, `category`, `entity`, `action`, `db_id`, `subject`, `url`, `method`, `ip`, `agent`, `details`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, 2, 'transaction', 'usdt', 'create', 11, 'Transaction transactionCreateDto Oluşturuldu', 'url', 'POST', '0.0.0', 'BlockchainScanner/1.0', '{\"status\":\"queued\",\"statusJob\":\"add_transaction\",\"requestedTime\":1774847464154,\"requestedAt\":\"30.03.2026 08:11:04\",\"jobId\":null,\"id\":1581}', NULL, '2026-03-30 05:11:06.244668', '2026-03-30 05:11:06.244668'),
(2, 2, 'transaction', 'usdt', 'create', 11, 'Transaction transactionCreateDto Oluşturuldu', 'url', 'POST', '0.0.0', 'BlockchainScanner/1.0', '{\"status\":\"queued\",\"statusJob\":\"add_transaction\",\"requestedTime\":1774847476245,\"requestedAt\":\"30.03.2026 08:11:16\",\"jobId\":null,\"id\":1}', NULL, '2026-03-30 05:11:16.930636', '2026-03-30 05:11:16.930636'),
(3, 2, 'transaction', 'usdt', 'create', 11, 'Transaction transactionCreateDto Oluşturuldu', 'url', 'POST', '0.0.0', 'BlockchainScanner/1.0', '{\"status\":\"queued\",\"statusJob\":\"add_transaction\",\"requestedTime\":1774847476746,\"requestedAt\":\"30.03.2026 08:11:16\",\"jobId\":null,\"id\":2}', NULL, '2026-03-30 05:11:16.945931', '2026-03-30 05:11:16.945931'),
(4, 2, 'transaction', 'usdt', 'create', 11, 'Transaction transactionCreateDto Oluşturuldu', 'url', 'POST', '0.0.0', 'BlockchainScanner/1.0', '{\"status\":\"queued\",\"statusJob\":\"add_transaction\",\"requestedTime\":1774847511362,\"requestedAt\":\"30.03.2026 08:11:51\",\"jobId\":null,\"id\":3}', NULL, '2026-03-30 05:11:51.910923', '2026-03-30 05:11:51.910923'),
(5, 2, 'transaction', 'usdt', 'create', 11, 'Transaction transactionCreateDto Oluşturuldu', 'url', 'POST', '0.0.0', 'BlockchainScanner/1.0', '{\"status\":\"queued\",\"statusJob\":\"add_transaction\",\"requestedTime\":1774847511330,\"requestedAt\":\"30.03.2026 08:11:51\",\"jobId\":null,\"id\":4}', NULL, '2026-03-30 05:11:51.957983', '2026-03-30 05:11:51.957983'),
(6, 2, 'transaction', 'tl_yatır', 'create', 11, 'Transaction transactionCreateDto Oluşturuldu', 'http://localhost:3001/transaction/add', 'POST', '::1', 'PostmanRuntime/7.52.0', '{\"status\":\"queued\",\"statusJob\":\"add_transaction\",\"requestedTime\":1774847560768,\"requestedAt\":\"30.03.2026 08:12:40\",\"jobId\":null,\"id\":5}', NULL, '2026-03-30 05:12:40.902079', '2026-03-30 05:12:40.902079'),
(7, 2, 'transaction', 'tl_yatır', 'worker', 11, 'Transaction Verisi Eklendi - jobUuid: 066843bf-96d7-4137-8ddf-dd52e90d0e1c', 'http://localhost:3001/transaction/add', 'POST', '::1', 'PostmanRuntime/7.52.0', '{\"status\":\"queued\",\"statusJob\":\"add_transaction\",\"requestedTime\":1774847560768,\"requestedAt\":\"30.03.2026 08:12:40\",\"jobId\":\"066843bf-96d7-4137-8ddf-dd52e90d0e1c\"}', NULL, '2026-03-30 05:12:40.927704', '2026-03-30 05:12:40.927704'),
(8, 2, 'transaction', 'tl_yatır', 'create', 11, 'Transaction transactionCreateDto Oluşturuldu', 'http://localhost:3001/transaction/add', 'POST', '::1', 'PostmanRuntime/7.52.0', '{\"status\":\"queued\",\"statusJob\":\"add_transaction\",\"requestedTime\":1774847587939,\"requestedAt\":\"30.03.2026 08:13:07\",\"jobId\":null,\"id\":6}', NULL, '2026-03-30 05:13:07.971983', '2026-03-30 05:13:07.971983'),
(9, 2, 'transaction', 'tl_yatır', 'worker', 11, 'Transaction Verisi Eklendi - jobUuid: 63be2b44-6138-4d36-879e-178b34658d83', 'http://localhost:3001/transaction/add', 'POST', '::1', 'PostmanRuntime/7.52.0', '{\"status\":\"queued\",\"statusJob\":\"add_transaction\",\"requestedTime\":1774847587939,\"requestedAt\":\"30.03.2026 08:13:07\",\"jobId\":\"63be2b44-6138-4d36-879e-178b34658d83\"}', NULL, '2026-03-30 05:13:08.016647', '2026-03-30 05:13:08.016647'),
(10, 2, 'transaction', 'tl_yatır', 'create', 11, 'Transaction transactionCreateDto Oluşturuldu', 'http://localhost:3001/transaction/add', 'POST', '::1', 'PostmanRuntime/7.52.0', '{\"status\":\"queued\",\"statusJob\":\"add_transaction\",\"requestedTime\":1774847603345,\"requestedAt\":\"30.03.2026 08:13:23\",\"jobId\":null,\"id\":7}', NULL, '2026-03-30 05:13:23.358531', '2026-03-30 05:13:23.358531'),
(11, 2, 'transaction', 'tl_yatır', 'worker', 11, 'Transaction Verisi Eklendi - jobUuid: 40c98dd7-6805-4bd9-91f0-13c341426c6c', 'http://localhost:3001/transaction/add', 'POST', '::1', 'PostmanRuntime/7.52.0', '{\"status\":\"queued\",\"statusJob\":\"add_transaction\",\"requestedTime\":1774847603345,\"requestedAt\":\"30.03.2026 08:13:23\",\"jobId\":\"40c98dd7-6805-4bd9-91f0-13c341426c6c\"}', NULL, '2026-03-30 05:13:23.365007', '2026-03-30 05:13:23.365007'),
(12, 2, 'transaction', 'usdt', 'create', 11, 'Transaction transactionCreateDto Oluşturuldu', 'url', 'POST', '0.0.0', 'BlockchainScanner/1.0', '{\"status\":\"queued\",\"statusJob\":\"add_transaction\",\"requestedTime\":1774847775445,\"requestedAt\":\"30.03.2026 08:16:15\",\"jobId\":null,\"id\":10}', NULL, '2026-03-30 05:16:16.152700', '2026-03-30 05:16:16.152700'),
(13, 2, 'transaction', 'usdt', 'create', 11, 'Transaction transactionCreateDto Oluşturuldu', 'url', 'POST', '0.0.0', 'BlockchainScanner/1.0', '{\"status\":\"queued\",\"statusJob\":\"add_transaction\",\"requestedTime\":1774847775018,\"requestedAt\":\"30.03.2026 08:16:15\",\"jobId\":null,\"id\":8}', NULL, '2026-03-30 05:16:16.156157', '2026-03-30 05:16:16.156157'),
(14, 2, 'transaction', 'usdt', 'create', 11, 'Transaction transactionCreateDto Oluşturuldu', 'url', 'POST', '0.0.0', 'BlockchainScanner/1.0', '{\"status\":\"queued\",\"statusJob\":\"add_transaction\",\"requestedTime\":1774847775156,\"requestedAt\":\"30.03.2026 08:16:15\",\"jobId\":null,\"id\":9}', NULL, '2026-03-30 05:16:16.154118', '2026-03-30 05:16:16.154118'),
(15, 2, 'transaction', 'usdt', 'create', 11, 'Transaction transactionCreateDto Oluşturuldu', 'url', 'POST', '0.0.0', 'BlockchainScanner/1.0', '{\"status\":\"queued\",\"statusJob\":\"add_transaction\",\"requestedTime\":1774847800592,\"requestedAt\":\"30.03.2026 08:16:40\",\"jobId\":null,\"id\":12}', NULL, '2026-03-30 05:16:41.948301', '2026-03-30 05:16:41.948301'),
(16, 2, 'transaction', 'usdt', 'create', 11, 'Transaction transactionCreateDto Oluşturuldu', 'url', 'POST', '0.0.0', 'BlockchainScanner/1.0', '{\"status\":\"queued\",\"statusJob\":\"add_transaction\",\"requestedTime\":1774847800589,\"requestedAt\":\"30.03.2026 08:16:40\",\"jobId\":null,\"id\":11}', NULL, '2026-03-30 05:16:41.949527', '2026-03-30 05:16:41.949527'),
(17, 2, 'transaction', 'usdt', 'create', 11, 'Transaction transactionCreateDto Oluşturuldu', 'url', 'POST', '0.0.0', 'BlockchainScanner/1.0', '{\"status\":\"queued\",\"statusJob\":\"add_transaction\",\"requestedTime\":1774847800597,\"requestedAt\":\"30.03.2026 08:16:40\",\"jobId\":null,\"id\":13}', NULL, '2026-03-30 05:16:41.952660', '2026-03-30 05:16:41.952660');

--
-- Dökümü yapılmış tablolar için indeksler
--

--
-- Tablo için indeksler `ms_log_activities`
--
ALTER TABLE `ms_log_activities`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Dökümü yapılmış tablolar için AUTO_INCREMENT değeri
--

--
-- Tablo için AUTO_INCREMENT değeri `ms_log_activities`
--
ALTER TABLE `ms_log_activities`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
