import rtx from './rtx';
import { sys_id } from './db';

var host =
  process.env.NODE_ENV === 'development' ? '//localhost' : '//10.8.2.133';

// host = '//localhost';

var url = host + '/datainterface/api?ID=';

var rtxJmpLink = `//10.8.2.133:${sys_id === 0 ? 90 : 71}`;
var apiHost = 'http://10.8.1.25:100/api/';

export default {
  host,
  url,
  rtxJmpLink,
  uploadContent: host + '/upload',
  api: {
    // POST
    insert: host + '/DataInterface/insert',

    // UPDATE
    update: host + '/DataInterface/update',

    // DELETE (POST)
    delete: host + '/DataInterface/delete',

    // FILEUPLOAD (POST)
    fileUpload: host + '/upload/upload.php',

    // FILEDELETE (GET)
    fileDelete: host + '/upload/upload.php',

    // 主页模块
    articleHome: apiHost + '303/1dd06c4feb?sys_id=' + sys_id, // url + 402 + '&M=0',

    // 主页各模块Top5，无请求参数，一次加载完成
    articleTop5: apiHost + '299/bcdc7669bf?sys_id=' + sys_id, // url + 412 + '&M=0',

    myWorkList: apiHost + '297/cf86aaa28a?sys_id=' + sys_id, // url + 413 + '&M=0',

    myWorkListByPage: apiHost + '304/137aea8cd0?sys_id=' + sys_id, // url + 414 + '&M=0',
    workListAboutMe: apiHost + '356/751db37ab1?sys_id=' + sys_id,
    workListAboutMeByPage: apiHost + '357/4ad6aa3afb?sys_id=' + sys_id,
    // 文章详情
    articleDetail: apiHost + '298/2011115320?sys_id=' + sys_id, // apiHost+'298/2011115320',

    hot: apiHost + '497/310429690d?sys_id=' + sys_id,

    latest: apiHost + '498/c7b69d12ea?sys_id=' + sys_id,

    notice_id: apiHost + '499/21105b5f1a',

    // 文章评论
    commentDetail: apiHost + '300/3a4c83f64a', // url + 404 + '&M=0',

    // 文章列表详情
    articleList: apiHost + '305/decabfe0c7?sys_id=' + sys_id, // url + 405 + '&M=0',

    // 附件列表
    attachList: apiHost + '301/e7bf22591e', // url + 406 + '&M=0',

    // 媒体列表
    mediaList: apiHost + '306/136f90d1fd', // url + 407 + '&M=0',

    // 素材库载入更多:
    mediaLoadMore: apiHost + '307/3c7dd0e46e', // url + 408 + '&M=0&cache=10',

    // 登录模块-用户列表
    userList: apiHost + '308/2076a6d913', // url + 409 + '&M=0',

    // md5 encrypt
    md5: host + '/datainterface/md5',

    // login
    login: apiHost + '312/203b7261ef', // url + 165 + '&M=0',

    // search
    search: url + 410 + '&M=0', // 'http://localhost:90/api/63/1013f75c9c', // 不允许字符串拼接

    // rtxPush
    rtxPush: host + '/datainterface/rtxpush',

    readnum: apiHost + '311/39225a57a3', // url + 474 + '&M=3',
    commentnum: apiHost + '310/0f4099a412', // url + 475 + '&M=3'

    updateUserInfo: apiHost + '313/b951835b08'
  },
  rewardUsers: ['袁长虹', '张建军', '陈晶', '张楠岚', '赵洪新', '达时'],
  verifyUsers: ['袁长虹', '张楠岚', '赵洪新', '达时'],
  rtxInfo: rtx.rtxInfo
};
