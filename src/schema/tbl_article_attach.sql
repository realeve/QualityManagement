/*
Navicat SQL Server Data Transfer

Source Server         : MS SQL
Source Server Version : 105000
Source Host           : localhost:1433
Source Database       : QuaCenter
Source Schema         : dbo

Target Server Type    : SQL Server
Target Server Version : 105000
File Encoding         : 65001

Date: 2017-03-21 13:34:46
*/


-- ----------------------------
-- Table structure for tbl_article
-- ----------------------------
DROP TABLE [dbo].[tbl_article]
GO
CREATE TABLE [dbo].[tbl_article] (
[id] int NOT NULL IDENTITY(1,1) ,
[title] varchar(255) NULL ,
[prod] varchar(10) NULL ,
[proc] varchar(10) NULL ,
[machine] varchar(20) NULL ,
[operator] varchar(255) NULL ,
[cartno] varchar(10) NULL ,
[category] varchar(20) NULL ,
[content] varchar(MAX) NULL ,
[status] int NULL DEFAULT ((0)) ,
[uid] int NULL ,
[rec_time] datetime2(7) NULL ,
[attach_list] varchar(MAX) NULL ,
[status_username] varchar(20) NULL ,
[status_rectime] datetime2(7) NULL 
)


GO
DBCC CHECKIDENT(N'[dbo].[tbl_article]', RESEED, 81)
GO
