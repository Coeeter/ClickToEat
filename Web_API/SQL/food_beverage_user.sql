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
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(25) NOT NULL,
  `password` varchar(75) NOT NULL,
  `email` varchar(45) NOT NULL,
  `phoneNum` varchar(8) NOT NULL,
  `firstName` varchar(20) NOT NULL,
  `lastName` varchar(20) NOT NULL,
  `imagePath` varchar(255) DEFAULT NULL,
  `gender` char(1) NOT NULL,
  `address` varchar(45) NOT NULL,
  PRIMARY KEY (`_id`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  UNIQUE KEY `phoneNum_UNIQUE` (`phoneNum`)
) ENGINE=InnoDB AUTO_INCREMENT=377 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'JaneIsCool','$2b$10$pc5mxHEo4xZ88TBin3KeweqmcQ6pmJenogUbl/tZPY/V0lIlp5Y6m','janenew@gmail.com','94951321','Jane','Neo','16413072094881091948c6b80b65b9eef8c163f0ae42a.jpg','F','Example street 2'),(2,'Thomas','$2b$10$VfIbojPnShufTTGbhXYnUOv2IYHtUd7xWXHSiO1LANlUWYaVTOdZe','thomasissmart@gmail.com','85296374','Thomas','Tan','1641307250808d055d45e53415c48b4739faed0f51dbc.jpg','M','Example street 3'),(3,'Morten','$2b$10$t7ZS/2EWXhu2gtjq3AeS6OKFvreFg8fTfrV4oX/o4PugCRrOUySoa','morten@gmail.com','91549874','Morten','Hendriksen','1641307282251imageadfasdfasdfs.jpg','M','Example street 7'),(5,'AliceChan','$2b$10$gXGWCGAAHUQfSb5PDCuemexf4beRlUrAh/YDLAKarCOv0aPx9Swqi','alicechan@gmail.com','93252445','Alice','Chan',NULL,'F','Example street 21'),(242,'Coeeter','$2b$10$1LLhES3YUlFYgtNVYvqmieasWmtDryk6tVXWj1gIRMLueiFHf36Z.','nasrullah01n@gmail.com','91053224','Noorullah','Nasrullah','1643524410929anime-aesthetic-profile-luxury.jpg','M','Example street 42'),(334,'Harunosuke','$2b$10$6eXj/cdvcF1OYKH6SM8.6O2fg.a/hbu9uonnDaRnWGpbTBnT9EW4e','harunosuke@gmail.com','94384354','Harunosuke','Asakura','1642606670698jojo-anime-pfp-1.jpg','M','Example street 27');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
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
