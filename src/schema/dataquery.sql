-- 新闻列表
SELECT top 5 a.id,a.title,isnull(b.fullName,'无') as 'user',convert(varchar,a.rec_time,120) as datetime,b.set_avatar avatar,cast(b.id as varchar)+rtrim(b.UserName) as avatarkey FROM dbo.tbl_article AS a left join tblUser b on a.uid = b.id where category=? order by rec_time desc

-- listid

--文章详情
SELECT a.*,isnull(b.fullName, '无') AS 'user',convert(varchar,rec_time,120) datetime FROM	dbo.tbl_article AS a LEFT JOIN tblUser b ON a.uid = b.id WHERE a.id=21
--aid