import { axios } from './axios';
let { hostname, port } = window.location;
let system_id = 0;
switch (parseInt(port, 10)) {
  // 工艺质量管理平台
  case 90:
    system_id = 0;
    break;
  // 党支部
  case 71:
  case 8080:
    system_id = 1;
    break;
  default:
    system_id = 99;
    break;
}

export let sys_id = system_id;
/**
 *   @database: { 工艺质量管理 }
 *   @desc:     { 文章类别列表 }
 */
export const getCateList = (sys_type_id = sys_id) =>
  axios({
    url: '/314/d36c7f1ade.json',
    params: {
      sys_type_id
    }
  });

/**
 *   @database: { 质量信息系统 }
 *   @desc:     { 印钞品种列表 }
 */
export const getProductdata = () =>
  axios({
    url: '/71/0fff65bc40.json'
  });

/**
 *   @database: { 质量信息系统 }
 *   @desc:     { 印钞设备列表 }
 */
export const getMachinedata = (p) =>
  axios({
    url: '/315/4b7428141a.array',
    params: {
      p
    }
  });

/** 数据量较大时建议使用post模式：
*
*   @database: { 工艺质量管理 }
*   @desc:     { 新增文章 }
    const { uid, rec_time, attach_list, prod, proc, machine, operator, cartno, cate_id, content, title, receiver, remark, reward, reward_status, reward_user, status_username } = params;
*/
export const addArticle = (params) =>
  axios({
    method: 'post',
    data: {
      ...params,
      id: 316,
      nonce: '523c5e087b'
    }
  });

/**
*   @database: { 工艺质量管理 }
*   @desc:     { 更新附件id信息 }
    const { article_id, _id } = params;
*/
export const setArticleAttach = (params) =>
  axios({
    url: '/317/e48847dce3.json',
    params
  });

/**
*   @database: { 接口管理 }
*   @desc:     { RTX消息推送代理 }
    const { delaytime, title, msg, receiver } = params;
*/
export const proxy1082111 = (params) =>
  axios({
    url: '/319/b804147c6e.json',
    params
  });

/**
*   @database: { 工艺质量管理 }
*   @desc:     { 添加评论 }
    const { rec_time, content, article_id, username, uid, useravatar } = params;
*/
export const addArticleComment = (params) =>
  axios({
    url: '/320/7bdb354d30.json',
    params
  });

/**
 *   @database: { 工艺质量管理 }
 *   @desc:     { 删除评论 }
 */
export const delArticleComment = (comment_id) =>
  axios({
    url: '/321/8c7c57cc9e.json',
    params: {
      comment_id
    }
  });

/**
*   @database: { 工艺质量管理 }
*   @desc:     { 更新文章 }
	以下参数在建立过程中与系统保留字段冲突，已自动替换:
	@id:_id. 参数说明：api 索引序号
    const { attach_list, prod, [proc], machine, operator, cartno, content, title, receiver, remark, reward_user, readnum, commentnum, read_users, cate_id, _id } = params;
*/
export const setArticle = (params) =>
  axios({
    url: '/322/f6f8711acf.json',
    params
  });

/**
*   @database: { 工艺质量管理 }
*   @desc:     { 更新阅读状态 }
	以下参数在建立过程中与系统保留字段冲突，已自动替换:
	@id:_id. 参数说明：api 索引序号
    const { status, status_username, status_rectime, remark, _id } = params;
*/
export const setArticleStatus = (params) =>
  axios({
    url: '/323/5d0c90b2e3.json',
    params
  });
