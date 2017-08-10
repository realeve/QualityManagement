SELECT
	a.id id,
	a.title 标题,
	a.prod 品种,
(case when a.[proc]= '' THEN
			'其它'
		ELSE
			a.[PROC]
		END
	) 工序,
	a.machine 机型,
	a.operator 处理人员,
	a.cartno 车号,
	a.category 问题分类,
	a.content 内容,
	(
		CASE
		WHEN a.status = 1 THEN
			'已关闭'
		ELSE
			'未关闭'
		END
	) 状态,
	CONVERT (VARCHAR, a.rec_time, 120) 记录时间,
	CONVERT (
		VARCHAR,
		a.status_rectime,
		120
	) 关闭时间,
	DATEDIFF(
		dd,
		rec_time,
		CASE
	WHEN a.status = 1 THEN
		status_rectime
	ELSE
		getdate()
	END
	) 持续天数,
	a.status_username 关闭人,
	b.fullname 发起人,
	a.reward 奖励金额,
	(
		CASE
		WHEN a.reward_status = 0 THEN
			'申请中'
		WHEN a.reward_status = 1 THEN
			'一审通过'
		WHEN a.reward_status = 2 THEN
			'终审通过'
		ELSE
			'未通过'
		END
	) 奖励状态,
	CONVERT (VARCHAR, a.rec_time, 112) 记录日期,
	a.remark 备注,
	b.set_avatar,
	CAST (b.id AS VARCHAR) + rtrim(b.username) avatarkey,
	readnum 阅读数,
	commentnum 评论数
FROM
	tbl_article a
INNER JOIN tblUser b ON a.uid = b.id