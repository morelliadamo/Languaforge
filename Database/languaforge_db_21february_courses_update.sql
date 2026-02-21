-- phpMyAdmin SQL Dump
-- version 5.1.2
-- https://www.phpmyadmin.net/
--
-- Gép: localhost:3306
-- Létrehozás ideje: 2026. Feb 21. 20:00
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

DELIMITER $$
--
-- Eljárások
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `anonymize_due_users` ()   BEGIN
  DECLARE done INT DEFAULT 0;
  DECLARE cur_user_id INT;

  DECLARE cur CURSOR FOR
    SELECT id FROM `user`
    WHERE is_deleted = 1
      AND is_anonymized = 0
      AND deleted_at <= (NOW() - INTERVAL 5 YEAR);

  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

  OPEN cur;
  fetch_loop: LOOP
    FETCH cur INTO cur_user_id;
    IF done = 1 THEN
      LEAVE fetch_loop;
    END IF;
    CALL anonymize_user(cur_user_id);
  END LOOP;
  CLOSE cur;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `anonymize_user` (IN `p_id` INT)   BEGIN
  DECLARE v_new_username VARCHAR(255);
  DECLARE v_new_email VARCHAR(255);

  SET v_new_username = CONCAT('deleted_user_', p_id);
  SET v_new_email = CONCAT('deleted_user_', p_id, '@deleted.local');

  UPDATE `user`
  SET username = v_new_username,
      email = v_new_email,
      last_login = NULL,
      is_anonymized = 1,
      anonymized_at = NOW()
  WHERE id = p_id;

  UPDATE login
  SET device_info = NULL, ip_address = NULL, session_token = NULL, expires_at = NULL, is_anonymized = 1, anonymized_at = NOW()
  WHERE user_id = p_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `create_achievement` (IN `p_name` VARCHAR(255), IN `p_description` TEXT, IN `p_icon_url` VARCHAR(255))   BEGIN
  INSERT INTO achievement (name, description, icon_url)
  VALUES (p_name, p_description, p_icon_url);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `create_course` (IN `p_title` VARCHAR(255), IN `p_description` TEXT)   BEGIN
  INSERT INTO course (title, description) VALUES (p_title, p_description);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `create_friend` (IN `p_user_id` INT, IN `p_friend_id` INT, IN `p_status` VARCHAR(50))   BEGIN
  INSERT INTO friend (user_id, friend_id, status)
  VALUES (p_user_id, p_friend_id, IFNULL(p_status, 'pending'));
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `create_leaderboard` (IN `p_user_id` INT, IN `p_course_id` INT, IN `p_points` INT)   BEGIN
  INSERT INTO leaderboard (user_id, course_id, points)
  VALUES (p_user_id, p_course_id, IFNULL(p_points, 0));
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `create_lesson` (IN `p_unit_id` INT, IN `p_title` VARCHAR(255), IN `p_order_index` INT)   BEGIN
  INSERT INTO lesson (unit_id, title, order_index)
  VALUES (p_unit_id, p_title, p_order_index);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `create_lesson_content` (IN `p_lesson_id` INT, IN `p_content_type` VARCHAR(50), IN `p_content` TEXT, IN `p_order_index` INT)   BEGIN
  INSERT INTO lesson_content (lesson_id, content_type, content, order_index)
  VALUES (p_lesson_id, p_content_type, p_content, p_order_index);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `create_lesson_progress` (IN `p_user_id` INT, IN `p_lesson_id` INT, IN `p_progress` INT)   BEGIN
  INSERT INTO lesson_progress (user_id, lesson_id, progress)
  VALUES (p_user_id, p_lesson_id, IFNULL(p_progress, 0))
  ON DUPLICATE KEY UPDATE progress = VALUES(progress), updated_at = NOW();
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `create_login` (IN `p_user_id` INT, IN `p_device_info` VARCHAR(255), IN `p_ip_address` VARCHAR(45), IN `p_session_token` VARCHAR(255), IN `p_expires_at` TIMESTAMP)   BEGIN
  INSERT INTO login (user_id, device_info, ip_address, session_token, expires_at)
  VALUES (p_user_id, p_device_info, p_ip_address, p_session_token, p_expires_at);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `create_pricing_plan` (IN `p_name` VARCHAR(255), IN `p_price` DECIMAL(10,2), IN `p_billing_cycle` VARCHAR(50))   BEGIN
  INSERT INTO pricing (name, price, billing_cycle)
  VALUES (p_name, p_price, p_billing_cycle);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `create_review` (IN `p_user_id` INT, IN `p_course_id` INT, IN `p_rating` INT, IN `p_comment` TEXT)   BEGIN
  INSERT INTO review (user_id, course_id, rating, comment)
  VALUES (p_user_id, p_course_id, p_rating, p_comment);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `create_score` (IN `p_user_id` INT, IN `p_lesson_id` INT, IN `p_score` INT)   BEGIN
  INSERT INTO score (user_id, lesson_id, score)
  VALUES (p_user_id, p_lesson_id, p_score);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `create_streak` (IN `p_user_id` INT, IN `p_current_streak` INT, IN `p_longest_streak` INT)   BEGIN
  INSERT INTO streak (user_id, current_streak, longest_streak)
  VALUES (p_user_id, IFNULL(p_current_streak, 0), IFNULL(p_longest_streak, 0))
  ON DUPLICATE KEY UPDATE 
    current_streak = VALUES(current_streak),
    longest_streak = VALUES(longest_streak),
    updated_at = NOW();
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `create_subscription` (IN `p_user_id` INT, IN `p_pricing_id` INT, IN `p_status` VARCHAR(50), IN `p_start_date` TIMESTAMP, IN `p_end_date` TIMESTAMP, IN `p_auto_renew` TINYINT)   BEGIN
  INSERT INTO subscription (user_id, pricing_id, status, start_date, end_date, auto_renew)
  VALUES (p_user_id, p_pricing_id, IFNULL(p_status, 'active'), p_start_date, p_end_date, IFNULL(p_auto_renew, 1));
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `create_unit` (IN `p_course_id` INT, IN `p_title` VARCHAR(255), IN `p_order_index` INT)   BEGIN
  INSERT INTO unit (course_id, title, order_index)
  VALUES (p_course_id, p_title, p_order_index);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `create_user` (IN `p_username` VARCHAR(255), IN `p_email` VARCHAR(255), IN `p_password_hash` VARCHAR(255), IN `p_role_id` INT)   BEGIN
  INSERT INTO `user` (username, email, password_hash, role_id)
  VALUES (p_username, p_email, p_password_hash, IFNULL(p_role_id, 1));
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `create_user_achievement` (IN `p_user_id` INT, IN `p_achievement_id` INT)   BEGIN
  INSERT INTO user_achievement (user_id, achievement_id)
  VALUES (p_user_id, p_achievement_id)
  ON DUPLICATE KEY UPDATE earned_at = NOW();
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `get_achievement` (IN `p_id` INT)   BEGIN
  SELECT * FROM achievement WHERE id = p_id AND is_deleted = 0;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `get_course` (IN `p_id` INT)   BEGIN
  SELECT * FROM course WHERE id = p_id AND is_deleted = 0;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `get_friend` (IN `p_id` INT)   BEGIN
  SELECT * FROM friend WHERE id = p_id AND is_deleted = 0;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `get_leaderboard` (IN `p_id` INT)   BEGIN
  SELECT * FROM leaderboard WHERE id = p_id AND is_deleted = 0;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `get_lesson` (IN `p_id` INT)   BEGIN
  SELECT * FROM lesson WHERE id = p_id AND is_deleted = 0;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `get_lesson_content` (IN `p_id` INT)   BEGIN
  SELECT * FROM lesson_content WHERE id = p_id AND is_deleted = 0;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `get_lesson_progress` (IN `p_id` INT)   BEGIN
  SELECT * FROM lesson_progress WHERE id = p_id AND is_deleted = 0;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `get_login` (IN `p_id` INT)   BEGIN
  SELECT * FROM login WHERE id = p_id AND is_deleted = 0;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `get_pricing_plan` (IN `p_id` INT)   BEGIN
  SELECT * FROM pricing WHERE id = p_id AND is_deleted = 0;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `get_review` (IN `p_id` INT)   BEGIN
  SELECT * FROM review WHERE id = p_id AND is_deleted = 0;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `get_score` (IN `p_id` INT)   BEGIN
  SELECT * FROM score WHERE id = p_id AND is_deleted = 0;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `get_streak` (IN `p_id` INT)   BEGIN
  SELECT * FROM streak WHERE id = p_id AND is_deleted = 0;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `get_subscription` (IN `p_id` INT)   BEGIN
  SELECT * FROM subscription WHERE id = p_id AND is_deleted = 0;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `get_unit` (IN `p_id` INT)   BEGIN
  SELECT * FROM unit WHERE id = p_id AND is_deleted = 0;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `get_user` (IN `p_id` INT)   BEGIN
  SELECT id, username, email, role_id, created_at, last_login, is_deleted, deleted_at, is_anonymized, anonymized_at
  FROM `user` WHERE id = p_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `get_user_achievement` (IN `p_id` INT)   BEGIN
  SELECT * FROM user_achievement WHERE id = p_id AND is_deleted = 0;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `get_user_by_email` (IN `emailIN` VARCHAR(255))   BEGIN

SELECT * FROM `user` WHERE `user`.`email` = emailIN;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `get_user_by_username` (IN `usernameIN` VARCHAR(100))   BEGIN

SELECT * FROM `user` WHERE `user`.`username` = usernameIN;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `get_user_course_by_username` (IN `usernameIN` VARCHAR(255))   BEGIN
    SELECT 
        uc.id,
        uc.user_id,
        uc.course_id,
        uc.enrolled_at,
        uc.progress,
        uc.completed_at
    FROM user_course uc
    INNER JOIN user u ON uc.user_id = u.id
    WHERE u.username = usernameIN;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `hard_delete_achievement` (IN `p_id` INT)   BEGIN
  DELETE FROM achievement WHERE id = p_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `hard_delete_user` (IN `p_id` INT)   BEGIN
  DELETE FROM score WHERE user_id = p_id;
  DELETE FROM lesson_progress WHERE user_id = p_id;
  DELETE FROM login WHERE user_id = p_id;
  DELETE FROM leaderboard WHERE user_id = p_id;
  DELETE FROM friend WHERE user_id = p_id OR friend_id = p_id;
  DELETE FROM streak WHERE user_id = p_id;
  DELETE FROM user_achievement WHERE user_id = p_id;
  DELETE FROM review WHERE user_id = p_id;
  DELETE FROM subscription WHERE user_id = p_id;
  DELETE FROM `user` WHERE id = p_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `soft_delete_achievement` (IN `p_id` INT)   BEGIN
  UPDATE achievement SET is_deleted = 1, deleted_at = NOW() WHERE id = p_id AND is_deleted = 0;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `soft_delete_course` (IN `p_id` INT)   BEGIN
  IF EXISTS (SELECT 1 FROM unit WHERE course_id = p_id AND is_deleted = 0)
     OR EXISTS (SELECT 1 FROM leaderboard WHERE course_id = p_id AND is_deleted = 0)
     OR EXISTS (SELECT 1 FROM score WHERE course_id = p_id AND is_deleted = 0)
     OR EXISTS (SELECT 1 FROM lesson_progress WHERE course_id = p_id AND is_deleted = 0)
     OR EXISTS (SELECT 1 FROM review WHERE course_id = p_id AND is_deleted = 0)
  THEN
     SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cannot delete course: related records exist (soft-delete allowed).';
  ELSE
     UPDATE course SET is_deleted = 1, deleted_at = NOW() WHERE id = p_id AND is_deleted = 0;
  END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `soft_delete_friend` (IN `p_id` INT)   BEGIN
  UPDATE friend SET is_deleted = 1, deleted_at = NOW() WHERE id = p_id AND is_deleted = 0;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `soft_delete_leaderboard` (IN `p_id` INT)   BEGIN
  UPDATE leaderboard SET is_deleted = 1, deleted_at = NOW() WHERE id = p_id AND is_deleted = 0;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `soft_delete_lesson` (IN `p_id` INT)   BEGIN
  IF EXISTS (SELECT 1 FROM score WHERE lesson_id = p_id AND is_deleted = 0)
     OR EXISTS (SELECT 1 FROM lesson_progress WHERE lesson_id = p_id AND is_deleted = 0)
     OR EXISTS (SELECT 1 FROM lesson_content WHERE lesson_id = p_id AND is_deleted = 0)
  THEN
     SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cannot delete lesson: scores, progress, or content exist.';
  ELSE
     UPDATE lesson SET is_deleted = 1, deleted_at = NOW() WHERE id = p_id AND is_deleted = 0;
  END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `soft_delete_lesson_content` (IN `p_id` INT)   BEGIN
  UPDATE lesson_content SET is_deleted = 1, deleted_at = NOW() WHERE id = p_id AND is_deleted = 0;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `soft_delete_lesson_progress` (IN `p_id` INT)   BEGIN
  UPDATE lesson_progress SET is_deleted = 1, deleted_at = NOW() WHERE id = p_id AND is_deleted = 0;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `soft_delete_login` (IN `p_id` INT)   BEGIN
  UPDATE login SET is_deleted = 1, deleted_at = NOW() WHERE id = p_id AND is_deleted = 0;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `soft_delete_pricing_plan` (IN `p_id` INT)   BEGIN
  UPDATE pricing SET is_deleted = 1, deleted_at = NOW() WHERE id = p_id AND is_deleted = 0;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `soft_delete_review` (IN `p_id` INT)   BEGIN
  UPDATE review SET is_deleted = 1, deleted_at = NOW() WHERE id = p_id AND is_deleted = 0;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `soft_delete_score` (IN `p_id` INT)   BEGIN
  UPDATE score SET is_deleted = 1, deleted_at = NOW() WHERE id = p_id AND is_deleted = 0;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `soft_delete_streak` (IN `p_id` INT)   BEGIN
  UPDATE streak SET is_deleted = 1, deleted_at = NOW() WHERE id = p_id AND is_deleted = 0;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `soft_delete_subscription` (IN `p_id` INT)   BEGIN
  UPDATE subscription SET is_deleted = 1, deleted_at = NOW() WHERE id = p_id AND is_deleted = 0;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `soft_delete_unit` (IN `p_id` INT)   BEGIN
  IF EXISTS (SELECT 1 FROM lesson WHERE unit_id = p_id AND is_deleted = 0)
  THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cannot delete unit: lessons exist under this unit.';
  ELSE
    UPDATE unit SET is_deleted = 1, deleted_at = NOW() WHERE id = p_id AND is_deleted = 0;
  END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `soft_delete_user` (IN `p_id` INT)   BEGIN
  UPDATE login
  SET device_info = NULL, ip_address = NULL, session_token = NULL, expires_at = NULL
  WHERE user_id = p_id AND is_deleted = 0;

  UPDATE `user` SET is_deleted = 1, deleted_at = NOW() WHERE id = p_id AND is_deleted = 0;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `soft_delete_user_achievement` (IN `p_id` INT)   BEGIN
  UPDATE user_achievement SET is_deleted = 1, deleted_at = NOW() WHERE id = p_id AND is_deleted = 0;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `update_achievement` (IN `p_id` INT, IN `p_name` VARCHAR(255), IN `p_description` TEXT, IN `p_icon_url` VARCHAR(255))   BEGIN
  UPDATE achievement
  SET name = p_name,
      description = p_description,
      icon_url = p_icon_url
  WHERE id = p_id AND is_deleted = 0;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `update_course` (IN `p_id` INT, IN `p_title` VARCHAR(255), IN `p_description` TEXT)   BEGIN
  UPDATE course SET title = p_title, description = p_description WHERE id = p_id AND is_deleted = 0;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `update_friend_status` (IN `p_id` INT, IN `p_status` VARCHAR(50))   BEGIN
  UPDATE friend SET status = p_status WHERE id = p_id AND is_deleted = 0;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `update_leaderboard` (IN `p_id` INT, IN `p_points` INT)   BEGIN
  UPDATE leaderboard
  SET points = p_points,
      updated_at = NOW()
  WHERE id = p_id AND is_deleted = 0;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `update_lesson` (IN `p_id` INT, IN `p_title` VARCHAR(255), IN `p_order_index` INT)   BEGIN
  UPDATE lesson SET title = p_title, order_index = p_order_index WHERE id = p_id AND is_deleted = 0;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `update_lesson_content` (IN `p_id` INT, IN `p_content_type` VARCHAR(50), IN `p_content` TEXT, IN `p_order_index` INT)   BEGIN
  UPDATE lesson_content
  SET content_type = p_content_type,
      content = p_content,
      order_index = p_order_index
  WHERE id = p_id AND is_deleted = 0;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `update_lesson_progress` (IN `p_id` INT, IN `p_progress` INT)   BEGIN
  UPDATE lesson_progress
  SET progress = p_progress,
      updated_at = NOW()
  WHERE id = p_id AND is_deleted = 0;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `update_login` (IN `p_id` INT, IN `p_device_info` VARCHAR(255), IN `p_ip_address` VARCHAR(45), IN `p_session_token` VARCHAR(255), IN `p_expires_at` TIMESTAMP)   BEGIN
  UPDATE login
  SET device_info = p_device_info,
      ip_address = p_ip_address,
      session_token = p_session_token,
      expires_at = p_expires_at
  WHERE id = p_id AND is_deleted = 0;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `update_review` (IN `p_id` INT, IN `p_rating` INT, IN `p_comment` TEXT)   BEGIN
  UPDATE review
  SET rating = p_rating,
      comment = p_comment
  WHERE id = p_id AND is_deleted = 0;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `update_score` (IN `p_id` INT, IN `p_score` INT)   BEGIN
  UPDATE score
  SET score = p_score
  WHERE id = p_id AND is_deleted = 0;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `update_streak` (IN `p_id` INT, IN `p_current_streak` INT, IN `p_longest_streak` INT)   BEGIN
  UPDATE streak
  SET current_streak = p_current_streak,
      longest_streak = p_longest_streak,
      updated_at = NOW()
  WHERE id = p_id AND is_deleted = 0;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `update_subscription` (IN `p_id` INT, IN `p_status` VARCHAR(50), IN `p_end_date` TIMESTAMP, IN `p_auto_renew` TINYINT)   BEGIN
  UPDATE subscription
  SET status = p_status,
      end_date = p_end_date,
      auto_renew = p_auto_renew,
      updated_at = NOW()
  WHERE id = p_id AND is_deleted = 0;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `update_unit` (IN `p_id` INT, IN `p_title` VARCHAR(255), IN `p_order_index` INT)   BEGIN
  UPDATE unit SET title = p_title, order_index = p_order_index WHERE id = p_id AND is_deleted = 0;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `update_user` (IN `p_id` INT, IN `p_username` VARCHAR(255), IN `p_email` VARCHAR(255), IN `p_role_id` INT)   BEGIN
  UPDATE `user`
  SET username = p_username,
      email = p_email,
      role_id = p_role_id
  WHERE id = p_id AND is_deleted = 0;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `update_user_achievement` (IN `p_id` INT, IN `p_user_id` INT, IN `p_achievement_id` INT)   BEGIN
  UPDATE user_achievement
  SET user_id = p_user_id,
      achievement_id = p_achievement_id
  WHERE id = p_id AND is_deleted = 0;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `achievement`
--

CREATE TABLE `achievement` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `icon_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- A tábla adatainak kiíratása `achievement`
--

INSERT INTO `achievement` (`id`, `name`, `description`, `icon_url`, `created_at`, `is_deleted`, `deleted_at`) VALUES
(1, 'First Steps', 'Completed your first lesson!', 'https://example.com/icons/first_steps.png', '2025-11-19 11:27:56', 0, NULL);

--
-- Eseményindítók `achievement`
--
DELIMITER $$
CREATE TRIGGER `achievement_before_update_set_deleted_at` BEFORE UPDATE ON `achievement` FOR EACH ROW BEGIN
  IF OLD.is_deleted = 0 AND NEW.is_deleted = 1 THEN
    SET NEW.deleted_at = IF(NEW.deleted_at IS NULL, NOW(), NEW.deleted_at);
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `course`
--

CREATE TABLE `course` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- A tábla adatainak kiíratása `course`
--

INSERT INTO `course` (`id`, `title`, `description`, `created_at`, `is_deleted`, `deleted_at`) VALUES
(14, 'Magyar-Angol alapok', 'Tanuld meg az angol nyelv alapjait!', '2026-02-21 19:36:55', 0, NULL),
(15, 'Magyar-Angol: Utazás és közlekedés', 'Tanulj meg angolul utazni és közlekedni!', '2026-02-21 19:39:50', 0, NULL),
(16, 'Magyar-Angol: Vásárlás és pénzügyek', 'Tanulj meg angolul vásárolni és pénzügyekről beszélni!', '2026-02-21 19:44:29', 0, NULL),
(17, 'Magyar-Angol: Munka és karrier', 'Sajátítsd el a munkahelyi angol kifejezéseket és karrierépítéshez szükséges szókincset!', '2026-02-21 19:53:09', 0, NULL),
(18, 'Magyar-Angol: Család és kapcsolatok', 'Tanulj meg angolul a családról és emberi kapcsolatokról beszélni!', '2026-02-21 19:58:01', 0, NULL),
(19, 'Magyar-Angol: Technológia és internet', 'Tanulj meg angolul a modern technológiáról és az internetről!', '2026-02-21 20:00:38', 0, NULL);

--
-- Eseményindítók `course`
--
DELIMITER $$
CREATE TRIGGER `course_before_update_set_deleted_at` BEFORE UPDATE ON `course` FOR EACH ROW BEGIN
  IF OLD.is_deleted = 0 AND NEW.is_deleted = 1 THEN
    SET NEW.deleted_at = IF(NEW.deleted_at IS NULL, NOW(), NEW.deleted_at);
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `exercise`
--

CREATE TABLE `exercise` (
  `id` int(11) NOT NULL,
  `lesson_id` int(11) NOT NULL,
  `exercise_content` json NOT NULL,
  `exercise_type` varchar(10) NOT NULL,
  `is_deleted` tinyint(4) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- A tábla adatainak kiíratása `exercise`
--

INSERT INTO `exercise` (`id`, `lesson_id`, `exercise_content`, `exercise_type`, `is_deleted`, `deleted_at`, `created_at`) VALUES
(66, 27, '{\"answers\": [\"piros\", \"kék\", \"zöld\", \"sárga\"], \"description\": \"Mit jelent ez a szó: red?\", \"correctAnswer\": \"piros\"}', 'choice', 0, NULL, '2025-12-07 12:42:43'),
(67, 27, '{\"answers\": [\"red\", \"green\", \"yellow\", \"blue\"], \"description\": \"Hogy van ez angolul: kék?\", \"correctAnswer\": \"blue\"}', 'choice', 0, NULL, '2025-12-07 12:42:43'),
(68, 27, '{\"answers\": [\"macska\", \"kutya\", \"egér\", \"fácán\"], \"description\": \"Mi a CAT magyar megfelelője?\", \"correctAnswer\": \"macska\"}', 'choice', 0, NULL, '2026-02-14 11:29:41'),
(69, 27, '{\"answers\": [\"piros\", \"kék\", \"zöld\", \"sárga\"], \"description\": \"Mit jelent ez a szó: green?\", \"correctAnswer\": \"zöld\"}', 'choice', 0, NULL, '2025-12-07 12:42:43'),
(70, 27, '{\"answers\": [\"red\", \"green\", \"yellow\", \"blue\"], \"description\": \"Hogy van ez angolul: sárga?\", \"correctAnswer\": \"yellow\"}', 'choice', 0, NULL, '2025-12-07 12:42:43'),
(71, 27, '{\"answers\": [\"white\", \"black\", \"gray\", \"purple\"], \"description\": \"What is the English word for \'fehér\'?\", \"correctAnswer\": \"white\"}', 'choice', 0, NULL, '2025-12-07 12:42:43'),
(72, 27, '{\"answers\": [\"egy\", \"kettő\", \"három\", \"négy\"], \"description\": \"Mit jelent ez a szó: one?\", \"correctAnswer\": \"egy\"}', 'choice', 0, NULL, '2025-12-07 12:42:43'),
(73, 27, '{\"answers\": [\"three\", \"four\", \"five\", \"six\"], \"description\": \"Hogy van ez angolul: öt?\", \"correctAnswer\": \"five\"}', 'choice', 0, NULL, '2025-12-07 12:42:43'),
(74, 27, '{\"answers\": [\"hat\", \"hét\", \"nyolc\", \"tíz\"], \"description\": \"Mit jelent ez a szó: ten?\", \"correctAnswer\": \"tíz\"}', 'choice', 0, NULL, '2025-12-07 12:42:43'),
(75, 28, '{\"answers\": [\"macska\", \"kutya\", \"ló\", \"tehén\"], \"description\": \"Mit jelent ez a szó: dog?\", \"correctAnswer\": \"kutya\"}', 'choice', 0, NULL, '2025-12-07 13:00:00'),
(76, 28, '{\"answers\": [\"cow\", \"pig\", \"horse\", \"sheep\"], \"description\": \"Hogy van ez angolul: ló?\", \"correctAnswer\": \"horse\"}', 'choice', 0, NULL, '2025-12-07 13:00:00'),
(77, 28, '{\"answers\": [\"hal\", \"madár\", \"béka\", \"egér\"], \"description\": \"What is the Hungarian word for \'bird\'?\", \"correctAnswer\": \"madár\"}', 'choice', 0, NULL, '2025-12-07 13:00:00'),
(78, 28, '{\"answers\": [\"hal\", \"madár\", \"nyúl\", \"kígyó\"], \"description\": \"Mit jelent ez a szó: fish?\", \"correctAnswer\": \"hal\"}', 'choice', 0, NULL, '2025-12-07 13:00:00'),
(79, 28, '{\"answers\": [\"fox\", \"wolf\", \"rabbit\", \"bear\"], \"description\": \"Hogy van ez angolul: nyúl?\", \"correctAnswer\": \"rabbit\"}', 'choice', 0, NULL, '2025-12-07 13:00:00'),
(80, 29, '{\"answers\": [\"szék\", \"asztal\", \"ágy\", \"szekrény\"], \"description\": \"Mit jelent ez a szó: table?\", \"correctAnswer\": \"asztal\"}', 'choice', 0, NULL, '2025-12-08 09:00:00'),
(81, 29, '{\"answers\": [\"pen\", \"book\", \"bag\", \"cup\"], \"description\": \"Hogy van ez angolul: könyv?\", \"correctAnswer\": \"book\"}', 'choice', 0, NULL, '2025-12-08 09:00:00'),
(82, 29, '{\"answers\": [\"computer\", \"phone\", \"tablet\", \"camera\"], \"description\": \"What is \'telefon\' in English?\", \"correctAnswer\": \"phone\"}', 'choice', 0, NULL, '2025-12-08 09:00:00'),
(83, 29, '{\"answers\": [\"ablak\", \"fal\", \"ajtó\", \"padló\"], \"description\": \"Mit jelent ez a szó: door?\", \"correctAnswer\": \"ajtó\"}', 'choice', 0, NULL, '2025-12-08 09:00:00'),
(84, 30, '{\"answers\": [\"Good night!\", \"Good morning!\", \"Good evening!\", \"Goodbye!\"], \"description\": \"Hogy van ez angolul: \'Jó reggelt!\'?\", \"correctAnswer\": \"Good morning!\"}', 'choice', 0, NULL, '2025-12-10 08:10:00'),
(85, 30, '{\"answers\": [\"Hogy hívnak?\", \"Hány éves vagy?\", \"Hogy vagy?\", \"Hol laksz?\"], \"description\": \"Mit jelent ez a mondat: \'How are you?\'\", \"correctAnswer\": \"Hogy vagy?\"}', 'choice', 0, NULL, '2025-12-10 08:10:00'),
(86, 30, '{\"answers\": [\"Hello!\", \"Welcome!\", \"Goodbye!\", \"Please!\"], \"description\": \"Hogy van ez angolul: \'Viszontlátásra!\'?\", \"correctAnswer\": \"Goodbye!\"}', 'choice', 0, NULL, '2025-12-10 08:10:00'),
(87, 30, '{\"answers\": [\"A barátom Anna.\", \"A nevem Anna.\", \"Anna tanár.\", \"Ismerem Annát.\"], \"description\": \"Mit jelent: \'My name is Anna.\'?\", \"correctAnswer\": \"A nevem Anna.\"}', 'choice', 0, NULL, '2025-12-10 08:10:00'),
(88, 31, '{\"answers\": [\"Where are you from?\", \"How old are you?\", \"What do you do?\", \"Do you speak English?\"], \"description\": \"Hogy van ez angolul: \'Hány éves vagy?\'\", \"correctAnswer\": \"How old are you?\"}', 'choice', 0, NULL, '2025-12-11 09:00:00'),
(89, 31, '{\"answers\": [\"Szeretek Magyarországon lakni.\", \"Magyarországról jövök.\", \"Ismerem Magyarországot.\", \"Magyarországra megyek.\"], \"description\": \"Mit jelent: \'I am from Hungary.\'?\", \"correctAnswer\": \"Magyarországról jövök.\"}', 'choice', 0, NULL, '2025-12-11 09:00:00'),
(90, 32, '{\"answers\": [\"sajt\", \"kenyér\", \"hús\", \"tojás\"], \"description\": \"Mit jelent ez a szó: bread?\", \"correctAnswer\": \"kenyér\"}', 'choice', 0, NULL, '2025-12-15 10:20:00'),
(91, 32, '{\"answers\": [\"banana\", \"apple\", \"orange\", \"grape\"], \"description\": \"Hogy van ez angolul: alma?\", \"correctAnswer\": \"apple\"}', 'choice', 0, NULL, '2025-12-15 10:20:00'),
(92, 32, '{\"answers\": [\"pasta\", \"rice\", \"bread\", \"soup\"], \"description\": \"What is \'rizs\' in English?\", \"correctAnswer\": \"rice\"}', 'choice', 0, NULL, '2025-12-15 10:20:00'),
(93, 33, '{\"answers\": [\"tej\", \"víz\", \"bor\", \"sör\"], \"description\": \"Mit jelent ez a szó: water?\", \"correctAnswer\": \"víz\"}', 'choice', 0, NULL, '2025-12-16 09:00:00'),
(94, 33, '{\"answers\": [\"juice\", \"coffee\", \"milk\", \"tea\"], \"description\": \"Hogy van ez angolul: tej?\", \"correctAnswer\": \"milk\"}', 'choice', 0, NULL, '2025-12-16 09:00:00'),
(95, 34, '{\"answers\": [\"busz\", \"vonat\", \"repülő\", \"hajó\"], \"description\": \"Mit jelent ez a szó: train?\", \"correctAnswer\": \"vonat\"}', 'choice', 0, NULL, '2026-01-15 09:30:00'),
(96, 34, '{\"answers\": [\"boat\", \"train\", \"airplane\", \"bicycle\"], \"description\": \"Hogy van ez angolul: \'repülőgép\'?\", \"correctAnswer\": \"airplane\"}', 'choice', 0, NULL, '2026-01-15 09:30:00'),
(97, 34, '{\"answers\": [\"villamos\", \"metró\", \"busz\", \"trolibusz\"], \"description\": \"Mi a \'subway\' magyar megfelelője?\", \"correctAnswer\": \"metró\"}', 'choice', 0, NULL, '2026-01-15 09:30:00'),
(98, 34, '{\"answers\": [\"motorcycle\", \"scooter\", \"bicycle\", \"car\"], \"description\": \"Hogy van ez angolul: \'kerékpár\'?\", \"correctAnswer\": \"bicycle\"}', 'choice', 0, NULL, '2026-01-15 09:30:00'),
(99, 34, '{\"answers\": [\"komp\", \"vitorlás\", \"csónak\", \"jacht\"], \"description\": \"Mit jelent ez a szó: ferry?\", \"correctAnswer\": \"komp\"}', 'choice', 0, NULL, '2026-01-15 09:30:00'),
(100, 35, '{\"answers\": [\"straight\", \"right\", \"left\", \"back\"], \"description\": \"Hogy van ez angolul: \'balra\'?\", \"correctAnswer\": \"left\"}', 'choice', 0, NULL, '2026-01-16 09:00:00'),
(101, 35, '{\"answers\": [\"Menjen egyenesen a sarkon.\", \"Forduljon jobbra a sarkon.\", \"Forduljon balra a sarkon.\", \"Álljon meg a sarkon.\"], \"description\": \"Mit jelent: \'Turn right at the corner.\'?\", \"correctAnswer\": \"Forduljon jobbra a sarkon.\"}', 'choice', 0, NULL, '2026-01-16 09:00:00'),
(102, 35, '{\"answers\": [\"járda\", \"zebrán\", \"kereszteződés\", \"körforgalom\"], \"description\": \"Mi a \'crossroads\' magyar megfelelője?\", \"correctAnswer\": \"kereszteződés\"}', 'choice', 0, NULL, '2026-01-16 09:00:00'),
(103, 35, '{\"answers\": [\"left\", \"right\", \"straight ahead\", \"behind\"], \"description\": \"Hogy van ez angolul: \'egyenesen\'?\", \"correctAnswer\": \"straight ahead\"}', 'choice', 0, NULL, '2026-01-16 09:00:00'),
(104, 36, '{\"answers\": [\"jegypénztár\", \"váróterem\", \"peron\", \"kijárat\"], \"description\": \"Mit jelent: \'platform\'?\", \"correctAnswer\": \"peron\"}', 'choice', 0, NULL, '2026-01-17 09:00:00'),
(105, 36, '{\"answers\": [\"pass\", \"ticket\", \"receipt\", \"boarding pass\"], \"description\": \"Hogy van ez angolul: \'jegy\'?\", \"correctAnswer\": \"ticket\"}', 'choice', 0, NULL, '2026-01-17 09:00:00'),
(106, 36, '{\"answers\": [\"érkezés\", \"indulás\", \"késés\", \"törlés\"], \"description\": \"Mit jelent: \'departure\'?\", \"correctAnswer\": \"indulás\"}', 'choice', 0, NULL, '2026-01-17 09:00:00'),
(107, 36, '{\"answers\": [\"the train is fast\", \"the train is delayed\", \"the train is cancelled\", \"the train is full\"], \"description\": \"Hogy van ez angolul: \'késik a vonat\'?\", \"correctAnswer\": \"the train is delayed\"}', 'choice', 0, NULL, '2026-01-17 09:00:00'),
(108, 37, '{\"answers\": [\"beszállás\", \"bejelentkezés\", \"csomagfelvétel\", \"vámvizsgálat\"], \"description\": \"Mit jelent: \'check-in\'?\", \"correctAnswer\": \"bejelentkezés\"}', 'choice', 0, NULL, '2026-01-20 09:10:00'),
(109, 37, '{\"answers\": [\"ID card\", \"passport\", \"visa\", \"permit\"], \"description\": \"Hogy van ez angolul: \'útlevél\'?\", \"correctAnswer\": \"passport\"}', 'choice', 0, NULL, '2026-01-20 09:10:00'),
(110, 37, '{\"answers\": [\"poggyász leadás\", \"csomagmegőrző\", \"csomagkiadó\", \"poggyász szállítás\"], \"description\": \"Mit jelent: \'baggage claim\'?\", \"correctAnswer\": \"csomagkiadó\"}', 'choice', 0, NULL, '2026-01-20 09:10:00'),
(111, 37, '{\"answers\": [\"terminal\", \"gate\", \"runway\", \"lounge\"], \"description\": \"Hogy van ez angolul: \'kapu\' (repülőtéren)?\", \"correctAnswer\": \"gate\"}', 'choice', 0, NULL, '2026-01-20 09:10:00'),
(112, 38, '{\"answers\": [\"room service\", \"room booking\", \"room key\", \"room number\"], \"description\": \"Hogy van ez angolul: \'szoba foglalás\'?\", \"correctAnswer\": \"room booking\"}', 'choice', 0, NULL, '2026-01-21 09:00:00'),
(113, 38, '{\"answers\": [\"Van szabad parkolójuk?\", \"Van szabad szobájuk?\", \"Van étkezési lehetőség?\", \"Van WiFi?\"], \"description\": \"Mit jelent: \'Do you have a vacancy?\'\", \"correctAnswer\": \"Van szabad szobájuk?\"}', 'choice', 0, NULL, '2026-01-21 09:00:00'),
(114, 38, '{\"answers\": [\"check-in\", \"check-out\", \"room service\", \"wake-up call\"], \"description\": \"Hogy van ez angolul: \'kijelentkezés\'?\", \"correctAnswer\": \"check-out\"}', 'choice', 0, NULL, '2026-01-21 09:00:00'),
(115, 39, '{\"answers\": [\"könyvtár\", \"múzeum\", \"galéria\", \"színház\"], \"description\": \"Mit jelent: \'museum\'?\", \"correctAnswer\": \"múzeum\"}', 'choice', 0, NULL, '2026-01-25 09:10:00'),
(116, 39, '{\"answers\": [\"tower\", \"palace\", \"castle\", \"cathedral\"], \"description\": \"Hogy van ez angolul: \'vár\'?\", \"correctAnswer\": \"castle\"}', 'choice', 0, NULL, '2026-01-25 09:10:00'),
(117, 39, '{\"answers\": [\"önálló séta\", \"idegenvezetős túra\", \"hajókirándulás\", \"busztúra\"], \"description\": \"Mit jelent: \'guided tour\'?\", \"correctAnswer\": \"idegenvezetős túra\"}', 'choice', 0, NULL, '2026-01-25 09:10:00'),
(118, 40, '{\"answers\": [\"Hol kapható?\", \"Mennyibe kerül?\", \"Van kedvezmény?\", \"Mikor zár?\"], \"description\": \"Mit jelent: \'How much does it cost?\'\", \"correctAnswer\": \"Mennyibe kerül?\"}', 'choice', 0, NULL, '2026-01-18 09:30:00'),
(119, 40, '{\"answers\": [\"entrance\", \"exit\", \"cashier\", \"fitting room\"], \"description\": \"Hogy van ez angolul: \'pénztár\'?\", \"correctAnswer\": \"cashier\"}', 'choice', 0, NULL, '2026-01-18 09:30:00'),
(120, 40, '{\"answers\": [\"árcímke\", \"nyugta\", \"garancia\", \"számla\"], \"description\": \"Mit jelent: \'receipt\'?\", \"correctAnswer\": \"nyugta\"}', 'choice', 0, NULL, '2026-01-18 09:30:00'),
(121, 40, '{\"answers\": [\"changing room\", \"storage room\", \"showroom\", \"back room\"], \"description\": \"Hogy van ez angolul: \'próbafülke\'?\", \"correctAnswer\": \"changing room\"}', 'choice', 0, NULL, '2026-01-18 09:30:00'),
(122, 40, '{\"answers\": [\"raktárkészlet\", \"leárazás\", \"áremelés\", \"szállítás\"], \"description\": \"Mit jelent: \'sale\'?\", \"correctAnswer\": \"leárazás\"}', 'choice', 0, NULL, '2026-01-18 09:30:00'),
(123, 41, '{\"answers\": [\"nadrág\", \"kabát\", \"ing\", \"pulóver\"], \"description\": \"Mit jelent: \'jacket\'?\", \"correctAnswer\": \"kabát\"}', 'choice', 0, NULL, '2026-01-19 09:00:00'),
(124, 41, '{\"answers\": [\"sock\", \"boot\", \"shoe\", \"sandal\"], \"description\": \"Hogy van ez angolul: \'cipő\'?\", \"correctAnswer\": \"shoe\"}', 'choice', 0, NULL, '2026-01-19 09:00:00'),
(125, 41, '{\"answers\": [\"sapka\", \"sál\", \"kesztyű\", \"öv\"], \"description\": \"Mit jelent: \'gloves\'?\", \"correctAnswer\": \"kesztyű\"}', 'choice', 0, NULL, '2026-01-19 09:00:00'),
(126, 41, '{\"answers\": [\"blouse\", \"dress\", \"skirt\", \"trousers\"], \"description\": \"Hogy van ez angolul: \'szoknya\'?\", \"correctAnswer\": \"skirt\"}', 'choice', 0, NULL, '2026-01-19 09:00:00'),
(127, 42, '{\"answers\": [\"Van kisebb méretben?\", \"Van nagyobb méretben?\", \"Van más színben?\", \"Van olcsóbb változatban?\"], \"description\": \"Mit jelent: \'Do you have this in a larger size?\'\", \"correctAnswer\": \"Van nagyobb méretben?\"}', 'choice', 0, NULL, '2026-01-20 09:00:00'),
(128, 42, '{\"answers\": [\"loose\", \"tight\", \"long\", \"short\"], \"description\": \"Hogy van ez angolul: \'szoros / szűk\'?\", \"correctAnswer\": \"tight\"}', 'choice', 0, NULL, '2026-01-20 09:00:00'),
(129, 42, '{\"answers\": [\"Túl nagy.\", \"Tökéletesen áll.\", \"Nem tetszik.\", \"Ki kell cserélni.\"], \"description\": \"Mit jelent: \'It fits perfectly.\'?\", \"correctAnswer\": \"Tökéletesen áll.\"}', 'choice', 0, NULL, '2026-01-20 09:00:00'),
(130, 43, '{\"answers\": [\"bankszámla\", \"árfolyam\", \"kamat\", \"átutalás\"], \"description\": \"Mit jelent: \'exchange rate\'?\", \"correctAnswer\": \"árfolyam\"}', 'choice', 0, NULL, '2026-01-22 09:10:00'),
(131, 43, '{\"answers\": [\"coin\", \"banknote\", \"card\", \"cheque\"], \"description\": \"Hogy van ez angolul: \'bankjegy\'?\", \"correctAnswer\": \"banknote\"}', 'choice', 0, NULL, '2026-01-22 09:10:00'),
(132, 43, '{\"answers\": [\"bank\", \"bankfiók\", \"bankautomata\", \"pénzváltó\"], \"description\": \"Mit jelent: \'ATM\'?\", \"correctAnswer\": \"bankautomata\"}', 'choice', 0, NULL, '2026-01-22 09:10:00'),
(133, 43, '{\"answers\": [\"payment\", \"tip\", \"change\", \"deposit\"], \"description\": \"Hogy van ez angolul: \'visszajáró\'?\", \"correctAnswer\": \"change\"}', 'choice', 0, NULL, '2026-01-22 09:10:00'),
(134, 44, '{\"answers\": [\"pays by card\", \"pays in cash\", \"pays online\", \"pays by cheque\"], \"description\": \"Hogy van ez angolul: \'készpénzzel fizet\'?\", \"correctAnswer\": \"pays in cash\"}', 'choice', 0, NULL, '2026-01-23 09:00:00'),
(135, 44, '{\"answers\": [\"Hitelkártyával fizetek.\", \"Elfogadnak hitelkártyát?\", \"Van önnek hitelkártyája?\", \"Melyik kártyát fogadják el?\"], \"description\": \"Mit jelent: \'Can I pay by credit card?\'\", \"correctAnswer\": \"Elfogadnak hitelkártyát?\"}', 'choice', 0, NULL, '2026-01-23 09:00:00'),
(136, 44, '{\"answers\": [\"fee\", \"fine\", \"tip\", \"tax\"], \"description\": \"Hogy van ez angolul: \'borravaló\'?\", \"correctAnswer\": \"tip\"}', 'choice', 0, NULL, '2026-01-23 09:00:00'),
(137, 45, '{\"answers\": [\"bill\", \"menu\", \"order\", \"reservation\"], \"description\": \"Hogy van ez angolul: \'étlap\'?\", \"correctAnswer\": \"menu\"}', 'choice', 0, NULL, '2026-01-26 09:10:00'),
(138, 45, '{\"answers\": [\"Rendelni szeretnék.\", \"Asztalt szeretnék foglalni.\", \"Kérem a számlát.\", \"Van szabad asztaluk?\"], \"description\": \"Mit jelent: \'I would like to make a reservation.\'\", \"correctAnswer\": \"Asztalt szeretnék foglalni.\"}', 'choice', 0, NULL, '2026-01-26 09:10:00'),
(139, 45, '{\"answers\": [\"More water, please!\", \"The menu, please!\", \"The bill, please!\", \"A table for two, please!\"], \"description\": \"Hogy van ez angolul: \'Kérem a számlát!\'\", \"correctAnswer\": \"The bill, please!\"}', 'choice', 0, NULL, '2026-01-26 09:10:00'),
(140, 45, '{\"answers\": [\"főfogás\", \"desszert\", \"előétel\", \"köret\"], \"description\": \"Mit jelent: \'starter\'?\", \"correctAnswer\": \"előétel\"}', 'choice', 0, NULL, '2026-01-26 09:10:00'),
(141, 46, '{\"answers\": [\"ügyvéd\", \"mérnök\", \"könyvelő\", \"orvos\"], \"description\": \"Mit jelent: \'accountant\'?\", \"correctAnswer\": \"könyvelő\"}', 'choice', 0, NULL, '2026-01-20 09:30:00'),
(142, 46, '{\"answers\": [\"nurse\", \"teacher\", \"driver\", \"chef\"], \"description\": \"Hogy van ez angolul: \'tanár\'?\", \"correctAnswer\": \"teacher\"}', 'choice', 0, NULL, '2026-01-20 09:30:00'),
(143, 46, '{\"answers\": [\"rendszergazda\", \"szoftverfejlesztő\", \"adatbázis-kezelő\", \"grafikus\"], \"description\": \"Mit jelent: \'software developer\'?\", \"correctAnswer\": \"szoftverfejlesztő\"}', 'choice', 0, NULL, '2026-01-20 09:30:00'),
(144, 46, '{\"answers\": [\"employee\", \"colleague\", \"manager\", \"intern\"], \"description\": \"Hogy van ez angolul: \'vezető / főnök\'?\", \"correctAnswer\": \"manager\"}', 'choice', 0, NULL, '2026-01-20 09:30:00'),
(145, 46, '{\"answers\": [\"részmunkaidős dolgozó\", \"szabadúszó\", \"önkéntes\", \"gyakornokok\"], \"description\": \"Mit jelent: \'freelancer\'?\", \"correctAnswer\": \"szabadúszó\"}', 'choice', 0, NULL, '2026-01-20 09:30:00'),
(146, 47, '{\"answers\": [\"conference\", \"meeting\", \"seminar\", \"workshop\"], \"description\": \"Hogy van ez angolul: \'értekezlet\'?\", \"correctAnswer\": \"meeting\"}', 'choice', 0, NULL, '2026-01-21 09:00:00'),
(147, 47, '{\"answers\": [\"bemutató\", \"táblázat\", \"szövegdokumentum\", \"adatbázis\"], \"description\": \"Mit jelent: \'spreadsheet\'?\", \"correctAnswer\": \"táblázat\"}', 'choice', 0, NULL, '2026-01-21 09:00:00'),
(148, 47, '{\"answers\": [\"scanner\", \"projector\", \"printer\", \"monitor\"], \"description\": \"Hogy van ez angolul: \'nyomtató\'?\", \"correctAnswer\": \"printer\"}', 'choice', 0, NULL, '2026-01-21 09:00:00'),
(149, 47, '{\"answers\": [\"szabadság\", \"betegszabadság\", \"túlóra\", \"fizetett szabadnap\"], \"description\": \"Mit jelent: \'overtime\'?\", \"correctAnswer\": \"túlóra\"}', 'choice', 0, NULL, '2026-01-21 09:00:00'),
(150, 48, '{\"answers\": [\"Értesítem, hogy...\", \"Azzal kapcsolatban írok, hogy...\", \"Visszaigazolom, hogy...\", \"Csatolom a következőt:\"], \"description\": \"Mit jelent: \'I am writing to inquire about...\'?\", \"correctAnswer\": \"Azzal kapcsolatban írok, hogy...\"}', 'choice', 0, NULL, '2026-01-22 09:00:00'),
(151, 48, '{\"answers\": [\"Best regards,\", \"To whom it may concern,\", \"Dear Sir/Madam,\", \"I am writing to...\"], \"description\": \"Hogy van ez angolul: \'Üdvözlettel\' (e-mail zárás)?\", \"correctAnswer\": \"Best regards,\"}', 'choice', 0, NULL, '2026-01-22 09:00:00'),
(152, 48, '{\"answers\": [\"Kérem, keresse meg...\", \"Csatoltan megtalálja...\", \"Kérem, vegye figyelembe...\", \"Visszajelzését várom...\"], \"description\": \"Mit jelent: \'Please find attached...\'?\", \"correctAnswer\": \"Csatoltan megtalálja...\"}', 'choice', 0, NULL, '2026-01-22 09:00:00'),
(153, 49, '{\"answers\": [\"motivation letter\", \"CV / resume\", \"reference letter\", \"portfolio\"], \"description\": \"Hogy van ez angolul: \'önéletrajz\'?\", \"correctAnswer\": \"CV / resume\"}', 'choice', 0, NULL, '2026-01-24 09:10:00'),
(154, 49, '{\"answers\": [\"végzettség\", \"munkatapasztalat\", \"készségek\", \"referenciák\"], \"description\": \"Mit jelent: \'work experience\'?\", \"correctAnswer\": \"munkatapasztalat\"}', 'choice', 0, NULL, '2026-01-24 09:10:00'),
(155, 49, '{\"answers\": [\"salary expectation\", \"work hours\", \"job benefits\", \"notice period\"], \"description\": \"Hogy van ez angolul: \'fizetési elvárás\'?\", \"correctAnswer\": \"salary expectation\"}', 'choice', 0, NULL, '2026-01-24 09:10:00'),
(156, 49, '{\"answers\": [\"Referenciák mellékelve.\", \"Referenciák kérésre rendelkezésre állnak.\", \"Referenciák nem szükségesek.\", \"Referenciák hamarosan elkészülnek.\"], \"description\": \"Mit jelent: \'references available upon request\'?\", \"correctAnswer\": \"Referenciák kérésre rendelkezésre állnak.\"}', 'choice', 0, NULL, '2026-01-24 09:10:00'),
(157, 50, '{\"answers\": [\"Mik a gyengeségei?\", \"Mik az erősségei?\", \"Mit szeretne elérni?\", \"Miért hagyja el jelenlegi munkahelyét?\"], \"description\": \"Mit jelent: \'What are your strengths?\'\", \"correctAnswer\": \"Mik az erősségei?\"}', 'choice', 0, NULL, '2026-01-25 09:00:00'),
(158, 50, '{\"answers\": [\"What is your experience?\", \"When can you start?\", \"Why do you want this job?\", \"Do you have any questions?\"], \"description\": \"Hogy van ez angolul: \'Mikor tudna kezdeni?\'\", \"correctAnswer\": \"When can you start?\"}', 'choice', 0, NULL, '2026-01-25 09:00:00'),
(159, 50, '{\"answers\": [\"felmondási idő\", \"próbaidő\", \"szabadság\", \"munkaszüneti nap\"], \"description\": \"Mit jelent: \'probationary period\'?\", \"correctAnswer\": \"próbaidő\"}', 'choice', 0, NULL, '2026-01-25 09:00:00'),
(160, 50, '{\"answers\": [\"to work independently\", \"to work remotely\", \"to work as a team\", \"to work part-time\"], \"description\": \"Hogy van ez angolul: \'csapatban dolgozni\'?\", \"correctAnswer\": \"to work as a team\"}', 'choice', 0, NULL, '2026-01-25 09:00:00'),
(161, 51, '{\"answers\": [\"to go through the agenda\", \"to take minutes\", \"to chair a meeting\", \"to skip the meeting\"], \"description\": \"Hogy van ez angolul: \'napirendet megbeszéli\'?\", \"correctAnswer\": \"to go through the agenda\"}', 'choice', 0, NULL, '2026-01-28 09:10:00'),
(162, 51, '{\"answers\": [\"Kezdjük el.\", \"Folytassuk.\", \"Zárjuk le.\", \"Szünet következik.\"], \"description\": \"Mit jelent: \'Let\'s wrap up.\'?\", \"correctAnswer\": \"Zárjuk le.\"}', 'choice', 0, NULL, '2026-01-28 09:10:00'),
(163, 51, '{\"answers\": [\"to ignore feedback\", \"to give feedback\", \"to request feedback\", \"to avoid feedback\"], \"description\": \"Hogy van ez angolul: \'visszajelzést ad\'?\", \"correctAnswer\": \"to give feedback\"}', 'choice', 0, NULL, '2026-01-28 09:10:00'),
(164, 51, '{\"answers\": [\"eredmények\", \"teendők\", \"problémák\", \"célok\"], \"description\": \"Mit jelent: \'action points\'?\", \"correctAnswer\": \"teendők\"}', 'choice', 0, NULL, '2026-01-28 09:10:00'),
(165, 52, '{\"answers\": [\"szülő\", \"gyermek\", \"testvér\", \"nagyszülő\"], \"description\": \"Mit jelent: \'sibling\'?\", \"correctAnswer\": \"testvér\"}', 'choice', 0, NULL, '2026-01-22 09:30:00'),
(166, 52, '{\"answers\": [\"aunt\", \"mother-in-law\", \"grandmother\", \"godmother\"], \"description\": \"Hogy van ez angolul: \'nagymama\'?\", \"correctAnswer\": \"grandmother\"}', 'choice', 0, NULL, '2026-01-22 09:30:00'),
(167, 52, '{\"answers\": [\"kisgyerek\", \"egyszülős gyermek\", \"egyke\", \"örökbe fogadott gyermek\"], \"description\": \"Mit jelent: \'only child\'?\", \"correctAnswer\": \"egyke\"}', 'choice', 0, NULL, '2026-01-22 09:30:00'),
(168, 52, '{\"answers\": [\"triplet\", \"twin\", \"sibling\", \"cousin\"], \"description\": \"Hogy van ez angolul: \'iker\'?\", \"correctAnswer\": \"twin\"}', 'choice', 0, NULL, '2026-01-22 09:30:00'),
(169, 52, '{\"answers\": [\"keresztapa\", \"mostohaapa\", \"apósa\", \"nevelőapa\"], \"description\": \"Mit jelent: \'stepfather\'?\", \"correctAnswer\": \"mostohaapa\"}', 'choice', 0, NULL, '2026-01-22 09:30:00'),
(170, 53, '{\"answers\": [\"unokaöcs\", \"unokahúg\", \"unokatestvér\", \"nagybácsi\"], \"description\": \"Mit jelent: \'nephew\'?\", \"correctAnswer\": \"unokaöcs\"}', 'choice', 0, NULL, '2026-01-23 09:00:00'),
(171, 53, '{\"answers\": [\"nephew\", \"niece\", \"cousin\", \"sibling\"], \"description\": \"Hogy van ez angolul: \'unokatestvér\'?\", \"correctAnswer\": \"cousin\"}', 'choice', 0, NULL, '2026-01-23 09:00:00'),
(172, 53, '{\"answers\": [\"anyósa\", \"nevelőanya\", \"mostohaanya\", \"keresztanya\"], \"description\": \"Mit jelent: \'mother-in-law\'?\", \"correctAnswer\": \"anyósa\"}', 'choice', 0, NULL, '2026-01-23 09:00:00'),
(173, 53, '{\"answers\": [\"godfather\", \"uncle\", \"brother-in-law\", \"grandfather\"], \"description\": \"Hogy van ez angolul: \'nagybácsi\'?\", \"correctAnswer\": \"uncle\"}', 'choice', 0, NULL, '2026-01-23 09:00:00'),
(174, 54, '{\"answers\": [\"old friend\", \"best friend\", \"close friend\", \"childhood friend\"], \"description\": \"Hogy van ez angolul: \'legjobb barát\'?\", \"correctAnswer\": \"best friend\"}', 'choice', 0, NULL, '2026-01-26 09:10:00'),
(175, 54, '{\"answers\": [\"kapcsolatot tart\", \"elhagy valakit\", \"megismerkedik valakivel\", \"elbúcsúzik\"], \"description\": \"Mit jelent: \'to keep in touch\'?\", \"correctAnswer\": \"kapcsolatot tart\"}', 'choice', 0, NULL, '2026-01-26 09:10:00'),
(176, 54, '{\"answers\": [\"jealous\", \"selfish\", \"trustworthy\", \"arrogant\"], \"description\": \"Hogy van ez angolul: \'megbízható\'?\", \"correctAnswer\": \"trustworthy\"}', 'choice', 0, NULL, '2026-01-26 09:10:00'),
(177, 54, '{\"answers\": [\"barát\", \"ismerős\", \"szomszéd\", \"kolléga\"], \"description\": \"Mit jelent: \'acquaintance\'?\", \"correctAnswer\": \"ismerős\"}', 'choice', 0, NULL, '2026-01-26 09:10:00'),
(178, 55, '{\"answers\": [\"boldog\", \"szomorú\", \"szorongó\", \"mérges\"], \"description\": \"Mit jelent: \'anxious\'?\", \"correctAnswer\": \"szorongó\"}', 'choice', 0, NULL, '2026-01-27 09:00:00'),
(179, 55, '{\"answers\": [\"ashamed\", \"proud\", \"nervous\", \"confused\"], \"description\": \"Hogy van ez angolul: \'büszke\'?\", \"correctAnswer\": \"proud\"}', 'choice', 0, NULL, '2026-01-27 09:00:00'),
(180, 55, '{\"answers\": [\"nyugodt\", \"elégedett\", \"leterhelt\", \"izgatott\"], \"description\": \"Mit jelent: \'overwhelmed\'?\", \"correctAnswer\": \"leterhelt\"}', 'choice', 0, NULL, '2026-01-27 09:00:00'),
(181, 55, '{\"answers\": [\"bored\", \"relieved\", \"surprised\", \"frightened\"], \"description\": \"Hogy van ez angolul: \'meglepett\'?\", \"correctAnswer\": \"surprised\"}', 'choice', 0, NULL, '2026-01-27 09:00:00'),
(182, 56, '{\"answers\": [\"zárkózott\", \"társaságkedvelő\", \"csendes\", \"félénk\"], \"description\": \"Mit jelent: \'outgoing\'?\", \"correctAnswer\": \"társaságkedvelő\"}', 'choice', 0, NULL, '2026-01-28 09:00:00'),
(183, 56, '{\"answers\": [\"lazy\", \"hardworking\", \"clumsy\", \"impatient\"], \"description\": \"Hogy van ez angolul: \'szorgalmas\'?\", \"correctAnswer\": \"hardworking\"}', 'choice', 0, NULL, '2026-01-28 09:00:00'),
(184, 56, '{\"answers\": [\"szűklátókörű\", \"nyitott gondolkodású\", \"makacs\", \"beképzelt\"], \"description\": \"Mit jelent: \'broad-minded\'?\", \"correctAnswer\": \"nyitott gondolkodású\"}', 'choice', 0, NULL, '2026-01-28 09:00:00'),
(185, 57, '{\"answers\": [\"engagement\", \"anniversary\", \"wedding\", \"baptism\"], \"description\": \"Hogy van ez angolul: \'esküvő\'?\", \"correctAnswer\": \"wedding\"}', 'choice', 0, NULL, '2026-01-30 09:10:00'),
(186, 57, '{\"answers\": [\"Köszönöm!\", \"Gratulálok!\", \"Sajnálom!\", \"Sok szerencsét!\"], \"description\": \"Mit jelent: \'Congratulations!\'?\", \"correctAnswer\": \"Gratulálok!\"}', 'choice', 0, NULL, '2026-01-30 09:10:00'),
(187, 57, '{\"answers\": [\"birthday\", \"holiday\", \"anniversary\", \"graduation\"], \"description\": \"Hogy van ez angolul: \'évforduló\'?\", \"correctAnswer\": \"anniversary\"}', 'choice', 0, NULL, '2026-01-30 09:10:00'),
(188, 57, '{\"answers\": [\"előléptet\", \"nyugdíjba vonul\", \"felmondást ad be\", \"kirúgják\"], \"description\": \"Mit jelent: \'to retire\'?\", \"correctAnswer\": \"nyugdíjba vonul\"}', 'choice', 0, NULL, '2026-01-30 09:10:00'),
(189, 58, '{\"answers\": [\"egér\", \"billentyűzet\", \"monitor\", \"hangszóró\"], \"description\": \"Mit jelent: \'keyboard\'?\", \"correctAnswer\": \"billentyűzet\"}', 'choice', 0, NULL, '2026-01-25 09:30:00'),
(190, 58, '{\"answers\": [\"adapter\", \"charger\", \"cable\", \"battery\"], \"description\": \"Hogy van ez angolul: \'töltő\'?\", \"correctAnswer\": \"charger\"}', 'choice', 0, NULL, '2026-01-25 09:30:00'),
(191, 58, '{\"answers\": [\"processzor\", \"memória\", \"merevlemez\", \"grafikus kártya\"], \"description\": \"Mit jelent: \'hard drive\'?\", \"correctAnswer\": \"merevlemez\"}', 'choice', 0, NULL, '2026-01-25 09:30:00'),
(192, 58, '{\"answers\": [\"microphone\", \"speaker\", \"headphones\", \"webcam\"], \"description\": \"Hogy van ez angolul: \'fülhallgató\'?\", \"correctAnswer\": \"headphones\"}', 'choice', 0, NULL, '2026-01-25 09:30:00'),
(193, 58, '{\"answers\": [\"vezetékes\", \"vezeték nélküli\", \"bluetooth\", \"hordozható\"], \"description\": \"Mit jelent: \'wireless\'?\", \"correctAnswer\": \"vezeték nélküli\"}', 'choice', 0, NULL, '2026-01-25 09:30:00'),
(194, 59, '{\"answers\": [\"download\", \"upload\", \"update\", \"backup\"], \"description\": \"Hogy van ez angolul: \'frissítés\'?\", \"correctAnswer\": \"update\"}', 'choice', 0, NULL, '2026-01-26 09:00:00'),
(195, 59, '{\"answers\": [\"telepít\", \"töröl\", \"letölt\", \"frissít\"], \"description\": \"Mit jelent: \'to install\'?\", \"correctAnswer\": \"telepít\"}', 'choice', 0, NULL, '2026-01-26 09:00:00'),
(196, 59, '{\"answers\": [\"freeze\", \"crash\", \"lag\", \"glitch\"], \"description\": \"Hogy van ez angolul: \'összeomlás\' (rendszer)?\", \"correctAnswer\": \"crash\"}', 'choice', 0, NULL, '2026-01-26 09:00:00'),
(197, 59, '{\"answers\": [\"felhasználónév\", \"jelszó\", \"biztonsági kód\", \"PIN\"], \"description\": \"Mit jelent: \'password\'?\", \"correctAnswer\": \"jelszó\"}', 'choice', 0, NULL, '2026-01-26 09:00:00'),
(198, 60, '{\"answers\": [\"web browser\", \"search engine\", \"web server\", \"URL\"], \"description\": \"Hogy van ez angolul: \'keresőmotor\'?\", \"correctAnswer\": \"search engine\"}', 'choice', 0, NULL, '2026-01-29 09:10:00'),
(199, 60, '{\"answers\": [\"letölt\", \"könyvjelzőz\", \"megoszt\", \"elment\"], \"description\": \"Mit jelent: \'to bookmark\'?\", \"correctAnswer\": \"könyvjelzőz\"}', 'choice', 0, NULL, '2026-01-29 09:10:00'),
(200, 60, '{\"answers\": [\"connection\", \"bandwidth\", \"firewall\", \"proxy\"], \"description\": \"Hogy van ez angolul: \'sávszélesség\'?\", \"correctAnswer\": \"bandwidth\"}', 'choice', 0, NULL, '2026-01-29 09:10:00'),
(201, 61, '{\"answers\": [\"lájkol\", \"követ\", \"megoszt\", \"megjegyzést ír\"], \"description\": \"Mit jelent: \'to follow\'?\", \"correctAnswer\": \"követ\"}', 'choice', 0, NULL, '2026-01-30 09:00:00'),
(202, 61, '{\"answers\": [\"comment\", \"story\", \"post\", \"reel\"], \"description\": \"Hogy van ez angolul: \'bejegyzés\'?\", \"correctAnswer\": \"post\"}', 'choice', 0, NULL, '2026-01-30 09:00:00'),
(203, 61, '{\"answers\": [\"elterjed az interneten\", \"vírussal fertőzött\", \"törlésre kerül\", \"cenzúrázott lesz\"], \"description\": \"Mit jelent: \'to go viral\'?\", \"correctAnswer\": \"elterjed az interneten\"}', 'choice', 0, NULL, '2026-01-30 09:00:00'),
(204, 61, '{\"answers\": [\"feed\", \"timeline\", \"profile\", \"account\"], \"description\": \"Hogy van ez angolul: \'profil\'?\", \"correctAnswer\": \"profile\"}', 'choice', 0, NULL, '2026-01-30 09:00:00'),
(205, 62, '{\"answers\": [\"hackelés\", \"adathalászat\", \"vírusfertőzés\", \"jelszólopás\"], \"description\": \"Mit jelent: \'phishing\'?\", \"correctAnswer\": \"adathalászat\"}', 'choice', 0, NULL, '2026-01-31 09:00:00'),
(206, 62, '{\"answers\": [\"recovery\", \"backup\", \"restore\", \"archive\"], \"description\": \"Hogy van ez angolul: \'biztonsági mentés\'?\", \"correctAnswer\": \"backup\"}', 'choice', 0, NULL, '2026-01-31 09:00:00'),
(207, 62, '{\"answers\": [\"egyszerű jelszó\", \"kétlépéses hitelesítés\", \"biometrikus azonosítás\", \"titkosítás\"], \"description\": \"Mit jelent: \'two-factor authentication\'?\", \"correctAnswer\": \"kétlépéses hitelesítés\"}', 'choice', 0, NULL, '2026-01-31 09:00:00'),
(208, 63, '{\"answers\": [\"link\", \"attachment\", \"embed\", \"file\"], \"description\": \"Hogy van ez angolul: \'csatolmány\'?\", \"correctAnswer\": \"attachment\"}', 'choice', 0, NULL, '2026-02-03 09:10:00'),
(209, 63, '{\"answers\": [\"értesítést töröl\", \"értesítést elnémít\", \"értesítést bekapcsol\", \"értesítést továbbít\"], \"description\": \"Mit jelent: \'to mute a notification\'?\", \"correctAnswer\": \"értesítést elnémít\"}', 'choice', 0, NULL, '2026-02-03 09:10:00'),
(210, 63, '{\"answers\": [\"sent\", \"delivered\", \"seen / read\", \"pending\"], \"description\": \"Hogy van ez angolul: \'olvasott\' (üzenet)?\", \"correctAnswer\": \"seen / read\"}', 'choice', 0, NULL, '2026-02-03 09:10:00');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `friendship`
--

CREATE TABLE `friendship` (
  `id` int(11) NOT NULL,
  `user1_id` int(11) NOT NULL,
  `user2_id` int(11) NOT NULL,
  `status` enum('pending','accepted','rejected') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- A tábla adatainak kiíratása `friendship`
--

INSERT INTO `friendship` (`id`, `user1_id`, `user2_id`, `status`, `created_at`, `is_deleted`, `deleted_at`) VALUES
(2, 5, 4, 'accepted', '2026-02-14 12:06:44', 0, NULL),
(4, 423, 1, 'pending', '2026-02-14 12:11:17', 0, NULL),
(5, 427, 421, 'pending', '2026-02-18 17:42:37', 0, NULL),
(6, 421, 422, 'pending', '2026-02-18 17:42:37', 0, NULL),
(7, 18, 421, 'pending', '2026-02-19 09:09:20', 0, NULL),
(8, 429, 421, 'pending', '2026-02-19 09:19:32', 0, NULL),
(9, 421, 1, 'pending', '2026-02-19 09:19:32', 0, NULL);

--
-- Eseményindítók `friendship`
--
DELIMITER $$
CREATE TRIGGER `friend_before_update_set_deleted_at` BEFORE UPDATE ON `friendship` FOR EACH ROW BEGIN
  IF OLD.is_deleted = 0 AND NEW.is_deleted = 1 THEN
    SET NEW.deleted_at = IF(NEW.deleted_at IS NULL, NOW(), NEW.deleted_at);
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `leaderboard`
--

CREATE TABLE `leaderboard` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `points` int(11) NOT NULL DEFAULT '0',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- A tábla adatainak kiíratása `leaderboard`
--

INSERT INTO `leaderboard` (`id`, `user_id`, `course_id`, `points`, `updated_at`, `is_deleted`, `deleted_at`) VALUES
(1, 423, 3, 1000, '2026-02-14 15:32:50', 0, NULL),
(2, 8, 1, 10000, '2026-02-14 15:33:22', 0, NULL),
(3, 4, 3, 2100, '2026-02-14 15:33:22', 0, NULL),
(5, 7, 3, 21, '2026-02-14 16:05:11', 0, NULL),
(6, 423, 2, 13000, '2026-02-14 16:18:12', 0, NULL);

--
-- Eseményindítók `leaderboard`
--
DELIMITER $$
CREATE TRIGGER `leaderboard_before_update_set_deleted_at` BEFORE UPDATE ON `leaderboard` FOR EACH ROW BEGIN
  IF OLD.is_deleted = 0 AND NEW.is_deleted = 1 THEN
    SET NEW.deleted_at = IF(NEW.deleted_at IS NULL, NOW(), NEW.deleted_at);
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `lesson`
--

CREATE TABLE `lesson` (
  `id` int(11) NOT NULL,
  `unit_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `order_index` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- A tábla adatainak kiíratása `lesson`
--

INSERT INTO `lesson` (`id`, `unit_id`, `title`, `order_index`, `created_at`, `is_deleted`, `deleted_at`) VALUES
(27, 27, 'Colors and numbers - Színek és számok', 1, '2025-12-07 12:29:22', 0, NULL),
(28, 27, 'Animals - Állatok', 2, '2025-12-07 12:29:22', 0, NULL),
(29, 27, 'Objects - Tárgyak', 3, '2025-12-07 12:29:22', 0, NULL),
(30, 28, 'Greetings - Köszöntések', 1, '2025-12-10 08:00:00', 0, NULL),
(31, 28, 'Introductions - Bemutatkozás', 2, '2025-12-10 08:00:00', 0, NULL),
(32, 29, 'Food - Ételek', 1, '2025-12-15 10:10:00', 0, NULL),
(33, 29, 'Drinks - Italok', 2, '2025-12-15 10:10:00', 0, NULL),
(34, 30, 'Vehicles - Járművek', 1, '2026-01-15 09:20:00', 0, NULL),
(35, 30, 'Directions - Irányok', 2, '2026-01-15 09:20:00', 0, NULL),
(36, 30, 'At the Station - Az állomáson', 3, '2026-01-15 09:20:00', 0, NULL),
(37, 31, 'At the Airport - A repülőtéren', 1, '2026-01-20 09:00:00', 0, NULL),
(38, 31, 'Hotel - Szálloda', 2, '2026-01-20 09:00:00', 0, NULL),
(39, 32, 'Landmarks - Nevezetességek', 1, '2026-01-25 09:00:00', 0, NULL),
(40, 33, 'In the Shop - Az üzletben', 1, '2026-01-18 09:20:00', 0, NULL),
(41, 33, 'Clothes - Ruházat', 2, '2026-01-18 09:20:00', 0, NULL),
(42, 33, 'Sizes and Colours - Méretek és színek', 3, '2026-01-18 09:20:00', 0, NULL),
(43, 34, 'Currency - Pénznem', 1, '2026-01-22 09:00:00', 0, NULL),
(44, 34, 'Paying - Fizetés', 2, '2026-01-22 09:00:00', 0, NULL),
(45, 35, 'Ordering Food - Rendelés', 1, '2026-01-26 09:00:00', 0, NULL),
(46, 36, 'Job Titles - Munkakörök', 1, '2026-01-20 09:20:00', 0, NULL),
(47, 36, 'Office Vocabulary - Irodai szókincs', 2, '2026-01-20 09:20:00', 0, NULL),
(48, 36, 'Emails and Communication - E-mailek és kommunikáció', 3, '2026-01-20 09:20:00', 0, NULL),
(49, 37, 'CV and Cover Letter - Önéletrajz és motivációs levél', 1, '2026-01-24 09:00:00', 0, NULL),
(50, 37, 'Job Interview - Állásinterjú', 2, '2026-01-24 09:00:00', 0, NULL),
(51, 38, 'Meetings and Presentations - Megbeszélések és prezentációk', 1, '2026-01-28 09:00:00', 0, NULL),
(52, 39, 'Immediate Family - Szűk család', 1, '2026-01-22 09:20:00', 0, NULL),
(53, 39, 'Extended Family - Távolabbi rokonság', 2, '2026-01-22 09:20:00', 0, NULL),
(54, 40, 'Friendship - Barátság', 1, '2026-01-26 09:00:00', 0, NULL),
(55, 40, 'Emotions - Érzelmek', 2, '2026-01-26 09:00:00', 0, NULL),
(56, 40, 'Describing People - Személyleírás', 3, '2026-01-26 09:00:00', 0, NULL),
(57, 41, 'Celebrations - Ünnepek', 1, '2026-01-30 09:00:00', 0, NULL),
(58, 42, 'Hardware - Hardver', 1, '2026-01-25 09:20:00', 0, NULL),
(59, 42, 'Software - Szoftver', 2, '2026-01-25 09:20:00', 0, NULL),
(60, 43, 'Browsing - Böngészés', 1, '2026-01-29 09:00:00', 0, NULL),
(61, 43, 'Social Media - Közösségi média', 2, '2026-01-29 09:00:00', 0, NULL),
(62, 43, 'Online Safety - Online biztonság', 3, '2026-01-29 09:00:00', 0, NULL),
(63, 44, 'Messaging - Üzenetküldés', 1, '2026-02-03 09:00:00', 0, NULL);

--
-- Eseményindítók `lesson`
--
DELIMITER $$
CREATE TRIGGER `lesson_before_update_set_deleted_at` BEFORE UPDATE ON `lesson` FOR EACH ROW BEGIN
  IF OLD.is_deleted = 0 AND NEW.is_deleted = 1 THEN
    SET NEW.deleted_at = IF(NEW.deleted_at IS NULL, NOW(), NEW.deleted_at);
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `lesson_content`
--

CREATE TABLE `lesson_content` (
  `id` int(11) NOT NULL,
  `lesson_id` int(11) NOT NULL,
  `content_type` enum('text','video','audio','quiz') NOT NULL,
  `content` text,
  `order_index` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Eseményindítók `lesson_content`
--
DELIMITER $$
CREATE TRIGGER `lesson_content_before_update_set_deleted_at` BEFORE UPDATE ON `lesson_content` FOR EACH ROW BEGIN
  IF OLD.is_deleted = 0 AND NEW.is_deleted = 1 THEN
    SET NEW.deleted_at = IF(NEW.deleted_at IS NULL, NOW(), NEW.deleted_at);
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `lesson_progress`
--

CREATE TABLE `lesson_progress` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `lesson_id` int(11) NOT NULL,
  `exercise_count` int(11) NOT NULL DEFAULT '0',
  `completed_exercises` int(11) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `completed_at` timestamp NULL DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- A tábla adatainak kiíratása `lesson_progress`
--

INSERT INTO `lesson_progress` (`id`, `user_id`, `lesson_id`, `exercise_count`, `completed_exercises`, `created_at`, `updated_at`, `completed_at`, `is_deleted`, `deleted_at`) VALUES
(1, 423, 1, 0, 0, '2026-02-15 15:48:19', '2026-02-15 15:48:19', NULL, 0, NULL),
(3, 423, 2, 0, 0, '2026-02-15 15:59:08', '2026-02-15 15:59:07', NULL, 0, NULL),
(4, 2, 1, 3, 3, '2026-02-15 16:01:01', '2026-02-20 10:07:31', '2026-02-20 10:07:31', 1, '2026-02-15 16:18:36'),
(5, 421, 1, 5, 5, '2026-02-20 10:14:50', '2026-02-20 10:14:50', '2026-02-20 10:14:50', 0, NULL),
(6, 421, 2, 5, 5, '2026-02-20 10:20:56', '2026-02-20 10:20:56', '2026-02-20 10:20:56', 0, NULL),
(7, 421, 3, 5, 5, '2026-02-20 10:22:11', '2026-02-20 10:22:11', '2026-01-18 10:35:10', 0, NULL);

--
-- Eseményindítók `lesson_progress`
--
DELIMITER $$
CREATE TRIGGER `lesson_progress_before_update_set_deleted_at` BEFORE UPDATE ON `lesson_progress` FOR EACH ROW BEGIN
  IF OLD.is_deleted = 0 AND NEW.is_deleted = 1 THEN
    SET NEW.deleted_at = IF(NEW.deleted_at IS NULL, NOW(), NEW.deleted_at);
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `login`
--

CREATE TABLE `login` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `login_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `device_info` varchar(255) DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `session_token` varchar(255) DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `is_anonymized` tinyint(1) NOT NULL DEFAULT '0',
  `anonymized_at` timestamp NULL DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- A tábla adatainak kiíratása `login`
--

INSERT INTO `login` (`id`, `user_id`, `login_time`, `device_info`, `ip_address`, `session_token`, `expires_at`, `is_anonymized`, `anonymized_at`, `is_deleted`, `deleted_at`) VALUES
(1, 421, '2026-02-09 11:45:19', 'MAC: [-36, 70, 40, 50, -73, 17]; OS: Windows 11 10.0; Java: 25', NULL, NULL, NULL, 0, NULL, 0, NULL),
(2, 421, '2026-02-09 11:48:30', 'MAC: [-36, 70, 40, 50, -73, 17]; OS: Windows 11 10.0; Java: 25', NULL, NULL, NULL, 0, NULL, 0, NULL),
(3, 421, '2026-02-09 11:52:10', 'MAC: [-36, 70, 40, 50, -73, 17]; OS: Windows 11 10.0; Java: 25', NULL, NULL, NULL, 0, NULL, 0, NULL),
(4, 421, '2026-02-09 11:55:27', 'MAC: [-36, 70, 40, 50, -73, 17]; OS: Windows 11 10.0; Java: 25', NULL, NULL, NULL, 0, NULL, 0, NULL),
(5, 421, '2026-02-09 11:59:05', 'MAC: [-36, 70, 40, 50, -73, 17]; OS: Windows 11 10.0; Java: 25', NULL, NULL, NULL, 0, NULL, 0, NULL),
(6, 421, '2026-02-09 12:00:07', 'MAC: [-36, 70, 40, 50, -73, 17]; OS: Windows 11 10.0; Java: 25', NULL, NULL, NULL, 0, NULL, 0, NULL),
(7, 421, '2026-02-09 12:02:21', NULL, NULL, NULL, NULL, 1, NULL, 1, '2026-02-15 16:53:51'),
(8, 421, '2026-02-18 10:14:11', 'MAC: [-36, 70, 40, 50, -73, 17]; OS: Windows 11 10.0; Java: 25', '192.168.10.9', NULL, NULL, 0, NULL, 0, NULL),
(9, 427, '2026-02-21 16:27:49', 'MAC: [-36, 70, 40, 50, -73, 17]; OS: Windows 11 10.0; Java: 25', '192.168.0.13', NULL, NULL, 0, NULL, 0, NULL),
(10, 421, '2026-02-21 16:37:11', 'MAC: [-36, 70, 40, 50, -73, 17]; OS: Windows 11 10.0; Java: 25', '192.168.0.13', NULL, NULL, 0, NULL, 0, NULL);

--
-- Eseményindítók `login`
--
DELIMITER $$
CREATE TRIGGER `login_before_update_set_deleted_at` BEFORE UPDATE ON `login` FOR EACH ROW BEGIN
  IF OLD.is_deleted = 0 AND NEW.is_deleted = 1 THEN
    SET NEW.deleted_at = IF(NEW.deleted_at IS NULL, NOW(), NEW.deleted_at);
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `pricing`
--

CREATE TABLE `pricing` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `billing_cycle` enum('monthly','yearly') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- A tábla adatainak kiíratása `pricing`
--

INSERT INTO `pricing` (`id`, `name`, `price`, `billing_cycle`, `created_at`, `is_deleted`, `deleted_at`) VALUES
(1, 'Free', '0.00', 'monthly', '2025-11-26 09:20:25', 1, '2036-02-29 16:14:34'),
(2, 'Pro Monthly', '9.99', 'monthly', '2025-11-26 09:20:25', 0, NULL),
(3, 'Pro Yearly', '99.99', 'yearly', '2025-11-26 09:20:25', 0, NULL);

--
-- Eseményindítók `pricing`
--
DELIMITER $$
CREATE TRIGGER `pricing_before_update_set_deleted_at` BEFORE UPDATE ON `pricing` FOR EACH ROW BEGIN
  IF OLD.is_deleted = 0 AND NEW.is_deleted = 1 THEN
    SET NEW.deleted_at = IF(NEW.deleted_at IS NULL, NOW(), NEW.deleted_at);
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `review`
--

CREATE TABLE `review` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `rating` int(11) NOT NULL,
  `comment` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- A tábla adatainak kiíratása `review`
--

INSERT INTO `review` (`id`, `user_id`, `course_id`, `rating`, `comment`, `created_at`, `is_deleted`, `deleted_at`) VALUES
(1, 8, 2, 4, 'Good', '2026-02-16 15:20:20', 0, NULL),
(2, 2, 2, 3, 'asdasdasdasd', '2026-02-16 15:20:20', 0, NULL),
(3, 4, 2, 5, 'Taught me how to fly', '2026-02-16 15:20:20', 0, NULL),
(4, 423, 3, 5, 'Cool', '2026-02-16 16:40:21', 0, NULL),
(5, 18, 2, 5, 'Cool2', '2026-02-16 16:43:37', 1, '2026-02-16 16:48:07'),
(6, 10, 2, 4, 'ééééééééééé', '2026-02-16 16:43:37', 0, NULL);

--
-- Eseményindítók `review`
--
DELIMITER $$
CREATE TRIGGER `review_before_update_set_deleted_at` BEFORE UPDATE ON `review` FOR EACH ROW BEGIN
  IF OLD.is_deleted = 0 AND NEW.is_deleted = 1 THEN
    SET NEW.deleted_at = IF(NEW.deleted_at IS NULL, NOW(), NEW.deleted_at);
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `role`
--

CREATE TABLE `role` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- A tábla adatainak kiíratása `role`
--

INSERT INTO `role` (`id`, `name`, `description`, `created_at`, `is_deleted`, `deleted_at`) VALUES
(1, 'student', 'Regular learning user', '2025-11-26 09:20:25', 0, NULL),
(2, 'admin', 'Administrator with full access', '2025-11-26 09:20:25', 0, NULL),
(3, 'moderator', 'Moderates the site', '2025-11-26 09:20:25', 1, '2026-02-16 17:13:19');

--
-- Eseményindítók `role`
--
DELIMITER $$
CREATE TRIGGER `role_before_update_set_deleted_at` BEFORE UPDATE ON `role` FOR EACH ROW BEGIN
  IF OLD.is_deleted = 0 AND NEW.is_deleted = 1 THEN
    SET NEW.deleted_at = IF(NEW.deleted_at IS NULL, NOW(), NEW.deleted_at);
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `score`
--

CREATE TABLE `score` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `lesson_id` int(11) NOT NULL,
  `score` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- A tábla adatainak kiíratása `score`
--

INSERT INTO `score` (`id`, `user_id`, `lesson_id`, `score`, `created_at`, `is_deleted`, `deleted_at`) VALUES
(1, 423, 1, 100, '2026-02-16 17:14:15', 0, NULL),
(2, 4, 3, 2000, '2026-02-16 17:14:15', 1, '2026-02-16 17:34:07');

--
-- Eseményindítók `score`
--
DELIMITER $$
CREATE TRIGGER `score_before_update_set_deleted_at` BEFORE UPDATE ON `score` FOR EACH ROW BEGIN
  IF OLD.is_deleted = 0 AND NEW.is_deleted = 1 THEN
    SET NEW.deleted_at = IF(NEW.deleted_at IS NULL, NOW(), NEW.deleted_at);
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `store_item`
--

CREATE TABLE `store_item` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` varchar(100) DEFAULT NULL,
  `type` enum('hearts5','hearts10','hearts25','hints5','hints10','hints25','freeze') NOT NULL,
  `price` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- A tábla adatainak kiíratása `store_item`
--

INSERT INTO `store_item` (`id`, `name`, `description`, `type`, `price`) VALUES
(1, '5 Szív', 'Folytasd a tanulást!', 'hearts5', 1000),
(2, '10 Szív', 'Érezd biztonságban magad!', 'hearts10', 1750),
(3, '25 Szív', 'Garantált siker, végtelen lehetőség', 'hearts25', 3250),
(4, '5 Tipp', 'Segít, ha elakadnál', 'hints5', 1000),
(5, '10 Tipp', 'Nehezebb leckéknél hasznos a segítség', 'hints10', 1750),
(6, '25 Tipp', 'Ne aggódj, ennyivel biztosan átugrod azt a leckét!', 'hints25', 3250),
(7, 'Fagyasztás', 'Fagyaszd be a sikersorozatod, ha éppen nem érsz rá tanulni!', 'freeze', 1500);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `streak`
--

CREATE TABLE `streak` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `current_streak` int(11) NOT NULL DEFAULT '0',
  `longest_streak` int(11) NOT NULL DEFAULT '0',
  `is_frozen` tinyint(1) NOT NULL DEFAULT '0',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- A tábla adatainak kiíratása `streak`
--

INSERT INTO `streak` (`id`, `user_id`, `current_streak`, `longest_streak`, `is_frozen`, `updated_at`, `is_deleted`, `deleted_at`) VALUES
(2, 1, 30000, 30000, 1, '2026-02-16 18:30:07', 0, NULL),
(3, 421, 20, 21, 0, '2026-02-18 09:08:31', 0, NULL);

--
-- Eseményindítók `streak`
--
DELIMITER $$
CREATE TRIGGER `streak_before_update_set_deleted_at` BEFORE UPDATE ON `streak` FOR EACH ROW BEGIN
  IF OLD.is_deleted = 0 AND NEW.is_deleted = 1 THEN
    SET NEW.deleted_at = IF(NEW.deleted_at IS NULL, NOW(), NEW.deleted_at);
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `subscription`
--

CREATE TABLE `subscription` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `pricing_id` int(11) NOT NULL,
  `status` enum('active','canceled','expired') NOT NULL DEFAULT 'active',
  `start_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `end_date` timestamp NULL DEFAULT NULL,
  `auto_renew` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- A tábla adatainak kiíratása `subscription`
--

INSERT INTO `subscription` (`id`, `user_id`, `pricing_id`, `status`, `start_date`, `end_date`, `auto_renew`, `created_at`, `updated_at`, `is_deleted`, `deleted_at`) VALUES
(1, 423, 2, 'active', '2026-02-16 18:36:23', '2026-02-15 23:00:00', 1, '2026-02-16 18:36:23', '2026-02-16 18:36:23', 0, NULL),
(2, 2, 2, 'active', '2026-02-16 19:00:59', '2026-03-16 19:00:59', 1, '2026-02-16 19:00:59', '2026-02-16 19:00:59', 0, NULL);

--
-- Eseményindítók `subscription`
--
DELIMITER $$
CREATE TRIGGER `subscription_before_update_set_deleted_at` BEFORE UPDATE ON `subscription` FOR EACH ROW BEGIN
  IF OLD.is_deleted = 0 AND NEW.is_deleted = 1 THEN
    SET NEW.deleted_at = IF(NEW.deleted_at IS NULL, NOW(), NEW.deleted_at);
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `unit`
--

CREATE TABLE `unit` (
  `id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `order_index` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- A tábla adatainak kiíratása `unit`
--

INSERT INTO `unit` (`id`, `course_id`, `title`, `order_index`, `created_at`, `is_deleted`, `deleted_at`) VALUES
(27, 14, 'Basic words - Alapvető szavak', 1, '2025-12-07 12:26:05', 0, NULL),
(28, 14, 'Basic sentences - Alapvető mondatok', 2, '2025-12-07 12:26:05', 0, NULL),
(29, 14, 'Food and Drinks - Ételek és italok', 3, '2025-12-15 10:00:00', 0, NULL),
(30, 15, 'Transportation - Közlekedés', 1, '2026-01-15 09:10:00', 0, NULL),
(31, 15, 'Travel - Utazás', 2, '2026-01-15 09:10:00', 0, NULL),
(32, 15, 'Sightseeing - Városnézés', 3, '2026-01-15 09:10:00', 0, NULL),
(33, 16, 'Shopping - Vásárlás', 1, '2026-01-18 09:10:00', 0, NULL),
(34, 16, 'Money and Banking - Pénz és bankolás', 2, '2026-01-18 09:10:00', 0, NULL),
(35, 16, 'Restaurants - Étteremben', 3, '2026-01-18 09:10:00', 0, NULL),
(36, 17, 'The Workplace - A munkahely', 1, '2026-01-20 09:10:00', 0, NULL),
(37, 17, 'Job Applications - Álláskeresés', 2, '2026-01-20 09:10:00', 0, NULL),
(38, 17, 'Business Phrases - Üzleti kifejezések', 3, '2026-01-20 09:10:00', 0, NULL),
(39, 18, 'Family Members - Családtagok', 1, '2026-01-22 09:10:00', 0, NULL),
(40, 18, 'Relationships - Kapcsolatok', 2, '2026-01-22 09:10:00', 0, NULL),
(41, 18, 'Life Events - Életeseméyek', 3, '2026-01-22 09:10:00', 0, NULL),
(42, 19, 'Devices - Eszközök', 1, '2026-01-25 09:10:00', 0, NULL),
(43, 19, 'The Internet - Az internet', 2, '2026-01-25 09:10:00', 0, NULL),
(44, 19, 'Digital Communication - Digitális kommunikáció', 3, '2026-01-25 09:10:00', 0, NULL);

--
-- Eseményindítók `unit`
--
DELIMITER $$
CREATE TRIGGER `unit_before_update_set_deleted_at` BEFORE UPDATE ON `unit` FOR EACH ROW BEGIN
  IF OLD.is_deleted = 0 AND NEW.is_deleted = 1 THEN
    SET NEW.deleted_at = IF(NEW.deleted_at IS NULL, NOW(), NEW.deleted_at);
  END IF;
END
$$
DELIMITER ;

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

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `user_achievement`
--

CREATE TABLE `user_achievement` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `achievement_id` int(11) NOT NULL,
  `earned_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- A tábla adatainak kiíratása `user_achievement`
--

INSERT INTO `user_achievement` (`id`, `user_id`, `achievement_id`, `earned_at`, `is_deleted`, `deleted_at`) VALUES
(1, 8, 1, '2026-02-17 06:36:37', 0, NULL),
(2, 4, 1, '2026-02-17 06:36:37', 0, NULL),
(6, 421, 1, '2026-02-18 10:34:00', 0, NULL);

--
-- Eseményindítók `user_achievement`
--
DELIMITER $$
CREATE TRIGGER `user_achievement_before_update_set_deleted_at` BEFORE UPDATE ON `user_achievement` FOR EACH ROW BEGIN
  IF OLD.is_deleted = 0 AND NEW.is_deleted = 1 THEN
    SET NEW.deleted_at = IF(NEW.deleted_at IS NULL, NOW(), NEW.deleted_at);
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `user_course`
--

CREATE TABLE `user_course` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `enrolled_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `progress` double NOT NULL DEFAULT '0',
  `completed_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- A tábla adatainak kiíratása `user_course`
--

INSERT INTO `user_course` (`id`, `user_id`, `course_id`, `enrolled_at`, `progress`, `completed_at`) VALUES
(3, 424, 3, '2026-02-17 11:43:55', 0, NULL),
(4, 425, 3, '2026-02-17 12:04:54', 0, NULL),
(6, 427, 3, '2026-02-17 12:18:18', 0, NULL),
(8, 429, 3, '2026-02-17 12:31:26', 0, NULL),
(10, 421, 3, '2026-02-18 17:03:07', 0.4, NULL);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `user_item`
--

CREATE TABLE `user_item` (
  `id` int(11) NOT NULL,
  `item_id` int(10) NOT NULL,
  `user_id` int(254) NOT NULL,
  `amount` int(10) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `achievement`
--
ALTER TABLE `achievement`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `course`
--
ALTER TABLE `course`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `exercise`
--
ALTER TABLE `exercise`
  ADD PRIMARY KEY (`id`),
  ADD KEY `exercise_FK_1` (`lesson_id`);

--
-- A tábla indexei `friendship`
--
ALTER TABLE `friendship`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `idx_friend_unique` (`user1_id`,`user2_id`),
  ADD KEY `idx_friend_status` (`user1_id`,`status`),
  ADD KEY `friend_friend_id` (`user2_id`);

--
-- A tábla indexei `leaderboard`
--
ALTER TABLE `leaderboard`
  ADD PRIMARY KEY (`id`),
  ADD KEY `leaderboard_user_id` (`user_id`),
  ADD KEY `leaderboard_course_id` (`course_id`),
  ADD KEY `idx_leaderboard_points` (`course_id`,`points`);

--
-- A tábla indexei `lesson`
--
ALTER TABLE `lesson`
  ADD PRIMARY KEY (`id`),
  ADD KEY `lesson_unit_id` (`unit_id`),
  ADD KEY `idx_lesson_order` (`unit_id`,`order_index`);

--
-- A tábla indexei `lesson_content`
--
ALTER TABLE `lesson_content`
  ADD PRIMARY KEY (`id`),
  ADD KEY `lesson_content_lesson_id` (`lesson_id`),
  ADD KEY `idx_lesson_content_order` (`lesson_id`,`order_index`);

--
-- A tábla indexei `lesson_progress`
--
ALTER TABLE `lesson_progress`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `idx_lesson_progress_unique` (`user_id`,`lesson_id`),
  ADD KEY `lp_lesson_id` (`lesson_id`);

--
-- A tábla indexei `login`
--
ALTER TABLE `login`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `session_token` (`session_token`),
  ADD KEY `login_user_id` (`user_id`),
  ADD KEY `idx_login_activity` (`login_time`,`user_id`);

--
-- A tábla indexei `pricing`
--
ALTER TABLE `pricing`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `review`
--
ALTER TABLE `review`
  ADD PRIMARY KEY (`id`),
  ADD KEY `review_user_id` (`user_id`),
  ADD KEY `review_course_id` (`course_id`);

--
-- A tábla indexei `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- A tábla indexei `score`
--
ALTER TABLE `score`
  ADD PRIMARY KEY (`id`),
  ADD KEY `score_user_id` (`user_id`),
  ADD KEY `score_lesson_id` (`lesson_id`);

--
-- A tábla indexei `store_item`
--
ALTER TABLE `store_item`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `streak`
--
ALTER TABLE `streak`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `streak_user_id_unique` (`user_id`);

--
-- A tábla indexei `subscription`
--
ALTER TABLE `subscription`
  ADD PRIMARY KEY (`id`),
  ADD KEY `subscription_user_id` (`user_id`),
  ADD KEY `subscription_pricing_id` (`pricing_id`),
  ADD KEY `idx_subscription_active` (`status`,`end_date`);

--
-- A tábla indexei `unit`
--
ALTER TABLE `unit`
  ADD PRIMARY KEY (`id`),
  ADD KEY `unit_course_id` (`course_id`),
  ADD KEY `idx_unit_order` (`course_id`,`order_index`);

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
-- A tábla indexei `user_achievement`
--
ALTER TABLE `user_achievement`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `idx_user_achievement_unique` (`user_id`,`achievement_id`),
  ADD KEY `ua_achievement_id` (`achievement_id`);

--
-- A tábla indexei `user_course`
--
ALTER TABLE `user_course`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_user_course_user` (`user_id`),
  ADD KEY `fk_user_course_course` (`course_id`);

--
-- A tábla indexei `user_item`
--
ALTER TABLE `user_item`
  ADD PRIMARY KEY (`id`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `achievement`
--
ALTER TABLE `achievement`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT a táblához `course`
--
ALTER TABLE `course`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT a táblához `exercise`
--
ALTER TABLE `exercise`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=211;

--
-- AUTO_INCREMENT a táblához `friendship`
--
ALTER TABLE `friendship`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT a táblához `leaderboard`
--
ALTER TABLE `leaderboard`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT a táblához `lesson`
--
ALTER TABLE `lesson`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;

--
-- AUTO_INCREMENT a táblához `lesson_content`
--
ALTER TABLE `lesson_content`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `lesson_progress`
--
ALTER TABLE `lesson_progress`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT a táblához `login`
--
ALTER TABLE `login`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT a táblához `pricing`
--
ALTER TABLE `pricing`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT a táblához `review`
--
ALTER TABLE `review`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT a táblához `role`
--
ALTER TABLE `role`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT a táblához `score`
--
ALTER TABLE `score`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT a táblához `store_item`
--
ALTER TABLE `store_item`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT a táblához `streak`
--
ALTER TABLE `streak`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT a táblához `subscription`
--
ALTER TABLE `subscription`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT a táblához `unit`
--
ALTER TABLE `unit`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT a táblához `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=431;

--
-- AUTO_INCREMENT a táblához `user_achievement`
--
ALTER TABLE `user_achievement`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT a táblához `user_course`
--
ALTER TABLE `user_course`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT a táblához `user_item`
--
ALTER TABLE `user_item`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `exercise`
--
ALTER TABLE `exercise`
  ADD CONSTRAINT `exercise_FK_1` FOREIGN KEY (`lesson_id`) REFERENCES `lesson` (`id`);

--
-- Megkötések a táblához `friendship`
--
ALTER TABLE `friendship`
  ADD CONSTRAINT `friendship_ibfk_friend` FOREIGN KEY (`user2_id`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `friendship_ibfk_user` FOREIGN KEY (`user1_id`) REFERENCES `user` (`id`);

--
-- Megkötések a táblához `leaderboard`
--
ALTER TABLE `leaderboard`
  ADD CONSTRAINT `leaderboard_ibfk_course` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`),
  ADD CONSTRAINT `leaderboard_ibfk_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Megkötések a táblához `lesson`
--
ALTER TABLE `lesson`
  ADD CONSTRAINT `lesson_ibfk_unit` FOREIGN KEY (`unit_id`) REFERENCES `unit` (`id`);

--
-- Megkötések a táblához `lesson_content`
--
ALTER TABLE `lesson_content`
  ADD CONSTRAINT `lesson_content_ibfk_lesson` FOREIGN KEY (`lesson_id`) REFERENCES `lesson` (`id`);

--
-- Megkötések a táblához `lesson_progress`
--
ALTER TABLE `lesson_progress`
  ADD CONSTRAINT `lesson_progress_ibfk_lesson` FOREIGN KEY (`lesson_id`) REFERENCES `lesson` (`id`),
  ADD CONSTRAINT `lesson_progress_ibfk_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Megkötések a táblához `login`
--
ALTER TABLE `login`
  ADD CONSTRAINT `login_ibfk_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Megkötések a táblához `review`
--
ALTER TABLE `review`
  ADD CONSTRAINT `review_ibfk_course` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`),
  ADD CONSTRAINT `review_ibfk_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Megkötések a táblához `score`
--
ALTER TABLE `score`
  ADD CONSTRAINT `score_ibfk_lesson` FOREIGN KEY (`lesson_id`) REFERENCES `lesson` (`id`),
  ADD CONSTRAINT `score_ibfk_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Megkötések a táblához `streak`
--
ALTER TABLE `streak`
  ADD CONSTRAINT `streak_ibfk_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Megkötések a táblához `subscription`
--
ALTER TABLE `subscription`
  ADD CONSTRAINT `subscription_ibfk_pricing` FOREIGN KEY (`pricing_id`) REFERENCES `pricing` (`id`),
  ADD CONSTRAINT `subscription_ibfk_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Megkötések a táblához `unit`
--
ALTER TABLE `unit`
  ADD CONSTRAINT `unit_ibfk_course` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`);

--
-- Megkötések a táblához `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_ibfk_role` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`);

--
-- Megkötések a táblához `user_achievement`
--
ALTER TABLE `user_achievement`
  ADD CONSTRAINT `user_achievement_ibfk_achievement` FOREIGN KEY (`achievement_id`) REFERENCES `achievement` (`id`),
  ADD CONSTRAINT `user_achievement_ibfk_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Megkötések a táblához `user_course`
--
ALTER TABLE `user_course`
  ADD CONSTRAINT `fk_user_course_course` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_user_course_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

DELIMITER $$
--
-- Események
--
CREATE DEFINER=`root`@`localhost` EVENT `anonymize_old_users_event` ON SCHEDULE EVERY 1 DAY STARTS '2025-11-19 11:27:56' ON COMPLETION NOT PRESERVE ENABLE DO BEGIN
  CALL anonymize_due_users();
END$$

DELIMITER ;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
