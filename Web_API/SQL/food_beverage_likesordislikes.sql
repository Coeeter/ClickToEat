-- MySQL dump 10.13  Distrib 8.0.26, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: food_beverage
-- ------------------------------------------------------
-- Server version	8.0.26

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `likesordislikes`
--

DROP TABLE IF EXISTS `likesordislikes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `likesordislikes` (
  `_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(25) NOT NULL,
  `commentId` int NOT NULL,
  `isLiked` tinyint(1) NOT NULL,
  `isDisliked` tinyint(1) NOT NULL,
  PRIMARY KEY (`_id`),
  KEY `commentId_idx` (`commentId`),
  KEY `username_idx` (`username`),
  CONSTRAINT `likesordislikes_ibfk_1` FOREIGN KEY (`username`) REFERENCES `user` (`username`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `likesordislikes_ibfk_2` FOREIGN KEY (`commentId`) REFERENCES `comment` (`_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=777 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `likesordislikes`
--

LOCK TABLES `likesordislikes` WRITE;
/*!40000 ALTER TABLE `likesordislikes` DISABLE KEYS */;
INSERT INTO `likesordislikes` VALUES (224,'Thomas',74,1,0),(225,'Thomas',63,1,0),(534,'Thomas',18,1,0),(548,'Coeeter',19,1,0),(558,'Thomas',20,1,0),(566,'JaneIsCool',98,1,0),(577,'Thomas',99,1,0),(581,'Harunosuke',20,1,0),(582,'Harunosuke',98,1,0),(583,'Harunosuke',74,0,1),(590,'JaneIsCool',17,1,0),(600,'JaneIsCool',74,0,1),(686,'Coeeter',18,1,0),(745,'Coeeter',17,1,0),(755,'Coeeter',98,0,1),(760,'Coeeter',100,1,0),(772,'Coeeter',101,0,1),(774,'Coeeter',20,1,0);
/*!40000 ALTER TABLE `likesordislikes` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-02-01 20:24:57
