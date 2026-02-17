-- phpMyAdmin SQL Dump
-- version 5.1.2
-- https://www.phpmyadmin.net/
--
-- Gép: localhost:3306
-- Létrehozás ideje: 2026. Feb 17. 11:03
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
(1, 'Spanish for Beginners', 'Learn basic Spanish vocabulary and grammar', '2025-11-19 11:27:56', 0, '2025-12-05 19:57:31'),
(2, 'French Essentials', 'Master essential French phrases and expressions', '2025-11-19 11:27:56', 0, NULL),
(3, 'Magyar-Angol alapok', 'Tanuld meg az angol nyelv alapjait!', '2025-12-05 19:09:46', 0, NULL);

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
(1, 1, '{\"answers\": [\"piros\", \"kék\", \"zöld\", \"sárga\"], \"description\": \"Mit jelent ez a szó: red?\", \"correctAnswer\": \"piros\"}', 'choice', 0, NULL, '2025-12-07 12:42:43'),
(2, 1, '{\"answers\": [\"red\", \"green\", \"yellow\", \"blue\"], \"description\": \"Hogy van ez angolul: kék?\", \"correctAnswer\": \"blue\"}', 'choice', 0, NULL, '2025-12-07 12:42:43'),
(3, 1, '{\"answers\": [\"macska\", \"kutya\", \"egér\", \"fácán\"], \"description\": \"Mi a CAT magyar megfelelője?\", \"correctAnswer\": \"macska\"}', 'choice', 0, NULL, '2026-02-14 11:29:41');

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
(4, 423, 1, 'pending', '2026-02-14 12:11:17', 0, NULL);

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
(1, 1, 'Colors and numbers - Színek és számok', 1, '2025-12-07 12:29:22', 0, NULL),
(2, 1, 'Animals - Állatok', 2, '2025-12-07 12:29:22', 0, NULL),
(3, 1, 'Objects - Tárgyak', 3, '2025-12-07 12:29:22', 0, NULL);

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
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- A tábla adatainak kiíratása `lesson_progress`
--

INSERT INTO `lesson_progress` (`id`, `user_id`, `lesson_id`, `exercise_count`, `completed_exercises`, `created_at`, `updated_at`, `is_deleted`, `deleted_at`) VALUES
(1, 423, 1, 0, 0, '2026-02-15 15:48:19', '2026-02-15 15:48:19', 0, NULL),
(3, 423, 2, 0, 0, '2026-02-15 15:59:08', '2026-02-15 15:59:07', 0, NULL),
(4, 2, 1, 3, 2, '2026-02-15 16:01:01', '2026-02-15 16:14:50', 1, '2026-02-15 16:18:36');

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
(7, 421, '2026-02-09 12:02:21', NULL, NULL, NULL, NULL, 1, NULL, 1, '2026-02-15 16:53:51');

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
(2, 1, 30000, 30000, 1, '2026-02-16 18:30:07', 0, NULL);

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
(1, 3, 'Basic words - Alapvető szavak', 1, '2025-12-07 12:26:05', 0, NULL),
(2, 3, 'Basic sentences - Alapvető mondatok', 2, '2025-12-07 12:26:05', 0, NULL);

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

INSERT INTO `user` (`id`, `username`, `email`, `password_hash`, `role_id`, `created_at`, `last_login`, `is_anonymized`, `anonymized_at`, `is_deleted`, `deleted_at`, `activation_token`, `is_active`) VALUES
(1, 'maria_lee23', 'alex.jones@example.com', '$argon2id$v=19$m=5,t=2,p=2$rv63Vx8$C25hQlNAwSEuX02IA871IuuzK84C/R9i/8+4/9kgsmYyVA2FL4qpvFCnAxryzEr4WImolIAzuOVfcs+uk7/YIg', 1, '2025-08-11 07:44:32', NULL, 0, NULL, 0, NULL, NULL, 0),
(2, 'maria_lee', 'maria.lee@example.com', 'hash_pw2', 1, '2025-08-12 07:44:32', '2025-08-24 07:44:32', 0, NULL, 0, NULL, NULL, 0),
(4, 'Lakatos ALi2', 'lakatosALi2@gmail.hu', '$argon2id$v=19$m=5,t=2,p=2$LGYd2xo$Egi82HopA4DW9w9U0ubJwlO6ZunZAUgsKhVJ1XqP04n8eKHjgsY5d6VnxT4rXc273s+2tWaKPjOuCkhz4PKm3Q', 1, '2025-12-05 19:00:40', NULL, 0, NULL, 0, NULL, NULL, 0),
(5, 'JohnDoe', 'jdoe@example.com', '$argon2id$v=19$m=5,t=2,p=2$WKgqGbo$MpM9ndTyM1TrI0F2rXb0C5Fnq8UfBhG/B5kMwfrn4aJ2jWUUbpqnd/QlpUa8ffHolCXqMoejw9TI0SlIdw9dzQ', 1, '2025-12-08 10:13:02', NULL, 0, NULL, 0, NULL, NULL, 0),
(7, 'JohnDo3e', 'jdoe3@example.com', '$argon2id$v=19$m=5,t=2,p=2$reP0rKA$QS+hnhfn6skySU3pmS8U6uThzAdE3Yps6gMnBJh/ydo9ENcKEM/AVP3HGhfay45NPzCUzRsW9wXtIww2nVuo5g', 1, '2025-12-08 10:13:46', NULL, 0, NULL, 0, NULL, NULL, 0),
(8, 'JaneDeer', 'janedeer@example.com', '$argon2id$v=19$m=5,t=2,p=2$No7mPJI$0sUqn3wOyVstKeiR1y4ceY/aDSlZL89arvNQh+Si/ND6lDxog/8hZra6+hLGEJC4aynygMTuGeFVotCJ4lZmvQ', 1, '2025-12-08 10:16:32', NULL, 0, NULL, 0, NULL, NULL, 0),
(9, 'Lakatospeter24', 'lakatospeter@gmail.com', '$argon2id$v=19$m=5,t=2,p=2$YsPENLY$OfpQsEA5wS/TTLvUwpuk+WOeNB57kR9lsja7yaJemkyq8eJM61uApHjsX2Y8xXfG4Y+1b/p8i7LE2vVQe7CHsQ', 1, '2025-12-08 11:05:46', NULL, 0, NULL, 0, NULL, NULL, 0),
(10, 'lakatospeter25', 'lakatospeter25@gmail.com', '$argon2id$v=19$m=5,t=2,p=2$06oLROY$Bo6UeYQ8ImBDuZtwXIskDYOqGPHrJZRpWi5ZCHLo09Dis+vIDjwAk3MkrnNKRSai+h77Rh96C4b9EoxbPg9/rg', 1, '2025-12-08 11:06:25', NULL, 0, NULL, 0, NULL, NULL, 0),
(11, 'JohnnyDoe', 'johnnydoe@gmail.com', '$argon2id$v=19$m=5,t=2,p=2$6S9uWkA$DkPAedDoXpAwucAbYq8h4QdDIcgQTqqBmjdvchY3rs4TJz4Wu6JHN9dA+Ly3ysmEQti9O61it7Y0OIDojQ12Nw', 1, '2025-12-08 11:19:17', NULL, 0, NULL, 0, NULL, NULL, 0),
(18, 'morelliadamTheBoss', '1morelliadam@gmail.com', '$argon2id$v=19$m=5,t=2,p=2$COvacjM$7sAr1N0c1ITIyYvUG3oL3VF4o/0IXt5i03NcYNWfiHYgrktoKKz/qdI5i9PqisNidlba0wJSEkjwLIHPos1tOg', 2, '2025-12-08 16:56:32', NULL, 0, NULL, 0, NULL, NULL, 1),
(421, 'test123', 'vastmagenta@comfythings.com', '$argon2id$v=19$m=5,t=2,p=2$YfOkFTY$zfz3CpMOeM5G0CicUd4D5ZPvPigwNYNuJ8+5JxD5Rlpjs9adnzYJ5v0H96+4HyVlz8XBW32Cyen1eTo8Z8hgVw', 1, '2025-12-12 17:37:43', '2026-02-09 12:02:21', 0, NULL, 0, NULL, NULL, 1),
(422, 'test45678', 'dorek46596@alexida.com', '$argon2id$v=19$m=5,t=2,p=2$vk/nDa4$9Bm8TpB+d7IPADvb63Y4eZWZQXyG/tN8JfC+FAg0N0PTDRokYtcnVh+cDHPCmkiao0D4DAnQy+xriNczEwakQg', 1, '2025-12-12 22:11:45', '2025-12-15 16:29:28', 0, NULL, 0, NULL, NULL, 1),
(423, 'KovacsLajos69', 'asdasd@gmail.com', '243242354asd', 1, '2026-02-09 09:24:23', NULL, 0, NULL, 0, '2026-02-17 06:30:03', NULL, 1);

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
(4, 421, 1, '2026-02-16 18:38:17', 1, '2026-02-17 08:48:02');

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
(2, 421, 2, '2025-12-15 09:57:43', 0, NULL);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT a táblához `exercise`
--
ALTER TABLE `exercise`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT a táblához `friendship`
--
ALTER TABLE `friendship`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT a táblához `leaderboard`
--
ALTER TABLE `leaderboard`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT a táblához `lesson`
--
ALTER TABLE `lesson`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT a táblához `lesson_content`
--
ALTER TABLE `lesson_content`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `lesson_progress`
--
ALTER TABLE `lesson_progress`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT a táblához `login`
--
ALTER TABLE `login`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

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
-- AUTO_INCREMENT a táblához `streak`
--
ALTER TABLE `streak`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT a táblához `subscription`
--
ALTER TABLE `subscription`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT a táblához `unit`
--
ALTER TABLE `unit`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT a táblához `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=424;

--
-- AUTO_INCREMENT a táblához `user_achievement`
--
ALTER TABLE `user_achievement`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT a táblához `user_course`
--
ALTER TABLE `user_course`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

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
