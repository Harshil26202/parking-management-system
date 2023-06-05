-- MySQL dump 10.13  Distrib 8.0.33, for Linux (x86_64)
--
-- Host: localhost    Database: VMS
-- ------------------------------------------------------
-- Server version	8.0.33-0ubuntu0.22.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `chat`
--

DROP TABLE IF EXISTS `chat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat` (
  `chat_id` int NOT NULL AUTO_INCREMENT,
  `send_by` int DEFAULT NULL,
  `recieved_by` int DEFAULT NULL,
  `sent_time` datetime DEFAULT NULL,
  `is_visible` tinyint(1) DEFAULT NULL,
  `chat_type` varchar(20) DEFAULT NULL,
  `message` varchar(5000) DEFAULT NULL,
  PRIMARY KEY (`chat_id`),
  KEY `send_by` (`send_by`),
  KEY `recieved_by` (`recieved_by`),
  CONSTRAINT `chat_ibfk_1` FOREIGN KEY (`send_by`) REFERENCES `owner_data` (`owner_id`),
  CONSTRAINT `chat_ibfk_2` FOREIGN KEY (`recieved_by`) REFERENCES `owner_data` (`owner_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat`
--

LOCK TABLES `chat` WRITE;
/*!40000 ALTER TABLE `chat` DISABLE KEYS */;
/*!40000 ALTER TABLE `chat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chat_group`
--

DROP TABLE IF EXISTS `chat_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat_group` (
  `group_id` int NOT NULL AUTO_INCREMENT,
  `created_by` int DEFAULT NULL,
  `group_name` varchar(20) DEFAULT NULL,
  `number_of_members` int DEFAULT '1',
  `is_visible` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`group_id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `chat_group_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `owner_data` (`owner_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_group`
--

LOCK TABLES `chat_group` WRITE;
/*!40000 ALTER TABLE `chat_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `chat_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `group_member_log`
--

DROP TABLE IF EXISTS `group_member_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `group_member_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `owner_id` int DEFAULT NULL,
  `joined_at` datetime DEFAULT NULL,
  `leaved_at` datetime DEFAULT NULL,
  `group_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `owner_id` (`owner_id`),
  KEY `group_id` (`group_id`),
  CONSTRAINT `group_member_log_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `owner_data` (`owner_id`),
  CONSTRAINT `group_member_log_ibfk_2` FOREIGN KEY (`group_id`) REFERENCES `chat_group` (`group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `group_member_log`
--

LOCK TABLES `group_member_log` WRITE;
/*!40000 ALTER TABLE `group_member_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `group_member_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `guest_parking_request`
--

DROP TABLE IF EXISTS `guest_parking_request`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `guest_parking_request` (
  `id` int NOT NULL AUTO_INCREMENT,
  `owner_id` int DEFAULT NULL,
  `from_time` datetime DEFAULT NULL,
  `to_time` datetime DEFAULT NULL,
  `requested_slot` int DEFAULT NULL,
  `status` varchar(20) DEFAULT 'pending',
  PRIMARY KEY (`id`),
  KEY `owner_id` (`owner_id`),
  KEY `requested_slot` (`requested_slot`),
  CONSTRAINT `guest_parking_request_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `owner_data` (`owner_id`),
  CONSTRAINT `guest_parking_request_ibfk_2` FOREIGN KEY (`requested_slot`) REFERENCES `slot_allotation` (`slot_id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `guest_parking_request`
--

LOCK TABLES `guest_parking_request` WRITE;
/*!40000 ALTER TABLE `guest_parking_request` DISABLE KEYS */;
INSERT INTO `guest_parking_request` VALUES (25,86,'2023-05-15 14:54:00','2023-05-15 14:55:00',18,'completed'),(26,86,'2023-05-15 15:13:00','2023-05-15 15:14:00',18,'completed'),(27,74,'2023-05-18 17:09:00','2023-05-20 17:09:00',18,'completed'),(28,86,'2023-05-24 14:42:00','2023-05-25 14:42:00',18,'completed'),(29,86,'2023-05-24 14:43:00','2023-05-26 14:43:00',NULL,'rejected');
/*!40000 ALTER TABLE `guest_parking_request` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `owner_id` int DEFAULT NULL,
  `notification_text` varchar(50) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'unseen',
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `owner_id` (`owner_id`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `owner_data` (`owner_id`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,74,'Your vehicle is Parked Wrongly','seen','2023-05-22 14:16:07'),(2,74,'Wrong Parking Resolved','seen','2023-05-22 14:18:26'),(3,74,'Penalties Paid','seen','2023-05-22 14:22:11'),(4,74,'Your vehicle is Parked Wrongly','seen','2023-05-22 16:32:42'),(5,74,'Wrong Parking Resolved','seen','2023-05-22 16:32:51'),(6,74,'Your vehicle is Parked Wrongly','seen','2023-05-24 10:17:29'),(7,74,'Wrong Parking Resolved','seen','2023-05-24 10:17:42'),(8,74,'Penalty Paid Successfully','seen','2023-05-24 10:17:58'),(9,74,'Penalty Paid Successfully','seen','2023-05-24 10:17:58'),(10,74,'Penalty Paid Successfully','seen','2023-05-24 10:18:18'),(11,74,'Penalty Paid Successfully','seen','2023-05-24 10:18:19'),(12,74,'Penalty Paid Successfully','seen','2023-05-24 10:18:19'),(13,74,'Penalty Paid Successfully','seen','2023-05-24 10:18:19'),(14,74,'Penalty Paid Successfully','seen','2023-05-24 10:20:39'),(15,86,'Penalty Paid Successfully','seen','2023-05-24 10:20:39'),(16,74,'Penalty Paid Successfully','seen','2023-05-24 10:20:39'),(17,74,'Penalty Paid Successfully','seen','2023-05-24 10:20:40'),(18,74,'Penalty Paid Successfully','seen','2023-05-24 10:20:40'),(19,74,'Penalty Paid Successfully','seen','2023-05-24 10:24:19'),(20,74,'Penalty Paid Successfully','seen','2023-05-24 10:25:12'),(21,86,'Penalty Paid Successfully','seen','2023-05-24 10:25:13'),(22,74,'Penalty Paid Successfully','seen','2023-05-24 10:25:13'),(23,74,'Penalty Paid Successfully','seen','2023-05-24 10:25:13'),(24,74,'Penalty Paid Successfully','seen','2023-05-24 10:25:14'),(25,74,'Your vehicle is Parked Wrongly','seen','2023-05-24 10:27:09'),(26,74,'Wrong Parking Resolved','seen','2023-05-24 10:27:27'),(27,74,'Penalty Paid Successfully','seen','2023-05-24 10:52:57'),(28,74,'Your vehicle is Parked Wrongly','seen','2023-05-24 10:54:05'),(29,74,'Penalty Paid Successfully','seen','2023-05-24 14:38:33'),(30,74,'Your vehicle is Parked Wrongly','seen','2023-05-24 14:38:49'),(31,86,'Wrong Parking Resolved','seen','2023-05-24 14:39:10'),(32,74,'Penalty Paid Successfully','seen','2023-05-24 14:39:41'),(33,86,'Guest Parking Request Accepted','seen','2023-05-24 14:43:06'),(34,86,'Guest Parking Request Rejected','seen','2023-05-24 14:43:33'),(35,87,'Welcome to Park@Ease','seen','2023-05-24 14:48:01'),(36,74,'New Vehicle Request Accepted','seen','2023-05-24 14:55:30'),(37,74,'Vehicle Request Rejected','seen','2023-05-24 14:55:32'),(38,74,'New Vehicle Request Accepted','seen','2023-05-24 14:55:36'),(39,74,'Vehicle Request Rejected','seen','2023-05-24 14:55:37'),(40,87,'New Vehicle Request Accepted','seen','2023-05-24 18:53:38'),(41,87,'New Vehicle Request Accepted','seen','2023-05-24 18:55:57'),(42,87,'New Vehicle Request Accepted','seen','2023-05-24 18:56:00'),(43,74,'New Vehicle Request Accepted','seen','2023-05-25 09:46:33'),(44,74,'New Vehicle Request Accepted','seen','2023-05-25 09:59:26'),(45,74,'Vehicle Request Rejected','seen','2023-05-25 10:02:55'),(46,74,'Vehicle Request Rejected','seen','2023-05-25 10:04:44'),(47,74,'New Vehicle Request Accepted','seen','2023-05-25 10:10:19');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `owner_data`
--

DROP TABLE IF EXISTS `owner_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `owner_data` (
  `owner_id` int NOT NULL AUTO_INCREMENT,
  `block_no` int DEFAULT NULL,
  `number_of_vehicle` int DEFAULT '0',
  `owner_name` varchar(13) DEFAULT NULL,
  `contact_no` varchar(20) DEFAULT NULL,
  `email_id` varchar(50) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `isAdmin` tinyint(1) DEFAULT '0',
  `penalties_count` int DEFAULT '0',
  `total_penalty_amount` int DEFAULT '0',
  `due_penalty` int DEFAULT '0',
  `token` varchar(500) DEFAULT NULL,
  `status` varchar(15) DEFAULT 'pending',
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`owner_id`)
) ENGINE=InnoDB AUTO_INCREMENT=88 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `owner_data`
--

LOCK TABLES `owner_data` WRITE;
/*!40000 ALTER TABLE `owner_data` DISABLE KEYS */;
INSERT INTO `owner_data` VALUES (1,1,0,'hk','1234567890','johndoe@example.com','$2a$08$C8YmbZpBMhWeOyBzAZIfo.qDzCgdKtMPuHuTtopWFd9H.iaDbx.I.',0,0,0,0,NULL,'approved','2023-02-28 22:01:21'),(2,1,0,'hk','1234567890','johndoe@example.com','$2a$08$C8YmbZpBMhWeOyBzAZIfo.qDzCgdKtMPuHuTtopWFd9H.iaDbx.I.',1,0,0,0,NULL,'approved','2023-03-16 09:29:12'),(3,1,0,'hk','1234567890','johndoe@example.com','$2a$08$C8YmbZpBMhWeOyBzAZIfo.qDzCgdKtMPuHuTtopWFd9H.iaDbx.I.',0,0,0,0,NULL,'approved','2023-03-15 10:45:31'),(4,1,0,'hk','1234567890','johndoe@example.com','$2a$08$C8YmbZpBMhWeOyBzAZIfo.qDzCgdKtMPuHuTtopWFd9H.iaDbx.I.',0,0,0,0,NULL,'approved','2023-02-07 00:22:50'),(5,1,0,'hk','1234567890','johndoe@example.com','$2a$08$C8YmbZpBMhWeOyBzAZIfo.qDzCgdKtMPuHuTtopWFd9H.iaDbx.I.',0,0,0,0,NULL,'approved','2023-01-29 06:43:44'),(6,1,0,'hk','1234567890','johndoe@example.com','$2a$08$C8YmbZpBMhWeOyBzAZIfo.qDzCgdKtMPuHuTtopWFd9H.iaDbx.I.',0,0,0,0,NULL,'approved','2023-03-19 08:51:18'),(7,1,0,'hk','1234567890','johndoe@example.com','$2a$08$C8YmbZpBMhWeOyBzAZIfo.qDzCgdKtMPuHuTtopWFd9H.iaDbx.I.',0,0,0,0,NULL,'approved','2023-04-23 19:50:48'),(8,1,0,'hk','1234567890','johndoe@example.com','$2a$08$C8YmbZpBMhWeOyBzAZIfo.qDzCgdKtMPuHuTtopWFd9H.iaDbx.I.',0,0,0,0,NULL,'approved','2023-03-04 01:00:47'),(9,1,0,'hk','1234567890','johndoe@example.com','$2a$08$C8YmbZpBMhWeOyBzAZIfo.qDzCgdKtMPuHuTtopWFd9H.iaDbx.I.',0,0,0,0,NULL,'approved','2023-04-14 07:11:03'),(10,1,0,'hk','1234567890','johndoe@example.com','$2a$08$C8YmbZpBMhWeOyBzAZIfo.qDzCgdKtMPuHuTtopWFd9H.iaDbx.I.',0,0,0,0,NULL,'approved','2023-03-11 13:44:04'),(44,11,0,'hk1','1234567890','hk@example.com','$2a$08$C8YmbZpBMhWeOyBzAZIfo.qDzCgdKtMPuHuTtopWFd9H.iaDbx.I.',0,0,0,0,NULL,'approved','2023-01-16 01:44:33'),(45,101,0,'hk','12345','hk@gail.com','$2a$08$C8YmbZpBMhWeOyBzAZIfo.qDzCgdKtMPuHuTtopWFd9H.iaDbx.I.',0,0,0,0,NULL,'approved','2023-03-06 05:36:21'),(46,43434,0,'fddgf',NULL,'fg@fgh.cm','$2a$08$C8YmbZpBMhWeOyBzAZIfo.qDzCgdKtMPuHuTtopWFd9H.iaDbx.I.',0,0,0,0,NULL,'approved','2023-04-18 01:36:51'),(47,123,0,'harshil',NULL,'password@gmail.com','$2a$08$C8YmbZpBMhWeOyBzAZIfo.qDzCgdKtMPuHuTtopWFd9H.iaDbx.I.',0,0,0,0,'eyJhbGciOiJIUzI1NiJ9.cGFzc3dvcmRAZ21haWwuY29t.D0S8fxbwPE72Ou_vtLZi1WvdYdA_X5kb59dJdxXTxWM','approved','2023-02-19 17:54:17'),(48,12,0,'admin','0459450043','admin@gmail.com','$2a$08$C8YmbZpBMhWeOyBzAZIfo.qDzCgdKtMPuHuTtopWFd9H.iaDbx.I.',1,0,0,0,'eyJhbGciOiJIUzI1NiJ9.YWRtaW5AZ21haWwuY29t.DI6ZGYGsGJtTfjOXmoB2q6EPMUaLzCsUiAFnBb_kWSE','approved','2023-03-24 15:56:46'),(49,434,0,'ffghgh',NULL,'gghghg@mf.fog','$2a$08$C8YmbZpBMhWeOyBzAZIfo.qDzCgdKtMPuHuTtopWFd9H.iaDbx.I.',0,0,0,0,NULL,'approved','2023-01-29 11:40:54'),(50,2323,0,'rere',NULL,'ff@gf.gg','$2a$08$C8YmbZpBMhWeOyBzAZIfo.qDzCgdKtMPuHuTtopWFd9H.iaDbx.I.',0,0,0,0,NULL,'approved','2023-03-25 11:04:54'),(51,212,0,'fdfdff',NULL,'adminlol@gmail.com','$2a$08$C8YmbZpBMhWeOyBzAZIfo.qDzCgdKtMPuHuTtopWFd9H.iaDbx.I.',0,0,0,0,NULL,'approved','2023-02-26 03:15:50'),(52,1212,0,'fdf',NULL,'admin101@gmail.com','$2a$08$C8YmbZpBMhWeOyBzAZIfo.qDzCgdKtMPuHuTtopWFd9H.iaDbx.I.',0,0,0,0,NULL,'approved','2023-02-28 23:19:35'),(53,323232,0,'wwerere',NULL,'ad21213min@gmail.com','$2a$08$C8YmbZpBMhWeOyBzAZIfo.qDzCgdKtMPuHuTtopWFd9H.iaDbx.I.',0,0,0,0,NULL,'approved','2023-04-07 02:48:47'),(54,323,0,'eertrt',NULL,'1323admin@gmail.com','$2a$08$C8YmbZpBMhWeOyBzAZIfo.qDzCgdKtMPuHuTtopWFd9H.iaDbx.I.',0,0,0,0,NULL,'approved','2023-03-06 09:26:58'),(55,1323,0,'fghghgh',NULL,'gf@hj.gkf','$2a$08$C8YmbZpBMhWeOyBzAZIfo.qDzCgdKtMPuHuTtopWFd9H.iaDbx.I.',0,0,0,0,NULL,'approved','2023-03-02 12:20:10'),(56,2343,0,'fgfg',NULL,'fdfdf@dg.com','$2a$08$C8YmbZpBMhWeOyBzAZIfo.qDzCgdKtMPuHuTtopWFd9H.iaDbx.I.',0,0,0,0,NULL,'approved','2023-04-24 05:55:55'),(57,3434,0,'regffh',NULL,'gff@fd0fdfd.fdf','$2a$08$C8YmbZpBMhWeOyBzAZIfo.qDzCgdKtMPuHuTtopWFd9H.iaDbx.I.',0,0,0,0,NULL,'approved','2023-04-16 23:24:04'),(58,2332,0,'ghjhjg',NULL,'bbn@fmd.kfd','$2a$08$C8YmbZpBMhWeOyBzAZIfo.qDzCgdKtMPuHuTtopWFd9H.iaDbx.I.',0,0,0,0,NULL,'approved','2023-01-17 05:36:18'),(59,434,0,'gfgfg',NULL,'gfgm@gfg.fdfd','$2a$08$C8YmbZpBMhWeOyBzAZIfo.qDzCgdKtMPuHuTtopWFd9H.iaDbx.I.',0,0,0,0,'eyJhbGciOiJIUzI1NiJ9.Z2ZnbUBnZmcuZmRmZA.QnnOO829yKSt5dttn1jxbuY9Qo_XOMD_7NkwI1D0Gt4','approved','2023-03-22 07:24:09'),(60,111,0,'hk',NULL,'111@111.com','$2a$08$C8YmbZpBMhWeOyBzAZIfo.qDzCgdKtMPuHuTtopWFd9H.iaDbx.I.',0,0,0,0,'eyJhbGciOiJIUzI1NiJ9.MTExQDExMS5jb20.mzDljZ_hley5GbqHnvK-LUPJM4eSzjXPW6JrlWz2IMA','approved','2023-03-12 04:42:01'),(61,222,0,'hk',NULL,'222@222.com','$2a$08$C8YmbZpBMhWeOyBzAZIfo.qDzCgdKtMPuHuTtopWFd9H.iaDbx.I.',0,0,0,0,'eyJhbGciOiJIUzI1NiJ9.MjIyQDIyMi5jb20.Z885JbIO3l06lFzR5UxrOJdS_2Z5rxu6l3SPeEpHhic','approved','2023-04-29 13:03:39'),(62,3333,0,'333',NULL,'333@333.com','$2a$08$C8YmbZpBMhWeOyBzAZIfo.qDzCgdKtMPuHuTtopWFd9H.iaDbx.I.',0,0,0,0,'eyJhbGciOiJIUzI1NiJ9.MzMzQDMzMy5jb20.jRQOrseb3yhS4bCwdhKl6S5a-3t1lQ7lFu3xYF0lx6Y','approved','2023-01-11 13:43:56'),(63,4444,0,'444',NULL,'444@444.com','$2a$08$C8YmbZpBMhWeOyBzAZIfo.qDzCgdKtMPuHuTtopWFd9H.iaDbx.I.',0,0,0,0,'eyJhbGciOiJIUzI1NiJ9.NDQ0QDQ0NC5jb20.MbxvFHLYYYYQA1-qwx8ZkKdFDe6ZjPYg331rdVA9H74','approved','2023-03-02 11:17:02'),(64,555,0,'5',NULL,'555@555.com','$2a$08$C8YmbZpBMhWeOyBzAZIfo.qDzCgdKtMPuHuTtopWFd9H.iaDbx.I.',0,0,0,0,'eyJhbGciOiJIUzI1NiJ9.NTU1QDU1NS5jb20.EdxxrdJwziJTFw5IVc_FmdyK9g75oPaaRL2pAdePC-A','approved','2023-02-13 00:01:00'),(65,66,0,'6666',NULL,'666@666.com','$2a$08$C8YmbZpBMhWeOyBzAZIfo.qDzCgdKtMPuHuTtopWFd9H.iaDbx.I.',0,0,0,0,'eyJhbGciOiJIUzI1NiJ9.NjY2QDY2Ni5jb20.sRBTkryuAW0SrE_NNXfsBQTeZ7v5ryBJlydy0Frf5pI','approved','2023-04-27 09:22:41'),(66,7777,0,'777',NULL,'777@777.com','$2a$08$C8YmbZpBMhWeOyBzAZIfo.qDzCgdKtMPuHuTtopWFd9H.iaDbx.I.',0,0,0,0,'eyJhbGciOiJIUzI1NiJ9.Nzc3QDc3Ny5jb20.vTcCL-USi6yv327oDs2z2cRTUgP-0dRAdaDiDMGcoKA','approved','2023-02-15 11:58:26'),(67,8888,0,'888',NULL,'888@888.com','$2a$08$C8YmbZpBMhWeOyBzAZIfo.qDzCgdKtMPuHuTtopWFd9H.iaDbx.I.',0,0,0,0,'eyJhbGciOiJIUzI1NiJ9.ODg4QDg4OC5jb20.rkKukhChwz175krv1Th6_zR07ZQZ5kFc3H2xGIjHhCw','approved','2023-02-03 14:40:38'),(68,1,0,'000',NULL,'000@000.com','$2a$08$C8YmbZpBMhWeOyBzAZIfo.qDzCgdKtMPuHuTtopWFd9H.iaDbx.I.',0,0,0,0,'eyJhbGciOiJIUzI1NiJ9.MDAwQDAwMC5jb20.uKoF7_6J-iWebpwgh1eQAv_ln5SvtcECo19AJkV0w3U','approved','2023-01-30 05:17:46'),(69,999,0,'999',NULL,'999@99.com','$2a$08$C8YmbZpBMhWeOyBzAZIfo.qDzCgdKtMPuHuTtopWFd9H.iaDbx.I.',0,0,0,0,'eyJhbGciOiJIUzI1NiJ9.OTk5QDk5LmNvbQ.LVc0-4qKZHINm4SBVMvHhz52F-I7qEPUixRwMZQtI88','approved','2023-01-25 20:51:47'),(70,12,0,'213',NULL,'23@23.com','$2a$08$C8YmbZpBMhWeOyBzAZIfo.qDzCgdKtMPuHuTtopWFd9H.iaDbx.I.',0,0,0,0,'eyJhbGciOiJIUzI1NiJ9.MjNAMjMuY29t.oCaYKeXcZy9SJvJ-2wdLi7TohuPWifgv5R9gvHkHWIE','approved','2023-02-11 17:37:54'),(71,23,0,'23',NULL,'121@23.com','$2a$08$C8YmbZpBMhWeOyBzAZIfo.qDzCgdKtMPuHuTtopWFd9H.iaDbx.I.',0,0,0,0,'eyJhbGciOiJIUzI1NiJ9.MTIxQDIzLmNvbQ.0tlj_GQbIJ0uyMCPNOlNMT2FaDPy2l8HHJEWuU8p-_0','approved','2023-03-24 17:21:33'),(72,12121,0,'21',NULL,'1212@gmaic.om','$2a$08$C8YmbZpBMhWeOyBzAZIfo.qDzCgdKtMPuHuTtopWFd9H.iaDbx.I.',0,0,0,0,'eyJhbGciOiJIUzI1NiJ9.MTIxMkBnbWFpYy5vbQ.j-MeRppI4nBbgawSi564N5E5302T-bihbSMyb19DNSQ','approved','2023-03-02 00:51:18'),(73,32,0,'qwqwq',NULL,'jdf@dfkdmf.dfom','$2a$08$C8YmbZpBMhWeOyBzAZIfo.qDzCgdKtMPuHuTtopWFd9H.iaDbx.I.',0,0,0,0,'eyJhbGciOiJIUzI1NiJ9.amRmQGRma2RtZi5kZm9t.Ik6vSZO4dXqZtYmHl_K0e8_4QVPdbJw2eWfauudmTSQ','approved','2023-04-27 08:10:53'),(74,112,0,'ironman','2322131111','ironman@gmail.com','$2a$08$C8YmbZpBMhWeOyBzAZIfo.qDzCgdKtMPuHuTtopWFd9H.iaDbx.I.',0,0,0,0,'eyJhbGciOiJIUzI1NiJ9.aXJvbm1hbkBnbWFpbC5jb20.fIs8y7zQtAmf_SzA5Dv_fC4OW-4_b_f5YHEKV5MTr2o','approved','2023-04-30 22:52:33'),(75,2323,0,'fgfg',NULL,'ironman@gmail.cm','$2a$08$C8YmbZpBMhWeOyBzAZIfo.qDzCgdKtMPuHuTtopWFd9H.iaDbx.I.',0,0,0,0,'eyJhbGciOiJIUzI1NiJ9.aXJvbm1hbkBnbWFpbC5jbQ.iPKQkunbAmu4hlyy4jade7c73Ubas-2e-8MkdABjrRA','approved','2023-01-04 01:55:27'),(76,4343,0,'ewewe',NULL,'gfgfg@fdfkf.com','$2a$08$C8YmbZpBMhWeOyBzAZIfo.qDzCgdKtMPuHuTtopWFd9H.iaDbx.I.',0,0,0,0,'eyJhbGciOiJIUzI1NiJ9.Z2ZnZmdAZmRma2YuY29t.p7-vwwht4k96-QVzSTA1jSMXWLuTqug7MifPC4QIUJg','pending','2023-03-13 08:30:29'),(77,323,0,'dsdsd',NULL,'fffgfg@ffmdf.ffmdf','$2a$08$C8YmbZpBMhWeOyBzAZIfo.qDzCgdKtMPuHuTtopWFd9H.iaDbx.I.',0,0,0,0,'eyJhbGciOiJIUzI1NiJ9.ZmZmZ2ZnQGZmbWRmLmZmbWRm.Uij9OLUp09waj8PdGXaD0Ow70nbH7h6iES6wY8ZhiA8','pending','2023-04-09 11:35:29'),(78,32323,0,'fdfdf',NULL,'ironman@mail.com','$2a$08$C8YmbZpBMhWeOyBzAZIfo.qDzCgdKtMPuHuTtopWFd9H.iaDbx.I.',0,0,0,0,'eyJhbGciOiJIUzI1NiJ9.aXJvbm1hbkBtYWlsLmNvbQ.g0bRMQY_vg_OVXlgUmJfRIUveOfZ_rNkO7EUQ47RL3w','approved','2023-03-07 20:35:25'),(79,2232323,0,'we43434',NULL,'gfg@dg.fkd','$2a$08$C8YmbZpBMhWeOyBzAZIfo.qDzCgdKtMPuHuTtopWFd9H.iaDbx.I.',0,0,0,0,'eyJhbGciOiJIUzI1NiJ9.Z2ZnQGRnLmZrZA.AnKqgJNwK2IaEepQ1miramLMEGLjEaefEEKHKRCeQOA','approved','2023-02-13 01:01:58'),(80,2323,0,'rerere',NULL,'vffgfg@fd.fdfdf','$2a$08$C8YmbZpBMhWeOyBzAZIfo.qDzCgdKtMPuHuTtopWFd9H.iaDbx.I.',0,0,0,0,'eyJhbGciOiJIUzI1NiJ9.dmZmZ2ZnQGZkLmZkZmRm.Zdbvtp505Vu6-KSUzUPrzIx1LcbctMY-ILwBawtan2k','approved','2023-04-30 09:05:19'),(81,3434,0,'545',NULL,'dfdf@fd.fgmf','$2a$08$C8YmbZpBMhWeOyBzAZIfo.qDzCgdKtMPuHuTtopWFd9H.iaDbx.I.',0,0,0,0,'eyJhbGciOiJIUzI1NiJ9.ZGZkZkBmZC5mZ21m.-DFmQvX_1exjrBzUyXXXvjFsupIjhbcl_k1L_ORGLoU','approved','2023-02-23 16:10:48'),(82,212,0,'spiderman','1221323233','spider@gmail.com','$2a$08$C8YmbZpBMhWeOyBzAZIfo.qDzCgdKtMPuHuTtopWFd9H.iaDbx.I.',0,0,0,0,'eyJhbGciOiJIUzI1NiJ9.c3BpZGVyQGdtYWlsLmNvbQ.4Q9eWKS77cUWWcM8QZZdtvc6AiKFzwhzWTxMnKYPOKY','approved','2023-03-04 02:08:25'),(83,1111,0,'hk','1111111111','hkharshil26202@gmail.com','$2a$08$C8YmbZpBMhWeOyBzAZIfo.qDzCgdKtMPuHuTtopWFd9H.iaDbx.I.',0,0,0,0,'eyJhbGciOiJIUzI1NiJ9.aGtoYXJzaGlsMjYyMDJAZ21haWwuY29t.vc3ndwfdz_hya9wsgmrGkGRBIfPzSdsVCzgmqSn6D7Q','approved','2023-03-08 01:34:41'),(84,2121,0,'spiderman','1323232323','spiderman@gmail.com','$2a$08$C8YmbZpBMhWeOyBzAZIfo.qDzCgdKtMPuHuTtopWFd9H.iaDbx.I.',0,0,0,0,'eyJhbGciOiJIUzI1NiJ9.c3BpZGVybWFuQGdtYWlsLmNvbQ.sDRgcMOkLnPD2vSzUDrx6uQoA2ZiSErcDjR51c3mM2o','approved','2023-04-22 04:52:47'),(85,2121,0,'thor','2324343433','thor@gmail.com','$2a$08$C8YmbZpBMhWeOyBzAZIfo.qDzCgdKtMPuHuTtopWFd9H.iaDbx.I.',0,0,0,0,'eyJhbGciOiJIUzI1NiJ9.dGhvckBnbWFpbC5jb20.PvwDio9TbkSiezbmY1Y8HiIkRpeQ_yt1mEOBsNHVKps','approved','2023-02-14 02:08:26'),(86,2121,0,'hulk1','2332434343','hulk@gmail.com','$2a$08$EWI197SjBRSzQ2X11Tm1fe.ngh5OwRP7lrA3LMfHBGZpRoNQK/Q.y',0,0,0,0,'eyJhbGciOiJIUzI1NiJ9.aHVsa0BnbWFpbC5jb20.bF1_77N7rl05ziuXK64kEEp-2rwThObsp7K69uUimAs','approved','2023-04-15 01:59:42'),(87,2121,-1,'groot','1112121211','groot@gmail.com','$2a$08$91n1scnZPGewqxd9wcJ68OFRVFEX6QX/WXbsr9WdkmgkXPPzY9bAC',0,0,0,0,'eyJhbGciOiJIUzI1NiJ9.Z3Jvb3RAZ21haWwuY29t.of3csD1vssVSyPONtPAfNQtol2gIZrmUobe7TcbUe3Y','approved',NULL);
/*!40000 ALTER TABLE `owner_data` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `slot_allotation`
--

DROP TABLE IF EXISTS `slot_allotation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `slot_allotation` (
  `slot_id` int NOT NULL AUTO_INCREMENT,
  `vehicle_id` int DEFAULT NULL,
  `isAllotted` tinyint(1) DEFAULT NULL,
  `isGuestSlot` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`slot_id`),
  KEY `vehicle_id` (`vehicle_id`),
  CONSTRAINT `slot_allotation_ibfk_1` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicle_data` (`vehicle_id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `slot_allotation`
--

LOCK TABLES `slot_allotation` WRITE;
/*!40000 ALTER TABLE `slot_allotation` DISABLE KEYS */;
INSERT INTO `slot_allotation` VALUES (1,63,1,0),(2,57,1,0),(3,64,1,0),(4,59,1,0),(5,65,1,0),(6,67,1,0),(7,NULL,0,0),(8,71,1,0),(9,68,1,0),(10,NULL,0,0),(11,NULL,0,0),(12,NULL,0,0),(13,NULL,0,0),(14,NULL,0,0),(15,NULL,0,0),(16,NULL,0,0),(17,NULL,0,0),(18,NULL,0,1),(19,NULL,0,1),(20,NULL,0,1),(21,NULL,0,1),(22,NULL,0,1),(23,NULL,0,1),(24,NULL,0,1),(25,NULL,0,1),(26,NULL,0,1),(27,NULL,0,1),(28,NULL,0,1),(29,NULL,0,1),(30,NULL,0,1),(31,NULL,0,1);
/*!40000 ALTER TABLE `slot_allotation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vehicle_data`
--

DROP TABLE IF EXISTS `vehicle_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vehicle_data` (
  `vehicle_id` int NOT NULL AUTO_INCREMENT,
  `vehicle_type` varchar(20) DEFAULT NULL,
  `vehicle_owner_id` int DEFAULT NULL,
  `vehicle_number` varchar(10) DEFAULT NULL,
  `isFavourite` tinyint(1) DEFAULT '0',
  `status` varchar(10) DEFAULT 'pending',
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`vehicle_id`),
  KEY `vehicle_owner_id` (`vehicle_owner_id`),
  CONSTRAINT `vehicle_data_ibfk_1` FOREIGN KEY (`vehicle_owner_id`) REFERENCES `owner_data` (`owner_id`)
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehicle_data`
--

LOCK TABLES `vehicle_data` WRITE;
/*!40000 ALTER TABLE `vehicle_data` DISABLE KEYS */;
INSERT INTO `vehicle_data` VALUES (2,'bike',74,'MH01XY5678',0,'approved','2023-04-18 03:59:32'),(3,'car',74,'MH02CD1234',1,'approved','2023-03-02 02:19:17'),(4,'scooter',74,'MH03EF5678',1,'approved','2023-02-17 06:39:33'),(5,'car',74,'MH03GH9101',0,'approved','2023-04-11 07:32:44'),(6,'scooter',74,'MH03IJ1213',0,'approved','2023-01-13 13:36:24'),(7,'bike',74,'MH04KL1415',1,'approved','2023-01-26 11:59:29'),(8,'scooter',74,'MH05MN1617',0,'approved','2023-03-01 15:06:37'),(9,'car',74,'MH05OP1819',1,'approved','2023-04-05 06:55:48'),(10,'car',74,'MH01AB1234',0,'approved','2023-02-28 16:50:05'),(12,'bike',74,'MH02EF9012',0,'approved','2023-04-11 23:50:16'),(13,'scooter',74,'MH03GH3456',0,'approved','2023-04-17 02:54:11'),(15,'car',74,'MH04KL1234',0,'approved','2023-02-23 19:54:07'),(16,'car',74,'MH04MN5678',1,'approved','2023-04-06 01:53:12'),(17,'scooter',74,'MH05OP9012',1,'approved','2023-02-08 00:28:18'),(57,'bike',74,'23232',NULL,'approved','2023-04-03 22:27:30'),(58,'car',74,'212121',NULL,'rejected','2023-01-12 06:20:48'),(59,'bike',74,'1121212',1,'approved','2023-01-27 01:44:34'),(60,'bike',74,'121212',0,'rejected','2023-03-15 09:37:56'),(61,'car',85,'fdfdfdf',1,'approved','2023-04-07 14:23:09'),(62,'scooter',86,'GJ1HK1',0,'approved','2023-03-17 20:37:34'),(63,'car',87,'GJ10AB1234',0,'approved',NULL),(64,'car',87,'wewewew',0,'approved',NULL),(65,'car',87,'wwwewe',0,'approved',NULL),(67,'car',74,'wwewew',0,'approved',NULL),(68,'car',74,'wewe',0,'approved',NULL),(69,'car',74,'ewe',0,'rejected',NULL),(70,'car',74,'wewe',0,'rejected',NULL),(71,'car',74,'22323',0,'approved',NULL);
/*!40000 ALTER TABLE `vehicle_data` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wrong_parking`
--

DROP TABLE IF EXISTS `wrong_parking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wrong_parking` (
  `id` int NOT NULL AUTO_INCREMENT,
  `vehicle_id` int DEFAULT NULL,
  `owner_id` int DEFAULT NULL,
  `event_time` datetime DEFAULT NULL,
  `resolved_time` datetime DEFAULT NULL,
  `penalty_amount` int DEFAULT NULL,
  `status` varchar(20) DEFAULT 'pending',
  `complain_owner_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `vehicle_id` (`vehicle_id`),
  KEY `owner_id` (`owner_id`),
  KEY `complain_owner_id` (`complain_owner_id`),
  CONSTRAINT `wrong_parking_ibfk_1` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicle_data` (`vehicle_id`),
  CONSTRAINT `wrong_parking_ibfk_2` FOREIGN KEY (`owner_id`) REFERENCES `owner_data` (`owner_id`),
  CONSTRAINT `wrong_parking_ibfk_3` FOREIGN KEY (`complain_owner_id`) REFERENCES `owner_data` (`owner_id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wrong_parking`
--

LOCK TABLES `wrong_parking` WRITE;
/*!40000 ALTER TABLE `wrong_parking` DISABLE KEYS */;
INSERT INTO `wrong_parking` VALUES (1,4,3,'2023-04-11 15:23:00',NULL,0,'approved',NULL),(3,7,4,'2023-04-12 10:30:00',NULL,0,'approved',NULL),(4,10,6,'2023-04-13 08:00:00',NULL,0,'penalty rejected',NULL),(5,13,8,'2023-04-12 13:00:00',NULL,0,'approved',NULL),(6,3,2,'2023-04-11 16:30:00',NULL,0,'completed',NULL),(23,15,9,'2023-05-01 15:22:00',NULL,NULL,'completed',NULL),(30,4,3,'2023-05-04 11:38:21',NULL,NULL,'approved',74),(31,15,74,'2023-05-09 14:23:22',NULL,NULL,NULL,74),(32,15,74,'2023-05-09 14:27:43',NULL,NULL,'completed',74),(34,62,86,'2023-05-12 09:51:56',NULL,NULL,'completed',86),(35,17,74,'2023-05-22 14:15:59',NULL,NULL,'completed',86),(36,17,74,'2023-05-22 16:32:34',NULL,NULL,'completed',86),(37,15,74,'2023-05-23 16:30:30',NULL,NULL,'completed',86),(38,13,74,'2023-05-24 10:26:52',NULL,NULL,'completed',86),(39,12,74,'2023-05-24 10:53:39',NULL,NULL,'completed',86),(40,10,74,'2023-05-24 14:38:44',NULL,NULL,'completed',86);
/*!40000 ALTER TABLE `wrong_parking` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-06-05 14:11:34
