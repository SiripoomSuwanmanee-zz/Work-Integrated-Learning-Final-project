-- phpMyAdmin SQL Dump
-- version 4.6.5.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Dec 13, 2018 at 07:21 AM
-- Server version: 10.1.21-MariaDB
-- PHP Version: 5.6.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mkm`
--

-- --------------------------------------------------------

--
-- Table structure for table `tb_admin`
--

CREATE TABLE `tb_admin` (
  `ad_user` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  `ad_pass` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=COMPACT;

--
-- Dumping data for table `tb_admin`
--

INSERT INTO `tb_admin` (`ad_user`, `ad_pass`) VALUES
('admin', '$2b$10$okJou3nx/I6rz4swA3qZGuj4g6EuNytaMIYSFs5cqbyASaM367IJe');

-- --------------------------------------------------------

--
-- Table structure for table `tb_artifact`
--

CREATE TABLE `tb_artifact` (
  `ar_id` int(11) NOT NULL,
  `ar_number` varchar(10) COLLATE utf8_unicode_ci NOT NULL,
  `ar_image` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `ar_th_name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `ar_en_name` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `ar_th_detail` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `ar_en_detail` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `ar_year` int(4) NOT NULL,
  `cab_id` int(11) NOT NULL,
  `type_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=COMPACT;

--
-- Dumping data for table `tb_artifact`
--

INSERT INTO `tb_artifact` (`ar_id`, `ar_number`, `ar_image`, `ar_th_name`, `ar_en_name`, `ar_th_detail`, `ar_en_detail`, `ar_year`, `cab_id`, `type_id`) VALUES
(1, 'awew', '1544674459216_Screen Shot 2561-09-14 at 3.11.59 PM.png', 'มองตำข้าว', 'Rice', 'มองตำข้าวที่ใช้สำหรับตำข้าว', 'detail', 234, 1, 2),
(2, '50-0009', 'Artifact02.jpg', 'คุตีข้าว(1)', NULL, 'คุที่ใช้สำหรับตีข้าว', NULL, 2550, 1, 2),
(3, '51-0006', 'Artifact03.jpg', 'เรือ', NULL, 'เรื่อไม้ที่ใช้เป็นพาหนะ', NULL, 51, 1, 2),
(4, '51-0008', 'Artifact04.jpg', 'คุตีข้าว(2)', NULL, 'คุสำหรับตีข้าว', NULL, 51, 1, 2),
(5, '50-0001', 'Artifact05.jpg', 'เกวียน', NULL, 'เกวียนที่ใช้เป็นพาหนะทางบก', NULL, 50, 1, 2),
(6, '52-0001', 'Artifact06.jpg', 'คุตีข้าว(3)', NULL, 'คุตีข้าวที่ใช้สำหรับตีข้าว', NULL, 52, 1, 2),
(7, '60-0006', 'Artifact07.jpg', 'ครกไม้(2)', NULL, 'ครกไม้ขนาดใหญ่', NULL, 60, 1, 2),
(8, '60-0008', 'Artifact08.jpg', 'ไม้ตีพริกของชาวอาข่า', NULL, 'ไม่ที่ใช้สำหรับตีพริกของชาวอาข่า', NULL, 60, 1, 2),
(11, '53-0059', 'Artifact11.jpg', 'ถังเมี่ยง', NULL, 'ถังเมี่ยงที่ทำจากไม้', NULL, 53, 1, 2),
(12, '60-0007', 'Artifact12.jpg', 'ครกไม้(3)', NULL, 'ครกที่ทำจากไม้', NULL, 60, 1, 2),
(13, '60-0001', 'Artifact13.jpg', 'จานเซรามิก(สมเด็จพระเทพรัตนราชสุดาฯ สยามบรมราชกุมารีทรงลงพระนามาภิไธย)', 'null', 'จานเซรามิกที่สมเด็จพระเทพรัตนราชสุดาฯ สยามบรมราชกุมารีทรงลงพระนามาภิไธย', 'null', 60, 2, 6),
(14, '60-0002', 'Artifact14.png', 'จานเซรามิก', 'null', 'จานที่ทำจากเซรามิก', 'null', 60, 2, 6),
(15, '52-0072', 'Artifact15.png', 'รถสามล้อ(1)', 'null', 'รถสามล้อเป็นยานพาหนะที่ใช้ทางบก', 'null', 52, 2, 5),
(16, '60-0004', 'Artifact16.png', 'จักรยาน(1)', 'null', 'จักรยานที่ใช้เป็นยานพาหนะทางบก', 'null', 60, 2, 5),
(17, '60-0005', 'Artifact17.png', 'จักรยาน(2)', 'null', 'จักรยานที่ใช้เป็นยานพาหนะทางบก', 'null', 60, 2, 5),
(18, 'aw', '1544674377731_38dab2920e91a2f2f867a64b8450676c.jpg', 'aweawe', '', 'aweaw', '', 34, 2, 1);

-- --------------------------------------------------------

--
-- Table structure for table `tb_cabinet`
--

CREATE TABLE `tb_cabinet` (
  `cab_id` int(11) NOT NULL,
  `cab_number` varchar(10) COLLATE utf8_unicode_ci NOT NULL,
  `cab_image` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `cab_en_detail` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `cab_th_detail` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `cab_active_flag` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=COMPACT;

--
-- Dumping data for table `tb_cabinet`
--

INSERT INTO `tb_cabinet` (`cab_id`, `cab_number`, `cab_image`, `cab_en_detail`, `cab_th_detail`, `cab_active_flag`) VALUES
(1, '1', 'cabinet1.jpg', 'English cabinet', 'ตู้เก็บของ', 1),
(2, '2', 'cabinet2.jpg', 'Cabinet2', 'ตู้หมายเลข2', 0),
(101, '123', '1544080067942_38dab2920e91a2f2f867a64b8450676c.jpg', 'asd', 'awe', 1),
(102, 'rdgdr', '1544079941705_38dab2920e91a2f2f867a64b8450676c.jpg', 'drg', 'gdrgdrg', 1),
(103, 'พะ', '1544080112921_38dab2920e91a2f2f867a64b8450676c.jpg', '', 'ำหพะำหพะ', 1),
(104, 'awer', '1544080652487_Screen Shot 2561-10-12 at 2.35.24 PM.png', '', 'ewr', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tb_qrcode`
--

CREATE TABLE `tb_qrcode` (
  `qr_id` int(11) NOT NULL,
  `qr_name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `qr_url` varchar(255) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `tb_qrcode`
--

INSERT INTO `tb_qrcode` (`qr_id`, `qr_name`, `qr_url`) VALUES
(1, 'แบบฟอร์มประเมิน2', 'https://docs.google.com/forms/s');

-- --------------------------------------------------------

--
-- Table structure for table `tb_type`
--

CREATE TABLE `tb_type` (
  `type_id` int(11) NOT NULL,
  `type_number` char(2) COLLATE utf8_unicode_ci NOT NULL,
  `type_en_name` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `type_th_name` varchar(100) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=COMPACT;

--
-- Dumping data for table `tb_type`
--

INSERT INTO `tb_type` (`type_id`, `type_number`, `type_en_name`, `type_th_name`) VALUES
(1, '02', 'Cloth', 'ผ้า'),
(2, '06', 'Wood', 'ไม้'),
(3, '09', 'Silver', 'เงิน'),
(4, '11', 'brass', 'ทองเหลือง'),
(5, '12', 'Iron', 'เหล็ก'),
(6, '14', 'Ceramic', 'เซรามิก');

-- --------------------------------------------------------

--
-- Table structure for table `tb_visit_log`
--

CREATE TABLE `tb_visit_log` (
  `visit_date_time` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=COMPACT;

--
-- Dumping data for table `tb_visit_log`
--

INSERT INTO `tb_visit_log` (`visit_date_time`) VALUES
('2018-01-19 03:14:07'),
('2018-11-06 13:10:21'),
('2018-11-06 13:15:30'),
('2018-11-06 13:20:02'),
('2018-11-07 10:10:21'),
('2018-11-07 09:10:21'),
('2018-11-08 09:30:21'),
('2019-01-16 00:00:00'),
('2017-12-06 00:00:00'),
('2019-01-11 00:00:00'),
('2018-12-21 00:00:00'),
('2018-12-06 09:37:32'),
('2018-12-06 09:52:22'),
('2018-12-13 09:58:46'),
('2018-12-13 10:08:40'),
('2018-12-13 10:09:12');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tb_admin`
--
ALTER TABLE `tb_admin`
  ADD PRIMARY KEY (`ad_user`);

--
-- Indexes for table `tb_artifact`
--
ALTER TABLE `tb_artifact`
  ADD PRIMARY KEY (`ar_id`),
  ADD KEY `cab_number` (`cab_id`),
  ADD KEY `type_number` (`type_id`);

--
-- Indexes for table `tb_cabinet`
--
ALTER TABLE `tb_cabinet`
  ADD PRIMARY KEY (`cab_id`);

--
-- Indexes for table `tb_qrcode`
--
ALTER TABLE `tb_qrcode`
  ADD PRIMARY KEY (`qr_id`);

--
-- Indexes for table `tb_type`
--
ALTER TABLE `tb_type`
  ADD PRIMARY KEY (`type_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tb_artifact`
--
ALTER TABLE `tb_artifact`
  MODIFY `ar_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;
--
-- AUTO_INCREMENT for table `tb_cabinet`
--
ALTER TABLE `tb_cabinet`
  MODIFY `cab_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=105;
--
-- AUTO_INCREMENT for table `tb_qrcode`
--
ALTER TABLE `tb_qrcode`
  MODIFY `qr_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `tb_type`
--
ALTER TABLE `tb_type`
  MODIFY `type_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `tb_artifact`
--
ALTER TABLE `tb_artifact`
  ADD CONSTRAINT `tb_artifact_ibfk_1` FOREIGN KEY (`cab_id`) REFERENCES `tb_cabinet` (`cab_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `tb_artifact_ibfk_2` FOREIGN KEY (`type_id`) REFERENCES `tb_type` (`type_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
