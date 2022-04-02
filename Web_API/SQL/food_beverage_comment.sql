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
-- Table structure for table `comment`
--

DROP TABLE IF EXISTS `comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comment` (
  `_id` int NOT NULL AUTO_INCREMENT,
  `restaurantId` int NOT NULL,
  `restaurant` varchar(255) NOT NULL,
  `username` varchar(25) NOT NULL,
  `review` text NOT NULL,
  `datePosted` datetime NOT NULL,
  `rating` int NOT NULL,
  PRIMARY KEY (`_id`),
  KEY `movieId_idx` (`restaurantId`),
  KEY `username_idx` (`username`),
  CONSTRAINT `restaurantId` FOREIGN KEY (`restaurantId`) REFERENCES `restaurant` (`_id`) ON DELETE CASCADE,
  CONSTRAINT `username` FOREIGN KEY (`username`) REFERENCES `user` (`username`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=136 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comment`
--

LOCK TABLES `comment` WRITE;
/*!40000 ALTER TABLE `comment` DISABLE KEYS */;
INSERT INTO `comment` VALUES (17,15,'Burger King','Thomas','Good Food!','2022-01-07 17:59:35',4),(18,21,'Encik Tan','JaneIsCool','Good Food here and a lot of variety','2022-01-07 18:00:28',5),(19,19,'Nando\'s','JaneIsCool','Amazing Chicken and it is very fresh','2022-01-07 18:02:08',4),(20,18,'McDonald\'s','JaneIsCool','Average','2022-01-07 18:02:31',3),(63,23,'CRAVE','Coeeter','Amazing traditional nasi lemak','2022-01-08 18:58:16',5),(74,18,'McDonald\'s','Coeeter','Great Restaurant!','2022-01-10 13:57:54',5),(76,13,'Bangkok Jam','Coeeter','Amazing food!','2022-01-10 23:00:30',5),(98,18,'McDonald\'s','Thomas','Great Food','2022-01-18 14:07:42',5),(99,11,'4 Fingers Crispy Chicken','Coeeter','Great fried chicken Very crispy','2022-01-18 21:02:11',5),(100,11,'4 Fingers Crispy Chicken','Thomas','Never had anything like this before','2022-01-18 21:03:07',4),(101,11,'4 Fingers Crispy Chicken','JaneIsCool','The chicken is average. Furthermore the sides are not up to my standards','2022-01-18 21:03:54',2);
/*!40000 ALTER TABLE `comment` ENABLE KEYS */;
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
