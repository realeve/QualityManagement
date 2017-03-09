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

Date: 2017-03-09 21:47:41
*/


-- ----------------------------
-- Table structure for tbl_article_comment
-- ----------------------------
DROP TABLE [dbo].[tbl_article_comment]
GO
CREATE TABLE [dbo].[tbl_article_comment] (
[comment_id] int NOT NULL IDENTITY(1,1) ,
[article_id] int NULL ,
[uid] int NULL ,
[username] varchar(255) NULL ,
[rec_time] datetime2(7) NULL ,
[useravatar] varchar(255) NULL ,
[content] varchar(MAX) NULL 
)


GO
DBCC CHECKIDENT(N'[dbo].[tbl_article_comment]', RESEED, 12)
GO

-- ----------------------------
-- Indexes structure for table tbl_article_comment
-- ----------------------------

-- ----------------------------
-- Primary Key structure for table tbl_article_comment
-- ----------------------------
ALTER TABLE [dbo].[tbl_article_comment] ADD PRIMARY KEY ([comment_id])
GO
