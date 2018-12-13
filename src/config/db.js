import { axios } from './axios';

/**
 *   @database: { 工艺质量管理 }
 *   @desc:     { 文章类别列表 }
 */
export const getCateList = (sys_type_id = 0) =>
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
