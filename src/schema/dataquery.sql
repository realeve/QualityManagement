-- 新闻列表
SELECT top 5 a.id,a.status,a.title,isnull(b.fullName,'无') as 'user',convert(varchar,a.rec_time,120) as datetime,b.set_avatar avatar,cast(b.id as varchar)+rtrim(b.UserName) as avatarkey FROM dbo.tbl_article AS a left join tblUser b on a.uid = b.id where category='?' order by rec_time desc

-- listid

--文章详情
SELECT a.*,isnull(b.fullName, '无') AS 'user',convert(varchar,rec_time,120) datetime FROM	dbo.tbl_article AS a LEFT JOIN tblUser b ON a.uid = b.id WHERE a.id=21
--aid


--评论列表
SELECT a.comment_id,a.uid,a.username,convert(varchar,a.rec_time,120) rec_time,a.useravatar,a.content FROM dbo.tbl_article_comment AS a where article_id=14 order by comment_id
--aid


--数据分页
SELECT top 10 a.id,a.status,a.title,isnull(b.fullName,'无') as 'user',convert(varchar,a.rec_time,120) as datetime,b.set_avatar avatar,cast(b.id as varchar)+rtrim(b.UserName) as avatarkey FROM tbl_article AS a left join tblUser b on a.uid = b.id where category ='机检月度工作计划' and a.id<'37' order by a.id desc


--附件列表
SELECT * FROM tbl_article_attach where id in ('23','24','25')
--attachid


--媒体库 by uid
	SELECT top 25 a.id,a.name,(case when substring(a.type,8,4)='webp' then 'image' when substring(a.type,1,5)='audio' then 'audio' when substring(a.type,1,5)='video' then 'video' else 'other' end) type,a.url,a.width,a.height FROM tbl_article_attach a where a.uid = ? and (case when substring(a.type,8,4)='webp' then 'image' when substring(a.type,1,5)='audio' then 'audio' when substring(a.type,1,5)='video' then 'video' else 'other' end)=? order by a.id desc
--uid,type

--媒体库载入更多
SELECT top 15 a.id,a.name,(case when substring(a.type,8,4)='webp' then 'image' when substring(a.type,1,5)='audio' then 'audio' when substring(a.type,1,5)='video' then 'video' else 'other' end) type,a.url,a.width,a.height FROM tbl_article_attach a where a.uid = ? and (case when substring(a.type,8,4)='webp' then 'image' when substring(a.type,1,5)='audio' then 'audio' when substring(a.type,1,5)='video' then 'video' else 'other' end)=? and id<? order by a.id desc
--uid,type,maxid

--用户列表
SELECT a.ID id,a.UserName name,a.FullName username,a.set_avatar avatar FROM tblUser a order by id

--文章搜索
SELECT a.id,a.status,a.title,isnull(b.fullName,'无') as 'user',convert(varchar,a.rec_time,120) as datetime,b.set_avatar avatar,cast(b.id as varchar)+rtrim(b.UserName) as avatarkey FROM dbo.tbl_article AS a left join tblUser b on a.uid = b.id where a.content LIKE ? order by a.id desc
--key