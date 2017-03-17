/*
Navicat SQL Server Data Transfer

Source Server         : MS SQLServer
Source Server Version : 105000
Source Host           : localhost:1433
Source Database       : QuaCenter
Source Schema         : dbo

Target Server Type    : SQL Server
Target Server Version : 105000
File Encoding         : 65001

Date: 2017-03-18 03:07:17
*/


-- ----------------------------
-- Table structure for tbl_article_attach
-- ----------------------------
DROP TABLE [dbo].[tbl_article_attach]
GO
CREATE TABLE [dbo].[tbl_article_attach] (
[id] int NOT NULL IDENTITY(1,1) ,
[name] varchar(255) NULL ,
[type] varchar(255) NULL ,
[url] varchar(MAX) NULL ,
[size] float(53) NULL ,
[rec_time] datetime2(7) NULL ,
[article_id] int NULL ,
[comment_id] int NULL ,
[uid] int NULL ,
[width] int NULL ,
[height] int NULL 
)


GO
DBCC CHECKIDENT(N'[dbo].[tbl_article_attach]', RESEED, 52)
GO
