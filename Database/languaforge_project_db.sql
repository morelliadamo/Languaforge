-- phpMyAdmin SQL Dump
-- version 5.1.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 26, 2025 at 10:33 AM
-- Server version: 5.7.24
-- PHP Version: 8.1.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `project_user_db_singular`
--

DELIMITER $$
--
-- Procedures
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

CREATE DEFINER=`root`@`localhost` PROCEDURE `create_lesson_content` (IN `p_lesson_id` INT, IN `p_content_type` ENUM('text','video','audio','quiz'), IN `p_content` TEXT, IN `p_order_index` INT)   BEGIN
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

CREATE DEFINER=`root`@`localhost` PROCEDURE `create_pricing_plan` (IN `p_name` VARCHAR(255), IN `p_price` DECIMAL(10,2), IN `p_billing_cycle` ENUM('monthly','yearly'))   BEGIN
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

CREATE DEFINER=`root`@`localhost` PROCEDURE `create_subscription` (IN `p_user_id` INT, IN `p_pricing_id` INT, IN `p_status` ENUM('active','canceled','expired'), IN `p_start_date` TIMESTAMP, IN `p_end_date` TIMESTAMP, IN `p_auto_renew` TINYINT)   BEGIN
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

CREATE DEFINER=`root`@`localhost` PROCEDURE `update_lesson_content` (IN `p_id` INT, IN `p_content_type` ENUM('text','video','audio','quiz'), IN `p_content` TEXT, IN `p_order_index` INT)   BEGIN
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

CREATE DEFINER=`root`@`localhost` PROCEDURE `update_subscription` (IN `p_id` INT, IN `p_status` ENUM('active','canceled','expired'), IN `p_end_date` TIMESTAMP, IN `p_auto_renew` TINYINT)   BEGIN
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
-- Table structure for table `achievement`
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
-- Dumping data for table `achievement`
--

INSERT INTO `achievement` (`id`, `name`, `description`, `icon_url`, `created_at`, `is_deleted`, `deleted_at`) VALUES
(1, 'First Steps', 'Completed your first lesson', 'https://example.com/icons/first_steps.png', '2025-11-19 11:27:56', 0, NULL),
(2, 'Streak Starter', 'Maintained a 3-day learning streak', 'https://example.com/icons/streak.png', '2025-11-19 11:27:56', 0, NULL);

--
-- Triggers `achievement`
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
-- Table structure for table `course`
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
-- Dumping data for table `course`
--

INSERT INTO `course` (`id`, `title`, `description`, `created_at`, `is_deleted`, `deleted_at`) VALUES
(1, 'Spanish for Beginners', 'Learn basic Spanish vocabulary and grammar', '2025-11-19 11:27:56', 0, NULL),
(2, 'French Essentials', 'Master essential French phrases and expressions', '2025-11-19 11:27:56', 0, NULL);

--
-- Triggers `course`
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
-- Table structure for table `friend`
--

CREATE TABLE `friend` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `friend_id` int(11) NOT NULL,
  `status` enum('pending','accepted','blocked') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Triggers `friend`
--
DELIMITER $$
CREATE TRIGGER `friend_before_update_set_deleted_at` BEFORE UPDATE ON `friend` FOR EACH ROW BEGIN
  IF OLD.is_deleted = 0 AND NEW.is_deleted = 1 THEN
    SET NEW.deleted_at = IF(NEW.deleted_at IS NULL, NOW(), NEW.deleted_at);
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `leaderboard`
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
-- Triggers `leaderboard`
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
-- Table structure for table `lesson`
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
-- Triggers `lesson`
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
-- Table structure for table `lesson_content`
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
-- Triggers `lesson_content`
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
-- Table structure for table `lesson_progress`
--

CREATE TABLE `lesson_progress` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `lesson_id` int(11) NOT NULL,
  `progress` int(11) NOT NULL DEFAULT '0',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Triggers `lesson_progress`
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
-- Table structure for table `login`
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
-- Triggers `login`
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
-- Table structure for table `pricing`
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
-- Dumping data for table `pricing`
--

INSERT INTO `pricing` (`id`, `name`, `price`, `billing_cycle`, `created_at`, `is_deleted`, `deleted_at`) VALUES
(1, 'Free', '0.00', 'monthly', '2025-11-26 09:20:25', 0, NULL),
(2, 'Pro Monthly', '9.99', 'monthly', '2025-11-26 09:20:25', 0, NULL),
(3, 'Pro Yearly', '99.99', 'yearly', '2025-11-26 09:20:25', 0, NULL);

--
-- Triggers `pricing`
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
-- Table structure for table `review`
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
-- Triggers `review`
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
-- Table structure for table `role`
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
-- Dumping data for table `role`
--

INSERT INTO `role` (`id`, `name`, `description`, `created_at`, `is_deleted`, `deleted_at`) VALUES
(1, 'student', 'Regular learning user', '2025-11-26 09:20:25', 0, NULL),
(2, 'admin', 'Administrator with full access', '2025-11-26 09:20:25', 0, NULL),
(3, 'moderator', 'Content moderator', '2025-11-26 09:20:25', 0, NULL);

--
-- Triggers `role`
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
-- Table structure for table `score`
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
-- Triggers `score`
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
-- Table structure for table `streak`
--

CREATE TABLE `streak` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `current_streak` int(11) NOT NULL DEFAULT '0',
  `longest_streak` int(11) NOT NULL DEFAULT '0',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Triggers `streak`
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
-- Table structure for table `subscription`
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
-- Triggers `subscription`
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
-- Table structure for table `unit`
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
-- Triggers `unit`
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
-- Table structure for table `user`
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
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `username`, `email`, `password_hash`, `role_id`, `created_at`, `last_login`, `is_anonymized`, `anonymized_at`, `is_deleted`, `deleted_at`) VALUES
(1, 'alex_jones', 'alex.jones@example.com', 'hash_pw1', 1, '2025-08-11 07:44:32', '2025-08-25 07:44:32', 0, NULL, 0, NULL),
(2, 'maria_lee', 'maria.lee@example.com', 'hash_pw2', 1, '2025-08-12 07:44:32', '2025-08-24 07:44:32', 0, NULL, 0, NULL);

--
-- Triggers `user`
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
-- Table structure for table `user_achievement`
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
-- Triggers `user_achievement`
--
DELIMITER $$
CREATE TRIGGER `user_achievement_before_update_set_deleted_at` BEFORE UPDATE ON `user_achievement` FOR EACH ROW BEGIN
  IF OLD.is_deleted = 0 AND NEW.is_deleted = 1 THEN
    SET NEW.deleted_at = IF(NEW.deleted_at IS NULL, NOW(), NEW.deleted_at);
  END IF;
END
$$
DELIMITER ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `achievement`
--
ALTER TABLE `achievement`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `course`
--
ALTER TABLE `course`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `friend`
--
ALTER TABLE `friend`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `idx_friend_unique` (`user_id`,`friend_id`),
  ADD KEY `idx_friend_status` (`user_id`,`status`),
  ADD KEY `friend_friend_id` (`friend_id`);

--
-- Indexes for table `leaderboard`
--
ALTER TABLE `leaderboard`
  ADD PRIMARY KEY (`id`),
  ADD KEY `leaderboard_user_id` (`user_id`),
  ADD KEY `leaderboard_course_id` (`course_id`),
  ADD KEY `idx_leaderboard_points` (`course_id`,`points`);

--
-- Indexes for table `lesson`
--
ALTER TABLE `lesson`
  ADD PRIMARY KEY (`id`),
  ADD KEY `lesson_unit_id` (`unit_id`),
  ADD KEY `idx_lesson_order` (`unit_id`,`order_index`);

--
-- Indexes for table `lesson_content`
--
ALTER TABLE `lesson_content`
  ADD PRIMARY KEY (`id`),
  ADD KEY `lesson_content_lesson_id` (`lesson_id`),
  ADD KEY `idx_lesson_content_order` (`lesson_id`,`order_index`);

--
-- Indexes for table `lesson_progress`
--
ALTER TABLE `lesson_progress`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `idx_lesson_progress_unique` (`user_id`,`lesson_id`),
  ADD KEY `lp_lesson_id` (`lesson_id`);

--
-- Indexes for table `login`
--
ALTER TABLE `login`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `session_token` (`session_token`),
  ADD KEY `login_user_id` (`user_id`),
  ADD KEY `idx_login_activity` (`login_time`,`user_id`);

--
-- Indexes for table `pricing`
--
ALTER TABLE `pricing`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `review`
--
ALTER TABLE `review`
  ADD PRIMARY KEY (`id`),
  ADD KEY `review_user_id` (`user_id`),
  ADD KEY `review_course_id` (`course_id`);

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `score`
--
ALTER TABLE `score`
  ADD PRIMARY KEY (`id`),
  ADD KEY `score_user_id` (`user_id`),
  ADD KEY `score_lesson_id` (`lesson_id`);

--
-- Indexes for table `streak`
--
ALTER TABLE `streak`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `streak_user_id_unique` (`user_id`);

--
-- Indexes for table `subscription`
--
ALTER TABLE `subscription`
  ADD PRIMARY KEY (`id`),
  ADD KEY `subscription_user_id` (`user_id`),
  ADD KEY `subscription_pricing_id` (`pricing_id`),
  ADD KEY `idx_subscription_active` (`status`,`end_date`);

--
-- Indexes for table `unit`
--
ALTER TABLE `unit`
  ADD PRIMARY KEY (`id`),
  ADD KEY `unit_course_id` (`course_id`),
  ADD KEY `idx_unit_order` (`course_id`,`order_index`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_username_unique` (`username`),
  ADD UNIQUE KEY `user_email_unique` (`email`),
  ADD KEY `user_role_id` (`role_id`),
  ADD KEY `idx_user_deletion` (`is_deleted`,`deleted_at`);

--
-- Indexes for table `user_achievement`
--
ALTER TABLE `user_achievement`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `idx_user_achievement_unique` (`user_id`,`achievement_id`),
  ADD KEY `ua_achievement_id` (`achievement_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `achievement`
--
ALTER TABLE `achievement`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `course`
--
ALTER TABLE `course`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `friend`
--
ALTER TABLE `friend`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `leaderboard`
--
ALTER TABLE `leaderboard`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `lesson`
--
ALTER TABLE `lesson`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `lesson_content`
--
ALTER TABLE `lesson_content`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `lesson_progress`
--
ALTER TABLE `lesson_progress`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `login`
--
ALTER TABLE `login`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pricing`
--
ALTER TABLE `pricing`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `review`
--
ALTER TABLE `review`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `role`
--
ALTER TABLE `role`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `score`
--
ALTER TABLE `score`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `streak`
--
ALTER TABLE `streak`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `subscription`
--
ALTER TABLE `subscription`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `unit`
--
ALTER TABLE `unit`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `user_achievement`
--
ALTER TABLE `user_achievement`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `friend`
--
ALTER TABLE `friend`
  ADD CONSTRAINT `friend_ibfk_friend` FOREIGN KEY (`friend_id`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `friend_ibfk_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Constraints for table `leaderboard`
--
ALTER TABLE `leaderboard`
  ADD CONSTRAINT `leaderboard_ibfk_course` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`),
  ADD CONSTRAINT `leaderboard_ibfk_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Constraints for table `lesson`
--
ALTER TABLE `lesson`
  ADD CONSTRAINT `lesson_ibfk_unit` FOREIGN KEY (`unit_id`) REFERENCES `unit` (`id`);

--
-- Constraints for table `lesson_content`
--
ALTER TABLE `lesson_content`
  ADD CONSTRAINT `lesson_content_ibfk_lesson` FOREIGN KEY (`lesson_id`) REFERENCES `lesson` (`id`);

--
-- Constraints for table `lesson_progress`
--
ALTER TABLE `lesson_progress`
  ADD CONSTRAINT `lesson_progress_ibfk_lesson` FOREIGN KEY (`lesson_id`) REFERENCES `lesson` (`id`),
  ADD CONSTRAINT `lesson_progress_ibfk_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Constraints for table `login`
--
ALTER TABLE `login`
  ADD CONSTRAINT `login_ibfk_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Constraints for table `review`
--
ALTER TABLE `review`
  ADD CONSTRAINT `review_ibfk_course` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`),
  ADD CONSTRAINT `review_ibfk_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Constraints for table `score`
--
ALTER TABLE `score`
  ADD CONSTRAINT `score_ibfk_lesson` FOREIGN KEY (`lesson_id`) REFERENCES `lesson` (`id`),
  ADD CONSTRAINT `score_ibfk_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Constraints for table `streak`
--
ALTER TABLE `streak`
  ADD CONSTRAINT `streak_ibfk_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Constraints for table `subscription`
--
ALTER TABLE `subscription`
  ADD CONSTRAINT `subscription_ibfk_pricing` FOREIGN KEY (`pricing_id`) REFERENCES `pricing` (`id`),
  ADD CONSTRAINT `subscription_ibfk_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Constraints for table `unit`
--
ALTER TABLE `unit`
  ADD CONSTRAINT `unit_ibfk_course` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`);

--
-- Constraints for table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_ibfk_role` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`);

--
-- Constraints for table `user_achievement`
--
ALTER TABLE `user_achievement`
  ADD CONSTRAINT `user_achievement_ibfk_achievement` FOREIGN KEY (`achievement_id`) REFERENCES `achievement` (`id`),
  ADD CONSTRAINT `user_achievement_ibfk_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

DELIMITER $$
--
-- Events
--
CREATE DEFINER=`root`@`localhost` EVENT `anonymize_old_users_event` ON SCHEDULE EVERY 1 DAY STARTS '2025-11-19 11:27:56' ON COMPLETION NOT PRESERVE ENABLE DO BEGIN
  CALL anonymize_due_users();
END$$

DELIMITER ;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
