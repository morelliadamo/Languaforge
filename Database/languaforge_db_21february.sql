-- phpMyAdmin SQL Dump
-- version 5.1.2
-- https://www.phpmyadmin.net/
--
-- Gép: localhost:3306
-- Létrehozás ideje: 2026. Feb 21. 16:45
-- Kiszolgáló verziója: 5.7.24
-- PHP verzió: 8.3.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `languaforge_db`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `avatar_url` varchar(100) DEFAULT NULL,
  `bio` varchar(254) DEFAULT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `role_id` int(11) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_login` timestamp NULL DEFAULT NULL,
  `is_anonymized` tinyint(1) NOT NULL DEFAULT '0',
  `anonymized_at` timestamp NULL DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `activation_token` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- A tábla adatainak kiíratása `user`
--

INSERT INTO `user` (`id`, `username`, `email`, `avatar_url`, `bio`, `password_hash`, `role_id`, `created_at`, `last_login`, `is_anonymized`, `anonymized_at`, `is_deleted`, `deleted_at`, `activation_token`, `is_active`) VALUES
(1, 'maria_lee23', 'alex.jones@example.com', NULL, NULL, '$argon2id$v=19$m=5,t=2,p=2$rv63Vx8$C25hQlNAwSEuX02IA871IuuzK84C/R9i/8+4/9kgsmYyVA2FL4qpvFCnAxryzEr4WImolIAzuOVfcs+uk7/YIg', 1, '2025-08-11 07:44:32', NULL, 0, NULL, 0, NULL, NULL, 0),
(2, 'maria_lee', 'maria.lee@example.com', NULL, NULL, 'hash_pw2', 1, '2025-08-12 07:44:32', '2025-08-24 07:44:32', 0, NULL, 0, NULL, NULL, 0),
(4, 'Lakatos ALi2', 'lakatosALi2@gmail.hu', NULL, NULL, '$argon2id$v=19$m=5,t=2,p=2$LGYd2xo$Egi82HopA4DW9w9U0ubJwlO6ZunZAUgsKhVJ1XqP04n8eKHjgsY5d6VnxT4rXc273s+2tWaKPjOuCkhz4PKm3Q', 1, '2025-12-05 19:00:40', NULL, 0, NULL, 0, NULL, NULL, 0),
(5, 'JohnDoe', 'jdoe@example.com', NULL, NULL, '$argon2id$v=19$m=5,t=2,p=2$WKgqGbo$MpM9ndTyM1TrI0F2rXb0C5Fnq8UfBhG/B5kMwfrn4aJ2jWUUbpqnd/QlpUa8ffHolCXqMoejw9TI0SlIdw9dzQ', 1, '2025-12-08 10:13:02', NULL, 0, NULL, 0, NULL, NULL, 0),
(7, 'JohnDo3e', 'jdoe3@example.com', NULL, NULL, '$argon2id$v=19$m=5,t=2,p=2$reP0rKA$QS+hnhfn6skySU3pmS8U6uThzAdE3Yps6gMnBJh/ydo9ENcKEM/AVP3HGhfay45NPzCUzRsW9wXtIww2nVuo5g', 1, '2025-12-08 10:13:46', NULL, 0, NULL, 0, NULL, NULL, 0),
(8, 'JaneDeer', 'janedeer@example.com', NULL, NULL, '$argon2id$v=19$m=5,t=2,p=2$No7mPJI$0sUqn3wOyVstKeiR1y4ceY/aDSlZL89arvNQh+Si/ND6lDxog/8hZra6+hLGEJC4aynygMTuGeFVotCJ4lZmvQ', 1, '2025-12-08 10:16:32', NULL, 0, NULL, 0, NULL, NULL, 0),
(9, 'Lakatospeter24', 'lakatospeter@gmail.com', NULL, NULL, '$argon2id$v=19$m=5,t=2,p=2$YsPENLY$OfpQsEA5wS/TTLvUwpuk+WOeNB57kR9lsja7yaJemkyq8eJM61uApHjsX2Y8xXfG4Y+1b/p8i7LE2vVQe7CHsQ', 1, '2025-12-08 11:05:46', NULL, 0, NULL, 0, NULL, NULL, 0),
(10, 'lakatospeter25', 'lakatospeter25@gmail.com', NULL, NULL, '$argon2id$v=19$m=5,t=2,p=2$06oLROY$Bo6UeYQ8ImBDuZtwXIskDYOqGPHrJZRpWi5ZCHLo09Dis+vIDjwAk3MkrnNKRSai+h77Rh96C4b9EoxbPg9/rg', 1, '2025-12-08 11:06:25', NULL, 0, NULL, 0, NULL, NULL, 0),
(11, 'JohnnyDoe', 'johnnydoe@gmail.com', NULL, NULL, '$argon2id$v=19$m=5,t=2,p=2$6S9uWkA$DkPAedDoXpAwucAbYq8h4QdDIcgQTqqBmjdvchY3rs4TJz4Wu6JHN9dA+Ly3ysmEQti9O61it7Y0OIDojQ12Nw', 1, '2025-12-08 11:19:17', NULL, 0, NULL, 0, NULL, NULL, 0),
(18, 'morelliadamTheBoss', '1morelliadam@gmail.com', NULL, NULL, '$argon2id$v=19$m=5,t=2,p=2$COvacjM$7sAr1N0c1ITIyYvUG3oL3VF4o/0IXt5i03NcYNWfiHYgrktoKKz/qdI5i9PqisNidlba0wJSEkjwLIHPos1tOg', 2, '2025-12-08 16:56:32', NULL, 0, NULL, 0, NULL, NULL, 1),
(421, '67', 'vastmagenta@comfythings.com', 'http://localhost:8080/users/avatars/avatar_421_50492c34-8782-4bc2-91b8-efec91118d32.png', 'Faj: Homo sapiens\nÉletkor: 13\nNem: igen', '$argon2id$v=19$m=5,t=2,p=2$YfOkFTY$zfz3CpMOeM5G0CicUd4D5ZPvPigwNYNuJ8+5JxD5Rlpjs9adnzYJ5v0H96+4HyVlz8XBW32Cyen1eTo8Z8hgVw', 1, '2025-12-12 17:37:43', '2026-02-21 16:37:11', 0, NULL, 0, NULL, NULL, 1),
(422, 'test45678', 'dorek46596@alexida.com', NULL, NULL, '$argon2id$v=19$m=5,t=2,p=2$vk/nDa4$9Bm8TpB+d7IPADvb63Y4eZWZQXyG/tN8JfC+FAg0N0PTDRokYtcnVh+cDHPCmkiao0D4DAnQy+xriNczEwakQg', 1, '2025-12-12 22:11:45', '2025-12-15 16:29:28', 0, NULL, 0, NULL, NULL, 1),
(423, 'KovacsLajos69', 'asdasd@gmail.com', NULL, NULL, '243242354asd', 1, '2026-02-09 09:24:23', NULL, 0, NULL, 0, '2026-02-17 06:30:03', NULL, 1),
(424, 'lakatoslaci', 'datic54692@fentaoba.com', NULL, NULL, '$argon2id$v=19$m=5,t=2,p=2$MZuvzRU$P5ItF5HCgqgEHWtzT35hErx0/KGoX64ffp67yV8X0OBIbuFB90ceDsneUbCyZmQAf3Wb4tXyRSmoba7FwgBwLw', 1, '2026-02-17 11:43:55', NULL, 0, NULL, 0, NULL, NULL, 1),
(425, 'kovacsbela.eu', '974w8bpt4h@bwmyga.com', NULL, NULL, '$argon2id$v=19$m=5,t=2,p=2$tXTJfks$R7r9pElO4c4LGhRCAN+oYYo1Yk6slq7G3KE+mACNQ+FGeNQJWh44+HOarfaIrDRTdyHkbgvNdibPiMOJ8susXA', 1, '2026-02-17 12:04:54', NULL, 0, NULL, 0, NULL, '56817638-2cb0-4c84-9d7a-4055ca2cccee', 0),
(427, 'detalmick', 'anonmodd@rulersonline.com', 'http://localhost:8080/users/avatars/avatar_427_ec36daf5-56ea-4071-b58e-6512005e02b4.jpeg', 'I\'m a person', '$argon2id$v=19$m=5,t=2,p=2$eq4olpM$oFByH1XqTi2voyKSvQJBXENljCyVCqLAgj9tWEbl3qfzcj9vJOuHBAHpwqdDe7BM6pXALbqQlVfyIqLSPgtlnw', 1, '2026-02-17 12:18:18', '2026-02-21 16:27:49', 0, NULL, 0, NULL, NULL, 1),
(429, 'énvagyokasoma', 'naszisomi@gmail.com', NULL, NULL, '$argon2id$v=19$m=5,t=2,p=2$+mwJjiM$fSj/DtXA9Jt62fwFKE/W/xsK1gY3Uvp05V5qWP1tCf+Kre1AIcNqR4Jr7wjSvEOB2qJ3VEP0srjqGLY/4R/zEg', 1, '2026-02-17 12:31:26', NULL, 0, NULL, 0, NULL, NULL, 1);

--
-- Eseményindítók `user`
--
DELIMITER $$
CREATE TRIGGER `user_before_insert_set_defaults` BEFORE INSERT ON `user` FOR EACH ROW BEGIN
  IF NEW.is_deleted IS NULL THEN SET NEW.is_deleted = 0; END IF;
  IF NEW.is_anonymized IS NULL THEN SET NEW.is_anonymized = 0; END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `user_before_update_set_deleted_at` BEFORE UPDATE ON `user` FOR EACH ROW BEGIN
  IF OLD.is_deleted = 0 AND NEW.is_deleted = 1 THEN
    SET NEW.deleted_at = IF(NEW.deleted_at IS NULL, NOW(), NEW.deleted_at);
  END IF;
END
$$
DELIMITER ;

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_username_unique` (`username`),
  ADD UNIQUE KEY `user_email_unique` (`email`),
  ADD KEY `user_role_id` (`role_id`),
  ADD KEY `idx_user_deletion` (`is_deleted`,`deleted_at`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=431;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_ibfk_role` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
